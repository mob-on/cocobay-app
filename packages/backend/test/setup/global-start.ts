import { setupMockDatabase } from "./mongodb";

export default async () => {
  await setupMockDatabase(true);
};
