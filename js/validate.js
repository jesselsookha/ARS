// validate.js

function isSectionComplete(section) {
  const data = getSectionData(section.id);
  
  // For optional sections, if there's any data, it's considered "complete" for display purposes.
  if (!section.required) {
    return hasAnyValue(data);
  }

  // For required sections, check if all required fields are filled.
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

// NEW: Calculate progress including optional sections
function calculateProgress() {
  let totalWeight = 0;
  let completedWeight = 0;

  ARS_SECTIONS.forEach(section => {
    // Compulsory sections are always counted.
    // Optional sections are only counted IF the user has filled something in.
    if (section.required || hasAnyValue(getSectionData(section.id))) {
      totalWeight += 1;
      if (isSectionComplete(section)) {
        completedWeight += 1;
      }
    }
  });

  // Prevent division by zero
  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}