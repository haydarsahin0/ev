/* WG Kasası — ortak ev harcamaları */

const CONFIG = window.WG_CONFIG || {};

const PEOPLE = [
  // gen/dat/loc: Turkish case suffixes (Haydar'ın / Haydar'a / Haydar'da)
  { id: 'haydar', name: 'Haydar', gen: "Haydar'ın", dat: "Haydar'a", loc: "Haydar'da" },
  { id: 'sude', name: 'Sude', gen: "Sude'nin", dat: "Sude'ye", loc: "Sude'de" },
  { id: 'ezgi', name: 'Ezgi', gen: "Ezgi'nin", dat: "Ezgi'ye", loc: "Ezgi'de" },
];
const PIDS = PEOPLE.map((p) => p.id);
const person = (id) => PEOPLE.find((p) => p.id === id) || { id, name: id };

const CATS = [
  { id: 'market', label: 'Market', emoji: '🛒', color: '#f59e0b',
    keys: ['süt', 'ekmek', 'yumurta', 'peynir', 'kahve', 'çay', 'şeker', 'tuz', 'yağ', 'makarna', 'pirinç', 'un', 'meyve', 'sebze', 'domates', 'soğan', 'patates', 'su ', 'maden', 'lidl', 'aldi', 'rewe', 'edeka', 'netto', 'kaufland', 'penny', 'market', 'baharat', 'sos', 'ketçap', 'mayonez', 'zeytin', 'reçel', 'bal'] },
  { id: 'temizlik', label: 'Temizlik', emoji: '🧽', color: '#38bdf8',
    keys: ['deterjan', 'çamaşır', 'bulaşık', 'sünger', 'çöp', 'poşet', 'torba', 'sprey', 'temizl', 'yumuşatıcı', 'çamaşır suyu', 'kireç', 'mop', 'paspas', 'süpürge', 'bez', 'putz', 'spül', 'müll', 'eldiven', 'tablet'] },
  { id: 'banyo', label: 'Banyo', emoji: '🧻', color: '#a78bfa',
    keys: ['tuvalet', 'klozet', 'sabun', 'şampuan', 'diş', 'havlu', 'klopapier', 'duş', 'peçete', 'mendil', 'pamuk'] },
  { id: 'mutfak', label: 'Mutfak', emoji: '🍳', color: '#fb7185',
    keys: ['tava', 'tencere', 'bıçak', 'tabak', 'bardak', 'çatal', 'kaşık', 'folyo', 'streç', 'pişirme', 'kağıdı', 'kupa', 'fincan', 'kesme', 'süzgeç', 'demlik', 'kettle', 'saklama'] },
  { id: 'ev', label: 'Ev & Mobilya', emoji: '🛋️', color: '#34d399',
    keys: ['halı', 'perde', 'sandalye', 'masa', 'lamba', 'ampul', 'raf', 'dolap', 'ikea', 'yastık', 'nevresim', 'askı', 'saksı', 'bitki', 'çiçek', 'ayna', 'kilim', 'mum', 'paspas'] },
  { id: 'fatura', label: 'Fatura', emoji: '💡', color: '#facc15',
    keys: ['internet', 'elektrik', 'strom', 'doğalgaz', 'gaz', 'rundfunk', 'gez', 'wlan', 'wifi', 'fatura', 'kira', 'miete', 'netflix', 'spotify', 'abonelik'] },
  { id: 'elektronik', label: 'Elektronik', emoji: '🔌', color: '#60a5fa',
    keys: ['kablo', 'priz', 'şarj', 'router', 'pil', 'batarya', 'uzatma', 'adaptör', 'kulaklık', 'hoparlör'] },
  { id: 'diger', label: 'Diğer', emoji: '📦', color: '#94a3b8', keys: [] },
];
const cat = (id) => CATS.find((c) => c.id === id) || CATS[CATS.length - 1];

function guessCat(name) {
  const s = ` ${String(name).toLocaleLowerCase('tr')} `;
  for (const c of CATS) if (c.keys.some((k) => s.includes(k))) return c.id;
  return 'diger';
}

const PUTZ_FIRST_WEEK = '2026-10-12'; // first week of the plan (Haydar)
const PUTZ_TASKS = [
  { id: 'supurge', label: 'Ortak alanların süpürülmesi', emoji: '🧹' },
  { id: 'banyo', label: 'Banyo ve klozet temizlemesi', emoji: '🚽' },
  { id: 'ocak', label: 'Mutfak ocağını silmek', emoji: '🍳' },
];
const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAYS_FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

