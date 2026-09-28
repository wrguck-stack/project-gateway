# Project Gateway · Atlas Variante 1

Next.js 16 / React 19 / TypeScript strict / Tailwind CSS 4. IBM Plex Sans Condensed and IBM Plex Mono are installed packages and are served locally. The provided Atlas design direction and Analytics contracts control the implementation.

## Local setup

Use Node.js 24 LTS and npm. The current homepage implementation is on branch
`feat/homepage-professional-pass`; `work` and `main` contain older revisions.
See the [current project status](docs/qa/STATUS-2026-09-28.md) for the verified baseline,
checks and next steps. From the current implementation branch:

```sh
npm ci
npm run dev
```

The checked-in `gateway.config.json` explicitly selects `demo`. `APP_MODE=demo` is an optional explicit environment override, documented in `.env.example`. Do not commit a real `.env`, credentials, auth.json, private keys or node_modules.

Open `http://localhost:3000`. The public path needs no account. Start with a manually entered location, or select one of the clearly synthetic demo addresses. `/beispiel` explains the nine-factor 82-point example. `/partner/login` opens an explicitly simulated partner session.

## Homepage revision

The homepage now introduces the concrete output before the longer process explanation: a project dossier with known facts, sources and missing evidence. Its object, energy and next-step tabs work with the keyboard. The embedded check is editable and updates an explicitly unsaved example summary. It does not create a project or change the illustrative score.

All four project types open their details and can be selected for the actual location check. Selection carries narrow, editable defaults into the draft; choosing a PV extension does not assert that an existing PV system has been verified. Both address forms share the address while showing request errors next to the form used. HTML gateway failures, timeouts and invalid server responses now produce readable errors and allow retry.

Industrial illustrations are individual locally served WebP assets with provenance under `docs/qa/homepage-overhaul/`. They are labelled as AI-generated illustrations, not surveyed sites or completed client projects. No GVS affiliation, assets under management, customer logos or endorsements are claimed.

The contact page supports verified operator details from the optional `GATEWAY_CONTACT_*` and `GATEWAY_OPERATOR_*` variables in `.env.example`. Set them in the deployment environment or an untracked `.env.local` and restart the server. The partnership link opens a distinct contact topic; email and phone links appear only when valid details are configured. Without those details, the page explains the missing contact and links to the example. No contact form or outbound mail service is implied.

`npm run dev` binds the Next.js development server to `0.0.0.0`, accepts `--port`, and maps preview-runner `--host` arguments to Next.js `--hostname`. Keep the Codespaces port private. The new implementation and its validation limits are documented in `docs/qa/homepage-overhaul/design-qa.md`.

## Implemented routes

`/`, `/standortcheck/[draftId]/1` through `/10`, `/standortcheck/[draftId]/zusammenfassung`, `/standortcheck/[draftId]/analyse`, `/projekte/[id]/ergebnis`, `/projekte/[id]/einreichen`, `/projekte/[id]/eingereicht`, `/partner/login`, `/partner/projekte`, `/partner/pipeline`, `/partner/projekte/[id]`, `/kontakt`, `/datenschutz`, `/impressum`, plus the public synthetic `/beispiel` reference.

The ten check steps retain four chapters and preserve data on back/edit navigation. Roof and ground profiles have separate active inputs. Submitted snapshots are immutable; requested clarifications can be answered in the owner's result view, while unanswered requirements remain open. Partner actions include explicit review, information request, acceptance, structured rejection, reopening, internal notes and later demo milestones. Reading does not change status. Filters and selection are URL-backed; pagination is 50 rows.

## Demo persistence and integration boundaries

### Preview outside Codespaces

The selected target is **Netlify Free**. `netlify.toml` configures the Next.js
build, and the Netlify build selects private, durable Netlify Blobs for projects,
sessions and uploads. See [Netlify setup](docs/deployment/netlify-free.md) for
account setup, Free-plan limits, verification and the deployment boundary.
The configuration alone does not publish a site. The older paid `render.yaml`
proposal was not selected and must not be applied as part of this setup.

After building, `npm run verify:preview` checks a newly created test project,
session and uploaded file across a full application restart. It uses its own
temporary data directory and never targets an existing Codespace or hosted service.

