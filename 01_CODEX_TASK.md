# SIX-FILE PACK OVERRIDE

The original handoff folders were consolidated to avoid Codex upload limits and folder/ZIP issues.

Use only these root-level sources:
- `AGENTS.md`
- `01_CODEX_TASK.md` (this file)
- `02_PRODUCT_DESIGN_FULL.md`
- `03_ANALYTICS_FULL.md`
- `04_PRODUCT_DESIGN_VISUALS.pdf`
- `05_ANALYTICS_VISUALS.pdf`

Do not look for ZIP files or `/docs/handoff/` folders.
The full normative content from the original packages is preserved in the two FULL markdown files.
The visual boards/figures are preserved page-by-page in the two visual PDFs.

---

# CODEX MASTER PROMPT — PROJECT GATEWAY / ATLAS V1

You are implementing the first complete, production-quality MVP foundation of **Project Gateway**, a B2B platform for the digital origination and pre-qualification of commercial renewable-energy projects.

This is **not a design exploration**. Product Design and Data Visualization are already complete. The selected visual direction is binding: **Atlas / Variante 1**.

## 0. SOURCE PACKAGES — READ BEFORE EDITING

You will receive two source packages:

1. `Project-Gateway-Product-Design-Atlas-Variante-1.zip`
2. `Project-Gateway-Codex-Analytics-Handoff.zip`

Unpack both into a local non-runtime reference folder, for example:

- `/docs/handoff/product-design/`
- `/docs/handoff/analytics/`

Do not ship these reference packages or their raw boards in the public production bundle unless a concrete runtime asset is explicitly required.

### Product Design reading order

Read in this order:

1. `00-READ-ME.md`
2. `01-DESIGN-CONTRACT.md`
3. `02-SCREEN-FLOWS.md`
4. `03-COMPONENTS-RESPONSIVE-STATES.md`
5. `05-DESIGN-TOKENS.json`
6. `06-SOURCE-AND-ANALYTICS-ALIGNMENT.md`
7. `04-CODEX-IMPLEMENTATION-SPEC.md`
8. `07-EXPORT-QA.md`
9. `VISUAL-MANIFEST.json`
10. inspect all relevant `/visuals/` and `/references-analytics/` images

### Analytics reading order

Read all normative Analytics files, especially:

- `Project-Gateway-Visualization-Specification.md`
- `COMPONENT-CONTRACTS.md`
- `DATA-CONTRACT.json`
- `EXAMPLE-DATA.json`
- `QA-REPORT.md`
- `VALIDATION-RESULTS.json`
- `/figures/`
- `/references/`

### Source precedence

Resolve conflicts exactly like this:

1. **Product Design** controls visual identity, typography, color tokens, spacing, grid, shells, component form, responsive layout and interaction presentation.
2. **Analytics** controls score semantics, data provenance/uncertainty, workflow/status transitions, reason codes, metric denominators and analytical geometry.
3. `06-SOURCE-AND-ANALYTICS-ALIGNMENT.md` is the explicit conflict-resolution document.
4. Normative text/data contracts override mistakes or illustrative labels visible in generated boards.
5. Visual boards define art direction and composition; they are not a source of business rules and must never be pasted as whole-screen images into the implementation.

Do not create a new visual direction.

---

# 1. PRODUCT PURPOSE

Project Gateway is a digital B2B platform that turns an address or commercial site into a structured renewable-energy project request.

Primary users:

- owners of commercial property
- industrial companies
- logistics companies
- agriculture
- business parks
- larger real-estate portfolio holders
- asset managers

A professional project developer is the recipient of qualified project submissions.

Project Gateway remains a standalone product and must be **multi-tenant ready**, but V1 has one configurable demo partner. Do **not** hardcode GVS or any real company unless real partner configuration is supplied later.

The core flow is:

`Address → Q01–Q10 → Review → Analysis → Score/Partial result → Explicit submission → Partner workspace → Review / Request info / Accept / Reject`

The product must remain useful without pretending that unavailable external services already work.

---

# 2. MVP SCOPE

Build now:

- public landing page
- address/site entry
- 10-step Standortcheck
- review before qualification
- real analysis/job states
- Project Score result and partial/not-ready states
- score explanation with 9 factors
- site/object evidence area
- energy profile
- document selection/upload architecture
- explicit project submission
- submission receipt
- partner login shell
- partner work queue
- partner project list/filter/search/pagination
- partner pipeline
- project dossier
- project history
- partner actions:
  - accept
  - request information
  - reject with structured reasons
