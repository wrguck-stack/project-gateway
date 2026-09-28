import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/shell";
import { Check } from "@/components/check";
import { Review, Analysis } from "@/components/public-flow";
import { drafts, safeProject } from "@/server/services";
import { requireSession } from "@/server/session";
import { AccessError } from "@/components/access-error";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ draftId: string; step: string }>;
}) {
  const { draftId, step } = await params;
  try {
    const actor = await requireSession("OWNER");
    const p = safeProject(await drafts.get(draftId, actor), actor);
    const n = Number(step);
    if (
      !["analyse", "zusammenfassung"].includes(step) &&
      (!Number.isInteger(n) || n < 1 || n > 10)
    )
      notFound();
    return (
      <>
        <Header />
        {step === "analyse" ? (
          <Analysis initial={p} />
        ) : step === "zusammenfassung" ? (
          <Review project={p} />
        ) : (
          <Check initial={p} step={n} />
        )}
        <Footer />
      </>
    );
  } catch (e) {
    return <AccessError error={e} />;
  }
}
