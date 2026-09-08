import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
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
