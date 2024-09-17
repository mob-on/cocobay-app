import * as defaultJestConfig from "../jest.config";

export default {
  ...defaultJestConfig.default,
  ...{
    rootDir: "../",
    collectCoverageFrom: [
      ...defaultJestConfig.default.collectCoverageFrom,
      "src/**/*.controller.(t|j)s",
    ],
    testRegex: "test/e2e/.*\\.e2e.spec\\.ts$",
  },
};
