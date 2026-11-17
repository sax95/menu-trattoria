/* ================================================================
   Menu digitale — logica della pagina.
   I dati (piatti, prezzi, traduzioni) sono in js/menu.js.
   ================================================================ */
(() => {
  "use strict";

  /* ---------- Utilità ---------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage non disponibile */ } },
  };

  const FILTER_TAGS = ["veg", "vegan", "gf", "hot"];
  const DESKTOP = 720; // px: sopra questa larghezza la scheda è un modale centrato

  /* ---------- Elementi ---------- */
  const el = {
    lang: $("#lang"),
    eyebrow: $("#tEyebrow"),
    meta: $("#tMeta"),
    bar: $(".bar"),
    tabsScroll: $("#tabsScroll"),
    tabs: $("#tabs"),
    tabsActive: $("#tabsActive"),
    filters: $("#filters"),
    menu: $("#menu"),
    footer: $("#tFooter"),
    dialog: $("#dlg"),
    sheet: $("#sheet"),
    dImg: $("#dImg"),
    dCat: $("#dCat"),
    dName: $("#dName"),
    dOrig: $("#dOrig"),
    dPrice: $("#dPrice"),
    dDesc: $("#dDesc"),
    dInfo: $("#dInfo"),
    dClose: $("#dClose"),
  };

  /* ---------- Stato ---------- */
  const state = {
    lang: initialLang(),
    activeTags: new Set(),
    activeId: null,  // categoria evidenziata nella barra
    lockSpy: false,  // true mentre la pagina scorre dopo un clic su una categoria
  };
  let tabs = [], sections = [];

  /* ---------- Lingua ---------- */
  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "it" || q === "en") return q;
    const saved = store.get("menu-lang");
    if (saved === "it" || saved === "en") return saved;
    return (navigator.language || "it").toLowerCase().startsWith("it") ? "it" : "en";
  }
  const ui = () => T[state.lang];
  // Testo tradotto di un piatto o categoria, con ripiego sull'italiano
  const tr = (obj, key) => (state.lang === "en" && obj.en?.[key]) || obj[key];
  const price = n => {
    const s = n.toFixed(n % 1 ? 2 : 0);
    return state.lang === "en" ? "€" + s : "€ " + s.replace(".", ",");
  };
  // "veg" è sottinteso quando c'è già "vegan"
  const visibleTags = (tags = []) => tags.filter(x => !(x === "veg" && tags.includes("vegan")));

  /* ---------- Foto ---------- */
  const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const photo = d => d.img === false ? null : (d.img || `foto/${slug(d.name)}.jpg`);
  const photoMini = d => d.img || `foto/mini/${slug(d.name)}.jpg`;
  const missingPhotos = new Set(); // foto non trovate: non riprovare a ogni ridisegno
  const hasPhoto = d => photo(d) && !missingPhotos.has(photo(d));

  // load/error non risalgono il DOM: li intercetto in fase di cattura
  el.menu.addEventListener("load", e => {
    if (e.target.matches?.(".thumb img")) e.target.classList.add("loaded");
  }, true);
  el.menu.addEventListener("error", e => {
    const img = e.target;
    if (!img.matches?.(".thumb img")) return;
    const full = img.dataset.full;
    if (img.getAttribute("src") !== full) { img.src = full; return; } // manca la mini → provo la grande
    missingPhotos.add(full);
    img.closest(".dish").classList.remove("has-img");
    img.parentElement.remove();
  }, true);

  /* ---------- Disegno della pagina ---------- */
  const CHECK_ICON = `<svg class="ck" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.3 2.3 4.7-5"/></svg>`;

  function badgesHTML(tags) {
    const shown = visibleTags(tags);
    if (!shown.length) return "";
    return `<span class="badges">${shown.map(x =>
      `<span class="badge${x === "hot" ? " hot" : ""}">${ui().badge[x]}</span>`).join("")}</span>`;
  }

  function dishHTML(d, ci, di) {
    const L = ui();
    const img = hasPhoto(d)
      ? `<span class="thumb"><img src="${esc(photoMini(d))}" data-full="${esc(photo(d))}" alt="" loading="lazy" decoding="async" width="96" height="96"></span>`
      : "";
    return `
      <button class="dish${img ? " has-img" : ""}" data-c="${ci}" data-d="${di}" data-tags="${(d.tags || []).join(" ")}">
        ${img}
        ${d.chef ? `<span class="pick">${L.chef}</span>` : ""}
        <span class="dish-name">${esc(tr(d, "name"))}${badgesHTML(d.tags)}</span>
        <span class="dish-price">${price(d.price)}</span>
        <span class="dish-desc">${esc(tr(d, "desc"))}</span>
      </button>`;
  }

  function sectionHTML(c, ci, first) {
    const L = ui();
    const reveal = first ? ` class="reveal" style="animation-delay:${180 + ci * 50}ms"` : "";
    const note = tr(c, "note");
    return `
      <section id="${c.id}"${reveal}>
        <div class="sec-head"><h2>${esc(tr(c, "name"))}</h2></div>
        ${note ? `<p class="sec-note">${esc(note)}</p>` : ""}
        ${c.dishes.map((d, di) => dishHTML(d, ci, di)).join("")}
        <p class="empty" hidden>${L.empty}<button data-reset>${L.reset}</button></p>
      </section>`;
  }

  function render({ first = false } = {}) {
    const L = ui();
    document.documentElement.lang = state.lang;
    document.title = L.title;

    el.eyebrow.textContent = L.eyebrow;
    el.meta.innerHTML = L.meta;
    el.footer.innerHTML = L.footer.map(p => `<p>${esc(p)}</p>`).join("")
      + `<p><a href="crediti.html">${L.credits}</a></p>`;
    el.tabs.setAttribute("aria-label", L.categories);
    el.filters.setAttribute("aria-label", L.filters);
    el.dClose.setAttribute("aria-label", L.close);

    el.lang.dataset.lang = state.lang;
    $$("button", el.lang).forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === state.lang));

    // Due copie identiche delle categorie: quella sopra è "attiva" e viene ritagliata sulla scheda corrente
    const tabsHTML = MENU.map(c => `<button class="tab" data-target="${c.id}">${esc(tr(c, "name"))}</button>`).join("");
    el.tabs.innerHTML = tabsHTML;
    el.tabsActive.innerHTML = tabsHTML.replaceAll("<button", '<button tabindex="-1"');
    tabs = $$(".tab", el.tabs);

    el.filters.innerHTML = FILTER_TAGS.map(tag =>
      `<button class="chip" aria-pressed="${state.activeTags.has(tag)}" data-tag="${tag}">` +
      `<span class="ico" aria-hidden="true"><span class="dot"></span>${CHECK_ICON}</span>${L.filter[tag]}</button>`).join("");

    el.menu.innerHTML = MENU.map((c, ci) => sectionHTML(c, ci, first)).join("");
    sections = MENU.map(c => document.getElementById(c.id));
    applyFilters();
  }

  function syncBarHeight() {
    document.documentElement.style.setProperty("--bar-h", el.bar.offsetHeight + "px");
  }

  /* ---------- Barra delle categorie ---------- */
  function setActive(id, { instant = false } = {}) {
    if (id === state.activeId) return;
    state.activeId = id;
    const tab = tabs.find(x => x.dataset.target === id);
    if (!tab) return;
    tabs.forEach(x => x.toggleAttribute("aria-current", x === tab));

    const left = tab.offsetLeft;
    const right = tab.parentElement.offsetWidth - left - tab.offsetWidth;
    if (instant) el.tabsActive.style.transition = "none";
    el.tabsActive.style.clipPath = `inset(0 ${right}px 0 ${left}px round 999px)`;
    if (instant) { el.tabsActive.offsetWidth; el.tabsActive.style.transition = ""; }

    // tiene la categoria attiva visibile nella barra che scorre di lato
    const sc = el.tabsScroll, pad = 20;
    if (left < sc.scrollLeft + pad || left + tab.offsetWidth > sc.scrollLeft + sc.clientWidth - pad) {
      sc.scrollTo({ left: left - sc.clientWidth / 2 + tab.offsetWidth / 2, behavior: instant ? "auto" : "smooth" });
    }
  }

  function refreshActive() {
    const id = state.activeId;
    state.activeId = null;
    setActive(id, { instant: true });
  }

  el.tabs.addEventListener("click", e => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    const id = tab.dataset.target;
    setActive(id);

    // durante lo scorrimento automatico non aggiorno la categoria a ogni sezione attraversata
    state.lockSpy = true;
    const release = () => { state.lockSpy = false; window.removeEventListener("scrollend", release); };
    window.addEventListener("scrollend", release);
    setTimeout(release, 1200); // ripiego per i browser senza "scrollend"

    document.getElementById(id).scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  });

  // La sezione che supera una linea appena sotto la barra è quella attiva
  function spy() {
    if (state.lockSpy) return;
    const line = el.bar.getBoundingClientRect().bottom + 72;
    const visible = sections.filter(s => !s.hidden);
    let current = sections[0];
    for (const s of visible) if (s.getBoundingClientRect().top <= line) current = s;
    const atBottom = innerHeight + scrollY >= document.body.scrollHeight - 2;
    if (atBottom) current = visible.at(-1) || current;
    setActive(current.id);
  }

  /* ---------- Filtri ---------- */
  function applyFilters() {
    const wanted = [...state.activeTags];
    for (const sec of sections) {
      let shown = 0;
      for (const d of $$(".dish", sec)) {
        const tags = d.dataset.tags.split(" ");
        d.hidden = !wanted.every(x => tags.includes(x));
        if (!d.hidden) shown++;
      }
      $(".empty", sec).hidden = shown > 0;
    }
  }

  el.filters.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const tag = chip.dataset.tag;
    state.activeTags.has(tag) ? state.activeTags.delete(tag) : state.activeTags.add(tag);
    chip.setAttribute("aria-pressed", state.activeTags.has(tag));
    applyFilters();
  });

  /* ---------- Cambio lingua ---------- */
  function setLang(next) {
    if (next === state.lang) return;
    store.set("menu-lang", next);

    const swap = () => {
      // resto sulla stessa sezione anche se i testi cambiano lunghezza
      const before = document.getElementById(state.activeId)?.getBoundingClientRect().top;
      state.lang = next;
      render();
      syncBarHeight();
      const after = document.getElementById(state.activeId)?.getBoundingClientRect().top;
      if (before != null && after != null && scrollY > 0) scrollBy(0, after - before);
      refreshActive();
      document.body.classList.remove("swapping");
    };

    if (reduceMotion()) return swap();
    document.body.classList.add("swapping"); // breve dissolvenza sfocata (vedi CSS)
    setTimeout(swap, 110);
  }

  el.lang.addEventListener("click", e => {
    const b = e.target.closest("button[data-lang]");
    if (b) setLang(b.dataset.lang);
  });

  /* ---------- Scheda del piatto ---------- */
  function fillSheet(cat, d) {
    const L = ui();
    el.dCat.textContent = tr(cat, "name");
    el.dName.textContent = tr(d, "name");
    // In inglese mostro anche il nome italiano: è quello che conosce il cameriere
    el.dOrig.hidden = tr(d, "name") === d.name;
    el.dOrig.textContent = d.name;
    el.dPrice.textContent = price(d.price);
    el.dDesc.textContent = tr(d, "desc");

    const img = el.dImg, src = photo(d);
    img.classList.remove("loaded");
    img.alt = tr(d, "name");
    if (hasPhoto(d)) {
      el.sheet.classList.add("has-img");
      img.onload = () => img.classList.add("loaded");
      img.onerror = () => { missingPhotos.add(src); el.sheet.classList.remove("has-img"); };
      img.src = src;
      if (img.complete && img.naturalWidth) img.classList.add("loaded"); // già in cache
    } else {
      el.sheet.classList.remove("has-img");
      img.removeAttribute("src");
    }

    const rows = [];
    if (d.tags?.length) rows.push([L.features, visibleTags(d.tags).map(x => L.filter[x]).join(" · ")]);
    rows.push([L.allergens, tr(d, "allergens") || L.askStaff]);
    if (d.pair) rows.push([L.pair, tr(d, "pair")]);
    el.dInfo.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
  }

  function openSheet() {
    el.sheet.style.transform = "";
    el.dialog.dataset.state = "closed";
    el.dialog.showModal();
    el.sheet.scrollTop = 0;
    // due frame: il browser deve prima disegnare lo stato "closed", poi parte la transizione
    requestAnimationFrame(() => requestAnimationFrame(() => { el.dialog.dataset.state = "open"; }));
  }

  function closeSheet() {
    const { dialog, sheet } = el;
    if (dialog.dataset.state !== "open") return;
    dialog.dataset.state = "closing";
    let done = false;
    const finish = e => {
      if (done || (e && e.target !== sheet)) return;
      done = true;
      sheet.removeEventListener("transitionend", finish);
      dialog.close();
      dialog.dataset.state = "closed";
      sheet.style.transform = "";
    };
    sheet.addEventListener("transitionend", finish);
    setTimeout(finish, reduceMotion() ? 200 : 320); // ripiego se transitionend non arriva
  }

  // Un solo gestore per i clic nel menu: "Rimuovi filtri" oppure apertura di un piatto
  el.menu.addEventListener("click", e => {
    if (e.target.closest("[data-reset]")) {
      state.activeTags.clear();
      $$(".chip", el.filters).forEach(c => c.setAttribute("aria-pressed", "false"));
      applyFilters();
      return;
    }
    const btn = e.target.closest(".dish");
    if (!btn) return;
    const cat = MENU[btn.dataset.c];
    fillSheet(cat, cat.dishes[btn.dataset.d]);
    openSheet();
  });

  el.dialog.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeSheet(); });
  el.dialog.addEventListener("cancel", e => { e.preventDefault(); closeSheet(); }); // tasto Esc

  /* ---------- Trascina giù per chiudere (solo telefono) ----------
     Basta un gesto rapido anche se corto; trascinando verso l'alto c'è attrito invece di un blocco netto. */
  let drag = null;

  el.sheet.addEventListener("pointerdown", e => {
    if (innerWidth >= DESKTOP || drag || e.button !== 0) return;
    if (e.target.closest("button")) return;
    if (el.sheet.scrollTop > 0 && !e.target.closest(".handle")) return; // sta scorrendo il contenuto
    drag = { id: e.pointerId, y0: e.clientY, t0: performance.now(), dy: 0, started: false };
  });

  el.sheet.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.id) return;
    let dy = e.clientY - drag.y0;
    if (!drag.started) {
      if (Math.abs(dy) < 6) return;
      drag.started = true;
      el.sheet.setPointerCapture(e.pointerId);
      el.sheet.classList.add("dragging");
    }
    if (dy < 0) dy = -Math.sqrt(-dy) * 2;
    drag.dy = dy;
    el.sheet.style.transform = `translateY(${dy}px)`;
  });

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { dy, t0, started } = drag;
    drag = null;
    if (!started) return;
    el.sheet.classList.remove("dragging");
    const velocity = Math.abs(dy) / (performance.now() - t0);
    const dismiss = dy > 0 && (dy > el.sheet.offsetHeight * 0.3 || velocity > 0.11);
    if (dismiss) closeSheet(); // parte dalla posizione attuale e scende fuori schermo
    el.sheet.style.transform = "";
  }
  el.sheet.addEventListener("pointerup", endDrag);
  el.sheet.addEventListener("pointercancel", endDrag);

  /* ---------- Avvio ---------- */
  render({ first: true });
  syncBarHeight();
  setActive(MENU[0].id, { instant: true });

  let raf;
  addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(spy); }, { passive: true });
  addEventListener("resize", () => { syncBarHeight(); refreshActive(); });
  document.fonts.ready.then(() => { state.activeId = null; spy(); }); // misure corrette dopo il caricamento dei font
})();
