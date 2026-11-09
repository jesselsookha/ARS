## V3 — Compiler complete

**Status:** Complete. The ARS.md Compiler tool is live.

**Summary:** Full static web application for building Assessment Review Specifications. Includes guided form, validation, local draft management, markdown compilation, help page, and sample examples.

**Delivered features:**

- **Compiler (`index.html`):** 15-section wizard with sidebar navigation, progress tracking, validation, conditional logic, and local draft saving.
- **Compilation engine (`compile.js`):** Generates the complete ARS.md structure with all 16 sections, preserving guidance text and worked examples while injecting lecturer input.
- **Validation (`validate.js`):** Per-section required-field validation with inline error states, conditional logic for the "mark whole assessment" case, and progress calculation including optional sections.
- **Draft management (`state.js`):** Auto-save to browser LocalStorage, draft naming, resume prompt, and reset.
- **Help page (`help.html`):** Full deep-dive tutorial for all 15 sections, including "Common Mistake" and "Best Practice" callouts, with active-sidebar highlighting via IntersectionObserver.
- **Examples (`examples/`):** Two complete fictional ARS files (WEDE5020 practical, PSY101 theory), rendered via `marked.js` with GitHub-style markdown CSS.
- **Blank template (`ARS-template.md`):** Original ARS.md V2 for technically-minded lecturers who prefer to write their own.
- **SEO and social sharing:** Full meta tag suite (Open Graph, Twitter Card, canonical), custom SVG icon, and converted PNG for Open Graph preview images.
- **Print support:** Print CSS fix ensures long ARS files paginate correctly when saved as PDF.
- **Deployment:** GitHub Pages, static branch deployment, `.nojekyll` present, custom `404.html`.

**Known limitations:**

- Sample feedback section could benefit from accumulated examples over time.
- No formal test suite for internal ARS consistency (e.g. verifying marks in Section 3a sum to the scope total).
- Markdown library (marked.js) loaded via CDN. For offline or fully self-contained use, libraries would need to be downloaded and referenced locally.

**Note:** The ARS framework itself (v2.0) is unchanged. This version number refers to the completion of the compiler tool.

---

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

---

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