"use strict";

module.exports = {
    // extends: "recommended",
    extends: ["octane", "ember-template-lint-typed-templates:recommended"],
    rules: {
        "require-media-caption": false,
        "no-inline-styles": { allowDynamicStyles: true },
    },
    plugins: ["ember-template-lint-typed-templates"],
};
