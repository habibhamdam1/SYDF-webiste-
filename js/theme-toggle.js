// ==========================================
// SYDF - LIGHT/DARK MODE + GLOWING BACKGROUND
// ==========================================
(function () {
  "use strict";

  const STORAGE_KEY = "syf_theme";
  const DEFAULT_THEME = "dark";

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  applyTheme(getSavedTheme());

  function toggleTheme() {
    const current = getSavedTheme();
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    updateAllIcons(next);
  }

  function updateAllIcons(theme) {
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      const icon = btn.querySelector(".theme-icon");
      if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute(
        "title",
        theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      );
    });
  }

  // ==========================================
  // INJECT GLOW ORBS + GRID
  // ==========================================
  function injectGlowLayers() {
    if (!document.querySelector(".glow-orbs")) {
      const orbs = document.createElement("div");
      orbs.className = "glow-orbs";
      orbs.innerHTML = `
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        <div class="glow-orb orb-3"></div>
      `;
      document.body.appendChild(orbs);
    }

    if (!document.querySelector(".grid-overlay")) {
      const grid = document.createElement("div");
      grid.className = "grid-overlay";
      document.body.appendChild(grid);
    }
  }

  // ==========================================
  // INJECT TOGGLE BUTTON
  // ==========================================
  function injectToggleButton() {
    const headerNav = document.querySelector(".glass-header nav ul");
    if (headerNav && !headerNav.querySelector(".theme-toggle-btn")) {
      const li = document.createElement("li");
      li.innerHTML = `<button class="theme-toggle-btn" aria-label="Toggle theme"><span class="theme-icon">${getSavedTheme() === "dark" ? "☀️" : "🌙"}</span></button>`;
      headerNav.insertBefore(li, headerNav.lastElementChild);
      li.querySelector(".theme-toggle-btn").addEventListener(
        "click",
        toggleTheme,
      );
      return;
    }

    const topbarActions = document.querySelector(
      ".dashboard-topbar .topbar-actions",
    );
    if (topbarActions && !topbarActions.querySelector(".topbar-theme-btn")) {
      const btn = document.createElement("button");
      btn.className = "topbar-btn topbar-theme-btn theme-toggle-btn";
      btn.setAttribute("title", "Toggle Theme");
      btn.innerHTML = `<span class="theme-icon">${getSavedTheme() === "dark" ? "☀️" : "🌙"}</span>`;
      topbarActions.insertBefore(btn, topbarActions.firstChild);
      btn.addEventListener("click", toggleTheme);
    }
  }

  function init() {
    injectGlowLayers();
    injectToggleButton();
    updateAllIcons(getSavedTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", init);
  setTimeout(init, 500);

  window.syfToggleTheme = toggleTheme;
  window.syfGetTheme = getSavedTheme;
})();
