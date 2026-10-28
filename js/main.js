// ==========================================
// SYDF - MAIN JAVASCRIPT (v7 - FINAL COMPLETE WITH EVENTS)
// ==========================================

console.log("SYDF Website Loaded Successfully!");

// 1. AUTO-LOAD THEME OVERRIDES
(function () {
  if (!document.querySelector('link[href*="theme-overrides.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/theme-overrides.css";
    document.head.appendChild(link);
  }
})();

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener("scroll", function () {
  const header = document.querySelector(".glass-header");
  if (!header) return;
  if (window.scrollY > 50) {
    header.style.background = "var(--header-bg)";
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.15)";
  } else {
    header.style.background = "var(--header-bg)";
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.05)";
  }
});

// ==========================================
// FADE IN ANIMATION ON SCROLL
// ==========================================
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".glass-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  observer.observe(card);
});

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
const backToTopBtn = document.createElement("button");
backToTopBtn.innerHTML = "↑";
backToTopBtn.className = "back-to-top";
backToTopBtn.style.cssText = `position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--accent); color: var(--accent-contrast); border: 1px solid var(--card-border-hover); font-size: 22px; cursor: pointer; display: none; z-index: 999; backdrop-filter: blur(10px); transition: 0.3s;`;
document.body.appendChild(backToTopBtn);

window.addEventListener("scroll", function () {
  backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// AUTO-LOAD SUPABASE
// ==========================================
(function () {
  if (typeof supabase === "undefined") {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script1.async = false;
    document.head.appendChild(script1);
    script1.onload = function () {
      const script2 = document.createElement("script");
      script2.src = "js/supabase-config.js";
      document.head.appendChild(script2);
    };
  }
})();

// ==========================================
// AUTHENTICATION & LOGOUT
// ==========================================
async function getCurrentUser() {
  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 30
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  if (typeof supabaseClient === "undefined" || !supabaseClient) return null;
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (session && session.user) return session.user;
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
}

async function updateNavButton() {
  const navBtn = document.getElementById("navAuthBtn");
  if (!navBtn) return;
  const user = await getCurrentUser();
  if (user) {
    navBtn.textContent = "👤 Dashboard";
    navBtn.href = "dashboard.html";
    navBtn.classList.add("logged-in");
  } else {
    navBtn.textContent = "Login";
    navBtn.href = "login.html";
    navBtn.classList.remove("logged-in");
  }
}

async function logoutUser() {
  const doLogout = async () => {
    try {
      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (err) {
      console.error("Supabase logout error:", err);
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("login.html");
  };

  if (typeof window.syfConfirm === "function") {
    window.syfConfirm("Are you sure you want to logout?", (confirmed) => {
      if (confirmed) doLogout();
    });
  } else {
    if (confirm("Are you sure you want to logout?")) {
      doLogout();
    }
  }
}

document.addEventListener("click", function (e) {
  const logoutBtn = e.target.closest(".logout-btn");
  if (logoutBtn) {
    e.preventDefault();
    logoutUser();
  }
});

async function protectDashboard() {
  const path = window.location.pathname;
  const protectedPages = [
    "dashboard.html",
    "profile.html",
    "my-payments.html",
    "my-documents.html",
    "my-certificate.html",
    "my-id-card.html",
    "my-activities.html",
    "member-proposals.html",
    "member-reports.html",
    "member-elections.html",
    "notifications.html",
    "settings.html",
  ];
  const currentPage = path.substring(path.lastIndexOf("/") + 1);
  if (protectedPages.includes(currentPage)) {
    showLoadingOverlay();
    const user = await getCurrentUser();
    if (!user) {
      await new Promise((r) => setTimeout(r, 800));
      const retry = await getCurrentUser();
      if (!retry) {
        window.location.replace("login.html");
        return null;
      }
      hideLoadingOverlay();
      return retry;
    }
    hideLoadingOverlay();
    return user;
  }
  return null;
}

function showLoadingOverlay() {
  if (document.getElementById("authLoadingOverlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "authLoadingOverlay";
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, var(--sky-top), var(--sky-mid), var(--sky-bottom)); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999999; color: var(--text-primary); font-family: 'Poppins', sans-serif;`;
  overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 42px; font-weight: 700; color: var(--accent); letter-spacing: 3px; margin-bottom: 25px;">SYDF</div>
            <div style="width: 50px; height: 50px; border: 4px solid var(--card-border); border-top-color: var(--accent); border-radius: 50%; animation: pydfSpin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 14px; color: var(--text-secondary);">Verifying access...</div>
            <style>@keyframes pydfSpin { to { transform: rotate(360deg); } }</style>
        </div>`;
  document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("authLoadingOverlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.3s";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }
}

function updateUserInfo(user) {
  if (!user) return;
  const email = user.email;
  const userName = email.split("@")[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const initial = displayName.charAt(0).toUpperCase();
  document
    .querySelectorAll(".user-name")
    .forEach((el) => (el.textContent = displayName));
  document
    .querySelectorAll(".user-uid")
    .forEach((el) => (el.textContent = "Email: " + email));
  document
    .querySelectorAll(".user-avatar")
    .forEach((el) => (el.textContent = initial));
  document
    .querySelectorAll(".profile-avatar-big")
    .forEach((el) => (el.textContent = initial));
  document.querySelectorAll(".welcome-text h1").forEach((el) => {
    if (
      el.textContent.includes("Member") ||
      el.textContent.includes("Assalam")
    ) {
      el.textContent = "Assalam-o-Alaikum, " + displayName + "! 👋";
    }
  });
}

// ==========================================
// SIDEBAR TOGGLE
// ==========================================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("dashboardSidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", function () {
    sidebar.classList.add("active");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
  });
}
if (sidebarClose && sidebar) {
  sidebarClose.addEventListener("click", function () {
    sidebar.classList.remove("active");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
  });
}
if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", function () {
    if (sidebar) sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  });
}

