// ==========================================
// SYDF - MAIN JAVASCRIPT (COMPLETE + MOBILE FIX + SECTION CONTROLS)
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
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
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
  navHTML += `<li><a href="login.html" class="btn-login" id="navAuthBtn">Login</a></li>`;
  navHTML += "</ul>";

  const existingNav = document.querySelector(".glass-header nav");
  if (existingNav) existingNav.innerHTML = navHTML;

  // ✅ NAYA FIX: Add Hamburger Menu for Mobile
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

  // ✅ Add logo image in header
  const logoDiv = document.querySelector(".glass-header .logo");
  if (logoDiv && !logoDiv.querySelector("img")) {
    const img = document.createElement("img");
    img.src = "images/logo.png";
    img.alt = "SYDF Logo";
    img.style.cssText =
      "width:45px;height:45px;border-radius:50%;object-fit:contain;background:rgba(255,255,255,0.95);padding:3px;margin-right:12px;flex-shrink:0;box-shadow:0 3px 12px rgba(26,188,156,0.3);";
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
// AUTHENTICATION
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
  window.syfConfirm("Are you sure you want to logout?", async (confirmed) => {
    if (!confirmed) return;
    try {
      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (err) {
      console.error(err);
    }
    localStorage.clear();
    window.location.href = "login.html";
  });
}

function attachLogoutHandlers() {
  document.querySelectorAll(".logout-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      logoutUser();
    });
  });
}

// ==========================================
// DASHBOARD SIDEBAR TOGGLE (Mobile)
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
// SECTION CONTROLS: BLOCK PAGES & HIDE LINKS
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
    if (data) {
      data.forEach((d) => {
        settingsMap[d.key] = d.value === "true";
      });
    }

    document.querySelectorAll(".glass-header nav ul li a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.endsWith(".html")) {
        const pageName = href.replace(".html", "");
        const key = `section_${pageName}`;
        if (settingsMap[key] === false) {
          a.parentElement.style.display = "none";
        }
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

// ==========================================
// SMART ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================
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
      if (
        restrictedHrefs.some((href) => a.getAttribute("href").includes(href))
      ) {
        a.parentElement.style.display = "none";
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

    document.querySelectorAll(".user-uid").forEach((el) => {
      el.textContent = `District Admin (${admin.district || "Unassigned"})`;
    });
  }
}

// ==========================================
// SIDEBAR BUTTONS & INJECTION (MEMBER & ADMIN)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const sidebarNav = document.querySelector(".dashboard-sidebar .sidebar-nav");
  if (!sidebarNav) return;

  // 1. Auto-Highlight
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  sidebarNav.querySelectorAll("a").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href && href === currentPage) {
      link.classList.add("active");
    }
  });

  // 2. Smart Injection
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
      newLi.innerHTML = `<a href="admin-issue-reports.html"><span class="nav-icon">🚨</span><span>Issue Reports</span></a>`;
      const waitlistLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("admin-waitlist.html"),
      );
      if (waitlistLink)
        waitlistLink.parentElement.insertAdjacentElement("afterend", newLi);
      else sidebarNav.appendChild(newLi);
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
      logoutLi.querySelector("a").addEventListener("click", function (e) {
        e.preventDefault();
        if (window.logoutUser) window.logoutUser();
      });
    }
  }
}

// ==========================================
// ACTIVITIES FILTER, GALLERY, FAQ, MEMBERS
// ==========================================
const activityFilterBtns = document.querySelectorAll(".filter-btn");
const activityCards = document.querySelectorAll(".activity-card");
if (activityFilterBtns.length > 0 && activityCards.length > 0) {
  activityFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      activityFilterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const filter = this.getAttribute("data-filter");
      activityCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-status") === filter) {
          card.classList.remove("hidden");
          card.style.animation = "fadeIn 0.5s ease";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

const galleryFilterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      if (!filter) return;
      galleryFilterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  if (question) {
    question.addEventListener("click", function () {
      item.classList.toggle("open");
    });
  }
});

const faqSearch = document.getElementById("faqSearch");
if (faqSearch) {
  faqSearch.addEventListener("input", function () {
    const search = this.value.toLowerCase();
    document.querySelectorAll(".faq-item").forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(search) ? "block" : "none";
    });
  });
}

const memberSearch = document.getElementById("memberSearch");
const memberDistrict = document.getElementById("memberDistrict");
const memberRole = document.getElementById("memberRole");
function filterMembers() {
  const search = memberSearch ? memberSearch.value.toLowerCase() : "";
  const district = memberDistrict ? memberDistrict.value : "";
  const role = memberRole ? memberRole.value : "";
  document.querySelectorAll(".member-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    const cDistrict = card.getAttribute("data-district") || "";
    const cRole = card.getAttribute("data-role") || "";
    const matchSearch = !search || text.includes(search);
    const matchDistrict = !district || cDistrict === district;
    const matchRole = !role || cRole === role;
    card.style.display =
      matchSearch && matchDistrict && matchRole ? "block" : "none";
  });
}
if (memberSearch) memberSearch.addEventListener("input", filterMembers);
if (memberDistrict) memberDistrict.addEventListener("change", filterMembers);
if (memberRole) memberRole.addEventListener("change", filterMembers);

// ==========================================
// FORMS (CONTACT, VOLUNTEER, FEEDBACK, DONATE, SPONSOR, NEWSLETTER)
// ==========================================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;
    setTimeout(() => {
      window.syfSuccess("Thank you! Your message has been sent successfully.");
      contactForm.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });
}

const volunteerForm = document.getElementById("volunteerForm");
if (volunteerForm) {
  volunteerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.syfSuccess(
      "Thank you for applying as a volunteer! We will contact you soon.",
    );
    this.reset();
  });
}

const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.syfSuccess("Thank you for your feedback!");
    this.reset();
  });
}

const donateForm = document.getElementById("donateForm");
if (donateForm) {
  donateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const amount = document.getElementById("customAmount")?.value || "0";
    window.syfSuccess(
      "Thank you for your generosity! Donation Amount: Rs. " + amount,
    );
  });
}

const sponsorForm = document.getElementById("sponsorForm");
if (sponsorForm) {
  sponsorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.syfSuccess(
      "Thank you for your sponsorship interest! Our team will contact you within 24-48 hours.",
    );
    this.reset();
  });
}

document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value || "";
    window.syfSuccess("Subscribed! " + email + " added to our newsletter.");
    form.reset();
  });
});

// ==========================================
// INITIALIZE ALL
// ==========================================
window.addEventListener("load", async function () {
  setTimeout(updateNavButton, 500);
  attachLogoutHandlers();
  await enforceAdminPermissions();
  await applySectionControls();
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
