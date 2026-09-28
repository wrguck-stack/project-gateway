import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./services";
import type { Session } from "@/domain/model";
import { DomainError } from "@/domain/rules";
export async function getSession(
  role: "OWNER" | "PARTNER",
): Promise<Session | null> {
  const jar = await cookies();
  return await auth.resolve(
    jar.get(role === "PARTNER" ? "gateway_partner" : "gateway_owner")?.value,
  );
}
export async function requireSession(role: "OWNER" | "PARTNER") {
  const session = await getSession(role);
  if (!session || session.role !== role) {
    if (role === "PARTNER") redirect("/partner/login");
    throw new DomainError(
      "Diese Projektadresse benötigt die ursprüngliche Browsersitzung.",
      403,
    );
  }
  return session;
}
