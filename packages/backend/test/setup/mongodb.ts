import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose, { Model } from "mongoose";

export const setupMockDatabase = async (
  globalInit?: boolean,
  tempDir?: string,
) => {
  let mongod: MongoMemoryReplSet;
  if (globalInit) {
    mongod = await MongoMemoryReplSet.create({
      instanceOpts: [
        {
          dbPath: tempDir,
        },
      ],
    });
    await mongod.waitUntilRunning();
    process.env.MONGODB_TEST_URI = mongod.getUri();
  }

  await mongoose.connect(process.env.MONGODB_TEST_URI);

  return {
    uri: process.env.MONGODB_TEST_URI,
    clearCollections: async <T extends Model<unknown>>(models: T[]) => {
      const dbDropCollections: Promise<unknown>[] = [];
      for (const model of models) {
        dbDropCollections.push(mongoose.connection.dropCollection(model.name));
      }
      await Promise.all(dbDropCollections);
    },
    stop: async () => {
      await mongoose.connection.close();
    },
  };
};
