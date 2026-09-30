/** App Roma + Paris — roteiro 10 a 17/out/2026 */
(function () {
  "use strict";

  const KEYS = {
    dates: "roma-paris-trip-dates",
    checklist: "roma-paris-trip-checklist",
    settings: "roma-paris-trip-settings",
    reservations: "roma-paris-trip-reservations",
    activityDone: "roma-paris-trip-activity-done",
    activityNotes: "roma-paris-trip-activity-notes",
    actualSpending: "roma-paris-trip-actual-spending",
    expenseLog: "roma-paris-trip-expense-log",
    emergencyData: "roma-paris-trip-emergency-data",
    onboarding: "roma-paris-trip-onboarding-done",
    visitCount: "roma-paris-trip-visit-count",
    exchangeMeta: "roma-paris-trip-exchange-meta",
    installDismissed: "roma-paris-trip-install-dismissed",
    notifyMeta: "roma-paris-trip-notify-meta",
    phraseLang: "roma-paris-trip-phrase-lang",
    itinerary: "roma-paris-trip-itinerary",
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
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* private mode / quota */ }
  }

  function loadSettings() {
    return loadJSON(KEYS.settings, { largeFont: false, dark: false, highContrast: false, notifications: true });
  }

  function saveSettings(s) {
    saveJSON(KEYS.settings, s);
    applySettings(s);
  }

  function loadDates() {
    const defaults = (typeof TRIP !== "undefined" && TRIP.defaultDates) ? TRIP.defaultDates : {};
    const raw = loadJSON(KEYS.dates, {});
    const stored = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const merged = { ...defaults, ...stored };
    Object.entries(defaults).forEach(([k, v]) => {
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
    const list = typeof RESERVATIONS !== "undefined" && Array.isArray(RESERVATIONS) ? RESERVATIONS : [];
    list.forEach((r) => {
      const dates = loadDates();
      merged[r.id] = {
        code: stored[r.id]?.code || "",
        time: stored[r.id]?.time || (typeof routeReservationTime === "function" ? routeReservationTime(r.id) : "") || r.defaultTime || "",
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
    const acts = day && Array.isArray(day.activities) ? day.activities : [];
    const count = acts.filter((a) => done[a.key]).length;
    return { count, total: acts.length };
  }

  function loadExchangeMeta() {
    return loadJSON(KEYS.exchangeMeta, { rate: TRIP.cambio, updatedAt: null });
  }

  function saveExchangeMeta(rate) {
    saveJSON(KEYS.exchangeMeta, { rate, updatedAt: new Date().toISOString() });
    TRIP.cambio = rate;
  }

  function applySettings(s) {
    s = s || {};
    document.documentElement.classList.toggle("large-font", !!s.largeFont);
    document.documentElement.classList.toggle("dark-mode", !!s.dark);
    document.documentElement.classList.toggle("high-contrast", !!s.highContrast);
    btnFont?.classList.toggle("active", s.largeFont);
    if (btnTheme) btnTheme.textContent = s.dark ? "\u2600\uFE0F" : "\uD83C\uDF19";
    btnContrast?.classList.toggle("active", s.highContrast);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = s.highContrast ? "#000" : s.dark ? "#0d1b2a" : "#1F4E79";
  }

  function loadEmergency() {
    const base = (typeof TRIP !== "undefined" && TRIP.emergency) ? TRIP.emergency : {};
    return { ...base, ...loadJSON(KEYS.emergencyData, {}) };
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

  function loadExpenseLog() {
    let log = loadJSON(KEYS.expenseLog, null);
    if (log === null) {
      log = [];
      const legacy = loadJSON(KEYS.actualSpending, {});
      Object.entries(legacy).forEach(([dayId, amount]) => {
        const n = Number(amount);
        if (n > 0) {
          log.push({
            id: `legacy-${dayId}`,
            dayId: Number(dayId),
            amount: n,
            note: "Total do dia",
            at: new Date().toISOString(),
          });
        }
      });
      saveJSON(KEYS.expenseLog, log);
    }
    return log;
  }

  function saveExpenseLog(log) {
    saveJSON(KEYS.expenseLog, log);
  }

  function expenseSummary() {
    const log = loadExpenseLog();
    const byDay = {};
    let total = 0;
    log.forEach((e) => {
      const amt = Number(e.amount) || 0;
      total += amt;
      byDay[e.dayId] = (byDay[e.dayId] || 0) + amt;
    });
    return { total, byDay, log };
  }

  function addExpense(dayId, amount, note) {
    const n = Number(amount);
    if (!n || n <= 0) return false;
    const log = loadExpenseLog();
    log.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dayId: Number(dayId),
      amount: n,
      note: (note || "").trim() || "Gasto",
      at: new Date().toISOString(),
    });
    saveExpenseLog(log);
    return true;
  }

  function deleteExpense(id) {
    saveExpenseLog(loadExpenseLog().filter((e) => e.id !== id));
  }

  function defaultExpenseDayId() {
    const id = getTodayDayId();
    return id == null ? 1 : id;
  }

  function loadActualSpending() {
    const { byDay } = expenseSummary();
    return byDay;
  }

  function includeOptional() { return false; }

  function allDays() {
    try {
      if (typeof getAllDays === "function") {
        const days = getAllDays();
        if (Array.isArray(days)) return days;
      }
    } catch { /* DAYS ainda não existe */ }
    return typeof DAYS !== "undefined" && Array.isArray(DAYS) ? DAYS : [];
  }

  function cityOf(city) {
    if (typeof cityLabel === "function") {
      try { return cityLabel(city) || ""; } catch { /* fallback */ }
    }
    if (city === "roma") return "Roma";
    if (city === "paris") return "Paris";
    if (city === "kremlin") return "Le Kremlin-Bicêtre";
    if (city === "gru") return "São Paulo";
    return city || "";
  }

  function dayOf(id) {
    if (typeof findDay === "function") {
      try { return findDay(id); } catch { /* fallback */ }
    }
    return allDays().find((d) => d.id === Number(id)) || null;
  }

  function labelDay(day) {
    if (typeof dayLabel === "function") {
      try { return dayLabel(day); } catch { /* fallback */ }
    }
    if (!day) return "";
    return day.kind === "embarque" ? "Embarque" : `Dia ${day.id}`;
  }

  function mapsOf(place, city) {
    if (typeof mapsUrl === "function") {
      try { return mapsUrl(place, city); } catch { /* fallback */ }
    }
    if (!place) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  }

  function tripBudgetRange() {
    if (typeof budgetTotalRange === "function") {
      try { return budgetTotalRange(); } catch { /* fallback */ }
    }
    return { min: 0, max: 0 };
  }

  function tripTimezone() {
    const tz = (typeof TRIP !== "undefined" && TRIP.timezone) || "Europe/Rome";
    try {
      Intl.DateTimeFormat("en", { timeZone: tz });
      return tz;
    } catch {
      return "Europe/Rome";
    }
  }

  function clockCityName(iso) {
    const day = allDays().find((d) => loadDates()[d.id] === iso);
    if (day) return cityOf(day.city) || "Europa";
    if (iso <= "2026-10-13") return "Roma";
    if (iso >= "2026-10-14") return "Paris";
    return "Europa";
  }

  function parisDateParts(date = new Date()) {
    const parts = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tripTimezone(),
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date).forEach(({ type, value }) => { parts[type] = value; });
    return {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(parts.hour),
      minute: Number(parts.minute),
    };
  }

  function parisTodayIso() {
    return new Date().toLocaleDateString("en-CA", { timeZone: tripTimezone() });
  }

  function parisTomorrowIso() {
    const [y, m, d] = parisTodayIso().split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  }

  function parisTimeMinutes() {
    const p = parisDateParts();
    return p.hour * 60 + p.minute;
  }

  function parseActivityStart(timeStr) {
    const m = (timeStr || "").match(/(\d{1,2})h(\d{2})?/);
    if (!m) return null;
    return { h: Number(m[1]), m: Number(m[2] || 0) };
  }

  function getNextActivity(day) {
    const done = loadActivityDone();
    const cur = parisTimeMinutes();
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
    const minsLeft = n.mins != null ? n.mins - parisTimeMinutes() : null;
    const soon = minsLeft != null && minsLeft <= 60 && minsLeft >= 0 ? ` \u00b7 em ${minsLeft} min` : "";
    return `<div class="next-banner${n.mins != null && n.mins - parisTimeMinutes() <= 30 ? " urgent" : ""}">
      <span class="nb-label">\uD83D\uDD14 Pr\u00f3xima atividade</span>
      <strong>${dayWhen(day)} \u00b7 ${timeLabel} \u2014 ${n.activity.title}</strong>
      ${n.activity.place ? `<small>\uD83D\uDCCD ${n.activity.place}${soon}</small>` : `<small>${soon}</small>`}
    </div>`;
  }

  function tripAlertHtml() {
    if (typeof RESERVATIONS === "undefined" || !RESERVATIONS.length) return "";
    const missing = RESERVATIONS.filter((r) => ["vatican", "colosseum", "eiffel", "disney", "versailles", "flight-fco"].includes(r.id))
      .filter((r) => !(loadReservations()[r.id]?.code || "").trim());
    if (!missing.length) return "";
    return `<div class="alert-box"><strong>Reservas-chave ainda sem c\u00f3digo:</strong> ${missing.map((r) => r.name).join(", ")}. Guardem a confirma\u00e7\u00e3o na aba Reservas.</div>`;
  }

  function updateParisClock() {
    if (!parisClock) return;
    try {
      const t = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tripTimezone(),
      });
      const todayIso = parisTodayIso();
      parisClock.textContent = `\uD83D\uDCC5 ${shortDate(todayIso)} \u00b7 ${clockCityName(todayIso)} ${t}`;
    } catch {
      parisClock.textContent = "";
    }
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

  function normalizeSearch(text) {
    return (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function searchActivities(query) {
    const q = normalizeSearch(query.trim());
    if (!q) return [];
    const results = [];
    allDays().forEach((day) => {
      const dayHay = normalizeSearch(`${day.title} ${day.summary || ""} ${day.weekday || ""}`);
      if (dayHay.includes(q)) {
        day.activities.forEach((a) => results.push({ day, activity: a }));
        return;
      }
      day.activities.forEach((a) => {
        const hay = normalizeSearch(`${a.title} ${a.place || ""} ${a.desc || ""} ${a.transport || ""}`);
        if (hay.includes(q)) results.push({ day, activity: a });
      });
    });
    return results;
  }

  function renderSearchResults(q) {
    if (!searchResults) return;
    const query = (q || "").trim();
    if (!query) {
      searchResults.innerHTML = `<p class="search-empty">Digite um lugar ou atividade — ex.: Coliseu, Vaticano, Disney, Torre...</p>`;
      return;
    }
    const items = searchActivities(query);
    if (!items.length) {
      searchResults.innerHTML = `<p class="search-empty">Nenhum resultado para "${query}"</p>`;
      return;
    }
    searchResults.innerHTML = items.map(({ day, activity: a }) => `
      <button type="button" class="search-hit" data-go-day="${day.id}" data-act-key="${a.key}">
        <span class="sh-day" style="color:${day.color}">${labelDay(day)}</span>
        <strong>${a.title}</strong>
        <small>${activityWhen(day, a)}${a.place ? ` \u00b7 ${a.place}` : ""}</small>
      </button>`).join("");
    searchResults.querySelectorAll(".search-hit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dayId = Number(btn.dataset.goDay);
        const actKey = btn.dataset.actKey;
        closeSearch();
        showDay(dayId, false, actKey);
      });
    });
  }

  function openSearch() {
    if (onboarding && !onboarding.classList.contains("hidden")) completeOnboarding();
    if (!searchOverlay) return;
    searchOverlay.classList.remove("hidden");
    document.body.classList.add("search-open");
    renderSearchResults(searchInput?.value || "");
    requestAnimationFrame(() => searchInput?.focus());
  }

  function closeSearch() {
    searchOverlay?.classList.add("hidden");
    document.body.classList.remove("search-open");
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
    if (typeof activeItineraryId === "function" && activeItineraryId() === "opcional") params.set("roteiro", "opcional");
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
      let code = "";
      try { code = decodeURIComponent(codeEnc || ""); } catch { code = codeEnc || ""; }
      all[id] = { date: date || "", time: time || "", code };
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
      expenseLog: loadExpenseLog(),
      actualSpending: expenseSummary().byDay,
      emergencyData: loadJSON(KEYS.emergencyData, {}),
      settings: loadSettings(),
      exchangeMeta: loadExchangeMeta(),
      itinerary: typeof activeItineraryId === "function" ? activeItineraryId() : "original",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `roma-paris-backup-${parisTodayIso()}.json`;
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
        if (data.expenseLog) saveJSON(KEYS.expenseLog, data.expenseLog);
        else if (data.actualSpending) saveJSON(KEYS.actualSpending, data.actualSpending);
        if (data.emergencyData) saveJSON(KEYS.emergencyData, data.emergencyData);
        if (data.settings) saveJSON(KEYS.settings, data.settings);
        if (data.exchangeMeta) saveJSON(KEYS.exchangeMeta, data.exchangeMeta);
        if (data.itinerary === "opcional" || data.itinerary === "original") saveJSON(KEYS.itinerary, data.itinerary);
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
    const tIso = parisTomorrowIso();
    const dates = loadDates();
    for (const [id, date] of Object.entries(dates)) {
      if (date !== tIso) continue;
      const day = dayOf(id);
      if (!day) continue;
      const body = day.id === 5 ? "Amanh\u00e3 \u00e9 Disney \u2014 saiam \u00e0s 6h30!" : `Amanh\u00e3: ${labelDay(day)} \u2014 ${day.title}`;
      try { new Notification("Roma + Paris \u2014 Lembrete", { body, icon: "icons/icon-192.png" }); } catch { /* noop */ }
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
    parseItineraryFromUrl();
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

  function parseItineraryFromUrl() {
    const id = new URLSearchParams(location.search).get("roteiro");
    if (id === "opcional" || id === "original") saveJSON(KEYS.itinerary, id);
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
    if (typeof activeItineraryId === "function" && activeItineraryId() === "opcional") url.searchParams.set("roteiro", "opcional");
    else url.searchParams.delete("roteiro");
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
    const n = Number(val);
    if (!Number.isFinite(n) || n === 0) return n === 0 ? "Grátis" : "\u2014";
    return `\u20ac ${n.toFixed(0)}`;
  }

  function formatBrl(eur) {
    return eur === 0 ? "" : `(~ R$ ${(eur * TRIP.cambio).toFixed(0)})`;
  }

  function dayCostRange(day) {
    let min = 0, max = 0;
    const acts = day && Array.isArray(day.activities) ? day.activities : [];
    acts.forEach((a) => {
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
    const transport = TRIP.transportEstimate || { min: 0, max: 0 };
    min += transport.min;
    max += transport.max;
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

  function shortDate(iso) {
    if (!iso) return "";
    const [, m, d] = iso.split("-");
    return `${d}/${m}`;
  }

  function weekdayShort(weekday) {
    const map = {
      "Sábado": "Sáb", "Domingo": "Dom", "Segunda-feira": "Seg",
      "Terça-feira": "Ter", "Quarta-feira": "Qua",
      "Quinta-feira": "Qui", "Sexta-feira": "Sex",
    };
    return map[weekday] || weekday || "";
  }

  function dayWhen(day) {
    if (!day) return "";
    const date = shortDate(loadDates()[day.id]);
    const wd = weekdayShort(day.weekday);
    if (wd && date) return `${wd} ${date}`;
    return date || wd || labelDay(day);
  }

  function activityWhen(day, a) {
    const when = dayWhen(day);
    return when ? `${when} · ${a.time}` : a.time;
  }

  function activityWhenHtml(day, a) {
    return `<span class="when-day">${dayWhen(day)}</span><span class="when-time">${a.time}</span>`;
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
    if (todayId != null) {
      const day = dayOf(todayId);
      if (!day) return { type: "during" };
      return { type: "today", dayId: todayId, title: day.title, emoji: day.emoji, weekday: day.weekday, label: labelDay(day) };
    }
    return { type: "during" };
  }

  function statusBannerHtml() {
    const s = getTripStatus();
    if (s.type === "countdown") {
      const label = s.days === 1 ? "1 dia" : `${s.days} dias`;
      return `<div class="status-banner countdown" role="status"><span class="sb-icon">\u23F3</span><div><strong>Faltam ${label} para Roma!</strong><br><small>Embarque: ${formatDateBR(s.first)}</small></div></div>`;
    }
    if (s.type === "today") {
      return `<button class="status-banner today" data-goto-today="1" type="button"><span class="sb-icon">${s.emoji}</span><div><strong>Hoje: ${s.label} \u2014 ${s.title}</strong><br><small>${s.weekday}</small></div><span class="sb-arrow">\u2192</span></button>`;
    }
    if (s.type === "done") {
      return `<div class="status-banner done" role="status"><span class="sb-icon">\u2728</span><div><strong>Viagem conclu\u00edda!</strong><br><small>Obrigado, Roma e Paris!</small></div></div>`;
    }
    if (s.type === "during") {
      return `<div class="status-banner during" role="status"><span class="sb-icon">\uD83C\uDDEE\uD83C\uDDF9 \uD83C\uDDEB\uD83C\uDDF7</span><div><strong>Boa viagem!</strong><br><small>Roma, Paris, Disney e Versalhes.</small></div></div>`;
    }
    return `<div class="status-banner unknown" role="status"><span class="sb-icon">\uD83D\uDCC5</span><div><strong>Configure as datas</strong><br><small>Toque em um dia do roteiro para definir.</small></div></div>`;
  }

  function checklistProgress() {
    const items = typeof CHECKLIST !== "undefined" && Array.isArray(CHECKLIST) ? CHECKLIST : [];
    const done = items.filter((c) => loadChecklist()[c.id]).length;
    return { done, total: items.length };
  }

  function qrUrl(data) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;
  }

  function escapeXml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardCoverSrc(title, color) {
    const fill = color || "#1F4E79";
    const size = (title || "").length > 26 ? 26 : 34;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480"><rect width="800" height="480" fill="${fill}"/><text x="400" y="255" text-anchor="middle" font-family="Segoe UI,system-ui,sans-serif" font-size="${size}" fill="#F5E6C8" font-weight="700">${escapeXml(title)}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function imgTag(a, day) {
    const src = cardCoverSrc(a.title, day && day.color);
    return `<img src="${src}" alt="${escapeXml(a.title)}" class="activity-img">`;
  }

  /* ── Weather ── */
  async function fetchWeather() {
    const cities = TRIP.weather.cities || [TRIP.weather];
    const results = await Promise.all(cities.map(async (city) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FRome&forecast_days=7`;
      const data = await fetchWithRetry(url);
      return { city, daily: data?.daily || null };
    }));
    return results;
  }

  function weatherCityBlock(city, daily) {
    const dates = loadDates();
    let html = `<div class="weather-city"><h4>${city.id === "roma" ? "🇮🇹" : "🇫🇷"} ${city.name}</h4><div class="weather-grid">`;
    const limit = Math.min(4, daily.time.length);
    for (let i = 0; i < limit; i++) {
      const code = daily.weathercode[i];
      const label = WEATHER_CODES[code] || "🌡️";
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);
      const iso = daily.time[i];
      const dayMatch = Object.entries(dates).find(([, d]) => d === iso);
      const matched = dayMatch ? dayOf(dayMatch[0]) : null;
      const tag = matched ? ` · ${labelDay(matched)}` : "";
      html += `<div class="weather-day"><span class="w-date">${formatDateBR(iso)}${tag}</span><span class="w-icon">${label}</span><span class="w-temp">${min}° – ${max}°C</span></div>`;
    }
    return html + `</div></div>`;
  }

  function weatherCardHtml(results, showRetry) {
    if (!results || !results.length || results.every((r) => !r.daily)) {
      return `<div class="weather-card loading">${showRetry ? `<button class="btn-retry" data-retry="weather" type="button">\uD83D\uDD04 Tentar novamente</button>` : "Previs\u00e3o indispon\u00edvel offline"}</div>`;
    }
    const blocks = results.filter((r) => r.daily).map((r) => weatherCityBlock(r.city, r.daily)).join("");
    return `<div class="weather-card"><h3>🌤️ Previsão — Roma e Paris</h3>${blocks}</div>`;
  }

  /* ── Render activity ── */
  function activityDoneHtml(a) {
    const done = loadActivityDone()[a.key];
    return `<label class="act-done-label" aria-label="Marcar ${a.title} como feito">
      <input type="checkbox" class="act-done-cb" data-act="${a.key}" ${done ? "checked" : ""}>
      <span class="act-done-text">${done ? "Feito \u2713" : "Marcar feito"}</span>
    </label>`;
  }

  function renderActivity(a, day, compact) {
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
        <article class="activity-compact${a.highlight ? " highlight" : ""}${doneCls}" id="act-${a.key}">
          <div class="ac-time">${activityWhenHtml(day, a)}</div>
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
      <article class="activity-card${a.highlight ? " highlight" : ""}${doneCls}" id="act-${a.key}">
        <div class="activity-img-wrap">
          ${imgTag(a, day)}
          <span class="time-badge">${activityWhenHtml(day, a)}</span>
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
      ${routeSwitchHtml()}
      <div class="day-header" style="--day-color:${day.color};--day-accent:${day.accent}">
        <span class="badge">${day.emoji} ${labelDay(day)} \u00b7 ${dayWhen(day)}</span>
        <h2>${day.title}</h2>
        <p>${day.weekday}${loadDates()[day.id] ? ` \u00b7 ${formatDateBR(loadDates()[day.id])}` : ""} \u00b7 ${cityOf(day.city)}</p>
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
      <div class="timeline">${day.activities.map((a) => renderActivity(a, day, compact)).join("")}</div>
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
    bindRouteSwitch();
  }

  function routeDayNote(day) {
    if (typeof activeItineraryId !== "function" || activeItineraryId() !== "opcional") return "";
    if (typeof dayChangesInOptional === "function" && dayChangesInOptional(day.id)) return " · ordem nova";
    return "";
  }

  function routeSwitchHtml() {
    const id = typeof activeItineraryId === "function" ? activeItineraryId() : "original";
    const note = id === "opcional"
      ? "Opcional ativo: domingo segue até Trastevere, quarta caminha os Champs até o Arco, sexta fica em Montmartre até o pôr do sol."
      : "O opcional muda a ordem de domingo, quarta e sexta. Os outros dias ficam iguais.";
    return `<div class="lang-tabs" role="group" aria-label="Escolher roteiro">
      <button type="button" class="lang-tab${id === "original" ? " active" : ""}" data-route="original">Roteiro atual</button>
      <button type="button" class="lang-tab${id === "opcional" ? " active" : ""}" data-route="opcional">Roteiro opcional</button>
    </div>
    <p class="intro-text">${note}</p>`;
  }

  function bindRouteSwitch() {
    main.querySelectorAll("[data-route]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (typeof activeItineraryId === "function" && btn.dataset.route === activeItineraryId()) return;
        saveJSON(KEYS.itinerary, btn.dataset.route);
        showToast(btn.dataset.route === "opcional" ? "Roteiro opcional" : "Roteiro atual");
        updateShareUrl();
        if ((currentView === "day-detail" || currentView === "today-detail") && selectedDay) {
          showDay(selectedDay.id, currentView === "today-detail");
        } else if (currentView === "today") renderToday();
        else if (currentView === "days") renderDayPicker();
        else if (currentView === "links") renderLinks();
        else renderHome();
      });
    });
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
    const results = await fetchWeather();
    const failed = !results.length || results.every((r) => !r.daily);
    slot.innerHTML = weatherCardHtml(results, showRetry || failed);
    bindWeatherRetry();
  }

  /* ── Views ── */
  function hotelBlockHtml(e, prefix, city, title) {
    const name = e[`hotel${prefix}`] || "";
    const address = e[`hotel${prefix}Address`] || "";
    const phone = e[`hotel${prefix}Phone`] || "";
    const stay = e[`hotel${prefix}Stay`] || "";
    const booking = e[`hotel${prefix}Booking`] || "";
    const checkin = e[`hotel${prefix}Checkin`] || "";
    const extras = e[`hotel${prefix}Extras`] || "";
    const mapsCity = prefix === "Paris" ? "kremlin" : city;
    const maps = mapsOf(address.includes("preencher") ? cityOf(city) : address, mapsCity);
    const phoneHref = phone && !phone.includes("\u2026") && !phone.includes("...") ? `tel:${phone.replace(/\s/g, "")}` : "";
    const reservaLabel = prefix === "Roma" ? "Reserva Booking" : "Reserva Airbnb";
    return `
      <div class="emergency-hotel-block">
        <strong>${title}</strong>
        ${stay ? `<small class="hotel-stay">${stay}</small>` : ""}
        <input class="emergency-inp" data-emg="hotel${prefix}" value="${name}" placeholder="Nome do hotel">
        <input class="emergency-inp" data-emg="hotel${prefix}Address" value="${address}" placeholder="Endere\u00e7o">
        <input class="emergency-inp" data-emg="hotel${prefix}Phone" value="${phone}" placeholder="Telefone">
        <div class="hotel-qr-row">
          <a class="btn-secondary" href="${maps}" target="_blank" rel="noopener noreferrer">\uD83D\uDDFA\uFE0F Maps</a>
          ${phoneHref ? `<a class="btn-secondary" href="${phoneHref}">Ligar</a>` : ""}
          ${booking ? `<a class="btn-secondary" href="${booking}" target="_blank" rel="noopener noreferrer">${reservaLabel}</a>` : ""}
          ${checkin ? `<a class="btn-secondary" href="${checkin}" target="_blank" rel="noopener noreferrer">C\u00f3digo check-in</a>` : ""}
          ${extras ? `<a class="btn-secondary" href="${extras}" target="_blank" rel="noopener noreferrer">Extras</a>` : ""}
        </div>
      </div>`;
  }

  function formatRangeEur(min, max) {
    if (min === max) return formatEur(min);
    return `${formatEur(min)} \u2013 ${formatEur(max)}`;
  }

  function formatRangeBrl(min, max) {
    if (!min && !max) return "";
    if (min === max) return formatBrl(min);
    return `${formatBrl(min)} \u2013 ${formatBrl(max)}`;
  }

  function budgetHomeCardHtml() {
    if (typeof BUDGET === "undefined") return "";
    const t = tripBudgetRange();
    const n = (typeof TRIP !== "undefined" && TRIP.travelers) || 1;
    return `<button class="budget-home-card" type="button" id="btn-open-budget">
      <span class="budget-home-icon">\uD83D\uDCB0</span>
      <span class="budget-home-text">
        <strong>Custo aproximado</strong>
        <small>Por pessoa ${formatRangeEur(t.min, t.max)} \u00b7 Grupo ${formatRangeEur(t.min * n, t.max * n)}</small>
        <small>Sem passagens a\u00e9reas</small>
      </span>
      <span class="arrow">\u203a</span>
    </button>`;
  }

  function openBudget() {
    currentView = "more";
    moreSubView = "budget";
    setActiveNav("more");
    btnBack.classList.remove("hidden");
    renderBudget();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderBudget() {
    pageTitle.textContent = "Custos";
    pageSubtitle.textContent = "Estimativa sem passagens";
    if (typeof BUDGET === "undefined") {
      main.innerHTML = `<div class="empty-state"><h2>Custos</h2><p>Atualize a p\u00e1gina para carregar as estimativas.</p></div>`;
      return;
    }
    const total = tripBudgetRange();
    const n = (typeof TRIP !== "undefined" && TRIP.travelers) || 1;
    const cats = BUDGET.categories.map((cat) => {
      const r = budgetCategoryRange(cat);
      return `
        <section class="budget-cat">
          <div class="budget-cat-head">
            <h3>${cat.icon} ${cat.name}</h3>
            <span>${formatRangeEur(r.min, r.max)}</span>
          </div>
          ${cat.items.map((item) => `
            <div class="budget-line">
              <div>
                <strong>${item.name}</strong>
                ${item.note ? `<small>${item.note}</small>` : ""}
              </div>
              <span>${formatRangeEur(item.min, item.max ?? item.min)}</span>
            </div>`).join("")}
        </section>`;
    }).join("");

    main.innerHTML = `
      <div class="budget-hero">
        <span class="budget-label">Por pessoa</span>
        <span class="budget-value">${formatRangeEur(total.min, total.max)}</span>
        <span class="budget-brl">${formatRangeBrl(total.min, total.max)}</span>
        <span class="budget-label">Grupo (${n} pessoas)</span>
        <span class="budget-value group">${formatRangeEur(total.min * n, total.max * n)}</span>
        <span class="budget-brl">${formatRangeBrl(total.min * n, total.max * n)}</span>
        <small>C\u00e2mbio de planejamento: \u20ac1 = R$ ${TRIP.cambio.toFixed(2)}</small>
      </div>
      <p class="intro-text">${BUDGET.note}</p>
      ${cats}
      <button class="btn-secondary btn-block" type="button" id="btn-budget-expenses">Registrar gasto real</button>`;

    document.getElementById("btn-budget-expenses")?.addEventListener("click", openExpenses);
  }

  function flightsCardHtml() {
    if (typeof FLIGHTS === "undefined" || !FLIGHTS.length) return "";
    return `<div class="flight-card">
      <h3>\u2708\uFE0F Voos</h3>
      ${FLIGHTS.map((f) => `
        <a class="flight-row" href="${f.maps}" target="_blank" rel="noopener noreferrer">
          <strong>${f.from} \u2192 ${f.to}</strong>
          <span>${formatDateBR(f.date)} \u00b7 ${f.time}${f.arriveTime ? ` \u00b7 chega ${f.arriveTime}` : ""}</span>
          <small>${f.note}</small>
        </a>`).join("")}
    </div>`;
  }

  function renderHome() {
    try {
    if (pageTitle) pageTitle.textContent = "Roma + Paris";
    if (pageSubtitle) pageSubtitle.textContent = (typeof TRIP !== "undefined" && TRIP.subtitle) || "Nossa viagem";
    btnBack?.classList.add("hidden");
    const prog = checklistProgress();
    const e = loadEmergency();

    main.innerHTML = `
      ${statusBannerHtml()}
      ${tripAlertHtml()}
      <section class="hero">
        <div class="hero-flag">\uD83C\uDDEE\uD83C\uDDF9 \uD83C\uDDEB\uD83C\uDDF7</div>
        <h2>${TRIP.title}</h2>
        <p>5 viajantes \u00b7 2 pa\u00edses \u00b7 roteiro hor\u00e1rio a hor\u00e1rio.</p>
      </section>
      ${routeSwitchHtml()}
      ${flightsCardHtml()}
      ${budgetHomeCardHtml()}
      <div id="weather-slot"><div class="weather-card loading">Carregando previs\u00e3o\u2026</div></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="num">8</span><span class="lbl">Dias</span></div>
        <div class="stat-card"><span class="num">${prog.done}/${prog.total}</span><span class="lbl">Checklist</span></div>
        <div class="stat-card"><span class="num">2</span><span class="lbl">Cidades</span></div>
      </div>
      <div class="emergency-card">
        <h3>\uD83C\uDD98 Emerg\u00eancia</h3>
        <div class="emergency-grid">
          ${hotelBlockHtml(e, "Roma", "roma", "Hotel Roma")}
          ${hotelBlockHtml(e, "Paris", "paris", "Apto Paris")}
          <div><strong>Contato</strong><br>${e.contactName}<br>\uD83D\uDCDE ${e.contactPhone}</div>
          <div><strong>Europa / It\u00e1lia</strong><br>\uD83D\uDEA8 ${e.emergencyEU}<br>\uD83C\uDFE5 ${e.medicalIT}<br>\uD83D\uDC6E ${e.policeIT}</div>
          <div><strong>Fran\u00e7a</strong><br>\uD83C\uDFE5 ${e.medicalFR}<br>\uD83D\uDC6E ${e.policeFR}</div>
          <div><strong>Embaixada Roma</strong><br>${e.embassyRoma}<br>\uD83D\uDCDE ${e.embassyRomaPhone}</div>
          <div><strong>Embaixada Paris</strong><br>${e.embassyParis}<br>\uD83D\uDCDE ${e.embassyParisPhone}</div>
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
          <span class="emoji">${d.emoji}</span><div class="info"><h3>${labelDay(d)} \u00b7 ${dayWhen(d)} \u2014 ${d.title}</h3>
          <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday} \u00b7 ${cityOf(d.city)} \u00b7 ${costLabel}${ap.count ? ` \u00b7 ${ap.count}/${ap.total} \u2713` : ""}${routeDayNote(d)}</p></div><span class="arrow">\u203a</span></button>`;
      }).join("")}</div>`;

    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
    main.querySelectorAll("[data-emg]").forEach((inp) => {
      inp.addEventListener("change", (e) => saveEmergencyField(e.target.dataset.emg, e.target.value));
    });
    bindStatusBanner();
    bindRouteSwitch();
    document.getElementById("btn-open-budget")?.addEventListener("click", openBudget);
    loadWeatherSlot(false);
    } catch (err) {
      console.error(err);
      if (main) {
        main.innerHTML = bootErrorHtml();
        document.getElementById("btn-reload-app")?.addEventListener("click", () => location.reload());
      }
    }
  }

  function openExpenses() {
    currentView = "more";
    moreSubView = "expenses";
    setActiveNav("more");
    btnBack.classList.remove("hidden");
    pageTitle.textContent = "Gastos";
    pageSubtitle.textContent = "Registro rápido";
    renderExpenses();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderToday() {
    pageTitle.textContent = "Hoje";
    btnBack.classList.add("hidden");
    const todayId = getTodayDayId();

    if (todayId == null) {
      const dates = loadDates();
      main.innerHTML = `
        ${routeSwitchHtml()}
        <div class="empty-state">
          <span class="empty-icon">📅</span>
          <h2>Nenhum dia configurado para hoje</h2>
          <p>Preencha a data de cada dia no roteiro, ou escolha manualmente:</p>
          <div class="day-grid">${allDays().map((d) => `
            <button class="day-card" type="button" data-day="${d.id}" style="--day-color:${d.color}">
              <span class="emoji">${d.emoji}</span><div class="info"><h3>${labelDay(d)}</h3>
              <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday} · ${cityOf(d.city)}${routeDayNote(d)}</p></div></button>`).join("")}</div>
        </div>`;
      pageSubtitle.textContent = new Date().toLocaleDateString("pt-BR");
      main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day), true)));
      bindRouteSwitch();
      return;
    }

    const day = dayOf(todayId);
    const todaySpent = expenseSummary().byDay[todayId] || 0;
    pageSubtitle.textContent = `${day.weekday} · ${formatDateBR(loadDates()[todayId])} · ${cityOf(day.city)}`;
    main.innerHTML = renderDayContent(day, true) + `
      <button class="expense-today-btn" type="button" id="btn-add-expense">
        \uD83D\uDCB0 ${todaySpent ? `Hoje: ${formatEur(todaySpent)} \u00b7 ` : ""}Registrar gasto
      </button>`;
    bindDayDateInputs();
    document.getElementById("btn-add-expense")?.addEventListener("click", openExpenses);
  }

  function renderDayPicker() {
    pageTitle.textContent = "Roteiro";
    pageSubtitle.textContent = "Roma · Paris · 10 a 17/out";
    btnBack.classList.add("hidden");
    main.innerHTML = `${routeSwitchHtml()}
      <div class="day-grid">${allDays().map((d) => `<button class="day-card" type="button" data-day="${d.id}" style="--day-color:${d.color}">
        <span class="emoji">${d.emoji}</span><div class="info"><h3>${labelDay(d)} · ${dayWhen(d)}</h3><p>${d.title} · ${cityOf(d.city)}${d.pace ? ` · ${d.pace}` : ""}${routeDayNote(d)}</p></div><span class="arrow">›</span></button>`).join("")}</div>`;
    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
    bindRouteSwitch();
  }

  function showDay(dayId, fromToday, activityKey) {
    selectedDay = dayOf(dayId);
    if (!selectedDay) return;
    currentView = fromToday ? "today-detail" : "day-detail";
    setActiveNav(fromToday ? "today" : "days");
    pageTitle.textContent = `${labelDay(selectedDay)} · ${dayWhen(selectedDay)}`;
    pageSubtitle.textContent = `${selectedDay.weekday} · ${loadDates()[selectedDay.id] ? formatDateBR(loadDates()[selectedDay.id]) + " · " : ""}${cityOf(selectedDay.city)}`;
    btnBack.classList.remove("hidden");
    main.innerHTML = renderDayContent(selectedDay, false);
    bindDayDateInputs();
    if (activityKey) {
      requestAnimationFrame(() => {
        document.getElementById(`act-${activityKey}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function renderReservationCard(r) {
    const data = loadReservations()[r.id] || {};
    const hasCode = !!data.code?.trim();
    return `
      <div class="wallet-card" style="--wallet-color:${dayOf(r.dayId)?.color || "#1F4E79"}">
        <div class="wallet-head">
          <span class="wallet-icon">${r.icon}</span>
          <div><strong>${r.name}</strong><br><small>${labelDay(dayOf(r.dayId))} \u00b7 ${dayWhen(dayOf(r.dayId))}${data.date ? ` \u00b7 ${formatDateBR(data.date)}` : ""}</small></div>
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

    if (moreSubView === "budget") return renderBudget();
    if (moreSubView === "expenses") return renderExpenses();
    if (moreSubView === "checklist") return renderChecklist();
    if (moreSubView === "phrases") return renderPhrases();
    if (moreSubView === "tips") return renderTips();
    if (moreSubView === "backup") return renderBackup();

    main.innerHTML = `
      <div class="more-grid">
        <button class="more-card" type="button" data-sub="budget">\uD83D\uDCCA<span>Custos</span></button>
        <button class="more-card" type="button" data-sub="expenses">\uD83D\uDCB0<span>Gastos</span></button>
        <button class="more-card" type="button" data-sub="checklist">\u2705<span>Checklist</span></button>
        <button class="more-card" type="button" data-sub="phrases">\uD83C\uDDEE\uD83C\uDDF9<span>Frases</span></button>
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
        <p>Roma + Paris · v${APP_VERSION}</p>
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
    pageSubtitle.textContent = "Registro rápido";
    const total = tripCostRange();
    const ex = loadExchangeMeta();
    const { total: spent, byDay, log } = expenseSummary();
    const defaultDay = defaultExpenseDayId();
    const exLabel = ex.updatedAt
      ? `Atualizado em ${new Date(ex.updatedAt).toLocaleString("pt-BR")}`
      : "C\u00e2mbio padr\u00e3o \u2014 toque em Atualizar c\u00e2mbio";

    const dayOptions = allDays().map((d) => {
      const dates = loadDates();
      const label = dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday;
      return `<option value="${d.id}" ${d.id === defaultDay ? "selected" : ""}>${labelDay(d)} \u00b7 ${dayWhen(d)} \u2014 ${label}</option>`;
    }).join("");

    const grouped = {};
    log.forEach((e) => {
      if (!grouped[e.dayId]) grouped[e.dayId] = [];
      grouped[e.dayId].push(e);
    });

    const listHtml = allDays().map((d) => {
      const items = grouped[d.id];
      if (!items?.length) return "";
      const sub = byDay[d.id] || 0;
      return `
        <div class="expense-day-group" style="--day-color:${d.color}">
          <div class="expense-day-head">
            <strong>${labelDay(d)} \u00b7 ${dayWhen(d)}</strong>
            <span>${formatEur(sub)} ${formatBrl(sub)}</span>
          </div>
          ${items.map((e) => `
            <div class="expense-item">
              <div class="expense-item-main">
                <span class="expense-amt">${formatEur(e.amount)}</span>
                <span class="expense-note">${e.note}</span>
              </div>
              <button type="button" class="expense-del" data-del-exp="${e.id}" aria-label="Apagar">\u2715</button>
            </div>`).join("")}
        </div>`;
    }).join("");

    main.innerHTML = `
      <div class="budget-hero">
        <span class="budget-label">Gasto registrado</span>
        <span class="budget-value">${spent ? formatEur(spent) : "\u20ac 0"}</span>
        <span class="budget-brl">${spent ? formatBrl(spent) : "R$ 0"}</span>
        <span class="budget-label">Estimativa da viagem</span>
        <span class="budget-brl">${formatEur(total.min)} \u2013 ${formatEur(total.max)} ${formatBrl(total.min)}\u2013${formatBrl(total.max)}</span>
        <small>C\u00e2mbio: \u20ac1 = R$ ${TRIP.cambio.toFixed(2)}</small>
        <small class="ex-meta">${exLabel}</small>
      </div>

      <form class="expense-quick" id="expense-form">
        <h3 class="expense-quick-title">\u2795 Registrar gasto</h3>
        <div class="expense-amt-row">
          <label class="expense-field grow">
            <span>Valor (\u20ac)</span>
            <input type="number" id="exp-amount" min="0.01" step="0.01" inputmode="decimal" placeholder="0" required>
          </label>
          <label class="expense-field grow">
            <span>O qu\u00ea?</span>
            <input type="text" id="exp-note" placeholder="Almo\u00e7o, metr\u00f4..." maxlength="60">
          </label>
        </div>
        <div class="expense-chips">
          ${[5, 10, 15, 20, 30, 50].map((n) => `<button type="button" class="expense-chip" data-chip="${n}">\u20ac${n}</button>`).join("")}
        </div>
        <label class="expense-field">
          <span>Dia</span>
          <select id="exp-day">${dayOptions}</select>
        </label>
        <button class="btn-primary btn-block" type="submit">Salvar gasto</button>
      </form>

      ${log.length
        ? `<h2 class="section-title">Hist\u00f3rico</h2>${listHtml}`
        : `<p class="intro-text expense-empty">Nenhum gasto ainda. Use o formul\u00e1rio acima \u2014 leva 5 segundos.</p>`}`;

    main.querySelector("#expense-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = document.getElementById("exp-amount")?.value;
      const note = document.getElementById("exp-note")?.value;
      const dayId = document.getElementById("exp-day")?.value;
      if (!addExpense(dayId, amount, note)) {
        showToast("Informe um valor v\u00e1lido");
        return;
      }
      showToast(`Gasto de \u20ac${Number(amount)} registrado!`);
      renderExpenses();
    });

    main.querySelectorAll("[data-chip]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const inp = document.getElementById("exp-amount");
        if (inp) inp.value = btn.dataset.chip;
        document.getElementById("exp-note")?.focus();
      });
    });

    main.querySelectorAll("[data-del-exp]").forEach((btn) => {
      btn.addEventListener("click", () => {
        deleteExpense(btn.dataset.delExp);
        renderExpenses();
      });
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

  function speakPhrase(text, lang) {
    if (!("speechSynthesis" in window)) { showToast("\u00c1udio n\u00e3o dispon\u00edvel"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  function renderPhrases() {
    const activeId = loadJSON(KEYS.phraseLang, "it");
    const pack = PHRASE_PACKS.find((p) => p.id === activeId) || PHRASE_PACKS[0];
    pageTitle.textContent = "Frases";
    pageSubtitle.textContent = pack.label;
    main.innerHTML = `
      <div class="lang-tabs" role="tablist">
        ${PHRASE_PACKS.map((p) => `<button type="button" class="lang-tab${p.id === pack.id ? " active" : ""}" data-lang="${p.id}">${p.flag} ${p.label}</button>`).join("")}
      </div>
      <p class="intro-text">Toque para copiar \u00b7 \uD83D\uDD0A para ouvir a pron\u00fancia.</p>
      <div class="phrase-list">${pack.items.map((p, i) => `
        <div class="phrase-item-wrap">
          <button class="phrase-item" type="button" data-phrase="${i}" aria-label="Copiar: ${p.lang}">
            <div class="phrase-pt">${p.pt}</div>
            <div class="phrase-fr">${p.lang}</div>
            ${p.note ? `<div class="phrase-note">${p.note}</div>` : ""}
          </button>
          <button class="btn-speak" type="button" data-speak="${i}" aria-label="Ouvir ${p.lang}">\uD83D\uDD0A</button>
        </div>`).join("")}</div>`;
    main.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        saveJSON(KEYS.phraseLang, btn.dataset.lang);
        renderPhrases();
      });
    });
    main.querySelectorAll("[data-phrase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = pack.items[Number(btn.dataset.phrase)];
        navigator.clipboard?.writeText(p.lang).then(() => showToast(`Copiado: ${p.lang}`));
      });
    });
    main.querySelectorAll("[data-speak]").forEach((btn) => {
      btn.addEventListener("click", () => speakPhrase(pack.items[Number(btn.dataset.speak)].lang, pack.voice));
    });
  }

  function renderTips() {
    pageTitle.textContent = "Dicas";
    pageSubtitle.textContent = "Do guia da viagem";
    main.innerHTML = `
      <div class="alert-box"><strong>Onde vale pagar mais:</strong> voo em hor\u00e1rio conveniente, hotel central em Paris, ingresso com hor\u00e1rio do Vaticano/Coliseu e um jantar especial.</div>
      <div class="tip-card"><h3>\uD83D\uDCA1 Dicas gerais</h3><ul>${TRIP.dicasGerais.map((t) => `<li>${t}</li>`).join("")}</ul></div>
      <div class="tip-card"><h3>\uD83D\uDEEB Log\u00edstica</h3>
        <ul>
          <li>Roma: hotel em San Giovanni, ao lado do metr\u00f4. Centro, Vaticano e FCO de metr\u00f4 ou t\u00e1xi quando o grupo cansar.</li>
          <li>Paris: Terracotta em Le Kremlin-Bic\u00eatre (apto. 68, 2\u00ba andar). Metr\u00f4 14 / 7. De Orly a linha 14 \u00e9 a mais direta.</li>
          <li>Check-in do Terracotta: formul\u00e1rio com e-mail obrigat\u00f3rio no dia 13/10; as instru\u00e7\u00f5es chegam por e-mail. Concierge NAPS IMMO: +33 6 51 45 48 36.</li>
          <li>Disney: RER A at\u00e9 Marne-la-Vall\u00e9e\u2013Chessy.</li>
          <li>Versalhes: RER C at\u00e9 Versailles Ch\u00e2teau Rive Gauche.</li>
          <li>CDG: RER B ou transfer, conforme hor\u00e1rio e bagagem.</li>
        </ul>
      </div>
      <div class="tip-card"><h3>\uD83D\uDCB0 Refer\u00eancia por pessoa</h3>
        <p>C\u00e2mbio de planejamento do guia: \u20ac1 \u2248 R$ 5,90.</p>
        <ul>
          <li>Pante\u00e3o \u20ac7 \u00b7 Vaticano \u20ac25 \u00b7 Coliseu ~\u20ac18\u201325</li>
          <li>Arco \u20ac16 \u00b7 Torre ~\u20ac23\u201336 \u00b7 Cruzeiro ~\u20ac18\u201325</li>
          <li>Disney 1 parque ~\u20ac80\u201395 \u00b7 Versalhes ~\u20ac35 \u00b7 \u00d3pera ~\u20ac25</li>
        </ul>
      </div>
      <a class="btn-link" href="https://travel-europe.europa.eu/etias_en" target="_blank" rel="noopener">Verificar ETIAS \u2192</a>`;
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
      window.open(`https://wa.me/?text=${encodeURIComponent("Roteiro Roma + Paris \u2014 dados sincronizados:\n" + url)}`, "_blank");
    });
  }

  /* ── Share & PDF ── */
  function shareAppWhatsApp() {
    const url = buildShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(`🇮🇹🇫🇷 Roteiro Roma + Paris — 10 a 17/out/2026\nFotos, mapas, preços e reservas:\n${url}`)}`, "_blank");
  }

  function shareDayWhatsApp(dayId) {
    const day = dayOf(dayId);
    if (!day) return;
    const dates = loadDates();
    const flag = day.city === "roma" ? "🇮🇹" : day.city === "paris" ? "🇫🇷" : "✈️";
    let text = `${flag} *${labelDay(day)} — ${day.title}*\n`;
    if (dates[dayId]) text += `📅 ${formatDateBR(dates[dayId])}\n`;
    text += `\n`;
    day.activities.forEach((a) => {
      text += `⏰ ${activityWhen(day, a)} — ${a.title}\n`;
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
      if (moreSubView === "budget") renderBudget();
    } else {
      showToast("Sem conex\u00e3o \u2014 usando R$ " + TRIP.cambio.toFixed(2));
    }
  }

  function exportPDF() {
    const dates = loadDates();
    const reservations = loadReservations();
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Roteiro Roma + Paris</title>
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
      <div class="cover"><div style="font-size:4em">\uD83C\uDDEE\uD83C\uDDF9 \uD83C\uDDEB\uD83C\uDDF7</div><h1>${TRIP.title}</h1><p>${TRIP.subtitle}</p>
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
    const budgetTot = tripBudgetRange();
    const people = TRIP.travelers || 1;
    html += `<h2>Custo aproximado (sem passagens)</h2><p>${BUDGET.note}</p>`;
    html += `<p><strong>Por pessoa:</strong> ${formatRangeEur(budgetTot.min, budgetTot.max)} ${formatRangeBrl(budgetTot.min, budgetTot.max)}<br>`;
    html += `<strong>Grupo (${people}):</strong> ${formatRangeEur(budgetTot.min * people, budgetTot.max * people)}</p>`;
    BUDGET.categories.forEach((cat) => {
      const r = budgetCategoryRange(cat);
      html += `<h3>${cat.icon} ${cat.name} \u2014 ${formatRangeEur(r.min, r.max)}</h3><ul>`;
      cat.items.forEach((item) => {
        html += `<li>${item.name}: ${formatRangeEur(item.min, item.max ?? item.min)}</li>`;
      });
      html += `</ul>`;
    });
    const notes = loadNotes();
    const { byDay, log } = expenseSummary();
    allDays().forEach((d) => {
      html += `<h2>${labelDay(d)} \u2014 ${d.title}${dates[d.id] ? " (" + formatDateBR(dates[d.id]) + ")" : ""} \u00b7 ${cityOf(d.city)}</h2>`;
      if (byDay[d.id]) html += `<p><strong>Gastos registrados:</strong> ${formatEur(byDay[d.id])}</p>`;
      d.activities.forEach((a) => {
        html += `<div class="act"><span class="time">${activityWhen(d, a)}</span> \u2014 <strong>${a.title}</strong><br>`;
        if (a.place) html += `\uD83D\uDCCD ${a.place}<br>`;
        if (a.desc) html += `${a.desc}<br>`;
        if (notes[a.key]) html += `<em>Nota: ${notes[a.key]}</em><br>`;
        html += `<span class="price">\uD83D\uDCB0 ${a.priceEur}</span></div>`;
      });
    });
    if (log.length) {
      html += `<h2>Gastos detalhados</h2><ul>`;
      log.forEach((e) => {
        html += `<li>${labelDay(dayOf(e.dayId)) || "Dia " + e.dayId}: ${formatEur(e.amount)} \u2014 ${e.note}</li>`;
      });
      html += `</ul>`;
    }
    const e = loadEmergency();
    html += `<h2>Emerg\u00eancia</h2><p><strong>Hotel Roma:</strong> ${e.hotelRoma}<br>${e.hotelRomaStay || ""}<br>${e.hotelRomaAddress}<br>${e.hotelRomaPhone}<br>${e.hotelRomaBooking || ""}</p>`;
    html += `<p><strong>Hotel Paris:</strong> ${e.hotelParis}<br>${e.hotelParisStay || ""}<br>${e.hotelParisAddress}<br>${e.hotelParisPhone}<br>${e.hotelParisBooking || ""}<br>${e.hotelParisCheckin || ""}</p>`;
    html += `<footer>Roma + Paris \u00b7 ${TRIP.appUrl}</footer></body></html>`;
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

  function showView(view) {
    currentView = view;
    selectedDay = null;
    moreSubView = null;
    setActiveNav(view);
    btnBack?.classList.add("hidden");
    switch (view) {
      case "home": renderHome(); break;
      case "today": renderToday(); break;
      case "days": renderDayPicker(); break;
      case "links": renderLinks(); break;
      case "more": renderMore(); break;
    }
    if (!main) return;
    main.classList.remove("view-exit");
    main.classList.add("view-enter");
    requestAnimationFrame(() => main.classList.remove("view-enter"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(view) {
    if (!main) {
      showView(view);
      return;
    }
    main.classList.add("view-exit");
    setTimeout(() => {
      try { showView(view); } catch (err) { console.error(err); }
    }, 80);
  }

  btnBack?.addEventListener("click", () => {
    if (currentView === "day-detail") navigate("days");
    else if (currentView === "today-detail") navigate("today");
    else if (moreSubView) { moreSubView = null; btnBack.classList.add("hidden"); renderMore(); }
    else navigate("home");
  });

  btnFont?.addEventListener("click", () => {
    const s = loadSettings();
    s.largeFont = !s.largeFont;
    saveSettings(s);
  });

  btnTheme?.addEventListener("click", () => {
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
  document.querySelector(".search-panel")?.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay && !searchOverlay.classList.contains("hidden")) closeSearch();
  });

  navBtns.forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.view)));

  /* ── Init ── */
  function registerSW() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  function bootErrorHtml() {
    return `<div class="empty-state"><h2>N\u00e3o foi poss\u00edvel abrir</h2><p>Recarregue a p\u00e1gina. Se o app ficou preso no carregamento, limpe os dados do site e abra de novo.</p><button class="btn-primary" type="button" id="btn-reload-app">Recarregar</button></div>`;
  }

  function boot() {
    try {
      if (typeof TRIP === "undefined") throw new Error("data");
      parseDatesFromUrl();
      const exMeta = loadExchangeMeta();
      if (exMeta && exMeta.rate) TRIP.cambio = exMeta.rate;
      applySettings(loadSettings());
      saveJSON(KEYS.visitCount, loadJSON(KEYS.visitCount, 0) + 1);
      updateParisClock();
      setInterval(updateParisClock, 30000);
      hideSplash();
      showOnboardingIfNeeded();
      if (loadJSON(KEYS.onboarding, false)) maybeShowInstallBanner();
      showView("home");
      setTimeout(checkTomorrowReminder, 1500);
      setTimeout(registerSW, 200);
    } catch (err) {
      console.error(err);
      hideSplash();
      registerSW().finally(() => {
        try {
          if (!sessionStorage.getItem("rp-boot-retry")) {
            sessionStorage.setItem("rp-boot-retry", "1");
            location.reload();
            return;
          }
        } catch { /* sessionStorage blocked */ }
        if (main) {
          main.innerHTML = bootErrorHtml();
          document.getElementById("btn-reload-app")?.addEventListener("click", () => {
            try { sessionStorage.removeItem("rp-boot-retry"); } catch { /* noop */ }
            location.reload();
          });
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
