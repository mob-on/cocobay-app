import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { MockModels } from "../setup/setup";

export const setupMockDatabase = async (globalInit?: boolean) => {
  let mongod: MongoMemoryReplSet;
  if (globalInit) {
    mongod = await MongoMemoryReplSet.create();
    await mongod.waitUntilRunning();
    process.env.MONGODB_TEST_URI = mongod.getUri();
  }

  await mongoose.connect(process.env.MONGODB_TEST_URI);

  return {
    uri: process.env.MONGODB_TEST_URI,
    stop: async (models: MockModels) => {
      const dbDropCollections: Promise<any>[] = [];
      for (const key of Object.keys(models)) {
        dbDropCollections.push(
          mongoose.connection.dropCollection(models[key].collection.name),
        );
      }
      await Promise.all(dbDropCollections);
      await mongoose.connection.close();
    },
  };
};
