# Technical hero: reference comparison

Source files:
- `selected-reference.webp`: 1586 × 992 px; the selected image mockup.
- `desktop-1440.jpg`: 1363 × 936 px; an actual cloud-browser screenshot of the static SSR review harness at a 1440 × 900 CSS-pixel viewport, shown at 85% scale.

## Full comparison

`comparison.webp` places the reference on the left and the actual browser capture on the right.

- Browser iframe crop: x = 70, y = 44, width = 1224, height = 765 px. The harness toolbar and outer background are excluded; the iframe scrollbar remains. The iframe started at approximately x = 69.5 px, so the crop rounds its origin to the nearest pixel.
- Reference normalization: aspect-preserving Lanczos `contain` into a 1224 × 765 px canvas. The 1586 × 992 reference becomes 1223 × 765 px, with one navy padding column at the right. No stretching or content alteration.
- Each pane therefore represents the same approximately 1.6:1 viewport aspect.
- Comparison sheet: 2520 × 843 px, including labels, margins and a 24 px gutter.

## Graphics comparison

`comparison-graphics.webp` uses the same crop on both already-normalized panes: x = 510, y = 80, width = 714, height = 645 px. No further scaling is applied. The crop focuses on the three main objects, labels and convergence; part of the obsolete decorative incoming wiring at the far left of the reference is outside this focused crop. The full reference remains visible in `comparison.webp`.

Graphics sheet: 1500 × 723 px, including labels, margins and gutter.

## Independent visual review

Reviewed `desktop-1440.jpg`, `desktop-1366.jpg`, `tablet-768.jpg`, `tablet-820.jpg`, `phone-390.jpg`, `phone-375.jpg` and `phone-320.jpg` at normal text scale. No additional P1/P2 visual issue was found: the three approved objects remain complete, captions do not overlap other content, and the corrected roof eave remains straight. Mobile captions are grouped with their objects. Compact tablet/mobile ordering and smaller illustration sizes are intentional responsive adaptations, not pixel-identical reproductions of the desktop reference.

This is a visual comparison of actual screenshots of the static SSR harness. It does not independently establish interaction behavior, live hydration or the pending 200% text CTA fix. The existing main illustration assets were corrected after selection with user approval; the older selected reference is retained unchanged as the design source.