// ==========================================
// DYNAMIC HEADER/FOOTER + SIDEBAR INJECTIONS
// ==========================================
document.addEventListener("DOMContentLoaded", async function () {
  const isAdminPage =
    window.location.pathname.includes("admin") &&
    !window.location.pathname.includes("admin-login");

  // 1. DYNAMIC HEADER & FOOTER (For Public Pages)
  if (!isAdminPage) {
    let attempts = 0;
    while (
      (typeof supabaseClient === "undefined" || !supabaseClient) &&
      attempts < 30
    ) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }

    if (typeof supabaseClient !== "undefined" && supabaseClient) {
      try {
        const { data: links } = await supabaseClient
          .from("menu_links")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        const existingNav = document.querySelector(".glass-header nav");
        const currentPath =
          window.location.pathname.split("/").pop() || "index.html";

        if (links && links.length > 0 && existingNav) {
          const headerLinks = links.filter((l) => l.location === "header");
          let navHTML = "<ul>";
          headerLinks.forEach((link) => {
            const active =
              currentPath === link.url
                ? ' class="active"'
                : link.is_button
                  ? ' class="btn-login"'
                  : "";
            navHTML += `<li><a href="${link.url}"${active}>${link.label}</a></li>`;
          });
          navHTML += "</ul>";
          existingNav.innerHTML = navHTML;
        } else if (existingNav) {
          // Fallback if table is empty
          let navHTML = "<ul>";
          const navLinks = [
            { href: "index.html", label: "Home" },
            { href: "about.html", label: "About Us" },
            { href: "leadership.html", label: "Leadership" },
            { href: "districts.html", label: "Districts" },
            { href: "activities.html", label: "Activities" },
            { href: "gallery.html", label: "Gallery" },
            { href: "news.html", label: "News" },
            { href: "membership.html", label: "Membership" },
            { href: "donate.html", label: "Donate" },
            { href: "contact.html", label: "Contact" },
          ];
          navLinks.forEach((link) => {
            const active = currentPath === link.href ? ' class="active"' : "";
            navHTML += `<li><a href="${link.href}"${active}>${link.label}</a></li>`;
          });
          navHTML += `<li><a href="public-report.html" style="color: var(--warm-text); font-weight: 600;">🛡️ Grievance</a></li>`;
          navHTML += `<li><a href="login.html" class="btn-login" id="navAuthBtn">Login</a></li>`;
          navHTML += "</ul>";
          existingNav.innerHTML = navHTML;
        }

        // Mobile menu setup
        const headerDiv = document.querySelector(".glass-header");
        if (
          headerDiv &&
          !document.getElementById("mobileMenuBtn") &&
          existingNav
        ) {
          const btn = document.createElement("button");
          btn.id = "mobileMenuBtn";
          btn.className = "mobile-menu-btn";
          btn.innerHTML = "☰";
          headerDiv.appendChild(btn);
          btn.addEventListener("click", function () {
            existingNav.classList.toggle("active");
            this.innerHTML = existingNav.classList.contains("active")
              ? "✕"
              : "☰";
          });
        }

        // Logo setup
        const logoDiv = document.querySelector(".glass-header .logo");
        if (logoDiv && !logoDiv.querySelector("img")) {
          const img = document.createElement("img");
          img.src = "images/logo.png";
          img.alt = "SYDF Logo";
          img.style.cssText =
            "width:40px;height:40px;border-radius:50%;object-fit:contain;background:var(--card-bg);padding:2px;margin-right:8px;flex-shrink:0;box-shadow:0 3px 12px var(--accent-glow);";
          img.onerror = function () {
            this.remove();
          };
          logoDiv.style.display = "flex";
          logoDiv.style.alignItems = "center";
          if (!logoDiv.querySelector(".logo-text")) {
            const wrapper = document.createElement("div");
            wrapper.className = "logo-text";
            while (logoDiv.firstChild && logoDiv.firstChild !== img) {
              wrapper.appendChild(logoDiv.firstChild);
            }
            logoDiv.appendChild(wrapper);
          }
          logoDiv.insertBefore(img, logoDiv.firstChild);
        }

        // Footer setup
        const existingFooter = document.querySelector(".glass-footer");
        if (existingFooter) {
          existingFooter.innerHTML = `
            <div class="footer-content">
                <div class="footer-col">
                    <h3>SYDF</h3><p>Swat Youth Development Forum</p><p>Empowering Youth, Building Future</p>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <a href="#" title="Facebook" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--card-border); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">📘</a>
                        <a href="#" title="Instagram" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--card-border); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">📷</a>
                        <a href="#" title="YouTube" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--card-border); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">▶️</a>
                        <a href="#" title="WhatsApp" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--card-border); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">💬</a>
                    </div>
                </div>
                <div class="footer-col"><h4>Explore</h4><ul><li><a href="about.html">About Us</a></li><li><a href="leadership.html">Leadership</a></li><li><a href="districts.html">Districts</a></li><li><a href="activities.html">Activities</a></li><li><a href="events.html">Events</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="news.html">News & Blog</a></li><li><a href="members.html">Members Directory</a></li></ul></div>
                <div class="footer-col"><h4>Get Involved</h4><ul><li><a href="membership.html">Membership</a></li><li><a href="donate.html">Donate</a></li><li><a href="sponsor.html">Sponsor an Activity</a></li><li><a href="volunteer.html">Volunteer</a></li><li><a href="partners.html">Our Partners</a></li><li><a href="stories.html">Success Stories</a></li></ul></div>
                <div class="footer-col"><h4>Support & Legal</h4><ul><li><a href="contact.html">Contact Us</a></li><li><a href="public-report.html" style="color: var(--warm-text); font-weight: 600;">🛡️ Public Grievances</a></li><li><a href="faq.html">FAQ</a></li><li><a href="feedback.html">Send Feedback</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms.html">Terms & Conditions</a></li><li><a href="login.html">Member Login</a></li></ul></div>
            </div>
            <div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} Swat Youth Development Forum. All Rights Reserved.</p></div>
           `;
        }
      } catch (err) {
        console.log("Dynamic menu error:", err);
      }
    }
  }

  // 2. SIDEBAR INJECTIONS (For Dashboard & Admin Pages)
  const sidebarNav = document.querySelector(".dashboard-sidebar .sidebar-nav");
  if (sidebarNav) {
    const currentPage =
      window.location.pathname.split("/").pop() || "dashboard.html";
    sidebarNav.querySelectorAll("a").forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href && href === currentPage) link.classList.add("active");
    });

    if (isAdminPage) {
      // Remove wrong button if exists
      const wrongBtn = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
        a.href.includes("member-reports.html"),
      );
      if (wrongBtn) wrongBtn.parentElement.remove();

      // --- INJECT SYSTEM LINKS ---
      const systemTitle = Array.from(
        sidebarNav.querySelectorAll(".nav-section-title"),
      ).find((el) => el.textContent.trim() === "System");
      if (systemTitle) {
        const nextUl = systemTitle.nextElementSibling;
        if (nextUl && nextUl.tagName === "UL") {
          if (!nextUl.querySelector('a[href="admin-activity-logs.html"]')) {
            const li1 = document.createElement("li");
            li1.innerHTML = `<a href="admin-activity-logs.html"><span class="nav-icon">📋</span><span>Activity Logs</span></a>`;
            nextUl.insertBefore(li1, nextUl.firstChild);
          }
          if (!nextUl.querySelector('a[href="admin-recycle-bin.html"]')) {
            const li2 = document.createElement("li");
            li2.innerHTML = `<a href="admin-recycle-bin.html"><span class="nav-icon">🗑️</span><span>Recycle Bin</span></a>`;
            nextUl.insertBefore(li2, nextUl.children[1]);
          }
          if (!nextUl.querySelector('a[href="admin-menu-manager.html"]')) {
            const li3 = document.createElement("li");
            li3.innerHTML = `<a href="admin-menu-manager.html"><span class="nav-icon">🔗</span><span>Menu Manager</span></a>`;
            nextUl.insertBefore(li3, nextUl.children[2]);
          }
        }
      }

      // --- INJECT CONTENT LINKS ---
      const contentTitle = Array.from(
        sidebarNav.querySelectorAll(".nav-section-title"),
      ).find((el) => el.textContent.trim() === "Content");
      if (contentTitle) {
        const nextUl = contentTitle.nextElementSibling;
        if (nextUl && nextUl.tagName === "UL") {
          // Events
          if (!nextUl.querySelector('a[href="admin-events.html"]')) {
            const liEvent = document.createElement("li");
            liEvent.innerHTML = `<a href="admin-events.html"><span class="nav-icon">📅</span><span>Events</span></a>`;
            const actLink = Array.from(nextUl.querySelectorAll("a")).find((a) =>
              a.href.includes("admin-activities.html"),
            );
            if (actLink)
              actLink.parentElement.insertAdjacentElement("afterend", liEvent);
            else nextUl.appendChild(liEvent);
          }
          // Custom Pages
          if (!nextUl.querySelector('a[href="admin-custom-pages.html"]')) {
            const liContent = document.createElement("li");
            liContent.innerHTML = `<a href="admin-custom-pages.html"><span class="nav-icon">📄</span><span>Custom Pages</span></a>`;
            nextUl.appendChild(liContent);
          }
          // Form Builder
          if (!nextUl.querySelector('a[href="admin-forms.html"]')) {
            const liForm = document.createElement("li");
            liForm.innerHTML = `<a href="admin-forms.html"><span class="nav-icon">📝</span><span>Form Builder</span></a>`;
            nextUl.appendChild(liForm);
          }
        }
      }

      // --- INJECT OTHER ADMIN LINKS ---
      const injectAdminLink = (href, icon, label, afterHref) => {
        if (
          !Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
            a.href.includes(href),
          )
        ) {
          const newLi = document.createElement("li");
          newLi.innerHTML = `<a href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`;
          const afterLink = Array.from(sidebarNav.querySelectorAll("a")).find(
            (a) => a.href.includes(afterHref),
          );
          if (afterLink)
            afterLink.parentElement.insertAdjacentElement("afterend", newLi);
          else sidebarNav.appendChild(newLi);
        }
      };

      injectAdminLink(
        "admin-issue-reports.html",
        "🚨",
        "Member Reports",
        "admin-waitlist.html",
      );
      injectAdminLink(
        "admin-public-issues.html",
        "🛡️",
        "Public Grievances",
        "admin-issue-reports.html",
      );
      injectAdminLink(
        "admin-messages.html",
        "📩",
        "Messages",
        "admin-notifications.html",
      );
      injectAdminLink(
        "admin-elections.html",
        "🗳️",
        "Elections",
        "admin-proposals.html",
      );
    } else {
      // --- INJECT MEMBER LINKS ---
      if (
        !Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
          a.href.includes("member-reports.html"),
        )
      ) {
        const newLi = document.createElement("li");
        newLi.innerHTML = `<a href="member-reports.html"><span class="nav-icon">🚨</span><span>Report Issue</span></a>`;
        const idCardLink = Array.from(sidebarNav.querySelectorAll("a")).find(
          (a) => a.href.includes("my-id-card.html"),
        );
        if (idCardLink)
          idCardLink.parentElement.insertAdjacentElement("afterend", newLi);
        else sidebarNav.appendChild(newLi);
      }
      if (
        !Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
          a.href.includes("member-elections.html"),
        )
      ) {
        const newElLi = document.createElement("li");
        newElLi.innerHTML = `<a href="member-elections.html"><span class="nav-icon">🗳️</span><span>Elections</span></a>`;
        const propLink = Array.from(sidebarNav.querySelectorAll("a")).find(
          (a) => a.href.includes("member-proposals.html"),
        );
        if (propLink)
          propLink.parentElement.insertAdjacentElement("afterend", newElLi);
        else sidebarNav.appendChild(newElLi);
      }
    }
    addBottomButtons(sidebarNav);
  }

  // 3. AUTO-LOAD ACTIVITY LOGGER SCRIPT
  if (
    isAdminPage &&
    !document.querySelector('script[src*="activity-logger.js"]')
  ) {
    const script = document.createElement("script");
    script.src = "js/activity-logger.js";
    document.body.appendChild(script);
  }
});

