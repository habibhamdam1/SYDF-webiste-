// ==========================================
// SYDF - MAIN JAVASCRIPT (100% COMPLETE & FINAL)
// ==========================================

console.log("SYDF Website Loaded Successfully!");

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener("scroll", function () {
  const header = document.querySelector(".glass-header");
  if (!header) return;
  if (window.scrollY > 50) {
    header.style.background = "var(--header-bg)";
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
  } else {
    header.style.background = "var(--header-bg)";
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
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
// SMOOTH SCROLL (FIXED: '# ' Error Solved)
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
backToTopBtn.style.cssText = `position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--accent); color: white; border: 1px solid rgba(255, 255, 255, 0.3); font-size: 22px; cursor: pointer; display: none; z-index: 999; backdrop-filter: blur(10px); transition: 0.3s;`;
document.body.appendChild(backToTopBtn);

window.addEventListener("scroll", function () {
  backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// AUTO HEADER & FOOTER UPDATE + MOBILE MENU
// ==========================================
(function () {
  const path = window.location.pathname;
  const currentPage = path.substring(path.lastIndexOf("/") + 1) || "index.html";

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

  let navHTML = "<ul>";
  navLinks.forEach((link) => {
    const active = currentPage === link.href ? ' class="active"' : "";
    navHTML += `<li><a href="${link.href}"${active}>${link.label}</a></li>`;
  });

  const isPublicReport =
    currentPage === "public-report.html" ? ' class="active"' : "";
  navHTML += `<li><a href="public-report.html"${isPublicReport} style="color: var(--warm); font-weight: 600;">🛡️ Grievance</a></li>`;

  navHTML += `<li><a href="login.html" class="btn-login" id="navAuthBtn">Login</a></li>`;
  navHTML += "</ul>";

  const existingNav = document.querySelector(".glass-header nav");
  if (existingNav) existingNav.innerHTML = navHTML;

  const headerDiv = document.querySelector(".glass-header");
  if (headerDiv && !document.getElementById("mobileMenuBtn")) {
    const btn = document.createElement("button");
    btn.id = "mobileMenuBtn";
    btn.className = "mobile-menu-btn";
    btn.innerHTML = "☰";
    headerDiv.appendChild(btn);

    btn.addEventListener("click", function () {
      existingNav.classList.toggle("active");
      this.innerHTML = existingNav.classList.contains("active") ? "✕" : "☰";
    });
  }

  const logoDiv = document.querySelector(".glass-header .logo");
  if (logoDiv && !logoDiv.querySelector("img")) {
    const img = document.createElement("img");
    img.src = "images/logo.png";
    img.alt = "SYDF Logo";
    img.style.cssText =
      "width:40px;height:40px;border-radius:50%;object-fit:contain;background:rgba(255,255,255,0.95);padding:2px;margin-right:8px;flex-shrink:0;box-shadow:0 3px 12px rgba(26,188,156,0.3);";
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

  const footerHTML = `
        <div class="footer-content">
            <div class="footer-col">
                <h3>SYDF</h3>
                <p>Swat Youth Development Forum</p>
                <p>Empowering Youth, Building Future</p>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <a href="#" title="Facebook" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">📘</a>
                    <a href="#" title="Instagram" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">📷</a>
                    <a href="#" title="YouTube" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">▶️</a>
                    <a href="#" title="WhatsApp" style="display: inline-flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">💬</a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Explore</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="leadership.html">Leadership</a></li>
                    <li><a href="districts.html">Districts</a></li>
                    <li><a href="activities.html">Activities</a></li>
                    <li><a href="events.html">Events</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                    <li><a href="news.html">News & Blog</a></li>
                    <li><a href="members.html">Members Directory</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Get Involved</h4>
                <ul>
                    <li><a href="membership.html">Membership</a></li>
                    <li><a href="donate.html">Donate</a></li>
                    <li><a href="sponsor.html">Sponsor an Activity</a></li>
                    <li><a href="volunteer.html">Volunteer</a></li>
                    <li><a href="partners.html">Our Partners</a></li>
                    <li><a href="stories.html">Success Stories</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Support & Legal</h4>
                <ul>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="public-report.html" style="color: var(--warm); font-weight: 600;">🛡️ Public Grievances</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="feedback.html">Send Feedback</a></li>
                    <li><a href="privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms & Conditions</a></li>
                    <li><a href="login.html">Member Login</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Swat Youth Development Forum. All Rights Reserved.</p>
        </div>
    `;

  const existingFooter = document.querySelector(".glass-footer");
  if (existingFooter) existingFooter.innerHTML = footerHTML;
})();

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
// AUTHENTICATION & LOGOUT (BULLETPROOF)
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

// GLOBAL LOGOUT LISTENER
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
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999999; color: white; font-family: 'Poppins', sans-serif;`;
  overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 42px; font-weight: 700; color: #1abc9c; letter-spacing: 3px; margin-bottom: 25px;">SYDF</div>
            <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.15); border-top-color: #1abc9c; border-radius: 50%; animation: pydfSpin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 14px; opacity: 0.85;">Verifying access...</div>
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
// SIDEBAR TOGGLE & INJECTIONS
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

document.addEventListener("DOMContentLoaded", function () {
  const sidebarNav = document.querySelector(".dashboard-sidebar .sidebar-nav");
  if (!sidebarNav) return;

  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  sidebarNav.querySelectorAll("a").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href && href === currentPage) link.classList.add("active");
  });

  const isAdminPanel =
    document.querySelector(".admin-sidebar") !== null ||
    window.location.pathname.includes("admin");

  if (isAdminPanel) {
    const wrongBtn = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
      a.href.includes("member-reports.html"),
    );
    if (wrongBtn) wrongBtn.parentElement.remove();

    const hasIssueReportBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
      (a) => a.href.includes("admin-issue-reports.html"),
    );
    if (!hasIssueReportBtn) {
      const newLi = document.createElement("li");
      newLi.innerHTML = `<a href="admin-issue-reports.html"><span class="nav-icon">🚨</span><span>Member Reports</span></a>`;
      const waitlistLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("admin-waitlist.html"),
      );
      if (waitlistLink)
        waitlistLink.parentElement.insertAdjacentElement("afterend", newLi);
      else sidebarNav.appendChild(newLi);
    }

    const hasPublicGrievanceBtn = Array.from(
      sidebarNav.querySelectorAll("a"),
    ).some((a) => a.href.includes("admin-public-issues.html"));
    if (!hasPublicGrievanceBtn) {
      const newLi = document.createElement("li");
      newLi.innerHTML = `<a href="admin-public-issues.html"><span class="nav-icon">🛡️</span><span>Public Grievances</span></a>`;
      const issueReportLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("admin-issue-reports.html"),
      );
      if (issueReportLink)
        issueReportLink.parentElement.insertAdjacentElement("afterend", newLi);
      else sidebarNav.appendChild(newLi);
    }

    const hasMsgBtn = Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
      a.href.includes("admin-messages.html"),
    );
    if (!hasMsgBtn) {
      const newMsgLi = document.createElement("li");
      newMsgLi.innerHTML = `<a href="admin-messages.html"><span class="nav-icon">📩</span><span>Messages</span></a>`;
      const notifLink = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
        a.href.includes("admin-notifications.html"),
      );
      if (notifLink)
        notifLink.parentElement.insertAdjacentElement("beforebegin", newMsgLi);
      else sidebarNav.appendChild(newMsgLi);
    }

    const hasElectionBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
      (a) => a.href.includes("admin-elections.html"),
    );
    if (!hasElectionBtn) {
      const newElLi = document.createElement("li");
      newElLi.innerHTML = `<a href="admin-elections.html"><span class="nav-icon">🗳️</span><span>Elections</span></a>`;
      const appLink = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
        a.href.includes("admin-proposals.html"),
      );
      if (appLink)
        appLink.parentElement.insertAdjacentElement("afterend", newElLi);
      else sidebarNav.appendChild(newElLi);
    }

    addBottomButtons(sidebarNav);
  } else {
    const hasReportBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
      (a) => a.href.includes("member-reports.html"),
    );
    if (!hasReportBtn) {
      const newLi = document.createElement("li");
      newLi.innerHTML = `<a href="member-reports.html"><span class="nav-icon">🚨</span><span>Report Issue</span></a>`;
      const idCardLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("my-id-card.html"),
      );
      if (idCardLink)
        idCardLink.parentElement.insertAdjacentElement("afterend", newLi);
      else sidebarNav.appendChild(newLi);
    }

    const hasMemberElectionBtn = Array.from(
      sidebarNav.querySelectorAll("a"),
    ).some((a) => a.href.includes("member-elections.html"));
    if (!hasMemberElectionBtn) {
      const newElLi = document.createElement("li");
      newElLi.innerHTML = `<a href="member-elections.html"><span class="nav-icon">🗳️</span><span>Elections</span></a>`;
      const propLink = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
        a.href.includes("member-proposals.html"),
      );
      if (propLink)
        propLink.parentElement.insertAdjacentElement("afterend", newElLi);
      else sidebarNav.appendChild(newElLi);
    }

    addBottomButtons(sidebarNav);
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
// SECTION CONTROLS & RBAC (FULL LOGIC)
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
          "position:fixed; inset:0; z-index:99999; background:var(--bg-base); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;";
        overlay.innerHTML = `
          <div style="font-size:80px; margin-bottom:20px;">🚧</div>
          <h2 style="color:var(--text-primary); font-size:32px; margin-bottom:15px; font-family:'Poppins', sans-serif;">Section Temporarily Closed</h2>
          <p style="color:var(--text-secondary); max-width:500px; margin-bottom:30px; font-size:16px; font-family:'Poppins', sans-serif;">This section is currently closed by the administration. Please check back later.</p>
          <a href="index.html" class="btn-primary" style="text-decoration:none; padding:12px 30px; border-radius:10px; font-family:'Poppins', sans-serif; background:var(--accent); color:white; font-weight:600;">Return to Homepage</a>
        `;
        document.body.appendChild(overlay);
      }
    }
  } catch (err) {
    console.error("Section controls error:", err);
  }
}

async function enforceAdminPermissions() {
  if (!window.location.pathname.includes("admin")) return;
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
  if (!session) return;

  const { data: admin } = await supabaseClient
    .from("members")
    .select("role, district")
    .eq("email", session.user.email)
    .maybeSingle();
  if (!admin) return;

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
      if (restrictedHrefs.some((href) => a.getAttribute("href").includes(href)))
        a.parentElement.style.display = "none";
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
    document.querySelectorAll(".user-uid").forEach((el) => {
      el.textContent = `District Admin (${admin.district || "Unassigned"})`;
    });
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

// ==========================================
// INITIALIZE ALL
// ==========================================
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

// AUTO-LOAD SERVICES
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
// ==========================================
// AUTO-CACHE KILLER (Permanent Fix for Updates)
// ==========================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      // Purane service worker ko unregister karo taaki nayi files foran load hon
      registration.unregister();
      console.log("✅ Old Service Worker Unregistered");
    }
  });
}
// ==========================================
// MAGIC FIX: PURANI CSS FILES KO BAND KARO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Saari link tags dhoondo
  document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
    // Agar link ke andar "css/pages/" ya "admin.css" likha hai, toh usko band kar do
    if (link.href.includes("css/pages/") || link.href.includes("admin.css")) {
      link.disabled = true; // Is line se wo file load hona band ho jayegi
      console.log("✅ Purani CSS disabled:", link.href);
    }
  });
});
