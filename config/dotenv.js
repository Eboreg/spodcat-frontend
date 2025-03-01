/* eslint-env node */

"use strict";

const path = require("path");

module.exports = function (/* env */) {
    return {
        clientAllowedKeys: ["SCP_USERNAME", "SCP_HOST", "SCP_PATH"],
        fastbootAllowedKeys: [],
        failOnMissingKey: false,
        path: path.join(path.dirname(__dirname), ".env"),
    };
};
