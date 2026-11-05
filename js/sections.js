// sections.js

const ARS_SECTIONS = [
  {
    id: "overview",
    number: 1,
    title: "Assessment Overview",
    purpose: "Establishes the identity and context of the assessment. The AI uses this to frame every subsequent judgement.",
    required: true,
    fields: [
      { id: "moduleName", label: "Module name", type: "text", required: true, placeholder: "e.g. Web Development (Introduction)", help: "The full name of the module." },
      { id: "moduleCode", label: "Module code", type: "text", required: true, placeholder: "e.g. WEDE5020", help: "The institutional code for the module." },
      { id: "qualification", label: "Qualification", type: "text", required: false, help: "The degree or diploma this module belongs to." },
      { id: "lecturer", label: "Lecturer", type: "text", required: true, help: "Your name." },
      { id: "assessmentName", label: "Assessment name", type: "text", required: true, placeholder: "e.g. PoE Part 2", help: "The specific name of this assessment." },
      { id: "assessmentType", label: "Assessment type", type: "select", required: true, options: ["Test","Assignment","PoE","Practical","Examination","Project","Essay","Other"], help: "What kind of assessment is this?" },
      { id: "assessmentMode", label: "Assessment mode", type: "select", required: true, options: ["Practical","Theory","Mixed"], help: "Practical = artefact-based. Theory = written answers. Mixed = both." },
      { id: "semester", label: "Semester / term", type: "text", required: false },
      { id: "totalMarks", label: "Total marks (full assessment)", type: "number", required: true, help: "The total marks for the entire assessment." },
      { id: "scopedMarks", label: "Marks within AI scope", type: "number", required: true, help: "How many marks is the AI actually marking? (May be less than total if you are only marking one section)." },
      { id: "dueDate", label: "Due date / submission window", type: "text", required: false }
    ]
  },
  {
    id: "purpose",
    number: 2,
    title: "Purpose of AI Review",
    purpose: "Defines the role the AI is playing in this conversation.",
    required: true,
    fields: [
      { id: "roles", label: "Roles (select all that apply)", type: "checkboxes", required: true, options: ["Second marker","Moderator","Feedback assistant","Quality assurance reviewer","Other"] },
      { id: "roleDescription", label: "Role description in the lecturer's own words", type: "textarea", required: true, help: "Example: 'The AI should act as a second marker, assessing only the CSS sections. It should not assess HTML or JavaScript.'" }
    ]
  },
  {
    id: "scope",
    number: 3,
    title: "Marking Scope",
    purpose: "Defines what the AI may score, and what it must not score.",
    required: true,
    fields: [
      { id: "includedSections", label: "Included sections (the AI MAY score)", type: "textarea", required: true, help: "One per line, format: Section name | marks available" },
      { id: "excludedSections", label: "Excluded sections (the AI MUST NOT score)", type: "textarea", required: false, help: "One per line. Leave blank if AI marks the whole assessment." },
      { id: "markWhole", label: "AI is authorised to score the entire assessment", type: "checkbox", required: false, help: "If ticked, Section 3b (excluded) is treated as not applicable." }
    ]
  },
  {
    id: "rubric",
    number: 4,
    title: "Full Rubric",
    purpose: "The complete marking rubric. The AI reads this so it understands the assessment, even where Section 3 restricts marking.",
    required: true,
    fields: [
      { id: "rubricSource", label: "Rubric source", type: "radio", required: true, options: ["Compiled directly in ARS.md","Assessment document uploaded","Markdown conversion uploaded","Copy-paste from source document"], help: "Option 4 exists for institutional Word documents that AI tools cannot open — copy the rubric text directly into the chat." },
      { id: "rubricText", label: "Rubric content (if compiling directly)", type: "textarea", required: false, help: "Paste the rubric criteria and marks here. Not needed if you've chosen to upload a document instead." }
    ]
  },
  {
    id: "evidence",
    number: 5,
    title: "Submission Evidence Available",
    purpose: "What the AI will receive, and what to do when something is missing.",
    required: true,
    fields: [
      { id: "evidenceItems", label: "Evidence the lecturer will supply", type: "checkboxes", required: true, options: ["Source code / repository","Screenshots","Markdown or plain-text files","PDF files","Word documents","Student essays or written answers","Repository notes / commit history","Lecturer observations","Sample feedback"] }
    ]
  },
  {
    id: "insufficientEvidence",
    number: 6,
    title: "Insufficient Evidence Handling",
    purpose: "What the AI does when it cannot verify evidence for a criterion.",
    required: true,
    fields: [
      { id: "absencePolicy", label: "Policy for absent evidence", type: "radio", required: true, options: ["Award zero and note 'no evidence provided'","Award zero and flag for lecturer review","Pause and request additional materials"] },
      { id: "referencingRequired", label: "Referencing", type: "select", required: true, options: ["Required and assessed","Required but not assessed","Not required"], help: "Referencing is always flagged to the lecturer if missing, even if not assessed." }
    ]
  },
  {
    id: "lecturerObservations",
    number: 7,
    title: "Lecturer Observations",
    purpose: "Pre-marking observations from the lecturer. These must reach the student feedback.",
    required: false,
    fields: [
      { id: "observations", label: "Observations (paste below)", type: "textarea", required: false, help: "One per line. The AI must incorporate these verbatim into feedback. E.g. 'Website not pushed to repository.' or 'Referencing entirely absent.'" }
    ]
  },
  {
    id: "philosophy",
    number: 8,
    title: "Marking Philosophy",
    purpose: "Sets the standard against which every mark is judged.",
    required: false,
    fields: [
      { id: "philosophyOverride", label: "Override philosophy (optional)", type: "textarea", required: false, help: "Leave blank to use the standard ARS.md philosophy (evidence-based, no generosity, no marks for mere existence). Only fill in if you want to deviate." }
    ]
  },
  {
    id: "specialCases",
    number: 9,
    title: "Special Cases",
    purpose: "Predefined mark reductions for common submission problems.",
    required: false,
    fields: [
      { id: "specialCases", label: "Assignment-specific special cases", type: "textarea", required: false, help: "One per line. Example: 'Cap External Stylesheet at 5/10 if only one HTML page exists.'" }
    ]
  },
  {
    id: "outputFormat",
    number: 10,
    title: "Output Format",
    purpose: "How the AI presents its marking.",
    required: true,
    fields: [
      { id: "marksTableFormat", label: "Marks table format", type: "radio", required: true, options: ["Format A — Marks only","Format B — Marks and comments","Format C — Custom"] },
      { id: "formatCustom", label: "Custom format description (if Format C)", type: "textarea", required: false },
      { id: "strengthsSection", label: "Include a Strengths section", type: "checkbox", required: false, help: "Standard ARS.md omits Strengths. Tick only if you want one added." }
    ]
  },
  {
    id: "moderationNotes",
    number: 11,
    title: "Lecturer Moderation Notes",
    purpose: "Short, high-signal summary for the lecturer's own moderation record.",
    required: false,
    fields: [
      { id: "moderationNotesExtra", label: "Additional guidance (optional)", type: "textarea", required: false }
    ]
  },
  {
    id: "overrides",
    number: 12,
    title: "Assignment-Specific Overrides",
    purpose: "Rules that extend the generic framework for this assessment.",
    required: false,
    fields: [
      { id: "overrides", label: "Overrides in force", type: "textarea", required: false, help: "One per line. Example: 'Cap External Stylesheet at 5/10 if only one HTML page exists.'" }
    ]
  },
  {
    id: "feedbackStyle",
    number: 13,
    title: "Feedback Style and Sample Feedback",
    purpose: "Defines the tone, detail level and style of student feedback.",
    required: true,
    fields: [
      { id: "feedbackDetail", label: "Feedback detail level", type: "radio", required: true, options: ["Extended prose","Concise prose","Point-form"] },
      { id: "sampleFeedbackSupplied", label: "Sample feedback supplied", type: "checkbox", required: false },
      { id: "sampleFeedback", label: "Sample feedback", type: "textarea", required: false, help: "Paste 2–3 examples to teach the AI your preferred tone." }
    ]
  },
  {
    id: "batch",
    number: 14,
    title: "Batch Processing Rules",
    purpose: "Governs handling of multiple students in one submission set.",
    required: false,
    fields: [
      { id: "batchRules", label: "Batch rules specific to this assessment", type: "textarea", required: false }
    ]
  },
  {
    id: "files",
    number: 15,
    title: "Assessment Files Supplied",
    purpose: "Checklist so you know what other documents you need to bring into the AI chat.",
    required: true,
    fields: [
      { 
        id: "filesChecklist", 
        label: "I will upload the following documents to the AI chat alongside this ARS.md", 
        type: "checkboxes", 
        required: true, 
        options: ["Question paper / brief","Full marking rubric","Memorandum","Sample feedback","Student submissions","Lecturer observations","Other"],
        help: "This tool only generates the ARS.md. Select the other documents you are responsible for providing to the AI."
      }
    ]
  }
];