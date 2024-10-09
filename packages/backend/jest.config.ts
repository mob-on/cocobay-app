export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: "src/(.*/)?.*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  globalSetup: "./test/setup/global-start.ts",
  globalTeardown: "./test/setup/global-teardown.ts",
  collectCoverageFrom: [
    "src/**/*.(t|j)s",
    "!src/**/*.module.(t|j)s",
    "!src/main.ts",
    "!src/main-api-bootstrap-config.ts",
    "!src/**/*.model.(t|j)s",
    "!src/**/*.dto.(t|j)s",
    "!src/**/*.exception.(t|j)s",
    "!src/**/*.controller.(t|j)s",
    "!src/**/*.spec.(t|j)s",
  ],
  moduleNameMapper: {
    "@config/(.*)": "<rootDir>/config/$1",
    "^@(shared)/(.*/?)(src|test)/(.*)$": "<rootDir>../$1/$2/$3/$4",
    "^(.*/?)(src|test)/(.*)$": "<rootDir>/$1/$2/$3",
  },
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50,
    },
  },
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
