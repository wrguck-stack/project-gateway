import type { NextConfig } from "next";
// netlify.toml variables are build-scoped. Bake only these non-secret routing
// settings into Netlify artifacts; Blobs credentials always stay runtime-only.
const netlifyEnvironment =
  process.env.NETLIFY === "true"
    ? {
        GATEWAY_STORAGE: "netlify-blobs",
        GATEWAY_DEPLOY_CONTEXT: process.env.CONTEXT ?? "deploy-preview",
        GATEWAY_BLOBS_NAMESPACE: "project-gateway-demo-v1",
        GATEWAY_DEPLOY_KEY:
          process.env.REVIEW_ID ??
          process.env.BRANCH ??
          process.env.DEPLOY_ID ??
          "preview",
      }
    : undefined;
const config: NextConfig = {
  ...(netlifyEnvironment ? { env: netlifyEnvironment } : {}),
  poweredByHeader: false,
  allowedDevOrigins: [
    "127.0.0.1",
    ...(process.env.CODESPACE_NAME
      ? [
          `${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "app.github.dev"}`,
        ]
      : []),
  ],
  outputFileTracingExcludes: {
    "*": [
      "./*.pdf",
      "./0*.md",
      "./03_ANALYTICS_FULL.md",
      "./docs/**",
      "./.gateway/**",
      "./.git/**",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), geolocation=(), microphone=()",
          },
        ],
      },
    ];
  },
};
export default config;
