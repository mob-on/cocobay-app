export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: "src/.*/.*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.(t|j)s",
    "!src/**/*.module.(t|j)s",
    "!src/main.ts",
    "!src/main-api-bootstrap-config.ts",
    "!src/**/*.model.(t|j)s",
    "!src/**/*.dto.(t|j)s",
    "!src/**/*.controller.(t|j)s",
    "!src/**/*.spec.(t|j)s",
  ],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
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