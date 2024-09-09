import * as defaultJestConfig from "../jest.config";

export default {
  ...defaultJestConfig.default,
  ...{
    rootDir: "../",
    globalSetup: "<rootDir>/test/e2e/setup/global-start.ts",
    globalTeardown: "<rootDir>/test/e2e/setup/global-teardown.ts",
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
      "^test/(.*)$": "<rootDir>/test/$1",
    },
    testRegex: ".*\\.e2e.spec\\.ts$",
  },
};
