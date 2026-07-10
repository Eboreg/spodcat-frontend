import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    stylistic: {
      braceStyle: "1tbs",
      indent: 2,
      quotes: "double",
      semi: true,
    },
    typescript: true,
    vue: true,
    perfectionist: true,
  }, {
    rules: {
      "antfu/curly": "warn",
      "antfu/if-newline": "off",
      "import/consistent-type-specifier-style": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "perfectionist/sort-imports": "warn",
      "perfectionist/sort-named-imports": "warn",
      "pnpm/yaml-enforce-settings": "off",
      "style/arrow-parens": "off",
      "style/brace-style": "warn",
      "style/max-len": ["warn", { code: 120, comments: 80 }],
      "style/member-delimiter-style": "off",
      "style/no-trailing-spaces": "warn",
      "style/operator-linebreak": "warn",
      "style/quote-props": ["warn", "as-needed"],
      "style/quotes": "warn",
      "style/semi": "warn",
      "ts/consistent-type-definitions": "off",
      "ts/no-use-before-define": ["error", { variables: false, functions: false, classes: false }],
      "unused-imports/no-unused-vars": "warn",
      "vue/define-macros-order": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  }),
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    name: "javascript-overrides",
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.json"],
    name: "json-overrides",
    rules: {
      "style/max-len": "off",
    },
  },
);
