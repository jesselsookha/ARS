// app.js

function init() {
  const hasDraft = loadDraft();
  renderSidebar();
  renderWizard();
  renderIntroScreen(hasDraft); 
  goToSection(-1); // Start on Intro
  wireNav();
  wireKeyboard();
  wireModal();

  applyStateToDOM();
}

function applyStateToDOM() {
  ARS_SECTIONS.forEach(section => {
    const form = document.getElementById(`form-${section.id}`);
    if (!form) return;

    section.fields.forEach(field => {
      const val = getSectionValue(section.id, field.id);
      if (val === undefined || val === null || val === "") return;

      const id = `f-${section.id}-${field.id}`;

      if (field.type === "text" || field.type === "number" || field.type === "textarea" || field.type === "select") {
        const el = form.querySelector(`[data-field="${field.id}"]`);
        if (el) el.value = val;
      } 
      else if (field.type === "checkbox") {
        const el = form.querySelector(`[data-field="${field.id}"]`);
        if (el) el.checked = val === true;
      } 
      else if (field.type === "radio") {
        // Val is a single string, so we check the input that matches
        const el = form.querySelector(`input[name="${id}"][value="${val}"]`);
        if (el) el.checked = true;
      } 
      else if (field.type === "checkboxes") {
        // Val is an array of strings, so we loop through and check them
        if (Array.isArray(val)) {
          val.forEach(optionValue => {
            const el = form.querySelector(`input[data-field="${field.id}"][value="${optionValue}"]`);
            if (el) el.checked = true;
          });
        }
      }
    });
  });

  // Also restore the disabled state of the excluded sections if markWhole was checked
  if (getSectionValue("scope", "markWhole")) {
    applyConditionalLogic("scope", "markWhole", true);
  }
}

function renderIntroScreen(hasDraft) {
  const wizard = document.getElementById("wizard");
  const intro = document.createElement("div");
  intro.className = "intro-screen";
  
  // The standard intro text explaining the tool
  const standardIntro = `
    <p>The <strong>Assessment Review Specification (ARS)</strong> is a structured instruction manual for an AI. By filling out this form, you are teaching the AI exactly how to act as your second marker or moderator.</p>
    
    <p><strong>What you will produce:</strong><br>
    Once you complete the compulsory sections and click "Compile", this tool will generate an <code>ARS.md</code> file. You will download this file and upload it into a new AI chat alongside your student submissions, question paper, and rubric.</p>

    <p><strong>The Process:</strong></p>
    <ul>
      <li><strong>Compulsory Sections (Amber Dots):</strong> There are 9 compulsory sections. You must fill these out so the AI understands its role, your rubric, the scope of what it is allowed to mark, and how you want feedback structured.</li>
      <li><strong>Optional Sections (Tea Green Dots):</strong> These sections (like Lecturer Observations, Overrides, or Sample Feedback) are not strictly required, but they will make the AI's marking more accurate to your preferences.</li>
      <li><strong>Completion:</strong> As you fill in fields, the dots in the sidebar will turn blue, and the progress bar will update.</li>
    </ul>
    
    <p><strong>What happens after you compile?</strong><br>
    You will start a new conversation with an AI tool. You will upload the compiled ARS.md, and then upload your students' work. The AI will read the ARS.md, confirm it understands the instructions, and then begin marking.</p>
  `;

  let html = "";

  if (hasDraft) {
    // If a draft exists, show the resume prompt
    html = `
    <div style="background: var(--tint); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; border-left: 4px solid var(--primary);">
      <h2 style="margin-bottom: 0.5rem; font-size: 1.25rem;">Resume Draft: ${ARS_STATE.draftName || "Untitled Assessment"}</h2>
      <p style="margin-bottom: 1rem;">You have a saved draft. Would you like to continue where you left off?</p>
      <button class="btn btn--primary" onclick="goToSection(0)">Resume Draft →</button>
      <button class="btn btn--ghost" style="margin-left: 0.5rem;" onclick="startNewDraft()">Start New ARS</button>
    </div>
    <h2>Start a New Assessment</h2>
    ` + standardIntro;
  } else {
    // If no draft, show the name input field
    html = `
    <h2>Welcome to the ARS.md Compiler</h2>
    <div style="margin-bottom: 2rem;">
      <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">What is the name of this assessment? (Optional)</label>
      <input type="text" id="input-draft-name" placeholder="e.g., WEDE2020 Part 2" style="width: 100%; max-width: 400px; padding: 0.6rem; border: 1.5px solid var(--rule); border-radius: var(--radius-sm); font-family: var(--font-body);">
    </div>
    ` + standardIntro + `
    <button class="btn btn--primary" onclick="setDraftName(); goToSection(0);">Begin Assessment Overview →</button>
    `;
  }

  intro.innerHTML = html;
  wizard.prepend(intro);
}

// Captures the draft name from the input and saves it
function setDraftName() {
  const nameInput = document.getElementById("input-draft-name");
  if (nameInput && nameInput.value.trim()) {
    ARS_STATE.draftName = nameInput.value.trim();
    saveDraft();
  }
}

