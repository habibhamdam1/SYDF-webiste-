// ==========================================
// SYDF - HEAD INCLUDES (SEO + PWA + Analytics)
// ==========================================
// Bas ek line add karo har public page ke <head> mein:
// <script src="js/head-includes.js"></script>
// Baaki sab ye file handle karegi.
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // ⚙️ CONFIGURATION — YAHAN EDIT KARO
  // ==========================================
  const CONFIG = {
    siteName: "Swat Youth Development Forum",
    siteShort: "SYDF",
    baseUrl: "https://habibhamdam1.github.io/SYDF-website",
    ogImage: "https://habibhamdam1.github.io/SYDF-website/images/logo.png",
    logoPath: "images/logo.png",
    themeColor: "#1abc9c",
    gaId: "G-XXXXXXXXXX", // ⚠️ YAHAN APNI GOOGLE ANALYTICS ID DAALO
  };

  // ==========================================
  // 📄 PAGE-SPECIFIC SEO META
  // ==========================================
  const PAGE_META = {
    "index.html": {
      title: "SYDF - Empowering Youth of Pakistan",
      description:
        "Swat Youth Development Forum (SYDF) — Empowering youth of Malakand Division through education, sports, community service, and leadership development.",
      keywords:
        "SYDF, Swat Youth Development Forum, Youth Pakistan, Malakand, Khyber Pakhtunkhwa, Youth Organization, Swat",
    },
    "about.html": {
      title: "About Us - SYDF",
      description:
        "Learn about SYDF's mission, vision, and journey of empowering youth across Malakand Division.",
      keywords: "about SYDF, youth organization Malakand, Swat youth forum",
    },
    "leadership.html": {
      title: "Leadership - SYDF",
      description:
        "Meet the leadership team of Swat Youth Development Forum — dedicated youth leaders driving change.",
      keywords: "SYDF leadership, youth leaders Pakistan",
    },
    "districts.html": {
      title: "Districts - SYDF",
      description:
        "SYDF operates across 9 districts of Malakand Division — Swat, Dir, Chitral, Buner, Shangla, and more.",
      keywords: "Malakand districts, SYDF presence",
    },
    "activities.html": {
      title: "Our Activities - SYDF",
      description:
        "Explore SYDF community initiatives — education, sports, health, environment, and social welfare activities across Malakand.",
      keywords: "SYDF activities, youth programs Pakistan",
    },
    "events.html": {
      title: "Events Calendar - SYDF",
      description:
        "Upcoming and past SYDF events — workshops, meetings, sports, and community gatherings.",
      keywords: "SYDF events, youth events Malakand",
    },
    "news.html": {
      title: "News & Blog - SYDF",
      description:
        "Latest news, press releases, and articles from Swat Youth Development Forum.",
      keywords: "SYDF news, youth news Pakistan",
    },
    "gallery.html": {
      title: "Gallery - SYDF",
      description:
        "Explore SYDF journey through photos — activities, events, and memorable moments.",
      keywords: "SYDF gallery, youth photos Pakistan",
    },
    "stories.html": {
      title: "Success Stories - SYDF",
      description:
        "Real stories of SYDF members creating positive change in their communities.",
      keywords: "youth success stories, SYDF achievements",
    },
    "members.html": {
      title: "Members Directory - SYDF",
      description:
        "Browse SYDF members across Malakand Division — meet the youth driving change.",
      keywords: "SYDF members, youth directory Pakistan",
    },
    "membership.html": {
      title: "Membership - SYDF",
      description:
        "Join SYDF — become a member and be part of Pakistan's youth movement for positive change.",
      keywords: "SYDF membership, join youth forum",
    },
    "donate.html": {
      title: "Donate - SYDF",
      description:
        "Support SYDF initiatives — your donation helps empower youth across Malakand Division.",
      keywords: "donate SYDF, support youth Pakistan",
    },
    "sponsor.html": {
      title: "Sponsor an Activity - SYDF",
      description:
        "Sponsor SYDF activities and support youth development programs in Malakand.",
      keywords: "sponsor SYDF, corporate sponsorship",
    },
    "volunteer.html": {
      title: "Volunteer - SYDF",
      description:
        "Become a SYDF volunteer — contribute your time and skills to youth development.",
      keywords: "volunteer SYDF, youth volunteer Pakistan",
    },
    "partners.html": {
      title: "Our Partners - SYDF",
      description:
        "Meet SYDF partner organizations collaborating for youth development.",
      keywords: "SYDF partners, youth collaboration",
    },
    "contact.html": {
      title: "Contact Us - SYDF",
      description:
        "Get in touch with Swat Youth Development Forum — we would love to hear from you.",
      keywords: "contact SYDF, youth forum contact",
    },
    "faq.html": {
      title: "FAQ - SYDF",
      description:
        "Frequently asked questions about SYDF membership, activities, and programs.",
      keywords: "SYDF FAQ, youth forum questions",
    },
    "privacy-policy.html": {
      title: "Privacy Policy - SYDF",
      description:
        "SYDF privacy policy — how we protect your personal information.",
      keywords: "SYDF privacy policy",
    },
    "terms.html": {
      title: "Terms & Conditions - SYDF",
      description:
        "SYDF terms and conditions for website usage and membership.",
      keywords: "SYDF terms, conditions",
    },
    "verify.html": {
      title: "Verify Member - SYDF",
      description: "Verify SYDF member identity through QR code scanning.",
      keywords: "SYDF verify, member verification",
      noindex: true,
    },
  };

  // ==========================================
  // 🔒 PAGES THAT SHOULDN'T BE INDEXED
  // ==========================================
  const NOINDEX_PATTERNS = [
    /^admin.*\.html$/,
    /^my-.*\.html$/,
    /^dashboard\.html$/,
    /^profile\.html$/,
    /^login\.html$/,
    /^register\.html$/,
    /^member-proposals\.html$/,
    /^settings\.html$/,
    /^notifications\.html$/,
    /^verify\.html$/,
    /-detail\.html$/, // Detail pages indexed dynamically but not in sitemap priority
    /^offline\.html$/,
  ];

  // ==========================================
  // 🔍 Detect current page
  // ==========================================
  function getCurrentPage() {
    const path = window.location.pathname;
    let page = path.substring(path.lastIndexOf("/") + 1);
    if (!page || page === "/") page = "index.html";
    return page;
  }

  function shouldNoIndex(page) {
    return NOINDEX_PATTERNS.some((pattern) => pattern.test(page));
  }

  // ==========================================
  // 📝 Inject meta tag helper
  // ==========================================
  function injectMeta(attr, value, content) {
    if (document.querySelector(`meta[${attr}="${value}"]`)) return;
    const meta = document.createElement("meta");
    meta.setAttribute(attr, value);
    meta.content = content;
    document.head.appendChild(meta);
  }

  function injectLink(rel, href, extra) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (extra) Object.assign(link, extra);
    document.head.appendChild(link);
  }

  // ==========================================
  // 🎯 MAIN — Apply everything
  // ==========================================
  const page = getCurrentPage();
  const meta = PAGE_META[page] || {};
  const noindex = shouldNoIndex(page);
  const canonicalUrl = CONFIG.baseUrl + "/" + page;
  const ogImage = CONFIG.ogImage;

  // 1. BASIC META
  injectMeta(
    "name",
    "description",
    meta.description || CONFIG.siteName + " - Empowering Youth of Pakistan",
  );
  if (meta.keywords) injectMeta("name", "keywords", meta.keywords);
  injectMeta("name", "author", CONFIG.siteName);
  injectMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  injectMeta("name", "theme-color", CONFIG.themeColor);

  // 2. OPEN GRAPH
  injectMeta("property", "og:type", "website");
  injectMeta("property", "og:site_name", CONFIG.siteName);
  injectMeta(
    "property",
    "og:title",
    meta.title || document.title || CONFIG.siteShort,
  );
  injectMeta(
    "property",
    "og:description",
    meta.description || "Empowering Youth of Pakistan - Malakand Division",
  );
  injectMeta("property", "og:image", ogImage);
  injectMeta("property", "og:url", canonicalUrl);

  // 3. TWITTER
  injectMeta("name", "twitter:card", "summary_large_image");
  injectMeta(
    "name",
    "twitter:title",
    meta.title || document.title || CONFIG.siteShort,
  );
  injectMeta(
    "name",
    "twitter:description",
    meta.description || "Empowering Youth of Pakistan",
  );
  injectMeta("name", "twitter:image", ogImage);

  // 4. CANONICAL
  if (!document.querySelector('link[rel="canonical"]')) {
    injectLink("canonical", canonicalUrl);
  }

  // 5. FAVICON
  if (!document.querySelector('link[rel="icon"]')) {
    injectLink("icon", CONFIG.logoPath, { type: "image/png" });
  }
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    injectLink("apple-touch-icon", CONFIG.logoPath);
  }

  // 6. MANIFEST
  if (!document.querySelector('link[rel="manifest"]')) {
    injectLink("manifest", "manifest.json");
  }

  // 7. UPDATE TITLE if needed
  if (meta.title && document.title !== meta.title) {
    // Append brand if missing
    if (!document.title.includes("SYDF")) {
      document.title = meta.title;
    }
  }

  // 8. GOOGLE ANALYTICS
  if (CONFIG.gaId && CONFIG.gaId !== "G-XXXXXXXXXX" && !noindex) {
    (function () {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.gaId;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", CONFIG.gaId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
      });
      console.log("✅ Google Analytics initialized");
    })();
  }

  // 9. SERVICE WORKER (PWA)
  if ("serviceWorker" in navigator && !noindex) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(function (reg) {
          console.log("✅ Service Worker registered:", reg.scope);
        })
        .catch(function (err) {
          console.warn("⚠️ Service Worker registration failed:", err);
        });
    });
  }

  // 10. DEBUG
  console.log(
    "✅ head-includes loaded for page:",
    page,
    noindex ? "(noindex)" : "(indexable)",
  );
})();
// ==========================================
// 🔧 AUTO-FIX HEADER OVERLAP
// ==========================================
// Fixed header content ke upar overlap karta hai
// Yeh function header ki actual height measure karke
// hero section ko utni padding deta hai
// ==========================================
(function () {
  function fixHeaderOverlap() {
    const header = document.querySelector(".glass-header");
    if (!header) return;

    const headerHeight = header.offsetHeight;
    const isMobile = window.innerWidth <= 768;

    // Buffer — thoda extra space
    const buffer = isMobile ? 25 : 40;
    const topPadding = headerHeight + buffer;

    // Sab hero sections ko target karo (jo bhi page pe ho)
    const heroSelectors = [
      ".hero", // Homepage
      ".page-hero", // News/Activities/Events/Gallery etc.
      ".article-hero", // News detail / Story detail
      ".detail-hero", // Activity detail / Event detail
      ".profile-hero", // Member profile
      ".album-hero", // Gallery album
      ".auth-section", // Login/Register
    ];

    heroSelectors.forEach(function (sel) {
      const el = document.querySelector(sel);
      if (el) {
        el.style.paddingTop = topPadding + "px";
      }
    });

    // Fallback — agar koi hero nahi mila (rare)
    // toh body ko padding do
    const foundHero = heroSelectors.some(function (sel) {
      return document.querySelector(sel);
    });

    if (!foundHero) {
      document.body.style.paddingTop = topPadding + "px";
    }
  }

  // Run on load
  window.addEventListener("load", function () {
    setTimeout(fixHeaderOverlap, 100);
  });

  // Run on resize (mobile orientation change / window resize)
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixHeaderOverlap, 150);
  });

  // Run after fonts load (fonts kabhi kabhi header height badha dete hain)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fixHeaderOverlap);
  }

  // Backup run (in case load event already fired)
  setTimeout(fixHeaderOverlap, 800);

  console.log("✅ Header overlap auto-fix loaded");
})();
