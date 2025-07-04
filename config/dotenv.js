/* eslint-env node */

"use strict";

const path = require("path");

module.exports = function (/* env */) {
    return {
        clientAllowedKeys: ["SSH_USERNAME", "SSH_HOST", "SSH_PATH", "SSH_DIST_PATH"],
        fastbootAllowedKeys: [],
        failOnMissingKey: false,
        path: path.join(path.dirname(__dirname), ".env"),
    };
};
