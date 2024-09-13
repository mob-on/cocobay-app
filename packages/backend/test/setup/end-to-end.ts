// import { getModelToken } from "@m8a/nestjs-typegoose";
// import { TypegooseClass } from "@m8a/nestjs-typegoose/dist/typegoose-class.interface";
// import { Logger, ModuleMetadata } from "@nestjs/common";
// import { Test } from "@nestjs/testing";
// import * as request from "supertest";
// import { configureMainApiNestApp } from "src/main-api-bootstrap-config";
// import { setupMockDatabase } from "test/setup/mongodb";
// import { ApiSetup, getDBMockModule, MockModels } from "./setup";

// const log = new Logger("E2ETestSetup");

// export const setupEndToEnd = async <T extends TypegooseClass>(
//   modelDefinitions: T[],
//   metadata?: ModuleMetadata,
// ): Promise<ApiSetup> => {
//   try {
//     const mockDb = await setupMockDatabase();

//     if (!metadata) {
//       metadata = {};
//     }
//     metadata.imports = [
//       getDBMockModule(modelDefinitions, mockDb.uri),
//       ...metadata.imports,
//     ];

//     const module = await Test.createTestingModule(metadata).compile();
//     const app = module.createNestApplication();
//     configureMainApiNestApp(app);
//     await app.init();

//     const models = [];
//     for (const model of modelDefinitions) {
//       models.push(module.get(getModelToken(model.name)));
//     }

//     return {
//       control: {
//         mockDb,
//         stop: async () => {
//           await Promise.all([mockDb.stop(models), app.close()]);
//         },
//       },
//       app,
//       api: request(app.getHttpServer()),
//       models: {
//         user: () => module.get(MockModels).userModel,
//       },
//       module,
//     };
//   } catch (e: unknown) {
//     log.error(
//       "Unable to start e2e environment in preparation for integration tests, check error details:",
//       e,
//     );
//   }
// };
