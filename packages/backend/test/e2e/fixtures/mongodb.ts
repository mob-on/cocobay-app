import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

export const setupMockDatabase = async () => {
  const mongod = await MongoMemoryReplSet.create();
  await mongoose.connect(mongod.getUri());
  await mongod.waitUntilRunning();
  console.debug(`In-memory MongoDB server initialised at: ${mongod.getUri()}`);

  return {
    uri: mongod.getUri(),
    stop: async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
    },
  };
};
