# Project Gateway — Design QA

## Selected section separation, option 1 — 4 October 2026

final result: passed

The user selected the FIRST displayed image of the 4 October separation
exploration: `exec-65acbc7a-02f8-411c-aa0d-713cfd33a3f2.png`.
This selection changes the section boundaries of the established Variante 3
homepage; it does not restore the original Atlas/Variante 1 design.
Source visual truth: [selected-design.webp](docs/qa/chapter-band-2026-10-04/selected-design.webp).
The original image identifier, dimensions and checksum are preserved in
[source.json](docs/qa/chapter-band-2026-10-04/source.json).

**Comparison evidence and scope**

- [Full-view comparison](docs/qa/chapter-band-2026-10-04/comparison.webp):
  reference on the left, rendered implementation on the right; each is
  1190×1322 pixels. Browser CSS viewport 1190×754 at DPR 1; full-page clip
  1190×1322. No density rescaling. State: hero Netzanschluss, PV already present.
- [Focused band comparison](docs/qa/chapter-band-2026-10-04/comparison-band.webp):
  the same y=680–1080 region of both artifacts, compared together.
- [Mobile route](docs/qa/chapter-band-2026-10-04/hero-route-390.webp) and
  [mobile closing](docs/qa/chapter-band-2026-10-04/faq-closing-390.webp):
  390×844 CSS viewport, DPR 2; inspected at native density. Additional original
  browser PNGs at 1440×900, 768×1024 and 320×640 were visually reviewed.
- [Metrics](docs/qa/chapter-band-2026-10-04/metrics.json) record geometry,
  loaded fonts, solid surfaces, separator directions and runtime errors.
  The 114px desktop band matches the reference's approximately 114px band.
  Existing hero geometry and assets are retained deliberately: the generated
  mock varies their typography/crop, but the user selected a section divider,
  not a replacement hero. Existing guidance copy is also retained.

**Fidelity surfaces**

- Typography: existing IBM Plex Sans 400–700 is loaded; readable dark step
  labels and quieter supporting text match the reference's hierarchy.
- Spacing/layout: 28px band padding, 58px inner rows and aligned vertical rules;
  tablet puts the title above the row; phones use open rows with horizontal
  rules. No extra interactive affordances are added to this informational list.
- Colors: solid mineral `#d9e2e5`, chalk content and slate `#10202a` closing.
  Both failed long gradients and their spacing variables are removed.
- Images: existing approved night assets and Carbon icons are reused unchanged;
  no new raster asset, texture, simulated icon or gradient is introduced.
- Copy: the route's three existing steps remain intact. Before the closing
  form, its existing next-step label and address guidance form a short mineral
  chapter strip. Duplicate introductory text is removed from the body.

**Findings and comparison history**

1. Initial [P1]: the new closing-strip caption inherited the dark theme's pale
   paragraph color and failed contrast (1.17:1). Fixed with explicit `#18242b`.
2. Post-fix: production build and TypeScript passed; the existing keyboard/
   dialog/Axe check passed again. Hero geometry and 200% text/touch/reduced-motion
   tests also passed. Fresh closing PNGs were reviewed; independent visual QA
   found no actionable P0/P1/P2 issue in either section boundary.

**Implementation checklist**

- Replace empty gradient areas with the selected compact informational band: complete.
- Keep existing form structure, hero viewport fit and clear controls: verified.
- Compare reference/render together and recheck contrast correction: complete.

**Follow-up polish**

Existing narrow-phone tab text can break awkwardly inside “Stromverbrauch”.
This predates the selected divider change; it remains a separate typography
refinement. Chromium is the browser used for these captures and checks.

## Longer, texture-free eased blends — 4 October 2026

The user still found the linear, dithered gradients pixelated and too hard.
This attempt removes the SVG texture entirely and extends both transition
zones to `clamp(260px, 29vw, 440px)` (417.6px at 1440px; 260px on phones).
Seventeen floating-point OKLab color-mix stops approximate smoothstep easing:
the color change starts and finishes slowly instead of meeting the neighboring
flat surface at full speed. Intermediate colors are not rounded to 8-bit hex.
No blur, images, motion or input-intercepting overlay is used. Header/hero
geometry and the established text/control colors remain unchanged.