/* ───────── helpers ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const euro = (c) => money.format((c || 0) / 100);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const opts = { day: 'numeric', month: 'short' };
  if (y !== new Date().getFullYear()) opts.year = 'numeric';
  return date.toLocaleDateString('tr-TR', opts);
};
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

/** "12,50" / "12.50" / "1.234,50" / "€ 3" → cents (int) or NaN */
function parseAmount(raw) {
  let s = String(raw).trim().replace(/[€\s]/g, '');
  if (!s) return NaN;
  if (s.includes(',') && s.includes('.')) {
    s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else {
    s = s.replace(',', '.');
  }
  if (!/^\d*\.?\d+$/.test(s)) return NaN;
  const c = Math.round(parseFloat(s) * 100);
  return c > 0 && c < 10_000_000 ? c : NaN;
}
const centsToInput = (c) => (c / 100).toFixed(2).replace('.', ',');

const ICON = {
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M4 12h15m0 0-5-5m5 5-5 5"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};
const avatar = (id, cls = '') => `<span class="avatar ${cls}" data-person="${id}">${esc(person(id).name[0])}</span>`;

/* ───────── storage backends ───────── */
// Both stores expose: start(onData, onStatus), patch({"kind/id": value|null}), replaceAll(data)

class LocalStore {
  key = 'wg-kasasi-data-v1';
  mem = {};
  read() {
    const raw = lsGet(this.key);
    if (raw == null) return this.mem;
    try { return JSON.parse(raw) || {}; } catch { return {}; }
  }
  write(d) {
    this.mem = d;
    lsSet(this.key, JSON.stringify(d));
    this.onData(structuredClone(d));
  }
  async start(onData, onStatus) {
    this.onData = onData;
    onStatus('local');
    addEventListener('storage', (e) => { if (e.key === this.key) onData(this.read()); });
    onData(this.read());
  }
  async patch(changes) {
    const d = this.read();
    for (const [path, val] of Object.entries(changes)) {
      const [kind, id] = path.split('/');
      d[kind] ||= {};
      if (val == null) delete d[kind][id];
      else d[kind][id] = val;
      if (!Object.keys(d[kind]).length) delete d[kind];
    }
    this.write(d);
  }
  async replaceAll(data) { this.write(structuredClone(data || {})); }
}

class FirebaseStore {
  constructor(config, path) { this.config = config; this.path = path || 'wg'; }
  async start(onData, onStatus) {
    onStatus('connecting');
    const V = '10.12.2';
    const base = `https://www.gstatic.com/firebasejs/${V}`;
    const [{ initializeApp }, db, auth] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-database.js`),
      import(`${base}/firebase-auth.js`),
    ]);
    const app = initializeApp(this.config);
    try {
      await auth.signInAnonymously(auth.getAuth(app));
    } catch (e) {
      console.warn('Anonim giriş yapılamadı (Firebase > Authentication > Anonymous açık mı?):', e.code || e);
    }
    this.fx = db;
    this.db = db.getDatabase(app);
    this.root = db.ref(this.db, this.path);
    let connected = false;
    db.onValue(db.ref(this.db, '.info/connected'), (s) => {
      connected = !!s.val();
      onStatus(connected ? 'live' : 'offline');
    });
    db.onValue(
      this.root,
      (s) => { onData(s.val() || {}); if (connected) onStatus('live'); },
      (err) => { console.error(err); onStatus('error', err); }
    );
  }
  patch(changes) {
    if (!Object.keys(changes).length) return Promise.resolve();
    return this.fx.update(this.root, changes);
  }
  replaceAll(data) {
    const has = data && Object.values(data).some((v) => v && Object.keys(v).length);
    return this.fx.set(this.root, has ? data : null);
  }
}

/* ───────── state ───────── */
let state = normalize({});
let store;
let firstRender = true;
const seenIds = new Set();
let activeTab = PIDS.includes(lsGet('wg-tab')) ? lsGet('wg-tab') : PIDS[0];

function normalize(data) {
  const out = { expenses: {}, settlements: {} };
  for (const [id, e] of Object.entries(data?.expenses || {})) {
    if (!e || !PIDS.includes(e.payer) || !(e.amount > 0)) continue;
    let split = Array.isArray(e.split) ? e.split : Object.values(e.split || {});
    split = PIDS.filter((p) => split.includes(p));
    if (!split.length) split = [...PIDS];
    out.expenses[id] = { ...e, id, amount: Math.round(e.amount), split, cat: cat(e.cat).id };
  }
  for (const [id, s] of Object.entries(data?.settlements || {})) {
    if (!s || !PIDS.includes(s.from) || !PIDS.includes(s.to) || !(s.amount > 0)) continue;
    out.settlements[id] = { ...s, id, amount: Math.round(s.amount) };
  }
  out.putzWeeks = {};
  for (const [k, w] of Object.entries(data?.putzWeeks || {})) {
    if (!w || !/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    const v = {};
    if (PIDS.includes(w.person)) v.person = w.person;
    if (Number.isInteger(w.day) && w.day >= 0 && w.day <= 6) v.day = w.day;
    if (w.done) { v.done = true; if (w.doneAt) v.doneAt = w.doneAt; }
    const tasks = Object.keys(w.tasks || {}).filter((t) => w.tasks[t] && PUTZ_TASKS.some((x) => x.id === t));
    if (tasks.length) v.tasks = Object.fromEntries(tasks.map((t) => [t, true]));
    if (Object.keys(v).length) out.putzWeeks[k] = v;
  }
  const c = data?.putzConfig?.main || {};
  const order = Array.isArray(c.order) ? c.order : Object.values(c.order || {});
  out.putzConfig = {
    main: {
      order: order.length === PIDS.length && PIDS.every((p) => order.includes(p)) ? order : [...PIDS],
      anchorWeek: /^\d{4}-\d{2}-\d{2}$/.test(c.anchorWeek || '') ? c.anchorWeek : PUTZ_FIRST_WEEK,
      anchorIdx: Number.isInteger(c.anchorIdx) && c.anchorIdx >= 0 && c.anchorIdx < PIDS.length ? c.anchorIdx : 0,
    },
  };
  return out;
}

const byNewest = (a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0);

function compute() {
  const exps = Object.values(state.expenses);
  const paid = Object.fromEntries(PIDS.map((p) => [p, 0]));
  const share = { ...paid }, sent = { ...paid }, recv = { ...paid }, net = { ...paid };
  const cats = {};
  let total = 0;

  for (const e of exps) {
    total += e.amount;
    paid[e.payer] += e.amount;
    cats[e.cat] = (cats[e.cat] || 0) + e.amount;
    const n = e.split.length;
    const base = Math.floor(e.amount / n);
    let rem = e.amount - base * n;
    // leftover cents go to the payer first (if they share), then in order
    const order = e.split.includes(e.payer) ? [e.payer, ...e.split.filter((p) => p !== e.payer)] : e.split;
    for (const p of order) { share[p] += base + (rem > 0 ? 1 : 0); rem--; }
  }
  for (const s of Object.values(state.settlements)) { sent[s.from] += s.amount; recv[s.to] += s.amount; }
  for (const p of PIDS) net[p] = paid[p] - share[p] + sent[p] - recv[p];

  // minimal transfers: greedy match largest debtor with largest creditor
  const debt = PIDS.filter((p) => net[p] < 0).map((p) => ({ p, v: -net[p] })).sort((a, b) => b.v - a.v);
  const cred = PIDS.filter((p) => net[p] > 0).map((p) => ({ p, v: net[p] })).sort((a, b) => b.v - a.v);
  const transfers = [];
  let i = 0, j = 0;
  while (i < debt.length && j < cred.length) {
    const x = Math.min(debt[i].v, cred[j].v);
    if (x > 0) transfers.push({ from: debt[i].p, to: cred[j].p, amount: x });
    debt[i].v -= x; cred[j].v -= x;
    if (!debt[i].v) i++;
    if (!cred[j].v) j++;
  }
  return { exps, total, paid, share, net, cats, transfers };
}

/* ───────── rendering ───────── */
function buildSkeleton() {
  $('#tabs').innerHTML = PEOPLE.map((p) => `
    <button class="tab" role="tab" data-person="${p.id}" data-tab="${p.id}" aria-selected="${p.id === activeTab}" aria-controls="panel-${p.id}">
      ${avatar(p.id, 'xs')}<span><b>${esc(p.name)}</b><small data-tab-total>0,00 €</small></span>
    </button>`).join('');

  const catOptions = CATS.map((c) => `<option value="${c.id}"${c.id === 'diger' ? ' selected' : ''}>${c.emoji} ${esc(c.label)}</option>`).join('');

  $('#people').innerHTML = PEOPLE.map((p) => `
    <article class="panel ${p.id === activeTab ? 'active' : ''}" id="panel-${p.id}" data-person="${p.id}" role="tabpanel">
      <header class="panel-head">
        ${avatar(p.id)}
        <div class="who"><h3>${esc(p.name)}</h3><span data-count>Henüz harcama yok</span></div>
        <div class="panel-total"><span>Harcadı</span><strong data-total data-v="0">0,00 €</strong></div>
      </header>
      <form class="quick-add" data-add="${p.id}" autocomplete="off" novalidate>
        <div class="qa-row">
          <input name="name" maxlength="60" placeholder="Ne aldın?" aria-label="${esc(p.name)} — ne alındı" enterkeyhint="next" />
          <label class="amount-field"><input name="amount" inputmode="decimal" placeholder="0,00" aria-label="Tutar (€)" enterkeyhint="done" /><span>€</span></label>
        </div>
        <div class="qa-actions">
          <select name="cat" class="cat-select" aria-label="Kategori">${catOptions}</select>
          <span class="spacer"></span>
          <button type="button" class="link-btn" data-detail>Detaylı</button>
          <button type="submit" class="btn add">${ICON.plus}Ekle</button>
        </div>
      </form>
      <ul class="items" data-list></ul>
      <footer class="panel-foot">
        <span data-share></span>
        <button type="button" class="link-btn" data-clear="${p.id}">Listeyi temizle</button>
      </footer>
    </article>`).join('');

  $('#dlgCat').innerHTML = catOptions;
  $('#dlgPayer').innerHTML = PEOPLE.map((p) => `
    <label class="chip" data-person="${p.id}"><input type="radio" name="payer" value="${p.id}" />${avatar(p.id)}${esc(p.name)}</label>`).join('');
  $('#dlgSplit').innerHTML = PEOPLE.map((p) => `
    <label class="chip" data-person="${p.id}"><input type="checkbox" name="split" value="${p.id}" />${avatar(p.id)}${esc(p.name)}</label>`).join('');
}

function animateMoney(el, cents) {
  const from = Number(el.dataset.v || 0);
  el.dataset.v = cents;
  if (from === cents || firstRender || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = euro(cents);
    return;
  }
  const t0 = performance.now(), dur = 650;
  cancelAnimationFrame(el._raf);
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = euro(Math.round(from + (cents - from) * e));
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

function splitLabel(split) {
  if (split.length === PIDS.length) return '';
  if (split.length === 1) return `sadece ${person(split[0]).name}`;
  return split.map((p) => person(p).name).join(' & ');
}

function render() {
  const r = compute();
  const sorted = [...r.exps].sort(byNewest);

  // hero
  animateMoney($('#heroTotal'), r.total);
  $('#statCount').textContent = r.exps.length;
  $('#statAvg').textContent = euro(Math.round(r.total / PIDS.length));
  const last = [...r.exps].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
  $('#statLast').textContent = last ? last.name : '—';
  $('#statLast').title = last ? `${last.name} · ${person(last.payer).name}` : '';

  // panels
  for (const p of PEOPLE) {
    const panel = $(`#panel-${p.id}`);
    const mine = sorted.filter((e) => e.payer === p.id);
    animateMoney($('[data-total]', panel), r.paid[p.id]);
    $(`[data-tab="${p.id}"] [data-tab-total]`).textContent = euro(r.paid[p.id]);
    $('[data-count]', panel).textContent = mine.length ? `${mine.length} kalem` : 'Henüz harcama yok';
    $('[data-share]', panel).textContent = r.exps.length ? `Payına düşen: ${euro(r.share[p.id])}` : '';
    $('[data-clear]', panel).hidden = !mine.length;
    $('[data-list]', panel).innerHTML = mine.length
      ? mine.map((e) => {
          const c = cat(e.cat);
          const sl = splitLabel(e.split);
          const isNew = !firstRender && !seenIds.has(e.id);
          return `
          <li class="item${isNew ? ' enter' : ''}" data-id="${esc(e.id)}">
            <span class="item-ico" title="${esc(c.label)}">${c.emoji}</span>
            <div class="item-main">
              <span class="item-name" title="${esc(e.name)}">${esc(e.name)}</span>
              <span class="item-meta">${esc(c.label)} · ${esc(fmtDate(e.date))}${sl ? ` <span class="split-tag">${esc(sl)}</span>` : ''}${e.note ? ` · ${esc(e.note)}` : ''}</span>
            </div>
            <span class="item-amt">${euro(e.amount)}</span>
            <div class="item-actions">
              <button type="button" data-edit="${esc(e.id)}" aria-label="Düzenle">${ICON.edit}</button>
              <button type="button" class="del" data-del="${esc(e.id)}" aria-label="Sil">${ICON.trash}</button>
            </div>
          </li>`;
        }).join('')
      : `<li class="empty"><span class="em">${['🧺', '🪴', '🧃'][PIDS.indexOf(p.id)]}</span>Henüz bir şey eklenmedi.<br/>Yukarıdan ilk harcamanı ekle.</li>`;
  }
  r.exps.forEach((e) => seenIds.add(e.id));

  renderTransfers(r);
  renderBalances(r);
  renderCats(r);
  renderPayments();
  renderPutz();
  firstRender = false;
}

function renderTransfers(r) {
  const el = $('#transfers');
  if (!r.exps.length) {
    el.innerHTML = `<div class="settled"><span class="big">🧾</span><div><strong>Henüz hesap yok</strong>İlk harcama eklendiğinde kimin kime ne göndereceği burada otomatik çıkar.</div></div>`;
    return;
  }
  if (!r.transfers.length) {
    el.innerHTML = `<div class="settled"><span class="big">🎉</span><div><strong>Herkes ödeşti!</strong>Şu an kimsenin kimseye borcu yok.</div></div>`;
    return;
  }
  el.innerHTML = r.transfers.map((t) => `
    <div class="tf" style="--from: var(--${t.from}); --to: var(--${t.to})">
      <div class="tf-people">${avatar(t.from)}<span class="tf-arrow">${ICON.arrow}</span>${avatar(t.to)}</div>
      <div class="tf-text">
        <b>${esc(person(t.from).name)}</b> → <b>${esc(person(t.to).name)}</b>
        <span class="tf-amt">${euro(t.amount)}</span>
      </div>
      <button type="button" class="btn primary" data-pay='${esc(JSON.stringify(t))}'>${ICON.check}Ödendi</button>
    </div>`).join('');
}

function renderBalances(r) {
  const max = Math.max(1, ...PIDS.map((p) => Math.max(r.paid[p], r.share[p])));
  $('#balances').innerHTML = PEOPLE.map((p) => {
    const n = r.net[p.id];
    const badge = n > 0 ? `<span class="badge pos">+${euro(n)} alacaklı</span>`
      : n < 0 ? `<span class="badge neg">−${euro(-n)} borçlu</span>`
      : `<span class="badge zero">ödeşmiş</span>`;
    return `
      <div class="bal" data-person="${p.id}">
        ${avatar(p.id, 'sm')}
        <div class="bal-name">${esc(p.name)}<small>${euro(r.paid[p.id])} ödedi · payı ${euro(r.share[p.id])}</small></div>
        ${badge}
        <div class="bar" aria-hidden="true"><i style="width:${(r.paid[p.id] / max) * 100}%"></i><b style="left:calc(${(r.share[p.id] / max) * 100}% - 1px)"></b></div>
      </div>`;
  }).join('') + `<div class="bal-legend"><span><i></i>Ödediği</span><span><b></b>Payına düşen</span></div>`;
}

function renderCats(r) {
  const entries = Object.entries(r.cats).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    $('#cats').innerHTML = `<p class="hint">Harcama eklendikçe kategori dağılımı burada görünecek.</p>`;
    return;
  }
  $('#cats').innerHTML = `
    <div class="cat-stack">${entries.map(([id, v]) => `<i style="flex-grow:${v};background:${cat(id).color}" title="${esc(cat(id).label)}"></i>`).join('')}</div>
    <ul class="cat-list">${entries.map(([id, v]) => `
      <li><span class="dot" style="background:${cat(id).color}"></span><span>${cat(id).emoji} ${esc(cat(id).label)}</span>
      <span class="pct">${Math.round((v / r.total) * 100)}%</span><span class="v">${euro(v)}</span></li>`).join('')}
    </ul>`;
}

function renderPayments() {
  const list = Object.values(state.settlements).sort(byNewest);
  $('#payments').innerHTML = list.length
    ? list.map((s) => `
      <li>
        <span class="pp">${avatar(s.from, 'xs')}${ICON.arrow}${avatar(s.to, 'xs')}</span>
        <span><b>${esc(person(s.from).name)}</b> → <b>${esc(person(s.to).name)}</b> <span class="when">· ${esc(fmtDate(s.date))}</span></span>
        <span class="v">${euro(s.amount)}</span>
        <button type="button" class="icon-btn sm" data-unpay="${esc(s.id)}" aria-label="Ödemeyi geri al">${ICON.x}</button>
      </li>`).join('')
    : `<li><span class="muted-empty">Henüz kayıtlı ödeme yok. Biri borcunu gönderince yukarıdaki “Ödendi” butonuna bas.</span></li>`;
}

function setTab(id) {
  activeTab = id;
  lsSet('wg-tab', id);
  $$('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
  $$('.panel').forEach((p) => p.classList.toggle('active', p.dataset.person === id));
}

/* ───────── sync status ───────── */
const STATUS = {
  local: { label: 'Yerel mod', icon: '💾', title: 'Yerel mod', text: 'Veriler sadece bu cihazın tarayıcısında saklanıyor. Haydar, Sude ve Ezgi\'nin aynı listeyi görmesi için config.js dosyasına Firebase ayarlarını ekleyin (README\'de adım adım anlatılıyor).' },
  connecting: { label: 'Bağlanıyor…', icon: '⏳', title: 'Bağlanıyor', text: 'Ortak veritabanına bağlanılıyor…' },
  live: { label: 'Canlı senkron', icon: '☁️', title: 'Canlı senkron açık', text: 'Her şey ortak veritabanına kaydediliyor. Sude, Ezgi veya Haydar bir şey eklediğinde herkesin ekranında anında görünür.' },
  offline: { label: 'Çevrimdışı', icon: '📴', title: 'Çevrimdışı', text: 'İnternet bağlantısı yok. Yaptığın değişiklikler bağlantı gelince otomatik gönderilecek.' },
  error: { label: 'Bağlantı hatası', icon: '⚠️', title: 'Veritabanına erişilemedi', text: 'Firebase bağlantısı reddedildi. config.js ayarlarını ve Realtime Database kurallarını (README) kontrol et.' },
};
let syncState = 'connecting';
function setStatus(s) {
  syncState = s;
  const st = STATUS[s] || STATUS.error;
  const pill = $('#syncPill');
  pill.dataset.state = s;
  $('span', pill).textContent = st.label;
  pill.title = st.label;
  const banner = $('#localBanner');
  banner.hidden = s !== 'local' || lsGet('wg-banner-hidden') === '1';
  banner.style.display = banner.hidden ? 'none' : '';
}

/* ───────── toast ───────── */
let toastTimer;
function toast(text, action, onAction, ms = 4200) {
  const el = $('#toast');
  $('#toastText').textContent = text;
  const btn = $('#toastAction');
  btn.textContent = action || '';
  btn.onclick = () => { el.classList.remove('show'); onAction?.(); };
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), action ? 7000 : ms);
}

