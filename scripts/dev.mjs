// Keep the Next.js development server compatible with both Codespaces and
// the preview runner's standard --host/--strictPort arguments.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const args = process.argv.slice(2).flatMap((arg) => {
  if (arg === "--strictPort") return [];
  if (arg === "--host") return ["--hostname"];
  if (arg.startsWith("--host=")) return [`--hostname=${arg.slice(7)}`];
  return [arg];
});
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--webpack",
    "--hostname",
    "0.0.0.0",
    ...args,
  ],
  { stdio: "inherit", env: process.env },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
