/* BORED? – Game Creator: eigene Mini-Spiele bauen, testen, spielen, teilen + Community-Bibliothek. */
(function(){
'use strict';
const B = window.BORED;
const el = B.el;

/* ---------- Konstanten ---------- */
const TYPES = {
  quiz:  { label: 'Quiz',                icon: '❓', hint: 'Fragen mit 4 Antworten – eine ist richtig.' },
  tf:    { label: 'Wahr oder Falsch',    icon: '⚖️', hint: 'Aussagen: stimmt das oder nicht?' },
  est:   { label: 'Schätzfragen',        icon: '🎯', hint: 'Zahl schätzen – mit Toleranz in %.' },
  cards: { label: 'Partykarten',         icon: '🃏', hint: 'Karten ziehen: Wer würde eher, Wahrheit oder Pflicht, Aufgaben.' },
  react: { label: 'Reaktions-Challenge', icon: '⚡', hint: 'Tippe, sobald die Zielfarbe erscheint.' },
  wheel: { label: 'Glücksrad',           icon: '🎡', hint: 'Felder mit Punkten oder Aufgaben – dreh am Rad.' }
};
const THEMES = { cyan: 'Cyan', violett: 'Violett', pink: 'Pink', gruen: 'Grün' };
const THEME_VAR = { cyan: '--cyan', violett: '--violet', pink: '--pink', gruen: '--good' };
const COLORS = { cyan: ['Cyan', '--cyan'], violett: ['Violett', '--violet'], pink: ['Pink', '--pink'], gruen: ['Grün', '--good'], gelb: ['Gelb', '--warn'], rot: ['Rot', '--bad'] };
const KINDS = { eher: 'Wer würde eher …', wahrheit: 'Wahrheit', pflicht: 'Pflicht', aufgabe: 'Aufgabe' };
const EMOJIS = ['🎮','❓','⚖️','🎯','🃏','⚡','🎡','🧠','🎉','🔥','💀','👾','🚀','🏆','⭐','🍕','⚽','🎵','🐱','🐉','🌍','🇦🇹','🤖','💎','🎲','🧪','🔌','😂'];
const REASONS = { unangemessen: 'Unangemessen', spam: 'Spam', beleidigung: 'Beleidigung', sonstiges: 'Sonstiges' };
const SCORED = { quiz: 1, tf: 1, est: 1, react: 1, wheel: 1 };
const MAX_PUB = 10, MAX_REPORTS = 30;

/* ---------- Prüf-Helfer ---------- */
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const isStr = (v, max, min = 0) => typeof v === 'string' && v.length <= max && v.trim().length >= min;
const isInt = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
const isNum = (v, a, b) => typeof v === 'number' && isFinite(v) && v >= a && v <= b;
const validSeg = s => typeof s === 'string' && s.length > 0 && s.length <= 200 && /^[A-Za-z0-9_\-.~:@+]+$/.test(s) && s !== '.' && s !== '..';
const validGid = s => typeof s === 'string' && /^[a-z0-9]{1,24}$/.test(s);
const uid = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).slice(0, 24);
const clone = o => JSON.parse(JSON.stringify(o));
const itemLabel = (t, i) => (t === 'cards' ? 'Karte ' : t === 'wheel' ? 'Feld ' : 'Frage ') + (i + 1);

function defCfg(t){
  if(t === 'react') return { ro: 5, mn: 1000, mx: 4000, co: 'gruen', fk: true };
  if(t === 'wheel') return { sp: 5 };
  return {};
}
function newGame(t){
  return { id: uid(), n: '', d: '', i: TYPES[t].icon, t, th: 'cyan',
    r: t === 'react' ? { tl: 0, pt: 100, sb: true, lv: 3 } : { tl: 20, pt: 100, sb: true, lv: 3 }, c: defCfg(t), it: [] };
}
function blankItem(t){
  return t === 'quiz' ? { q: '', a: ['', '', '', ''], c: 0 } : t === 'tf' ? { q: '', a: true } : t === 'est' ? { q: '', n: NaN, tol: 10, u: '' }
    : t === 'cards' ? { t: '', k: 'eher' } : { t: '', p: 10, a: '' };
}

function itemProblems(t, it, L){
  if(!isObj(it)) return [L + ': ungültiger Eintrag.'];
  const E = [];
  const q = () => { if(!isStr(it.q, 200, 1)) E.push(L + ': Text fehlt (max. 200 Zeichen).'); };
  if(t === 'quiz'){
    q();
    if(!Array.isArray(it.a) || it.a.length !== 4) E.push(L + ': braucht genau 4 Antworten.');
    else it.a.forEach((a, k) => { if(!isStr(a, 200, 1)) E.push(L + ': Antwort ' + 'ABCD'[k] + ' fehlt.'); });
    if(!isInt(it.c, 0, 3)) E.push(L + ': richtige Antwort markieren.');
  } else if(t === 'tf'){
    q(); if(typeof it.a !== 'boolean') E.push(L + ': Wahr oder Falsch wählen.');
  } else if(t === 'est'){
    q();
    if(!isNum(it.n, -1e12, 1e12)) E.push(L + ': richtige Zahl fehlt.');
    if(!isNum(it.tol, 0, 100)) E.push(L + ': Toleranz muss 0–100 % sein.');
    if(!isStr(it.u, 20)) E.push(L + ': Einheit max. 20 Zeichen.');
  } else if(t === 'cards'){
    if(!KINDS[it.k]) E.push(L + ': Kartenart wählen.');
    if(!isStr(it.t, 200, 1)) E.push(L + ': Text fehlt (max. 200 Zeichen).');
  } else if(t === 'wheel'){
    if(!isStr(it.t, 30, 1)) E.push(L + ': Feldname fehlt (max. 30 Zeichen).');
    if(!isInt(it.p, -1000, 1000)) E.push(L + ': Punkte als ganze Zahl von -1000 bis 1000.');
    if(!isStr(it.a, 200)) E.push(L + ': Aufgabe max. 200 Zeichen.');
  }
  return E;
}

/* Alle Probleme eines Spiels (auch für Import & Community – prüft Typen und Längen) */
function problems(g){
  const E = [];
  if(!isObj(g) || !TYPES[g.t]) return ['Unbekannter Spieltyp.'];
  if(!isStr(g.n, 40, 1)) E.push('Spielname fehlt oder ist länger als 40 Zeichen.');
  if(!isStr(g.d, 200)) E.push('Beschreibung: max. 200 Zeichen.');
  if(!EMOJIS.includes(g.i)) E.push('Bitte ein Icon aus der Auswahl wählen.');
  if(!THEMES[g.th]) E.push('Bitte ein Design wählen.');
  const r = isObj(g.r) ? g.r : {};
  if(!isInt(r.tl, 0, 120)) E.push('Zeitlimit: ganze Sekunden von 0 bis 120 (0 = aus).');
  if(!isInt(r.pt, 1, 1000)) E.push('Punkte pro richtiger Antwort: 1 bis 1000.');
  if(typeof r.sb !== 'boolean') E.push('Tempo-Bonus: an oder aus wählen.');
  if(!isInt(r.lv, 0, 10)) E.push('Leben: 0 bis 10 (0 = unbegrenzt).');
  const c = isObj(g.c) ? g.c : {};
  if(g.t === 'react'){
    if(!isInt(c.ro, 1, 20)) E.push('Runden: 1 bis 20.');
    if(!isInt(c.mn, 300, 15000)) E.push('Min-Wartezeit: 300 bis 15000 ms.');
    if(!isInt(c.mx, 300, 15000)) E.push('Max-Wartezeit: 300 bis 15000 ms.');
    else if(isInt(c.mn, 300, 15000) && c.mx < c.mn) E.push('Max-Wartezeit muss mindestens so groß wie die Min-Wartezeit sein.');
    if(!COLORS[c.co]) E.push('Zielfarbe wählen.');
    if(typeof c.fk !== 'boolean') E.push('Fake-Signale: an oder aus wählen.');
  }
  if(g.t === 'wheel' && !isInt(c.sp, 1, 20)) E.push('Drehungen: 1 bis 20.');
  if(!Array.isArray(g.it)) { E.push('Inhalte fehlen.'); return E; }
  if(g.it.length > 100) E.push('Maximal 100 Einträge.');
  if(g.t === 'react'){ if(g.it.length) E.push('Reaktions-Challenge hat keine Einträge.'); return E; }
  const min = g.t === 'cards' || g.t === 'wheel' ? 2 : 1;
  if(g.it.length < min) E.push(min === 1 ? 'Füge mindestens 1 Frage hinzu.' : 'Füge mindestens 2 ' + (g.t === 'wheel' ? 'Felder' : 'Karten') + ' hinzu.');
  if(g.t === 'wheel' && g.it.length > 12) E.push('Das Glücksrad hat maximal 12 Felder.');
  g.it.slice(0, 100).forEach((it, i) => E.push(...itemProblems(g.t, it, itemLabel(g.t, i))));
  return E;
}

/* Nur bekannte Felder übernehmen (für fremde Daten) */
function pickItem(t, o){
  if(!isObj(o)) return null;
  if(t === 'quiz') return { q: o.q, a: Array.isArray(o.a) ? o.a.slice(0, 5) : o.a, c: o.c };
  if(t === 'tf') return { q: o.q, a: o.a };
  if(t === 'est') return { q: o.q, n: o.n, tol: o.tol, u: o.u === undefined ? '' : o.u };
  if(t === 'cards') return { t: o.t, k: o.k };
  if(t === 'wheel') return { t: o.t, p: o.p, a: o.a === undefined ? '' : o.a };
  return null;
}
function pickGame(o){
  if(!isObj(o)) throw new Error('Kein gültiges Spiel.');
  if(!TYPES[o.t]) throw new Error('Unbekannter Spieltyp.');
  if(Array.isArray(o.it) && o.it.length > 100) throw new Error('Zu viele Einträge (max. 100).');
  const r = isObj(o.r) ? o.r : {}, c = isObj(o.c) ? o.c : {};
  return {
    n: o.n, d: o.d === undefined ? '' : o.d, i: o.i, t: o.t, th: o.th,
    r: { tl: r.tl, pt: r.pt, sb: r.sb, lv: r.lv },
    c: o.t === 'react' ? { ro: c.ro, mn: c.mn, mx: c.mx, co: c.co, fk: c.fk } : o.t === 'wheel' ? { sp: c.sp } : {},
    it: Array.isArray(o.it) ? o.it.map(x => pickItem(o.t, x)) : null
  };
}

/* ---------- Teilen-Code ---------- */
function toCode(g){
  const s = JSON.stringify({ v: 1, n: g.n, d: g.d, i: g.i, t: g.t, th: g.th, r: g.r, c: g.c, it: g.it });
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for(let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  return 'GC1.' + btoa(bin);
}
function fail(msg, list){ const e = new Error(msg); e.list = list || []; return e; }
function fromCode(code){
  let s = String(code == null ? '' : code).replace(/\s+/g, '');
  if(!s) throw fail('Bitte zuerst einen Code einfügen.');
  if(s.length > 120000) throw fail('Der Code ist zu lang.');
  if(s.startsWith('GC1.')) s = s.slice(4);
  if(!/^[A-Za-z0-9+/]+={0,2}$/.test(s)) throw fail('Das ist kein gültiger Spiel-Code.');
  let obj;
  try{
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    obj = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  }catch(e){ throw fail('Der Code ist beschädigt oder unvollständig.'); }
  if(!isObj(obj) || obj.v !== 1) throw fail('Unbekannte Code-Version.');
  let g;
  try{ g = pickGame(obj); }catch(e){ throw fail(e.message); }
  const p = problems(g);
  if(p.length) throw fail('Der Code enthält Fehler:', p);
  return g;
}
const hash = s => { let h = 5381; for(let i = 0; i < s.length; i++) h = (h * 33 ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };

/* ---------- Wörterfilter ---------- */
const BAD = ['fick','fotze','hurensohn','wichser','wixer','wixxer','arschloch','missgeburt','schlampe','nutte','schwuchtel','kanake','spast','hure',
  'fuck','motherfucker','shit','bitch','cunt','asshole','nigger','nigga','faggot','retard','whore','slut','bastard'];
function norm(s){
  return String(s).toLowerCase().replace(/[0]/g, 'o').replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/[4@]/g, 'a').replace(/[5$]/g, 's').replace(/7/g, 't')
    .replace(/ß/g, 'ss').replace(/[^a-zäöü\s]/g, '');
}
function hasBad(text){
  const toks = norm(text).split(/\s+/).filter(Boolean);
  return toks.some(tok => BAD.some(w => w.length >= 5 ? tok.includes(w) : tok === w || tok.startsWith(w)));
}
function badSpot(g){
  if(hasBad(g.n)) return 'Spielname';
  if(hasBad(g.d)) return 'Beschreibung';
  for(let i = 0; i < g.it.length; i++){
    const it = g.it[i];
    const texts = [it.q, it.t, it.u, typeof it.a === 'string' ? it.a : '', ...(Array.isArray(it.a) ? it.a : [])];
    if(texts.some(x => typeof x === 'string' && hasBad(x))) return itemLabel(g.t, i);
  }
  return null;
}

/* ---------- db-Adapter (Rückgabeformen defensiv lesen) ---------- */
function readDoc(snap){
  if(!snap || typeof snap !== 'object') return null;
  if(snap.exists === false) return null;
  let d = typeof snap.data === 'function' ? snap.data() : (snap.data !== undefined ? snap.data : snap);
  return isObj(d) ? d : null;
}
function readDocs(snap){
  if(!snap) return [];
  let arr = [];
  if(Array.isArray(snap)) arr = snap;
  else if(Array.isArray(snap.docs)) arr = snap.docs;
  else if(typeof snap.forEach === 'function'){ try{ snap.forEach(d => arr.push(d)); }catch(e){} }
  else if(isObj(snap)) arr = Object.keys(snap).map(k => ({ id: k, data: snap[k] }));
  const out = [];
  arr.forEach(d => {
    if(!d || typeof d !== 'object') return;
    const data = readDoc(d);
    const id = d.id != null ? String(d.id) : (d.ref && d.ref.id != null ? String(d.ref.id) : '');
    if(data && id) out.push({ id, data });
  });
  return out;
}

/* ---------- Vorlagen ---------- */
const TEMPLATES = [
  { n: 'Gaming-Quiz', d: 'Wie gut kennst du dich mit Games aus?', i: '🎮', t: 'quiz', th: 'violett', r: { tl: 15, pt: 100, sb: true, lv: 3 }, c: {}, it: [
    { q: 'Wie heißt der grüne, explodierende Gegner in Minecraft?', a: ['Creeper', 'Zombie', 'Enderman', 'Skelett'], c: 0 },
    { q: 'Welche Firma stellt die PlayStation her?', a: ['Nintendo', 'Microsoft', 'Sony', 'Sega'], c: 2 },
    { q: 'Wie heißt der Held in „The Legend of Zelda“?', a: ['Zelda', 'Link', 'Ganon', 'Epona'], c: 1 },
    { q: 'Welche Farbe hat Pac-Man?', a: ['Blau', 'Rot', 'Grün', 'Gelb'], c: 3 },
    { q: 'Wie viele Felder hat ein Schachbrett?', a: ['49', '64', '81', '100'], c: 1 },
    { q: 'Wie heißt Marios Bruder?', a: ['Wario', 'Toad', 'Luigi', 'Yoshi'], c: 2 }
  ] },
  { n: 'Österreich-Check', d: 'Wahr oder falsch? Teste dein Österreich-Wissen.', i: '🇦🇹', t: 'tf', th: 'pink', r: { tl: 10, pt: 50, sb: true, lv: 2 }, c: {}, it: [
    { q: 'Wien ist die Hauptstadt von Österreich.', a: true },
    { q: 'Österreich hat 10 Bundesländer.', a: false },
    { q: 'Der Großglockner ist der höchste Berg Österreichs.', a: true },
    { q: 'Österreich grenzt ans Meer.', a: false },
    { q: 'Mozart wurde in Salzburg geboren.', a: true },
    { q: 'Graz ist die Landeshauptstadt der Steiermark.', a: true },
    { q: 'Die Donau fließt durch Graz.', a: false }
  ] },
  { n: 'Party-Deck', d: 'Karten ziehen und loslegen – für eure nächste Runde.', i: '🎉', t: 'cards', th: 'gruen', r: { tl: 0, pt: 100, sb: false, lv: 0 }, c: {}, it: [
    { k: 'eher', t: 'Wer würde eher eine ganze Nacht durchzocken?' },
    { k: 'eher', t: 'Wer würde eher beim Kochen die Küche abfackeln?' },
    { k: 'eher', t: 'Wer würde eher berühmt werden?' },
    { k: 'eher', t: 'Wer würde eher im Unterricht einschlafen?' },
    { k: 'wahrheit', t: 'Was war dein peinlichster Moment in der Schule?' },
    { k: 'wahrheit', t: 'Welches Spiel hast du am längsten am Stück gespielt?' },
    { k: 'wahrheit', t: 'Wen aus dieser Runde nimmst du auf eine einsame Insel mit?' },
    { k: 'pflicht', t: 'Mach 10 Hampelmänner.' },
    { k: 'pflicht', t: 'Sprich bis zu deiner nächsten Karte wie ein Roboter.' },
    { k: 'pflicht', t: 'Imitiere eine Person aus der Runde – die anderen raten.' },
    { k: 'aufgabe', t: 'Die jüngste Person wählt das nächste Spiel.' },
    { k: 'aufgabe', t: 'Alle tauschen für eine Runde die Plätze.' }
  ] }
];

/* ---------- CSS ---------- */
function injectCSS(){
  if(document.getElementById('gc-style')) return;
  const css = `
.gc-th-cyan{--gc-a:var(--cyan)}.gc-th-violett{--gc-a:var(--violet)}.gc-th-pink{--gc-a:var(--pink)}.gc-th-gruen{--gc-a:var(--good)}
.gc-acc{color:var(--gc-a,var(--cyan))}
.gc-hero{border-color:var(--gc-a)!important;box-shadow:0 0 22px color-mix(in srgb,var(--gc-a) 30%,transparent)}
.gc-big{font-size:56px;line-height:1;filter:drop-shadow(0 0 16px color-mix(in srgb,var(--gc-a) 70%,transparent))}
.gc-name{font-family:var(--display);font-weight:800;font-size:22px;color:var(--gc-a);word-break:break-word;text-shadow:0 0 14px color-mix(in srgb,var(--gc-a) 50%,transparent)}
.gc-q .gc-qt{font-family:var(--head);font-weight:700;font-size:21px;line-height:1.25;margin-top:6px;word-break:break-word}
.gc-ans-grid{display:grid;gap:10px}
.gc-ans{display:flex;align-items:center;gap:12px;min-height:56px;padding:10px 14px;border-radius:14px;background:var(--glass-2);border:1px solid color-mix(in srgb,var(--gc-a) 45%,transparent);text-align:left;font-weight:600;font-size:16px;width:100%;word-break:break-word;transition:transform .12s,background .2s}
.gc-ans:active{transform:scale(.98)}
.gc-ans .gc-l{flex:0 0 30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--gc-a) 22%,transparent);color:var(--gc-a);font-family:var(--display);font-size:14px}
.gc-ans.ok{background:rgba(61,245,160,.18);border-color:var(--good)}
.gc-ans.no{background:rgba(255,84,112,.18);border-color:var(--bad)}
.gc-ans:disabled{cursor:default}
.gc-tf{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gc-tf .gc-ans{justify-content:center;font-family:var(--head);font-size:20px;min-height:76px;text-transform:uppercase;letter-spacing:.06em}
.gc-fb{font-family:var(--head);font-weight:700;font-size:18px;text-align:center;min-height:26px}
.gc-fb.ok{color:var(--good)}.gc-fb.no{color:var(--bad)}.gc-fb.mid{color:var(--warn)}
.gc-tbar>i{transition:width .1s linear;background:var(--gc-a);width:100%}
.gc-pad{min-height:300px;flex-direction:column;gap:8px;font-family:var(--display);font-size:26px;font-weight:800;transition:background .06s}
.gc-pad small{font-family:var(--body);font-size:14px;font-weight:600;color:inherit;opacity:.85}
.gc-pad.lit{color:var(--bg);border-color:transparent}
.gc-sws{display:flex;gap:10px;flex-wrap:wrap}
.gc-swb{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--mute);font-family:var(--head);font-weight:700}
.gc-sw{width:48px;height:48px;border-radius:14px;border:2px solid var(--line-2)}
.gc-sw[aria-pressed="true"]{border-color:var(--ink);box-shadow:0 0 0 3px rgba(255,255,255,.14),0 0 16px rgba(255,255,255,.35)}
.gc-emos{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:6px}
.gc-emo{height:44px;border-radius:12px;font-size:22px;background:var(--glass-2);border:1px solid var(--line-2)}
.gc-emo[aria-pressed="true"]{border-color:var(--cyan);box-shadow:var(--glow-c);background:rgba(0,229,255,.14)}
.gc-acts{display:grid;grid-template-columns:repeat(2,44px);gap:4px;flex:0 0 auto}
.gc-acts3{display:flex;gap:6px;flex:0 0 auto}
.gc-ib{width:44px;height:44px}
.gc-ib:disabled{opacity:.3;cursor:default}
.gc-idx{flex:0 0 22px;text-align:center;color:var(--mute);font-size:14px}
.gc-probs{border-color:var(--warn)!important}
.gc-probs ul{padding-left:18px;margin-top:6px;font-size:14px;display:flex;flex-direction:column;gap:3px;color:var(--ink)}
.gc-probs>b{color:var(--warn);font-family:var(--head);letter-spacing:.04em}
.gc-probs.ok{border-color:var(--good)!important}.gc-probs.ok>b{color:var(--good)}
.gc-err{color:var(--bad);font-size:14px}
.gc-err:empty{display:none}
.gc-code{font-family:var(--mono);font-size:12px;min-height:120px;word-break:break-all}
.gc-lbl{display:flex;justify-content:space-between;align-items:baseline}
.gc-lbl small{color:var(--mute);font-size:12px;font-family:var(--mono)}
.gc-wrap-wheel{position:relative;display:flex;justify-content:center;padding-top:6px}
.gc-wheel{width:min(78vw,300px);height:min(78vw,300px);touch-action:manipulation;border-radius:50%;box-shadow:0 0 30px color-mix(in srgb,var(--gc-a) 35%,transparent)}
.gc-ptr{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:24px solid var(--ink);filter:drop-shadow(0 0 6px var(--gc-a));z-index:2}
.gc-card{min-height:210px;display:flex;flex-direction:column;justify-content:center;gap:10px;text-align:center;border-color:var(--gc-a)!important}
.gc-card p{font-family:var(--head);font-size:24px;font-weight:700;line-height:1.25;word-break:break-word}
.gc-gi .ic{background:color-mix(in srgb,var(--gc-a) 28%,transparent)}
.gc-item .tx b,.gc-gi .tx b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gc-item .tx small{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.gc-types{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gc-type{display:flex;flex-direction:column;gap:4px;align-items:flex-start;min-height:110px}
.gc-type b{font-family:var(--head);font-size:17px}
.gc-type span:first-child{font-size:28px}
.gc-type small{color:var(--mute);font-size:12px;line-height:1.3}
.gc-mod{border-color:var(--warn)!important}
.gc-mini{font-size:13px;color:var(--mute)}
`;
  document.head.append(el('style', { id: 'gc-style', text: css }));
}

/* ---------- Modul ---------- */
B.registerGame({
  id: 'creator', name: 'Game Creator', icon: '🛠️', cat: 'kreativ', kind: 'tool',
  desc: 'Bau eigene Mini-Spiele – Quiz, Partykarten, Glücksrad & mehr – und teil sie mit Freunden.',
  rules: [
    'Tippe auf „+ Neues Spiel“ oder nutze eine Vorlage.',
    'Fülle Name, Icon, Design, Regeln und Inhalte aus – offene Punkte siehst du unten im Editor.',
    'Mit „Testen“ probierst du dein Spiel sofort aus, „Speichern“ legt es unter „Meine Spiele“ ab.',
    'Über ⋯ kannst du dein Spiel als Code teilen, duplizieren, löschen oder in der Community veröffentlichen.',
    'Codes von Freunden fügst du bei „Import“ ein.'
  ],
  players: '1-10',
  tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    injectCSS();

    /* Timer-Verwaltung (wird bei jedem Bildschirmwechsel geleert) */
    const T = {
      ids: new Set(), rafs: new Set(),
      set(fn, ms){ const id = setTimeout(() => { T.ids.delete(id); fn(); }, ms); T.ids.add(id); return id; },
      every(fn, ms){ const id = setInterval(fn, ms); T.ids.add(id); return id; },
      stop(id){ clearTimeout(id); clearInterval(id); T.ids.delete(id); },
      raf(fn){ const id = requestAnimationFrame(t => { T.rafs.delete(id); fn(t); }); T.rafs.add(id); return id; },
      clear(){ T.ids.forEach(id => { clearTimeout(id); clearInterval(id); }); T.ids.clear(); T.rafs.forEach(cancelAnimationFrame); T.rafs.clear(); }
    };
    let alive = true;

    const btn = (text, cls, onclick, extra) => el('button', Object.assign({ type: 'button', class: 'b-btn ' + (cls || ''), text, onclick }, extra || {}));
    const iconBtn = (txt, label, fn, disabled) => el('button', { type: 'button', class: 'b-icon-btn gc-ib', 'aria-label': label, title: label, text: txt, onclick: fn, disabled: !!disabled });
    const stat = (label, valNode) => el('div', { class: 'b-stat' }, [el('small', { text: label }), valNode]);
    const hint = text => el('p', { class: 'b-hint', text });
    const card = (kids, cls) => el('div', { class: 'b-card ' + (cls || '') }, kids);
    function chipGroup(opts, cur, onPick, aria){
      const box = el('div', { class: 'b-chips', role: 'group', 'aria-label': aria });
      const draw = () => { box.innerHTML = ''; opts.forEach(([v, l]) => box.append(el('button', { type: 'button', class: 'b-chip', 'aria-pressed': String(v === cur), text: l, onclick: () => { cur = v; api.sound('click'); draw(); onPick(v); } }))); };
      draw(); return box;
    }
    /* Bestätigung: wie api.confirm, aber robust (core-confirm löst bei OK aktuell false aus, weil onClose zuerst feuert) */
    const ask = (text, okLabel, cancelLabel) => new Promise(resolve => {
      let done = false; const res = v => { if(!done){ done = true; resolve(v); } };
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('p', { class: 'b-h', text }),
        el('div', { class: 'b-grid2' }, [
          btn(cancelLabel || 'Abbrechen', 'ghost', () => { res(false); close(); }),
          btn(okLabel || 'OK', '', () => { res(true); close(); })
        ])
      ]), { onClose: () => res(false) });
    });
    function view(node){ T.clear(); root.innerHTML = ''; root.append(node); root.scrollTop = 0; }
    const cssVar = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';

    /* ---------- Speicher ---------- */
    function loadGames(){
      const raw = api.store.get('games', []);
      if(!Array.isArray(raw)) return [];
      const out = [];
      raw.forEach(o => {
        try{
          if(!isObj(o) || !validGid(o.id)) return;
          const g = pickGame(o);
          if(problems(g).length) return;
          g.id = o.id; g.created = isNum(o.created, 0, 1e14) ? o.created : Date.now(); g.updated = isNum(o.updated, 0, 1e14) ? o.updated : g.created;
          out.push(g);
        }catch(e){}
      });
      return out;
    }
    const S = { games: loadGames(), tab: api.store.get('tab', 'mine'), screen: 'home' };
    if(!['mine', 'comm', 'imp'].includes(S.tab)) S.tab = 'mine';
    const saveGames = () => api.store.set('games', S.games);
    let plays = api.store.get('plays', {}); if(!isObj(plays)) plays = {};
    let reported = api.store.get('reported', []); if(!Array.isArray(reported)) reported = [];
    let myReports = api.store.get('myReports', []); if(!Array.isArray(myReports)) myReports = [];
    const hsKey = key => 'gc-' + key;
    const bumpPlays = key => { plays[key] = (plays[key] || 0) + 1; api.store.set('plays', plays); };
    const countText = g => g.t === 'react' ? g.c.ro + ' Runden' : g.t === 'wheel' ? g.it.length + ' Felder' : g.t === 'cards' ? g.it.length + ' Karten' : g.it.length + ' Fragen';

    /* ---------- Community-Zustand ---------- */
    const C = { state: 'wait', db: null, user: null, myId: null, isMod: false, docs: [], loaded: false, timedOut: false, error: null,
      hidden: [], hiddenLoaded: false, reportDocs: [], reportsLoaded: false, unsubs: [], timers: [], render: null,
      q: '', type: 'all', sort: 'neu', cache: new WeakMap() };
    const lastWrite = {}, writeQ = {};

    function listen(ref, onData, onErr){
      let done = false;
      const timer = setTimeout(() => { if(!done){ onErr({ code: 'timeout' }, true); refreshComm(); } }, 10000);
      C.timers.push(timer);
      const ok = snap => { if(!alive) return; if(!done){ done = true; clearTimeout(timer); } try{ onData(snap); }catch(e){ console.warn(e); } refreshComm(); };
      const err = e => { if(!alive) return; done = true; clearTimeout(timer); onErr(e || { code: 'unavailable' }, false); refreshComm(); };
      try{
        if(ref && typeof ref.onSnapshot === 'function'){ const u = ref.onSnapshot(ok, err); if(typeof u === 'function') C.unsubs.push(u); }
        else if(ref && typeof ref.get === 'function') Promise.resolve(ref.get()).then(ok, err);
        else err({ code: 'unavailable' });
      }catch(e){ err(e); }
    }
    async function detectMod(u){
      const yes = async f => { try{ return typeof u[f] === 'function' && (await u[f]()) === true; }catch(e){ return false; } };
      if(await yes('isOwner') || await yes('canEdit')) return true;
      try{
        if(typeof u.me === 'function'){
          const m = await u.me();
          if(isObj(m) && (m.isOwner === true || m.canEdit === true || ['owner', 'editor', 'admin'].includes(m.role))) return true;
        }
      }catch(e){}
      return typeof u.role === 'string' && ['owner', 'editor', 'admin'].includes(u.role);
    }
    async function initCommunity(){
      let db = null, user = null;
      try{ [db, user] = await Promise.all([B.cap('db'), B.cap('user')]); }catch(e){}
      if(!alive) return;
      if(!db || !user || typeof db.collection !== 'function' || typeof db.doc !== 'function'){ C.state = 'off'; onCommState(); return; }
      C.db = db; C.user = user;
      try{ const id = typeof user.id === 'function' ? await user.id() : null; C.myId = validSeg(id) ? id : null; }catch(e){ C.myId = null; }
      C.isMod = await detectMod(user);
      if(!alive) return;
      C.state = 'on';
      let q = null;
      try{ q = db.collection('community'); if(q && typeof q.limit === 'function') q = q.limit(500); }catch(e){ q = null; }
      listen(q, snap => { C.docs = readDocs(snap); C.loaded = true; C.timedOut = false; C.error = null; },
        (e, timeout) => { if(timeout) C.timedOut = true; else C.error = (e && e.code) || 'unavailable'; });
      let h = null;
      try{ h = db.doc('moderation/hidden'); }catch(e){}
      listen(h, snap => {
        const d = readDoc(snap);
        C.hidden = d && Array.isArray(d.ids) ? d.ids.filter(x => typeof x === 'string' && x.length <= 240).slice(-500) : [];
        C.hiddenLoaded = true;
      }, (e, timeout) => { if(!timeout) C.hiddenLoaded = false; });
      if(C.isMod){
        let rq = null;
        try{ rq = db.collection('reports'); if(rq && typeof rq.limit === 'function') rq = rq.limit(500); }catch(e){}
        listen(rq, snap => { C.reportDocs = readDocs(snap); C.reportsLoaded = true; C.reportsErr = false; }, (e, timeout) => { C.reportsErr = true; });
      }
      onCommState();
    }
    function onCommState(){
      if(S.screen === 'home' && S.tab === 'comm') home('comm');
      else if(S.screen === 'home' && S.tab === 'mine') home('mine');
    }
    function refreshComm(){ if(C.render) try{ C.render(); }catch(e){ console.warn(e); } }

    function parseShared(e){
      try{
        if(!isObj(e) || !validGid(e.id) || !isObj(e.data)) return null;
        const g = pickGame({ n: e.name, d: e.desc, i: e.icon, t: e.type, th: e.theme, r: e.data.r, c: e.data.c, it: e.data.it });
        if(problems(g).length) return null;
        g.id = e.id; g.created = isNum(e.created, 0, 1e14) ? e.created : 0;
        return g;
      }catch(x){ return null; }
    }
    function docGames(d){
      if(C.cache.has(d.data)) return C.cache.get(d.data);
      const arr = Array.isArray(d.data.games) ? d.data.games.slice(0, MAX_PUB) : [];
      const seen = {};
      const list = arr.map(parseShared).filter(g => g && !seen[g.id] && (seen[g.id] = 1));
      C.cache.set(d.data, list);
      return list;
    }
    function allComm(){
      const out = [];
      C.docs.forEach(d => { if(!validSeg(d.id)) return; docGames(d).forEach(g => out.push({ owner: d.id, key: d.id + ':' + g.id, g })); });
      return out;
    }
    const visibleComm = () => allComm().filter(x => !C.hidden.includes(x.key) && !reported.includes(x.key));
    function myRemote(){ const d = C.docs.find(x => x.id === C.myId); return d ? docGames(d) : []; }
    const isPublished = g => C.state === 'on' && C.loaded && !!C.myId && myRemote().some(x => x.id === g.id);
    const toEntry = (g, created) => ({ id: g.id, name: g.n, desc: g.d, icon: g.i, type: g.t, theme: g.th, data: { r: g.r, c: g.c, it: g.it }, author: C.myId, created, plays: 0 });

    function errMsg(e){
      const c = e && e.code;
      if(c === 'invalid_argument') return 'Keine Berechtigung zum Speichern in der Community.';
      if(c === 'quota_exceeded') return 'Der Community-Speicher ist voll.';
      if(c === 'resource_exhausted') return 'Zu viele Anfragen – warte kurz.';
      return 'Community gerade nicht erreichbar.';
    }
    /* Eine Schreiboperation pro Dokument gleichzeitig, nur bei Änderung */
    function writeDoc(path, data){
      const js = JSON.stringify(data);
      const run = async () => {
        if(lastWrite[path] === js) return;
        const go = () => Promise.resolve(C.db.doc(path).set(data));
        try{ await go(); }
        catch(e){
          if(e && e.code === 'unavailable'){ await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); await go(); }
          else throw e;
        }
        lastWrite[path] = js;
      };
      const p = (writeQ[path] || Promise.resolve()).catch(() => {}).then(run);
      writeQ[path] = p;
      return p;
    }
    function commReady(){
      if(C.state !== 'on'){ api.toast('Community ist nur in der geteilten App verfügbar.'); return false; }
      if(!C.myId){ api.toast('Ohne Anmeldung kannst du nichts veröffentlichen oder melden.'); return false; }
      if(!C.loaded){ api.toast(C.timedOut || C.error ? 'Community gerade nicht erreichbar.' : 'Community lädt noch …'); return false; }
      return true;
    }
    async function writeMine(list, okMsg){
      const body = { games: list };
      if(JSON.stringify(body).length > 200000){ api.toast('Zu groß für die Community (max. ~200 KB). Kürze deine Spiele.'); return false; }
      const cur = myRemote().map(g => JSON.stringify(toEntry(g, g.created)));
      if(cur.length === list.length && list.every((e, i) => JSON.stringify(e) === cur[i])){ api.toast('Schon aktuell.'); return true; }
      try{ await writeDoc('community/' + C.myId, body); api.sound('check'); api.toast(okMsg); return true; }
      catch(e){ api.toast(errMsg(e)); return false; }
    }
    async function publish(g){
      if(!commReady()) return;
      const p = problems(g);
      if(p.length){ api.toast('Spiel hat noch Fehler – öffne den Editor.'); return; }
      const spot = badSpot(g);
      if(spot){ api.sound('bad'); api.toast('Bitte ändere „' + spot + '“ – dort steht ein Schimpfwort.'); return; }
      const mine = myRemote();
      const idx = mine.findIndex(x => x.id === g.id);
      if(idx < 0 && mine.length >= MAX_PUB){ api.toast('Du kannst max. ' + MAX_PUB + ' Spiele veröffentlichen. Entferne zuerst eins.'); return; }
      const list = mine.map(x => toEntry(x, x.created));
      const entry = toEntry(g, idx >= 0 ? mine[idx].created || Date.now() : Date.now());
      if(idx >= 0) list[idx] = entry; else list.push(entry);
      await writeMine(list, idx >= 0 ? 'In der Community aktualisiert.' : 'Veröffentlicht! 🎉');
      refreshComm();
    }
    async function unpublish(gid){
      if(!commReady()) return;
      const mine = myRemote();
      if(!mine.some(x => x.id === gid)){ api.toast('Nicht veröffentlicht.'); return; }
      await writeMine(mine.filter(x => x.id !== gid).map(x => toEntry(x, x.created)), 'Aus der Community entfernt.');
      refreshComm();
    }
    async function sendReport(entry, reason){
      if(!commReady()) return;
      if(!reported.includes(entry.key)){ reported.push(entry.key); reported = reported.slice(-300); api.store.set('reported', reported); }
      myReports.push({ gameOwner: entry.owner, gameId: entry.g.id, reason, t: Date.now() });
      const own = C.reportDocs.find(d => d.id === C.myId);
      if(own && Array.isArray(own.data.items)) own.data.items.forEach(it => { if(validReport(it) && !myReports.some(m => m.gameOwner === it.gameOwner && m.gameId === it.gameId && m.t === it.t)) myReports.push({ gameOwner: it.gameOwner, gameId: it.gameId, reason: it.reason, t: it.t }); });
      myReports.sort((a, b) => a.t - b.t);
      myReports = myReports.slice(-MAX_REPORTS);
      api.store.set('myReports', myReports);
      refreshComm();
      try{ await writeDoc('reports/' + C.myId, { items: myReports }); api.toast('Danke! Das Spiel wurde gemeldet und ist für dich ausgeblendet.'); }
      catch(e){ api.toast('Für dich ausgeblendet. Meldung konnte nicht gesendet werden: ' + errMsg(e)); }
    }
    const validReport = it => isObj(it) && validSeg(it.gameOwner) && validGid(it.gameId) && REASONS[it.reason] && isNum(it.t, 0, 1e14);
    async function setHidden(key, on){
      if(!C.hiddenLoaded){ api.toast('Die Ausblende-Liste lädt noch.'); return; }
      let ids = C.hidden.slice();
      if(on && !ids.includes(key)) ids.push(key);
      if(!on) ids = ids.filter(x => x !== key);
      ids = ids.slice(-500);
      try{ await writeDoc('moderation/hidden', { ids }); C.hidden = ids; api.toast(on ? 'Spiel ausgeblendet.' : 'Spiel wieder eingeblendet.'); }
      catch(e){ api.toast(errMsg(e)); }
      refreshComm();
    }

    /* ---------- Startseite ---------- */
    function home(tab){
      S.screen = 'home'; C.render = null;
      if(tab) S.tab = tab;
      api.store.set('tab', S.tab);
      api.setTitle('Game Creator');
      const box = el('div', { class: 'b-stack' });
      const tabs = chipGroup([['mine', 'Meine Spiele'], ['comm', 'Community'], ['imp', 'Import']], S.tab, v => home(v), 'Bereich');
      view(el('div', { class: 'b-stack' }, [tabs, box]));
      if(S.tab === 'mine') mineTab(box); else if(S.tab === 'comm') commTab(box); else importTab(box);
    }

    function tplList(){
      return el('div', { class: 'b-list' }, TEMPLATES.map(t => el('div', { class: 'b-item gc-gi gc-th-' + t.th }, [
        el('div', { class: 'ic', text: t.i }),
        el('div', { class: 'tx' }, [el('b', { text: t.n }), el('small', { text: TYPES[t.t].label + ' · ' + countText(t) })]),
        btn('Nutzen', 'sm', () => { api.sound('pop'); const g = clone(t); g.id = uid(); editor(g, { isNew: true }); })
      ])));
    }
    function tplSheet(){
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: 'Vorlagen' }),
        el('h3', { class: 'b-title', text: 'Vorlage nutzen' }),
        hint('Fertige Spiele zum Ausprobieren und Anpassen.'),
        (() => { const l = tplList(); l.addEventListener('click', e => { if(e.target.closest('button')) close(); }); return l; })(),
        btn('Schließen', 'ghost block', close)
      ]));
    }
    function newSheet(){
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: 'Neues Spiel' }),
        el('h3', { class: 'b-title', text: 'Welcher Spieltyp?' }),
        el('div', { class: 'gc-types' }, Object.keys(TYPES).map(t => el('button', { type: 'button', class: 'b-card tap gc-type', onclick: () => { api.sound('pop'); close(); editor(newGame(t), { isNew: true }); } }, [
          el('span', { text: TYPES[t].icon }), el('b', { text: TYPES[t].label }), el('small', { text: TYPES[t].hint })
        ]))),
        btn('Abbrechen', 'ghost block', close)
      ]));
    }

    function mineTab(box){
      box.append(el('div', { class: 'b-grid2' }, [btn('+ Neues Spiel', '', newSheet), btn('Vorlage nutzen', 'ghost', tplSheet)]));
      if(!S.games.length){
        box.append(card([
          el('div', { class: 'b-kicker', text: 'Los geht’s' }),
          el('h3', { class: 'b-h', text: 'Noch keine eigenen Spiele' }),
          hint('Starte mit einer Vorlage und pass sie an – oder bau dein Spiel von null.')
        ], 'glow b-stack tight'));
        box.append(tplList());
        return;
      }
      box.append(el('div', { class: 'b-between' }, [el('span', { class: 'b-label', text: 'Meine Spiele (' + S.games.length + ')' })]));
      box.append(el('div', { class: 'b-list' }, S.games.map(g => {
        const best = SCORED[g.t] ? api.best(hsKey(g.id)) : null;
        const pub = isPublished(g);
        return el('div', { class: 'b-item gc-gi gc-th-' + g.th }, [
          el('div', { class: 'ic', text: g.i }),
          el('div', { class: 'tx' }, [
            el('b', { text: g.n }),
            el('small', { text: TYPES[g.t].label + ' · ' + countText(g) + (best != null ? ' · Rekord ' + best : '') + (pub ? ' · online' : '') })
          ]),
          el('div', { class: 'gc-acts3' }, [
            iconBtn('▶', 'Spielen', () => { api.sound('click'); player(g, { key: g.id, back: () => home('mine') }); }),
            iconBtn('✎', 'Bearbeiten', () => { api.sound('click'); editor(clone(g), { isNew: false }); }),
            iconBtn('⋯', 'Mehr', () => moreSheet(g))
          ])
        ]);
      })));
    }

    function moreSheet(g){
      const pub = isPublished(g);
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: TYPES[g.t].label }),
        el('h3', { class: 'b-title', text: g.i + ' ' + g.n }),
        btn('🔗 Als Code teilen', 'block', () => { close(); shareSheet(g); }),
        btn('⧉ Duplizieren', 'ghost block', () => {
          const c = clone(g); c.id = uid(); c.n = (g.n + ' (Kopie)').slice(0, 40); c.created = c.updated = Date.now();
          S.games.unshift(c); saveGames(); close(); api.sound('pop'); api.toast('Kopie erstellt.'); home('mine');
        }),
        C.state === 'on'
          ? btn(pub ? '☁ Community-Version aktualisieren' : '☁ In Community veröffentlichen', 'cyan block', () => { close(); publish(g).then(() => { if(S.screen === 'home') home(S.tab); }); })
          : hint(C.state === 'wait' ? 'Community wird verbunden …' : 'Community ist nur in der geteilten App verfügbar.'),
        pub ? btn('Aus Community entfernen', 'ghost block', () => { close(); unpublish(g.id).then(() => { if(S.screen === 'home') home(S.tab); }); }) : null,
        btn('🗑 Löschen', 'danger block', async () => {
          close();
          const ok = await ask('„' + g.n + '“ wirklich löschen?' + (pub ? ' Es wird auch aus der Community entfernt.' : ''), 'Löschen', 'Abbrechen');
          if(!ok || !alive) return;
          S.games = S.games.filter(x => x.id !== g.id); saveGames();
          if(pub) await unpublish(g.id);
          api.toast('Gelöscht.'); if(S.screen === 'home') home('mine');
        }),
        btn('Schließen', 'ghost block', close)
      ]));
    }

    function copyText(text, ta){
      const fallback = () => { try{ ta.focus(); ta.select(); }catch(e){} api.toast('Kopieren nicht möglich – der Code ist markiert, kopier ihn selbst.'); };
      try{
        if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function')
          navigator.clipboard.writeText(text).then(() => { api.sound('check'); api.toast('Code kopiert!'); }, fallback);
        else fallback();
      }catch(e){ fallback(); }
    }
    function shareSheet(g){
      let code;
      try{ code = toCode(g); }catch(e){ api.toast('Code konnte nicht erstellt werden.'); return; }
      api.sheet(close => {
        const ta = el('textarea', { class: 'b-input gc-code', readonly: true, 'aria-label': 'Spiel-Code', text: code });
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Teilen' }),
          el('h3', { class: 'b-title', text: g.i + ' ' + g.n }),
          hint('Schick den Code an Freunde. Sie fügen ihn im Game Creator bei „Import“ ein.'),
          ta,
          el('small', { class: 'b-hint', text: code.length + ' Zeichen' }),
          btn('📋 Code kopieren', 'block', () => copyText(code, ta)),
          btn('Schließen', 'ghost block', close)
        ]);
      });
    }

    function importTab(box){
      const ta = el('textarea', { class: 'b-input gc-code', placeholder: 'Code hier einfügen (beginnt mit GC1.)', 'aria-label': 'Spiel-Code einfügen' });
      const out = el('div', { class: 'b-stack' });
      const check = () => {
        out.innerHTML = '';
        let g;
        try{ g = fromCode(ta.value); }
        catch(e){
          api.sound('bad');
          out.append(card([el('b', { class: 'gc-err', text: e.message }), e.list && e.list.length ? el('ul', { style: { paddingLeft: '18px', marginTop: '6px', fontSize: '14px' } }, e.list.slice(0, 8).map(x => el('li', { text: x }))) : null], 'gc-probs'));
          return;
        }
        api.sound('good');
        const key = 'imp-' + hash(toCode(g));
        out.append(card([
          el('div', { class: 'b-row' }, [el('div', { class: 'gc-big', style: { fontSize: '40px' }, text: g.i }), el('div', { class: 'grow' }, [el('div', { class: 'gc-name', text: g.n }), el('span', { class: 'b-pill', text: TYPES[g.t].label })])]),
          g.d ? hint(g.d) : null,
          el('small', { class: 'b-hint', text: countText(g) }),
          el('div', { class: 'b-grid2' }, [
            btn('▶ Spielen', 'ghost', () => player(g, { key, back: () => home('imp') })),
            btn('Speichern', '', () => { const c = clone(g); c.id = uid(); c.created = c.updated = Date.now(); S.games.unshift(c); saveGames(); api.toast('In „Meine Spiele“ gespeichert.'); home('mine'); })
          ])
        ], 'glow b-stack tight gc-hero gc-th-' + g.th));
      };
      box.append(card([
        el('div', { class: 'b-kicker', text: 'Code-Import' }),
        hint('Füge einen Spiel-Code ein, den du bekommen hast. Er wird vorher genau geprüft.'),
        ta,
        btn('Code prüfen', 'block', check)
      ], 'b-stack tight'), out);
    }

    /* ---------- Community-Tab ---------- */
    function commTab(box){
      if(C.state === 'wait'){ box.append(card([el('b', { text: 'Verbinde mit der Community …' }), hint('Einen Moment.')], 'b-stack tight')); return; }
      if(C.state === 'off'){
        box.append(card([
          el('div', { class: 'b-kicker', text: 'Community' }),
          el('h3', { class: 'b-h', text: 'Community ist nur in der geteilten App verfügbar' }),
          hint('Öffne BORED? über den geteilten App-Link, um Spiele von anderen zu spielen und deine eigenen zu veröffentlichen. Eigene Spiele und Teilen per Code funktionieren trotzdem.')
        ], 'glow b-stack tight'));
        return;
      }
      const search = el('input', { class: 'b-input', type: 'search', placeholder: 'Spiele suchen …', 'aria-label': 'Community durchsuchen', value: C.q, maxlength: 40 });
      search.addEventListener('input', () => { C.q = search.value; drawList(); });
      const typeChips = chipGroup([['all', 'Alle']].concat(Object.keys(TYPES).map(t => [t, TYPES[t].label])), C.type, v => { C.type = v; drawList(); }, 'Spieltyp');
      const sortChips = chipGroup([['neu', 'Neu'], ['beliebt', 'Beliebt (lokal)']], C.sort, v => { C.sort = v; drawList(); }, 'Sortierung');
      const info = el('p', { class: 'gc-mini' });
      const list = el('div', { class: 'b-list' });
      const mod = el('div', { class: 'b-stack' });
      box.append(search, typeChips, sortChips, info, list, mod);

      function drawList(){
        list.innerHTML = '';
        info.textContent = C.myId ? 'Deine Veröffentlichungen: ' + (C.loaded ? myRemote().length : '–') + ' / ' + MAX_PUB + ' · veröffentlichen über ⋯ bei „Meine Spiele“.' : 'Du bist nicht angemeldet – du kannst nur spielen.';
        if(!C.loaded){
          list.append(card([hint(C.error ? 'Die Community ist gerade nicht erreichbar.' : C.timedOut ? 'Die Community antwortet gerade nicht. Schau später noch einmal vorbei.' : 'Lade Community-Spiele …')]));
          return;
        }
        if(C.timedOut) list.append(hint('Hinweis: Daten sind evtl. nicht aktuell.'));
        let arr = visibleComm();
        const total = arr.length;
        const q = C.q.trim().toLowerCase();
        if(q) arr = arr.filter(x => (x.g.n + ' ' + x.g.d).toLowerCase().includes(q));
        if(C.type !== 'all') arr = arr.filter(x => x.g.t === C.type);
        arr.sort(C.sort === 'beliebt'
          ? (a, b) => (plays['c:' + b.key] || 0) - (plays['c:' + a.key] || 0) || b.g.created - a.g.created
          : (a, b) => b.g.created - a.g.created);
        if(!arr.length){
          list.append(card([hint(total ? 'Nichts gefunden. Probier eine andere Suche oder einen anderen Filter.' : 'Noch keine Spiele in der Community. Sei die erste Person: „Meine Spiele“ → ⋯ → In Community veröffentlichen.')]));
          return;
        }
        const nameSpans = [];
        arr.slice(0, 200).forEach(x => {
          const who = el('span', { text: x.owner === C.myId ? 'von dir' : 'Community' });
          if(x.owner !== C.myId) nameSpans.push([x.owner, who]);
          list.append(el('button', { type: 'button', class: 'b-item gc-gi gc-th-' + x.g.th, onclick: () => commSheet(x) }, [
            el('div', { class: 'ic', text: x.g.i }),
            el('div', { class: 'tx' }, [
              el('b', { text: x.g.n }),
              el('small', {}, [TYPES[x.g.t].label + ' · ' + countText(x.g) + ' · lokal gespielt: ' + (plays['c:' + x.key] || 0) + ' · ', who])
            ]),
            el('span', { class: 'b-pill cyan', text: '▶' })
          ]));
        });
        resolveNames(nameSpans);
      }
      function drawMod(){
        mod.innerHTML = '';
        if(!C.isMod) return;
        const all = allComm(), byKey = {};
        all.forEach(x => { byKey[x.key] = x; });
        const agg = {};
        C.reportDocs.forEach(d => {
          const items = Array.isArray(d.data.items) ? d.data.items.slice(-MAX_REPORTS) : [];
          items.forEach(it => {
            if(!validReport(it)) return;
            const k = it.gameOwner + ':' + it.gameId;
            const a = agg[k] = agg[k] || { key: k, n: 0, reasons: {}, last: 0 };
            a.n++; a.reasons[it.reason] = (a.reasons[it.reason] || 0) + 1; a.last = Math.max(a.last, it.t);
          });
        });
        const rows = Object.values(agg).sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 40);
        const extraHidden = C.hidden.filter(k => !agg[k]).slice(-40);
        const line = (k, sub) => {
          const x = byKey[k], hid = C.hidden.includes(k);
          return el('div', { class: 'b-item' }, [
            el('div', { class: 'ic', text: x ? x.g.i : '❔' }),
            el('div', { class: 'tx' }, [el('b', { text: x ? x.g.n : 'Spiel nicht (mehr) vorhanden' }), el('small', { text: sub })]),
            btn(hid ? 'Einblenden' : 'Spiel ausblenden', 'sm ' + (hid ? 'ghost' : 'danger'), () => setHidden(k, !hid))
          ]);
        };
        mod.append(card([
          el('div', { class: 'b-kicker', text: 'Moderation (nur für dich sichtbar)' }),
          !C.reportsLoaded ? hint(C.reportsErr ? 'Meldungen gerade nicht erreichbar.' : 'Meldungen laden …') : rows.length ? null : hint('Keine Meldungen.'),
          rows.length ? el('div', { class: 'b-list' }, rows.map(a => line(a.key, a.n + '× gemeldet: ' + Object.keys(a.reasons).map(r => REASONS[r] + ' ' + a.reasons[r]).join(', ') + (C.hidden.includes(a.key) ? ' · ausgeblendet' : '')))) : null,
          extraHidden.length ? el('span', { class: 'b-label', text: 'Ausgeblendet' }) : null,
          extraHidden.length ? el('div', { class: 'b-list' }, extraHidden.map(k => line(k, 'ausgeblendet'))) : null
        ], 'b-stack tight gc-mod'));
      }
      C.render = () => { if(!list.isConnected){ C.render = null; return; } drawList(); drawMod(); };
      drawList(); drawMod();
    }
    function resolveNames(pairs){
      const u = C.user;
      if(!pairs.length || !u || typeof u.profiles !== 'function') return;
      const ids = [...new Set(pairs.map(p => p[0]))];
      Promise.resolve().then(() => u.profiles(ids)).then(ps => {
        if(!isObj(ps)) return;
        pairs.forEach(([id, span]) => { const p = ps[id]; if(p && typeof p.name === 'string' && p.name) span.textContent = 'von ' + p.name.slice(0, 40); });
      }).catch(() => {});
    }
    function commSheet(x){
      const g = x.g, mine = x.owner === C.myId;
      api.sheet(close => {
        const who = el('span', { text: mine ? 'von dir' : 'aus der Community' });
        if(!mine) resolveNames([[x.owner, who]]);
        return el('div', { class: 'b-stack gc-th-' + g.th }, [
          el('div', { class: 'b-row' }, [el('div', { class: 'gc-big', style: { fontSize: '44px' }, text: g.i }), el('div', { class: 'grow' }, [el('div', { class: 'gc-name', text: g.n }), el('small', { class: 'b-hint' }, [TYPES[g.t].label + ' · ' + countText(g) + ' · ', who])])]),
          g.d ? hint(g.d) : null,
          el('small', { class: 'gc-mini', text: 'Lokal gespielt: ' + (plays['c:' + x.key] || 0) + '× · Inhalte stammen von anderen Nutzer:innen.' }),
          btn('▶ Spielen', 'block', () => { close(); player(g, { key: 'c:' + x.key, back: () => home('comm') }); }),
          btn('In Meine Spiele kopieren', 'ghost block', () => { const c = clone(g); c.id = uid(); c.created = c.updated = Date.now(); S.games.unshift(c); saveGames(); close(); api.toast('Kopie unter „Meine Spiele“ gespeichert.'); }),
          mine ? btn('Aus Community entfernen', 'ghost block', () => { close(); unpublish(g.id); })
               : btn('🚩 Melden', 'ghost block', () => { close(); reportSheet(x); }),
          C.isMod ? btn('Spiel ausblenden (Moderation)', 'danger block', () => { close(); setHidden(x.key, true); }) : null,
          btn('Schließen', 'ghost block', close)
        ]);
      });
    }
    function reportSheet(x){
      let reason = null;
      api.sheet(close => {
        const send = btn('Melden', 'danger block', () => { if(!reason) return; close(); sendReport(x, reason); }, { disabled: true });
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Spiel melden' }),
          el('h3', { class: 'b-h', text: x.g.n }),
          hint('Warum meldest du dieses Spiel? Es wird danach für dich ausgeblendet.'),
          chipGroup(Object.keys(REASONS).map(k => [k, REASONS[k]]), null, v => { reason = v; send.disabled = false; }, 'Grund'),
          send,
          btn('Abbrechen', 'ghost block', close)
        ]);
      });
    }

    /* ---------- Editor ---------- */
    function editor(draft, opts){
      S.screen = 'editor'; C.render = null;
      const startJSON = opts.startJSON || (opts.isNew ? '' : JSON.stringify(draft));
      api.setTitle(opts.isNew ? 'Neues Spiel' : 'Bearbeiten');
      const t = draft.t;
      const probBox = el('div', { class: 'b-card gc-probs' });
      const preview = el('div', { class: 'b-card glow gc-hero b-row gc-th-' + draft.th });
      const drawPreview = () => {
        preview.className = 'b-card glow gc-hero b-row gc-th-' + draft.th;
        preview.innerHTML = '';
        preview.append(el('div', { class: 'gc-big', style: { fontSize: '42px' }, text: draft.i }),
          el('div', { class: 'grow' }, [el('div', { class: 'gc-name', text: draft.n || 'Dein Spiel' }), el('span', { class: 'b-pill', text: TYPES[t].label })]));
      };
      const refresh = () => {
        const p = problems(draft);
        probBox.innerHTML = '';
        if(!p.length){ probBox.className = 'b-card gc-probs ok'; probBox.append(el('b', { text: '✓ Alles bereit – du kannst testen und speichern.' })); }
        else {
          probBox.className = 'b-card gc-probs';
          probBox.append(el('b', { text: 'Noch offen:' }), el('ul', {}, p.slice(0, 8).map(x => el('li', { text: x }))));
          if(p.length > 8) probBox.append(el('small', { class: 'b-hint', text: '… und ' + (p.length - 8) + ' weitere' }));
        }
        drawPreview();
      };
      const lbl = (text, counter) => el('div', { class: 'gc-lbl' }, [el('span', { class: 'b-label', text }), counter || null]);
      const textIn = (val, max, ph, onIn, area) => {
        const cnt = el('small', { text: (val || '').length + '/' + max });
        const i = area ? el('textarea', { class: 'b-input', maxlength: max, placeholder: ph, text: val || '', rows: 3 }) : el('input', { class: 'b-input', maxlength: max, placeholder: ph, value: val || '' });
        i.addEventListener('input', () => { cnt.textContent = i.value.length + '/' + max; onIn(i.value); });
        return [i, cnt];
      };
      const numIn = (val, min, max, onIn, ph) => {
        const i = el('input', { class: 'b-input', type: 'number', min, max, step: 1, value: Number.isFinite(val) ? String(val) : '', placeholder: ph || '' });
        i.addEventListener('input', () => { const s = i.value.trim(); onIn(s === '' ? NaN : Number(s.replace(',', '.'))); refresh(); });
        return i;
      };
      const sec = (title, kids) => el('div', { class: 'b-card b-stack tight' }, [el('div', { class: 'b-kicker', text: title })].concat(kids));

      // Grunddaten
      const [nameIn, nameCnt] = textIn(draft.n, 40, 'z. B. Mein Mega-Quiz', v => { draft.n = v; refresh(); });
      nameIn.setAttribute('aria-label', 'Spielname');
      const [descIn, descCnt] = textIn(draft.d, 200, 'Worum geht’s? (optional)', v => { draft.d = v; refresh(); }, true);
      descIn.setAttribute('aria-label', 'Beschreibung');
      const emos = el('div', { class: 'gc-emos', role: 'group', 'aria-label': 'Icon' });
      const drawEmos = () => { emos.innerHTML = ''; EMOJIS.forEach(e => emos.append(el('button', { type: 'button', class: 'gc-emo', 'aria-pressed': String(e === draft.i), 'aria-label': 'Icon ' + e, text: e, onclick: () => { draft.i = e; api.sound('tap'); drawEmos(); refresh(); } }))); };
      drawEmos();
      const sws = el('div', { class: 'gc-sws', role: 'group', 'aria-label': 'Design' });
      const drawSws = () => { sws.innerHTML = ''; Object.keys(THEMES).forEach(k => sws.append(el('div', { class: 'gc-swb' }, [el('button', { type: 'button', class: 'gc-sw', 'aria-pressed': String(k === draft.th), 'aria-label': 'Design ' + THEMES[k], style: { background: 'var(' + THEME_VAR[k] + ')' }, onclick: () => { draft.th = k; api.sound('tap'); drawSws(); refresh(); } }), el('span', { text: THEMES[k] })]))); };
      drawSws();
      const basics = sec('Grunddaten', [lbl('Spielname', nameCnt), nameIn, lbl('Beschreibung', descCnt), descIn, lbl('Icon'), emos, lbl('Design'), sws]);

      // Regeln
      let rulesSec = null;
      if(['quiz', 'tf', 'est', 'react'].includes(t)){
        const r = draft.r;
        rulesSec = sec('Regeln', [
          el('div', { class: 'b-grid2' }, [
            el('div', {}, [lbl(t === 'react' ? 'Max. Reaktion (s)' : 'Zeit pro Frage (s)'), numIn(r.tl, 0, 120, v => { r.tl = v; }, '0 = aus')]),
            el('div', {}, [lbl(t === 'react' ? 'Punkte pro Treffer' : 'Punkte pro richtig'), numIn(r.pt, 1, 1000, v => { r.pt = v; })])
          ]),
          el('div', { class: 'b-grid2' }, [
            el('div', {}, [lbl('Leben'), numIn(r.lv, 0, 10, v => { r.lv = v; }, '0 = unbegrenzt')]),
            el('div', {}, [lbl('Tempo-Bonus'), chipGroup([[true, 'An'], [false, 'Aus']], r.sb, v => { r.sb = v; refresh(); }, 'Tempo-Bonus')])
          ]),
          el('small', { class: 'b-hint', text: '0 Sekunden = kein Zeitlimit, 0 Leben = unbegrenzt. Der Tempo-Bonus gibt bis zu 50 % Extrapunkte für schnelle Antworten.' })
        ]);
      }
      // Typ-Einstellungen
      let cfgSec = null;
      if(t === 'react'){
        const c = draft.c;
        const colBox = el('div', { class: 'gc-sws', role: 'group', 'aria-label': 'Zielfarbe' });
        const drawCol = () => { colBox.innerHTML = ''; Object.keys(COLORS).forEach(k => colBox.append(el('div', { class: 'gc-swb' }, [el('button', { type: 'button', class: 'gc-sw', 'aria-pressed': String(k === c.co), 'aria-label': 'Zielfarbe ' + COLORS[k][0], style: { background: 'var(' + COLORS[k][1] + ')' }, onclick: () => { c.co = k; api.sound('tap'); drawCol(); refresh(); } }), el('span', { text: COLORS[k][0] })]))); };
        drawCol();
        cfgSec = sec('Reaktions-Einstellungen', [
          el('div', { class: 'b-grid3' }, [
            el('div', {}, [lbl('Runden'), numIn(c.ro, 1, 20, v => { c.ro = v; })]),
            el('div', {}, [lbl('Min ms'), numIn(c.mn, 300, 15000, v => { c.mn = v; })]),
            el('div', {}, [lbl('Max ms'), numIn(c.mx, 300, 15000, v => { c.mx = v; })])
          ]),
          lbl('Zielfarbe'), colBox,
          lbl('Fake-Signale (falsche Farben)'), chipGroup([[true, 'An'], [false, 'Aus']], c.fk, v => { c.fk = v; refresh(); }, 'Fake-Signale')
        ]);
      } else if(t === 'wheel'){
        cfgSec = sec('Glücksrad', [lbl('Drehungen pro Spiel'), numIn(draft.c.sp, 1, 20, v => { draft.c.sp = v; })]);
      }

      // Inhalte
      let itemsSec = null;
      if(t !== 'react'){
        const cnt = el('small', {});
        const listBox = el('div', { class: 'b-list' });
        const summary = it => {
          if(t === 'quiz') return [it.q, Array.isArray(it.a) ? '✓ ' + (it.a[it.c] || '–') : ''];
          if(t === 'tf') return [it.q, it.a ? 'Wahr' : 'Falsch'];
          if(t === 'est') return [it.q, (Number.isFinite(it.n) ? it.n : '–') + (it.u ? ' ' + it.u : '') + ' (±' + it.tol + ' %)'];
          if(t === 'cards') return [it.t, KINDS[it.k] || ''];
          return [it.t + ' · ' + it.p + ' Pkt', it.a || 'keine Aufgabe'];
        };
        const drawItems = () => {
          listBox.innerHTML = '';
          cnt.textContent = draft.it.length + ' / ' + (t === 'wheel' ? 12 : 100);
          if(!draft.it.length) listBox.append(hint('Noch keine Inhalte. Tippe auf „+ Hinzufügen“.'));
          draft.it.forEach((it, idx) => {
            const [a, b] = summary(it);
            listBox.append(el('div', { class: 'b-item gc-item' }, [
              el('span', { class: 'gc-idx b-num', text: idx + 1 }),
              el('div', { class: 'tx' }, [el('b', { text: a || '(leer)' }), el('small', { text: b })]),
              el('div', { class: 'gc-acts' }, [
                iconBtn('↑', 'Nach oben', () => { [draft.it[idx - 1], draft.it[idx]] = [draft.it[idx], draft.it[idx - 1]]; api.sound('move'); drawItems(); refresh(); }, idx === 0),
                iconBtn('↓', 'Nach unten', () => { [draft.it[idx + 1], draft.it[idx]] = [draft.it[idx], draft.it[idx + 1]]; api.sound('move'); drawItems(); refresh(); }, idx === draft.it.length - 1),
                iconBtn('✎', 'Bearbeiten', () => itemSheet(t, it, itemLabel(t, idx), v => { draft.it[idx] = v; drawItems(); refresh(); })),
                iconBtn('🗑', 'Löschen', async () => { if(await ask(itemLabel(t, idx) + ' löschen?', 'Löschen', 'Abbrechen')){ draft.it.splice(idx, 1); drawItems(); refresh(); } })
              ])
            ]));
          });
        };
        drawItems();
        const max = t === 'wheel' ? 12 : 100;
        itemsSec = el('div', { class: 'b-card b-stack tight' }, [
          el('div', { class: 'b-between' }, [el('div', { class: 'b-kicker', text: 'Inhalte' }), cnt]),
          el('small', { class: 'b-hint', text: TYPES[t].hint }),
          listBox,
          btn('+ Hinzufügen', 'ghost block', () => {
            if(draft.it.length >= max){ api.toast('Maximal ' + max + ' Einträge.'); return; }
            itemSheet(t, blankItem(t), itemLabel(t, draft.it.length), v => { draft.it.push(v); drawItems(); refresh(); });
          })
        ]);
      }

      const dirty = () => JSON.stringify(draft) !== startJSON;
      const goBack = async () => {
        if(dirty() && !(await ask('Ungespeicherte Änderungen verwerfen?', 'Verwerfen', 'Weiter bearbeiten'))) return;
        if(alive) home('mine');
      };
      const doTest = () => {
        if(problems(draft).length){ api.sound('bad'); api.toast('Behebe zuerst die offenen Punkte.'); probBox.scrollIntoView({ block: 'center' }); return; }
        const snap = clone(draft);
        player(snap, { key: 'test', test: true, back: () => editor(draft, { isNew: opts.isNew, startJSON }) });
      };
      const doSave = () => {
        if(problems(draft).length){ api.sound('bad'); api.toast('Speichern geht erst ohne offene Punkte.'); probBox.scrollIntoView({ block: 'center' }); return; }
        const g = clone(draft); g.updated = Date.now(); g.created = g.created || g.updated;
        const i = S.games.findIndex(x => x.id === g.id);
        if(i >= 0) S.games[i] = g; else S.games.unshift(g);
        saveGames();
        draft.created = g.created; draft.updated = g.updated;
        api.sound('check');
        api.toast(isPublished(g) ? 'Gespeichert ✓ – Community-Version über ⋯ aktualisieren.' : 'Gespeichert ✓');
        editor(draft, { isNew: false });
      };
      view(el('div', { class: 'b-stack' }, [
        preview, basics, rulesSec, cfgSec, itemsSec, probBox,
        el('div', { class: 'b-grid2' }, [btn('▶ Testen', 'cyan', doTest), btn('💾 Speichern', '', doSave)]),
        btn('‹ Zurück', 'ghost block', goBack)
      ].filter(Boolean)));
      refresh();
    }

    function itemSheet(t, item, L, onSave){
      const it = clone(item);
      if(t === 'est' && item.n !== item.n) it.n = NaN; // NaN geht bei JSON verloren
      if(t === 'est' && it.n === null) it.n = NaN;
      api.sheet(close => {
        const err = el('p', { class: 'gc-err', role: 'alert' });
        const kids = [];
        const lab = text => el('span', { class: 'b-label', text });
        const tin = (val, max, ph, on, area) => {
          const i = area ? el('textarea', { class: 'b-input', maxlength: max, placeholder: ph, text: val || '', rows: 3 }) : el('input', { class: 'b-input', maxlength: max, placeholder: ph, value: val || '' });
          i.addEventListener('input', () => on(i.value));
          return i;
        };
        const nin = (val, on, ph, mode) => {
          const i = el('input', { class: 'b-input', type: 'text', inputmode: mode || 'decimal', placeholder: ph || '', value: Number.isFinite(val) ? String(val).replace('.', ',') : '' });
          i.addEventListener('input', () => { const s = i.value.trim().replace(/\s/g, '').replace(',', '.'); on(s === '' || !/^-?\d*\.?\d+$|^-?\d+\.?$/.test(s) ? NaN : Number(s)); });
          return i;
        };
        if(t === 'quiz'){
          kids.push(lab('Frage'), tin(it.q, 200, 'Deine Frage', v => { it.q = v; }, true));
          const marks = el('div', {});
          const drawMarks = () => { marks.innerHTML = ''; marks.append(chipGroup([0, 1, 2, 3].map(k => [k, 'ABCD'[k] + ' ist richtig']), it.c, v => { it.c = v; }, 'Richtige Antwort')); };
          ['A', 'B', 'C', 'D'].forEach((ch, k) => { kids.push(lab('Antwort ' + ch), tin(it.a[k], 200, 'Antwort ' + ch, v => { it.a[k] = v; })); });
          drawMarks();
          kids.push(lab('Richtige Antwort markieren'), marks);
        } else if(t === 'tf'){
          kids.push(lab('Aussage'), tin(it.q, 200, 'z. B. Die Erde ist rund.', v => { it.q = v; }, true));
          kids.push(lab('Diese Aussage ist …'), chipGroup([[true, 'Wahr'], [false, 'Falsch']], it.a, v => { it.a = v; }, 'Lösung'));
        } else if(t === 'est'){
          kids.push(lab('Frage'), tin(it.q, 200, 'z. B. Wie hoch ist der Großglockner?', v => { it.q = v; }, true));
          kids.push(el('div', { class: 'b-grid2' }, [
            el('div', {}, [lab('Richtige Zahl'), nin(it.n, v => { it.n = v; }, 'z. B. 3798')]),
            el('div', {}, [lab('Einheit (optional)'), tin(it.u, 20, 'z. B. m', v => { it.u = v; })])
          ]));
          kids.push(lab('Toleranz in %'), nin(it.tol, v => { it.tol = v; }, '0–100', 'decimal'));
          kids.push(el('small', { class: 'b-hint', text: 'Innerhalb der Toleranz gibt’s volle Punkte, bis zur doppelten Toleranz die Hälfte.' }));
        } else if(t === 'cards'){
          kids.push(lab('Kartenart'), chipGroup(Object.keys(KINDS).map(k => [k, KINDS[k]]), it.k, v => { it.k = v; }, 'Kartenart'));
          kids.push(lab('Text'), tin(it.t, 200, 'z. B. Wer würde eher im Lotto gewinnen?', v => { it.t = v; }, true));
        } else if(t === 'wheel'){
          kids.push(lab('Feldname (kurz)'), tin(it.t, 30, 'z. B. Jackpot', v => { it.t = v; }));
          kids.push(lab('Punkte (auch negativ)'), nin(it.p, v => { it.p = v; }, 'z. B. 50', 'numeric'));
          kids.push(lab('Aufgabe (optional)'), tin(it.a, 200, 'z. B. Sing den Refrain deines Lieblingssongs', v => { it.a = v; }, true));
        }
        return el('div', { class: 'b-stack tight' }, [
          el('div', { class: 'b-kicker', text: L }),
          ...kids, err,
          el('div', { class: 'b-grid2', style: { marginTop: '6px' } }, [
            btn('Abbrechen', 'ghost', close),
            btn('Übernehmen', '', () => {
              const p = itemProblems(t, it, L);
              if(p.length){ err.textContent = p.map(x => x.replace(L + ': ', '')).join(' · '); api.sound('bad'); return; }
              api.sound('pop'); onSave(it); close();
            })
          ])
        ]);
      });
    }

    /* ---------- Player ---------- */
    function rulesText(g){
      const r = g.r;
      if(g.t === 'cards') return 'Ziehe Karten, so viele du willst. Keine Punkte – nur Spaß.';
      if(g.t === 'wheel') return g.c.sp + ' Drehungen · Punkte sammeln, Aufgaben erledigen.';
      const life = r.lv ? r.lv + ' Leben' : 'unbegrenzt Leben';
      if(g.t === 'react') return g.c.ro + ' Runden · tippe nur bei ' + COLORS[g.c.co][0] + (g.c.fk ? ' · Achtung, Fake-Signale!' : '') + ' · ' + r.pt + ' Pkt' + (r.sb ? ' + Tempo-Bonus' : '') + ' · ' + life;
      return (r.tl ? r.tl + ' s pro Frage' : 'ohne Zeitlimit') + ' · ' + r.pt + ' Pkt pro richtig' + (r.sb ? ' + Tempo-Bonus' : '') + ' · ' + life;
    }
    function player(g, ctx){
      S.screen = 'player'; C.render = null;
      api.setTitle(ctx.test ? 'Test: ' + g.n : g.n);
      const best = SCORED[g.t] && !ctx.test ? api.best(hsKey(ctx.key)) : null;
      view(el('div', { class: 'b-stack gc-th-' + g.th }, [
        el('div', { class: 'b-card glow gc-hero b-center', style: { padding: '24px 16px' } }, [
          el('div', { class: 'gc-big', text: g.i }),
          el('div', { class: 'gc-name', text: g.n }),
          el('span', { class: 'b-pill', text: TYPES[g.t].label + (ctx.test ? ' · Testlauf' : '') }),
          g.d ? hint(g.d) : null,
          el('small', { class: 'gc-mini', text: rulesText(g) })
        ]),
        ctx.test ? hint('Testlauf: Punkte zählen nicht für den Rekord.') : el('div', { class: 'b-grid2' }, [
          stat('Rekord', el('b', { text: best == null ? '–' : best })),
          stat('Lokal gespielt', el('b', { text: plays[ctx.key] || 0 }))
        ]),
        btn('▶ Start', 'block', () => { api.sound('good'); run(g, ctx); }, { style: { minHeight: '56px', fontSize: '20px' } }),
        btn(ctx.test ? '‹ Zurück zum Editor' : '‹ Zurück', 'ghost block', () => { api.sound('click'); ctx.back(); })
      ]));
    }
    function run(g, ctx){
      const box = el('div', { class: 'b-stack gc-th-' + g.th });
      view(box);
      const done = res => endGame(g, ctx, res);
      if(g.t === 'quiz' || g.t === 'tf' || g.t === 'est') runQuestions(g, box, done);
      else if(g.t === 'react') runReact(g, box, done);
      else if(g.t === 'wheel') runWheel(g, box, done);
      else runCards(g, box, done);
    }
    function endGame(g, ctx, res){
      if(!alive) return;
      T.clear();
      let rec = null;
      if(!ctx.test){
        bumpPlays(ctx.key);
        if(res.score != null) rec = api.reportScore(res.score, hsKey(ctx.key));
      }
      api.finish({ win: res.win, score: res.score == null ? undefined : res.score, xp: 15 });
      const lines = res.lines.slice();
      if(rec) lines.push(['Rekord', rec.best]);
      if(rec && rec.isBest) api.sound('win');
      B.ui.result(root, api, {
        win: res.win, emoji: res.emoji, title: ctx.test ? 'Test beendet' : res.title,
        sub: [rec && rec.isBest ? 'Neuer Rekord!' : '', res.sub || '', ctx.test ? 'Testlauf – zählt nicht als Rekord.' : ''].filter(Boolean).join(' '),
        lines, onAgain: () => run(g, ctx), onMenu: ctx.back
      });
      root.scrollTop = 0;
    }

    /* Quiz, Wahr/Falsch, Schätzfragen */
    function runQuestions(g, box, done){
      const items = api.shuffle(g.it), n = items.length, r = g.r;
      let i = 0, score = 0, right = 0, lives = r.lv, locked = false, iv = null, t0 = 0;
      const hQ = el('b'), hP = el('b'), hL = el('b');
      const bar = el('div', { class: 'b-bar gc-tbar' }, [el('i')]);
      const stage = el('div', { class: 'b-stack' });
      box.append(el('div', { class: 'b-grid3' }, [stat('Frage', hQ), stat('Punkte', hP), stat('Leben', hL)]));
      if(r.tl) box.append(bar);
      box.append(stage);
      const upd = () => { hQ.textContent = Math.min(i + 1, n) + '/' + n; hP.textContent = score; hL.textContent = r.lv ? '❤ ' + lives : '∞'; };
      const stopTimer = () => { if(iv != null){ T.stop(iv); iv = null; } };
      const fb = el('p', { class: 'gc-fb', 'aria-live': 'polite' });
      function next(){
        if(i >= n || (r.lv && lives <= 0)){
          const out = r.lv && lives <= 0;
          const win = !out && right >= Math.ceil(n / 2);
          done({ score, win, title: win ? 'Stark gespielt!' : 'Vorbei!', sub: out ? 'Keine Leben mehr.' : right + ' von ' + n + ' richtig.', lines: [['Punkte', score], ['Richtig', right + '/' + n]] });
          return;
        }
        ask(items[i]);
      }
      function resolve(ok, partial, mark, msg){
        if(locked) return;
        locked = true; stopTimer();
        const el_ = performance.now() - t0;
        let pts = 0;
        if(ok){
          right++;
          const frac = r.tl ? Math.max(0, 1 - el_ / (r.tl * 1000)) : Math.max(0, 1 - el_ / 10000);
          pts = r.pt + (r.sb ? Math.round(r.pt * 0.5 * frac) : 0);
          api.sound('good'); fb.className = 'gc-fb ok'; fb.textContent = 'Richtig! +' + pts;
        } else if(partial){
          pts = Math.round(r.pt / 2); api.sound('pop'); fb.className = 'gc-fb mid'; fb.textContent = 'Knapp dran! +' + pts;
        } else {
          if(r.lv) lives--;
          api.sound('bad'); api.vibrate(60); fb.className = 'gc-fb no'; fb.textContent = msg || 'Leider falsch.';
        }
        score += pts;
        if(mark) mark();
        upd();
        T.set(() => { i++; next(); }, ok ? 1100 : 1900);
      }
      function ask(it){
        locked = false; stage.innerHTML = ''; fb.textContent = ''; fb.className = 'gc-fb'; upd();
        stage.append(el('div', { class: 'b-card glow gc-q b-pop' }, [el('div', { class: 'b-kicker gc-acc', text: TYPES[g.t].label + ' · ' + (i + 1) + '/' + n }), el('p', { class: 'gc-qt', text: it.q })]));
        let markTimeout = null;
        if(g.t === 'quiz'){
          const order = api.shuffle([0, 1, 2, 3]);
          const btns = [];
          const grid = el('div', { class: 'gc-ans-grid' });
          order.forEach((k, pos) => {
            const b = el('button', { type: 'button', class: 'gc-ans' }, [el('span', { class: 'gc-l', text: 'ABCD'[pos] }), el('span', { text: it.a[k] })]);
            b.dataset.k = k;
            b.addEventListener('click', () => resolve(k === it.c, false, () => { btns.forEach(x => { x.disabled = true; if(+x.dataset.k === it.c) x.classList.add('ok'); }); if(k !== it.c) b.classList.add('no'); }));
            btns.push(b); grid.append(b);
          });
          markTimeout = () => btns.forEach(x => { x.disabled = true; if(+x.dataset.k === it.c) x.classList.add('ok'); });
          stage.append(grid);
        } else if(g.t === 'tf'){
          const mk = (val, label) => {
            const b = el('button', { type: 'button', class: 'gc-ans', text: label });
            b.addEventListener('click', () => resolve(val === it.a, false, () => { [bw, bf].forEach(x => x.disabled = true); (it.a ? bw : bf).classList.add('ok'); if(val !== it.a) b.classList.add('no'); }));
            return b;
          };
          const bw = mk(true, '✓ Wahr'), bf = mk(false, '✗ Falsch');
          markTimeout = () => { bw.disabled = bf.disabled = true; (it.a ? bw : bf).classList.add('ok'); };
          stage.append(el('div', { class: 'gc-tf' }, [bw, bf]));
        } else {
          const inp = el('input', { class: 'b-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: 'Deine Schätzung' + (it.u ? ' (' + it.u + ')' : ''), 'aria-label': 'Deine Schätzung' });
          const fmt = v => Number(v).toLocaleString('de-AT', { maximumFractionDigits: 4 });
          const solution = () => 'Richtig: ' + fmt(it.n) + (it.u ? ' ' + it.u : '') + ' (±' + fmt(it.tol) + ' %)';
          const sol = el('p', { class: 'b-hint', style: { textAlign: 'center' } });
          const go = el('button', { type: 'button', class: 'b-btn block', text: 'Tippen' });
          const submit = () => {
            if(locked) return;
            const s = inp.value.trim().replace(/\s/g, '').replace(',', '.');
            const v = Number(s);
            if(!s || !isFinite(v)){ inp.classList.remove('b-shake'); void inp.offsetWidth; inp.classList.add('b-shake'); api.sound('tap'); return; }
            const diff = Math.abs(v - it.n), tolAbs = it.n === 0 ? it.tol / 100 : Math.abs(it.n) * it.tol / 100;
            const ok = diff <= tolAbs, partial = !ok && it.tol > 0 && diff <= tolAbs * 2;
            resolve(ok, partial, () => { inp.disabled = true; go.disabled = true; sol.textContent = solution() + ' · du: ' + fmt(v); });
          };
          go.addEventListener('click', submit);
          inp.addEventListener('keydown', e => { if(e.key === 'Enter') submit(); });
          markTimeout = () => { inp.disabled = true; go.disabled = true; sol.textContent = solution(); };
          stage.append(inp, go, sol);
          setTimeout(() => { try{ if(inp.isConnected) inp.focus(); }catch(e){} }, 50);
        }
        stage.append(fb);
        t0 = performance.now();
        if(r.tl){
          const barI = bar.firstChild; barI.style.width = '100%';
          iv = T.every(() => {
            const f = 1 - (performance.now() - t0) / (r.tl * 1000);
            barI.style.width = Math.max(0, f) * 100 + '%';
            if(f <= 0.25 && f > 0.2) api.sound('tick');
            if(f <= 0) resolve(false, false, markTimeout, 'Zeit abgelaufen!');
          }, 100);
        }
      }
      next();
    }

    /* Reaktions-Challenge */
    function runReact(g, box, done){
      const c = g.c, r = g.r;
      let round = 0, score = 0, lives = r.lv, state = 'ready', tok = 0, tGo = 0;
      const times = [];
      const hR = el('b'), hP = el('b'), hL = el('b');
      const upd = () => { hR.textContent = Math.min(round + 1, c.ro) + '/' + c.ro; hP.textContent = score; hL.textContent = r.lv ? '❤ ' + lives : '∞'; };
      const big = el('div', { text: 'Bereit?' });
      const small = el('small', { text: 'Tippe nur, wenn das Feld ' + COLORS[c.co][0].toUpperCase() + ' wird.' });
      const pad = el('div', { class: 'b-pad gc-pad', role: 'button', 'aria-label': 'Reaktionsfeld', tabindex: 0 }, [big, small]);
      const fakes = Object.keys(COLORS).filter(k => k !== c.co);
      const paint = (col, txt, sub) => {
        pad.classList.toggle('lit', !!col);
        pad.style.background = col ? 'var(' + COLORS[col][1] + ')' : '';
        big.textContent = txt; small.textContent = sub || '';
      };
      box.append(el('div', { class: 'b-grid3' }, [stat('Runde', hR), stat('Punkte', hP), stat('Leben', hL)]),
        el('div', { class: 'b-row' }, [el('span', { class: 'b-label', style: { margin: 0 }, text: 'Zielfarbe' }), el('span', { class: 'gc-sw', style: { width: '28px', height: '28px', borderRadius: '8px', background: 'var(' + COLORS[c.co][1] + ')' } }), el('span', { class: 'gc-mini', text: COLORS[c.co][0] + (c.fk ? ' · Fake-Signale an' : '') })]),
        pad);
      upd();
      paint(null, 'Tippe zum Starten', 'Tippe nur, wenn das Feld ' + COLORS[c.co][0].toUpperCase() + ' wird.');
      function finishAll(){
        state = 'over';
        const out = r.lv && lives <= 0;
        const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
        const win = r.lv ? !out : times.length >= Math.ceil(c.ro / 2);
        done({ score, win, title: win ? 'Blitzschnell!' : 'Vorbei!', emoji: win ? '⚡' : null, sub: out ? 'Keine Leben mehr.' : times.length + ' von ' + c.ro + ' Treffern.',
          lines: [['Punkte', score], ['Treffer', times.length + '/' + c.ro], ['Ø Zeit', avg == null ? '–' : avg + ' ms'], ['Beste', times.length ? Math.min(...times) + ' ms' : '–']] });
      }
      function startRound(){
        if(round >= c.ro || (r.lv && lives <= 0)){ finishAll(); return; }
        upd();
        const my = ++tok;
        state = 'wait'; paint(null, 'Warte …', '');
        let wait = c.mn + Math.random() * (c.mx - c.mn);
        if(c.fk && Math.random() < 0.5){
          const fakeAt = Math.max(250, wait * (0.25 + Math.random() * 0.45));
          wait = Math.max(wait, fakeAt + 600 + 350);
          T.set(() => { if(tok !== my || state !== 'wait') return; state = 'fake'; paint(api.pick(fakes), '!', ''); T.set(() => { if(tok === my && state === 'fake'){ state = 'wait'; paint(null, 'Warte …', ''); } }, 600); }, fakeAt);
        }
        T.set(() => {
          if(tok !== my || state !== 'wait') return;
          state = 'go'; tGo = performance.now(); paint(c.co, '!', '');
          if(r.tl) T.set(() => { if(tok === my && state === 'go') miss('Zu langsam!'); }, r.tl * 1000);
        }, wait);
      }
      function miss(msg){
        tok++; state = 'between';
        if(r.lv) lives--;
        api.sound('bad'); api.vibrate(80);
        paint(null, msg, r.lv ? 'Leben verloren' : '0 Punkte');
        pad.classList.remove('b-shake'); void pad.offsetWidth; pad.classList.add('b-shake');
        round++; upd();
        T.set(startRound, 1300);
      }
      function hit(){
        const ms = Math.round(performance.now() - tGo);
        tok++; state = 'between';
        const pts = r.pt + (r.sb ? Math.round(r.pt * 0.5 * Math.max(0, 1 - ms / 1000)) : 0);
        score += pts; times.push(ms); round++;
        api.sound('good'); api.vibrate(20);
        paint(null, ms + ' ms', '+' + pts + ' Punkte');
        upd();
        T.set(startRound, 1100);
      }
      pad.addEventListener('pointerdown', e => {
        e.preventDefault();
        if(state === 'ready'){ api.sound('click'); startRound(); }
        else if(state === 'wait') miss('Zu früh!');
        else if(state === 'fake') miss('Falsche Farbe!');
        else if(state === 'go') hit();
      });
    }

    /* Glücksrad */
    function runWheel(g, box, done){
      const segs = g.it, n = segs.length, seg = Math.PI * 2 / n, TAU = Math.PI * 2;
      let rot = 0, spinning = false, spins = 0, score = 0;
      const log = [];
      const dpr = Math.min(3, window.devicePixelRatio || 1), size = 300;
      const cv = el('canvas', { class: 'gc-wheel', width: size * dpr, height: size * dpr, role: 'img', 'aria-label': 'Glücksrad' });
      const cx = cv.getContext('2d');
      const cols = ['--cyan', '--violet', '--pink', '--good', '--warn'].map(cssVar);
      const ink = cssVar('--bg');
      const hS = el('b'), hP = el('b');
      const res = el('div', { class: 'b-card gc-card', style: { minHeight: '120px' } }, [hint('Tippe auf „Drehen“!')]);
      const go = el('button', { type: 'button', class: 'b-btn block', text: '🎡 Drehen', style: { minHeight: '56px', fontSize: '20px' } });
      const upd = () => { hS.textContent = spins + '/' + g.c.sp; hP.textContent = score; };
      function draw(){
        if(!cx) return;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx.clearRect(0, 0, size, size);
        const R = size / 2 - 4, C0 = size / 2;
        for(let k = 0; k < n; k++){
          const a0 = rot + k * seg - Math.PI / 2;
          cx.beginPath(); cx.moveTo(C0, C0); cx.arc(C0, C0, R, a0, a0 + seg); cx.closePath();
          cx.fillStyle = cols[(n % cols.length === 1 && k === n - 1) ? 1 : k % cols.length]; cx.fill();
          cx.strokeStyle = ink; cx.lineWidth = 2; cx.stroke();
          cx.save(); cx.translate(C0, C0); cx.rotate(a0 + seg / 2);
          cx.fillStyle = ink; cx.font = '700 14px system-ui, sans-serif'; cx.textAlign = 'right'; cx.textBaseline = 'middle';
          let label = segs[k].t;
          while(label.length > 1 && cx.measureText(label).width > R - 34) label = label.slice(0, -2) + '…';
          cx.fillText(label, R - 10, 0);
          cx.restore();
        }
        cx.beginPath(); cx.arc(C0, C0, 22, 0, TAU); cx.fillStyle = ink; cx.fill();
        cx.lineWidth = 3; cx.strokeStyle = cssVar(THEME_VAR[g.th]); cx.stroke();
      }
      const mod = x => ((x % TAU) + TAU) % TAU;
      function spin(){
        if(spinning || spins >= g.c.sp) return;
        spinning = true; go.disabled = true; api.sound('click');
        const k = Math.floor(Math.random() * n);
        const desired = mod(-(k + 0.5) * seg + (Math.random() - 0.5) * seg * 0.6);
        const from = rot, target = rot + TAU * 5 + mod(desired - mod(rot));
        const start = performance.now(), dur = 3200;
        let lastSeg = -1;
        const frame = now => {
          const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
          rot = from + (target - from) * e; draw();
          const cur = Math.floor(mod(-rot) / seg);
          if(cur !== lastSeg){ lastSeg = cur; if(p < 0.95) api.sound('tick'); }
          if(p < 1) T.raf(frame); else land(k);
        };
        T.raf(frame);
      }
      function land(k){
        spinning = false; spins++;
        const s = segs[k]; score += s.p; log.push(s);
        api.sound(s.p > 0 ? 'good' : s.p < 0 ? 'bad' : 'pop');
        res.innerHTML = '';
        res.append(el('div', { class: 'b-kicker gc-acc', text: 'Dreh ' + spins }), el('p', { text: s.t }),
          el('b', { class: 'b-num', style: { fontSize: '22px', color: s.p >= 0 ? 'var(--good)' : 'var(--bad)' }, text: (s.p > 0 ? '+' : '') + s.p + ' Punkte' }),
          s.a ? el('div', { class: 'b-hint', style: { fontSize: '16px', color: 'var(--ink)' }, text: '📝 ' + s.a }) : el('span'));
        upd();
        go.disabled = false;
        go.textContent = spins >= g.c.sp ? 'Ergebnis ansehen' : '🎡 Nochmal drehen';
      }
      go.addEventListener('click', () => {
        if(spins >= g.c.sp){
          done({ score, win: null, title: 'Fertig gedreht!', emoji: '🎡', sub: g.c.sp + ' Drehungen.', lines: [['Punkte', score], ['Drehungen', spins]] });
        } else spin();
      });
      cv.addEventListener('click', spin);
      box.append(el('div', { class: 'b-grid2' }, [stat('Drehung', hS), stat('Punkte', hP)]),
        el('div', { class: 'gc-wrap-wheel' }, [el('div', { class: 'gc-ptr' }), cv]), go, res);
      upd(); draw();
    }

    /* Partykarten */
    function runCards(g, box, done){
      const drawn = new Set();
      let filter = 'all', count = 0;
      const kinds = [...new Set(g.it.map(x => x.k))];
      const show = el('div', { class: 'b-card glow gc-card b-pop' }, [el('div', { class: 'b-kicker gc-acc', text: 'Bereit?' }), el('p', { text: 'Tippe auf „Karte ziehen“.' })]);
      const info = el('p', { class: 'gc-mini', style: { textAlign: 'center' } });
      const updInfo = () => { info.textContent = count + ' gezogen · ' + (g.it.length - drawn.size) + ' übrig'; };
      const pull = () => {
        const pool = g.it.map((x, i) => i).filter(i => !drawn.has(i) && (filter === 'all' || g.it[i].k === filter));
        show.innerHTML = '';
        show.classList.remove('b-pop'); void show.offsetWidth; show.classList.add('b-pop');
        if(!pool.length){
          show.append(el('div', { class: 'b-kicker gc-acc', text: 'Leer' }), el('p', { text: 'Keine Karten mehr' + (filter === 'all' ? '.' : ' in dieser Kategorie.') }),
            btn('Neu mischen', 'ghost sm', () => { drawn.clear(); updInfo(); pull(); }));
          api.sound('tap');
          return;
        }
        const i = api.pick(pool); drawn.add(i); count++;
        const it = g.it[i];
        show.append(el('div', { class: 'b-kicker gc-acc', text: KINDS[it.k] }), el('p', { text: it.t }));
        api.sound('flip'); updInfo();
      };
      box.append(kinds.length > 1 ? chipGroup([['all', 'Alle']].concat(kinds.map(k => [k, KINDS[k]])), filter, v => { filter = v; }, 'Kategorie') : el('div'),
        show, info,
        btn('🃏 Karte ziehen', 'block', pull, { style: { minHeight: '56px', fontSize: '20px' } }),
        btn('Fertig', 'ghost block', () => {
          if(!count){ api.toast('Zieh zuerst mindestens eine Karte.'); return; }
          done({ score: null, win: null, title: 'Gute Runde!', emoji: '🃏', sub: 'Danke fürs Spielen.', lines: [['Gezogen', count], ['Karten', g.it.length]] });
        }));
      updInfo();
    }

    /* ---------- Start ---------- */
    home(S.tab);
    initCommunity();
    return () => {
      alive = false;
      T.clear();
      C.timers.forEach(clearTimeout);
      C.unsubs.forEach(u => { try{ u(); }catch(e){} });
      C.unsubs = []; C.render = null;
    };
  }
});
})();
