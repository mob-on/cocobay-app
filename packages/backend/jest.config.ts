export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.module.(t|j)s",
    "!main.ts",
    "!main-api-bootstrap-config.ts",
    "!**/*.model.(t|j)s",
    "!test/**",
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50,
    },
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