Production build and TypeScript passed, as did the existing keyboard/Axe and
complete responsive hero tests. Lossless original-size PNGs were reviewed at
1440, 390 and 320px, with an additional 2× capture at 390px. Independent review
confirmed softer endpoints without conspicuous grain; the added empty space
is intentional for this user-requested trial. No claim is made that all display
quantization disappears on every screen.

Evidence: [desktop transition](docs/qa/soft-blend-2026-10-04/hero-route-desktop.png),
[mobile closing at 2×](docs/qa/soft-blend-2026-10-04/faq-closing-mobile-2x.png),
[geometry and computed colors](docs/qa/soft-blend-2026-10-04/metrics.json).

Published application commit: `60bf8ca280ec57409a60dec576a56750ea659d25`;
Netlify production deploy: `6ac2a07f4d0f3b65e0bc9e2f`. The deployment gate
passed all 192 unit tests, production build and TypeScript. Read-only
[live acceptance](docs/qa/soft-blend-2026-10-04/live-results.json) passed at
1440×900 and 390×844: eased colors and heights are correct, texture overlays
are absent, fonts load, the full hero fits, and there is no horizontal overflow.
The start dialog and keyboard focus return work. No runtime/transport errors
or attempted writes occurred. Both live transitions were visually reviewed.

## Continuous, dithered transitions — 4 October 2026

The user still saw pixelated-looking bands in both long blends. Their nine
precomputed color stops are now replaced by native two-color OKLab
interpolation, with a conventional two-color gradient as the fallback.
A deterministic, fixed-size monochrome SVG adds 1.2% micro-dither only inside
the empty transition space. Its edges fade out; it cannot intercept input.
Transition heights, hero geometry, text, controls and application behavior
are unchanged.

Production build, TypeScript and the existing keyboard/Axe, 200% text/touch/
reduced-motion and responsive hero tests passed. Original-size lossless PNGs
were reviewed at 1440, 390 and 320px, including 390px at device pixel ratio 2.
Independent visual review found smoother ramps without conspicuous grain,
repeating tiles or hard endpoint seams. This reduces visible banding; display
bit depth and image compression can still affect its appearance.

Evidence: [desktop hero transition](docs/qa/gradient-2026-10-04/hero-route-desktop.png),
[mobile closing transition at 2×](docs/qa/gradient-2026-10-04/faq-closing-mobile-2x.png)
and [browser geometry](docs/qa/gradient-2026-10-04/metrics.json).

Published application commit: `bbe65e87a30b6f4b3b419e02e45f703d28103afc`;
Netlify production deploy: `6ac27f88eb713978a1079a54`. The existing Free plan
is unchanged. The deployment gate passed all 192 unit tests, production build
and TypeScript. [Read-only live acceptance](docs/qa/gradient-2026-10-04/live-results.json)
passed at 1440×900 and 390×844: both native gradients and the SVG dither are
served correctly, all font weights load, hero geometry and widths are intact,
and the start dialog opens, closes with Escape and returns focus. Live PNGs
were visually reviewed. No runtime/transport errors or attempted writes.

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
Published on 4 October after the user renewed the Netlify login. Application
commit: `45ae82db9ff6370c185bd3b2347408c3309057e8`; production deploy:
`6ac26c114d0f3b25d5bc9de3`. The existing Free plan is unchanged. The deployment
gate passed all 192 unit tests, the production build and TypeScript checks.
Read-only live acceptance passed at 1440×900 and 390×844: both easing ramps
and their 244.8px/152px heights are correct, fonts 400–700 load, the hero fits
one viewport and there is no horizontal overflow. The start dialog opens,
Escape closes it and focus returns to its button. Both transition screenshots
were visually reviewed at each width. No JavaScript/transport errors, API
requests or attempted writes occurred.

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
