import { PipelineView } from "@/components/partner";
import { requireSession } from "@/server/session";
import { partnerProjects } from "@/server/services";
export const dynamic = "force-dynamic";
export default async function Page() {
  const actor = await requireSession("PARTNER");
  return <PipelineView projects={partnerProjects.list(actor)} />;
}
