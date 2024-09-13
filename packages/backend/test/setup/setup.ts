import { faker } from "@faker-js/faker";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import {
  TypegooseClass,
  TypegooseClassWithOptions,
} from "@m8a/nestjs-typegoose/dist/typegoose-class.interface";
import { INestApplication, Logger, ModuleMetadata } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelForClass } from "@typegoose/typegoose";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
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
  moduleMetadata?: ModuleMetadata,
  withApi = false,
): Promise<DBSetup | ApiSetup> => {
  try {
    const mockDb = await setupMockDatabase();

    if (!moduleMetadata) {
      moduleMetadata = {};
    }
    moduleMetadata.imports = [
      TypegooseModule.forRoot(mockDb.uri),
      ...(moduleMetadata.imports ?? []),
    ];

    const creatingTestModule = Test.createTestingModule(moduleMetadata);

    //Typegoose name overrides
    const module = await modelDefinitions
      .reduce((testModule, model) => {
        return testModule
          .overrideModule(TypegooseModule.forFeature([model]))
          .useModule(TypegooseModule.forFeature([getUniqueModel(model)]));
      }, creatingTestModule)
      .compile();

    const models = [];
    for (const model of modelDefinitions) {
      models.push(getModelForClass(model));
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
      configureMainApiNestApp(app);
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
): Promise<DBSetup> => {
  return setupNest(modelDefinitions, moduleMetadata, false);
};

export const setupApi = async <T extends TypegooseClass>(
  modelDefinitions?: T[],
  moduleMetadata?: ModuleMetadata,
): Promise<ApiSetup> => {
  return setupNest(modelDefinitions, moduleMetadata, true) as Promise<ApiSetup>;
};