- responsive mobile states
- accessible interactions
- demo/live integration boundary
- testable state/data contracts

Do **not** build now:

- plant monitoring
- electricity trading
- investor portal
- financing marketplace
- complete PV engineering/planning
- structural calculations
- full solar CRM
- AI chatbot
- automatic model training from rejected projects
- internal funnel/rejection analytics as an active MVP navigation area
- 3D buildings
- fake solar heatmaps
- decorative dashboards
- financial-investment flows

---

# 3. STACK

First inspect the repository.

If an existing compatible stack exists, preserve it.

If the repository is empty, use:

- Next.js 16 App Router
- React 19
- TypeScript strict
- Tailwind CSS 4
- PostgreSQL-ready persistence layer
- Drizzle ORM + migrations if a database layer is created
- Zod at input/service boundaries
- Vitest for unit tests
- Testing Library for component tests where useful
- Playwright for E2E/browser tests
- Carbon Icons React if no suitable icon system already exists
- IBM Plex Sans Condensed for interface/display/body
- IBM Plex Mono for data values and technical metadata

Fonts must be locally controlled by the project/package setup. Do not redesign around a fallback font.

Prefer server components by default and client components only where interaction requires them.

Do not introduce microservices.

---

# 4. ARCHITECTURE: DEMO MODE AND LIVE PORTS

The application must run end-to-end without external credentials.

Create explicit service ports/adapters:

- `LocationSearchProvider`
- `SiteEvidenceProvider`
- `DraftRepository`
- `UploadProvider`
- `QualificationProvider`
- `SubmissionProvider`
- `PartnerProjectRepository`
- `PartnerActionProvider`
- `AuthProvider`
- optional `NotificationProvider`

Create a deterministic **DEMO mode** with seeded data and clearly labeled simulated actions.

Demo mode must be explicit, e.g. configuration such as:

`APP_MODE=demo`

Do not infer demo/live mode merely because an env variable happens to be missing.

In demo mode:

- address search may return deterministic demo addresses
- a site view may use a clearly labeled schematic/demo site context
- qualification may use a deterministic `demo-v1` ruleset
- submission may persist in the demo repository and must say **“Übermittlung simuliert”**
- partner actions may be simulated/persisted locally in the demo data layer and clearly identified as demo
- no real email, partner transfer or technical solar claim is made

In live mode, unavailable integrations must fail honestly rather than silently switching to demo behavior.

---

# 5. ROUTES

Implement the routes defined by Product Design:

- `/`
- `/standortcheck/[draftId]/[step]`
- `/standortcheck/[draftId]/zusammenfassung`
- `/standortcheck/[draftId]/analyse`
- `/projekte/[id]/ergebnis`
- `/projekte/[id]/einreichen`
- `/projekte/[id]/eingereicht`
- `/partner/login`
- `/partner/projekte`
- `/partner/pipeline`
- `/partner/projekte/[id]`
- `/kontakt`
- `/datenschutz`
- `/impressum`

Do not add internal funnel/rejection analytics to primary MVP navigation.

---

# 6. LANDING PAGE

Implement the exact Atlas landing-page hierarchy and copy from Product Design.

Required sequence:

- PublicHeader
- Hero
- address input / `Standort prüfen`
- “Von der Fläche zum Energieprojekt”
- digital check explanation
- score preview
- project types
- target groups
- competence / responsibility split
- FAQ
- closing address input
- Footer

Hero requirement:

- dark Atlas shell
- editorial industrial/infrastructure character
- prominent light address input
- site/aerial/map context on the right on desktop
- address and CTA before large map imagery on mobile

No generic green climate-tech design.

No stock sustainability motifs.

No KPI-card wall.

No fabricated logos, testimonials, certification badges or success numbers.

The hero and closing address field share the same draft state.

Enter and the button perform the same action.

No account/contact wall before the result.

---

# 7. STANDORTCHECK Q01–Q10

Implement exactly four visible chapters:

- Standort
- Objekt
- Energie
- Unterlagen

Maintain stable `Schritt X von 10`.

One primary question per step.

Visited steps remain accessible.

Back navigation preserves values and appropriate scroll state.

Do not auto-advance simply because an option is selected.

Unknown is a valid explicit answer where defined.

