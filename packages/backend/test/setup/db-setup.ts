// import { getModelToken } from "@m8a/nestjs-typegoose";
// import { TypegooseClass } from "@m8a/nestjs-typegoose/dist/typegoose-class.interface";
// import { Logger, ModuleMetadata } from "@nestjs/common";
// import { Test } from "@nestjs/testing";
// import { ExceptionMapper } from "src/common/database/exception-mapper";
// import { MongoExceptionMapper } from "src/common/database/mongodb/mongo-exception-mapping";
// import { setupMockDatabase } from "./mongodb";
// import { DBSetup, getDBMockModule, MockModels } from "./setup";

// const log = new Logger("DBTestSetup");

// export const setupDb = async <T extends TypegooseClass>(
//   modelDefinitions: T[],
//   moduleMetadata?: ModuleMetadata,
// ): Promise<DBSetup> => {
//   try {
//     const mockDb = await setupMockDatabase();

//     if (!moduleMetadata) {
//       moduleMetadata = {};
//     }
//     moduleMetadata.providers = [
//       {
//         provide: ExceptionMapper,
//         useClass: MongoExceptionMapper,
//       },
//       ...(moduleMetadata.providers ?? []),
//     ];

//     moduleMetadata.imports = [
//       getDBMockModule(modelDefinitions, mockDb.uri),
//       ...(moduleMetadata.imports ?? []),
//     ];

//     const module = await Test.createTestingModule(moduleMetadata).compile();

//     const models = [];
//     for (const model of modelDefinitions) {
//       models.push(module.get(getModelToken(model.name)));
//     }

//     return {
//       control: {
//         mockDb,
//         stop: () => mockDb.stop(models),
//       },
//       module,
//       models: {
//         user: () => module.get(MockModels).userModel,
//       },
//     };
//   } catch (e: unknown) {
//     log.error(
//       "Unable to start DB environment in preparation for tests, check error details:",
//       e,
//     );
//   }
// };
