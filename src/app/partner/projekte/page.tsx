import { Workspace } from "@/components/partner";
import { requireSession } from "@/server/session";
import { partnerProjects, safeProject } from "@/server/services";
export const dynamic = "force-dynamic";
export default async function Page() {
  const actor = await requireSession("PARTNER");
  return (
    <Workspace
      initial={(await partnerProjects.list(actor)).map((p) =>
        safeProject(p, actor),
      )}
    />
  );
}
