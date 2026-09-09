import { afterEach, describe, expect, it, vi } from "vitest";
import { operatorContact } from "@/server/config";

afterEach(() => vi.unstubAllEnvs());

describe("Configured public operator contact", () => {
  it("does not infer an operator or recipient when details are missing", () => {
    for (const key of [
      "GATEWAY_OPERATOR_NAME",
      "GATEWAY_CONTACT_EMAIL",
      "GATEWAY_CONTACT_PHONE",
      "GATEWAY_CONTACT_PERSON",
      "GATEWAY_OPERATOR_ADDRESS",
    ])
      vi.stubEnv(key, "");
    expect(operatorContact()).toMatchObject({
      name: null,
      person: null,
      email: null,
      phone: null,
      address: [],
    });
  });

  it("only renders supplied values and rejects addresses unsuitable for contact links", () => {
    vi.stubEnv("GATEWAY_OPERATOR_NAME", " Beispielbetreiber ");
    vi.stubEnv(
      "GATEWAY_OPERATOR_ADDRESS",
      " Teststraße 1 | 12345 Beispielstadt | Deutschland ",
    );
    vi.stubEnv("GATEWAY_CONTACT_EMAIL", "kontakt@example.test");
    vi.stubEnv("GATEWAY_CONTACT_PHONE", "+49 123 456789");
    expect(operatorContact()).toMatchObject({
      name: "Beispielbetreiber",
      email: "kontakt@example.test",
      phone: "+49 123 456789",
      address: ["Teststraße 1", "12345 Beispielstadt", "Deutschland"],
    });
    vi.stubEnv(
      "GATEWAY_CONTACT_EMAIL",
      "kontakt@example.test?bcc=other@example.test",
    );
    for (const invalidPhone of ["javascript:alert(1)", ".....", "+49 ()/.-"]) {
      vi.stubEnv("GATEWAY_CONTACT_PHONE", invalidPhone);
      expect(operatorContact()).toMatchObject({ email: null, phone: null });
    }
  });
});
