/* BORED? Core – Zustand, XP, Sound, UI-Helfer, Spiel-Registry, Spielrahmen.
   Spielmodule rufen BORED.registerGame({...}) auf. Siehe API.md. */
(function(){
'use strict';
const BORED = window.BORED = window.BORED || {};
const games = BORED.games = [];
const listeners = {};
BORED.on = (ev, fn) => (listeners[ev] = listeners[ev] || []).push(fn);
BORED.emit = (ev, data) => (listeners[ev] || []).forEach(fn => { try{ fn(data); }catch(e){ console.error(e); } });

/* ---------- Speicher ---------- */
const mem = {};
const store = BORED.store = {
  get(k, d){ try{ const v = localStorage.getItem('bored.' + k); return v === null ? (k in mem ? mem[k] : d) : JSON.parse(v); }catch(e){ return k in mem ? mem[k] : d; } },
  set(k, v){ mem[k] = v; try{ localStorage.setItem('bored.' + k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- Profil, XP, Level ---------- */
const today = () => new Date().toISOString().slice(0, 10);
const weekKey = () => { const d = new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() + '-W' + Math.ceil(((t - y) / 86400000 + 1) / 7); };
BORED.today = today; BORED.weekKey = weekKey;

const defProfile = { name: '', avatar: '😎', frame: 'none', xp: 0, created: Date.now(), favs: [], theme: 'neon' };
BORED.profile = Object.assign({}, defProfile, store.get('profile', {}));
BORED.saveProfile = () => store.set('profile', BORED.profile);

BORED.settings = Object.assign({ sound: true, music: false, anim: true, haptics: true, particles: true }, store.get('settings', {}));
BORED.saveSettings = () => { store.set('settings', BORED.settings); document.documentElement.classList.toggle('reduce-motion', !BORED.settings.anim); };

// Level n braucht 100 + (n-1)*60 XP
BORED.levelInfo = (xp = BORED.profile.xp) => {
  let lvl = 1, need = 100, rest = xp;
  while(rest >= need){ rest -= need; lvl++; need = 100 + (lvl - 1) * 60; }
  return { level: lvl, into: rest, need, pct: Math.round(rest / need * 100) };
};
const RANKS = [[1,'Rookie'],[5,'Zeitvertreiber'],[10,'Spieler'],[15,'Profi'],[20,'Veteran'],[30,'Meister'],[40,'Legende'],[60,'Langeweile-Killer']];
BORED.rank = (lvl = BORED.levelInfo().level) => RANKS.filter(r => lvl >= r[0]).pop()[1];

// Statistik
BORED.stats = Object.assign({ plays: 0, wins: 0, byGame: {}, days: {}, streak: 0, lastDay: '', history: [] }, store.get('stats', {}));
const saveStats = () => store.set('stats', BORED.stats);

function touchDay(){
  const d = today(), s = BORED.stats;
  if(s.lastDay === d) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.streak = s.lastDay === y ? s.streak + 1 : 1;
  s.lastDay = d; saveStats();
}

/* XP vergeben – mit Schutz gegen Farmen:
   - pro Spiel max. 250 XP pro Tag aus Spielen
   - ein Abschluss zählt nur, wenn seit Start/letztem Abschluss mind. 6 s vergangen sind
   - max. 1200 XP pro Tag gesamt */
const xpLog = store.get('xplog', {});
BORED.addXP = (amount, reason, source = 'misc') => {
  amount = Math.max(0, Math.round(amount));
  if(!amount) return 0;
  const d = today();
  if(xpLog.day !== d){ for(const k in xpLog) delete xpLog[k]; xpLog.day = d; xpLog.total = 0; xpLog.src = {}; }
  const srcCap = source.startsWith('game:') ? 250 : 600;
  const srcUsed = xpLog.src[source] || 0;
  amount = Math.min(amount, srcCap - srcUsed, 1200 - xpLog.total);
  if(amount <= 0){ return 0; }
  xpLog.src[source] = srcUsed + amount; xpLog.total += amount; store.set('xplog', xpLog);
  const before = BORED.levelInfo().level;
  BORED.profile.xp += amount; BORED.saveProfile();
  const dd = BORED.stats.days[d] = BORED.stats.days[d] || { xp: 0, plays: 0, wins: 0 };
  dd.xp += amount; saveStats();
  BORED.toast('+' + amount + ' XP' + (reason ? ' · ' + reason : ''), 'xp');
  const after = BORED.levelInfo().level;
  if(after > before){ BORED.sound('level'); setTimeout(() => BORED.toast('LEVEL ' + after + '! Rang: ' + BORED.rank(after), 'xp'), 600); BORED.emit('levelup', after); BORED.confetti(); }
  BORED.emit('xp', amount);
  return amount;
};
BORED.xpLeftToday = () => (xpLog.day === today() ? 1200 - xpLog.total : 1200);

/* ---------- Sound (WebAudio-Synth, keine Dateien) ---------- */
let actx;
const tones = {
  tap: [[660, .05, 'square', .05]], click: [[520, .04, 'triangle', .08]], pop: [[880, .06, 'sine', .12]],
  flip: [[440, .05, 'triangle', .08], [660, .05, 'triangle', .08, .05]],
  good: [[660, .08, 'sine', .12], [990, .12, 'sine', .12, .07]], bad: [[220, .18, 'sawtooth', .08], [160, .2, 'sawtooth', .08, .1]],
  tick: [[1200, .03, 'square', .04]], move: [[300, .05, 'triangle', .14]], capture: [[180, .08, 'square', .1], [120, .06, 'triangle', .12, .04]],
  win: [[523, .12, 'triangle', .12], [659, .12, 'triangle', .12, .12], [784, .12, 'triangle', .12, .24], [1046, .3, 'triangle', .12, .36]],
  lose: [[392, .18, 'sine', .1], [330, .18, 'sine', .1, .18], [262, .35, 'sine', .1, .36]],
  level: [[523, .1, 'square', .07], [784, .1, 'square', .07, .1], [1046, .1, 'square', .07, .2], [1568, .4, 'triangle', .09, .3]],
  check: [[880, .08, 'square', .07], [880, .08, 'square', .07, .12]]
};
BORED.sound = (name) => {
  if(!BORED.settings.sound) return;
  try{
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if(actx.state === 'suspended') actx.resume();
    (tones[name] || tones.tap).forEach(([f, dur, type, vol, delay = 0]) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + delay;
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + .02);
    });
  }catch(e){}
};
BORED.vibrate = (ms = 15) => { if(BORED.settings.haptics && navigator.vibrate) try{ navigator.vibrate(ms); }catch(e){} };

/* ---------- DOM-Helfer ---------- */
const esc = BORED.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* el('div', {class:'b-card', onclick:fn, text:'...'}, [children]) */
const el = BORED.el = (tag, attrs = {}, kids = []) => {
  const n = document.createElement(tag);
  for(const k in attrs){
    const v = attrs[k];
    if(v == null || v === false) continue;
    if(k === 'text') n.textContent = v;
    else if(k === 'html') n.innerHTML = v;
    else if(k === 'class') n.className = v;
    else if(k === 'style' && typeof v === 'object') Object.assign(n.style, v);
    else if(k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  (Array.isArray(kids) ? kids : [kids]).forEach(c => c != null && c !== false && n.append(c.nodeType ? c : document.createTextNode(c)));
  return n;
};
BORED.shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
BORED.pick = a => a[Math.floor(Math.random() * a.length)];
// Seeded RNG (für Tages-Inhalte, damit alle denselben Tag gleich sehen)
BORED.seeded = (seedStr) => { let h = 1779033703 ^ seedStr.length; for(let i = 0; i < seedStr.length; i++){ h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; };

BORED.toast = (text, kind = '') => {
  const box = document.getElementById('toasts'); if(!box) return;
  const t = el('div', { class: 'b-toast ' + kind, text });
  box.append(t); setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 2200);
};

/* Bottom-Sheet. content: Node oder Funktion(close)->Node. Gibt close() zurück. */
BORED.sheet = (content, opts = {}) => {
  const wrap = el('div', { class: 'b-sheet-wrap' });
  const sheet = el('div', { class: 'b-sheet', role: 'dialog', 'aria-modal': 'true' });
  const close = () => { wrap.remove(); opts.onClose && opts.onClose(); };
  wrap.addEventListener('click', e => { if(e.target === wrap && !opts.locked) close(); });
  sheet.append(typeof content === 'function' ? content(close) : content);
  wrap.append(sheet); document.body.append(wrap);
  return close;
};
/* Eingebauter Bestätigungsdialog (alert/confirm sind gesperrt) */
BORED.confirm = (text, okLabel = 'OK', cancelLabel = 'Abbrechen') => new Promise(resolve => {
  let done = false; const res = v => { if(!done){ done = true; resolve(v); } };
  BORED.sheet(close => el('div', { class: 'b-stack' }, [
    el('p', { class: 'b-h', text }),
    el('div', { class: 'b-grid2' }, [
      el('button', { class: 'b-btn ghost', text: cancelLabel, onclick: () => { close(); res(false); } }),
      el('button', { class: 'b-btn', text: okLabel, onclick: () => { close(); res(true); } })
    ])
  ]), { onClose: () => res(false) });
});

/* Konfetti */
BORED.confetti = () => {
  if(!BORED.settings.anim || !BORED.settings.particles) return;
  const c = el('canvas', { style: { position: 'fixed', inset: 0, zIndex: 120, pointerEvents: 'none', width: '100%', height: '100%' } });
  document.body.append(c); const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#A855F7', '#00E5FF', '#FF36B8', '#F5F5FF', '#3DF5A0'];
  const ps = Array.from({ length: 90 }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 3, r: Math.random() * 5 + 3, c: BORED.pick(cols), a: Math.random() * 6 }));
  let f = 0; (function loop(){ x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); }); if(++f < 110) requestAnimationFrame(loop); else c.remove(); })();
};

/* ---------- Plattform-Fähigkeiten (Echtzeit-Räume, KI) ---------- */
BORED.cap = name => (window.claude && window.claude.use) ? window.claude.use(name).catch(() => null) : Promise.resolve(null);

/* ---------- Spiel-Registry ---------- */
BORED.CATS = {
  reaktion: { name: 'Reaktion', icon: '⚡' }, denk: { name: 'Denken', icon: '🧠' }, party: { name: 'Party', icon: '🎉' },
  quiz: { name: 'Quiz', icon: '❓' }, kreativ: { name: 'Kreativ', icon: '🎨' }, geschick: { name: 'Geschick', icon: '🎯' },
  online: { name: 'Online', icon: '🌐' }
};
BORED.registerGame = def => {
  if(!def || !def.id || games.some(g => g.id === def.id)) return;
  games.push(Object.assign({ kind: 'game', cat: 'denk', icon: '🎮', players: '1', tags: [], rules: [] }, def));
  BORED.emit('registered', def.id);
};
BORED.getGame = id => games.find(g => g.id === id);
BORED.lobbies = [];
BORED.registerLobby = def => BORED.lobbies.push(def); // { id, name, mount(root, api) } – für den FRIENDS-Tab

/* Spielrahmen öffnen */
let current = null;
BORED.openGame = (id, params = {}) => {
  const g = BORED.getGame(id); if(!g) { BORED.toast('Spiel nicht gefunden'); return; }
  if(current) current.close(true);
  touchDay();
  const help = el('button', { class: 'b-icon-btn', 'aria-label': 'Anleitung', html: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></svg>' });
  const snd = el('button', { class: 'b-icon-btn', 'aria-label': 'Sound an/aus' });
  const setSnd = () => { snd.innerHTML = BORED.settings.sound ? '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'; };
  setSnd(); snd.onclick = () => { BORED.settings.sound = !BORED.settings.sound; BORED.saveSettings(); setSnd(); BORED.sound('click'); };
  const fav = el('button', { class: 'b-icon-btn', 'aria-label': 'Favorit' });
  const setFav = () => { const on = BORED.profile.favs.includes(id); fav.innerHTML = '<svg viewBox="0 0 24 24" style="' + (on ? 'fill:var(--pink);stroke:var(--pink)' : '') + '"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>'; };
  setFav(); fav.onclick = () => { const f = BORED.profile.favs; const i = f.indexOf(id); i >= 0 ? f.splice(i, 1) : f.push(id); BORED.saveProfile(); setFav(); BORED.sound('pop'); };
  const back = el('button', { class: 'b-icon-btn', 'aria-label': 'Zurück', html: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>' });
  const title = el('h2', { text: g.name });
  const body = el('div', { class: 'g-body' });
  const frame = el('div', { class: 'g-frame' }, [el('div', { class: 'g-bar' }, [back, title, fav, help, snd]), body]);
  document.body.append(frame);

  const exitFns = [];
  let startedAt = Date.now(), lastFinish = 0;
  const ns = 'g.' + id + '.';
  const api = {
    game: g, params, root: body,
    store: { get: (k, d) => store.get(ns + k, d), set: (k, v) => store.set(ns + k, v) },
    sound: BORED.sound, vibrate: BORED.vibrate, toast: BORED.toast, el, esc, shuffle: BORED.shuffle, pick: BORED.pick, seeded: BORED.seeded,
    sheet: BORED.sheet, confirm: BORED.confirm, confetti: BORED.confetti,
    profile: BORED.profile,
    setTitle: t => { title.textContent = t; },
    help: () => showRules(g),
    onExit: fn => exitFns.push(fn),
    exit: () => close(),
    room: () => BORED.cap('room'),
    ai: () => BORED.cap('sample'),
    best: (diff = 'std') => store.get(ns + 'best.' + diff, null),
    /* Highscore melden. Gibt {isBest, best} zurück. */
    reportScore: (value, diff = 'std') => {
      const key = ns + 'best.' + diff, old = store.get(key, null);
      const better = old == null || (g.lowerIsBetter ? value < old : value > old);
      if(better) store.set(key, value);
      return { isBest: better && old != null, first: old == null, best: better ? value : old };
    },
    /* Runde beenden: zählt Statistik, vergibt XP (mit Farmschutz), treibt Challenges an.
       result: { win: true|false|null, score?, difficulty?: 0..2, xp?: Zahl (Vorschlag, max 60) } */
    finish: (result = {}) => {
      const now = Date.now();
      const playedMs = now - Math.max(startedAt, lastFinish);
      lastFinish = now;
      const s = BORED.stats, d = today();
      s.plays++; if(result.win) s.wins++;
      const bg = s.byGame[id] = s.byGame[id] || { plays: 0, wins: 0, last: 0 };
      bg.plays++; if(result.win) bg.wins++; bg.last = now;
      const dd = s.days[d] = s.days[d] || { xp: 0, plays: 0, wins: 0 }; dd.plays++; if(result.win) dd.wins++;
      s.history.unshift({ id, t: now, win: result.win == null ? null : !!result.win, score: result.score == null ? null : result.score });
      s.history.length = Math.min(s.history.length, 60);
      saveStats();
      let xp = 0;
      if(playedMs >= 6000){
        const diff = result.difficulty || 0;
        const base = result.xp != null ? Math.min(60, result.xp) : (result.win === false ? 8 : result.win ? 20 : 12);
        xp = BORED.addXP(base * (1 + diff * 0.35), g.name, 'game:' + id);
      }
      BORED.emit('finish', { id, cat: g.cat, win: !!result.win, score: result.score, xp });
      if(result.win) BORED.confetti();
      return xp;
    }
  };
  function close(silent){
    exitFns.forEach(fn => { try{ fn(); }catch(e){} });
    if(typeof cleanup === 'function') try{ cleanup(); }catch(e){}
    frame.remove(); current = null;
    if(!silent) BORED.emit('closegame', id);
  }
  back.onclick = () => { BORED.sound('click'); close(); };
  help.onclick = () => showRules(g);
  current = { id, close };
  const recent = store.get('recent', []).filter(x => x !== id); recent.unshift(id); store.set('recent', recent.slice(0, 8));
  let cleanup;
  try{ cleanup = g.mount(body, api); }
  catch(e){ console.error(e); body.append(el('p', { class: 'b-hint', text: 'Dieses Spiel konnte nicht starten: ' + e.message })); }
  return api;
};
function showRules(g){
  const rules = Array.isArray(g.rules) ? g.rules : [g.rules];
  BORED.sheet(close => el('div', { class: 'b-stack' }, [
    el('div', { class: 'b-kicker', text: 'Anleitung' }),
    el('h3', { class: 'b-title', text: g.icon + ' ' + g.name }),
    el('p', { class: 'b-hint', text: g.desc || '' }),
    el('ol', { style: { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' } }, rules.filter(Boolean).map(r => el('li', { text: r }))),
    el('button', { class: 'b-btn block', text: 'Verstanden', onclick: close })
  ]));
}

/* ---------- Standard-Startbildschirm für Spiele ----------
   api-unabhängig nutzbar: BORED.ui.start(root, api, {levels:['Leicht','Mittel','Schwer'], modes:[{id,label}], extra:Node, onStart(level, mode)}) */
BORED.ui = {
  start(root, api, opt = {}){
    const g = api.game;
    root.innerHTML = '';
    const levels = opt.levels || ['Leicht', 'Mittel', 'Schwer'];
    let lvl = api.store.get('lastLevel', opt.defaultLevel || 0); if(lvl >= levels.length) lvl = 0;
    let mode = opt.modes ? api.store.get('lastMode', opt.modes[0].id) : null;
    if(opt.modes && !opt.modes.some(m => m.id === mode)) mode = opt.modes[0].id;
    const bg = BORED.stats.byGame[g.id] || { plays: 0, wins: 0 };
    const bestKey = opt.bestKey ? opt.bestKey(lvl, mode) : String(lvl);
    const best = api.best(bestKey);
    const lvChips = el('div', { class: 'b-chips', role: 'group', 'aria-label': 'Schwierigkeit' });
    const bestEl = el('b', { text: best == null ? '–' : (opt.formatScore ? opt.formatScore(best) : best) });
    const renderChips = () => {
      lvChips.innerHTML = '';
      levels.forEach((l, i) => lvChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(i === lvl), text: l, onclick: () => { lvl = i; api.store.set('lastLevel', i); api.sound('click'); renderChips(); const b = api.best(opt.bestKey ? opt.bestKey(lvl, mode) : String(lvl)); bestEl.textContent = b == null ? '–' : (opt.formatScore ? opt.formatScore(b) : b); } })));
    };
    renderChips();
    let modeChips = null;
    if(opt.modes){
      modeChips = el('div', { class: 'b-chips', role: 'group', 'aria-label': 'Modus' });
      const rm = () => { modeChips.innerHTML = ''; opt.modes.forEach(m => modeChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(m.id === mode), text: m.label, onclick: () => { mode = m.id; api.store.set('lastMode', m.id); api.sound('click'); rm(); } }))); };
      rm();
    }
    root.append(el('div', { class: 'b-stack' }, [
      el('div', { class: 'b-card glow b-rgb b-center', style: { padding: '26px 16px' } }, [
        el('div', { style: { fontSize: '64px', lineHeight: 1, filter: 'drop-shadow(0 0 18px rgba(168,85,247,.7))' }, text: g.icon }),
        el('h3', { class: 'b-title b-grad', text: g.name }),
        el('p', { class: 'b-hint', text: g.desc || '' })
      ]),
      opt.levels === null ? null : el('div', {}, [el('span', { class: 'b-label', text: 'Schwierigkeit' }), lvChips]),
      modeChips ? el('div', {}, [el('span', { class: 'b-label', text: 'Modus' }), modeChips]) : null,
      opt.extra || null,
      el('div', { class: 'b-grid3' }, [
        el('div', { class: 'b-stat' }, [el('small', { text: opt.bestLabel || 'Rekord' }), bestEl]),
        el('div', { class: 'b-stat' }, [el('small', { text: 'Gespielt' }), el('b', { text: bg.plays })]),
        (g.cat === 'party' || g.kind === 'tool')
          ? el('div', { class: 'b-stat' }, [el('small', { text: 'Heute' }), el('b', { text: (BORED.stats.history || []).filter(h => h.id === g.id && new Date(h.t).toISOString().slice(0, 10) === today()).length })])
          : el('div', { class: 'b-stat' }, [el('small', { text: 'Siege' }), el('b', { text: bg.wins })])
      ]),
      el('button', { class: 'b-btn block', style: { fontSize: '20px', minHeight: '56px' }, text: opt.startLabel || '▶ Spielen', onclick: () => { api.sound('good'); opt.onStart(lvl, mode); } }),
      el('button', { class: 'b-btn ghost block', text: 'Anleitung', onclick: () => api.help() })
    ]));
  },
  /* Ergebnis-Bildschirm: BORED.ui.result(root, api, {title, lines:[[label,value]], win, onAgain, onMenu}) */
  result(root, api, opt = {}){
    root.innerHTML = '';
    root.append(el('div', { class: 'b-stack b-pop' }, [
      el('div', { class: 'b-card glow b-rgb b-center', style: { padding: '28px 16px' } }, [
        el('div', { style: { fontSize: '58px', lineHeight: 1 }, text: opt.emoji || (opt.win ? '🏆' : opt.win === false ? '💀' : '⭐') }),
        el('h3', { class: 'b-title ' + (opt.win !== false ? 'b-grad' : ''), text: opt.title || (opt.win ? 'Gewonnen!' : opt.win === false ? 'Verloren' : 'Fertig!') }),
        opt.sub ? el('p', { class: 'b-hint', text: opt.sub }) : null
      ]),
      opt.lines && opt.lines.length ? el('div', { class: 'b-grid2' }, opt.lines.map(([k, v]) => el('div', { class: 'b-stat' }, [el('small', { text: k }), el('b', { text: v })]))) : null,
      el('button', { class: 'b-btn block', text: opt.againLabel || 'Nochmal', onclick: () => { api.sound('click'); opt.onAgain && opt.onAgain(); } }),
      opt.onMenu ? el('button', { class: 'b-btn ghost block', text: 'Zum Menü', onclick: () => { api.sound('click'); opt.onMenu(); } }) : null
    ]));
  }
};

document.documentElement.classList.toggle('reduce-motion', !BORED.settings.anim);
})();