function addBottomButtons(sidebarNav) {
  const hasBackBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
    (a) => a.href === "index.html" || a.href.includes("index.html"),
  );
  const hasLogoutBtn = Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
    a.classList.contains("logout-btn"),
  );

  if (!hasBackBtn || !hasLogoutBtn) {
    const divider = document.createElement("div");
    divider.style.cssText =
      "height: 1px; background: var(--card-border); margin: 15px 10px;";
    sidebarNav.appendChild(divider);

    if (!hasBackBtn) {
      const backLi = document.createElement("li");
      backLi.innerHTML = `<a href="index.html" class="back-to-site-btn" style="color: var(--accent);"><span class="nav-icon">🌐</span><span>Back to Website</span></a>`;
      sidebarNav.appendChild(backLi);
    }

    if (!hasLogoutBtn) {
      const logoutLi = document.createElement("li");
      logoutLi.innerHTML = `<a href="#" class="logout-btn" style="color: #ef4444;"><span class="nav-icon">🚪</span><span>Logout</span></a>`;
      sidebarNav.appendChild(logoutLi);
    }
  }
}

// ==========================================
// SECTION CONTROLS & RBAC & INIT
// ==========================================
async function applySectionControls() {
  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 30
  ) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
  if (!supabaseClient) return;

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const protectedPages = [
    "activities",
    "news",
    "gallery",
    "donate",
    "events",
    "leadership",
    "membership",
    "contact",
    "volunteer",
    "sponsor",
    "partners",
  ];

  try {
    const { data } = await supabaseClient
      .from("settings")
      .select("key, value")
      .like("key", "section_%");
    const settingsMap = {};
    if (data)
      data.forEach((d) => {
        settingsMap[d.key] = d.value === "true";
      });

    document.querySelectorAll(".glass-header nav ul li a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.endsWith(".html")) {
        const pageName = href.replace(".html", "");
        const key = `section_${pageName}`;
        if (settingsMap[key] === false) a.parentElement.style.display = "none";
      }
    });

    if (protectedPages.includes(currentPage)) {
      const key = `section_${currentPage}`;
      if (settingsMap[key] === false) {
        const overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed; inset:0; z-index:99999; background: var(--sky-top); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;";
        overlay.innerHTML = `
          <div style="font-size:80px; margin-bottom:20px;">🚧</div>
          <h2 style="color:var(--text-primary); font-size:32px; margin-bottom:15px; font-family:'Poppins', sans-serif;">Section Temporarily Closed</h2>
          <p style="color:var(--text-secondary); max-width:500px; margin-bottom:30px; font-size:16px; font-family:'Poppins', sans-serif;">This section is currently closed by the administration. Please check back later.</p>
          <a href="index.html" class="btn-primary" style="text-decoration:none; padding:12px 30px; border-radius:10px; font-family:'Poppins', sans-serif; background:var(--accent); color:var(--accent-contrast); font-weight:600;">Return to Homepage</a>
        `;
        document.body.appendChild(overlay);
      }
    }
  } catch (err) {
    console.error("Section controls error:", err);
  }
}

