/**
 * Type declarations for
 *    import config from 'podcast-frontend/config/environment'
 */
declare const config: {
    environment: string;
    modulePrefix: string;
    podModulePrefix: string;
    locationType: "history" | "hash" | "none";
    rootURL: string;
    APP: {
        BACKEND_HOST: string;
        API_URL_NAMESPACE: string;
    };
};

export default config;