Implement:

- Q01 location confirmation/manual description
- Q02 building/site type
- Q03 available roof/free area and conditional roof/free-site fields
- Q04 ownership/authority role
- Q05 annual consumption + source/estimate/unknown + usage profile
- Q06 existing PV
- Q07 existing battery storage
- Q08 main project goal + optional goals/description
- Q09 available documents
- Q10 upload list + final review entry

Use German number formatting for display but canonical units internally.

Never convert unknown to zero.

Known zero must remain a confirmed zero.

For roof/free-site switching, irrelevant fields stop contributing to the active model.

---

# 8. UPLOAD CONTRACT

Accepted:

- PDF
- JPG/JPEG
- PNG
- CSV
- XLSX

Limits:

- max 20 MB per file
- max 15 files per project
- max 100 MB total

States:

- selected
- uploading
- processing
- ready
- failed
- unsupported
- too large
- removed

Only real upload progress may be shown as a percentage.

“Ready” means technically available, not professionally reviewed.

Do not put file bytes in LocalStorage.

Duplicate file content should not be silently stored twice.

---

# 9. ANALYSIS STATE

Title:

**Ihre Projektqualifizierung wird erstellt.**

Subline:

**Wir ordnen die vorhandenen Angaben ein und kennzeichnen offene Punkte.**

Show only actual states:

- Standort zuordnen
- Objektdaten prüfen
- Solardaten ergänzen only if a real provider exists
- Energiedaten einordnen
- Projektqualifizierung erstellen

States per row:

- waiting
- running
- complete
- open/missing information
- provider error

No fake timers.

No random progress.

No artificial delay.

No “Gebäude erkannt” unless a real provider did that.

No “Solarpotenzial geprüft” unless the actual integration supports that statement.

---

# 10. SCORE CONTRACT

The UI consumes a versioned qualification result.

Do not calculate a second hidden score in the UI.

Required score states:

- `READY`
- `ESTIMATED`
- `PARTIAL`
- `NOT_READY`
- `SCORING`
- `STALE`
- `ERROR`

Required classes:

- 80–100: `Hohe Priorität`
- 65–79: `Gutes Potenzial`
- 50–64: `Informationen ergänzen`
- 0–49: `Aktuell geringe Priorität`

Required factors:

1. usable roof/site area
2. solar/yield potential
3. consumption/self-consumption potential
4. ownership/decision authority
5. roof condition
6. project scale
7. project readiness
8. documents
9. existing energy infrastructure

Use the Analytics contracts for exact factor IDs and data shape.

Unknown factor value is `null`.

Do not renormalize a partial score.

Example partial state from the handoff: possible range `70–85`.

The example `82/100` is synthetic UI data only.

A high score is not a technical approval.

A blocker remains visible next to a high score.

No automatic rejection purely because of a low score.

No gauge, donut, radar, 3D chart or AI-confidence orb.

Score screen reading order:

1. project identity
2. score/state + class + reliability/data basis
3. confirmed blocker/open critical check
4. next action
5. positive findings / things to clarify / missing data
6. all nine factor contributions
7. site/energy details

Mobile shows score, class, reliability, blocker and action before the large map.

---

# 11. DATA PROVENANCE AND UNCERTAINTY

Treat origin and certainty as separate axes.

Support values such as:

- user provided + exact
- user provided + estimated
- externally derived + estimated
- calculated + scenario range
- unknown
- confirmed zero
- stale last-known value
- provider error
- not applicable

No fake precision.

Use ranges where appropriate.

Never interpret unknown as zero.

Retain last valid data when refresh fails and mark it stale.

---

# 12. WORKFLOW / STATUS MODEL

Use the Analytics transition contract.

Status IDs:

- `NEW`
- `INCOMPLETE`
- `SCORING`
- `QUALIFIED`
- `PARTNER_REVIEW`
- `INFO_REQUESTED`
- `ACCEPTED`
- `DEVELOPMENT`
- `CONTRACTED`
- `REALIZED`
- `REJECTED`

Important:

- reading a project does not change its status
- re-scoring does not reset an active partner review to `SCORING`
- `ACCEPTED` is not a contract
- `CONTRACTED` and `REALIZED` are later distinct events
- rejected projects may be explicitly reopened without deleting the original decision event

Enforce transitions in a domain/service layer, not merely in buttons.

---

# 13. REJECTION REASON CODES