`npm run verify:netlify` instead uses the official local Netlify Blobs emulator
with synthetic credentials and a fresh temporary store. It checks large chunked
uploads, streamed downloads, sessions across app restarts and preview isolation.
The emulator needs a test-only local ETag forwarding workaround and does not
provide atomic concurrent writes; see the [verification limitations](docs/deployment/netlify-free.md#prüfung).
Run a regular `npm run build` before these local checks (not a `NETLIFY=true`
platform build, whose storage context is deliberately fixed at build time).

### Storage and services

`src/server/ports.ts` defines location search, evidence, draft, upload, qualification, submission, partner repository/actions, auth and notification ports. `src/server/services.ts` connects their demo adapters. `APP_MODE=live` fails closed with a clear integration-unavailable error; it never silently uses demo providers.

With `GATEWAY_STORAGE=local`, `.gateway/demo-store.json` persists projects, opaque-cookie sessions, receipts, events and idempotency records. `GATEWAY_DATA_DIR` can select another private directory. State transactions run synchronously and publish by atomic rename **within one Node process**. Run one app process against each directory. This local development/demo adapter requires a persistent filesystem; it is not the Netlify storage backend. Do not publish `.gateway` or expose it through a static server. Test runs get isolated stores.

With `GATEWAY_STORAGE=netlify-blobs`, the application reads the demo state with strong consistency and writes conditionally against its ETag. Production uses a stable private store across deployments; preview contexts use separate stores. Sessions, project metadata and uploaded bytes reside in Blobs rather than the serverless filesystem. Storage errors fail closed without switching to local files. This shared demo-state model is bounded and is not a scalable production database; retention, backups and real authentication still require a separate production design.

File bytes never enter LocalStorage. The local backend publishes complete bytes under `.gateway/documents/`; the Netlify backend stores them under private Blobs keys. Uploads use authenticated chunks of at most 2,000,000 bytes and enforce 15 files, 20,000,000 bytes per file and 100,000,000 bytes per project, content-signature checks for binary formats, UTF-8 CSV checks, SHA-256 deduplication, and authenticated streaming download endpoints. A document becomes ready only after validated bytes and metadata are durably stored; ready means technically available, not professionally reviewed. Files selected for submission are recorded in its immutable scope. Demo uploads do not provide malware scanning.

Owner access requires the original opaque HttpOnly cookie; knowing a project ID grants no access. Partner repository access checks tenant and release. The openly accessible demo login deliberately simulates the partner role: **do not enter confidential or real personal data**. There is no production identity verification, real outbound notification, partner transfer or deployment.

Demo scoring uses the explicit `demo-v1` ruleset. Its illustrative contributions are not technical suitability rules. Unknown is null; zero is a confirmed zero. Ground profiles remove roof weight before scoring. Partial bounds include known contributions and remaining weights without renormalization. The demo submission gate accepts a complete score or a partial lower bound of at least 65 with a confirmed location, stated area, stated authority and no confirmed blocker. This gate is a declared demo workflow choice, not a validated production qualification rule. Other projects remain editable and are never automatically rejected.

Arbitrary entered addresses never receive synthetic coordinates or building detection. The spatial view is a labeled schematic for synthetic examples and a factual address fallback otherwise. No real solar provider, yield assessment, structural check, document review, self-use ratio or storage optimization is claimed.

## PostgreSQL / Drizzle

`src/server/schema.ts` and `db/migrations/` define 24 tables, composite tenant/project foreign keys, project revisions, versioned child records and scoped idempotency keys. `src/server/postgres-repository.ts` provides a transaction/row-lock repository foundation for snapshots, history and optimistic revision checks.

```sh
npm run db:generate
# Set DATABASE_URL to an authorized development PostgreSQL database first:
npm run db:migrate
```

The PostgreSQL adapter is not wired into live services. Configure and validate production auth, repositories, object storage, partner assignments, professional rule profiles, licensed geodata and notification delivery before enabling live operation. The generic versioned child payloads are a foundation; production-specific indexes, retention and role policies need a concrete deployment contract. No live database migration is implied by generating SQL.

## Tests, build and browser QA

```sh
npm test
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright starts the production build, uses a fresh isolated demo store and tests actual Chromium interaction. `docs/qa/REPORT.md` records the checks actually executed, limitations, screenshot evidence and fixes. Traces and the interactive report are generated in ignored `test-results/` and `playwright-report/` folders. A fresh run does not modify handoff files or demo data from ordinary development.

In a restricted Codespace sandbox, registry downloads, Turbopack's build processes, Chromium and local listening ports may require authorized execution outside the sandbox. The stack does not change in response to a download failure.

## Review first

- `src/domain/model.ts` and `rules.ts`: input validation, score states, reasons and transitions.
- `src/server/services.ts`: access guards, revisions, idempotency and immutable evidence.
- `src/app/globals.css`: Atlas tokens and responsive composition.
- `docs/qa/REPORT.md`: actual browser results and remaining integration boundaries.

No force-push, main merge, external communication or production deployment is part of this implementation.