// Clears the draft and reloads the page to start fresh
function startNewDraft() {
  clearDraft();
  location.reload(); 
}

function goToSection(index, skipValidation = false) {
  // If moving forward, validate the current section first
  const currentIndex = ARS_STATE.currentSectionIndex;
  if (!skipValidation && index > currentIndex && currentIndex >= 0) {
    const isValid = validateCurrentSection(currentIndex);
    if (!isValid) return; // Stop if invalid
  }

  ARS_STATE.currentSectionIndex = index;
  const wizardContainer = document.getElementById("wizard");
  wizardContainer.classList.add("is-active");

  // Hide all views
  document.querySelectorAll(".wizard-section, .intro-screen").forEach(el => el.classList.remove("is-active"));

  if (index === -1) {
    // Show Intro
    document.querySelector(".intro-screen").classList.add("is-active");
    document.getElementById("nav-counter").textContent = "Introduction";
    document.getElementById("btn-prev").disabled = true;
    document.getElementById("btn-next").disabled = false; 
  } else {
    // Show specific section
    if (index < 0 || index >= ARS_SECTIONS.length) return;
    const target = document.querySelector(`.wizard-section[data-index="${index}"]`);
    if (target) target.classList.add("is-active");
    
    document.getElementById("nav-counter").textContent = `Section ${index + 1} of ${ARS_SECTIONS.length}`;
    document.getElementById("btn-prev").disabled = false;
    document.getElementById("btn-next").disabled = index === ARS_SECTIONS.length - 1;
  }

  updateSidebarStates();
  updateProgressUI();

  if (window.innerWidth <= 900) {
    document.getElementById("workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function wireNav() {
  document.getElementById("btn-prev").addEventListener("click", () => {
    if (ARS_STATE.currentSectionIndex === -1) return;
    goToSection(ARS_STATE.currentSectionIndex - 1, true); // Skip validation when going backwards
  });
  
  document.getElementById("btn-next").addEventListener("click", () => {
    goToSection(ARS_STATE.currentSectionIndex + 1);
  });
  
  document.getElementById("btn-compile").addEventListener("click", openOutputModal);
  
  // Reset Button
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the form? All data will be lost.")) {
      startNewDraft();
    }
  });
}

function wireKeyboard() {
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === "ArrowRight") {
      const next = ARS_STATE.currentSectionIndex + 1;
      if (next < ARS_SECTIONS.length) goToSection(next);
    } else if (e.key === "ArrowLeft") {
      const prev = ARS_STATE.currentSectionIndex - 1;
      if (prev >= -1) goToSection(prev, true);
    }
  });
}

function updateSidebarStates() {
  document.querySelectorAll(".sidebar__item").forEach((el, i) => {
    const isActive = i === ARS_STATE.currentSectionIndex;
    const isComplete = isSectionComplete(ARS_SECTIONS[i]);
    const isRequired = ARS_SECTIONS[i].required;

    el.classList.toggle("is-active", isActive);
    el.classList.toggle("is-complete", isComplete);
    el.classList.toggle("is-required", isRequired);
  });
}

function updateProgressUI() {
  const pct = calculateProgress();
  
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-bar").setAttribute("aria-valuenow", pct);
  
  const required = ARS_SECTIONS.filter(s => s.required);
  const done = required.filter(s => isSectionComplete(s)).length;
  
  document.getElementById("progress-text").textContent = `${done} of ${required.length} required sections complete`;
  document.getElementById("sidebar-progress-pct").textContent = `${pct}%`;
  
  document.getElementById("btn-compile").disabled = !allRequiredComplete();
}

function markSectionProgress(sectionId) {
  ARS_STATE.completed[sectionId] = hasAnyValue(getSectionData(sectionId));
  updateProgressUI();
  updateSidebarStates();
}

function wireModal() {
  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", () => closeOutputModal());
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeOutputModal(); });
  
  document.getElementById("btn-copy").addEventListener("click", () => {
    const md = document.getElementById("output-preview").textContent;
    navigator.clipboard.writeText(md).then(() => {
      document.getElementById("btn-copy").textContent = "Copied ✓";
      setTimeout(() => document.getElementById("btn-copy").textContent = "Copy ARS.md", 1500);
    });
  });
  
  document.getElementById("btn-download").addEventListener("click", () => {
    const md = document.getElementById("output-preview").textContent;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ARS.md";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function openOutputModal() {
  const { markdown, checklist } = compileARS();
  const cl = document.getElementById("output-checklist");
  cl.innerHTML = `
    <h3>Upload alongside ARS.md</h3>
    <ul>${checklist.length ? checklist.map(i => `<li>${i}</li>`).join("") : "<li>No additional files specified.</li>"}</ul>
  `;
  document.getElementById("output-preview").textContent = markdown;
  document.getElementById("output-modal").classList.add("is-open");
  document.getElementById("output-modal").setAttribute("aria-hidden", "false");
}

function closeOutputModal() {
  document.getElementById("output-modal").classList.remove("is-open");
  document.getElementById("output-modal").setAttribute("aria-hidden", "true");
}

document.addEventListener("DOMContentLoaded", init);