// validate.js

function isSectionComplete(section) {
  const data = getSectionData(section.id);
  if (!section.required) return hasAnyValue(data);

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

function calculateProgress() {
  let totalWeight = 0;
  let completedWeight = 0;

  ARS_SECTIONS.forEach(section => {
    if (section.required || hasAnyValue(getSectionData(section.id))) {
      totalWeight += 1;
      if (isSectionComplete(section)) {
        completedWeight += 1;
      }
    }
  });

  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}

// NEW: Visually validate the current section before moving on
function validateCurrentSection(index) {
  const section = ARS_SECTIONS[index];
  if (!section || !section.required) return true; // Skip validation for optional sections
  
  let isValid = true;
  const data = getSectionData(section.id);

  section.fields.forEach(field => {
    if (!field.required) return;
    
    const v = data[field.id];
    let isFieldValid = true;
    
    if (field.type === "checkboxes") {
      isFieldValid = Array.isArray(v) && v.length > 0;
    } else if (field.type === "checkbox") {
      isFieldValid = v === true || v === false;
    } else {
      isFieldValid = v !== undefined && v !== null && String(v).trim() !== "";
    }

    // If not valid, show the error
    if (!isFieldValid) {
      isValid = false;
      const id = `f-${section.id}-${field.id}`;
      const wrap = document.getElementById(`wrap-${id}`) || document.getElementById(`${id}-group`);
      if (wrap) wrap.classList.add("has-error");
    }
  });

  return isValid;
}

// NEW: Handle conditional logic (disabling fields based on other choices)
function applyConditionalLogic(sectionId, fieldId, value) {
  // Section 3: If "Mark whole assessment" is checked, disable the excluded sections field
  if (sectionId === "scope" && fieldId === "markWhole") {
    const excludedField = document.querySelector(`[data-field="excludedSections"]`);
    if (excludedField) {
      excludedField.disabled = value;
      if (value) excludedField.value = ""; // Clear it if disabled
    }
  }
}