async function enforceAdminPermissions() {
  const path = window.location.pathname;
  const currentPage = path.substring(path.lastIndexOf("/") + 1);

  if (!currentPage.includes("admin") || currentPage === "admin-login.html")
    return;

  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 30
  ) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
  if (!supabaseClient) return;

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.replace("admin-login.html");
    return;
  }

  const { data: admin } = await supabaseClient
    .from("members")
    .select("role, district")
    .eq("email", session.user.email)
    .maybeSingle();
  const allowedRoles = [
    "Super Admin",
    "Admin",
    "President",
    "Senior Vice President",
    "Vice President",
    "Secretary General",
    "District Admin",
  ];

  if (!admin || !allowedRoles.includes(admin.role)) {
    await supabaseClient.auth.signOut();
    alert("⛔ Access Denied: You do not have Admin privileges.");
    window.location.replace("login.html");
    return;
  }

  window.currentAdminRole = admin.role;
  window.currentAdminDistrict = admin.district;

  if (admin.role === "District Admin") {
    const restrictedHrefs = [
      "admin-settings.html",
      "admin-districts.html",
      "admin-cabinet.html",
      "admin-section-controls.html",
      "admin-reports.html",
      "admin-email.html",
    ];
    document.querySelectorAll(".sidebar-nav a").forEach((a) => {
      if (
        restrictedHrefs.some(
          (href) =>
            a.getAttribute("href") && a.getAttribute("href").includes(href),
        )
      ) {
        a.parentElement.style.display = "none";
      }
    });
    document.querySelectorAll(".user-uid").forEach((el) => {
      el.textContent = `District Admin (${admin.district || "Unassigned"})`;
    });
  }

  if (admin.role !== "Super Admin") {
    try {
      const { data: settings } = await supabaseClient
        .from("settings")
        .select("key, value")
        .like("key", "admin_acc_%");
      const map = {};
      if (settings) settings.forEach((s) => (map[s.key] = s.value === "true"));

      const pageMap = {
        "admin-members.html": "admin_acc_members",
        "admin-applications.html": "admin_acc_applications",
        "admin-waitlist.html": "admin_acc_waitlist",
        "admin-issue-reports.html": "admin_acc_reports",
        "admin-public-issues.html": "admin_acc_grievances",
        "admin-proposals.html": "admin_acc_proposals",
        "admin-elections.html": "admin_acc_elections",
        "admin-cabinet.html": "admin_acc_cabinet",
        "admin-districts.html": "admin_acc_districts",
        "admin-activities.html": "admin_acc_activities",
        "admin-news.html": "admin_acc_news",
        "admin-gallery.html": "admin_acc_gallery",
        "admin-documents.html": "admin_acc_documents",
        "admin-finance.html": "admin_acc_finance",
        "admin-expenses.html": "admin_acc_expenses",
        "admin-donations.html": "admin_acc_donations",
        "admin-sponsorships.html": "admin_acc_sponsorships",
        "admin-notifications.html": "admin_acc_notifications",
        "admin-email.html": "admin_acc_notifications",
        "admin-reports.html": "admin_acc_notifications",
        "admin-activity-logs.html": "admin_acc_reports",
        "admin-recycle-bin.html": "admin_acc_reports",
        "admin-menu-manager.html": "admin_acc_reports",
        "admin-custom-pages.html": "admin_acc_news",
        "admin-forms.html": "admin_acc_news",
        "admin-events.html": "admin_acc_activities",
      };

      document.querySelectorAll(".sidebar-nav a").forEach((a) => {
        const href = a.getAttribute("href");
        if (href && pageMap[href]) {
          const key = pageMap[href];
          if (map[key] === false) a.parentElement.style.display = "none";
        }
      });

      document.querySelectorAll(".nav-section-title").forEach((title) => {
        let nextEl = title.nextElementSibling;
        if (nextEl && nextEl.tagName === "UL") {
          let visibleLinks = Array.from(nextEl.querySelectorAll("li")).filter(
            (li) => li.style.display !== "none",
          );
          if (visibleLinks.length === 0) title.style.display = "none";
        }
      });

      if (pageMap[currentPage] && map[pageMap[currentPage]] === false) {
        document.body.innerHTML = `<div style="display:flex; height:100vh; align-items:center; justify-content:center; background:#0f2027; color:white; font-family:Poppins; text-align:center; padding:20px;">
          <div>
            <h1 style="font-size:60px; margin-bottom:10px;">⛔</h1>
            <h2 style="color:#ef4444; margin-bottom:15px;">Access Denied</h2>
            <p style="opacity:0.8;">Super Admin has disabled access to this section for you.</p>
            <a href="admin.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#1abc9c; color:white; text-decoration:none; border-radius:8px;">Go Back to Dashboard</a>
          </div>
        </div>`;
        return;
      }

      if (currentPage === "admin-settings.html") {
        window.location.replace("admin.html");
        return;
      }
    } catch (err) {
      console.error("Error checking admin permissions:", err);
    }
  }
}

