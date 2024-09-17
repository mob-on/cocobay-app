module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.js", "**/*.js", "node_modules/", "dist/"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
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
  env: {
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
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],

        "newlines-between": "never",
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
