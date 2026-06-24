module.exports = {
  apps: [
    {
      name: "Spodcat",
      port: "3000",
      exec_mode: "cluster",
      script: "./.output/server/index.mjs",
      env_development: {
        NODE_ENV: "development",
        NUXT_PUBLIC_BACKEND_HOST: "http://localhost:8000",
        NUXT_PUBLIC_FRONTEND_HOST: "http://localhost:3000",
      },
      env_production: {
        NODE_ENV: "production",
        NUXT_PUBLIC_BACKEND_HOST: "https://backend.podd.huseli.us",
        NUXT_PUBLIC_FRONTEND_HOST: "https://podd.huseli.us",
      },
    },
  ],
};
