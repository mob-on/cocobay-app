import { faker } from "@faker-js/faker";
import {
  getModelToken,
  InjectModel,
  TypegooseModule,
} from "@m8a/nestjs-typegoose";
import {
  TypegooseClass,
  TypegooseClassWithOptions,
} from "@m8a/nestjs-typegoose/dist/typegoose-class.interface";
import {
  INestApplication,
  Injectable,
  Logger,
  Module,
  ModuleMetadata,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ReturnModelType } from "@typegoose/typegoose";
import { Model } from "mongoose";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
import { ExceptionMapper } from "src/common/database/exception-mapper";
import { MongoExceptionMapper } from "src/common/database/mongodb/mongo-exception-mapping";
import { configureMainApiNestApp } from "src/main-api-bootstrap-config";
import { User } from "src/user/model/user.model";
import { setupMockDatabase } from "./mongodb";

@Injectable()
export class MockModels {
  constructor(
    @InjectModel(User)
    public readonly userModel: ReturnModelType<typeof User>,
  ) {}
}

export interface TestControl {
  mockDb: { stop: <T extends Model<unknown>>(models: T[]) => Promise<void> };
  stop: () => Promise<void>;
}

export interface DBSetup {
  control: TestControl;
  module: TestingModule;
  models: {
    user: () => ReturnModelType<typeof User>;
  };
}

export interface ApiSetup extends DBSetup {
  app: INestApplication<unknown>;
  api: TestAgent;
}

/**
 * Gets a unique Model representation with an auto-generated suffix
 * to ensure parallel tests don't share the same collection name
 *
 * @param model The Typegoose model
 */
const getUniqueModel = <T extends TypegooseClass>(
  model: T,
): TypegooseClassWithOptions => {
  return {
    typegooseClass: model,
    schemaOptions: {
      collection: `${model.name}_${faker.string.alphanumeric(32)}`,
    },
  };
};

export const getDBMockModule = <T extends TypegooseClass>(
  modelDefinitions: T[],
  dbUri: string,
) => {
  @Module({
    imports: [
      TypegooseModule.forRoot(dbUri),
      TypegooseModule.forFeature(modelDefinitions.map(getUniqueModel)),
    ],
    providers: [MockModels],
  })
  class MockModule {}

  return MockModule;
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
    moduleMetadata.providers = [
      {
        provide: ExceptionMapper,
        useClass: MongoExceptionMapper,
      },
      ...(moduleMetadata.providers ?? []),
    ];

    moduleMetadata.imports = [
      getDBMockModule(modelDefinitions, mockDb.uri),
      ...(moduleMetadata.imports ?? []),
    ];

    const module = await Test.createTestingModule(moduleMetadata).compile();

    const models = [];
    for (const model of modelDefinitions) {
      models.push(module.get(getModelToken(model.name)));
    }

    let result: DBSetup | ApiSetup = {
      control: {
        mockDb,
        stop: () => mockDb.stop(models),
      },
      module,
      models: {
        user: () => module.get(MockModels).userModel,
      },
    };

    if (withApi) {
      const app = module.createNestApplication();
      configureMainApiNestApp(app);
      await app.init();
      const api = request(app.getHttpServer());

      result = { ...result, app, api };
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
