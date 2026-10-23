// ==========================================
// SYDF - MAIN JAVASCRIPT (COMPLETE)
// ==========================================

console.log("SYDF Website Loaded Successfully!");

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener("scroll", function () {
  const header = document.querySelector(".glass-header");
  if (!header) return;
  if (window.scrollY > 50) {
    header.style.background = "rgba(255, 255, 255, 0.15)";
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.1)";
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
backToTopBtn.style.cssText = `position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: rgba(26, 188, 156, 0.9); color: white; border: 1px solid rgba(255, 255, 255, 0.3); font-size: 22px; cursor: pointer; display: none; z-index: 999; backdrop-filter: blur(10px); transition: 0.3s;`;
document.body.appendChild(backToTopBtn);

window.addEventListener("scroll", function () {
  backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// CURRENT YEAR IN FOOTER
// ==========================================
const yearElement = document.querySelector(".footer-bottom p");
if (yearElement) {
  yearElement.innerHTML = `&copy; ${new Date().getFullYear()} Swat Youth Development Forum. All Rights Reserved.`;
}

// ==========================================
// AUTO HEADER & FOOTER UPDATE
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
            <p>&copy; 2026 Swat Youth Development Forum. All Rights Reserved.</p>
        </div>
    `;

  const existingFooter = document.querySelector(".glass-footer");
  if (existingFooter) existingFooter.innerHTML = footerHTML;

  console.log("✅ Header & Footer auto-updated on:", currentPage);
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
      console.log("✅ Supabase Library + Config loaded");
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
    navBtn.textContent = "👤 My Dashboard";
    navBtn.href = "dashboard.html";
    navBtn.classList.add("logged-in");
  } else {
    navBtn.textContent = "Login";
    navBtn.href = "login.html";
    navBtn.classList.remove("logged-in");
  }
}

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

async function logoutUser() {
  if (!confirm("Are you sure you want to logout?")) return;
  try {
    if (typeof supabaseClient !== "undefined" && supabaseClient) {
      await supabaseClient.auth.signOut();
    }
  } catch (err) {
    console.error(err);
  }
  localStorage.removeItem("pydf_user_email");
  localStorage.removeItem("pydf_user_id");
  window.location.href = "login.html";
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
// ACTIVITIES FILTER (activities.html)
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

// ==========================================
// GALLERY FILTER (gallery.html)
// ==========================================
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

// ==========================================
// FAQ ACCORDION (faq.html)
// ==========================================
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

// ==========================================
// MEMBERS DIRECTORY FILTER (members.html)
// ==========================================
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
// CONTACT FORM (contact.html)
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
      alert("✅ Thank you! Your message has been sent successfully.");
      contactForm.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });
}

// ==========================================
// VOLUNTEER FORM (volunteer.html)
// ==========================================
const volunteerForm = document.getElementById("volunteerForm");
if (volunteerForm) {
  volunteerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "✅ Thank you for applying as a volunteer!\n\nWe will contact you soon.",
    );
    this.reset();
  });
}

// ==========================================
// FEEDBACK FORM (feedback.html)
// ==========================================
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("✅ Thank you for your feedback!");
    this.reset();
  });
}

// ==========================================
// DONATE FORM (donate.html)
// ==========================================
const donateForm = document.getElementById("donateForm");
if (donateForm) {
  donateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const amount = document.getElementById("customAmount")?.value || "0";
    alert(
      "✅ Thank you for your generosity!\n\nDonation Amount: Rs. " + amount,
    );
  });
}

// ==========================================
// SPONSOR FORM (sponsor.html)
// ==========================================
const sponsorForm = document.getElementById("sponsorForm");
if (sponsorForm) {
  sponsorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "✅ Thank you for your sponsorship interest!\n\nOur team will contact you within 24-48 hours.",
    );
    this.reset();
  });
}

// ==========================================
// NEWSLETTER SIGNUP (footer - all pages)
// ==========================================
document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value || "";
    alert("✅ Subscribed! " + email + " added to our newsletter.");
    form.reset();
  });
});

// ==========================================
// INITIALIZE
// ==========================================
window.addEventListener("load", async function () {
  setTimeout(updateNavButton, 500);
  attachLogoutHandlers();
  const user = await protectDashboard();
  if (user) updateUserInfo(user);
});

window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;

// ==========================================
// AUTO-LOAD SERVICES
// ==========================================
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
// AUTO-HIGHLIGHT SIDEBAR LINKS
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";

  // Sidebar ke saare links ko check karo
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    // Pehle sab se 'active' class hatao
    link.classList.remove("active");

    // Agar link ka href current page se match kare, toh active laga do
    const href = link.getAttribute("href");
    if (href && href === currentPage) {
      link.classList.add("active");
    }
  });
});
// ==========================================
// MAGIC FIX: AUTO-ADD MISSING SIDEBAR BUTTONS
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const sidebarNav = document.querySelector(
    ".dashboard-sidebar .sidebar-nav ul",
  );
  if (!sidebarNav) return;

  // 1. Check and Add "Report Issue"
  const hasReportBtn = Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
    a.href.includes("member-reports.html"),
  );
  if (!hasReportBtn) {
    const newLi = document.createElement("li");
    newLi.innerHTML = `<a href="member-reports.html"><span class="nav-icon">🚨</span><span>Report Issue</span></a>`;
    const idCardLink = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
      a.href.includes("my-id-card.html"),
    );
    if (idCardLink) {
      idCardLink.parentElement.insertAdjacentElement("afterend", newLi);
    } else {
      sidebarNav.appendChild(newLi);
    }
  }

  // 2. Check and Add "Back to Website" & "Logout" at the bottom
  const hasBackBtn = Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
    a.href.includes("index.html"),
  );
  const hasLogoutBtn = Array.from(sidebarNav.querySelectorAll("a")).some((a) =>
    a.classList.contains("logout-btn"),
  );

  // Agar dono mein se koi bhi missing hai, toh divider aur buttons add karo
  if (!hasBackBtn || !hasLogoutBtn) {
    // Divider Line
    const divider = document.createElement("div");
    divider.className = "sidebar-divider";
    divider.style.cssText =
      "height: 1px; background: var(--card-border); margin: 15px 10px;";
    sidebarNav.appendChild(divider);

    // Back to Website
    if (!hasBackBtn) {
      const backLi = document.createElement("li");
      backLi.innerHTML = `<a href="index.html" class="back-to-site-btn" style="color: var(--accent);"><span class="nav-icon">🌐</span><span>Back to Website</span></a>`;
      sidebarNav.appendChild(backLi);
    }

    // Logout
    if (!hasLogoutBtn) {
      const logoutLi = document.createElement("li");
      logoutLi.innerHTML = `<a href="#" class="logout-btn" style="color: #ef4444;"><span class="nav-icon">🚪</span><span>Logout</span></a>`;
      sidebarNav.appendChild(logoutLi);

      // Re-attach logout handler since it's a new element
      logoutLi.querySelector("a").addEventListener("click", function (e) {
        e.preventDefault();
        if (window.logoutUser) window.logoutUser();
        else {
          window.syfConfirm("Logout?", async (c) => {
            if (c) {
              await supabaseClient.auth.signOut();
              window.location.href = "login.html";
            }
          });
        }
      });
    }
  }
});
// ============================================================
// MAGIC FIX: SMART SIDEBAR INJECTION (Admin vs Member)
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const sidebarNav = document.querySelector(".dashboard-sidebar .sidebar-nav");
  if (!sidebarNav) return;

  // 1. Check karo ke yeh Admin Panel hai ya Member Panel
  const isAdminPanel =
    document.querySelector(".admin-sidebar") !== null ||
    window.location.pathname.includes("admin");

  if (isAdminPanel) {
    // ==========================================
    // ADMIN PANEL FIXES
    // ==========================================
    // Pehle galti se lagaya hua "Report Issue" hatao (agar hai toh)
    const wrongBtn = Array.from(sidebarNav.querySelectorAll("a")).find((a) =>
      a.href.includes("member-reports.html"),
    );
    if (wrongBtn) wrongBtn.parentElement.remove();

    // "Issue Reports" add karo
    const hasIssueReportBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
      (a) => a.href.includes("admin-issue-reports.html"),
    );
    if (!hasIssueReportBtn) {
      const newLi = document.createElement("li");
      newLi.innerHTML = `
        <a href="admin-issue-reports.html">
          <span class="nav-icon">🚨</span>
          <span>Issue Reports</span>
          <span class="badge" id="sidebarReportBadgeJS" style="display: none">0</span>
        </a>
      `;
      // Waitlist ke baad daalo
      const waitlistLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("admin-waitlist.html"),
      );
      if (waitlistLink) {
        waitlistLink.parentElement.insertAdjacentElement("afterend", newLi);
      } else {
        sidebarNav.appendChild(newLi);
      }
    }

    // Admin ke liye Back to Website & Logout (Agar missing hain)
    addBottomButtons(sidebarNav, true);
  } else {
    // ==========================================
    // MEMBER PANEL FIXES
    // ==========================================
    // "Report Issue" add karo
    const hasReportBtn = Array.from(sidebarNav.querySelectorAll("a")).some(
      (a) => a.href.includes("member-reports.html"),
    );
    if (!hasReportBtn) {
      const newLi = document.createElement("li");
      newLi.innerHTML = `<a href="member-reports.html"><span class="nav-icon">🚨</span><span>Report Issue</span></a>`;
      const idCardLink = Array.from(sidebarNav.querySelectorAll("a")).find(
        (a) => a.href.includes("my-id-card.html"),
      );
      if (idCardLink) {
        idCardLink.parentElement.insertAdjacentElement("afterend", newLi);
      } else {
        sidebarNav.appendChild(newLi);
      }
    }

    // Member ke liye Back to Website & Logout
    addBottomButtons(sidebarNav, false);
  }
});

// Helper function for Bottom Buttons
function addBottomButtons(sidebarNav, isAdmin) {
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
// SMART ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================
async function enforceAdminPermissions() {
  // Sirf admin pages par chalao
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

  // Global variables banado taaki baqi pages use kar sakein
  window.currentAdminRole = admin.role;
  window.currentAdminDistrict = admin.district;

  // Agar District Admin hai, toh restrictions lagao
  if (admin.role === "District Admin") {
    // 1. Sidebar se global settings hide karo
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

    // 2. Faltu nav-section titles hide karo agar unke saare links hide ho gaye hain
    document.querySelectorAll(".nav-section-title").forEach((title) => {
      let nextEl = title.nextElementSibling;
      if (nextEl && nextEl.tagName === "UL") {
        let visibleLinks = Array.from(nextEl.querySelectorAll("li")).filter(
          (li) => li.style.display !== "none",
        );
        if (visibleLinks.length === 0) title.style.display = "none";
      }
    });

    // 3. Topbar mein "Super Admin" ki jagah "District Admin" dikhao
    document.querySelectorAll(".user-uid").forEach((el) => {
      el.textContent = `District Admin (${admin.district || "Unassigned"})`;
    });
  }
}

document.addEventListener("DOMContentLoaded", enforceAdminPermissions);
