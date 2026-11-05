// validate.js

function isSectionComplete(section) {
  const data = getSectionData(section.id);
  
  // If optional, it's only "complete" if they actually filled something in.
  // But it doesn't block the compile button.
  if (!section.required) {
    return hasAnyValue(data);
  }

  // If required, check all required fields
  return section.fields
    .filter(f => f.required)
    .every(f => {
      const v = data[f.id];
      if (f.type === "checkboxes") return Array.isArray(v) && v.length > 0;
      if (f.type === "checkbox") return v === true || v === false; 
      return v !== undefined && v !== null && String(v).trim() !== "";
    });
}

function allRequiredComplete() {
  return ARS_SECTIONS.filter(s => s.required).every(isSectionComplete);
}