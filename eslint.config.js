import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslintPlugin from "@typescript-eslint/eslint-plugin"
import tseslintParser from "@typescript-eslint/parser"

export default tseslint.config(
  { ignores: ["dist"] },

  {
    // extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}", "**/*.{js,jsx}"],
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslintPlugin,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // "@typescript-eslint/ no-unused-vars": "off",
      "@typescript-eslint/ no-empty-object-type": "off",
      "@typescript-eslint/ no-explicit-any": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
)
