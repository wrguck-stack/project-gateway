# Project Gateway - Codex repository instructions

This repository implements Project Gateway using the binding **Atlas / Variante 1** design direction.

Before changing code, read these root files completely and in this order:

1. `01_CODEX_TASK.md`
2. `02_PRODUCT_DESIGN_FULL.md`
3. `03_ANALYTICS_FULL.md`

Then inspect both visual reference PDFs:

4. `04_PRODUCT_DESIGN_VISUALS.pdf`
5. `05_ANALYTICS_VISUALS.pdf`

Source precedence:
- Product Design controls visual identity, typography, color tokens, spacing, grid, component form, responsive shells, interaction presentation, landing/check/partner UX.
- Analytics controls score semantics, provenance/uncertainty, workflow/status transitions, reason codes, denominators and analytical geometry.
- Explicit alignment/conflict rules embedded in Product Design override illustrative contradictions.
- Normative text/data contracts override labels or numbers visible in generated boards.

Do not invent a new design direction.
Do not stop after scaffolding or the landing page.
Continue through implementation, tests, build and visual QA as required by `01_CODEX_TASK.md`.
Use demo mode honestly when live integrations are unavailable; never present simulated external actions as live.
