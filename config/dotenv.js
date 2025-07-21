/* eslint-env node */

"use strict";

const path = require("path");

module.exports = function (/* env */) {
    return {
        clientAllowedKeys: [
            "BACKEND_HOST_DEV",
            "BACKEND_HOST_PROD",
            "FASTBOOT_HOST_WHITELIST",
            "FRONTEND_HOST_DEV",
            "FRONTEND_HOST_PROD",
            "SITE_NAME",
            "SSH_DIST_PATH",
            "SSH_HOST",
            "SSH_PATH",
            "SSH_USERNAME",
        ],
        fastbootAllowedKeys: [],
        failOnMissingKey: false,
        path: path.join(path.dirname(__dirname), ".env"),
    };
};
