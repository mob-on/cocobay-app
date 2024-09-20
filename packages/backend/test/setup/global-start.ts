import { createTempDir } from "./mongo-temp-dir";
import { setupMockDatabase } from "./mongodb";

export default async () => {
  const tempDir = createTempDir();
  await setupMockDatabase(true, tempDir);
};
