CREATE TABLE "audit_logs" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_logs_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "audit_logs_positive_version" CHECK ("audit_logs"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consents_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "consents_positive_version" CHECK ("consents"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "contacts_positive_version" CHECK ("contacts"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_versions_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "document_versions_positive_version" CHECK ("document_versions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "documents_positive_version" CHECK ("documents"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "drafts" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drafts_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "drafts_positive_version" CHECK ("drafts"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "energy_profiles" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "energy_profiles_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "energy_profiles_positive_version" CHECK ("energy_profiles"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "evidence_values" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "evidence_values_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "evidence_values_positive_version" CHECK ("evidence_values"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "idempotency_requests" (
	"tenant_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"project_id" text NOT NULL,
	"request_id" text NOT NULL,
	"fingerprint" text NOT NULL,
	"result" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "info_requests" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "info_requests_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "info_requests_positive_version" CHECK ("info_requests"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "partner_decisions" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partner_decisions_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "partner_decisions_positive_version" CHECK ("partner_decisions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "partner_memberships" (
	"tenant_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "partner_memberships_tenant_id_actor_id_pk" PRIMARY KEY("tenant_id","actor_id")
);
--> statement-breakpoint
CREATE TABLE "partner_reviews" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partner_reviews_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "partner_reviews_positive_version" CHECK ("partner_reviews"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"configuration" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_goals" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_goals_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "project_goals_positive_version" CHECK ("project_goals"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "project_versions" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_versions_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "project_versions_positive_version" CHECK ("project_versions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"partner_id" text,
	"revision" integer NOT NULL,
	"status" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "positive_project_revision" CHECK ("projects"."revision" > 0)
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "properties_positive_version" CHECK ("properties"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "score_factor_results" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "score_factor_results_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "score_factor_results_positive_version" CHECK ("score_factor_results"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "score_results" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "score_results_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "score_results_positive_version" CHECK ("score_results"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "status_events" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "status_events_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "status_events_positive_version" CHECK ("status_events"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "submission_items" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submission_items_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "submission_items_positive_version" CHECK ("submission_items"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "submissions_positive_version" CHECK ("submissions"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"project_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_tenant_id_id_pk" PRIMARY KEY("tenant_id","id"),
	CONSTRAINT "uploads_positive_version" CHECK ("uploads"."version" > 0)
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "energy_profiles" ADD CONSTRAINT "energy_profiles_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_values" ADD CONSTRAINT "evidence_values_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotency_requests" ADD CONSTRAINT "idempotency_requests_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_requests" ADD CONSTRAINT "info_requests_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_decisions" ADD CONSTRAINT "partner_decisions_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_memberships" ADD CONSTRAINT "partner_memberships_tenant_id_partners_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_reviews" ADD CONSTRAINT "partner_reviews_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_goals" ADD CONSTRAINT "project_goals_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_versions" ADD CONSTRAINT "project_versions_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenant_id_partners_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_factor_results" ADD CONSTRAINT "score_factor_results_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_results" ADD CONSTRAINT "score_results_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_events" ADD CONSTRAINT "status_events_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_items" ADD CONSTRAINT "submission_items_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_tenant_id_project_id_projects_tenant_id_id_fk" FOREIGN KEY ("tenant_id","project_id") REFERENCES "public"."projects"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "scoped_request_key" ON "idempotency_requests" USING btree ("tenant_id","actor_id","project_id","request_id");