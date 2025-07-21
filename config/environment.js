"use strict";

module.exports = function (environment) {
    const ENV = {
        modulePrefix: "spodcat",
        environment,
        rootURL: "/",
        locationType: "history",
        EmberENV: {
            EXTEND_PROTOTYPES: false,
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
            },
        },
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
            API_URL_NAMESPACE: "",
            BACKEND_HOST: process.env.BACKEND_HOST_DEV,
            FRONTEND_HOST: process.env.FRONTEND_HOST_DEV,
            IS_SINGLETON: false,
            LOCALE: "en",
            SITE_NAME: process.env.SITE_NAME,
        },
        fastboot: {
            hostWhitelist: [/^localhost:\d+$/, ...(process.env.FASTBOOT_HOST_WHITELIST || "").split(",")].filter(
                (v) => v != "",
            ),
        },
    };

    if (environment === "development") {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === "test") {
        // Testem prefers this...
        ENV.locationType = "none";

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = "#ember-testing";
        ENV.APP.autoboot = false;
    }

    if (environment === "production") {
        ENV.APP.BACKEND_HOST = process.env.BACKEND_HOST_PROD;
        ENV.APP.FRONTEND_HOST = process.env.FRONTEND_HOST_PROD;
    }

    return ENV;
};
