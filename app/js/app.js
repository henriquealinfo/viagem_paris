/** App Paris v2 — profissional */
(function () {
  "use strict";

  const KEYS = {
    dates: "paris-trip-dates",
    checklist: "paris-trip-checklist",
    settings: "paris-trip-settings",
    reservations: "paris-trip-reservations",
    activityDone: "paris-trip-activity-done",
    activityNotes: "paris-trip-activity-notes",
    actualSpending: "paris-trip-actual-spending",
    emergencyData: "paris-trip-emergency-data",
    onboarding: "paris-trip-onboarding-done",
    visitCount: "paris-trip-visit-count",
    exchangeMeta: "paris-trip-exchange-meta",
    installDismissed: "paris-trip-install-dismissed",
    notifyMeta: "paris-trip-notify-meta",
  };

  const main = document.getElementById("app-main");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const parisClock = document.getElementById("paris-clock");
  const btnBack = document.getElementById("btn-back");
  const btnFont = document.getElementById("btn-font");
  const btnTheme = document.getElementById("btn-theme");
  const btnContrast = document.getElementById("btn-contrast");
  const btnSearch = document.getElementById("btn-search");
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const toast = document.getElementById("toast");
  const splash = document.getElementById("splash");
  const onboarding = document.getElementById("onboarding");
  const installBanner = document.getElementById("install-banner");
  const navBtns = document.querySelectorAll(".nav-btn");

  let currentView = "home";
  let selectedDay = null;
  let moreSubView = null;
  let deferredInstall = null;
  let obSlide = 0;

  /* ── Storage ── */
  function loadJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function loadSettings() {
    return loadJSON(KEYS.settings, { largeFont: false, dark: false, highContrast: false, showVersailles: false, notifications: true });
  }

  function saveSettings(s) {
    saveJSON(KEYS.settings, s);
    applySettings(s);
  }

  function loadDates() {
    const stored = loadJSON(KEYS.dates, {});
    const merged = { ...TRIP.defaultDates, ...stored };
    Object.entries(TRIP.defaultDates).forEach(([k, v]) => {
      if (v && !stored[k]) merged[k] = v;
    });
    return merged;
  }

  function saveDate(dayId, value) {
    const dates = loadDates();
    dates[dayId] = value;
    saveJSON(KEYS.dates, dates);
    updateShareUrl();
  }

  function loadChecklist() {
    return loadJSON(KEYS.checklist, {});
  }

  function toggleChecklist(id) {
    const c = loadChecklist();
    c[id] = !c[id];
    saveJSON(KEYS.checklist, c);
    return c[id];
  }

  function loadReservations() {
    const stored = loadJSON(KEYS.reservations, {});
    const merged = {};
    RESERVATIONS.forEach((r) => {
      const dates = loadDates();
      merged[r.id] = {
        code: stored[r.id]?.code || "",
        time: stored[r.id]?.time || r.defaultTime || "",
        date: stored[r.id]?.date || dates[r.dayId] || "",
      };
    });
    return merged;
  }

  function saveReservationField(id, field, value) {
    const all = loadJSON(KEYS.reservations, {});
    if (!all[id]) all[id] = {};
    all[id][field] = value;
    saveJSON(KEYS.reservations, all);
  }

  function loadActivityDone() {
    return loadJSON(KEYS.activityDone, {});
  }

  function toggleActivityDone(key) {
    const d = loadActivityDone();
    d[key] = !d[key];
    saveJSON(KEYS.activityDone, d);
    return d[key];
  }

  function dayActivityProgress(day) {
    const done = loadActivityDone();
    const count = day.activities.filter((a) => done[a.key]).length;
    return { count, total: day.activities.length };
  }

  function loadExchangeMeta() {
    return loadJSON(KEYS.exchangeMeta, { rate: TRIP.cambio, updatedAt: null });
  }

  function saveExchangeMeta(rate) {
    saveJSON(KEYS.exchangeMeta, { rate, updatedAt: new Date().toISOString() });
    TRIP.cambio = rate;
  }

  function applySettings(s) {
    document.documentElement.classList.toggle("large-font", s.largeFont);
    document.documentElement.classList.toggle("dark-mode", s.dark);
    document.documentElement.classList.toggle("high-contrast", s.highContrast);
    btnFont?.classList.toggle("active", s.largeFont);
    btnTheme.textContent = s.dark ? "\u2600\uFE0F" : "\uD83C\uDF19";
    btnContrast?.classList.toggle("active", s.highContrast);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = s.highContrast ? "#000" : s.dark ? "#0d1b2a" : "#1F4E79";
  }

  function loadEmergency() {
    return { ...TRIP.emergency, ...loadJSON(KEYS.emergencyData, {}) };
  }

  function saveEmergencyField(field, value) {
    const d = loadJSON(KEYS.emergencyData, {});
    d[field] = value;
    saveJSON(KEYS.emergencyData, d);
  }

  function loadNotes() { return loadJSON(KEYS.activityNotes, {}); }
  function saveNote(key, value) {
    const n = loadNotes(); n[key] = value; saveJSON(KEYS.activityNotes, n);
  }

  function loadActualSpending() { return loadJSON(KEYS.actualSpending, {}); }
  function saveActualSpending(dayId, value) {
    const s = loadActualSpending(); s[dayId] = value; saveJSON(KEYS.actualSpending, s);
  }

  function includeOptional() { return loadSettings().showVersailles; }

  function allDays() { return getAllDays(includeOptional()); }

  function parisNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  }

  function parisTodayIso() {
    const d = parisNow();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function parseActivityStart(timeStr) {
    const m = (timeStr || "").match(/(\d{1,2})h(\d{2})?/);
    if (!m) return null;
    return { h: Number(m[1]), m: Number(m[2] || 0) };
  }

  function getNextActivity(day) {
    const done = loadActivityDone();
    const now = parisNow();
    const cur = now.getHours() * 60 + now.getMinutes();
    let next = null;
    day.activities.forEach((a) => {
      if (done[a.key]) return;
      const t = parseActivityStart(a.time);
      if (!t) return;
      const mins = t.h * 60 + t.m;
      if (mins >= cur && (!next || mins < next.mins)) next = { activity: a, mins };
    });
    if (!next) {
      const pending = day.activities.find((a) => !done[a.key]);
      if (pending) next = { activity: pending, mins: null };
    }
    return next;
  }

  function nextActivityBanner(day) {
    const n = getNextActivity(day);
    if (!n) return `<div class="next-banner done">\u2713 Todas as atividades de hoje conclu\u00eddas!</div>`;
    const t = parseActivityStart(n.activity.time);
    const timeLabel = t ? `${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}` : n.activity.time;
    const minsLeft = n.mins != null ? n.mins - (parisNow().getHours() * 60 + parisNow().getMinutes()) : null;
    const soon = minsLeft != null && minsLeft <= 60 && minsLeft >= 0 ? ` \u00b7 em ${minsLeft} min` : "";
    return `<div class="next-banner${n.mins != null && n.mins - (parisNow().getHours() * 60 + parisNow().getMinutes()) <= 30 ? " urgent" : ""}">
      <span class="nb-label">\uD83D\uDD14 Pr\u00f3xima atividade</span>
      <strong>${timeLabel} \u2014 ${n.activity.title}</strong>
      ${n.activity.place ? `<small>\uD83D\uDCCD ${n.activity.place}${soon}</small>` : `<small>${soon}</small>`}
    </div>`;
  }

  function louvreAlertHtml() {
    const tripDates = Object.values(loadDates()).filter(Boolean);
    if (!tripDates.length) return "";
    const tripSet = new Set(tripDates);
    const match = LOUVRE_FREE.find((r) => tripSet.has(r.iso));
    if (match) {
      return `<div class="alert-box louvre-match"><strong>\uD83C\uDFA8 Louvre gr\u00e1tis coincide!</strong> ${formatDateBR(match.iso)} (${match.time}). Reserva obrigat\u00f3ria!</div>`;
    }
    const octFree = LOUVRE_FREE.find((r) => r.iso === "2026-10-02");
    const inOct = tripDates.some((d) => d.startsWith("2026-10"));
    if (inOct && octFree) {
      return `<div class="alert-box louvre-warn"><strong>Louvre gr\u00e1tis n\u00e3o coincide</strong> com sua viagem. A sexta gr\u00e1tis de outubro \u00e9 ${octFree.date} \u2014 sua viagem \u00e9 11\u201315/out. Ingresso pago (~\u20ac22).</div>`;
    }
    return "";
  }

  function updateParisClock() {
    if (!parisClock) return;
    const t = parisNow().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
    parisClock.textContent = `\uD83D\uDD50 Paris ${t}`;
  }

  function activityNoteHtml(a) {
    const note = loadNotes()[a.key] || "";
    return `<label class="act-note-label">\uD83D\uDCDD Observa\u00e7\u00e3o<textarea rows="2" data-note="${a.key}" placeholder="Ex.: port\u00e3o B, senha do guia...">${note}</textarea></label>`;
  }

  function bindActivityNotes() {
    main.querySelectorAll("[data-note]").forEach((ta) => {
      ta.addEventListener("change", (e) => saveNote(e.target.dataset.note, e.target.value));
    });
  }

  function searchActivities(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    allDays().forEach((day) => {
      day.activities.forEach((a) => {
        const hay = `${a.title} ${a.place || ""} ${a.desc || ""} ${a.transport || ""}`.toLowerCase();
        if (hay.includes(q)) results.push({ day, activity: a });
      });
    });
    return results;
  }

  function renderSearchResults(q) {
    const items = searchActivities(q);
    if (!q.trim()) { searchResults.innerHTML = ""; return; }
    if (!items.length) {
      searchResults.innerHTML = `<p class="search-empty">Nenhum resultado para "${q}"</p>`;
      return;
    }
    searchResults.innerHTML = items.map(({ day, activity: a }) => `
      <button type="button" class="search-hit" data-go-day="${day.id}">
        <span class="sh-day" style="color:${day.color}">Dia ${day.id}</span>
        <strong>${a.title}</strong>
        <small>${a.time}${a.place ? ` \u00b7 ${a.place}` : ""}</small>
      </button>`).join("");
    searchResults.querySelectorAll("[data-go-day]").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        closeSearch();
        showDay(Number(btn.dataset.goDay));
      });
    });
  }

  function openSearch() {
    searchOverlay?.classList.remove("hidden");
    searchInput?.focus();
    renderSearchResults(searchInput?.value || "");
  }

  function closeSearch() {
    searchOverlay?.classList.add("hidden");
    if (searchInput) searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";
  }

  function buildFullShareUrl() {
    const base = TRIP.appUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    const dates = loadDates();
    const pairs = Object.entries(dates).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(",");
    if (pairs) params.set("datas", pairs);
    const res = loadJSON(KEYS.reservations, {});
    const rp = RESERVATIONS.map((r) => {
      const d = res[r.id] || {};
      return `${r.id}:${d.date || ""}|${d.time || ""}|${encodeURIComponent(d.code || "")}`;
    }).filter((x) => !x.endsWith(":||")).join(",");
    if (rp) params.set("reservas", rp);
    const qs = params.toString();
    return qs ? `${base}/?${qs}` : `${base}/`;
  }

  function parseReservationsFromUrl() {
    const raw = new URLSearchParams(location.search).get("reservas");
    if (!raw) return;
    const all = loadJSON(KEYS.reservations, {});
    raw.split(",").forEach((chunk) => {
      const [id, rest] = chunk.split(":");
      if (!id || !rest) return;
      const [date, time, codeEnc] = rest.split("|");
      all[id] = { date: date || "", time: time || "", code: decodeURIComponent(codeEnc || "") };
    });
    saveJSON(KEYS.reservations, all);
  }

  function exportBackup() {
    const payload = {
      v: APP_VERSION,
      exportedAt: new Date().toISOString(),
      dates: loadDates(),
      checklist: loadChecklist(),
      reservations: loadJSON(KEYS.reservations, {}),
      activityDone: loadActivityDone(),
      activityNotes: loadNotes(),
      actualSpending: loadActualSpending(),
      emergencyData: loadJSON(KEYS.emergencyData, {}),
      settings: loadSettings(),
      exchangeMeta: loadExchangeMeta(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `paris-backup-${parisTodayIso()}.json`;
    a.click();
    showToast("Backup exportado!");
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.dates) saveJSON(KEYS.dates, data.dates);
        if (data.checklist) saveJSON(KEYS.checklist, data.checklist);
        if (data.reservations) saveJSON(KEYS.reservations, data.reservations);
        if (data.activityDone) saveJSON(KEYS.activityDone, data.activityDone);
        if (data.activityNotes) saveJSON(KEYS.activityNotes, data.activityNotes);
        if (data.actualSpending) saveJSON(KEYS.actualSpending, data.actualSpending);
        if (data.emergencyData) saveJSON(KEYS.emergencyData, data.emergencyData);
        if (data.settings) saveJSON(KEYS.settings, data.settings);
        if (data.exchangeMeta) saveJSON(KEYS.exchangeMeta, data.exchangeMeta);
        applySettings(loadSettings());
        showToast("Backup restaurado!");
        navigate("home");
      } catch {
        showToast("Arquivo inv\u00e1lido");
      }
    };
    reader.readAsText(file);
  }

  function shareReservationWhatsApp(r) {
    const d = loadReservations()[r.id] || {};
    let text = `\uD83C\uDFAB *${r.name}*\n`;
    if (d.date) text += `\uD83D\uDCC5 ${formatDateBR(d.date)}\n`;
    if (d.time) text += `\u23F0 ${d.time}\n`;
    if (d.code) text += `\uD83C\uDFAB C\u00f3digo: ${d.code}\n`;
    text += `\n${r.url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function checkTomorrowReminder() {
    if (!loadSettings().notifications || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const meta = loadJSON(KEYS.notifyMeta, {});
    const today = parisTodayIso();
    if (meta.lastCheck === today) return;
    meta.lastCheck = today;
    saveJSON(KEYS.notifyMeta, meta);
    const tomorrow = new Date(parisNow());
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
    const dates = loadDates();
    for (const [id, date] of Object.entries(dates)) {
      if (date !== tIso) continue;
      const day = findDay(id, includeOptional());
      if (!day) continue;
      const body = day.id === 4 ? "Amanh\u00e3 \u00e9 Disney \u2014 saia cedo!" : `Amanh\u00e3: Dia ${day.id} \u2014 ${day.title}`;
      try { new Notification("Paris \u2014 Lembrete", { body, icon: "icons/icon-192.png" }); } catch { /* noop */ }
      break;
    }
  }

  async function requestNotifications() {
    if (!("Notification" in window)) { showToast("Notifica\u00e7\u00f5es n\u00e3o suportadas"); return; }
    const p = await Notification.requestPermission();
    const s = loadSettings();
    s.notifications = p === "granted";
    saveSettings(s);
    showToast(p === "granted" ? "Lembretes ativados!" : "Lembretes desativados");
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2800);
  }

  async function fetchWithRetry(url, retries = 3, delay = 1200) {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch { /* retry */ }
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
    }
    return null;
  }

  /* ── URL sync de datas ── */
  function parseDatesFromUrl() {
    const params = new URLSearchParams(location.search);
    const raw = params.get("datas");
    if (!raw) return;
    const dates = loadDates();
    raw.split(",").forEach((pair) => {
      const [id, date] = pair.split(":");
      if (id && date) dates[id] = date;
    });
    saveJSON(KEYS.dates, dates);
    parseReservationsFromUrl();
  }

  function buildShareUrl() {
    return buildFullShareUrl();
  }

  function updateShareUrl() {
    const dates = loadDates();
    const pairs = Object.entries(dates)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    const url = new URL(location.href);
    if (pairs) url.searchParams.set("datas", pairs);
    else url.searchParams.delete("datas");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  /* ── Helpers ── */
  function parsePriceRange(str) {
    if (!str || str === "0" || str === "incl." || str.startsWith("0")) return { min: 0, max: 0 };
    const nums = (str.match(/[\d]+/g) || []).map(Number);
    if (!nums.length) return { min: 0, max: 0 };
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }

  function formatEur(val) {
    return val === 0 ? "Grátis" : `€ ${val.toFixed(0)}`;
  }

  function formatBrl(eur) {
    return eur === 0 ? "" : `(~ R$ ${(eur * TRIP.cambio).toFixed(0)})`;
  }

  function dayCostRange(day) {
    let min = 0, max = 0;
    day.activities.forEach((a) => {
      const p = parsePriceRange(a.priceEur);
      min += p.min;
      max += p.max;
    });
    return { min, max };
  }

  function tripCostRange() {
    let min = 0, max = 0;
    allDays().forEach((d) => {
      const c = dayCostRange(d);
      min += c.min;
      max += c.max;
    });
    min += TRIP.navigoSemanal;
    max += TRIP.navigoSemanal;
    return { min, max };
  }

  function getTodayDayId() {
    const today = parisTodayIso();
    const dates = loadDates();
    for (const [id, date] of Object.entries(dates)) {
      if (date === today) return Number(id);
    }
    return null;
  }

  function formatDateBR(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function daysBetween(fromIso, toIso) {
    const a = new Date(fromIso + "T12:00:00");
    const b = new Date(toIso + "T12:00:00");
    return Math.ceil((b - a) / 86400000);
  }

  function getTripStatus() {
    const dates = Object.values(loadDates()).filter(Boolean).sort();
    if (!dates.length) return { type: "unknown" };
    const first = dates[0];
    const last = dates[dates.length - 1];
    const today = parisTodayIso();
    if (today < first) return { type: "countdown", days: daysBetween(today, first), first };
    if (today > last) return { type: "done" };
    const todayId = getTodayDayId();
    if (todayId) {
      const day = findDay(todayId, includeOptional());
      return { type: "today", dayId: todayId, title: day.title, emoji: day.emoji, weekday: day.weekday };
    }
    return { type: "during" };
  }

  function statusBannerHtml() {
    const s = getTripStatus();
    if (s.type === "countdown") {
      const label = s.days === 1 ? "1 dia" : `${s.days} dias`;
      return `<div class="status-banner countdown" role="status"><span class="sb-icon">\u23F3</span><div><strong>Faltam ${label} para Paris!</strong><br><small>Chegada: ${formatDateBR(s.first)}</small></div></div>`;
    }
    if (s.type === "today") {
      return `<button class="status-banner today" data-goto-today="1" type="button"><span class="sb-icon">${s.emoji}</span><div><strong>Hoje: Dia ${s.dayId} \u2014 ${s.title}</strong><br><small>${s.weekday}</small></div><span class="sb-arrow">\u2192</span></button>`;
    }
    if (s.type === "done") {
      return `<div class="status-banner done" role="status"><span class="sb-icon">\u2728</span><div><strong>Viagem conclu\u00edda!</strong><br><small>Obrigado, Paris!</small></div></div>`;
    }
    if (s.type === "during") {
      return `<div class="status-banner during" role="status"><span class="sb-icon">\uD83C\uDDEB\uD83C\uDDF7</span><div><strong>Boa viagem!</strong><br><small>Aproveite cada dia em Paris.</small></div></div>`;
    }
    return `<div class="status-banner unknown" role="status"><span class="sb-icon">\uD83D\uDCC5</span><div><strong>Configure as datas</strong><br><small>Toque em um dia do roteiro para definir.</small></div></div>`;
  }

  function checklistProgress() {
    const done = CHECKLIST.filter((c) => loadChecklist()[c.id]).length;
    return { done, total: CHECKLIST.length };
  }

  function qrUrl(data) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;
  }

  function imgTag(a) {
    const fb = a.imageFallback || IMG_FALLBACK;
    return `<img src="${a.image}" data-fallback="${fb}" alt="${a.title}" loading="lazy" class="activity-img" onerror="if(this.dataset.fallback&&!this.classList.contains('is-fallback')){this.src=this.dataset.fallback;this.classList.add('is-fallback')}">`;
  }

  /* ── Weather ── */
  async function fetchWeather() {
    const { lat, lon } = TRIP.weather;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=7`;
    const data = await fetchWithRetry(url);
    return data?.daily || null;
  }

  function weatherCardHtml(daily, showRetry) {
    if (!daily) {
      return `<div class="weather-card loading">${showRetry ? `<button class="btn-retry" data-retry="weather" type="button">\uD83D\uDD04 Tentar novamente</button>` : "Previs\u00e3o indispon\u00edvel offline"}</div>`;
    }
    const dates = loadDates();
    let html = `<div class="weather-card"><h3>🌤️ Previsão — Paris</h3><div class="weather-grid">`;
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
      const code = daily.weathercode[i];
      const label = WEATHER_CODES[code] || "🌡️";
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);
      const iso = daily.time[i];
      const dayMatch = Object.entries(dates).find(([, d]) => d === iso);
      const tag = dayMatch ? ` · Dia ${dayMatch[0]}` : "";
      html += `<div class="weather-day"><span class="w-date">${formatDateBR(iso)}${tag}</span><span class="w-icon">${label}</span><span class="w-temp">${min}° – ${max}°C</span></div>`;
    }
    return html + `</div></div>`;
  }

  /* ── Render activity ── */
  function activityDoneHtml(a) {
    const done = loadActivityDone()[a.key];
    return `<label class="act-done-label" aria-label="Marcar ${a.title} como feito">
      <input type="checkbox" class="act-done-cb" data-act="${a.key}" ${done ? "checked" : ""}>
      <span class="act-done-text">${done ? "Feito \u2713" : "Marcar feito"}</span>
    </label>`;
  }

  function renderActivity(a, compact) {
    const p = parsePriceRange(a.priceEur);
    const priceMain =
      a.priceEur === "incl." ? "Incluso" : p.max === 0 ? "Grátis"
        : p.min === p.max ? formatEur(p.max) : `${formatEur(p.min)} – ${formatEur(p.max)}`;
    const brl = p.max > 0 && a.priceEur !== "incl."
      ? `<span class="price-brl">${p.min === p.max ? formatBrl(p.max) : `${formatBrl(p.min)} – ${formatBrl(p.max)}`}</span>` : "";

    const reserveBadge = a.needsReservation
      ? `<span class="badge-reserve">\u26A0\uFE0F Reservar antes</span>` : "";
    const doneCls = loadActivityDone()[a.key] ? " act-done" : "";

    const btns = [];
    if (a.maps) btns.push(`<a class="btn-secondary" href="${a.maps}" target="_blank" rel="noopener noreferrer">\uD83D\uDDFA\uFE0F Maps</a>`);
    if (a.link) btns.push(`<a class="btn-link" href="${a.link.url}" target="_blank" rel="noopener noreferrer">${a.link.label} \u2192</a>`);

    if (compact) {
      return `
        <article class="activity-compact${a.highlight ? " highlight" : ""}${doneCls}">
          <div class="ac-time">${a.time}</div>
          <div class="ac-body">
            <h3>${a.title} ${reserveBadge}</h3>
            ${a.place ? `<p class="place">\uD83D\uDCCD ${a.place}</p>` : ""}
            <div class="price-row"><span class="price-eur">${priceMain}</span>${brl}</div>
            ${activityDoneHtml(a)}
            ${activityNoteHtml(a)}
            <div class="btn-row">${btns.join("")}</div>
          </div>
        </article>`;
    }

    return `
      <article class="activity-card${a.highlight ? " highlight" : ""}${doneCls}">
        <div class="activity-img-wrap">
          ${imgTag(a)}
          <span class="time-badge">${a.time}</span>
          ${reserveBadge ? `<span class="reserve-badge-img">Reservar</span>` : ""}
        </div>
        <div class="activity-body">
          <h3>${a.title}</h3>
          ${a.place ? `<p class="place">\uD83D\uDCCD ${a.place}</p>` : ""}
          ${a.desc ? `<p class="desc">${a.desc}</p>` : ""}
          <div class="meta-row">${a.transport ? `<span class="meta-tag">\uD83D\uDE87 ${a.transport}</span>` : ""}</div>
          <div class="price-row"><span class="price-eur">${priceMain}</span>${brl}
            ${a.priceNote ? `<span class="price-note">${a.priceNote}</span>` : ""}</div>
          ${activityDoneHtml(a)}
          ${activityNoteHtml(a)}
          <div class="btn-row">${btns.join("")}</div>
        </div>
      </article>`;
  }

  function renderDayContent(day, compact) {
    const dates = loadDates();
    const cost = dayCostRange(day);
    const prog = dayActivityProgress(day);
    const costText = cost.max === 0 ? "Gr\u00e1tis (exc. refei\u00e7\u00f5es)"
      : cost.min === cost.max ? `${formatEur(cost.max)} ${formatBrl(cost.max)}`
        : `${formatEur(cost.min)} \u2013 ${formatEur(cost.max)}`;

    return `
      <div class="day-header" style="--day-color:${day.color};--day-accent:${day.accent}">
        <span class="badge">${day.emoji} Dia ${day.id}</span>
        <h2>${day.title}</h2>
        <p>${day.summary}</p>
        <div class="date-input-wrap">
          <label for="trip-date-${day.id}">\uD83D\uDCC5 Data deste dia</label>
          <input type="date" id="trip-date-${day.id}" value="${dates[day.id] || ""}" data-day="${day.id}">
        </div>
      </div>
      <div class="day-progress"><div class="progress-bar"><div class="progress-fill" style="width:${prog.total ? (prog.count / prog.total) * 100 : 0}%"></div></div>
      <span>${prog.count} de ${prog.total} atividades feitas</span></div>
      ${compact ? nextActivityBanner(day) : ""}
      <div class="day-total"><span>Custo estimado do dia</span><span class="price">${costText}</span></div>
      <div class="timeline">${day.activities.map((a) => renderActivity(a, compact)).join("")}</div>
      <button class="btn-secondary btn-block" type="button" data-share-day="${day.id}">\uD83D\uDCF2 Compartilhar dia no WhatsApp</button>`;
  }

  function bindDayDateInputs() {
    main.querySelectorAll("input[type=date][data-day]").forEach((inp) => {
      inp.addEventListener("change", (e) => saveDate(Number(e.target.dataset.day), e.target.value));
    });
    main.querySelectorAll("[data-share-day]").forEach((btn) => {
      btn.addEventListener("click", () => shareDayWhatsApp(Number(btn.dataset.shareDay)));
    });
    main.querySelectorAll(".act-done-cb").forEach((cb) => {
      cb.addEventListener("change", () => {
        toggleActivityDone(cb.dataset.act);
        if (selectedDay) {
          main.innerHTML = renderDayContent(selectedDay, currentView === "today-detail");
          bindDayDateInputs();
        } else if (currentView === "today") renderToday();
      });
    });
    bindActivityNotes();
  }

  function bindStatusBanner() {
    main.querySelector("[data-goto-today]")?.addEventListener("click", () => navigate("today"));
  }

  function bindWeatherRetry() {
    main.querySelector("[data-retry=weather]")?.addEventListener("click", () => loadWeatherSlot(true));
  }

  async function loadWeatherSlot(showRetry) {
    const slot = document.getElementById("weather-slot");
    if (!slot) return;
    slot.innerHTML = `<div class="weather-card loading">Carregando previs\u00e3o\u2026</div>`;
    const daily = await fetchWeather();
    slot.innerHTML = weatherCardHtml(daily, showRetry || !daily);
    bindWeatherRetry();
  }

  /* ── Views ── */
  function renderHome() {
    pageTitle.textContent = "Paris";
    pageSubtitle.textContent = TRIP.subtitle;
    btnBack.classList.add("hidden");
    const prog = checklistProgress();
    const e = loadEmergency();
    const hotelMaps = mapsUrl(e.hotelAddress.includes("preencher") ? "Paris" : e.hotelAddress);

    main.innerHTML = `
      ${statusBannerHtml()}
      ${louvreAlertHtml()}
      <section class="hero">
        <div class="hero-flag">\uD83C\uDDEB\uD83C\uDDF7</div>
        <h2>${TRIP.title}</h2>
        <p>Roteiro completo com fotos, mapas e pre\u00e7os.</p>
      </section>
      <div id="weather-slot"><div class="weather-card loading">Carregando previs\u00e3o\u2026</div></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="num">5</span><span class="lbl">Dias</span></div>
        <div class="stat-card"><span class="num">${prog.done}/${prog.total}</span><span class="lbl">Checklist</span></div>
        <div class="stat-card"><span class="num">🏰</span><span class="lbl">Disney</span></div>
      </div>
      <div class="emergency-card">
        <h3>\uD83C\uDD98 Emerg\u00eancia</h3>
        <div class="emergency-grid">
          <div class="emergency-hotel-block">
            <strong>Hotel</strong>
            <input class="emergency-inp" data-emg="hotel" value="${e.hotel}" placeholder="Nome do hotel">
            <input class="emergency-inp" data-emg="hotelAddress" value="${e.hotelAddress}" placeholder="Endere\u00e7o">
            <input class="emergency-inp" data-emg="hotelPhone" value="${e.hotelPhone}" placeholder="Telefone">
            <div class="hotel-qr-row">
              <a class="btn-secondary" href="${hotelMaps}" target="_blank" rel="noopener noreferrer">\uD83D\uDDFA\uFE0F Maps hotel</a>
              <img class="hotel-qr" src="${qrUrl(hotelMaps)}" alt="QR Maps hotel" width="72" height="72">
            </div>
          </div>
          <div><strong>Contato</strong><br>${e.contactName}<br>\uD83D\uDCDE ${e.contactPhone}</div>
          <div><strong>Europa</strong><br>\uD83D\uDEA8 ${e.emergencyEU}<br>\uD83C\uDFE5 ${e.medicalFR}<br>\uD83D\uDC6E ${e.policeFR}</div>
          <div><strong>Embaixada BR</strong><br>${e.embassy}<br>\uD83D\uDCDE ${e.embassyPhone}</div>
          <div><strong>Seguro</strong><br>${e.insurance}</div>
          <div><strong>Passaporte</strong><br>${e.passportNote}</div>
        </div>
      </div>
      <h2 class="section-title">Escolha o dia</h2>
      <div class="day-grid">${allDays().map((d) => {
        const dates = loadDates();
        const cost = dayCostRange(d);
        const ap = dayActivityProgress(d);
        const costLabel = cost.max === 0 ? "Gr\u00e1tis" : cost.min === cost.max ? `~\u20ac${cost.max}` : `\u20ac${cost.min}\u2013${cost.max}`;
        return `<button class="day-card" type="button" data-day="${d.id}" style="--day-color:${d.color}">
          <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id} \u2014 ${d.title}</h3>
          <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday} \u00b7 ${costLabel}${ap.count ? ` \u00b7 ${ap.count}/${ap.total} \u2713` : ""}</p></div><span class="arrow">\u203a</span></button>`;
      }).join("")}</div>`;

    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
    main.querySelectorAll("[data-emg]").forEach((inp) => {
      inp.addEventListener("change", (e) => saveEmergencyField(e.target.dataset.emg, e.target.value));
    });
    bindStatusBanner();
    loadWeatherSlot(false);
  }

  function renderToday() {
    pageTitle.textContent = "Hoje";
    btnBack.classList.add("hidden");
    const todayId = getTodayDayId();

    if (!todayId) {
      const dates = loadDates();
      main.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📅</span>
          <h2>Nenhum dia configurado para hoje</h2>
          <p>Preencha a data de cada dia no roteiro, ou escolha manualmente:</p>
          <div class="day-grid">${allDays().map((d) => `
            <button class="day-card" type="button" data-day="${d.id}" style="--day-color:${d.color}">
              <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id}${d.optional ? " (opc.)" : ""}</h3>
              <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday}</p></div></button>`).join("")}</div>
        </div>`;
      pageSubtitle.textContent = new Date().toLocaleDateString("pt-BR");
      main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day), true)));
      return;
    }

    const day = findDay(todayId, includeOptional());
    pageSubtitle.textContent = `${day.weekday} · ${formatDateBR(loadDates()[todayId])}`;
    main.innerHTML = renderDayContent(day, true);
    bindDayDateInputs();
  }

  function renderDayPicker() {
    pageTitle.textContent = "Roteiro";
    pageSubtitle.textContent = "5 dias em Paris";
    btnBack.classList.add("hidden");
    main.innerHTML = `<p class="intro-text">Toque no dia para ver horários, fotos, mapas e preços.</p>
      <label class="toggle-row"><input type="checkbox" id="toggle-versailles" ${includeOptional() ? "checked" : ""}> Mostrar dia opcional Versailles (Dia 6)</label>
      <div class="day-grid">${allDays().map((d) => `<button class="day-card" type="button" data-day="${d.id}" style="--day-color:${d.color}">
        <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id}${d.optional ? " (opc.)" : ""}</h3><p>${d.title}</p></div><span class="arrow">›</span></button>`).join("")}</div>`;
    document.getElementById("toggle-versailles")?.addEventListener("change", (e) => {
      const s = loadSettings(); s.showVersailles = e.target.checked; saveSettings(s); renderDayPicker();
    });
    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
  }

  function showDay(dayId, fromToday) {
    selectedDay = findDay(dayId, includeOptional());
    if (!selectedDay) return;
    currentView = fromToday ? "today-detail" : "day-detail";
    setActiveNav(fromToday ? "today" : "days");
    pageTitle.textContent = `Dia ${dayId}`;
    pageSubtitle.textContent = selectedDay.weekday;
    btnBack.classList.remove("hidden");
    main.innerHTML = renderDayContent(selectedDay, false);
    bindDayDateInputs();
  }

  function renderReservationCard(r) {
    const data = loadReservations()[r.id] || {};
    const hasCode = !!data.code?.trim();
    return `
      <div class="wallet-card" style="--wallet-color:${findDay(r.dayId, true)?.color || "#1F4E79"}">
        <div class="wallet-head">
          <span class="wallet-icon">${r.icon}</span>
          <div><strong>${r.name}</strong><br><small>Dia ${r.dayId}${data.date ? ` \u00b7 ${formatDateBR(data.date)}` : ""}</small></div>
        </div>
        <div class="wallet-fields">
          <label>\uD83D\uDCC5 Data<input type="date" data-res="${r.id}" data-field="date" value="${data.date || ""}"></label>
          <label>\u23F0 Hor\u00e1rio<input type="time" data-res="${r.id}" data-field="time" value="${data.time || ""}"></label>
          <label>\uD83C\uDFAB C\u00f3digo<input type="text" data-res="${r.id}" data-field="code" value="${data.code || ""}" placeholder="N\u00ba confirma\u00e7\u00e3o"></label>
        </div>
        <div class="wallet-actions">
          <a class="btn-secondary" href="${r.url}" target="_blank" rel="noopener noreferrer">Abrir bilhete \u2192</a>
          <button class="btn-secondary" type="button" data-share-res="${r.id}">\uD83D\uDCF2 WhatsApp</button>
          ${hasCode ? `<button class="btn-secondary" type="button" data-copy-code="${data.code}">Copiar c\u00f3digo</button>` : ""}
        </div>
      </div>`;
  }

  function bindReservationInputs() {
    main.querySelectorAll("[data-res]").forEach((inp) => {
      inp.addEventListener("change", (e) => {
        saveReservationField(e.target.dataset.res, e.target.dataset.field, e.target.value);
      });
    });
    main.querySelectorAll("[data-copy-code]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigator.clipboard?.writeText(btn.dataset.copyCode).then(() => showToast("C\u00f3digo copiado!"));
      });
    });
    main.querySelectorAll("[data-share-res]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = RESERVATIONS.find((x) => x.id === btn.dataset.shareRes);
        if (r) shareReservationWhatsApp(r);
      });
    });
  }

  function renderLinks() {
    pageTitle.textContent = "Reservas";
    pageSubtitle.textContent = "Cart\u00f5es e sites oficiais";
    btnBack.classList.add("hidden");
    main.innerHTML = `
      <p class="intro-text">Guarde c\u00f3digos de confirma\u00e7\u00e3o aqui. Toque em <strong>Abrir bilhete</strong> no dia da visita.</p>
      <div class="wallet-list">${RESERVATIONS.map(renderReservationCard).join("")}</div>
      <h2 class="section-title">Links r\u00e1pidos</h2>
      <div class="link-list">${BOOKING_LINKS.map((l) => `
        <a class="link-item" href="${l.url}" target="_blank" rel="noopener noreferrer">
          <span class="icon">${l.icon}</span><div><div class="name">${l.name}</div><div class="cat">${l.cat}</div></div><span class="go">\u2192</span></a>`).join("")}</div>`;
    bindReservationInputs();
  }

  function renderMore() {
    pageTitle.textContent = "Mais";
    pageSubtitle.textContent = "Ferramentas";
    btnBack.classList.add("hidden");

    if (moreSubView === "expenses") return renderExpenses();
    if (moreSubView === "checklist") return renderChecklist();
    if (moreSubView === "phrases") return renderPhrases();
    if (moreSubView === "tips") return renderTips();
    if (moreSubView === "backup") return renderBackup();

    main.innerHTML = `
      <div class="more-grid">
        <button class="more-card" type="button" data-sub="expenses">\uD83D\uDCB0<span>Gastos</span></button>
        <button class="more-card" type="button" data-sub="checklist">\u2705<span>Checklist</span></button>
        <button class="more-card" type="button" data-sub="phrases">\uD83C\uDDEB\uD83C\uDDF7<span>Frases</span></button>
        <button class="more-card" type="button" data-sub="tips">\uD83D\uDCA1<span>Dicas</span></button>
        <button class="more-card" type="button" data-action="search">\uD83D\uDD0D<span>Buscar</span></button>
        <button class="more-card" type="button" data-sub="backup">\uD83D\uDCBE<span>Backup</span></button>
        <button class="more-card" type="button" data-action="notify">\uD83D\uDD14<span>Lembretes</span></button>
        <button class="more-card" type="button" data-action="share">\uD83D\uDCF2<span>WhatsApp</span></button>
        <button class="more-card" type="button" data-action="pdf">\uD83D\uDCC4<span>Exportar PDF</span></button>
        <button class="more-card" type="button" data-action="sync">\uD83D\uDD17<span>Sincronizar</span></button>
        <button class="more-card" type="button" data-action="rate">\uD83D\uDCB1<span>C\u00e2mbio</span></button>
      </div>
      <footer class="app-footer">
        <p>Paris Trip App · v${APP_VERSION}</p>
        <p class="footer-sub">${TRIP.title}</p>
      </footer>`;

    main.querySelectorAll("[data-sub]").forEach((b) => b.addEventListener("click", () => {
      moreSubView = b.dataset.sub;
      btnBack.classList.remove("hidden");
      renderMore();
    }));
    main.querySelector("[data-action=share]")?.addEventListener("click", shareAppWhatsApp);
    main.querySelector("[data-action=pdf]")?.addEventListener("click", exportPDF);
    main.querySelector("[data-action=search]")?.addEventListener("click", openSearch);
    main.querySelector("[data-action=notify]")?.addEventListener("click", requestNotifications);
    main.querySelector("[data-action=sync]")?.addEventListener("click", () => {
      moreSubView = "sync";
      btnBack.classList.remove("hidden");
      renderSync();
    });
    main.querySelector("[data-action=rate]")?.addEventListener("click", fetchExchangeRate);
  }

  function renderExpenses() {
    pageTitle.textContent = "Gastos";
    const total = tripCostRange();
    const ex = loadExchangeMeta();
    const actual = loadActualSpending();
    const actualTotal = Object.values(actual).reduce((s, v) => s + (Number(v) || 0), 0);
    const exLabel = ex.updatedAt
      ? `Atualizado em ${new Date(ex.updatedAt).toLocaleString("pt-BR")}`
      : "C\u00e2mbio padr\u00e3o \u2014 toque em Atualizar c\u00e2mbio";
    main.innerHTML = `
      <div class="budget-hero">
        <span class="budget-label">Total estimado (${includeOptional() ? "5 dias + Versailles + Navigo" : "5 dias + Navigo"})</span>
        <span class="budget-value">${formatEur(total.min)} \u2013 ${formatEur(total.max)}</span>
        <span class="budget-brl">${formatBrl(total.min)} \u2013 ${formatBrl(total.max)}</span>
        ${actualTotal ? `<span class="budget-label">Gasto real registrado</span><span class="budget-value">\u20ac ${actualTotal.toFixed(0)} ${formatBrl(actualTotal)}</span>` : ""}
        <small>C\u00e2mbio: \u20ac1 = R$ ${TRIP.cambio.toFixed(2)}</small>
        <small class="ex-meta">${exLabel}</small>
      </div>
      <p class="intro-text">Registre quanto gastou de verdade em cada dia (\u20ac):</p>
      ${allDays().map((d) => {
        const c = dayCostRange(d);
        const dates = loadDates();
        return `<div class="budget-row spending-row" style="border-left-color:${d.color}">
          <div><strong>Dia ${d.id}</strong> \u2014 ${d.title}<br><small>Est: ${c.max === 0 ? "\u2014" : c.min === c.max ? formatEur(c.max) : `${formatEur(c.min)}\u2013${formatEur(c.max)}`}</small></div>
          <label class="spend-inp">\u20ac<input type="number" min="0" step="1" data-spend-day="${d.id}" value="${actual[d.id] || ""}" placeholder="0"></label></div>`;
      }).join("")}
      <div class="budget-row navigo"><div><strong>Navigo semanal</strong></div><div class="budget-amt">${formatEur(TRIP.navigoSemanal)} ${formatBrl(TRIP.navigoSemanal)}</div></div>`;
    main.querySelectorAll("[data-spend-day]").forEach((inp) => {
      inp.addEventListener("change", (e) => saveActualSpending(e.target.dataset.spendDay, e.target.value));
    });
  }

  function renderChecklist() {
    pageTitle.textContent = "Checklist";
    const checked = loadChecklist();
    const prog = checklistProgress();
    main.innerHTML = `
      <div class="checklist-progress"><div class="progress-bar"><div class="progress-fill" style="width:${(prog.done / prog.total) * 100}%"></div></div>
      <span>${prog.done} de ${prog.total} prontos</span></div>
      <div class="checklist">${CHECKLIST.map((c) => `
        <label class="check-item${checked[c.id] ? " done" : ""}">
          <input type="checkbox" data-check="${c.id}" ${checked[c.id] ? "checked" : ""}>
          <span class="check-icon">${c.icon}</span><span class="check-label">${c.label}</span>
        </label>`).join("")}</div>`;
    main.querySelectorAll("[data-check]").forEach((cb) => {
      cb.addEventListener("change", () => {
        toggleChecklist(cb.dataset.check);
        renderChecklist();
      });
    });
  }

  function speakFrench(text) {
    if (!("speechSynthesis" in window)) { showToast("\u00c1udio n\u00e3o dispon\u00edvel"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  function renderPhrases() {
    pageTitle.textContent = "Franc\u00eas";
    main.innerHTML = `<p class="intro-text">Toque para copiar \u00b7 \uD83D\uDD0A para ouvir a pron\u00fancia.</p>
      <div class="phrase-list">${FRENCH_PHRASES.map((p, i) => `
        <div class="phrase-item-wrap">
          <button class="phrase-item" type="button" data-phrase="${i}" aria-label="Copiar: ${p.fr}">
            <div class="phrase-pt">${p.pt}</div>
            <div class="phrase-fr">${p.fr}</div>
            ${p.note ? `<div class="phrase-note">${p.note}</div>` : ""}
          </button>
          <button class="btn-speak" type="button" data-speak="${i}" aria-label="Ouvir ${p.fr}">\uD83D\uDD0A</button>
        </div>`).join("")}</div>`;
    main.querySelectorAll("[data-phrase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = FRENCH_PHRASES[Number(btn.dataset.phrase)];
        navigator.clipboard?.writeText(p.fr).then(() => showToast(`Copiado: ${p.fr}`));
      });
    });
    main.querySelectorAll("[data-speak]").forEach((btn) => {
      btn.addEventListener("click", () => speakFrench(FRENCH_PHRASES[Number(btn.dataset.speak)].fr));
    });
  }

  function renderTips() {
    pageTitle.textContent = "Dicas";
    main.innerHTML = `
      <div class="alert-box"><strong>Louvre grátis:</strong> 1ª sexta do mês, 18h–21h45 (exc. jul/ago). Reserva obrigatória!</div>
      <div class="tip-card"><h3>💡 Dicas gerais</h3><ul>${TRIP.dicasGerais.map((t) => `<li>${t}</li>`).join("")}</ul></div>
      <div class="tip-card"><h3>🎨 Louvre — dias gratuitos 2026</h3>
        <table class="louvre-table"><thead><tr><th>Data</th><th>Dia</th><th>Horário</th></tr></thead>
        <tbody>${LOUVRE_FREE.map((r) => `<tr><td>${r.date}</td><td>${r.day}</td><td>${r.time}</td></tr>`).join("")}</tbody></table>
        <a class="btn-link" href="https://ticket.louvre.fr/en" target="_blank" rel="noopener">Reservar Louvre →</a></div>`;
  }

  function renderBackup() {
    pageTitle.textContent = "Backup";
    pageSubtitle.textContent = "Exportar / restaurar";
    main.innerHTML = `
      <div class="sync-card">
        <h3>\uD83D\uDCBE Backup completo</h3>
        <p>Salva datas, reservas, checklist, notas, gastos reais e contatos do hotel.</p>
        <button class="btn-primary btn-block" type="button" id="btn-export-backup">Exportar backup (.json)</button>
        <label class="btn-secondary btn-block file-label">Restaurar backup<input type="file" id="import-backup" accept="application/json" hidden></label>
        <p class="hint">Guarde o arquivo no celular ou envie por WhatsApp/e-mail.</p>
      </div>`;
    document.getElementById("btn-export-backup").addEventListener("click", exportBackup);
    document.getElementById("import-backup").addEventListener("change", (e) => {
      if (e.target.files[0]) importBackup(e.target.files[0]);
    });
  }

  function renderSync() {
    pageTitle.textContent = "Sincronizar";
    pageSubtitle.textContent = "Compartilhar dados";
    const url = buildFullShareUrl();
    main.innerHTML = `
      <div class="sync-card">
        <h3>\uD83D\uDD17 Sincronizar viagem</h3>
        <p>Link com datas e reservas. Quem abrir ter\u00e1 os mesmos dados salvos.</p>
        <div class="sync-url">${url}</div>
        <button class="btn-link btn-block" type="button" id="copy-sync">Copiar link</button>
        <button class="btn-secondary btn-block" type="button" id="share-sync">\uD83D\uDCF2 Enviar no WhatsApp</button>
      </div>`;
    document.getElementById("copy-sync").addEventListener("click", () => {
      navigator.clipboard?.writeText(url).then(() => showToast("Link copiado!"));
    });
    document.getElementById("share-sync").addEventListener("click", () => {
      window.open(`https://wa.me/?text=${encodeURIComponent("Roteiro Paris \u2014 dados sincronizados:\n" + url)}`, "_blank");
    });
  }

  /* ── Share & PDF ── */
  function shareAppWhatsApp() {
    const url = buildShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(`🇫🇷 Roteiro Paris — 5 dias\nFotos, mapas, preços e reservas:\n${url}`)}`, "_blank");
  }

  function shareDayWhatsApp(dayId) {
    const day = DAYS.find((d) => d.id === dayId);
    const dates = loadDates();
    let text = `🇫🇷 *Dia ${dayId} — ${day.title}*\n`;
    if (dates[dayId]) text += `📅 ${formatDateBR(dates[dayId])}\n`;
    text += `\n`;
    day.activities.forEach((a) => {
      text += `⏰ ${a.time} — ${a.title}\n`;
      if (a.place) text += `   📍 ${a.place}\n`;
      text += `   💰 ${a.priceEur}\n\n`;
    });
    text += `\nApp completo: ${TRIP.appUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function fetchExchangeRate() {
    showToast("Buscando c\u00e2mbio\u2026");
    const data = await fetchWithRetry("https://api.frankfurter.app/latest?from=EUR&to=BRL");
    if (data?.rates?.BRL) {
      saveExchangeMeta(data.rates.BRL);
      showToast(`C\u00e2mbio: \u20ac1 = R$ ${TRIP.cambio.toFixed(2)}`);
      if (moreSubView === "expenses") renderExpenses();
    } else {
      showToast("Sem conex\u00e3o \u2014 usando R$ " + TRIP.cambio.toFixed(2));
    }
  }

  function exportPDF() {
    const dates = loadDates();
    const reservations = loadReservations();
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Roteiro Paris</title>
      <style>
        @page { margin: 18mm; }
        body { font-family: 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 800px; margin: auto; }
        .cover { text-align: center; padding: 40px 20px; border-bottom: 4px solid #1F4E79; margin-bottom: 30px; page-break-after: always; }
        .cover h1 { color: #1F4E79; font-size: 2em; margin: 0; }
        h2 { color: #1F4E79; border-bottom: 2px solid #C9A227; padding-bottom: 6px; page-break-before: always; }
        h2:first-of-type { page-break-before: avoid; }
        .act { margin: 10px 0; padding: 10px 12px; border-left: 4px solid #C9A227; background: #f9f9f9; page-break-inside: avoid; }
        .time { font-weight: bold; color: #1F4E79; }
        .qr-row { display: flex; gap: 16px; flex-wrap: wrap; margin: 20px 0; }
        .qr-item { text-align: center; font-size: 0.75em; width: 110px; }
        .qr-item img { width: 90px; height: 90px; }
        .res-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.9em; }
        .res-table th, .res-table td { border: 1px solid #ddd; padding: 8px; }
        .res-table th { background: #1F4E79; color: white; }
        footer { margin-top: 40px; font-size: 0.8em; color: #888; text-align: center; }
      </style></head><body>
      <div class="cover"><div style="font-size:4em">\uD83C\uDDEB\uD83C\uDDF7</div><h1>${TRIP.title}</h1><p>${TRIP.subtitle}</p>
      <p>Gerado em ${new Date().toLocaleDateString("pt-BR")} \u00b7 v${APP_VERSION}</p></div>`;
    html += `<h2>Reservas</h2><table class="res-table"><tr><th>Atra\u00e7\u00e3o</th><th>Data</th><th>Hor\u00e1rio</th><th>C\u00f3digo</th></tr>`;
    RESERVATIONS.forEach((r) => {
      const d = reservations[r.id] || {};
      html += `<tr><td>${r.icon} ${r.name}</td><td>${d.date ? formatDateBR(d.date) : "\u2014"}</td><td>${d.time || "\u2014"}</td><td>${d.code || "\u2014"}</td></tr>`;
    });
    html += `</table><div class="qr-row">`;
    RESERVATIONS.slice(0, 6).forEach((r) => {
      html += `<div class="qr-item"><img src="${qrUrl(r.url)}" alt="QR"><br>${r.name}</div>`;
    });
    html += `</div>`;
    const notes = loadNotes();
    const actual = loadActualSpending();
    allDays().forEach((d) => {
      html += `<h2>Dia ${d.id} \u2014 ${d.title}${dates[d.id] ? " (" + formatDateBR(dates[d.id]) + ")" : ""}${d.optional ? " (opcional)" : ""}</h2>`;
      if (actual[d.id]) html += `<p><strong>Gasto real:</strong> \u20ac${actual[d.id]}</p>`;
      d.activities.forEach((a) => {
        html += `<div class="act"><span class="time">${a.time}</span> \u2014 <strong>${a.title}</strong><br>`;
        if (a.place) html += `\uD83D\uDCCD ${a.place}<br>`;
        if (a.desc) html += `${a.desc}<br>`;
        if (notes[a.key]) html += `<em>Nota: ${notes[a.key]}</em><br>`;
        html += `<span class="price">\uD83D\uDCB0 ${a.priceEur}</span></div>`;
      });
    });
    const e = loadEmergency();
    html += `<h2>Emerg\u00eancia</h2><p><strong>Hotel:</strong> ${e.hotel}<br>${e.hotelAddress}<br>${e.hotelPhone}</p>`;
    html += `<footer>Paris Trip App \u00b7 ${TRIP.appUrl}</footer></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  /* ── Splash & Onboarding ── */
  function hideSplash() {
    splash?.classList.add("splash-out");
    setTimeout(() => splash?.remove(), 500);
  }

  function showOnboardingIfNeeded() {
    if (loadJSON(KEYS.onboarding, false)) return;
    onboarding?.classList.remove("hidden");
  }

  function completeOnboarding() {
    saveJSON(KEYS.onboarding, true);
    onboarding?.classList.add("hidden");
    maybeShowInstallBanner();
  }

  function updateObSlide() {
    onboarding?.querySelectorAll(".ob-slide").forEach((s, i) => s.classList.toggle("active", i === obSlide));
    onboarding?.querySelectorAll(".ob-dot").forEach((d, i) => d.classList.toggle("active", i === obSlide));
    const btn = document.getElementById("ob-next");
    if (btn) btn.textContent = obSlide >= 2 ? "Come\u00e7ar" : "Pr\u00f3ximo";
  }

  document.getElementById("ob-next")?.addEventListener("click", () => {
    if (obSlide >= 2) completeOnboarding();
    else { obSlide++; updateObSlide(); }
  });
  document.getElementById("ob-skip")?.addEventListener("click", completeOnboarding);

  function maybeShowInstallBanner() {
    if (loadJSON(KEYS.installDismissed, false)) return;
    const visits = loadJSON(KEYS.visitCount, 0);
    if (visits >= 2 && deferredInstall && installBanner) installBanner.classList.remove("hidden");
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstall = e;
    maybeShowInstallBanner();
  });

  document.getElementById("btn-install")?.addEventListener("click", async () => {
    if (!deferredInstall) { showToast("Use o menu do navegador \u2192 Instalar app"); return; }
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    installBanner?.classList.add("hidden");
  });
  document.getElementById("btn-install-dismiss")?.addEventListener("click", () => {
    saveJSON(KEYS.installDismissed, true);
    installBanner?.classList.add("hidden");
  });

  /* ── Navigation ── */
  function setActiveNav(view) {
    navBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  }

  function navigate(view) {
    main.classList.add("view-exit");
    setTimeout(() => {
      currentView = view;
      selectedDay = null;
      moreSubView = null;
      setActiveNav(view);
      btnBack.classList.add("hidden");

      switch (view) {
        case "home": renderHome(); break;
        case "today": renderToday(); break;
        case "days": renderDayPicker(); break;
        case "links": renderLinks(); break;
        case "more": renderMore(); break;
      }
      main.classList.remove("view-exit");
      main.classList.add("view-enter");
      requestAnimationFrame(() => main.classList.remove("view-enter"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  }

  btnBack.addEventListener("click", () => {
    if (currentView === "day-detail") navigate("days");
    else if (currentView === "today-detail") navigate("today");
    else if (moreSubView) { moreSubView = null; btnBack.classList.add("hidden"); renderMore(); }
    else navigate("home");
  });

  btnFont.addEventListener("click", () => {
    const s = loadSettings();
    s.largeFont = !s.largeFont;
    saveSettings(s);
  });

  btnTheme.addEventListener("click", () => {
    const s = loadSettings();
    s.dark = !s.dark;
    saveSettings(s);
  });

  btnContrast?.addEventListener("click", () => {
    const s = loadSettings();
    s.highContrast = !s.highContrast;
    saveSettings(s);
  });

  btnSearch?.addEventListener("click", openSearch);
  searchInput?.addEventListener("input", (e) => renderSearchResults(e.target.value));
  document.getElementById("search-close")?.addEventListener("click", closeSearch);
  searchOverlay?.addEventListener("click", (e) => { if (e.target === searchOverlay) closeSearch(); });

  navBtns.forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.view)));

  /* ── Init ── */
  parseDatesFromUrl();
  const exMeta = loadExchangeMeta();
  if (exMeta.rate) TRIP.cambio = exMeta.rate;
  applySettings(loadSettings());

  const visits = loadJSON(KEYS.visitCount, 0) + 1;
  saveJSON(KEYS.visitCount, visits);

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

  updateParisClock();
  setInterval(updateParisClock, 30000);
  checkTomorrowReminder();

  setTimeout(() => {
    hideSplash();
    showOnboardingIfNeeded();
    if (loadJSON(KEYS.onboarding, false)) maybeShowInstallBanner();
    navigate("home");
  }, 900);
})();
