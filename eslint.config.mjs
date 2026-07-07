import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    stylistic: true,
    typescript: true,
    vue: true,
  }, {
    rules: {
      "antfu/curly": "warn",
      "antfu/if-newline": "off",
      "import/consistent-type-specifier-style": "warn",
      "perfectionist/sort-imports": "warn",
      "perfectionist/sort-named-imports": "warn",
      "pnpm/yaml-enforce-settings": "off",
      "style/arrow-parens": "off",
      "style/brace-style": ["warn", "1tbs"],
      "style/member-delimiter-style": "off",
      "style/operator-linebreak": "warn",
      "style/quote-props": ["warn", "as-needed"],
      "style/quotes": ["warn", "double"],
      "style/semi": ["warn", "always"],
      "ts/consistent-type-definitions": "off",
      "ts/no-use-before-define": ["error", { variables: false, functions: false, classes: false }],
      "vue/define-macros-order": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  }),
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    name: "javascript-custom",
    rules: {
      "no-unused-vars": "warn",
    },
  },
);