async function save(changes, okMsg, undo) {
  try {
    await store.patch(changes);
    if (okMsg) toast(okMsg, undo ? 'Geri al' : '', undo);
  } catch (e) {
    console.error(e);
    toast('Kaydedilemedi — bağlantıyı kontrol et.');
  }
}

/* ───────── dialogs ───────── */
function confirmBox({ icon = '⚠️', title, text, ok = 'Evet', danger = true }) {
  const d = $('#confirmDialog');
  $('#confirmIco').textContent = icon;
  $('#confirmTitle').textContent = title;
  $('#confirmText').textContent = text;
  const okBtn = $('#confirmOk');
  okBtn.textContent = ok;
  okBtn.className = `btn ${danger ? 'danger' : 'primary'}`;
  d.returnValue = '';
  d.showModal();
  return new Promise((res) => d.addEventListener('close', () => res(d.returnValue === 'ok'), { once: true }));
}

let editingId = null;
function openItemDialog({ id = null, payer = activeTab, name = '', amount = '' } = {}) {
  editingId = id;
  const e = id ? state.expenses[id] : null;
  const f = $('#itemForm');
  f.reset();
  $('#itemDialogTitle').textContent = e ? 'Harcamayı düzenle' : 'Yeni harcama';
  $('#itemSave').textContent = e ? 'Kaydet' : 'Ekle';
  f.name.value = e ? e.name : name;
  f.amount.value = e ? centsToInput(e.amount) : amount;
  f.date.value = e ? e.date : todayISO();
  f.cat.value = e ? e.cat : guessCat(name);
  f.cat.dataset.touched = e ? '1' : '';
  f.note.value = e?.note || '';
  const pay = e ? e.payer : payer;
  $$('input[name="payer"]', f).forEach((i) => (i.checked = i.value === pay));
  const split = e ? e.split : PIDS;
  $$('input[name="split"]', f).forEach((i) => (i.checked = split.includes(i.value)));
  updateSplitHint();
  const d = $('#itemDialog');
  d.returnValue = '';
  d.showModal();
  if (!e && !name) setTimeout(() => f.name.focus(), 50);
}

