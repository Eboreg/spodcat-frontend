import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default withNuxt(eslintConfigPrettier, {
  rules: {
    "vue/attributes-order": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "vue/no-v-html": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/multi-word-component-names": "off",
  },
});
