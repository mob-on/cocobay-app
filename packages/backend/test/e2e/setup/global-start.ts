import { setupMockDatabase } from "../fixtures/mongodb";

export default async () => {
  await setupMockDatabase(true);
};
