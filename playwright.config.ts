import { defineConfig, devices } from "@playwright/test";
import { randomUUID } from "node:crypto";
const testDataDir =
  process.env.GATEWAY_E2E_DATA_DIR ?? `.gateway/e2e-${randomUUID()}`;
const port = Number(process.env.GATEWAY_E2E_PORT ?? 3000);
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    timezoneId: "Europe/Berlin",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      APP_MODE: "demo",
      GATEWAY_DATA_DIR: testDataDir,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