Implement stable IDs from the Analytics contract:

- `AREA_TOO_SMALL`
- `ROOF_CONDITION`
- `OWNERSHIP_AUTHORITY`
- `LOW_CONSUMPTION`
- `PROJECT_SCALE_MISMATCH`
- `GRID_CONSTRAINT`
- `STRUCTURAL_CONSTRAINT`
- `REGION_OUT_OF_SCOPE`
- `ECONOMICS`
- `MISSING_INFORMATION`
- `OTHER`

Separate classifications:

- `PARTNER_CAPACITY`
- `DUPLICATE`
- `WITHDRAWN`

Rules:

- exactly one primary reason
- maximum three additional reasons
- OTHER requires text
- unknown structural status is not a confirmed structural defect
- store score/model version, factor snapshot, actor and timestamp with the decision

---

# 14. SUBMISSION FLOW

Screen title:

**Ihr Projekt zur fachlichen Prüfung einreichen.**

Before submit, show:

- project identity
- actual recipient
- included data
- included documents
- contact details
- optional comment
- active, unchecked consent

Do not pre-check consent.

Do not ask for project data already collected.

Submission must be idempotent.

Pending disables repeat submission.

Unknown delivery status must be reconciled by request/job ID rather than firing a second request.

Success receipt shows:

- project ID
- recipient
- timestamp
- submitted scope

No 24-hour guarantee or promised acceptance.

If no real recipient exists:

**Für dieses Projekt ist noch kein Empfänger hinterlegt.**

In demo mode, successful submission wording must explicitly state:

**Übermittlung simuliert**

---

# 15. PARTNER WORKSPACE

Core question:

**Welche Projekte sollte ich jetzt bearbeiten?**

Do not create a generic analytics dashboard.

Desktop ≥1280:

- left work list around 440–480 px
- 24 px gap
- large dossier workspace

Below 1280:

- list and dossier become separate states

Views:

- Neue Projekte
- Hohe Priorität
- Informationen fehlen
- In Prüfung
- Übernommen
- Abgelehnt

These are filters/views, not backend statuses and may overlap.

Each project row shows:

- next action
- project/location
- score + score-state basis
- project type
- expected size with unit
- status

Filters:

- status
- score class
- project type
- building type
- region
- size with unit
- completeness
- assignee
- due state

Search:

- project ID
- location

Pagination:

- 50 rows per page

Selection:

- amber edge
- reading/selecting does not change status
- preserve filter/selection when returning from dossier

New data must not silently move the currently read item. Show a controlled refresh/snapshot update.

---

# 16. PIPELINE

Use an ordered stage table, not an 11-column Kanban.

Per stage show:

- current count
- open tasks
- overdue tasks
- median age/current dwell time where defined

Rejected is a separate terminal branch.

Terminal stages do not continue accumulating dwell time.

Pipeline rows link to filtered project lists.

---

# 17. PROJECT DOSSIER

Header:

- project name/location
- address
- project ID
- current status
- score + data basis
- next action

Show blockers and decisive missing information near the top.

Sections:

- Standort
- Objekt
- Energie
- Ziel
- Score
- Dokumente
- Prozess / Verlauf

Desktop full dossier:

- main content 8 columns
- decision area 4 columns

Mobile:

- header
- next action
- blockers
- single-column sections
- separate `Entscheidung` dialog/sheet

Do not squeeze three partner action buttons side by side on mobile.

Document technical availability and professional review are separate states.

History:

- newest professional action first
- actor
- timestamp
- previous/new status if relevant
- referenced project/version snapshot
- separate `Interne Notiz` from `Nachricht an Projektkontakt`

---

# 18. PARTNER ACTIONS

### Accept

`Projekt übernehmen` → confirmation → server-confirmed success → `ACCEPTED`.

Never imply contract or guaranteed build.

### Request information

Partner selects concrete fields/document categories, message, actual recipient and optional due date.

Only successful confirmed delivery sets `INFO_REQUESTED`.

Partial responses satisfy only the requested items that were actually answered.

### Reject

Dialog title:

**Projekt begründet ablehnen**

Show current project identity and score version.

Require:

- primary reason
- optional additional reasons
- assessment state
- supporting professional context where required

Score remains unchanged after rejection.

All partner actions:

- prevent double fire
- preserve form on network error
- detect version conflicts
- never silently overwrite a concurrent decision

---

# 19. DATA MODEL

