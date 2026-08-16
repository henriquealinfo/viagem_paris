const CACHE = "paris-trip-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/fonts.css",
  "./js/data.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./og-image.jpg",
  "./images/placeholder.svg",
  "./images/aeroporto.svg",
  "./images/arco.svg",
  "./images/bairro.svg",
  "./images/cafe.svg",
  "./images/champs.svg",
  "./images/compras.svg",
  "./images/disney.svg",
  "./images/hotel.svg",
  "./images/jantar.svg",
  "./images/louvre.svg",
  "./images/montmartre.svg",
  "./images/notredame.svg",
  "./images/orsay.svg",
  "./images/seine.svg",
  "./images/torre.svg",
  "./images/trocadero.svg",
  "./images/tuileries.svg",
  "./images/versailles.svg",
  "./fonts/plus-jakarta-sans-400.woff2",
  "./fonts/plus-jakarta-sans-600.woff2",
  "./fonts/plus-jakarta-sans-700.woff2",
  "./fonts/plus-jakarta-sans-800.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = e.request.url;

  if (url.includes("open-meteo.com") || url.includes("frankfurter.app") || url.includes("qrserver.com")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res.ok && url.startsWith(self.location.origin)) {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
