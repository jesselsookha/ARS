// compile.js

function getVal(sectionId, fieldId) {
  return getSectionValue(sectionId, fieldId) || "[Not specified]";
}

function getArray(sectionId, fieldId) {
  return getSectionValue(sectionId, fieldId) || [];
}

// Helper to render checkboxes: marks [x] next to each selected value
function renderCheckboxOptions(options, selectedValues) {
  const selected = Array.isArray(selectedValues) ? selectedValues : [];
  return options.map(opt => {
    const isChecked = selected.includes(opt) ? "x" : " ";
    return `- [${isChecked}] ${opt}`;
  }).join("\n");
}

// Helper to render radio options: marks [x] next to the selected value
// NOTE: Radio values are stored as a single string. Comparison is direct.
function renderRadioOptions(options, selectedValue) {
  return options.map(opt => {
    const isChecked = (String(opt).trim() === String(selectedValue).trim()) ? "x" : " ";
    return `- [${isChecked}] ${opt}`;
  }).join("\n");
}

function compileARS() {
  const d = (sec, field) => getSectionValue(sec, field) || "";

  // Section 1
  const moduleName = d("overview", "moduleName") || "[Not specified]";
  const moduleCode = d("overview", "moduleCode") || "[Not specified]";
  const qualification = d("overview", "qualification") || "[Not specified]";
  const lecturer = d("overview", "lecturer") || "[Not specified]";
  const assessmentName = d("overview", "assessmentName") || "[Not specified]";
  const assessmentType = d("overview", "assessmentType") || "[Not specified]";
  const assessmentMode = d("overview", "assessmentMode") || "[Not specified]";
  const semester = d("overview", "semester") || "[Not specified]";
  const totalMarks = d("overview", "totalMarks") || "[Not specified]";
  const scopedMarks = d("overview", "scopedMarks") || "[Not specified]";
  const dueDate = d("overview", "dueDate") || "[Not specified]";

  // Section 2
  const rolesSelected = getArray("purpose", "roles");
  const roleDesc = d("purpose", "roleDescription") || "[Not specified]";

  // Section 3
  const included = d("scope", "includedSections") || "[Not specified]";
  const excluded = d("scope", "excludedSections") || "None specified.";
  const markWhole = getSectionValue("scope", "markWhole") ? "Yes" : "No";

  // Section 4 — Rubric source
  const rubricSource = d("rubric", "rubricSource");
  const rubricText = d("rubric", "rubricText");

  // Define the exact option strings used in the ARS.md structure
  const rubricSourceOptions = [
    "Option 1 — Compiled directly in this ARS. The lecturer has entered the full rubric below (Section 4b). Proceed to 4b.",
    "Option 2 — Assessment document uploaded. The full assessment document has been uploaded in the chat. The AI must extract the rubric and confirm its understanding with the lecturer (Section 4c) before proceeding.",
    "Option 3 — Markdown conversion uploaded. A Markdown version of the assessment document has been uploaded. The AI must extract the rubric and confirm its understanding with the lecturer (Section 4c) before proceeding.",
    "Option 4 — Copy-paste from source document. The lecturer has pasted the rubric text directly into the chat. The AI must reconstruct the rubric structure, present its reconstruction (Section 4c), and only proceed once confirmed."
  ];

  // Match the lecturer's form choice ("Compiled directly in ARS.md" etc.)
  // against the full descriptive option. This bridges the two value formats.
  const rubricChoiceMap = {
    "Compiled directly in ARS.md": rubricSourceOptions[0],
    "Assessment document uploaded": rubricSourceOptions[1],
    "Markdown conversion uploaded": rubricSourceOptions[2],
    "Copy-paste from source document": rubricSourceOptions[3]
  };
  const rubricSelectedOption = rubricChoiceMap[rubricSource] || "";

  // Section 5 — Evidence
  const evidenceItems = getArray("evidence", "evidenceItems");
  const evidenceOptions = [
    "Source code (file or repository)",
    "Screenshots",
    "Markdown or plain-text files (student answers)",
    "PDF files",
    "Word documents",
    "Repository notes / commit history",
    "Student essays or written answers",
    "Lecturer observations (see Section 7)",
    "Sample feedback (see Section 13)"
  ];

  // Section 6 — Insufficient evidence
  const absencePolicy = d("insufficientEvidence", "absencePolicy");
  const referencingReq = d("insufficientEvidence", "referencingRequired");
  const absenceOptions = [
    "Award zero and note 'no evidence provided'",
    "Award zero and flag for lecturer review",
    "Pause and request additional materials"
  ];

  // Section 7 — Observations
  const observations = d("lecturerObservations", "observations") || "None recorded.";

  // Section 8 — Philosophy
  const philosophyOverride = d("philosophy", "philosophyOverride");
  const philosophyBlock = philosophyOverride || "Standard ARS.md philosophy applies (evidence-based, no generosity, no marks for mere existence).";

  // Section 9 — Special cases
  const specialCases = d("specialCases", "specialCases") || "None specified.";

  // Section 10 — Output format
  const marksTableFormat = d("outputFormat", "marksTableFormat");
  const formatCustom = d("outputFormat", "formatCustom");
  const strengthsSection = getSectionValue("outputFormat", "strengthsSection") ? "Required" : "Not required (standard ARS.md)";
  const tableFormatOptions = [
    "Format A — Marks only. Table of criteria and marks, with subtotals and total. No per-criterion comments.",
    "Format B — Marks and comments. Table of criteria, marks, and a short per-criterion comment.",
    "Format C — Custom. Describe below."
  ];
  const tableFormatMap = {
    "Format A — Marks only": tableFormatOptions[0],
    "Format B — Marks and comments": tableFormatOptions[1],
    "Format C — Custom": tableFormatOptions[2]
  };
  const tableFormatSelected = tableFormatMap[marksTableFormat] || "";

  // Section 11
  const moderationExtra = d("moderationNotes", "moderationNotesExtra") || "None.";

  // Section 12
  const overrides = d("overrides", "overrides") || "None specified.";

  // Section 13 — Feedback style
  const feedbackDetail = d("feedbackStyle", "feedbackDetail");
  const sampleSupplied = getSectionValue("feedbackStyle", "sampleFeedbackSupplied") ? "Yes" : "No";
  const sampleFeedbackText = d("feedbackStyle", "sampleFeedback") || "None supplied.";
  const feedbackDetailOptions = [
    "Extended prose — full sentences, multi-paragraph feedback, substantial explanation of every deduction.",
    "Concise prose — short paragraph or two per submission, focused on the highest-signal deductions.",
    "Point-form — bullet list of specific comments per criterion or per question, minimal prose."
  ];
  const feedbackDetailMap = {
    "Extended prose": feedbackDetailOptions[0],
    "Concise prose": feedbackDetailOptions[1],
    "Point-form": feedbackDetailOptions[2]
  };
  const feedbackDetailSelected = feedbackDetailMap[feedbackDetail] || "";

  // Section 14
  const batchRules = d("batch", "batchRules") || "Standard batch rules apply.";

  // Section 15 — Files checklist
  const filesChecklist = getArray("files", "filesChecklist");
  // "This ARS.md file (completed)" is always ticked because it IS the file being generated.
  const filesOptions = [
    "This ARS.md file (completed)",
    "CHANGELOG.md (companion file)",
    "Question paper / brief",
    "Full marking rubric (per Section 4a option chosen)",
    "Memorandum (if separate from rubric)",
    "Sample feedback (Section 13, if available)",
    "Student submissions",
    "Lecturer observations (Section 7)",
    "Any other relevant documents"
  ];
  // Build the checkbox state: ARS.md is always ticked, plus whatever the lecturer selected.
  const filesChecked = ["This ARS.md file (completed)", ...filesChecklist.filter(f => f !== "This ARS.md file (completed)")];

  // --- Build Markdown ---
  const md = `# Assessment Review Specification (ARS)

**Version:** 1.0
**Date:** ${new Date().toISOString().slice(0,10)}
**Author:** ${lecturer}
**Module:** ${moduleCode} — ${moduleName}

> This document is a reusable specification. It is completed by the lecturer
> for each new assessment and uploaded to a new AI chat alongside the
> assessment materials. The AI reads this document first, then proceeds as
> directed in Section 16.

---

## Section 1 — Assessment Overview

**Purpose:** Establishes the identity and context of the assessment. The AI
uses this to frame every subsequent judgement.

| Field                          | Value                                  |
|--------------------------------|----------------------------------------|
| Module Name                    | ${moduleName}                          |
| Module Code                    | ${moduleCode}                          |
| Qualification                  | ${qualification}                       |
| Lecturer                       | ${lecturer}                            |
| Assessment Name                | ${assessmentName}                      |
| Assessment Type                | ${assessmentType}                      |
| Assessment Mode                | ${assessmentMode}                      |
| Semester / Term                | ${semester}                            |
| Total Marks (full assessment)  | ${totalMarks}                          |
| Marks within AI scope          | ${scopedMarks}                         |
| Due date / submission window   | ${dueDate}                             |

> **Assessment Mode note:** "Practical" means the assessment is dominated by
> artefacts (code, design, files, repositories). "Theory" means the assessment
> is dominated by written answers (essays, short questions, explanations).
> "Mixed" means both. This informs how Sections 4, 5, 9, 10 and 13 are applied.

---

## Section 2 — Purpose of AI Review

**Purpose:** Defines the role the AI is playing in this conversation.

**The AI is being used as (select all that apply):**

${renderCheckboxOptions(["Second marker", "Moderator", "Feedback assistant", "Quality assurance reviewer", "Other"], rolesSelected)}

**Role description in the lecturer's own words:**

> ${roleDesc}

---

## Section 3 — Marking Scope

**Purpose:** Defines the *envelope* of what the AI is authorised to score.

> **Important distinction for the AI:**
> - Section 3 tells you what you *may score*.
> - Section 4 tells you what the assessment *contains*.
> - Do not score anything outside Section 3, even if Section 4 describes it.
> - Do not ignore Section 4 — it provides context for how the marked section
>   fits within the whole.

### 3a — Included sections (the AI MAY score these)

${included.split('\n').map(l => l.trim() ? `- ${l}` : '').join('\n')}

### 3b — Excluded sections (the AI MUST NOT score these)

${markWhole === "Yes" ? "*The AI is authorised to score all criteria in Section 4. Section 3b is not applicable.*" : excluded.split('\n').map(l => l.trim() ? `- ${l}` : '').join('\n')}

### 3c — Scope by assessment mode

- **Practical assessments:** typically score artefact-based criteria (code,
  styling, layout, responsiveness, functionality, file structure).
- **Theory assessments:** typically score content-based criteria (accuracy,
  argument, structure, referencing, use of sources, language).
- **Mixed assessments:** apply the criteria in Section 4 as written, respecting
  which criteria are artefact-based and which are content-based.

---

## Section 4 — Full Rubric

**Purpose:** The complete marking rubric for the assessment. The AI reads this
in full so it understands the assessment's shape, even where Section 3
restricts what it may score.

### 4a — Rubric source (select one)

The rubric may be supplied in one of four ways. Tick the method used and
follow the corresponding instruction.

${renderRadioOptions(rubricSourceOptions, rubricSelectedOption)}

> **Note on Option 4:** This option exists because institutional Word
> documents are often policy-restricted and may not be readable by AI tools.
> Copy-pasting the rubric table content directly into the chat bypasses this
> restriction. The AI is expected to reconstruct the rubric structure from
> imperfect input, and to confirm its reconstruction with the lecturer before
> marking.

### 4b — Rubric (Options 1 only — compile directly here)

**Criterion [N] — [Criterion name]**

| Field            | Value                          |
|------------------|--------------------------------|
| Marks available  | [Insert]                       |
| In AI scope?     | Yes / No (per Section 3)       |
| Criterion type   | Artefact / Content / Mixed     |
| Evidence required | [Describe what the student must demonstrate] |

**Marking guidance:**

- **Full marks ([range]):** [Description]
- **Partial marks ([range]):** [Description]
- **Low marks ([range]):** [Description]
- **No marks (0):** [Description]

**Special cases:**

- [Any exception the AI must apply]

> **Worked example — Practical (WEDE5020 Part 2):**
>
> *Criterion:* External Stylesheet Created & Implemented — 10 marks.
> *Full (10):* External stylesheet exists, correctly linked across the
> website, evidence provided.
> *Partial (8–9):* Linked correctly, minor implementation uncertainty.
> *Low (5–7):* Partial linking, some pages likely not connected.
> *Minimal (1–4):* Stylesheet exists but implementation questionable.
> *Zero (0):* No external stylesheet, no evidence available.
>
> **Worked example — Theory (essay criterion):**
>
> *Criterion:* Quality of Argument — 15 marks.
> *Full (13–15):* Clear thesis, sustained argument, evidence integrated from
> sources, counter-arguments addressed, conclusion supported.
> *Partial (8–12):* Clear thesis, some evidence, argument inconsistently
> sustained, counter-arguments mentioned but not developed.
> *Low (3–7):* Weak thesis, limited evidence, descriptive rather than
> argumentative.
> *Zero (0–2):* No discernible argument, unsupported assertions, or off-topic.

${rubricSource === "Compiled directly in ARS.md" && rubricText ? `
**Lecturer Provided Rubric:**
${rubricText}
` : ""}

### 4c — Rubric confirmation (mandatory for Options 2, 3 and 4)

Before proceeding past this section, the AI must:

1. Present its understanding of the rubric back to the lecturer — criterion
   names, marks available, and the scope split between Section 3a and 3b.
2. Ask the lecturer to confirm or correct this understanding.
3. Not proceed to marking until the lecturer has explicitly confirmed.

For Option 4 (copy-paste), the AI should additionally show the reconstructed
mark allocation table so the lecturer can check totals.

---

## Section 5 — Submission Evidence Available

**Purpose:** Tells the AI what materials it will receive, and what to do
when a material is missing.

**The lecturer may supply some or all of:**

${renderCheckboxOptions(evidenceOptions, evidenceItems)}

**Evidence handling rule:**

> The AI must mark only on the basis of evidence actually supplied. Do not
> assume the existence of files, code, screenshots, answers or functionality
> that cannot be verified from the materials provided. Where evidence is
> absent or partial, see Section 6.

### 5a — Evidence confirmation (mandatory)

Before marking begins, the AI must list back to the lecturer:

1. Which evidence items (from the list above) have been supplied.
2. Which items relevant to the assessment are absent.
3. Any evidence that appears to be present but unreadable or incomplete.

The lecturer then confirms — or supplies the missing items — before marking
proceeds.

---

## Section 6 — Insufficient Evidence Handling

**Purpose:** Defines what the AI does when it cannot verify evidence for a
criterion.

### 6a — Absence of evidence for a criterion

When a criterion in Section 3 cannot be evidenced at all, the AI must apply
the lecturer's chosen policy:

${renderRadioOptions(absenceOptions, absencePolicy)}

### 6b — Partial or unverifiable evidence

Where evidence exists but is partial or cannot be verified, the AI should:

- Award a mark consistent with the evidence that *is* verifiable.
- State clearly in the feedback what could not be verified and why.
- Flag the limitation in the Lecturer Moderation Notes.

### 6c — Referencing

If the lecturer supplies repository content, PDFs, Word documents or written
answers, the AI must check whether referencing is present and correctly
formatted, even if referencing sits outside the marked scope.

- **Missing entirely** → flag under Submission & Repository Concerns.
- **Present but malformed** → note the issue; apply the relevant criterion if
  referencing is in scope.
- **Referencing policy for this assessment:** ${referencingReq}

### 6d — Confirmation gate

Once the AI has assessed evidence coverage under 5a and 6a–6c, it must
confirm with the lecturer: *"Based on the evidence supplied, here is how I
intend to handle missing or unverifiable items. Do you confirm?"* Marking
proceeds only after confirmation.

---

## Section 7 — Lecturer Observations

**Purpose:** Captures the lecturer's pre-marking observations so they reach
the student feedback.

**Lecturer observations:**

${observations.split('\n').map(l => l.trim() ? `> - ${l}` : '').join('\n')}

**Rule for the AI:**

> Lecturer observations must always be incorporated into the student's
> **Submission & Repository Concerns** section. The AI must never remove,
> ignore, soften or contradict a lecturer observation. If an observation
> conflicts with evidence, state both and defer to the lecturer.

---

## Section 8 — Marking Philosophy

**Purpose:** Sets the standard against which every mark is judged.

${philosophyBlock}

---

## Section 9 — Special Cases

**Purpose:** Predefined mark reductions for common submission problems,
applied consistently across a cohort.

### 9a — Universal special cases

Reduce marks substantially where:

- No source file or written answer exists for a component that requires one.
- The required file is empty.
- The website / project was not supplied.
- Content is embedded within a single file where the rubric requires
  separation.
- Only screenshots are supplied where source files were required.
- Only summaries are supplied where full answers were required.
- No evidence of the required technique (responsive design, referencing,
  argumentation) is present.
- Repository or submission structure prevents verification.

> Do not award full marks for any criterion where implementation or content
> cannot be verified, even if the student asserts it exists.

### 9b — Theory-specific special cases

Reduce marks where:

- Answers are present but do not address the question asked.
- Answers are copied verbatim from sources without quotation or citation.
- Word count is substantially under or over the stated limit.
- Referencing is required but absent or malformed.
- Essay structure is absent (no introduction, body or conclusion as required).
- Multiple-choice / short-answer responses are ambiguous or incomplete.

### 9c — Assignment-specific special cases

${specialCases.split('\n').map(l => l.trim() ? `> - ${l}` : '').join('\n')}

---

## Section 10 — Output Format

**Purpose:** Defines how the AI presents its marking.

### 10a — Configurable marks table

Select the format required:

${renderRadioOptions(tableFormatOptions, tableFormatSelected)}

${marksTableFormat === "Format C — Custom" && formatCustom ? `**Custom Format Description:** ${formatCustom}` : ""}

**Example — Practical (Format A):**

| Criterion                                  | Mark     |
|--------------------------------------------|----------|
| External Stylesheet Created & Implemented  | x/10     |
| Default Style Code                         | x/5      |
| Typography Styles                          | x/5      |
| Layout Structure                           | x/5      |
| Decoration & Colour                        | x/5      |
| Pseudo-Classes Used                        | x/10     |
| **Subtotal — Desktop**                     | **xx/40**|
| Media Queries / Breakpoints                | x/10     |
| Adjusted Layout                            | x/5      |
| Adjusted Typography                        | x/5      |
| Adjusted Navigation Menu                   | x/5      |
| Adjusted Images                            | x/5      |
| **Subtotal — Responsive**                  | **xx/30**|
| **Total**                                  | **xx/70**|

**Example — Theory (Format B):**

| Question | Criterion                     | Mark     | Comment                                  |
|----------|-------------------------------|----------|------------------------------------------|
| Q1       | Accuracy of explanation       | x/10     | Key concept omitted.                     |
| Q2       | Use of evidence               | x/10     | Sources cited but not integrated.        |
| Q3       | Quality of argument           | x/15     | Thesis clear; counter-arguments missing. |
| Q4       | Referencing                   | x/5      | In-text citations present; no reference list. |
| **Total**|                               | **xx/40**|                                          |

### 10b — Mandatory narrative sections

Regardless of the marks table format, the following sections must appear for
every student, in this order:

1. **Student identification** — Name, student number, verification line
   (e.g. "Linked to HTML: Yes / No / Partially" for practical; "All questions
   answered: Yes / No" for theory).
2. **Marks table** — per 10a.
3. **Total mark** — stated plainly.
4. **Feedback paragraph(s)** — natural prose explaining deductions, missing
   work, incomplete implementation and incorrect implementation. Style
   governed by Section 13.
5. **Submission & Repository Concerns** — lecturer observations (Section 7)
   plus any submission issues found during marking.
6. **Areas That Need Attention** — forward-looking guidance aimed at the
   next phase.
7. **Lecturer Moderation Notes** — short lecturer-facing summary (Section 11).

**On Strengths sections:**

> Status: **${strengthsSection}**

---

## Section 11 — Lecturer Moderation Notes

**Purpose:** A short, high-signal summary of each student's submission for
the lecturer's moderation record.

**The Lecturer Moderation Notes must:**

- Be short (typically 1–3 sentences).
- Summarise the strongest concern, or the strongest confidence, in the mark.
- Flag anything the lecturer should double-check.

**Additional guidance for this assessment:**
${moderationExtra}

---

## Section 12 — Assignment-Specific Overrides

**Purpose:** Where the generic framework does not fit the assessment, or
where a previous marking round revealed a rule that should apply going
forward, record it here. Overrides **extend** the generic rules.

| # | Override                                                       | Applies to              |
|---|----------------------------------------------------------------|-------------------------|
${overrides.split('\n').filter(l => l.trim()).map((line, i) => `| ${i+1} | ${line} | [Criterion / Whole assessment] |`).join('\n') || '| 1 | None specified | N/A |'}

---

## Section 13 — Feedback Style and Sample Feedback

**Purpose:** Defines the tone, level of detail and style the AI should use
when writing student feedback.

### 13a — Feedback detail level

${renderRadioOptions(feedbackDetailOptions, feedbackDetailSelected)}

### 13b — Sample feedback

${sampleSupplied === "Yes" ? `**Samples supplied:**\n\n${sampleFeedbackText}` : "**No samples supplied.** AI generates generic feedback in the style chosen in 13a for the lecturer to refine in conversation."}

### 13c — Style confirmation (mandatory)

Before generating any student feedback, the AI must confirm with the
lecturer:

1. The feedback detail level (13a).
2. Whether samples were supplied, and whether the AI's proposed approach
   matches them (13b).
3. Any tone or wording preferences the lecturer wants applied.

Marking proceeds only after confirmation.

---

## Section 14 — Batch Processing Rules

**Purpose:** Governs how the AI handles multiple students in a single
submission set.

- Process only the number of students requested by the lecturer per response.
- Review each student separately.
- Do not merge, compare or group students in the output.
- Maintain consistent standards across the cohort.
- Compare quality against previously moderated submissions where supplied.

**Batch rules specific to this assessment:**

> ${batchRules}

---

## Section 15 — Assessment Files Supplied

**Purpose:** A checklist so the lecturer knows what to upload alongside this
ARS.

**Upload checklist (tick as supplied):**

${renderCheckboxOptions(filesOptions, filesChecked)}

> If any item is missing, the lecturer should state so in the chat. The AI
> will follow Section 6 for anything not supplied.

---

## Section 16 — Instructions to the AI on Receipt

**Purpose:** Converts the specification into action. The AI follows this
section on first reading the ARS, and again at each confirmation gate.

### 16a — On receipt

1. Confirm you have read this ARS in full, and list the student submissions
   received.
2. Confirm your role per Section 2 and the marking scope per Section 3.
3. Ask the lecturer to clarify anything unclear before proceeding.

### 16b — Confirmation gates (all four required before marking begins)

The AI must obtain explicit confirmation from the lecturer at each gate:

- **Gate 1 — Scope and role.** Confirm role (Section 2) and marking scope
  (Section 3a / 3b / 3c).
- **Gate 2 — Rubric.** Confirm rubric source (Section 4a) and, for Options
  2–4, confirm the AI's reconstruction of the rubric (Section 4c).
- **Gate 3 — Evidence and policy.** Confirm evidence supplied (Section 5a)
  and the insufficient-evidence policy (Section 6d).
- **Gate 4 — Feedback style.** Confirm feedback detail level and sample
  availability (Section 13c).

Do not begin marking until all four gates are confirmed.

### 16c — During marking

- Apply Sections 4, 8, 9 and 12 consistently.
- Apply Section 6 wherever evidence is missing or unverifiable.
- Produce Section 10b in full for every student.

### 16d — After marking (and after every batch of 10)

- Check that every student's output includes Sections 10b(1)–(7).
- Check that lecturer observations from Section 7 appear under
  Submission & Repository Concerns.
- Present the batch according to Section 14.
- **Crucial Step:** After every batch of submissions, ask the lecturer:
  *"Are you satisfied with the marking and feedback so far? If any adjustments
  to the tone, policy, or rubric interpretations were made during this batch,
  would you like to update Section 12 (Overrides) for use in your next chat?"*

---

*End of ARS.md*

---
*Generated on ${new Date().toLocaleDateString()} by ARS.md Compiler*
`;

  // Build the checklist for the output modal (side-panel preview)
  const checklist = [];
  if (filesChecklist.length > 0) {
    filesChecklist.forEach(f => checklist.push(f));
  }
  if (!checklist.includes("This ARS.md file (completed)")) {
    checklist.unshift("This ARS.md file (completed)");
  }

  return { markdown: md, checklist };
}