async function initFloatingContactButton() {
  const isDashboard =
    window.location.pathname.includes("dashboard") ||
    window.location.pathname.includes("admin") ||
    document.body.classList.contains("dashboard-body");
  if (isDashboard) return;
  if (document.querySelector(".whatsapp-fab")) return;

  let attempts = 0;
  while (
    (typeof supabaseClient === "undefined" || !supabaseClient) &&
    attempts < 30
  ) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }
  if (!supabaseClient) return;

  try {
    const { data } = await supabaseClient
      .from("settings")
      .select("key, value")
      .in("key", ["whatsapp", "phone"]);
    let whatsappNumber = "";
    if (data) {
      const settings = {};
      data.forEach((d) => (settings[d.key] = d.value));
      whatsappNumber = settings["whatsapp"] || settings["phone"] || "";
    }
    if (!whatsappNumber) return;
    whatsappNumber = whatsappNumber.replace(/[^0-9]/g, "");

    const waBtn = document.createElement("a");
    waBtn.href = `https://wa.me/${whatsappNumber}?text=Assalam%20o%20Alaikum%20SYDF%2C%20I%20have%20a%20query.`;
    waBtn.className = "whatsapp-fab";
    waBtn.target = "_blank";
    waBtn.title = "Chat on WhatsApp";
    waBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;
    document.body.appendChild(waBtn);
  } catch (err) {
    console.error("Floating button error:", err);
  }
}

