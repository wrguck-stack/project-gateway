import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  foreignKey,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { Project } from "@/domain/model";
export const partners = pgTable("partners", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  configuration: jsonb("configuration").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const partnerMemberships = pgTable(
  "partner_memberships",
  {
    tenantId: text("tenant_id")
      .notNull()
      .references(() => partners.id),
    actorId: text("actor_id").notNull(),
    role: text("role").notNull(),
  },
  (t) => [primaryKey({ columns: [t.tenantId, t.actorId] })],
);
export const projects = pgTable(
  "projects",
  {
    id: text("id").notNull(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => partners.id),
    ownerId: text("owner_id").notNull(),
    partnerId: text("partner_id").references(() => partners.id),
    revision: integer("revision").notNull(),
    status: text("status").notNull(),
    snapshot: jsonb("snapshot").$type<Project>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.tenantId, t.id] }),
    check("positive_project_revision", sql`${t.revision} > 0`),
  ],
);
// Child records always reference the composite tenant/project identity.
function entity(name: string) {
  return pgTable(
    name,
    {
      id: text("id").notNull(),
      tenantId: text("tenant_id").notNull(),
      projectId: text("project_id").notNull(),
      version: integer("version").notNull().default(1),
      payload: jsonb("payload").notNull(),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (t) => [
      primaryKey({ columns: [t.tenantId, t.id] }),
      foreignKey({
        columns: [t.tenantId, t.projectId],
        foreignColumns: [projects.tenantId, projects.id],
      }),
      check(`${name}_positive_version`, sql`${t.version} > 0`),
    ],
  );
}
export const drafts = entity("drafts");
export const projectVersions = entity("project_versions");
export const properties = entity("properties");
export const contacts = entity("contacts");
export const energyProfiles = entity("energy_profiles");
export const projectGoals = entity("project_goals");
export const evidenceValues = entity("evidence_values");
export const documents = entity("documents");
export const documentVersions = entity("document_versions");
export const uploads = entity("uploads");
export const scoreResults = entity("score_results");
export const scoreFactorResults = entity("score_factor_results");
export const submissions = entity("submissions");
export const submissionItems = entity("submission_items");
export const partnerReviews = entity("partner_reviews");
export const infoRequests = entity("info_requests");
export const partnerDecisions = entity("partner_decisions");
export const statusEvents = entity("status_events");
export const consents = entity("consents");
export const auditLogs = entity("audit_logs");
export const idempotencyRequests = pgTable(
  "idempotency_requests",
  {
    tenantId: text("tenant_id").notNull(),
    actorId: text("actor_id").notNull(),
    projectId: text("project_id").notNull(),
    requestId: text("request_id").notNull(),
    fingerprint: text("fingerprint").notNull(),
    result: jsonb("result").notNull(),
  },
  (t) => [
    uniqueIndex("scoped_request_key").on(
      t.tenantId,
      t.actorId,
      t.projectId,
      t.requestId,
    ),
    foreignKey({
      columns: [t.tenantId, t.projectId],
      foreignColumns: [projects.tenantId, projects.id],
    }),
  ],
);
