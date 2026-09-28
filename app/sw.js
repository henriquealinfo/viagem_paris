const CACHE = "roma-paris-v8";

const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/data.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => undefined)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function bareUrl(request) {
  const url = new URL(request.url);
  url.search = "";
  return url.href;
}

function isAppCode(url) {
  const path = new URL(url).pathname;
  return path.endsWith(".js") || path.endsWith(".css") || path.endsWith(".html") || /\/$/.test(path);
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = e.request.url;

  if (url.includes("open-meteo.com") || url.includes("frankfurter.app") || url.includes("qrserver.com")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  if (!url.startsWith(self.location.origin)) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);

    if (isAppCode(url)) {
      try {
        const res = await fetchWithTimeout(e.request, 2500);
        if (res && res.ok) {
          cache.put(e.request, res.clone()).catch(() => undefined);
          return res;
        }
      } catch { /* timeout or offline */ }
      return (await cache.match(e.request))
        || (await cache.match(bareUrl(e.request)))
        || Response.error();
    }

    const cached = (await cache.match(e.request)) || (await cache.match(bareUrl(e.request)));
    const refresh = fetch(e.request).then((res) => {
      if (res.ok) cache.put(e.request, res.clone()).catch(() => undefined);
      return res;
    }).catch(() => null);
    return cached || (await refresh) || Response.error();
  })());
});
