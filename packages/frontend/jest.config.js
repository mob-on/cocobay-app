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
    "^@hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@api/(.*)$": "<rootDir>/hooks/api/$1",
    "^@contexts/(.*)$": "<rootDir>/contexts/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@lib/(.*)$": "<rootDir>/lib/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
});
