// app.js — bootstrap and event wiring

function init() {
  renderSidebar();
  renderWizard();
  goToSection(0);
  wireNav();
  wireModal();
}

function goToSection(index) {
  if (index < 0 || index >= ARS_SECTIONS.length) return;
  ARS_STATE.currentSectionIndex = index;
  
  // 1. Show the main wizard container
  const wizardContainer = document.getElementById("wizard");
  if (wizardContainer) wizardContainer.classList.add("is-active");

  // 2. Hide all inner sections, then show the active one
  document.querySelectorAll(".wizard-section").forEach(el => el.classList.remove("is-active"));
  const target = document.querySelector(`.wizard-section[data-index="${index}"]`);
  if (target) target.classList.add("is-active");
  
  updateSidebarStates();
  document.getElementById("nav-counter").textContent = `Section ${index + 1} of ${ARS_SECTIONS.length}`;
  document.getElementById("btn-prev").disabled = index === 0;
  document.getElementById("btn-next").disabled = index === ARS_SECTIONS.length - 1;
  // Only scroll to top if we are on a small screen where the sidebar isn't sticky
  if (window.innerWidth <= 900) {
    document.getElementById("workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function wireNav() {
  document.getElementById("btn-prev").addEventListener("click", () => goToSection(ARS_STATE.currentSectionIndex - 1));
  document.getElementById("btn-next").addEventListener("click", () => goToSection(ARS_STATE.currentSectionIndex + 1));
  document.getElementById("btn-compile").addEventListener("click", openOutputModal);
}

function updateSidebarStates() {
  document.querySelectorAll(".sidebar__item").forEach((el, i) => {
    el.classList.toggle("is-active", i === ARS_STATE.currentSectionIndex);
    el.classList.toggle("is-complete", isSectionComplete(ARS_SECTIONS[i]));
  });
}

function updateProgressUI() {
  const total = ARS_SECTIONS.filter(s => s.required).length;
  const done = ARS_SECTIONS.filter(s => s.required && isSectionComplete(s)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-bar").setAttribute("aria-valuenow", pct);
  document.getElementById("progress-text").textContent = `${done} of ${total} required sections complete`;
  document.getElementById("btn-compile").disabled = !allRequiredComplete();
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