function updateSplitHint() {
  const f = $('#itemForm');
  const split = $$('input[name="split"]:checked', f).map((i) => i.value);
  const cents = parseAmount(f.amount.value);
  let hint = '';
  if (!split.length) hint = 'En az bir kişi seçmelisin.';
  else if (cents > 0) hint = `Kişi başı ≈ ${euro(Math.round(cents / split.length))} (${split.map((p) => person(p).name).join(', ')})`;
  else hint = split.length === PIDS.length ? 'Varsayılan: üç kişi eşit böler.' : `${split.map((p) => person(p).name).join(' ve ')} arasında bölünür.`;
  $('#dlgSplitHint').textContent = hint;
}

/* ───────── actions ───────── */
async function addExpense({ payer, name, amount, cat: c, date, split, note }) {
  const now = Date.now();
  const e = { id: uid(), payer, name: name.trim().slice(0, 60), amount, cat: c, date: date || todayISO(), split: split || [...PIDS], createdAt: now, updatedAt: now };
  if (note?.trim()) e.note = note.trim().slice(0, 120);
  await save({ [`expenses/${e.id}`]: e }, `${person(payer).name}: “${e.name}” eklendi · ${euro(amount)}`,
    () => save({ [`expenses/${e.id}`]: null }, 'Geri alındı'));
}

function deleteExpense(id) {
  const e = state.expenses[id];
  if (!e) return;
  save({ [`expenses/${id}`]: null }, `“${e.name}” silindi`, () => save({ [`expenses/${id}`]: e }, 'Geri getirildi'));
}

