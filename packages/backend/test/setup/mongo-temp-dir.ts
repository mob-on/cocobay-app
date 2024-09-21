import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = path.resolve("../mongo-test-data");

export const createTempDir = () => {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  return fs.mkdirSync(TEMP_DIR, { recursive: true });
};

export const deleteTempDir = () => {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
};
