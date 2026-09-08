# Project Gateway · Atlas Variante 1

Next.js 16 / React 19 / TypeScript strict / Tailwind CSS 4. IBM Plex Sans Condensed and IBM Plex Mono are installed packages and are served locally. The provided Atlas design direction and Analytics contracts control the implementation.

## Local setup

Use Node.js 24 LTS and npm. From branch `work`:

```sh
npm ci
npm run dev
```

The checked-in `gateway.config.json` explicitly selects `demo`. `APP_MODE=demo` is an optional explicit environment override, documented in `.env.example`. Do not commit a real `.env`, credentials, auth.json, private keys or node_modules.

Open `http://localhost:3000`. The public path needs no account. Start with a manually entered location, or select one of the clearly synthetic demo addresses. `/beispiel` explains the nine-factor 82-point example. `/partner/login` opens an explicitly simulated partner session.

## Implemented routes

`/`, `/standortcheck/[draftId]/1` through `/10`, `/standortcheck/[draftId]/zusammenfassung`, `/standortcheck/[draftId]/analyse`, `/projekte/[id]/ergebnis`, `/projekte/[id]/einreichen`, `/projekte/[id]/eingereicht`, `/partner/login`, `/partner/projekte`, `/partner/pipeline`, `/partner/projekte/[id]`, `/kontakt`, `/datenschutz`, `/impressum`, plus the public synthetic `/beispiel` reference.

The ten check steps retain four chapters and preserve data on back/edit navigation. Roof and ground profiles have separate active inputs. Submitted snapshots are immutable; requested clarifications can be answered in the owner's result view, while unanswered requirements remain open. Partner actions include explicit review, information request, acceptance, structured rejection, reopening, internal notes and later demo milestones. Reading does not change status. Filters and selection are URL-backed; pagination is 50 rows.

## Demo persistence and integration boundaries

`src/server/ports.ts` defines location search, evidence, draft, upload, qualification, submission, partner repository/actions, auth and notification ports. `src/server/services.ts` connects their demo adapters. `APP_MODE=live` fails closed with a clear integration-unavailable error; it never silently uses demo providers.

The local `.gateway/demo-store.json` persists projects, opaque-cookie sessions, receipts, events and idempotency records. `GATEWAY_DATA_DIR` can select another private directory. File writes and state transactions are synchronous and atomically renamed **within one Node process**. This is a development/demo adapter, not a multi-process production database. Run one app process against each directory. Do not publish `.gateway` or expose it through a static server. Test runs get isolated stores.

File bytes are written into `.gateway/documents/`, never LocalStorage. Uploads enforce 15 files, 20 MB per file and 100 MB total, content-signature checks for binary formats, UTF-8 CSV checks, deduplication by SHA-256, and authenticated access through download endpoints. A ready document is technically available and explicitly not professionally reviewed. Files selected for submission are recorded in its immutable scope. Demo uploads do not provide malware scanning or a production object-storage service.

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
