/** App Paris — todas as funcionalidades */
(function () {
  "use strict";

  const KEYS = {
    dates: "paris-trip-dates",
    checklist: "paris-trip-checklist",
    settings: "paris-trip-settings",
  };

  const main = document.getElementById("app-main");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const btnBack = document.getElementById("btn-back");
  const btnFont = document.getElementById("btn-font");
  const btnTheme = document.getElementById("btn-theme");
  const toast = document.getElementById("toast");
  const navBtns = document.querySelectorAll(".nav-btn");

  let currentView = "home";
  let selectedDay = null;
  let moreSubView = null;

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
    return loadJSON(KEYS.settings, { largeFont: false, dark: false });
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

  function applySettings(s) {
    document.documentElement.classList.toggle("large-font", s.largeFont);
    document.documentElement.classList.toggle("dark-mode", s.dark);
    btnFont.classList.toggle("active", s.largeFont);
    btnTheme.textContent = s.dark ? "☀️" : "🌙";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = s.dark ? "#0d1b2a" : "#1F4E79";
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2500);
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
  }

  function buildShareUrl() {
    const dates = loadDates();
    const pairs = Object.entries(dates)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    const base = TRIP.appUrl.replace(/\/$/, "");
    return pairs ? `${base}/?datas=${pairs}` : base + "/";
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
    DAYS.forEach((d) => {
      const c = dayCostRange(d);
      min += c.min;
      max += c.max;
    });
    min += TRIP.navigoSemanal;
    max += TRIP.navigoSemanal;
    return { min, max };
  }

  function getTodayDayId() {
    const today = new Date().toISOString().slice(0, 10);
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

  function checklistProgress() {
    const done = CHECKLIST.filter((c) => loadChecklist()[c.id]).length;
    return { done, total: CHECKLIST.length };
  }

  /* ── Weather ── */
  async function fetchWeather() {
    const { lat, lon } = TRIP.weather;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=7`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.daily;
    } catch {
      return null;
    }
  }

  function weatherCardHtml(daily) {
    if (!daily) return `<div class="weather-card loading">Previsão indisponível offline</div>`;
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
  function renderActivity(a, compact) {
    const p = parsePriceRange(a.priceEur);
    const priceMain =
      a.priceEur === "incl." ? "Incluso" : p.max === 0 ? "Grátis"
        : p.min === p.max ? formatEur(p.max) : `${formatEur(p.min)} – ${formatEur(p.max)}`;
    const brl = p.max > 0 && a.priceEur !== "incl."
      ? `<span class="price-brl">${p.min === p.max ? formatBrl(p.max) : `${formatBrl(p.min)} – ${formatBrl(p.max)}`}</span>` : "";

    const reserveBadge = a.needsReservation
      ? `<span class="badge-reserve">⚠️ Reservar antes</span>` : "";

    const btns = [];
    if (a.maps) btns.push(`<a class="btn-secondary" href="${a.maps}" target="_blank" rel="noopener">🗺️ Maps</a>`);
    if (a.link) btns.push(`<a class="btn-link" href="${a.link.url}" target="_blank" rel="noopener">${a.link.label} →</a>`);

    if (compact) {
      return `
        <article class="activity-compact${a.highlight ? " highlight" : ""}">
          <div class="ac-time">${a.time}</div>
          <div class="ac-body">
            <h3>${a.title} ${reserveBadge}</h3>
            ${a.place ? `<p class="place">📍 ${a.place}</p>` : ""}
            <div class="price-row"><span class="price-eur">${priceMain}</span>${brl}</div>
            <div class="btn-row">${btns.join("")}</div>
          </div>
        </article>`;
    }

    return `
      <article class="activity-card${a.highlight ? " highlight" : ""}">
        <div class="activity-img-wrap">
          <img src="${a.image}" alt="${a.title}" loading="lazy"
            onerror="this.style.display='none'">
          <span class="time-badge">${a.time}</span>
          ${reserveBadge ? `<span class="reserve-badge-img">Reservar</span>` : ""}
        </div>
        <div class="activity-body">
          <h3>${a.title}</h3>
          ${a.place ? `<p class="place">📍 ${a.place}</p>` : ""}
          ${a.desc ? `<p class="desc">${a.desc}</p>` : ""}
          <div class="meta-row">${a.transport ? `<span class="meta-tag">🚇 ${a.transport}</span>` : ""}</div>
          <div class="price-row"><span class="price-eur">${priceMain}</span>${brl}
            ${a.priceNote ? `<span class="price-note">${a.priceNote}</span>` : ""}</div>
          <div class="btn-row">${btns.join("")}</div>
        </div>
      </article>`;
  }

  function renderDayContent(day, compact) {
    const dates = loadDates();
    const cost = dayCostRange(day);
    const costText = cost.max === 0 ? "Grátis (exc. refeições)"
      : cost.min === cost.max ? `${formatEur(cost.max)} ${formatBrl(cost.max)}`
        : `${formatEur(cost.min)} – ${formatEur(cost.max)}`;

    return `
      <div class="day-header" style="--day-color:${day.color};--day-accent:${day.accent}">
        <span class="badge">${day.emoji} Dia ${day.id}</span>
        <h2>${day.title}</h2>
        <p>${day.summary}</p>
        <div class="date-input-wrap">
          <label for="trip-date-${day.id}">📅 Data deste dia</label>
          <input type="date" id="trip-date-${day.id}" value="${dates[day.id] || ""}" data-day="${day.id}">
        </div>
      </div>
      <div class="day-total"><span>Custo estimado do dia</span><span class="price">${costText}</span></div>
      <div class="timeline">${day.activities.map((a) => renderActivity(a, compact)).join("")}</div>
      <button class="btn-secondary btn-block" data-share-day="${day.id}">📲 Compartilhar dia no WhatsApp</button>`;
  }

  function bindDayDateInputs() {
    main.querySelectorAll("input[type=date][data-day]").forEach((inp) => {
      inp.addEventListener("change", (e) => saveDate(Number(e.target.dataset.day), e.target.value));
    });
    main.querySelectorAll("[data-share-day]").forEach((btn) => {
      btn.addEventListener("click", () => shareDayWhatsApp(Number(btn.dataset.shareDay)));
    });
  }

  /* ── Views ── */
  function renderHome() {
    pageTitle.textContent = "Paris";
    pageSubtitle.textContent = TRIP.subtitle;
    btnBack.classList.add("hidden");
    const prog = checklistProgress();
    const todayId = getTodayDayId();
    const e = TRIP.emergency;

    main.innerHTML = `
      <section class="hero">
        <div class="hero-flag">🇫🇷</div>
        <h2>${TRIP.title}</h2>
        <p>Roteiro completo com fotos, mapas e preços.</p>
      </section>
      ${todayId ? `<button class="today-banner" data-goto-today="1">📍 Hoje é o Dia ${todayId}! Toque para ver →</button>` : ""}
      <div id="weather-slot"><div class="weather-card loading">Carregando previsão…</div></div>
      <div class="stats-grid">
        <div class="stat-card"><span class="num">5</span><span class="lbl">Dias</span></div>
        <div class="stat-card"><span class="num">${prog.done}/${prog.total}</span><span class="lbl">Checklist</span></div>
        <div class="stat-card"><span class="num">🏰</span><span class="lbl">Disney</span></div>
      </div>
      <div class="emergency-card">
        <h3>🆘 Emergência</h3>
        <div class="emergency-grid">
          <div><strong>Hotel</strong><br>${e.hotel}<br><small>${e.hotelAddress}</small><br>📞 ${e.hotelPhone}</div>
          <div><strong>Contato</strong><br>${e.contactName}<br>📞 ${e.contactPhone}</div>
          <div><strong>Europa</strong><br>🚨 ${e.emergencyEU} (geral)<br>🏥 ${e.medicalFR}<br>👮 ${e.policeFR}</div>
          <div><strong>Embaixada BR</strong><br>${e.embassy}<br>📞 ${e.embassyPhone}</div>
          <div><strong>Seguro</strong><br>${e.insurance}</div>
          <div><strong>Passaporte</strong><br>${e.passportNote}</div>
        </div>
        ${e.hotelAddress.includes("preencher") ? `<p class="hint">Edite hotel/contatos em js/data.js</p>` : ""}
      </div>
      <h2 class="section-title">Escolha o dia</h2>
      <div class="day-grid">${DAYS.map((d) => {
        const dates = loadDates();
        const cost = dayCostRange(d);
        const costLabel = cost.max === 0 ? "Grátis" : cost.min === cost.max ? `~€${cost.max}` : `€${cost.min}–${cost.max}`;
        return `<button class="day-card" data-day="${d.id}" style="--day-color:${d.color}">
          <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id} — ${d.title}</h3>
          <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday} · ${costLabel}</p></div><span class="arrow">›</span></button>`;
      }).join("")}</div>`;

    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
    const tb = main.querySelector("[data-goto-today]");
    if (tb) tb.addEventListener("click", () => navigate("today"));

    fetchWeather().then((daily) => {
      const slot = document.getElementById("weather-slot");
      if (slot) slot.innerHTML = weatherCardHtml(daily);
    });
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
          <div class="day-grid">${DAYS.map((d) => `
            <button class="day-card" data-day="${d.id}" style="--day-color:${d.color}">
              <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id}</h3>
              <p>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday}</p></div></button>`).join("")}</div>
        </div>`;
      pageSubtitle.textContent = new Date().toLocaleDateString("pt-BR");
      main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day), true)));
      return;
    }

    const day = DAYS.find((d) => d.id === todayId);
    pageSubtitle.textContent = `${day.weekday} · ${formatDateBR(loadDates()[todayId])}`;
    main.innerHTML = renderDayContent(day, true);
    bindDayDateInputs();
  }

  function renderDayPicker() {
    pageTitle.textContent = "Roteiro";
    pageSubtitle.textContent = "5 dias em Paris";
    btnBack.classList.add("hidden");
    main.innerHTML = `<p class="intro-text">Toque no dia para ver horários, fotos, mapas e preços.</p>
      <div class="day-grid">${DAYS.map((d) => `<button class="day-card" data-day="${d.id}" style="--day-color:${d.color}">
        <span class="emoji">${d.emoji}</span><div class="info"><h3>Dia ${d.id}</h3><p>${d.title}</p></div><span class="arrow">›</span></button>`).join("")}</div>`;
    main.querySelectorAll(".day-card").forEach((b) => b.addEventListener("click", () => showDay(Number(b.dataset.day))));
  }

  function showDay(dayId, fromToday) {
    selectedDay = DAYS.find((d) => d.id === dayId);
    if (!selectedDay) return;
    currentView = fromToday ? "today-detail" : "day-detail";
    setActiveNav(fromToday ? "today" : "days");
    pageTitle.textContent = `Dia ${dayId}`;
    pageSubtitle.textContent = selectedDay.weekday;
    btnBack.classList.remove("hidden");
    main.innerHTML = renderDayContent(selectedDay, false);
    bindDayDateInputs();
  }

  function renderLinks() {
    pageTitle.textContent = "Reservas";
    pageSubtitle.textContent = "Sites oficiais";
    btnBack.classList.add("hidden");
    main.innerHTML = `<p class="intro-text">Toque para reservar. Itens com ⚠️ precisam de bilhete antecipado.</p>
      <div class="link-list">${BOOKING_LINKS.map((l) => `
        <a class="link-item" href="${l.url}" target="_blank" rel="noopener">
          <span class="icon">${l.icon}</span><div><div class="name">${l.name}</div><div class="cat">${l.cat}</div></div><span class="go">→</span></a>`).join("")}</div>`;
  }

  function renderMore() {
    pageTitle.textContent = "Mais";
    pageSubtitle.textContent = "Ferramentas";
    btnBack.classList.add("hidden");

    if (moreSubView === "expenses") return renderExpenses();
    if (moreSubView === "checklist") return renderChecklist();
    if (moreSubView === "phrases") return renderPhrases();
    if (moreSubView === "tips") return renderTips();

    main.innerHTML = `
      <div class="more-grid">
        <button class="more-card" data-sub="expenses">💰<span>Gastos</span></button>
        <button class="more-card" data-sub="checklist">✅<span>Checklist</span></button>
        <button class="more-card" data-sub="phrases">🇫🇷<span>Frases úteis</span></button>
        <button class="more-card" data-sub="tips">💡<span>Dicas</span></button>
        <button class="more-card" data-action="share">📲<span>WhatsApp</span></button>
        <button class="more-card" data-action="pdf">📄<span>Exportar PDF</span></button>
        <button class="more-card" data-action="sync">🔗<span>Sincronizar datas</span></button>
        <button class="more-card" data-action="rate">💱<span>Atualizar câmbio</span></button>
      </div>`;

    main.querySelectorAll("[data-sub]").forEach((b) => b.addEventListener("click", () => {
      moreSubView = b.dataset.sub;
      btnBack.classList.remove("hidden");
      renderMore();
    }));
    main.querySelector("[data-action=share]")?.addEventListener("click", shareAppWhatsApp);
    main.querySelector("[data-action=pdf]")?.addEventListener("click", exportPDF);
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
    main.innerHTML = `
      <div class="budget-hero">
        <span class="budget-label">Total estimado (5 dias + Navigo)</span>
        <span class="budget-value">${formatEur(total.min)} – ${formatEur(total.max)}</span>
        <span class="budget-brl">${formatBrl(total.min)} – ${formatBrl(total.max)}</span>
        <small>Câmbio: €1 = R$ ${TRIP.cambio.toFixed(2)}</small>
      </div>
      ${DAYS.map((d) => {
        const c = dayCostRange(d);
        const dates = loadDates();
        return `<div class="budget-row" style="border-left-color:${d.color}">
          <div><strong>Dia ${d.id}</strong> — ${d.title}<br><small>${dates[d.id] ? formatDateBR(dates[d.id]) : d.weekday}</small></div>
          <div class="budget-amt">${c.max === 0 ? "—" : c.min === c.max ? formatEur(c.max) : `${formatEur(c.min)}–${formatEur(c.max)}`}</div></div>`;
      }).join("")}
      <div class="budget-row navigo"><div><strong>Navigo semanal</strong></div><div class="budget-amt">${formatEur(TRIP.navigoSemanal)} ${formatBrl(TRIP.navigoSemanal)}</div></div>`;
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

  function renderPhrases() {
    pageTitle.textContent = "Francês";
    main.innerHTML = `<p class="intro-text">Toque para copiar a frase em francês.</p>
      <div class="phrase-list">${FRENCH_PHRASES.map((p, i) => `
        <button class="phrase-item" data-phrase="${i}">
          <div class="phrase-pt">${p.pt}</div>
          <div class="phrase-fr">${p.fr}</div>
          ${p.note ? `<div class="phrase-note">${p.note}</div>` : ""}
        </button>`).join("")}</div>`;
    main.querySelectorAll("[data-phrase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = FRENCH_PHRASES[Number(btn.dataset.phrase)];
        navigator.clipboard?.writeText(p.fr).then(() => showToast(`Copiado: ${p.fr}`));
      });
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

  function renderSync() {
    pageTitle.textContent = "Sincronizar";
    pageSubtitle.textContent = "Compartilhar datas";
    const url = buildShareUrl();
    main.innerHTML = `
      <div class="sync-card">
        <h3>🔗 Sincronizar datas</h3>
        <p>Envie este link para sincronizar as datas entre celulares. Quem abrir o link terá as mesmas datas salvas.</p>
        <div class="sync-url">${url}</div>
        <button class="btn-link btn-block" id="copy-sync">Copiar link</button>
        <button class="btn-secondary btn-block" id="share-sync">📲 Enviar no WhatsApp</button>
      </div>`;
    document.getElementById("copy-sync").addEventListener("click", () => {
      navigator.clipboard?.writeText(url).then(() => showToast("Link copiado!"));
    });
    document.getElementById("share-sync").addEventListener("click", () => {
      window.open(`https://wa.me/?text=${encodeURIComponent("Roteiro Paris — datas sincronizadas:\n" + url)}`, "_blank");
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
    showToast("Buscando câmbio…");
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=BRL");
      const data = await res.json();
      TRIP.cambio = data.rates.BRL;
      showToast(`Câmbio atualizado: €1 = R$ ${TRIP.cambio.toFixed(2)}`);
      if (moreSubView === "expenses") renderExpenses();
    } catch {
      showToast("Não foi possível atualizar. Usando R$ " + TRIP.cambio);
    }
  }

  function exportPDF() {
    let html = `<html><head><meta charset="utf-8"><title>Roteiro Paris</title>
      <style>body{font-family:sans-serif;padding:20px;max-width:800px;margin:auto}
      h1{color:#1F4E79}h2{color:#333;border-bottom:2px solid #1F4E79;padding-bottom:4px}
      .act{margin:12px 0;padding:10px;border-left:4px solid #C9A227;background:#f9f9f9}
      .time{font-weight:bold;color:#1F4E79}.price{color:#666;font-size:0.9em}</style></head><body>
      <h1>🇫🇷 ${TRIP.title}</h1><p>${TRIP.subtitle}</p>`;
    DAYS.forEach((d) => {
      const dates = loadDates();
      html += `<h2>Dia ${d.id} — ${d.title} ${dates[d.id] ? "(" + formatDateBR(dates[d.id]) + ")" : ""}</h2>`;
      d.activities.forEach((a) => {
        html += `<div class="act"><span class="time">${a.time}</span> — <strong>${a.title}</strong><br>`;
        if (a.place) html += `📍 ${a.place}<br>`;
        if (a.desc) html += `${a.desc}<br>`;
        html += `<span class="price">💰 ${a.priceEur}</span></div>`;
      });
    });
    html += `<p style="margin-top:30px;font-size:0.85em">Gerado por Paris Trip App · ${TRIP.appUrl}</p></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.onload = () => w.print();
  }

  /* ── Navigation ── */
  function setActiveNav(view) {
    navBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  }

  function navigate(view) {
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

  navBtns.forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.view)));

  /* ── Init ── */
  parseDatesFromUrl();
  applySettings(loadSettings());
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  navigate("home");
})();
