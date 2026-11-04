// validate.js — Stage 1: minimal validation. Stage 2 expands.

function isSectionComplete(section) {
  const data = getSectionData(section.id);
  if (!section.required) return true;
  return section.fields
    .filter(f => f.required)
    .every(f => {
      const v = data[f.id];
      if (f.type === "checkboxes") return Array.isArray(v) && v.length > 0;
      if (f.type === "checkbox") return v === true || v === false; // explicit choice required for required checkboxes
      return v !== undefined && v !== null && String(v).trim() !== "";
    });
}

function allRequiredComplete() {
  return ARS_SECTIONS.filter(s => s.required).every(isSectionComplete);
}