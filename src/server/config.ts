import config from "../../gateway.config.json";
import { DomainError } from "@/domain/rules";
import { z } from "zod";
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

// Public operator details are supplied by the owner of this installation.
// They do not enable live submission, authentication or outbound messaging.
export function operatorContact() {
  const read = (name: string) => process.env[name]?.trim() || null;
  const emailValue = read("GATEWAY_CONTACT_EMAIL");
  const phoneValue = read("GATEWAY_CONTACT_PHONE");
  return {
    name: read("GATEWAY_OPERATOR_NAME"),
    person: read("GATEWAY_CONTACT_PERSON"),
    email:
      emailValue && z.email().safeParse(emailValue).success ? emailValue : null,
    phone:
      phoneValue &&
      /^\+?[\d ()/.-]{5,40}$/.test(phoneValue) &&
      phoneValue.replace(/\D/g, "").length >= 5
        ? phoneValue
        : null,
    address: (read("GATEWAY_OPERATOR_ADDRESS") ?? "")
      .split("|")
      .map((line) => line.trim())
      .filter(Boolean),
    representative: read("GATEWAY_OPERATOR_REPRESENTATIVE"),
    register: read("GATEWAY_OPERATOR_REGISTER"),
    vatId: read("GATEWAY_OPERATOR_VAT_ID"),
  };
}
