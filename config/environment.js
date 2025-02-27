"use strict";

module.exports = function (environment) {
    const ENV = {
        modulePrefix: "podcast-frontend",
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
            BACKEND_HOST: "http://localhost:8000",
            API_URL_NAMESPACE: "",
        },
        fastboot: {
            hostWhitelist: [/^localhost:\d+$/, "musikensmakt.huseli.us"],
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
        ENV.APP.BACKEND_HOST = "https://backend.musikensmakt.huseli.us";
    }

    return ENV;
};
