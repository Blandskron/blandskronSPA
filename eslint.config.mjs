import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      "test-results/**",
      "playwright-report/**",
      "docs/lighthouse/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["tests/**/*.mjs"],
    languageOptions: { globals: { document: "readonly" } },
  },
  { files: ["src/**/*.ts"], languageOptions: { globals: globals.browser } },
  {
    files: ["*.mjs", "scripts/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
];
