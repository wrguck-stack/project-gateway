import Link from "next/link";
import { Dossier } from "@/components/partner";
import { requireSession } from "@/server/session";
import { partnerProjects, safeProject } from "@/server/services";
import { DomainError } from "@/domain/rules";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  const actor = await requireSession("PARTNER");
  const { id } = await params;
  const { back } = await searchParams;
  try {
    const p = safeProject(await partnerProjects.get(id, actor), actor);
    return (
      <main id="main" className="wrap page">
        <Link
          className="text-link"
          href={`/partner/projekte${back ? "?" + new URLSearchParams(back).toString() : ""}`}
        >
          ← Zur Projektliste
        </Link>
        <Dossier project={p} />
      </main>
    );
  } catch (e) {
    if (!(e instanceof DomainError)) throw e;
    return (
      <main id="main" className="wrap page">
        <h1>Projekt nicht verfügbar.</h1>
        <p>{e.message}</p>
        <Link href="/partner/projekte">Zur berechtigten Projektliste</Link>
      </main>
    );
  }
}
