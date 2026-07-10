import type { Config } from "stylelint";

export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-standard-vue/scss"],
  rules: {
    "at-rule-empty-line-before": null,
    "block-no-empty": [true, { severity: "warning" }],
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "custom-property-empty-line-before": null,
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["grid-template"] },
    ],
    "declaration-empty-line-before": null,
    "font-family-no-missing-generic-family-keyword": [
      true,
      {
        ignoreFontFamilies: ["Limelight-Regular"],
      },
    ],
    "no-empty-source": [true, { severity: "warning" }],
    "rule-empty-line-before": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/dollar-variable-empty-line-before": null,
    "scss/double-slash-comment-empty-line-before": null,
    "scss/no-global-function-names": null,
  },
} satisfies Config;
