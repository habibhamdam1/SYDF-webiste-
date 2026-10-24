// ==========================================
// SYDF - TOAST NOTIFICATION SYSTEM & CONFIRM (FIXED)
// ==========================================
(function () {
  "use strict";

  if (window.__syfToastLoaded) return;
  window.__syfToastLoaded = true;

  // ==========================================
  // INJECT STYLES
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
      background: rgba(15, 32, 39, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
      color: white;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      pointer-events: auto;
      transform: translateX(450px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .syf-toast.show { transform: translateX(0); opacity: 1; }
    .syf-toast.hide { transform: translateX(450px); opacity: 0; }
    .syf-toast::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 4px;
    }
    .syf-toast.success::before { background: #1abc9c; }
    .syf-toast.error::before { background: #ef4444; }
    .syf-toast.warning::before { background: #f59e0b; }
    .syf-toast.info::before { background: #3b82f6; }
    .syf-toast.success { border-color: rgba(26, 188, 156, 0.35); }
    .syf-toast.error { border-color: rgba(239, 68, 68, 0.35); }
    .syf-toast.warning { border-color: rgba(245, 158, 11, 0.35); }
    .syf-toast.info { border-color: rgba(59, 130, 246, 0.35); }

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
    .syf-toast.success .syf-toast-icon { background: rgba(26, 188, 156, 0.2); color: #1abc9c; }
    .syf-toast.error .syf-toast-icon { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .syf-toast.warning .syf-toast-icon { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .syf-toast.info .syf-toast-icon { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }

    .syf-toast-body { flex: 1; min-width: 0; padding-top: 1px; }
    .syf-toast-title {
      font-weight: 600;
      margin-bottom: 2px;
      font-size: 14px;
    }
    .syf-toast.success .syf-toast-title { color: #1abc9c; }
    .syf-toast.error .syf-toast-title { color: #fca5a5; }
    .syf-toast.warning .syf-toast-title { color: #fbbf24; }
    .syf-toast.info .syf-toast-title { color: #93c5fd; }

    .syf-toast-message {
      font-size: 13px;
      opacity: 0.9;
      word-break: break-word;
    }

    .syf-toast-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 16px;
      cursor: pointer;
      padding: 2px 4px;
      line-height: 1;
      transition: 0.2s;
      flex-shrink: 0;
    }
    .syf-toast-close:hover { color: white; }

    /* Confirm Modal */
    .syf-confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
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
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 32px 30px 24px;
      max-width: 440px;
      width: 100%;
      color: white;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
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
      background: linear-gradient(90deg, #1abc9c, #fbbf24, #1abc9c);
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
      background: rgba(245, 158, 11, 0.15);
      border: 2px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
    }
    .syf-confirm-icon.danger {
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .syf-confirm-icon.info {
      background: rgba(59, 130, 246, 0.15);
      border: 2px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
    }
    .syf-confirm-title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 10px;
      color: white;
    }
    .syf-confirm-message {
      font-size: 14px;
      text-align: center;
      line-height: 1.6;
      opacity: 0.85;
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
      background: rgba(255, 255, 255, 0.08);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .syf-confirm-btn.cancel:hover { background: rgba(255, 255, 255, 0.15); }
    .syf-confirm-btn.confirm {
      background: linear-gradient(135deg, #1abc9c, #16a085);
      color: white;
    }
    .syf-confirm-btn.confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26, 188, 156, 0.4);
    }
    .syf-confirm-btn.confirm.danger {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
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
  // SHOW CONFIRM (FIXED: Promise + Callback Support)
  // ==========================================
  function showConfirm(message, optionsOrCallback) {
    let options = {};
    let callback = null;

    // Check if second argument is a function (Callback)
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

        // YAHAN MASLA HAL HUA HAI: Callback ko call karo
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
  // OVERRIDE alert() — Replace with toast
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

  // Expose API
  window.syfToast = showToast;
  window.syfSuccess = (msg, dur) => showToast(msg, "success", dur);
  window.syfError = (msg, dur) => showToast(msg, "error", dur || 4000);
  window.syfWarning = (msg, dur) => showToast(msg, "warning", dur);
  window.syfInfo = (msg, dur) => showToast(msg, "info", dur);
  window.syfConfirm = showConfirm;

  console.log("✅ Toast System loaded (Callback + Promise support)");
})();
// ==========================================
// MAGIC: GLOBAL OVERRIDE FOR OLD ALERTS/CONFIRMS
// ==========================================
window.addEventListener("load", function () {
  // 1. Override purana alert
  window.alert = function (message) {
    if (typeof window.syfToast === "function") {
      window.syfToast(message, "info");
    } else {
      console.log("Alert:", message);
    }
  };

  // 2. Override purana confirm (Yeh thoda tricky hai, par kaam karega)
  const originalConfirm = window.confirm;
  window.confirm = function (message) {
    // Kyunki confirm browser ko block karta hai, hum custom popup use karenge jo async hota hai.
    // Purane code ko break hone se bachane ke liye hum native confirm hi use karenge agar zaroorat pade.
    // Par humne jo files fix ki hain unme syfConfirm laga hua hai.

    // Agar aage koi file purana confirm use kare, toh yeh browser wala hi chalega (jo 100% kaam karta hai)
    return originalConfirm(message);
  };
});
