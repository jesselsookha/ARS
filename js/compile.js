// compile.js — Stage 1: minimal stub. Stage 2 fleshes out.
// For now, compile() assembles a markdown preview and returns the checklist items.

function compileARS() {
  const lines = [];
  const checklist = [];

  lines.push(`# Assessment Review Specification (ARS)\n`);
  lines.push(`**Version:** 1.0`);
  lines.push(`**Date:** ${new Date().toISOString().slice(0,10)}`);
  lines.push(`**Module:** ${getSectionValue("overview","moduleCode") || ""} — ${getSectionValue("overview","moduleName") || ""}\n`);
  lines.push(`---\n`);

  ARS_SECTIONS.forEach(section => {
    const data = getSectionData(section.id);
    if (!hasAnyValue(data)) return;

    lines.push(`## Section ${section.number} — ${section.title}\n`);
    lines.push(`**Purpose:** ${section.purpose}\n`);

    section.fields.forEach(field => {
      const v = data[field.id];
      if (!hasAnyValue({ v })) return;
      const display = Array.isArray(v) ? v.join(", ") : (typeof v === "boolean" ? (v ? "Yes" : "No") : v);
      lines.push(`- **${field.label}:** ${display}`);
    });
    lines.push("");
  });

  // Build checklist from Sections 13 and 15
  const files = getSectionData("files").filesChecklist || [];
  files.forEach(f => checklist.push(f));
  if (getSectionData("feedbackStyle").sampleFeedbackSupplied) checklist.push("Sample feedback (per Section 13)");
  if (getSectionData("lecturerObservations").observations) checklist.push("Lecturer observations (per Section 7)");

  return { markdown: lines.join("\n"), checklist };
}