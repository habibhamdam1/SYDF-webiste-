// ==========================================
// SYDF - Service Worker (PWA)
// ==========================================
const CACHE_NAME = "syf-cache-v1";
const OFFLINE_URL = "offline.html";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html",
  "/css/style.css",
  "/js/main.js",
  "/js/supabase-config.js",
  "/images/logo.png",
  "/manifest.json",
];

// ==========================================
// INSTALL
// ==========================================
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("✅ Caching app shell");
        return cache
          .addAll(
            PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })),
          )
          .catch(function (err) {
            console.warn("⚠️ Some files failed to cache:", err);
          });
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

// ==========================================
// ACTIVATE
// ==========================================
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names
            .filter(function (n) {
              return n !== CACHE_NAME;
            })
            .map(function (n) {
              return caches.delete(n);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

// ==========================================
// FETCH — Network first, cache fallback
// ==========================================
self.addEventListener("fetch", function (event) {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip Supabase, Analytics, and third-party API requests (always network)
  const url = new URL(event.request.url);
  if (url.hostname.includes("supabase.co")) return;
  if (url.hostname.includes("google-analytics")) return;
  if (url.hostname.includes("googletagmanager")) return;
  if (url.hostname.includes("api.qrserver.com")) return;
  if (url.hostname.includes("resend.com")) return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Cache successful same-origin responses
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(function () {
        // Offline — try cache
        return caches.match(event.request).then(function (cached) {
          if (cached) return cached;
          // Fallback to offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
      }),
  );
});
