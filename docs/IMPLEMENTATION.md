# Atlas V1 implementation contract

Sources read in order: AGENTS, task, full Product Design, Analytics Core. Both PDFs rendered and inspected (5 product boards, 11 analytics pages). Handoff files are preserved byte for byte.

Implementation: local fonts/tokens → domain and service boundaries → landing/check/review → qualification/result/submission → partner queue/pipeline/dossier/actions → persistence/migrations → tests/build/browser QA → documentation/commit/push.

Next.js App Router uses server pages to authorize and load data. Client islands own forms, disclosures, filters and dialogs. API boundaries use Zod. A single-process local disk adapter provides durable demo records and private files; no browser storage of document bytes. PostgreSQL schema/migration provides the production persistence foundation. Production services fail closed until configured. Demo identities and transfers are explicitly simulated.

## Visualization inventory and local specialist pass

| Layer          | Question and encoding                                                                                          | State and fallback                                                                                        | QA                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Score factors  | Which contributions explain the result? Nine DOM bars, common maximum axis; direct point labels, framed maxima | Unknown hatched with null; not applicable/zero weight get no bar. Native disclosures expose rules/sources | Sum, boundaries, partial bounds, geometry and mobile labels    |
| Partial result | What is known? Possible point range, no scalar or final class                                                  | Preserve estimates and prior scores with their dates                                                      | 70–85 fixture, stale/provider errors                           |
| Site           | Which site was entered? Structured address facts; explicitly schematic demo context                            | No geographic claims without licensed geometry; passive preview and separate dialog, one view             | Arbitrary address fallback, keyboard and landscape             |
| Energy         | Which annual quantities are comparable? Direct values; common-axis bars only for compatible periods            | Unknown vs zero, interval ends and source explicit                                                        | Units, periods, no invented self-use ratio                     |
| Pipeline       | Where is work waiting? Ordered stage table and counts on common zero axis                                      | Terminal branch separate, no increasing terminal age                                                      | Scoped unique projects, actual due dates, median, link filters |

Statistical/uncertainty and visualization-testing skill passes performed locally. Renderer ownership stays with React/HTML/SVG; no chart framework, animation loop or WebGL instances. Per page at most nine factor marks, three energy marks and eleven pipeline rows. Queue paginates at 50. Essential data are HTML text. Filters/selection use validated URL state; confidential action drafts remain in component state. Amber means focal data/selection, critical red means a confirmed restriction, graphite supplies context. Screenshots and keyboard/touch checks cover sibling desktop/mobile layouts, reduced motion and 200% text enlargement.
