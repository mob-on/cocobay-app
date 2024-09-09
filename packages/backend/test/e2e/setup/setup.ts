import { faker } from "@faker-js/faker";
import {
  INestApplication,
  Injectable,
  Module,
  ModuleMetadata,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel, TypegooseModule } from "nestjs-typegoose";
import {
  TypegooseClass,
  TypegooseClassWithOptions,
} from "nestjs-typegoose/dist/typegoose-class.interface";
import { configureMainApiNestApp } from "src/main-api-bootstrap-config";
import { User } from "src/model/user.model";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
import { setupMockDatabase } from "../fixtures/mongodb";

export interface TestControl {
  app: INestApplication<any>;
  mockDb: { stop: () => Promise<void> };
  stop: () => Promise<void>;
}

export interface Setup {
  control: TestControl;
  api: TestAgent;
  userModel: ReturnModelType<typeof User>;
}

@Injectable()
export class MockModels {
  constructor(
    @InjectModel(User)
    public readonly userModel: ReturnModelType<typeof User>,
  ) {}
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

export const setupEndToEnd = async (
  metadata?: ModuleMetadata,
): Promise<Setup> => {
  try {
    const mockDb = await setupMockDatabase();

    @Module({
      imports: [
        TypegooseModule.forRoot(mockDb.uri),
        TypegooseModule.forFeature([getUniqueModel(User)]),
      ],
      providers: [MockModels],
    })
    class MockModule {}

    if (!metadata) {
      metadata = {};
    }
    metadata.imports = [MockModule, ...metadata.imports];

    const moduleFixture = await Test.createTestingModule(metadata).compile();
    const app = moduleFixture.createNestApplication();
    configureMainApiNestApp(app);
    await app.init();

    const models = app.get(MockModels);

    return {
      control: {
        app,
        mockDb,
        stop: async () => {
          await Promise.all([mockDb.stop(), app.close()]);
        },
      },
      api: request(app.getHttpServer()),
      userModel: models.userModel,
    };
  } catch (e: unknown) {
    console.error(
      "Unable to start e2e environment in preparation for integration tests, check error details:",
      e,
    );
  }
};
