module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.js", "**/*.js", "node_modules/", "dist/"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-import",
    "eslint-plugin-prettier",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // TypeScript rules
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
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

    // Other useful rules
    "no-console": "warn",
    "no-var": "error",
    "prefer-const": "error",
    "no-duplicate-imports": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
