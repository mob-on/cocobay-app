import { MongoClient } from "mongodb";
import { deleteTempDir } from "./mongo-temp-dir";

export default async () => {
  const client = await MongoClient.connect(process.env.MONGODB_TEST_URI);

  await new Promise<boolean>((resolve) => {
    const adminDb = client.db("admin");
    //Shutdown command will fail due to an unexpected socket disconnection,
    //therefore we need to do this promise resolution and process.exit to not leave open handles
    adminDb
      .command({
        shutdown: 1,
        force: true,
        timeoutSecs: 1,
      })
      .catch(() => resolve(false))
      .finally(() => {
        resolve(true);
        deleteTempDir();
        process.exit(0);
      });
  });
};
