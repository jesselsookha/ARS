**V2 → Path B (web form) — UI/UX and Logic fixes:**
- Fixed Intro screen visibility toggle.
- Fixed progress tracking

**V2 → Path B (web form) — UX refinement:**
- Swapped heading font to Bricolage Grotesque (800) and body to Fira Sans for readability.
- Consolidated progress UI into the sidebar (removed dot indicators in favour of full background fills).
- Moved Compile button to sidebar footer for persistent visibility.
- Added an Intro "Welcome" screen shown before Section 1.
- Added keyboard navigation via Left/Right Arrow keys.
- Added padding/spacing to radio/checkbox fieldsets.
- Clarified Section 15 checklist wording to reflect external uploads.

**V2 → Path B (web form) — initial build:**

- Lecturer confirmed V2 ARS.md acceptable. Development moved to Path B:
  a static-site ARS.md compiler.
- Fonts: Archivo Black (headings, 900 weight) + Fira Mono (body).
- Colour palette evaluated. Amber-glow reserved as accent (fails text-
  contrast on white); used for active indicators and required-field
  asterisks. Pacific-blue used for interactive borders and focus rings.
  Dusk-blue used for primary headings and buttons. Tea-green used for card
  and input tints. Two derived neutrals added (off-white page background,
  dark slate body text).
- Architecture decisions confirmed: wizard flow with a persistent left
  sidebar, required-only submission gate, and a dual output (checklist in
  the page + inside the compiled ARS.md).
- Hosting: GitHub Pages, static HTML/CSS/Vanilla JS, no server, no login,
  no storage.
- Stage 1 build complete: HTML shell, CSS, sidebar navigation, wizard,
  progress tracking, modal preview, download.
- Stage 2 next: full compile logic matching ARS.md V2, per-field
  validation, localStorage persistence.