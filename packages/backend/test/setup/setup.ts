import { faker } from "@faker-js/faker";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import {
  TypegooseClass,
  TypegooseClassWithOptions,
} from "@m8a/nestjs-typegoose/dist/typegoose-class.interface";
import {
  INestApplication,
  Logger,
  Module,
  ModuleMetadata,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { getModelForClass } from "@typegoose/typegoose";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
import configuration from "@config/configuration";
import { FeatureModule } from "src/common/feature-flags/feature-flag.module";
import { configureMainApiNestApp } from "src/main-api-bootstrap-config";
import { setupMockDatabase } from "./mongodb";

export interface DBSetup {
  stop: () => Promise<void>;
  clearModels: () => Promise<void>;
  module: TestingModule;
}

export interface ApiSetup extends DBSetup {
  app: INestApplication<unknown>;
  api: TestAgent;
}

//#TEST_SETUP_GLOBAL_MODULES
const globalModules = [
  ConfigModule.forRoot({
    load: [configuration],
    cache: true,
    isGlobal: true,
  }),
  { module: FeatureModule, global: true },
];

/**
 * Gets a unique Model representation with an auto-generated suffix
 * to ensure parallel tests don't share the same collection name
 *
 * @template T - The type of the model.
 * @param {T} model - The model to retrieve.
 * @returns {TypegooseClassWithOptions} - The unique model with schema options.
 */
const getUniqueModel = <T extends TypegooseClass | TypegooseClassWithOptions>(
  model: T,
): TypegooseClassWithOptions => {
  let typegooseClass;
  if (model.hasOwnProperty("typegooseClass")) {
    ({ typegooseClass } = model as TypegooseClassWithOptions);
  } else {
    typegooseClass = model;
  }

  return {
    typegooseClass: typegooseClass,
    schemaOptions: {
      collection: `${typegooseClass.name}_${faker.string.alphanumeric(32)}`,
    },
  };
};

const log = new Logger("TestSetup");

const setupNest = async <T extends TypegooseClass>(
  modelDefinitions: T[],
  moduleMetadata: ModuleMetadata = {},
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
  withApi = false,
): Promise<DBSetup | ApiSetup> => {
  try {
    const mockDb = await setupMockDatabase();

    moduleMetadata.imports = [
      TypegooseModule.forRoot(mockDb.uri),
      ...globalModules, //Mimic global imports in app.modules
      ...(moduleMetadata.imports ?? []),
    ];

    //We need to wrap the test module in another module to allow configureMainApiNestApp to use "useContainer" from class-validator
    @Module({
      ...moduleMetadata,
    })
    class RootModule {}

    const creatingTestModule = Test.createTestingModule({
      imports: [RootModule],
    });

    //Typegoose name overrides
    let moduleBeforeCompilation =
      modelDefinitions?.reduce((testModule, model) => {
        return testModule
          .overrideModule(TypegooseModule.forFeature([model]))
          .useModule(TypegooseModule.forFeature([getUniqueModel(model)]));
      }, creatingTestModule) || creatingTestModule;

    if (moduleBuilder) {
      moduleBeforeCompilation = moduleBuilder(moduleBeforeCompilation);
    }

    const module = await moduleBeforeCompilation.compile();

    const models = [];
    if (modelDefinitions) {
      for (const model of modelDefinitions) {
        models.push(getModelForClass(model));
      }
    }

    let result: DBSetup | ApiSetup = {
      module,
      clearModels: async () => {
        await Promise.all(models.map((m) => m.deleteMany({})));
      },
      stop: async () => {
        await mockDb.stop();
        await module.close();
      },
    };

    if (withApi) {
      const app = module.createNestApplication();
      configureMainApiNestApp(app, RootModule);
      await app.init();
      const api = request(app.getHttpServer());

      result = {
        ...result,
        app,
        api,
        stop: async () => {
          await Promise.all([mockDb.stop(), app.close()]);
        },
      };
    }

    return result;
  } catch (e: unknown) {
    log.error(
      "Unable to start environment in preparation for tests, error details:",
      e,
    );
  }
};

export const setupDb = async <T extends TypegooseClass>(
  modelDefinitions?: T[],
  moduleMetadata?: ModuleMetadata,
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<DBSetup> => {
  return setupNest(modelDefinitions, moduleMetadata, moduleBuilder, false);
};

export const setupApi = async <T extends TypegooseClass>(
  modelDefinitions?: T[],
  moduleMetadata?: ModuleMetadata,
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<ApiSetup> => {
  return setupNest(
    modelDefinitions,
    moduleMetadata,
    moduleBuilder,
    true,
  ) as Promise<ApiSetup>;
};
