// ==========================================
// SYDF - TOAST NOTIFICATION SYSTEM & CONFIRM (THEME AWARE)
// ==========================================
(function () {
  "use strict";

  if (window.__syfToastLoaded) return;
  window.__syfToastLoaded = true;

  // ==========================================
  // INJECT STYLES — all theme-aware
  // ==========================================
  const style = document.createElement("style");
  style.textContent = `
    .syf-toast-container {
      position: fixed;
      top: 90px;
      right: 20px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 380px;
      pointer-events: none;
    }
    @media (max-width: 600px) {
      .syf-toast-container {
        top: auto;
        bottom: 20px;
        left: 15px;
        right: 15px;
        max-width: none;
      }
    }
    .syf-toast {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 18px;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 14px;
      box-shadow: var(--card-shadow-hover);
      color: var(--text-primary);
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      pointer-events: auto;
      transform: translateX(450px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--card-border);
    }
    .syf-toast.show { transform: translateX(0); opacity: 1; }
    .syf-toast.hide { transform: translateX(450px); opacity: 0; }
    .syf-toast::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 4px;
    }
    .syf-toast.success::before { background: var(--success); }
    .syf-toast.error::before { background: #ef4444; }
    .syf-toast.warning::before { background: var(--warm); }
    .syf-toast.info::before { background: var(--accent); }
    .syf-toast.success { border-color: var(--success-border); }
    .syf-toast.error { border-color: var(--error-border); }
    .syf-toast.warning { border-color: var(--card-border-hover); }
    .syf-toast.info { border-color: var(--accent); }

    .syf-toast-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .syf-toast.success .syf-toast-icon { background: var(--success-bg); color: var(--success); }
    .syf-toast.error .syf-toast-icon { background: var(--error-bg); color: var(--error); }
    .syf-toast.warning .syf-toast-icon { background: var(--warm-soft); color: var(--warm-text); }
    .syf-toast.info .syf-toast-icon { background: var(--accent-soft); color: var(--accent); }

    .syf-toast-body { flex: 1; min-width: 0; padding-top: 1px; }
    .syf-toast-title {
      font-weight: 600;
      margin-bottom: 2px;
      font-size: 14px;
      color: var(--text-primary);
    }
    .syf-toast.success .syf-toast-title { color: var(--success); }
    .syf-toast.error .syf-toast-title { color: var(--error); }
    .syf-toast.warning .syf-toast-title { color: var(--warm-text); }
    .syf-toast.info .syf-toast-title { color: var(--accent); }

    .syf-toast-message {
      font-size: 13px;
      color: var(--text-secondary);
      word-break: break-word;
    }

    .syf-toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 16px;
      cursor: pointer;
      padding: 2px 4px;
      line-height: 1;
      transition: 0.2s;
      flex-shrink: 0;
    }
    .syf-toast-close:hover { color: var(--text-primary); }

    /* Confirm Modal */
    .syf-confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.25s;
    }
    .syf-confirm-overlay.show { opacity: 1; }

    .syf-confirm {
      background: var(--card-bg);
      border: 1px solid var(--card-border-hover);
      border-radius: 20px;
      padding: 32px 30px 24px;
      max-width: 440px;
      width: 100%;
      color: var(--text-primary);
      font-family: 'Poppins', sans-serif;
      box-shadow: var(--card-shadow-hover);
      transform: scale(0.92);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      position: relative;
      overflow: hidden;
    }
    .syf-confirm-overlay.show .syf-confirm { transform: scale(1); }
    .syf-confirm::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent), var(--warm), var(--accent));
      background-size: 200% 100%;
      animation: syfSlideGrad 3s linear infinite;
    }
    @keyframes syfSlideGrad {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    .syf-confirm-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 0 auto 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    .syf-confirm-icon.warning {
      background: var(--warm-soft);
      border: 2px solid var(--warm);
      color: var(--warm-text);
    }
    .syf-confirm-icon.danger {
      background: var(--error-bg);
      border: 2px solid var(--error-border);
      color: var(--error);
    }
    .syf-confirm-icon.info {
      background: var(--accent-soft);
      border: 2px solid var(--card-border-hover);
      color: var(--accent);
    }
    .syf-confirm-title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 10px;
      color: var(--text-primary);
    }
    .syf-confirm-message {
      font-size: 14px;
      text-align: center;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 24px;
      white-space: pre-line;
    }
    .syf-confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .syf-confirm-btn {
      padding: 12px 26px;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      border: none;
      min-width: 100px;
      flex: 1;
    }
    .syf-confirm-btn.cancel {
      background: var(--card-bg-hover);
      color: var(--text-primary);
      border: 1px solid var(--card-border);
    }
    .syf-confirm-btn.cancel:hover { background: var(--accent-soft); }
    .syf-confirm-btn.confirm {
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: var(--accent-contrast);
    }
    .syf-confirm-btn.confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--accent-glow);
    }
    .syf-confirm-btn.confirm.danger {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      color: #ffffff;
    }
    .syf-confirm-btn.confirm.danger:hover {
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }
  `;
  document.head.appendChild(style);

  // ==========================================
  // TOAST CONTAINER
  // ==========================================
  let container = null;
  function getContainer() {
    if (!container || !container.parentNode) {
      container = document.createElement("div");
      container.className = "syf-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  const ICONS = { success: "✓", error: "✕", warning: "!", info: "i" };
  const TITLES = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
  };

  // ==========================================
  // SHOW TOAST
  // ==========================================
  function showToast(message, type, duration) {
    if (!message) return;
    type = type || "info";
    duration = typeof duration === "number" ? duration : 3500;

    let msg = String(message).trim();
    msg = msg
      .replace(
        /^[\u2700-\u27BF\u2600-\u27BF\uD83C-\uDBFF\uDC00-\uDFFF\u2190-\u21FF\u2300-\u23FF\u2B00-\u2BFF\uFE0F\u200D]+\s*/g,
        "",
      )
      .trim();
    if (!msg) msg = String(message).trim();

    const toast = document.createElement("div");
    toast.className = "syf-toast " + type;
    toast.innerHTML = `
      <div class="syf-toast-icon">${ICONS[type] || "i"}</div>
      <div class="syf-toast-body">
        <div class="syf-toast-title">${TITLES[type] || "Info"}</div>
        <div class="syf-toast-message"></div>
      </div>
      <button class="syf-toast-close" aria-label="Close">✕</button>
    `;
    toast.querySelector(".syf-toast-message").textContent = msg;

    getContainer().appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    const closeToast = () => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 400);
    };
    toast
      .querySelector(".syf-toast-close")
      .addEventListener("click", closeToast);
    if (duration > 0) setTimeout(closeToast, duration);
  }

  // ==========================================
  // SHOW CONFIRM
  // ==========================================
  function showConfirm(message, optionsOrCallback) {
    let options = {};
    let callback = null;

    if (typeof optionsOrCallback === "function") {
      callback = optionsOrCallback;
    } else if (
      typeof optionsOrCallback === "object" &&
      optionsOrCallback !== null
    ) {
      options = optionsOrCallback;
    }

    const type = options.type || "warning";
    const title =
      options.title || (type === "danger" ? "Confirm" : "Are you sure?");
    const confirmText = options.confirmText || "Confirm";
    const cancelText = options.cancelText || "Cancel";
    const icon = options.icon || (type === "danger" ? "⚠" : "?");

    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "syf-confirm-overlay";
      overlay.innerHTML = `
        <div class="syf-confirm">
          <div class="syf-confirm-icon ${type}">${icon}</div>
          <div class="syf-confirm-title">${title}</div>
          <div class="syf-confirm-message"></div>
          <div class="syf-confirm-actions">
            <button class="syf-confirm-btn cancel">${cancelText}</button>
            <button class="syf-confirm-btn confirm ${type === "danger" ? "danger" : ""}">${confirmText}</button>
          </div>
        </div>
      `;
      overlay.querySelector(".syf-confirm-message").textContent = String(
        message || "",
      );
      document.body.appendChild(overlay);

      requestAnimationFrame(() => overlay.classList.add("show"));

      let resolved = false;
      const close = (result) => {
        if (resolved) return;
        resolved = true;
        overlay.classList.remove("show");
        setTimeout(() => {
          if (overlay.parentNode) overlay.remove();
        }, 250);

        resolve(result);
        if (typeof callback === "function") {
          callback(result);
        }
      };

      overlay
        .querySelector(".syf-confirm-btn.cancel")
        .addEventListener("click", () => close(false));
      overlay
        .querySelector(".syf-confirm-btn.confirm")
        .addEventListener("click", () => close(true));
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close(false);
      });

      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
          close(false);
          document.removeEventListener("keydown", esc);
        }
      });
    });
  }

  // ==========================================
  // OVERRIDE alert() — toast
  // ==========================================
  window.alert = function (message) {
    const msg = String(message || "");
    let type = "info";
    if (
      /^[\u2705\u2713]/.test(msg) ||
      /success|approved|activated|joined|copied|saved|sent/i.test(msg)
    )
      type = "success";
    else if (
      /^[\u274C\u2715\u2717]/.test(msg) ||
      /error|failed|invalid|rejected|delete|not found|cannot/i.test(msg)
    )
      type = "error";
    else if (
      /^[\u26A0\u23F8\u{1F4A4}\u{1F6AB}\u23F3]/u.test(msg) ||
      /warn|suspend|pending|required|please/i.test(msg)
    )
      type = "warning";
    showToast(msg, type);
  };

  window.syfToast = showToast;
  window.syfSuccess = (msg, dur) => showToast(msg, "success", dur);
  window.syfError = (msg, dur) => showToast(msg, "error", dur || 4000);
  window.syfWarning = (msg, dur) => showToast(msg, "warning", dur);
  window.syfInfo = (msg, dur) => showToast(msg, "info", dur);
  window.syfConfirm = showConfirm;

  console.log("✅ Toast System loaded (theme-aware)");
})();
