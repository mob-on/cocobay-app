const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/svgMock.ts",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
});
