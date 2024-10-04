import { faker } from "@faker-js/faker";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import {
  INestApplication,
  Logger,
  Module,
  ModuleMetadata,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
import configuration from "@config/configuration";
import { configureMainApiNestApp } from "src/bootstrap-config";
import { FeatureModule } from "src/common/feature-flags/feature-flag.module";
import { setupMockDatabase } from "./mongodb";

export interface DBSetup {
  stop: () => Promise<void>;
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

const log = new Logger("TestSetup");

const setupNest = async (
  moduleMetadata: ModuleMetadata = {},
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
  withApi = false,
): Promise<DBSetup | ApiSetup> => {
  try {
    const mockDb = await setupMockDatabase();

    moduleMetadata.imports = [
      TypegooseModule.forRoot(mockDb.uri, {
        //Each test will have its own database in memory
        dbName: `test_${faker.string.alphanumeric(24)}`,
      }),
      ...globalModules, //Mimic global imports in app.modules
      ...(moduleMetadata.imports ?? []),
    ];

    //We need to wrap the test module in another module to allow configureMainApiNestApp to use "useContainer" from class-validator
    @Module({
      ...moduleMetadata,
    })
    class RootModule {}

    let moduleBeforeCompilation = Test.createTestingModule({
      imports: [RootModule],
    });

    if (moduleBuilder) {
      moduleBeforeCompilation = moduleBuilder(moduleBeforeCompilation);
    }

    const module = await moduleBeforeCompilation.compile();

    let result: DBSetup | ApiSetup = {
      module,
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

/**
 * Sets up the database for testing purposes.
 * Already includes the Config and Feature NestJS services.
 *
 * @param moduleMetadata - Optional metadata for the module.
 * @param moduleBuilder - Optional function to customize the module builder.
 * @returns A promise that resolves to an `ApiSetup` instance.
 */

export const setupDb = async (
  moduleMetadata?: ModuleMetadata,
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<DBSetup> => {
  return setupNest(moduleMetadata, moduleBuilder, false);
};

/**
 * Sets up the API and database for testing purposes.
 * Already includes the Config and Feature NestJS services.
 *
 * @param moduleMetadata - Optional metadata for the module.
 * @param moduleBuilder - Optional function to customize the module builder.
 * @returns A promise that resolves to an `ApiSetup` instance.
 */
export const setupApi = async (
  moduleMetadata?: ModuleMetadata,
  moduleBuilder?: (moduleBuilder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<ApiSetup> => {
  return setupNest(moduleMetadata, moduleBuilder, true) as Promise<ApiSetup>;
};
