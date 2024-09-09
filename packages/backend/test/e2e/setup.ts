import {
  INestApplication,
  Injectable,
  Module,
  ModuleMetadata,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel, TypegooseModule } from "nestjs-typegoose";
import { configureMainApiNestApp } from "src/main-api-bootstrap-config";
import { User } from "src/model/user.model";
import * as request from "supertest";
import TestAgent from "supertest/lib/agent";
import { setupMockDatabase } from "./fixtures/mongodb";

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

export const setupEndToEnd = async (
  metadata?: ModuleMetadata,
): Promise<Setup> => {
  try {
    const mockDb = await setupMockDatabase();

    @Module({
      imports: [
        TypegooseModule.forRoot(mockDb.uri),
        TypegooseModule.forFeature([User]),
      ],
      providers: [MockModels],
    })
    class MockModule {}

    if (!metadata) {
      metadata = {};
    }
    if (!metadata.imports) {
      metadata.imports = [];
    }
    metadata.imports.push(MockModule);

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
    process.exit(1);
  }
};
