import type { NextConfig } from "next";
const config: NextConfig = {
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
