const CACHE_NAME = "collabe-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./auth.html",
  "./manifest.json",
  "./favicon.ico.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ==========================================
  // 🔥 Bypass service worker for Firebase Auth
  //    and other critical API endpoints
  // ==========================================
  if (
    url.includes("securetoken.googleapis.com") ||
    url.includes("firebase.googleapis.com") ||
    url.includes("identitytoolkit.googleapis.com") ||
    url.includes("firebaseapp.com")
  ) {
    // Let the browser handle these requests directly,
    // bypassing the cache and any SW interference.
    event.respondWith(fetch(event.request));
    return;
  }

  // ==========================================
  // 🗂️ Cache-first strategy for static assets
  // ==========================================
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