// INITIALIZE ALL
window.addEventListener("load", async function () {
  setTimeout(updateNavButton, 500);
  await enforceAdminPermissions();
  await applySectionControls();
  await initFloatingContactButton();
  const user = await protectDashboard();
  if (user) updateUserInfo(user);
});

window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;

// AUTO-LOAD SERVICES & THEME FIXER
(function () {
  if (typeof window.sendEmail === "undefined") {
    const script = document.createElement("script");
    script.src = "js/email-service.js";
    document.head.appendChild(script);
  }
})();
(function () {
  if (typeof window.calculateMemberScore === "undefined") {
    const script = document.createElement("script");
    script.src = "js/score-service.js";
    document.head.appendChild(script);
  }
})();
(function () {
  if (typeof window.syfToast === "undefined") {
    const script = document.createElement("script");
    script.src = "js/toast.js";
    document.head.appendChild(script);
  }
})();
(function () {
  if (typeof window.syfToggleTheme === "undefined") {
    const script = document.createElement("script");
    script.src = "js/theme-toggle.js";
    document.head.appendChild(script);
  }
})();

// SERVICE WORKER KILLER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("✅ Old Service Worker Unregistered");
    }
  });
}

// THEME AUTO-FIXER (Cleans up inline styles)
window.addEventListener("DOMContentLoaded", () => {
  const allElements = document.querySelectorAll("[style]");
  allElements.forEach((el) => {
    const style = el.getAttribute("style");
    if (!style) return;
    if (
      style.includes("color: white") ||
      style.includes("color: #fff") ||
      style.includes("color: rgba(255")
    ) {
      el.style.color = "";
    }
    if (
      style.includes("background: #0f2027") ||
      style.includes("background: #203a43") ||
      style.includes("background: rgba(15, 32, 39")
    ) {
      el.style.background = "";
    }
  });
});
