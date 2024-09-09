import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

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
    stop: async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    },
  };
};
