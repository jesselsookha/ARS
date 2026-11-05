// app.js

function init() {
  renderSidebar();
  renderWizard();
  renderIntroScreen(); 
  goToSection(-1); // Start on Intro
  wireNav();
  wireKeyboard();
  wireModal();
}

function renderIntroScreen() {
  const wizard = document.getElementById("wizard");
  const intro = document.createElement("div");
  intro.className = "intro-screen";
  intro.innerHTML = `
    <h2>Welcome to the ARS.md Compiler</h2>
    <p>This tool helps you build an <strong>Assessment Review Specification (ARS)</strong> to upload to an AI chat. It ensures the AI understands exactly how you want to mark your students.</p>
    
    <p><strong>How to use this tool:</strong></p>
    <ul>
      <li>Fill in the sections using the <strong>Next</strong> button or the <strong>Left/Right Arrow keys</strong>.</li>
      <li>You can jump to any section using the menu on the left.</li>
      <li>Sections marked with an <strong>amber asterisk (*)</strong> are compulsory.</li>
      <li><strong>Sidebar Legend:</strong> A <strong>Dusk Blue</strong> dot means the section is compulsory and needs attention. A <strong>Pacific Blue</strong> filled dot means the section is complete. A grey dot means the section is optional.</li>
      <li>Once all compulsory sections are complete, the <strong>Compile ARS.md</strong> button in the bottom left will become active.</li>
    </ul>
    <button class="btn btn--primary" onclick="goToSection(0)">Begin →</button>
  `;
  wizard.prepend(intro);
}

function goToSection(index) {
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
    goToSection(ARS_STATE.currentSectionIndex - 1);
  });
  document.getElementById("btn-next").addEventListener("click", () => {
    goToSection(ARS_STATE.currentSectionIndex + 1);
  });
  document.getElementById("btn-compile").addEventListener("click", openOutputModal);
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
      if (prev >= -1) goToSection(prev);
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
  const required = ARS_SECTIONS.filter(s => s.required);
  const total = required.length;
  const done = required.filter(s => isSectionComplete(s)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-bar").setAttribute("aria-valuenow", pct);
  document.getElementById("progress-text").textContent = `${done} of ${total} required sections complete`;
  document.getElementById("sidebar-progress-pct").textContent = `${pct}%`;
  
  document.getElementById("btn-compile").disabled = !allRequiredComplete();
}

function markSectionProgress(sectionId) {
  ARS_STATE.completed[sectionId] = hasAnyValue(getSectionData(sectionId));
  updateProgressUI();
  updateSidebarStates();
}

// ... Keep existing wireModal() and openOutputModal() ...