function exportFile(name, content, type) {
  const blob = new Blob([content], { type });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportCsv() {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const n = (c) => (c / 100).toFixed(2).replace('.', ',');
  const rows = [['Tarih', 'Ödeyen', 'Ürün', 'Kategori', 'Tutar (€)', 'Paylaşanlar', 'Not'].map(q).join(';')];
  for (const e of Object.values(state.expenses).sort(byNewest)) {
    rows.push([e.date, person(e.payer).name, e.name, cat(e.cat).label, n(e.amount), e.split.map((p) => person(p).name).join(', '), e.note || ''].map((v, i) => (i === 4 ? v : q(v))).join(';'));
  }
  const pays = Object.values(state.settlements).sort(byNewest);
  if (pays.length) {
    rows.push('', ['Tarih', 'Gönderen', 'Alan', 'Tutar (€)'].map(q).join(';'));
    for (const s of pays) rows.push([q(s.date), q(person(s.from).name), q(person(s.to).name), n(s.amount)].join(';'));
  }
  const r = compute();
  rows.push('', [q('Kişi'), q('Ödedi'), q('Payı'), q('Bakiye')].join(';'));
  for (const p of PEOPLE) rows.push([q(p.name), n(r.paid[p.id]), n(r.share[p.id]), n(r.net[p.id])].join(';'));
  exportFile(`wg-kasasi-${todayISO()}.csv`, '﻿' + rows.join('\r\n'), 'text/csv;charset=utf-8');
  toast('CSV indirildi — Excel ile açabilirsin.');
}

function exportBackup() {
  const payload = { app: 'wg-kasasi', version: 1, exportedAt: new Date().toISOString(), data: state };
  exportFile(`wg-kasasi-yedek-${todayISO()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  toast('Yedek indirildi.');
}

async function importBackup(file) {
  try {
    const json = JSON.parse(await file.text());
    const raw = json.data || json;
    const data = normalize(raw);
    if (!raw.putzWeeks) data.putzWeeks = state.putzWeeks;
    if (!raw.putzConfig) data.putzConfig = state.putzConfig;
    const n = Object.keys(data.expenses).length;
    const ok = await confirmBox({ icon: '📥', title: 'Yedekten yüklensin mi?', text: `Yedekte ${n} harcama ve ${Object.keys(data.settlements).length} ödeme var. Şu anki tüm veriler bunlarla değiştirilecek.`, ok: 'Yükle', danger: false });
    if (!ok) return;
    const before = structuredClone(state);
    await store.replaceAll(data);
    toast('Yedek yüklendi', 'Geri al', () => store.replaceAll(before));
  } catch (e) {
    console.error(e);
    toast('Bu dosya okunamadı — geçerli bir WG Kasası yedeği mi?');
  }
}

/* ───────── events ───────── */
function bindEvents() {
  $('#tabs').addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-tab]');
    if (t) setTab(t.dataset.tab);
  });

  const people = $('#people');

  people.addEventListener('input', (ev) => {
    const f = ev.target.closest('form[data-add]');
    if (!f) return;
    if (ev.target.name === 'name' && !f.cat.dataset.touched) f.cat.value = guessCat(ev.target.value);
    ev.target.removeAttribute('aria-invalid');
  });
  people.addEventListener('change', (ev) => {
    if (ev.target.classList.contains('cat-select')) ev.target.dataset.touched = '1';
  });

  people.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = ev.target;
    const payer = f.dataset.add;
    const name = f.name.value.trim();
    const amount = parseAmount(f.amount.value);
    if (!name) { f.name.setAttribute('aria-invalid', 'true'); f.name.focus(); toast('Ne aldığını yaz 🙂'); return; }
    if (!(amount > 0)) { f.amount.setAttribute('aria-invalid', 'true'); f.amount.focus(); toast('Geçerli bir tutar gir (örn. 4,95)'); return; }
    const c = f.cat.value;
    f.reset();
    f.cat.dataset.touched = '';
    f.name.focus();
    await addExpense({ payer, name, amount, cat: c });
  });

  // Enter on the name field jumps to amount instead of submitting
  people.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.name === 'name' && ev.target.closest('form[data-add]')) {
      const f = ev.target.form;
      if (!f.amount.value) { ev.preventDefault(); f.amount.focus(); }
    }
  });

  people.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.edit) openItemDialog({ id: b.dataset.edit });
    else if (b.dataset.del) deleteExpense(b.dataset.del);
    else if (b.hasAttribute('data-detail')) {
      const f = b.closest('form');
      openItemDialog({ payer: f.dataset.add, name: f.name.value.trim(), amount: f.amount.value.trim() });
      f.reset();
      f.cat.dataset.touched = '';
    } else if (b.dataset.clear) {
      const pid = b.dataset.clear;
      const mine = Object.values(state.expenses).filter((e) => e.payer === pid);
      const ok = await confirmBox({ icon: '🧹', title: `${person(pid).gen} listesi temizlensin mi?`, text: `${mine.length} harcama (${euro(mine.reduce((s, e) => s + e.amount, 0))}) silinecek. Hemen ardından geri alabilirsin.`, ok: 'Temizle' });
      if (!ok) return;
      const del = Object.fromEntries(mine.map((e) => [`expenses/${e.id}`, null]));
      const back = Object.fromEntries(mine.map((e) => [`expenses/${e.id}`, e]));
      save(del, `${person(pid).gen} listesi temizlendi`, () => save(back, 'Geri getirildi'));
    }
  });

  // Dialog: add/edit
  const itemForm = $('#itemForm');
  itemForm.addEventListener('input', (ev) => {
    if (ev.target.name === 'name' && !itemForm.cat.dataset.touched) itemForm.cat.value = guessCat(ev.target.value);
    if (ev.target.name === 'amount' || ev.target.name === 'split') updateSplitHint();
  });
  itemForm.addEventListener('change', (ev) => {
    if (ev.target.name === 'cat') itemForm.cat.dataset.touched = '1';
    if (ev.target.name === 'split') updateSplitHint();
  });
  $('#itemSave').addEventListener('click', async (ev) => {
    ev.preventDefault();
    const f = itemForm;
    const name = f.name.value.trim();
    const amount = parseAmount(f.amount.value);
    const payer = $('input[name="payer"]:checked', f)?.value;
    const split = $$('input[name="split"]:checked', f).map((i) => i.value);
    if (!name) { f.name.focus(); toast('Ne alındığını yaz'); return; }
    if (!(amount > 0)) { f.amount.focus(); toast('Geçerli bir tutar gir (örn. 4,95)'); return; }
    if (!payer) { toast('Kimin ödediğini seç'); return; }
    if (!split.length) { toast('En az bir kişi seçmelisin'); return; }
    const date = f.date.value || todayISO();
    const note = f.note.value.trim();
    $('#itemDialog').close('save');
    if (editingId && state.expenses[editingId]) {
      const old = state.expenses[editingId];
      const e = { ...old, name: name.slice(0, 60), amount, payer, split, cat: f.cat.value, date, updatedAt: Date.now() };
      if (note) e.note = note.slice(0, 120); else delete e.note;
      await save({ [`expenses/${e.id}`]: e }, 'Değişiklik kaydedildi', () => save({ [`expenses/${e.id}`]: old }, 'Geri alındı'));
      if (old.payer !== payer) setTab(payer);
    } else {
      await addExpense({ payer, name, amount, cat: f.cat.value, date, split, note });
      setTab(payer);
    }
  });

  // Transfers
  $('#transfers').addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-pay]');
    if (!b) return;
    const t = JSON.parse(b.dataset.pay);
    const ok = await confirmBox({ icon: '💸', title: 'Ödeme yapıldı mı?', text: `${person(t.from).name}, ${person(t.to).dat} ${euro(t.amount)} gönderdi olarak kaydedilecek.`, ok: 'Evet, ödendi', danger: false });
    if (!ok) return;
    const s = { id: uid(), from: t.from, to: t.to, amount: t.amount, date: todayISO(), createdAt: Date.now() };
    save({ [`settlements/${s.id}`]: s }, 'Ödeme kaydedildi 💸', () => save({ [`settlements/${s.id}`]: null }, 'Geri alındı'));
  });
  $('#payments').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-unpay]');
    if (!b) return;
    const s = state.settlements[b.dataset.unpay];
    if (!s) return;
    save({ [`settlements/${s.id}`]: null }, 'Ödeme kaydı silindi', () => save({ [`settlements/${s.id}`]: s }, 'Geri getirildi'));
  });

  // Tools
  $('#btnCsv').addEventListener('click', exportCsv);
  $('#btnBackup').addEventListener('click', exportBackup);
  $('#restoreInput').addEventListener('change', (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (file) importBackup(file);
  });
  $('#btnClearPayments').addEventListener('click', async () => {
    const pays = Object.values(state.settlements);
    if (!pays.length) { toast('Silinecek ödeme kaydı yok.'); return; }
    const ok = await confirmBox({ icon: '↩️', title: 'Ödeme geçmişi silinsin mi?', text: `${pays.length} ödeme kaydı silinecek; borç hesabı bu ödemeler hiç yapılmamış gibi yeniden hesaplanır.`, ok: 'Sil' });
    if (!ok) return;
    save(Object.fromEntries(pays.map((s) => [`settlements/${s.id}`, null])), 'Ödeme geçmişi silindi',
      () => save(Object.fromEntries(pays.map((s) => [`settlements/${s.id}`, s])), 'Geri getirildi'));
  });
  $('#btnResetAll').addEventListener('click', async () => {
    const n = Object.keys(state.expenses).length + Object.keys(state.settlements).length;
    if (!n) { toast('Zaten her şey sıfır ✨'); return; }
    const ok = await confirmBox({ icon: '🗑️', title: 'Kasa sıfırlansın mı?', text: 'Üç kişinin tüm harcamaları ve ödeme geçmişi silinecek — herkes için. Putzplan olduğu gibi kalır. İstersen önce “Yedek indir” ile yedek al.', ok: 'Sıfırla' });
    if (!ok) return;
    const before = structuredClone(state);
    try {
      await store.replaceAll({ ...state, expenses: {}, settlements: {} });
      toast('Kasa sıfırlandı — yeni dönem başladı ✨', 'Geri al', () => store.replaceAll(before).then(() => toast('Geri getirildi')));
    } catch (e) {
      console.error(e);
      toast('Sıfırlanamadı — bağlantıyı kontrol et.');
    }
  });

  // Top bar
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    lsSet('wg-theme', next);
  });
  $('#syncPill').addEventListener('click', () => {
    const st = STATUS[syncState] || STATUS.error;
    $('#syncIco').textContent = st.icon;
    $('#syncTitle').textContent = st.title;
    $('#syncText').textContent = st.text;
    $('#syncDialog').showModal();
  });
  $('#bannerClose').addEventListener('click', () => { lsSet('wg-banner-hidden', '1'); $('#localBanner').hidden = true; $('#localBanner').style.display = 'none'; });

  // close dialogs by clicking the backdrop
  $$('dialog').forEach((d) => d.addEventListener('click', (ev) => { if (ev.target === d) d.close('cancel'); }));
}

/* ───────── Putzplan ───────── */
// Weeks are keyed by their Monday ("YYYY-MM-DD"); date math runs in UTC to dodge DST.
const DAY_MS = 86400000;
const utc = (key) => { const [y, m, d] = key.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const keyOf = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (key, n) => keyOf(utc(key) + n * DAY_MS);
const weeksBetween = (a, b) => Math.round((utc(b) - utc(a)) / (7 * DAY_MS));
const todayIdx = () => (new Date().getDay() + 6) % 7;
const currentWeek = () => addDays(todayISO(), -todayIdx());
const mod = (n, m) => ((n % m) + m) % m;
const fmtDay = (key, opts = { day: 'numeric', month: 'short' }) => new Date(utc(key)).toLocaleDateString('tr-TR', { ...opts, timeZone: 'UTC' });
function weekRange(key) {
  const end = addDays(key, 6);
  return key.slice(5, 7) === end.slice(5, 7)
    ? `${new Date(utc(key)).getUTCDate()} – ${fmtDay(end)}`
    : `${fmtDay(key)} – ${fmtDay(end)}`;
}

const putzCfg = () => state.putzConfig.main;
const weekData = (key) => state.putzWeeks[key] || {};
const rotationPerson = (key) => {
  const c = putzCfg();
  return c.order[mod(c.anchorIdx + weeksBetween(c.anchorWeek, key), c.order.length)];
};
const personOf = (key) => weekData(key).person || rotationPerson(key);

function weekStatus(key) {
  const w = weekData(key);
  const now = currentWeek();
  if (w.done) return { cls: 'pos', text: 'Temizlendi ✓' };
  if (key < now) return { cls: 'neg', text: 'Yapılmadı' };
  if (key === now) {
    const td = todayIdx();
    if (w.day == null) return { cls: 'warn', text: 'Gün seçilmedi' };
    if (w.day < td) return { cls: 'neg', text: `Gecikti · ${DAYS_FULL[w.day]}` };
    if (w.day === td) return { cls: 'today', text: 'Bugün temizlik günü!' };
    return { cls: 'info', text: `${DAYS_FULL[w.day]} günü` };
  }
  return w.day == null ? { cls: 'zero', text: 'Gün seçilmedi' } : { cls: 'info', text: DAYS_FULL[w.day] };
}

function weekCard(key, { inDialog = false } = {}) {
  const p = personOf(key);
  const w = weekData(key);
  const st = weekStatus(key);
  const now = currentWeek();
  const isNow = key === now;
  const editable = key >= now || inDialog;
  const doneTasks = PUTZ_TASKS.filter((t) => w.tasks?.[t.id]).length;
  const label = isNow ? 'Bu haftanın temizlikçisi' : key > now ? `${weeksBetween(now, key)} hafta sonra` : 'Geçmiş hafta';
  return `
    <div class="pn" data-person="${p}">
      <div class="pn-top">
        ${avatar(p, 'xl')}
        <div class="pn-who">
          <span class="pn-label">${esc(label)}</span>
          <h2>${esc(person(p).name)}</h2>
          <span class="pn-range">${esc(weekRange(key))}</span>
        </div>
        <span class="status ${st.cls}">${esc(st.text)}</span>
      </div>
      ${editable ? `
      <div class="pn-sec">
        <h4>${isNow ? 'Hangi gün temizleyeceksin?' : 'Temizlik günü'}</h4>
        <div class="days">
          ${DAYS_SHORT.map((d, i) => {
            const dk = addDays(key, i);
            const cls = [dk === todayISO() ? 'is-today' : '', dk < todayISO() ? 'is-past' : ''].join(' ');
            return `<button type="button" class="day ${cls}" data-day="${i}" data-wk="${key}" aria-pressed="${w.day === i}" aria-label="${DAYS_FULL[i]} ${esc(fmtDay(dk))}"><small>${d}</small><b>${new Date(utc(dk)).getUTCDate()}</b></button>`;
          }).join('')}
        </div>
      </div>
      <div class="pn-sec">
        <h4>Yapılacaklar <small>${doneTasks}/${PUTZ_TASKS.length}</small></h4>
        <div class="progress"><i style="width:${(doneTasks / PUTZ_TASKS.length) * 100}%"></i></div>
        <div class="tasks">
          ${PUTZ_TASKS.map((t, i) => `<button type="button" class="task" data-task="${t.id}" data-wk="${key}" aria-pressed="${!!w.tasks?.[t.id]}"><span class="task-box">${ICON.check}</span><span class="task-txt"><small>${i + 1}.</small> ${esc(t.label)}</span><span class="task-emoji">${t.emoji}</span></button>`).join('')}
        </div>
      </div>` : ''}
      <div class="pn-actions">
        ${key >= now && !w.done ? `<button type="button" class="btn ghost" data-swap="${key}">⇄ Takas et</button>` : '<span></span>'}
        <button type="button" class="btn ${w.done ? 'ghost' : 'primary'} pn-done" data-done="${key}">${w.done ? 'Geri al' : `${ICON.check}Temizledim`}</button>
      </div>
    </div>`;
}

function weekRow(key) {
  const p = personOf(key);
  const st = weekStatus(key);
  return `
    <li data-person="${p}">
      <button type="button" class="week-btn" data-open-week="${key}">
        ${avatar(p, 'sm')}
        <span class="wk-main"><b>${esc(person(p).name)}</b><small>${esc(weekRange(key))}</small></span>
        <span class="status ${st.cls}">${esc(st.text)}</span>
        <svg class="chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>
      </button>
    </li>`;
}

function renderPutz() {
  const now = currentWeek();
  const cur = personOf(now);
  const curW = weekData(now);

  // nav indicator
  const who = $('#navPutzWho');
  who.dataset.person = cur;
  who.textContent = person(cur).name[0];
  who.classList.toggle('alert', !curW.done && curW.day === todayIdx());
  who.title = `Bu hafta: ${person(cur).name}`;

  $('#putzWeekLabel').textContent = weekRange(now);
  $('#putzNow').innerHTML = weekCard(now);

  $('#putzNext').innerHTML = Array.from({ length: 6 }, (_, i) => weekRow(addDays(now, 7 * (i + 1)))).join('');

  const past = [];
  for (let k = addDays(now, -7); k >= PUTZ_FIRST_WEEK && past.length < 8; k = addDays(k, -7)) past.push(k);
  $('#putzPast').innerHTML = past.length
    ? past.map(weekRow).join('')
    : `<li class="muted-empty">Geçmiş haftalar burada görünecek. İlk hafta: ${esc(weekRange(PUTZ_FIRST_WEEK))}.</li>`;

  // score
  const count = Object.fromEntries(PIDS.map((p) => [p, 0]));
  const missed = { ...count };
  for (const [k, w] of Object.entries(state.putzWeeks)) if (w.done) count[personOf(k)]++;
  for (let k = addDays(now, -7); k >= PUTZ_FIRST_WEEK; k = addDays(k, -7)) if (!weekData(k).done) missed[personOf(k)]++;
  $('#putzScore').innerHTML = PEOPLE.map((p) => {
    let next = now;
    for (let i = 0; i < 60 && (personOf(next) !== p.id || weekData(next).done); i++) next = addDays(next, 7);
    const nextTxt = next === now ? 'Bu hafta sırada!' : `Sıradaki: ${weekRange(next)}`;
    return `
      <div class="score" data-person="${p.id}">
        ${avatar(p.id, 'sm')}
        <div class="score-main"><b>${esc(p.name)}</b><small>${esc(nextTxt)}</small></div>
        <div class="score-num"><strong>${count[p.id]}</strong><small>kez${missed[p.id] ? ` · ${missed[p.id]} kaçırdı` : ''}</small></div>
      </div>`;
  }).join('');

  // settings
  const c = putzCfg();
  const ordered = Array.from({ length: PIDS.length }, (_, i) => c.order[mod(c.order.indexOf(cur) + i, PIDS.length)]);
  $('#putzSettings').innerHTML = `
    <div class="field">
      <span>Bu hafta sıra kimde?</span>
      <div class="chips">${PEOPLE.map((p) => `
        <label class="chip" data-person="${p.id}"><input type="radio" name="putzWho" value="${p.id}" ${p.id === cur ? 'checked' : ''} />${avatar(p.id)}${esc(p.name)}</label>`).join('')}
      </div>
      <small class="field-hint">Değiştirince sıra bu haftadan itibaren buna göre devam eder.</small>
    </div>
    <div class="field">
      <span>Sıra</span>
      <div class="order-row">
        <div class="order">${ordered.map((p) => `${avatar(p, 'xs')}<b>${esc(person(p).name)}</b>`).join('<i>→</i>')}<i>→ …</i></div>
        <button type="button" class="btn ghost sm-btn" id="putzReverse">⇅ Yönü değiştir</button>
      </div>
    </div>`;

  if (openWeek && $('#weekDialog').open) renderWeekDialog();
}

let openWeek = null; // { key, mode: 'detail' | 'swap' }
function renderWeekDialog() {
  const { key, mode } = openWeek;
  const body = $('#weekDlgBody');
  if (mode === 'swap') {
    const now = currentWeek();
    const me = personOf(key);
    const options = Array.from({ length: 8 }, (_, i) => addDays(now, 7 * i))
      .filter((k) => k !== key && !weekData(k).done && personOf(k) !== me);
    $('#weekDlgTitle').textContent = 'Haftayı takas et';
    body.innerHTML = `
      <p class="swap-intro">${avatar(me, 'xs')} <b>${esc(person(me).name)}</b>, ${esc(weekRange(key))} haftasını kiminle değiştirsin?</p>
      <ul class="weeks swap-list">${options.map((k) => `
        <li data-person="${personOf(k)}"><button type="button" class="week-btn" data-swap-with="${k}">
          ${avatar(personOf(k), 'sm')}
          <span class="wk-main"><b>${esc(person(personOf(k)).name)}</b><small>${esc(weekRange(k))}${k === now ? ' · bu hafta' : ''}</small></span>
          <span class="status info">⇄ Takas</span>
        </button></li>`).join('') || '<li class="muted-empty">Takas edilebilecek hafta yok.</li>'}
      </ul>
      <small class="field-hint">Takas edilen haftalarda seçilmiş günler sıfırlanır.</small>`;
  } else {
    $('#weekDlgTitle').textContent = weekRange(key);
    body.innerHTML = weekCard(key, { inDialog: true });
  }
}
function openWeekDialog(key, mode = 'detail') {
  openWeek = { key, mode };
  renderWeekDialog();
  const d = $('#weekDialog');
  if (!d.open) d.showModal();
}

function savePutz(key, w, msg, undoW) {
  const clean = { ...w };
  if (clean.person && clean.person === rotationPerson(key)) delete clean.person;
  if (clean.tasks && !Object.keys(clean.tasks).length) delete clean.tasks;
  const val = Object.keys(clean).length ? clean : null;
  const undo = undoW === undefined ? undefined : () => save({ [`putzWeeks/${key}`]: Object.keys(undoW).length ? undoW : null }, 'Geri alındı');
  return save({ [`putzWeeks/${key}`]: val }, msg, undo);
}

// Swaps are stored as explicit people, so they're meaningless once the rotation changes.
function rotationChanges(cfg) {
  const now = currentWeek();
  const changes = { 'putzConfig/main': cfg };
  let dropped = 0;
  for (const [k, w] of Object.entries(state.putzWeeks)) {
    if (k < now || !w.person) continue;
    const c = { ...w }; delete c.person;
    if (k !== now) dropped++;
    changes[`putzWeeks/${k}`] = Object.keys(c).length ? c : null;
  }
  return { changes, dropped };
}

function setView(v, push = true) {
  $$('.viewnav [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === v)));
  $('#view-kasa').hidden = v !== 'kasa';
  $('#view-putz').hidden = v !== 'putz';
  $('#view-kasa').style.display = v === 'kasa' ? '' : 'none';
  $('#view-putz').style.display = v === 'putz' ? '' : 'none';
  if (push) {
    history.replaceState(null, '', v === 'putz' ? '#putz' : location.pathname + location.search);
    scrollTo({ top: 0, behavior: 'instant' });
  }
}

function bindPutzEvents() {
  $('.viewnav').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-view]');
    if (b) setView(b.dataset.view);
  });
  addEventListener('hashchange', () => setView(location.hash === '#putz' ? 'putz' : 'kasa', false));

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b || !b.closest('#view-putz, #weekDialog')) return;
    const key = b.dataset.wk || b.dataset.done || b.dataset.swap || b.dataset.openWeek;

    if (b.dataset.day != null) {
      const w = { ...weekData(key) };
      const day = Number(b.dataset.day);
      const p = person(personOf(key)).name;
      if (w.day === day) { delete w.day; savePutz(key, w, 'Gün seçimi kaldırıldı'); }
      else { w.day = day; savePutz(key, w, `${p} ${DAYS_FULL[day]} günü temizleyecek 🧽`); }
    } else if (b.dataset.task) {
      const old = weekData(key);
      const w = { ...old, tasks: { ...(old.tasks || {}) } };
      const t = PUTZ_TASKS.find((x) => x.id === b.dataset.task);
      if (w.tasks[t.id]) {
        delete w.tasks[t.id];
        if (w.done) { delete w.done; delete w.doneAt; }
        savePutz(key, w);
      } else {
        w.tasks[t.id] = true;
        if (PUTZ_TASKS.every((x) => w.tasks[x.id])) {
          w.done = true; w.doneAt = Date.now();
          savePutz(key, w, `Hepsi tamam! Teşekkürler ${person(personOf(key)).name} ✨`, old);
          sparkle(b);
        } else {
          savePutz(key, w, `✓ ${t.label}`);
        }
      }
    } else if (b.dataset.done) {
      const old = weekData(key);
      const w = { ...old };
      if (w.done) { delete w.done; delete w.doneAt; savePutz(key, w, 'İşaret kaldırıldı', old); }
      else {
        w.done = true; w.doneAt = Date.now();
        w.tasks = Object.fromEntries(PUTZ_TASKS.map((t) => [t.id, true]));
        savePutz(key, w, `Harika ${person(personOf(key)).name}! Ev pırıl pırıl ✨`, old);
        sparkle(b);
      }
    } else if (b.dataset.swap) {
      openWeekDialog(key, 'swap');
    } else if (b.dataset.openWeek) {
      openWeekDialog(key, 'detail');
    } else if (b.dataset.swapWith) {
      const a = openWeek.key, other = b.dataset.swapWith;
      const pa = personOf(a), pb = personOf(other);
      const wa = { ...weekData(a), person: pb }; delete wa.day;
      const wb = { ...weekData(other), person: pa }; delete wb.day;
      const clean = (k, w) => { const c = { ...w }; if (c.person === rotationPerson(k)) delete c.person; return Object.keys(c).length ? c : null; };
      const oldA = state.putzWeeks[a] || null, oldB = state.putzWeeks[other] || null;
      $('#weekDialog').close();
      save({ [`putzWeeks/${a}`]: clean(a, wa), [`putzWeeks/${other}`]: clean(other, wb) },
        `${person(pa).name} ⇄ ${person(pb).name} haftaları takas edildi`,
        () => save({ [`putzWeeks/${a}`]: oldA, [`putzWeeks/${other}`]: oldB }, 'Geri alındı'));
    } else if (b.id === 'putzReverse') {
      const c = putzCfg();
      const now = currentWeek();
      const order = [c.order[0], c.order[2], c.order[1]];
      const { changes, dropped } = rotationChanges({ order, anchorWeek: now, anchorIdx: order.indexOf(personOf(now)) });
      save(changes, `Sıranın yönü değiştirildi${dropped ? ' · takaslar sıfırlandı' : ''}`);
    }
  });

  document.addEventListener('change', (ev) => {
    if (ev.target.name !== 'putzWho') return;
    const p = ev.target.value;
    const now = currentWeek();
    const c = putzCfg();
    const { changes, dropped } = rotationChanges({ order: c.order, anchorWeek: now, anchorIdx: c.order.indexOf(p) });
    save(changes, `Bu hafta sıra ${person(p).loc}${dropped ? ' · takaslar sıfırlandı' : ''}`);
  });

  $('#weekDialog').addEventListener('close', () => { openWeek = null; });
}

function sparkle(el) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect();
  const emojis = ['✨', '🫧', '🧽', '⭐', '💫'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = emojis[i % emojis.length];
    const a = (Math.PI * 2 * i) / 14, d = 60 + Math.random() * 50;
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top + r.height / 2}px`;
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * d - 20}px`);
    document.body.append(s);
    setTimeout(() => s.remove(), 900);
  }
}

/* ───────── boot ───────── */
async function boot() {
  buildSkeleton();
  bindEvents();
  bindPutzEvents();
  setView(location.hash === '#putz' ? 'putz' : 'kasa', false);
  render();

  const onData = (data) => { state = normalize(data); render(); };
  if (CONFIG.firebase && CONFIG.firebase.databaseURL) {
    store = new FirebaseStore(CONFIG.firebase, CONFIG.path);
    try {
      await store.start(onData, setStatus);
      return;
    } catch (e) {
      console.error('Firebase başlatılamadı, yerel moda geçiliyor:', e);
      toast('Ortak veritabanına bağlanılamadı — yerel moddasın.');
    }
  }
  store = new LocalStore();
  await store.start(onData, setStatus);
}

boot();
