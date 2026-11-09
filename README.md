# ARS.md Compiler

**A structured instruction framework for AI-assisted marking.**

---

## The Problem

Lecturers are increasingly turning to AI tools to help with the heavy lifting of marking. A large cohort of 100 students, each with a multi-part portfolio, is a daunting prospect — and AI can genuinely help.

But there's a catch: **an AI tool is only as good as the instructions it receives.**

If you ask an AI to "mark this student's work", you'll get inconsistent feedback. One student gets three paragraphs of detail, another gets a single sentence. One essay is marked harshly on referencing, the next is marked leniently. A single missing file causes the AI to guess at what was submitted. Without clear guidance, the AI does its best — and its best is not good enough for formal assessment.

## The Solution: ARS.md

An **Assessment Review Specification** (ARS) is a structured document that tells an AI *exactly* how to act as a second marker or moderator. It defines:

- **What role** the AI is playing (second marker, moderator, feedback assistant)
- **What it may assess** (and, equally important, what it must *not* assess)
- **How marks are allocated** (the full rubric, criterion by criterion)
- **What evidence** exists and what to do when evidence is missing
- **How feedback should be written** (tone, detail level, structure)
- **What rules** are unique to this particular assessment

With a well-written ARS, the AI behaves consistently across the entire cohort. Every student is marked against the same standard, with the same level of feedback, using the same evidence policy.

---

## How It Fits Into Your Marking Workflow

```
   ┌─────────────────────┐
   │  You write the ARS  │   ← This tool helps you build it
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Start an AI chat   │
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Upload ARS.md      │
   │  + rubric           │
   │  + question paper   │
   │  + student files    │
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  AI confirms its    │
   │  understanding      │
   │  (4 confirmation    │
   │  gates)             │
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Marking begins     │
   │  Student by student │
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  You review, refine │
   │  via overrides      │
   │  for next batch     │
   └─────────────────────┘
```

**The ARS is a one-time investment.** Once written, it can be reused across every student in a cohort, across multiple batches, and even carried forward to the next semester's version of the assessment with minimal edits.

---

## Who Is This For?

- **Lecturers** who want to use AI as a second marker or moderator but need consistency
- **Course coordinators** who want to standardise how AI-assisted feedback is delivered across a module
- **Quality assurance teams** who need a documented record of the marking instructions given to an AI
- **Technically-minded lecturers** who want to write their own ARS by hand from the blank template

---

## What's in This Repository

| File / Folder | Purpose |
|---------------|---------|
| `index.html` | The ARS.md Compiler — a guided form for building an ARS |
| `help.html` | A deep-dive tutorial explaining each of the 15 sections of an ARS |
| `examples/` | Two fictional but complete sample ARS files (one practical, one theory) |
| `ARS-template.md` | The blank ARS template, for lecturers who prefer to write it by hand |
| `CHANGELOG.md` | Version history of the ARS framework and this compiler |
| `css/` | Stylesheets |
| `js/` | Application logic (state, rendering, validation, compilation) |
| `assets/` | Site icons and Open Graph images |

---

## Two Ways to Build an ARS

### Option 1 — Use the Compiler (recommended for most lecturers)

1. Visit the [compiler](index.html).
2. Fill out the guided form, section by section.
3. Click **Compile ARS.md**.
4. Download the generated `ARS.md` and upload it to your AI chat.

The form handles all the structure, checks that compulsory sections are complete, and saves your progress locally in your browser so you never lose work.

### Option 2 — Use the Blank Template (for technically-minded lecturers)

1. Download [`ARS-template.md`](ARS-template.md).
2. Open it in any text editor (VS Code, Notepad, etc.).
3. Fill in the sections marked with `[Insert ...]` placeholders.
4. Save and use the file as-is.

Both paths produce the same thing: a completed `ARS.md` file ready to upload to an AI chat.

---

## Privacy

**No data is transmitted to any server.** The compiler runs entirely in your browser. Drafts are saved to your local browser storage only. When you click "Compile", the Markdown file is generated in-browser and downloaded directly to your machine.

---

## A Note on Responsibility

The AI supports the assessment process, but **responsibility for teaching, assessment decisions, moderation, and final marks remains with the lecturer**. The ARS simply ensures that both the lecturer and the AI are working from the same understanding.

---

## Version History

See [`CHANGELOG.md`](CHANGELOG.md) for the full development history of this framework.

---

## About the Author

Developed by **Jessel Sookha**, lecturer at Emeris.

This tool was built to solve a problem we kept running into in the lecturer's room: how to use AI as a second marker in a way that supports consistency, defensibility, and fairness for students — without compromising the lecturer's final authority over assessment.

Feedback, suggestions, and bug reports are welcome.

**Contact:** jsookha@emeris.ac.za

**LinkedIn:** https://www.linkedin.com/in/jesselsookha

---

*Developed for institutional use. If you adapt this framework for your own institution, please attribute the original.*
