// state.js — central form state

const ARS_STATE = {
  currentSectionIndex: 0,
  data: {},          // { sectionId: { fieldId: value } }
  completed: {}      // { sectionId: true/false }
};

function getSectionValue(sectionId, fieldId) {
  return ARS_STATE.data[sectionId]?.[fieldId] ?? "";
}

function setSectionValue(sectionId, fieldId, value) {
  if (!ARS_STATE.data[sectionId]) ARS_STATE.data[sectionId] = {};
  ARS_STATE.data[sectionId][fieldId] = value;
}

function getSectionData(sectionId) {
  return ARS_STATE.data[sectionId] || {};
}