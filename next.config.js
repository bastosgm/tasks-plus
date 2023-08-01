/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    GOOGLE_CLIENT_ID:
      "202120423543-ergfn7k8mf860p8dujpm4qsannhktom2.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    NEXTAUTH_URL: "http://localhost:3000/",
    JWT_SECRET: "211aea14993db6b4c23333b92eb94309",
  },
};

module.exports = nextConfig;
