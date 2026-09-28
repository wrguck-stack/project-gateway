import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/shell";
import { Result, Submission, ReceiptView } from "@/components/public-flow";
import { drafts, canSubmit, safeProject } from "@/server/services";
import { requireSession } from "@/server/session";
import { partnerConfig } from "@/server/config";
import { AccessError } from "@/components/access-error";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; view: string }>;
}) {
  const { id, view } = await params;
  if (!["ergebnis", "einreichen", "eingereicht"].includes(view)) notFound();
  try {
    const actor = await requireSession("OWNER");
    const p = safeProject(await drafts.get(id, actor), actor);
    return (
      <>
        <Header />
        {view === "ergebnis" ? (
          <Result project={p} canSubmit={canSubmit(p)} />
        ) : view === "einreichen" ? (
          <Submission
            project={p}
            recipient={partnerConfig.name}
            allowed={canSubmit(p)}
          />
        ) : (
          <ReceiptView project={p} />
        )}
        <Footer />
      </>
    );
  } catch (e) {
    return <AccessError error={e} />;
  }
}