Design a clean schema around the contracts. At minimum model:

- `partners`
- `partner_memberships`
- `drafts`
- `projects`
- `project_versions`
- `properties`
- `contacts`
- `energy_profiles`
- `project_goals`
- `evidence_values`
- `documents`
- `document_versions`
- `uploads`
- `score_results`
- `score_factor_results`
- `submissions`
- `submission_items`
- `partner_reviews`
- `info_requests`
- `partner_decisions`
- `status_events`
- `consents`
- `audit_logs`

Use immutable/versioned snapshots for submitted/reviewed decision evidence where the contracts require historic traceability.

Project/Draft IDs in URLs are identifiers, never authorization.

Tenant/partner isolation must exist in repository/service boundaries.

Do not expose permanent raw storage URLs or confidential notes in shareable URLs.

---

# 20. VISUAL DESIGN — ATLAS V1 IS BINDING

Core tokens come from Product Design.

Key colors:

- Canvas `#151B20`
- Surface `#1B2329`
- Surface Raised `#222B31`
- Surface Inset `#11171C`
- Text Primary `#F3F5F6`
- Text Secondary `#B9C2C8`
- Text Muted `#97A4AD`
- Border Subtle `#39454D`
- Border Control `#697B87`
- Accent Amber `#E9B64C`
- Accent Hover `#F2C66B`
- Accent Pressed `#D9A43A`
- Info `#9AB8D0`
- Success `#A9C5B5`
- Critical `#F09B93`

Typography:

- interface/display/body: IBM Plex Sans Condensed
- data/technical metadata: IBM Plex Mono

Desktop:

- max content width 1328 px
- 12 columns
- 24 px gutter
- minimum 48 px side margin
- 56 px at 1440

Tablet:

- 8 columns
- 24 px gutter
- 32 px margin

Mobile:

- 4 columns
- 16 px gutter
- 20 px margin at ≥390
- 16 px below 390

Radii:

- major surfaces/table: 0
- inputs/buttons: 4
- dialogs: 8

Primary inputs/buttons:

- 56 px height

Do not add large decorative shadows.

Do not create glassmorphism.

Do not create pill/badge clouds.

Do not add green climate-tech gradients.

Do not add leaves, plants, windmills, globes, AI orbs or generic solar-stock imagery as brand language.

Do not create a fourth design direction.

---

# 21. RESPONSIVE REQUIREMENTS

Explicit QA widths:

- 1440
- 1280
- 1024
- 768
- 390
- 360
- 320 CSS px

Also test:

- 200% text zoom
- keyboard-only
- touch/no hover
- reduced motion
- map landscape state around 844×390

Mobile is not desktop collapsed.

On mobile:

- landing: address + CTA before large visual
- check: one clear question, step/chapter visible
- score: score/class/reliability/blocker/action before map
- map: passive preview then separate full map state
- partner list and dossier are separate views
- no essential horizontal scrolling

---

# 22. MOTION

Use only meaningful state transitions.

- small controls: ~120 ms
- data/state changes: 160–200 ms
- disclosures: 200 ms
- dialogs/sheets: 200 ms
- explicit map fit: max 250 ms
- easing: `cubic-bezier(0.2,0,0,1)`

Reduced motion: immediate.

No score count-up.

No continuous decorative animation.

No fake analysis animation.

---

# 23. ACCESSIBILITY

Meet at least the contracts' requirements:

- text contrast ≥4.5:1
- necessary control/graphic contrast ≥3:1
- no color-only meaning
- no hover-only essential content
- semantic headings
- real buttons/links
- persistent labels
- field/error associations
- semantic tables
- keyboard-operable combobox
- dialogs with focus trap and focus return
- visible focus
- screen-reader friendly analysis completion
- chart/data text equivalent
- map content also understandable as address/object data
- 320px reflow
- 200% text zoom

---

# 24. SECURITY / PRIVACY / INTEGRITY

Implement safe foundations:

- server-side authorization boundaries
- tenant isolation
- Zod/schema validation at input boundaries
- file type/size validation on server when actual upload exists
- do not trust client file metadata
- private/signed document access architecture
- no secrets in client bundle
- no raw permanent storage URLs
- idempotency for submissions/partner decisions
- revision/version checks for concurrent actions
- immutable event history for decisions
- audit actor/time/request identifiers
- do not place confidential text in URL query parameters
- no real outbound email or partner transfer during tests/demo
- clearly separate demo actions from real actions

