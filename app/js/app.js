/** App principal — Paris Trip */
(function () {
  "use strict";

  const STORAGE_KEY = "paris-trip-dates";

  const main = document.getElementById("app-main");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const btnBack = document.getElementById("btn-back");
  const navBtns = document.querySelectorAll(".nav-btn");

  let currentView = "home";
  let selectedDay = null;

  function loadDates() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveDate(dayId, value) {
    const dates = loadDates();
    dates[dayId] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
  }

  function parsePriceRange(str) {
    if (!str || str === "0" || str === "incl." || str.startsWith("0")) return { min: 0, max: 0 };
    const nums = str.match(/[\d]+/g);
    if (!nums) return { min: 0, max: 0 };
    const values = nums.map(Number);
    return { min: Math.min(...values), max: Math.max(...values) };
  }

  function formatEur(val) {
    if (val === 0) return "Grátis";
    return `€ ${val.toFixed(0)}`;
  }

  function formatBrl(eur) {
    if (eur === 0) return "";
    const brl = eur * TRIP.cambio;
    return `(~ R$ ${brl.toFixed(0)})`;
  }

  function dayCostRange(day) {
    let min = 0;
    let max = 0;
    day.activities.forEach((a) => {
      const p = parsePriceRange(a.priceEur);
      min += p.min;
      max += p.max;
    });
    return { min, max };
  }

  function renderHome() {
    pageTitle.textContent = "Paris";
    pageSubtitle.textContent = TRIP.subtitle;
    btnBack.classList.add("hidden");

    main.innerHTML = `
      <section class="hero">
        <div class="hero-flag">🇫🇷</div>
        <h2>${TRIP.title}</h2>
        <p>Toque em um dia para ver o roteiro completo com fotos e preços.</p>
      </section>
      <div class="stats-grid">
        <div class="stat-card"><span class="num">5</span><span class="lbl">Dias</span></div>
        <div class="stat-card"><span class="num">7</span><span class="lbl">Lugares</span></div>
        <div class="stat-card"><span class="num">🏰</span><span class="lbl">Disney</span></div>
      </div>
      <h2 class="section-title">Escolha o dia</h2>
      <div class="day-grid">
        ${DAYS.map((d) => {
          const cost = dayCostRange(d);
          const costLabel =
            cost.max === 0
              ? "Grátis / transporte"
              : cost.min === cost.max
                ? `~ €${cost.max}/dia`
                : `€${cost.min}–${cost.max}`;
          return `
            <button class="day-card" data-day="${d.id}" style="--day-color:${d.color}">
              <span class="emoji">${d.emoji}</span>
              <div class="info">
                <h3>Dia ${d.id} — ${d.title}</h3>
                <p>${d.weekday} · ${costLabel}</p>
              </div>
              <span class="arrow">›</span>
            </button>`;
        }).join("")}
      </div>
    `;

    main.querySelectorAll(".day-card").forEach((btn) => {
      btn.addEventListener("click", () => showDay(Number(btn.dataset.day)));
    });
  }

  function renderDayPicker() {
    pageTitle.textContent = "Roteiro";
    pageSubtitle.textContent = "5 dias em Paris";
    btnBack.classList.add("hidden");

    main.innerHTML = `
      <p style="font-size:1.05rem;color:var(--text-soft);margin-bottom:1rem;">
        Toque no dia para ver horários, fotos e preços de cada passeio.
      </p>
      <div class="day-grid">
        ${DAYS.map(
          (d) => `
          <button class="day-card" data-day="${d.id}" style="--day-color:${d.color}">
            <span class="emoji">${d.emoji}</span>
            <div class="info">
              <h3>Dia ${d.id}</h3>
              <p>${d.title}</p>
            </div>
            <span class="arrow">›</span>
          </button>`
        ).join("")}
      </div>
    `;

    main.querySelectorAll(".day-card").forEach((btn) => {
      btn.addEventListener("click", () => showDay(Number(btn.dataset.day)));
    });
  }

  function showDay(dayId) {
    selectedDay = DAYS.find((d) => d.id === dayId);
    if (!selectedDay) return;

    currentView = "day-detail";
    setActiveNav(null);
    pageTitle.textContent = `Dia ${dayId}`;
    pageSubtitle.textContent = selectedDay.weekday;
    btnBack.classList.remove("hidden");

    const dates = loadDates();
    const savedDate = dates[dayId] || "";
    const cost = dayCostRange(selectedDay);
    const costText =
      cost.max === 0
        ? "Grátis (exc. refeições)"
        : cost.min === cost.max
          ? `${formatEur(cost.max)} ${formatBrl(cost.max)}`
          : `${formatEur(cost.min)} – ${formatEur(cost.max)}`;

    main.innerHTML = `
      <div class="day-header" style="--day-color:${selectedDay.color};--day-accent:${selectedDay.accent}">
        <span class="badge">${selectedDay.emoji} Dia ${dayId}</span>
        <h2>${selectedDay.title}</h2>
        <p>${selectedDay.summary}</p>
        <div class="date-input-wrap">
          <label for="trip-date">📅 Data deste dia (toque para preencher)</label>
          <input type="date" id="trip-date" value="${savedDate}" aria-label="Data do dia ${dayId}">
        </div>
      </div>
      <div class="day-total">
        <span>Custo estimado do dia</span>
        <span class="price">${costText}</span>
      </div>
      <div class="timeline">
        ${selectedDay.activities.map(renderActivity).join("")}
      </div>
    `;

    document.getElementById("trip-date").addEventListener("change", (e) => {
      saveDate(dayId, e.target.value);
    });
  }

  function renderActivity(a) {
    const p = parsePriceRange(a.priceEur);
    const priceMain =
      a.priceEur === "incl."
        ? "Incluso no ingresso"
        : p.max === 0
          ? "Grátis"
          : p.min === p.max
            ? formatEur(p.max)
            : `${formatEur(p.min)} – ${formatEur(p.max)}`;
    const brl =
      p.max > 0 && a.priceEur !== "incl."
        ? `<span class="price-brl">${p.min === p.max ? formatBrl(p.max) : `${formatBrl(p.min)} – ${formatBrl(p.max)}`}</span>`
        : "";

    return `
      <article class="activity-card${a.highlight ? " highlight" : ""}">
        <div class="activity-img-wrap">
          <img src="${a.image}" alt="${a.title}" loading="lazy"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%23D6E4F0%22 width=%22400%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%231F4E79%22 font-size=%2224%22>Paris</text></svg>'">
          <span class="time-badge">${a.time}</span>
        </div>
        <div class="activity-body">
          <h3>${a.title}</h3>
          ${a.place ? `<p class="place">📍 ${a.place}</p>` : ""}
          ${a.desc ? `<p class="desc">${a.desc}</p>` : ""}
          <div class="meta-row">
            ${a.transport ? `<span class="meta-tag">🚇 ${a.transport}</span>` : ""}
          </div>
          <div class="price-row">
            <span class="price-eur">${priceMain}</span>
            ${brl}
            ${a.priceNote ? `<span class="price-note">${a.priceNote}</span>` : ""}
          </div>
          ${a.link ? `<a class="btn-link" href="${a.link.url}" target="_blank" rel="noopener">${a.link.label} →</a>` : ""}
        </div>
      </article>`;
  }

  function renderLinks() {
    pageTitle.textContent = "Reservas";
    pageSubtitle.textContent = "Sites oficiais";
    btnBack.classList.add("hidden");

    main.innerHTML = `
      <p style="font-size:1.05rem;color:var(--text-soft);margin-bottom:1.25rem;">
        Toque para abrir o site e fazer a reserva. Use sempre os links oficiais.
      </p>
      <div class="link-list">
        ${BOOKING_LINKS.map(
          (l) => `
          <a class="link-item" href="${l.url}" target="_blank" rel="noopener">
            <span class="icon">${l.icon}</span>
            <div>
              <div class="name">${l.name}</div>
              <div class="cat">${l.cat}</div>
            </div>
            <span class="go">→</span>
          </a>`
        ).join("")}
      </div>
    `;
  }

  function renderTips() {
    pageTitle.textContent = "Dicas";
    pageSubtitle.textContent = "Informações úteis";
    btnBack.classList.add("hidden");

    main.innerHTML = `
      <div class="alert-box">
        <strong>Louvre grátis:</strong> 1ª sexta do mês, 18h–21h45 (exc. julho e agosto).
        Reserva online obrigatória!
      </div>
      <div class="tip-card">
        <h3>💡 Dicas gerais</h3>
        <ul>${TRIP.dicasGerais.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="tip-card">
        <h3>🎨 Louvre — dias gratuitos 2026</h3>
        <table class="louvre-table">
          <thead><tr><th>Data</th><th>Dia</th><th>Horário</th></tr></thead>
          <tbody>
            ${LOUVRE_FREE.map((r) => `<tr><td>${r.date}</td><td>${r.day}</td><td>${r.time}</td></tr>`).join("")}
          </tbody>
        </table>
        <a class="btn-link" href="https://ticket.louvre.fr/en" target="_blank" rel="noopener" style="margin-top:1rem">
          Reservar Louvre →
        </a>
      </div>
      <div class="tip-card">
        <h3>💰 Câmbio de referência</h3>
        <ul>
          <li>1 € = R$ ${TRIP.cambio.toFixed(2)} (ajuste conforme cotação)</li>
          <li>Navigo semanal: € ${TRIP.navigoSemanal.toFixed(2)} (~ R$ ${(TRIP.navigoSemanal * TRIP.cambio).toFixed(0)})</li>
        </ul>
      </div>
    `;
  }

  function setActiveNav(view) {
    navBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
  }

  function navigate(view) {
    currentView = view;
    selectedDay = null;
    setActiveNav(view);

    switch (view) {
      case "home":
        renderHome();
        break;
      case "days":
        renderDayPicker();
        break;
      case "links":
        renderLinks();
        break;
      case "tips":
        renderTips();
        break;
    }
  }

  btnBack.addEventListener("click", () => navigate("days"));

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.view));
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  navigate("home");
})();
