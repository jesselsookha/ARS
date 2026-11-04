// render.js — renders the wizard sections

function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = "";
  ARS_SECTIONS.forEach((section, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sidebar__item" + (section.required ? " is-required" : "");
    btn.dataset.index = index;
    btn.innerHTML = `
      <span class="sidebar__item-dot"></span>
      <span class="sidebar__item-label">${section.number}. ${section.title}</span>
    `;
    btn.addEventListener("click", () => goToSection(index));
    nav.appendChild(btn);
  });
}

function renderWizard() {
  const wizard = document.getElementById("wizard");
  wizard.innerHTML = "";
  ARS_SECTIONS.forEach((section, index) => {
    const div = document.createElement("div");
    div.className = "wizard-section";
    div.dataset.index = index;
    div.id = `section-${section.id}`;
    div.innerHTML = `
      <header class="section-header">
        <p class="section-header__eyebrow">Section ${section.number}${section.required ? " · required" : " · optional"}</p>
        <h2 class="section-header__title">${section.title}</h2>
        <p class="section-header__purpose">${section.purpose}</p>
      </header>
      <form class="section-form" id="form-${section.id}">
        ${section.fields.map(field => renderField(section.id, field)).join("")}
      </form>
    `;
    wizard.appendChild(div);
    wireFieldEvents(section.id, section.fields);
  });
}

function renderField(sectionId, field) {
  const req = field.required ? `<span class="field__required">*</span>` : "";
  const help = field.help ? `<p class="field__help">${field.help}</p>` : "";
  const id = `f-${sectionId}-${field.id}`;

  let control = "";

  if (field.type === "text" || field.type === "number") {
    control = `<input type="${field.type}" class="field__control" id="${id}" data-field="${field.id}" placeholder="${field.placeholder || ""}">`;
  } else if (field.type === "textarea") {
    control = `<textarea class="field__control field__control--textarea" id="${id}" data-field="${field.id}" placeholder="${field.placeholder || ""}"></textarea>`;
  } else if (field.type === "select") {
    control = `<select class="field__control field__control--select" id="${id}" data-field="${field.id}">
      <option value="">— select —</option>
      ${field.options.map(o => `<option value="${o}">${o}</option>`).join("")}
    </select>`;
  } else if (field.type === "checkbox") {
    return `<div class="field field--inline">
      <input type="checkbox" id="${id}" data-field="${field.id}">
      <label class="field__label" for="${id}">${field.label}${req}</label>
      ${help}
    </div>`;
  } else if (field.type === "radio") {
    return `<fieldset class="field">
      <legend class="field__label">${field.label}${req}</legend>
      ${help}
      ${field.options.map(o => `
        <div class="field--inline">
          <input type="radio" name="${id}" id="${id}-${slug(o)}" value="${o}" data-field="${field.id}">
          <label class="field__label" for="${id}-${slug(o)}">${o}</label>
        </div>
      `).join("")}
    </fieldset>`;
  } else if (field.type === "checkboxes") {
    return `<fieldset class="field">
      <legend class="field__label">${field.label}${req}</legend>
      ${help}
      ${field.options.map(o => `
        <div class="field--inline">
          <input type="checkbox" id="${id}-${slug(o)}" value="${o}" data-field="${field.id}" data-multi="true">
          <label class="field__label" for="${id}-${slug(o)}">${o}</label>
        </div>
      `).join("")}
    </fieldset>`;
  }

  return `<div class="field">
    <label class="field__label" for="${id}">${field.label}${req}</label>
    ${help}
    ${control}
  </div>`;
}

function wireFieldEvents(sectionId, fields) {
  const form = document.getElementById(`form-${sectionId}`);
  if (!form) return;

  fields.forEach(field => {
    const id = `f-${sectionId}-${field.id}`;
    if (field.type === "radio") {
      form.querySelectorAll(`input[name="${id}"]`).forEach(el => {
        el.addEventListener("change", e => {
          setSectionValue(sectionId, field.id, e.target.value);
          markSectionProgress(sectionId);
        });
      });
    } else if (field.type === "checkboxes") {
      form.querySelectorAll(`input[data-field="${field.id}"]`).forEach(el => {
        el.addEventListener("change", () => {
          const values = Array.from(form.querySelectorAll(`input[data-field="${field.id}"]:checked`)).map(i => i.value);
          setSectionValue(sectionId, field.id, values);
          markSectionProgress(sectionId);
        });
      });
    } else if (field.type === "checkbox") {
      const el = form.querySelector(`input[data-field="${field.id}"]`);
      if (el) el.addEventListener("change", e => {
        setSectionValue(sectionId, field.id, e.target.checked);
        markSectionProgress(sectionId);
      });
    } else {
      const el = form.querySelector(`[data-field="${field.id}"]`);
      if (el) el.addEventListener("input", e => {
        setSectionValue(sectionId, field.id, e.target.value);
        markSectionProgress(sectionId);
      });
    }
  });
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function markSectionProgress(sectionId) {
  // Placeholder for Stage 2 validation — simply records that a section has activity.
  ARS_STATE.completed[sectionId] = hasAnyValue(getSectionData(sectionId));
  updateProgressUI();
  updateSidebarStates();
}

function hasAnyValue(obj) {
  return Object.values(obj).some(v =>
    Array.isArray(v) ? v.length > 0 : (typeof v === "boolean" ? v : String(v || "").trim() !== "")
  );
}