Do not claim production security if live auth/storage is not configured.

---

# 25. DEMO DATA

Use deterministic synthetic data from the Analytics handoff where possible.

Include:

- full `82/100` example
- partial `70–85` example
- unknown values
- confirmed zero
- stale value
- provider error
- blocked high-score project
- missing documents
- projects in every relevant workflow stage
- partner rejection examples
- request-information example

Mark all seeded project/site data as demo/synthetic.

Never present generated site coordinates or buildings as a real analysis of a user-entered address.

---

# 26. TESTS

At minimum implement and pass:

### Domain/unit tests

- all status transition guards from Analytics contract
- score class boundaries:
  - 49/50
  - 64/65
  - 79/80
  - 100
- partial score range behavior
- unknown/null vs confirmed zero
- no renormalization of missing factor
- rejection reason validation
- OTHER requires text
- max 3 additional rejection reasons
- upload file count/size/total limits
- idempotent submission
- idempotent partner decision
- version conflict
- tenant/partner access guards

### E2E

Public path:

`Landing → address → Q01–Q10 → review → analysis → result → submission → receipt`

Branches:

- roof
- free site
- unknown consumption
- zero consumption
- missing documents
- partial result
- stale result
- provider failure

Partner:

- login/demo context
- project list
- filters
- pagination
- dossier
- request info
- accept
- reject with OTHER
- version conflict
- back to preserved list/filter state

Accessibility smoke tests for core forms/dialogs.

---

# 27. VISUAL QA

After implementation, use the available browser capability.

Render and capture the real implementation at the specified viewport sizes.

Compare against:

- original Atlas board
- landing-page board
- Standort/Objekt board
- Energie/Projektziel board
- Dokumente/Analyse board
- analytics score reference
- mobile score reference
- partner workspace reference

Evaluate:

- Atlas character
- composition
- typography
- hero hierarchy
- light address input
- industrial/map focus
- amber restraint
- spacing
- score hierarchy
- partner workspace density
- mobile reading order

Do not chase pixels where the source board contains illustrative data errors. Follow normative contracts.

Fix concrete visual regressions before final handoff.

---

# 28. IMPLEMENTATION ORDER

Execute continuously in this order:

1. inspect repo and both handoff packages
2. create a short internal implementation plan
3. establish design tokens/fonts/base components
4. establish domain types, state machine and adapter contracts
5. build public landing
6. build Q01–Q10 + review
7. build analysis states
8. build score/result
9. build submission/receipt
10. build partner shell/work queue
11. build pipeline
12. build dossier
13. build partner actions/history
14. add demo adapters/data
15. add persistence schema/adapters
16. responsive pass
17. accessibility pass
18. unit/component/E2E tests
19. production build
20. browser visual QA and fixes
21. README/env/example documentation
22. final report

Do not stop after scaffolding.

Do not stop after the landing page.

Do not ask for approval after each phase.

Only ask the user when a genuinely blocking decision cannot be derived from the contracts.

Otherwise make the smallest reversible decision that preserves the contracts and continue.

---

# 29. DEFINITION OF DONE

Do not declare complete until:

- all required routes render
- the complete public flow works in demo mode
- the partner flow works in demo mode
- score semantics match Analytics
- visual hierarchy matches Atlas
- no unlabelled fake live integration exists
- responsive behavior works at all specified widths
- critical actions are keyboard accessible
- tests pass
- production build passes
- no TypeScript errors
- no obvious console/runtime errors in tested flows
- visual QA was performed against references
- README explains:
  - setup
  - demo mode
  - live integration ports
  - env vars
  - database/migrations
  - tests
  - build
  - known intentionally unconnected integrations
- `.env.example` exists with no secrets
- seeded/demo data is clearly marked as synthetic

---

# 30. FINAL RESPONSE FORMAT

When finished, return a concise implementation report containing:

- what was built
- routes implemented
- architecture decisions
- demo/live boundary
- test results
- build result
- visual QA viewports checked
- any remaining integration points that require real credentials/partner data
- files/areas a human should review first

Do not claim an external integration, technical PV assessment, document review, email delivery, partner transfer, authentication or production deployment worked unless you actually executed and verified it.

Start now by inspecting the repository and both handoff packages. Then continue through the full implementation until the MVP foundation satisfies the Definition of Done.
