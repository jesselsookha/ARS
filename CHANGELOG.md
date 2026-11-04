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