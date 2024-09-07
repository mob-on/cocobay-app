import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginNext from "@next/eslint-plugin-next";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintTsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: eslintTsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      "simple-import-sort": eslintPluginSimpleImportSort,
      next: eslintPluginNext,
    },
    rules: {
      // React & JSX
      "react/react-in-jsx-scope": "off", // Next.js doesn't need React in scope
      "react/prop-types": "off",
      "jsx-a11y/anchor-is-valid": "off", // Next.js' <Link> tag usage
      // Import sorting
      "simple-import-sort/imports": "error",
      "import/order": "off", // We use simple-import-sort instead
      "import/no-anonymous-default-export": "off", // This rule can be noisy in Next.js pages
      // Other rules
      "prettier/prettier": "error",
      "no-console": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
  eslintConfigPrettier,
];
