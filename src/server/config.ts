import config from "../../gateway.config.json";
import { DomainError } from "@/domain/rules";
export function appMode() {
  const mode = process.env.APP_MODE ?? config.mode;
  if (mode !== "demo" && mode !== "live")
    throw new DomainError("APP_MODE muss demo oder live sein.", 503);
  return mode;
}
export function requireDemo() {
  if (appMode() !== "demo")
    throw new DomainError(
      "Live-Integrationen sind noch nicht konfiguriert. Kein Demo-Fallback im Live-Modus.",
      503,
    );
}
export const partnerConfig = {
  id: config.demoPartnerId,
  name: config.demoPartnerName,
};
