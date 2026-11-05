# ARS.md Compiler

A static web tool to generate **Assessment Review Specifications (ARS.md)** for AI-assisted marking.

## What is this?
Lecturers can use this form to define how an AI should act as a second marker. It compiles a comprehensive `ARS.md` file that the lecturer uploads to a new AI chat alongside their student submissions.

## Privacy
**No data is transmitted to any server.** The tool saves drafts directly in the user's browser via `localStorage`. When the user clicks "Compile", the Markdown file is generated in-browser and downloaded directly to their machine.

## Deployment (GitHub Pages)
1. Fork or clone this repository.
2. Ensure all files are in the root directory (or update the paths in `index.html` if hosted in a subfolder).
3. Go to **Settings > Pages** in the GitHub repository.
4. Set the source to the `main` branch.
5. The site will be available at `https://username.github.io/repository-name/`.

## Project Structure
- `index.html` — Main application.
- `css/` — Stylesheets (reset + custom).
- `js/` — Application logic (state, rendering, validation, compilation).
- `ARS.md` — A reference copy of the standard ARS framework.
- `CHANGELOG.md` — Record of development changes.

## Development
This tool uses Vanilla JS, HTML, and CSS. No build step, no dependencies. Just open `index.html` in your browser.