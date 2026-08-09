# Locked case study — updated-layout QA

**Source visual truth**

- `/Users/nishantgoel/Downloads/Nishant Goel 4/Case Study/Updated layout.png`
- Target state: 1440 × 900 desktop, locked case study.

**Implementation evidence**

- `http://localhost:4187/#case-study`
- Browser capture: `/private/tmp/updated-locked-case-study.png` (1920 × 1209 physical pixels; browser CSS viewport 1440 × 900 at 0.75 device scale).
- Comparison image: `/private/tmp/updated-locked-case-study-comparison.png` (reference top, implementation bottom; implementation normalized to the same 1440 × 900 comparison canvas).

**Primary interactions tested**

- The Home control retains its working `#home` destination.
- Source assets are loaded: `case-back.svg`, `case-lock.svg`, and `case-study-gpay-hero.png`.
- The obsolete side image is absent and the case index is positioned independently at the updated right-side location.
- No browser console errors were recorded.

**Findings**

- No actionable P0, P1, or P2 differences remain.

**Required fidelity surfaces**

- Fonts and typography: DM Sans heading/body and DM Mono lock treatment retain the portfolio typography system.
- Spacing and layout rhythm: title block, supplied hero position, right-side outcome index, body copy, and lock cutoff follow the updated layout.
- Colors and visual tokens: warm paper canvas, fading grid and body text, pale-gold chips, and navy text match the supplied design.
- Image quality and asset fidelity: the supplied Google Pay hero and SVG back/lock icons are used directly; no recreated placeholder imagery remains.
- Copy and content: Home label, merchant title/subtitle, outcome labels, narrative text, and locked state match the requested content.

**Comparison history**

1. Replaced the generated hero with the supplied Google Pay hero, removed the side card, and moved the index beside the hero.
2. Replaced glyph placeholders with the supplied SVG back and lock assets, and corrected the Home label.

**Follow-up polish**

- None required for this locked-state layout.

final result: passed
