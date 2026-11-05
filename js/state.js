// state.js — central form state

const ARS_STATE = {
  currentSectionIndex: 0,
  data: {},          // { sectionId: { fieldId: value } }
  completed: {},     // { sectionId: true/false }
  draftName: ""      // Tracks the name of the draft
};

// Load draft from LocalStorage on startup
function loadDraft() {
  const saved = localStorage.getItem("ars_compiler_draft");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      ARS_STATE.data = parsed.data || {};
      ARS_STATE.draftName = parsed.draftName || "";
      ARS_STATE.completed = parsed.completed || {};
      return true;
    } catch (e) {
      console.error("Failed to load draft", e);
      return false;
    }
  }
  return false;
}

// Save draft to LocalStorage
function saveDraft() {
  const toSave = {
    data: ARS_STATE.data,
    completed: ARS_STATE.completed,
    draftName: ARS_STATE.draftName
  };
  localStorage.setItem("ars_compiler_draft", JSON.stringify(toSave));
}

function clearDraft() {
  localStorage.removeItem("ars_compiler_draft");
  ARS_STATE.data = {};
  ARS_STATE.completed = {};
  ARS_STATE.draftName = "";
}

function getSectionValue(sectionId, fieldId) {
  return ARS_STATE.data[sectionId]?.[fieldId] ?? "";
}

function setSectionValue(sectionId, fieldId, value) {
  if (!ARS_STATE.data[sectionId]) ARS_STATE.data[sectionId] = {};
  ARS_STATE.data[sectionId][fieldId] = value;
  saveDraft(); // Auto-save on change
}

function getSectionData(sectionId) {
  return ARS_STATE.data[sectionId] || {};
}