import * as defaultJestConfig from "../jest.config";

export default {
  ...defaultJestConfig.default,
  ...{
    rootDir: "../",
    globalSetup: "./test/e2e/setup/global-start.ts",
    globalTeardown: "./test/e2e/setup/global-teardown.ts",
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
      "^test/(.*)$": "<rootDir>/test/$1",
    },
    collectCoverageFrom: [
      ...defaultJestConfig.default.collectCoverageFrom,
      "src/**/*.controller.(t|j)s",
    ],
    testRegex: "test/e2e/.*\\.e2e.spec\\.ts$",
  },
};
