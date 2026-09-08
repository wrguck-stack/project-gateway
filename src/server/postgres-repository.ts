import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { and, eq } from "drizzle-orm";
import {
  projects,
  projectVersions,
  statusEvents,
  idempotencyRequests,
} from "./schema";
import { authorize, DomainError, checkRevision } from "@/domain/rules";
import type { Project, Session } from "@/domain/model";
/** PostgreSQL persistence foundation; explicitly not selected by the demo/live adapter factory yet. */
export function createPostgresRepository(connectionString: string) {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);
  return {
    async get(id: string, session: Session) {
      const [row] = await db
        .select()
        .from(projects)
        .where(
          and(eq(projects.id, id), eq(projects.tenantId, session.tenantId)),
        );
      if (!row) throw new DomainError("Projekt nicht gefunden.", 404);
      authorize(row.snapshot, session);
      return row.snapshot;
    },
    async mutate(
      id: string,
      session: Session,
      expectedRevision: number,
      requestId: string,
      fingerprint: string,
      mutate: (p: Project) => Project,
    ) {
      return db.transaction(async (tx) => {
        const [row] = await tx
          .select()
          .from(projects)
          .where(
            and(eq(projects.id, id), eq(projects.tenantId, session.tenantId)),
          )
          .for("update");
        if (!row) throw new DomainError("Projekt nicht gefunden.", 404);
        authorize(row.snapshot, session);
        const [previous] = await tx
          .select()
          .from(idempotencyRequests)
          .where(
            and(
              eq(idempotencyRequests.tenantId, session.tenantId),
              eq(idempotencyRequests.actorId, session.actorId),
              eq(idempotencyRequests.projectId, id),
              eq(idempotencyRequests.requestId, requestId),
            ),
          );
        if (previous) {
          if (previous.fingerprint !== fingerprint)
            throw new DomainError(
              "Auftrags-ID mit anderen Eingaben belegt.",
              409,
            );
          return previous.result as Project;
        }
        checkRevision(row.snapshot, expectedRevision);
        const next = mutate(structuredClone(row.snapshot));
        if (
          next.revision !== expectedRevision + 1 ||
          next.id !== id ||
          next.tenantId !== session.tenantId
        )
          throw new DomainError("Ungültige Projektrevision.");
        await tx
          .update(projects)
          .set({
            snapshot: next,
            revision: next.revision,
            status: next.status,
            updatedAt: new Date(next.updatedAt),
          })
          .where(
            and(
              eq(projects.id, id),
              eq(projects.tenantId, session.tenantId),
              eq(projects.revision, expectedRevision),
            ),
          );
        await tx.insert(projectVersions).values({
          id: `${id}:${next.revision}`,
          tenantId: session.tenantId,
          projectId: id,
          version: next.revision,
          payload: next,
        });
        const oldEvents = new Set(row.snapshot.events.map((e) => e.eventId));
        for (const e of next.events.filter((e) => !oldEvents.has(e.eventId)))
          await tx.insert(statusEvents).values({
            id: e.eventId,
            tenantId: session.tenantId,
            projectId: id,
            version: next.revision,
            payload: e,
          });
        await tx.insert(idempotencyRequests).values({
          tenantId: session.tenantId,
          actorId: session.actorId,
          projectId: id,
          requestId,
          fingerprint,
          result: next,
        });
        return next;
      });
    },
    close: () => pool.end(),
  };
}
