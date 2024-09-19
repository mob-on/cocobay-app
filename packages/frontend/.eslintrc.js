module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.js", "**/*.js", "node_modules/", "dist/"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    // TypeScript rules
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-inferrable-types": "off",

    // Import rules
    "import/order": [
      "error",
      {
        groups: [["builtin", "external", "internal"]],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],

    // Prettier integration
    "prettier/prettier": ["error", { endOfLine: "auto" }],

    // General best practices
    "no-console": "warn",
    "no-var": "error",
    "prefer-const": "error",
    "no-duplicate-imports": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // Ensure the resolver finds types as well as files
      },
    },
  },
};
