# Project Gateway — Variante 3

## Long, eased section transitions — 4 October 2026

The user requested a softer hero-to-second-section and FAQ-to-closing blend.
Both transition zones now use `clamp(152px, 17vw, 264px)` instead of 64–104px.
The stops are smoothstep-eased OKLab samples between the existing endpoint
colors, exported as plain hex for predictable browser support. Matching the
route underlayer to the end of the ramp also removes its small color seam.
Content remains outside the blend; the hero height and control colors are
unchanged.

Production build, typecheck, and the three existing checks for keyboard/Axe,
200% text/touch/reduced motion, and complete responsive hero geometry passed.
The refreshed browser environment initially had an invalid Fontconfig path;
after correcting that local QA configuration, all loaded font weights and all
three tests passed. No application fix or test expectation change was needed.

Visual review at 1440, 390 and 320px passed:
[before/after](docs/qa/transitions-2026-10-04/comparison.webp) and
[geometry](docs/qa/transitions-2026-10-04/metrics.json).
Publication of this refinement awaits renewal of the existing Netlify login;
the read-only site API returned Unauthorized on 4 October.

## Softer color transitions — 3 October 2026

Scoped follow-up to the user's request: feather the night photograph into the
hero, connect the light chapters with subtle background gradients, and blend
the two major light/dark section boundaries in dedicated empty space. The
mobile context now shares the dark hero surface. Controls retain explicit
borders, selected states and readable contrast; the overlay cannot intercept
pointer input. Header and hero retain their existing viewport dimensions.

Production build and typecheck passed. Existing checks for keyboard/Axe,
200% text/touch/reduced motion and hero geometry across all required viewports
passed. Production screenshots at 1440, 390 and 320px were visually reviewed.
No application behavior or analytics contracts changed.

## Clear interaction and guidance

Latest scoped refinement: [clear interaction and user guidance, 3 October 2026](docs/qa/GUIDANCE-2026-10-03.md).
This adds explicit control affordances and next-step guidance to the selected
visual direction documented below.

Source visual truth: `docs/qa/fieldbook-2026-10-03/selected-design.webp`.
The user selected the third displayed design on 3 October 2026:
`exec-25d7d1bc-1c9b-486e-b260-d4c3e0885ad7.png` (1024 × 1536).
This explicit selection supersedes the earlier homepage direction.

## Final visual comparison

All final captures use the production build, Chromium, deviceScaleFactor 1,
loaded local fonts and reduced motion. Hero state: Netzanschluss; entry state:
PV already present; record state: Anschluss.

Evidence in `docs/qa/fieldbook-2026-10-03/`:

- `comparison-final.webp`: selected source and first three implemented sections
  together at the same 1024px image width, preserving their proportions.
- `typography-final.webp`: focused source/implementation title comparison.
- `responsive-final.webp`: tablet and phone hero, with complete controls.
- `desktop-1440.webp`, `desktop-390.webp`: full-page production captures,
  including FAQ, closing form and footer.
- `hero-1440.webp`: full-resolution desktop hero for image/control inspection.
- `capture.json`: dimensions, font loading, overflow and browser capture data.
- `comparison-initial.webp`: initial comparison retained to document the fixes.

The selected composition is faithfully carried into the title hierarchy,
industrial night scene, contextual controls, three-way entry and evidence record.
Five coherent sections replace the previous ten. Local IBM Plex Sans is verified
through the browser's rendered platform-font data, including its actual weights.
Slate, chalk and mineral-blue surfaces retain the source's hierarchy. Orange CTA
text is dark to meet contrast requirements. Inputs, links, tabs, keyboard focus
and selected states are visibly identifiable.

Intentional responsive adaptations:

- Header and hero together fill one viewport, satisfying the user's earlier
  explicit requirement. The generated source has a taller hero proportion.
- A wider version of the approved night scene fits desktop landscape without
  losing the roof, transformer or storage. The original scene is retained at
  tablet/phone widths. These are AI visualizations, accurately identified in alt
  text; they are not presented as photographs of an actual customer installation.
- Up to 900px, context sits below the photo. Up to 600px, title and controls stack.
  Image and hotspots share the same coordinate plane and media breakpoint.
- The source provides the first three sections. FAQ, intake and footer continue
  the same typography, surfaces and spacing using existing functional content.

## Findings resolved

- P1: Light context text on a light panel — explicit dark text now applied.
- P2: Mobile blank image strips — shared scene geometry fills the image area.
- P2: Tablet crop could hide or cover hotspots — compact image and below-image
  context keep all three 44px targets fully visible and clickable.
- P2: Header/hero breakpoint mismatch — exact 72px/64px normal header accounting.
- P2: 200% text overflow in header, FAQ grid and record — flexible header height,
  shrinkable grid tracks and wrapping labels/values preserve readable content.

Final measured header + hero bounds:

| Viewport   | Hero bottom | Horizontal overflow |
| ---------- | ----------- | ------------------- |
| 1440 × 900 | 900px       | no                  |
| 1366 × 768 | 768px       | no                  |
| 768 × 1024 | 1024px      | no                  |
| 820 × 1180 | 1180px      | no                  |
| 390 × 844  | 844px       | no                  |
| 320 × 640  | 640px       | no                  |

The automated hero test additionally covers 375 × 667 and every station, testing
both full-view fit and the complete hit-target bounds inside the photograph.
At enlarged text size, vertical growth is allowed to preserve content.

## Verification

- 192 unit tests passed.
- Production build and TypeScript check passed after the final source changes.
- All 22 landing browser tests passed on the final build: all four project
  intents, hero actions, keyboard tabs, site record, navigation, request retry,
  reduced motion, viewport fit and preserved nine-factor score geometry.
- Five relevant existing Gateway browser tests passed during this work:
  complete roof journeys on desktop and phone (including upload, result,
  consent and local submission receipt); keyboard combobox/focus and Axe;
  required responsive widths/actual fonts; 200% text/touch/reduced motion.
  The zoom test was rerun successfully after the final wrapping fixes.
- Axe reported no violations on the tested homepage, entry dialog, check and
  partner filter states. Real external project delivery is not claimed.
- Final screenshot set has no page JavaScript exceptions. One pre-existing
  missing `/favicon.ico` request returns 404; non-blocking P3, unrelated to
  content or interaction. Hidden lazy record images are intentionally unloaded.
- Independent final visual review found no remaining P1/P2 issues in the hero,
  entry, record, FAQ, closing form or footer at desktop and phone widths.

The existing downstream data contracts and free-hosting configuration remain
intact. Deployment is a separate operational step; this report verifies the
implementation and does not imply that the live site has already been updated.

final result: passed
