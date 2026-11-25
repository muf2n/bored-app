/* BORED? – Online-Multiplayer: Lobby (FRIENDS-Tab) + Online-Spiele.
   Host ist die Autorität: hält den Zustand, sendet ihn absolut ('move' {type:'state'}),
   Clients senden nur Absichten ('move' {type:'intent'}). Chat über 'chat'. */
(function(){
'use strict';
const B = window.BORED;
if(!B || !B.registerLobby) return;
const el = B.el;

/* ---------- Helfer ---------- */
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/;
const UID_RE = /^[a-z0-9]{8,16}$/;
const AVATARS = ['😎','🦊','🐱','🐼','🐸','🤖','👾','🦄','🐲','🐧','🦁','👻','🐙','🔥','⚡','🎮','🐺','🦉','🍕','🚀'];
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const int = (v, lo, hi, d) => { const n = typeof v === 'number' ? v : NaN; return Number.isInteger(n) && n >= lo && n <= hi ? n : d; };
const str = (v, n) => typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, '').slice(0, n) : '';
const cleanName = v => str(v, 40).trim().slice(0, 16).trim() || 'Spieler';
const cleanAv = v => { const s = str(v, 16).trim(); return s && !/[A-Za-z0-9<>&]/.test(s) && [...s].length <= 4 ? s : '🙂'; };
const isUid = v => typeof v === 'string' && UID_RE.test(v);
function rid(n = 10){
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789', a = new Uint32Array(n);
  try{ window.crypto.getRandomValues(a); }catch(e){ for(let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 1e9); }
  let s = ''; for(const x of a) s += abc[x % 36]; return s;
}
function randCode(){
  const a = new Uint32Array(5);
  try{ window.crypto.getRandomValues(a); }catch(e){ for(let i = 0; i < 5; i++) a[i] = Math.floor(Math.random() * 1e9); }
  let s = ''; for(const x of a) s += CODE_CHARS[x % CODE_CHARS.length]; return s;
}
const shuffle = a => B.shuffle ? B.shuffle(a) : a.slice().sort(() => Math.random() - .5);
const scoreObj = (o, keys) => isObj(o) && Object.keys(o).length <= 16 && Object.keys(o).every(k => isUid(k) && typeof o[k] === 'number' && isFinite(o[k]) && Math.abs(o[k]) < 1e7) && (!keys || keys.every(k => own(o, k)));
const uidList = (a, max) => Array.isArray(a) && a.length <= max && a.every(isUid) && new Set(a).size === a.length;

/* Peers defensiv lesen – Feldnamen der Plattform können variieren */
const PRES_KEYS = ['presence', 'state', 'data', 'meta', 'value', 'info'];
function pickPres(p){
  if(!isObj(p)) return null;
  for(const k of PRES_KEYS) if(isObj(p[k])) return p[k];
  if(own(p, 'uid') || own(p, 'name')) return p;
  return null;
}
function pidOf(p, key){
  if(!isObj(p)) return null;
  for(const k of ['id', 'peerId', 'peer_id', 'clientId', 'connectionId', 'sessionId', 'sid', 'key']){
    const v = p[k]; if((typeof v === 'string' && v) || typeof v === 'number') return String(v).slice(0, 80);
  }
  return key != null ? String(key).slice(0, 80) : null;
}
function normPeers(raw){
  const arr = [];
  try{
    if(Array.isArray(raw)) raw.forEach(p => arr.push([p, null]));
    else if(raw instanceof Map) raw.forEach((v, k) => arr.push([v, k]));
    else if(isObj(raw)) Object.keys(raw).forEach(k => arr.push([raw[k], k]));
  }catch(e){}
  const out = [];
  for(const [p, key] of arr){
    if(!isObj(p)) continue;
    const pres = pickPres(p) || {};
    const uid = isUid(pres.uid) ? pres.uid : null;
    const pid = pidOf(p, key) || (uid ? 'u:' + uid : null);
    const self = p.self === true || p.you === true || p.isSelf === true || p.me === true || p.isYou === true || p.isMe === true || p.mine === true || p.local === true || p.label === 'you' || p.mark === 'you';
    out.push({ pid, uid, pres, self });
  }
  return out.slice(0, 200);
}
function wrapRoom(r, isLobby){
  const offs = [];
  const safe = fn => function(){ try{ return fn.apply(null, arguments); }catch(e){ return undefined; } };
  return {
    raw: r,
    emit(t, d){ try{ const x = r.emit(t, d); if(x && x.catch) x.catch(() => {}); return true; }catch(e){ return false; } },
    on(t, fn){ try{ const off = r.on(t, safe(fn)); if(typeof off === 'function') offs.push(off); }catch(e){} },
    presence(o){ try{ const x = r.presence(o); if(x && x.catch) x.catch(() => {}); }catch(e){} },
    onPeers(fn){ try{ const off = r.onPeers(safe(fn)); if(typeof off === 'function') offs.push(off); }catch(e){} },
    leave(){ offs.splice(0).forEach(f => { try{ f(); }catch(e){} }); if(!isLobby) try{ r.leave && r.leave(); }catch(e){} }
  };
}
async function copyText(t){
  try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(t); return true; } }catch(e){}
  try{
    const ta = el('textarea', { style: { position: 'fixed', top: 0, left: 0, opacity: 0 } }); ta.value = t;
    document.body.append(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok;
  }catch(e){ return false; }
}
const normWord = s => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z]/g, '');
function lev(a, b){
  if(a === b) return 0; if(!a.length) return b.length; if(!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for(let i = 1; i <= a.length; i++){
    const cur = [i];
    for(let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
/* 2 = richtig, 1 = knapp, 0 = falsch */
function matchWord(guess, word){
  const g = normWord(guess).slice(0, 40), w = normWord(word);
  if(!g || !w) return 0;
  if(g === w) return 2;
  const tol = w.length >= 8 ? 2 : w.length >= 4 ? 1 : 0;
  const d = lev(g, w);
  if(d <= tol) return 2;
  if(w.length >= 4 && g.includes(w) && g.length <= w.length + 6) return 2;
  if(w.length >= 4 && d <= tol + 2) return 1;
  return 0;
}
const containsWord = (text, word) => { const t = normWord(text), w = normWord(word); if(!w) return false; if(t.includes(w)) return true; return t.length <= w.length + 3 && matchWord(text, word) === 2; };

/* ---------- CSS ---------- */
function injectCss(){
  if(document.getElementById('on-style')) return;
  const css = `
.on-root{display:flex;flex-direction:column;gap:14px}
.on-hero{padding:18px 14px;text-align:center}
.on-hero .on-big{font-size:46px;line-height:1;filter:drop-shadow(0 0 16px rgba(0,229,255,.6))}
.on-code{font-family:var(--display);font-weight:800;font-size:32px;letter-spacing:.26em;color:var(--cyan);text-shadow:var(--glow-c);line-height:1.1}
.on-codein{font-family:var(--display);font-size:22px;letter-spacing:.3em;text-transform:uppercase;text-align:center}
.on-banner{padding:10px 12px;border-radius:12px;background:rgba(255,84,112,.14);border:1px solid var(--bad);font-size:14px;display:flex;gap:8px;align-items:center}
.on-banner.warn{background:rgba(255,201,60,.12);border-color:var(--warn)}
.on-dot{width:9px;height:9px;flex:0 0 9px;border-radius:50%;background:var(--good);box-shadow:0 0 8px var(--good);display:inline-block}
.on-dot.off{background:var(--bad);box-shadow:0 0 8px var(--bad)}
.on-dot.wait{background:var(--warn);box-shadow:0 0 8px var(--warn);animation:onBlink 1s infinite alternate}
@keyframes onBlink{to{opacity:.3}}
@keyframes onPulse{to{transform:scale(.82);filter:brightness(1.6)}}
.on-peers{display:flex;flex-wrap:wrap;gap:8px}
.on-peer{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:99px;background:var(--glass-2);border:1px solid var(--line-2);font-family:var(--head);font-weight:600;font-size:15px;max-width:100%}
.on-peer.you{border-color:var(--cyan);color:var(--cyan)}
.on-peer .on-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.on-av{font-size:22px;line-height:1}
.on-avbtn{width:56px;height:56px;flex:0 0 56px;border-radius:16px;font-size:32px;background:linear-gradient(135deg,rgba(168,85,247,.4),rgba(0,229,255,.25));border:1px solid var(--line);box-shadow:var(--glow-v)}
.on-avgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.on-avgrid button{font-size:30px;height:56px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line-2)}
.on-avgrid button[aria-pressed="true"]{border-color:var(--cyan);box-shadow:var(--glow-c)}
.on-gpick{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.on-gpick button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line-2);text-align:left;min-height:64px}
.on-gpick button b{font-family:var(--head);font-size:16px}
.on-gpick button small{color:var(--mute);font-size:12px}
.on-gpick button[aria-pressed="true"]{border-color:var(--cyan);box-shadow:var(--glow-c);background:rgba(0,229,255,.1)}
.on-pl{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2)}
.on-pl.me{border-color:rgba(0,229,255,.55)}
.on-pl .tx{flex:1;min-width:0;font-family:var(--head);font-weight:700;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.on-pl .on-sc{font-family:var(--display);font-size:16px;color:var(--cyan)}
.on-kick{min-width:44px;min-height:40px;border-radius:10px;background:rgba(255,84,112,.12);border:1px solid rgba(255,84,112,.5);color:var(--bad);font-size:16px}
.on-chatlist{max-height:190px;min-height:60px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;font-size:14px;padding-right:4px;overflow-wrap:anywhere}
.on-msg b{color:var(--cyan);font-family:var(--head);margin-right:5px}
.on-msg.mine b{color:var(--pink)}
.on-sys{color:var(--mute);font-style:italic;font-size:13px}
.on-chatform{display:flex;gap:8px}
.on-chatform .b-input{flex:1;min-width:0;padding:10px 12px}
.on-chat.guess{border-color:var(--cyan);box-shadow:var(--glow-c)}
.on-status{font-family:var(--head);font-weight:700;font-size:19px;letter-spacing:.04em;text-align:center}
.on-status.go{color:var(--good);text-shadow:0 0 12px rgba(61,245,160,.6)}
.on-sub{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--mute);font-family:var(--head);font-size:14px;letter-spacing:.06em;text-transform:uppercase}
.on-cd{font-family:var(--display);color:var(--warn)}
.on-duel{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.on-duelp{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);min-width:0}
.on-duelp b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--head);font-size:15px}
.on-duelp.turn{border-color:var(--cyan);box-shadow:var(--glow-c)}
.on-duelp .on-sc{font-family:var(--display);font-size:18px}
.on-piece{width:18px;height:18px;flex:0 0 18px;border-radius:50%;display:inline-block}
.on-p1{background:radial-gradient(circle at 35% 35%,#ff9ad9,var(--pink));box-shadow:0 0 10px var(--pink)}
.on-p2{background:radial-gradient(circle at 35% 35%,#b5f7ff,var(--cyan));box-shadow:0 0 10px var(--cyan)}
.on-c4{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;padding:8px;border-radius:var(--r);background:linear-gradient(180deg,#1b1342,#0f0a24);border:1px solid var(--line);box-shadow:0 0 30px rgba(168,85,247,.25)}
.on-c4c{aspect-ratio:1;border-radius:50%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:0;min-width:0;box-shadow:inset 0 2px 6px rgba(0,0,0,.6)}
.on-c4c i{display:block;width:84%;height:84%;border-radius:50%}
.on-c4.can .on-c4c{cursor:pointer}
.on-wl{animation:onPulse .6s infinite alternate}
.on-last{outline:2px solid #fff;outline-offset:1px}
.on-t3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:340px;margin:0 auto;width:100%}
.on-t3c{aspect-ratio:1;border-radius:16px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--display);font-size:46px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0;min-width:0}
.on-x{color:var(--pink);text-shadow:var(--glow-p)}
.on-o{color:var(--cyan);text-shadow:var(--glow-c)}
.on-t3c.on-wl{background:rgba(255,255,255,.12)}
.on-ut{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.on-utb{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:3px;border-radius:10px;border:1px solid var(--line-2);position:relative;background:rgba(0,0,0,.25)}
.on-utb.act{border-color:var(--cyan);box-shadow:var(--glow-c);background:rgba(0,229,255,.07)}
.on-utc{aspect-ratio:1;border-radius:5px;background:rgba(255,255,255,.06);font-family:var(--display);font-size:17px;font-weight:800;padding:0;min-width:0;display:flex;align-items:center;justify-content:center}
.on-utw{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:58px;font-weight:800;background:rgba(8,8,18,.66);border-radius:10px;pointer-events:none}
.on-rpad{min-height:300px;flex-direction:column;gap:6px;font-family:var(--display);font-size:30px;font-weight:800;transition:background .08s}
.on-rpad small{font-family:var(--body);font-size:14px;font-weight:400;color:var(--mute)}
.on-rpad.wait{background:rgba(255,84,112,.2);border-color:var(--bad)}
.on-rpad.go{background:rgba(61,245,160,.42);border-color:var(--good);box-shadow:0 0 44px rgba(61,245,160,.55);color:#062014}
.on-rpad.go small{color:#062014}
.on-rpad.early{background:rgba(255,201,60,.2);border-color:var(--warn)}
.on-rpad.done{background:rgba(0,229,255,.12);border-color:var(--cyan)}
.on-q{font-family:var(--head);font-weight:700;font-size:21px;line-height:1.25;text-align:center}
.on-ans{display:grid;gap:9px}
.on-ab{min-height:54px;text-align:left;padding:11px 14px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line);font-size:16px;font-weight:600;display:flex;gap:10px;align-items:center}
.on-ab i{font-style:normal;font-family:var(--display);color:var(--cyan);width:20px}
.on-ab.sel{border-color:var(--cyan);box-shadow:var(--glow-c)}
.on-ab.ok{background:rgba(61,245,160,.2);border-color:var(--good)}
.on-ab.bad{background:rgba(255,84,112,.2);border-color:var(--bad)}
.on-ab:disabled{cursor:default}
.on-cv{width:100%;aspect-ratio:1;display:block;border-radius:var(--r);border:1px solid var(--line);touch-action:none;background:#0d0a1c;box-shadow:0 0 30px rgba(168,85,247,.2)}
.on-tools{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.on-sw{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.18)}
.on-sw[aria-pressed="true"]{border-color:#fff;box-shadow:0 0 12px rgba(255,255,255,.6)}
.on-word{font-family:var(--display);font-weight:800;font-size:24px;letter-spacing:.28em;text-align:center;color:var(--ink);overflow-wrap:anywhere}
.on-word.secret{color:var(--good);letter-spacing:.08em;text-shadow:0 0 12px rgba(61,245,160,.5)}
.on-feed{display:flex;flex-direction:column;gap:4px;font-size:14px;max-height:130px;overflow-y:auto;overflow-wrap:anywhere}
.on-feed .ok{color:var(--good);font-weight:700}
.on-feed .near{color:var(--warn)}
.on-rank{display:flex;flex-direction:column;gap:8px}
.on-rank .on-pl:first-child{border-color:var(--warn);box-shadow:0 0 16px rgba(255,201,60,.35)}
.on-medal{font-size:22px;width:30px;text-align:center}
.on-res{display:flex;flex-direction:column;gap:6px}
`;
  document.head.append(el('style', { id: 'on-style', text: css }));
}

/* ---------- Inhalte ---------- */
/* Quizfragen: a[0] ist immer richtig (Reihenfolge wird pro Frage gemischt) */
const QUIZ = [
  ['Was ist die Hauptstadt von Österreich?', ['Wien', 'Graz', 'Salzburg', 'Linz']],
  ['Wie viele Beine hat eine Spinne?', ['8', '6', '10', '12']],
  ['Welcher Planet ist der Sonne am nächsten?', ['Merkur', 'Venus', 'Mars', 'Erde']],
  ['Wie viele Minuten hat eine Stunde?', ['60', '100', '50', '30']],
  ['Was ist der größte Ozean der Erde?', ['Pazifik', 'Atlantik', 'Indischer Ozean', 'Arktischer Ozean']],
  ['Was ist die chemische Formel von Wasser?', ['H2O', 'CO2', 'O2', 'NaCl']],
  ['Welche Farbe entsteht aus Blau und Gelb?', ['Grün', 'Lila', 'Orange', 'Braun']],
  ['Wer malte die Mona Lisa?', ['Leonardo da Vinci', 'Michelangelo', 'Pablo Picasso', 'Vincent van Gogh']],
  ['Wie heißt der höchste Berg Österreichs?', ['Großglockner', 'Wildspitze', 'Dachstein', 'Zugspitze']],
  ['Wie viele Spieler hat ein Fußballteam auf dem Feld?', ['11', '10', '9', '12']],
  ['In welcher Einheit misst man elektrischen Widerstand?', ['Ohm', 'Volt', 'Ampere', 'Watt']],
  ['In welcher Einheit misst man elektrische Spannung?', ['Volt', 'Ampere', 'Watt', 'Ohm']],
  ['Was ist das größte Tier der Welt?', ['Blauwal', 'Afrikanischer Elefant', 'Giraffe', 'Pottwal']],
  ['Wie viele Tage hat ein Schaltjahr?', ['366', '365', '364', '367']],
  ['Welcher Fluss fließt durch Wien?', ['Donau', 'Rhein', 'Inn', 'Mur']],
  ['Was ist die Landeshauptstadt der Steiermark?', ['Graz', 'Klagenfurt', 'Innsbruck', 'Linz']],
  ['Was ist 7 × 8?', ['56', '54', '64', '48']],
  ['Wie viele Seiten hat ein Sechseck?', ['6', '5', '8', '7']],
  ['Welches Gas nehmen Pflanzen für die Photosynthese auf?', ['Kohlendioxid', 'Sauerstoff', 'Stickstoff', 'Helium']],
  ['Welcher Planet ist der größte im Sonnensystem?', ['Jupiter', 'Saturn', 'Neptun', 'Erde']],
  ['In welchem Land stehen die Pyramiden von Gizeh?', ['Ägypten', 'Mexiko', 'Peru', 'Griechenland']],
  ['Wie viele Bits hat ein Byte?', ['8', '4', '16', '10']],
  ['Was ist die Hauptstadt von Frankreich?', ['Paris', 'Lyon', 'Marseille', 'Nizza']],
  ['Welche Sprache spricht man in Brasilien hauptsächlich?', ['Portugiesisch', 'Spanisch', 'Englisch', 'Französisch']],
  ['Wie viele Saiten hat eine normale Gitarre?', ['6', '4', '5', '8']],
  ['Bei wie viel °C gefriert Wasser (bei Normaldruck)?', ['0 °C', '-10 °C', '4 °C', '10 °C']],
  ['Wer komponierte „Die Zauberflöte“?', ['Mozart', 'Beethoven', 'Bach', 'Haydn']],
  ['Welches Metall ist bei Raumtemperatur flüssig?', ['Quecksilber', 'Blei', 'Zinn', 'Aluminium']],
  ['Welches ist das schnellste Landtier?', ['Gepard', 'Löwe', 'Pferd', 'Strauß']],
  ['Welches Organ pumpt das Blut durch den Körper?', ['Herz', 'Lunge', 'Leber', 'Niere']],
  ['Welches Spiel kaufte Microsoft im Jahr 2014?', ['Minecraft', 'Roblox', 'Fortnite', 'Among Us']],
  ['Was ist die Quadratwurzel von 81?', ['9', '8', '7', '18']],
  ['Welcher Kontinent ist der größte?', ['Asien', 'Afrika', 'Europa', 'Australien']],
  ['Wie heißt der längste Fluss Europas?', ['Wolga', 'Donau', 'Rhein', 'Elbe']],
  ['Wie viele Bundesländer hat Österreich?', ['9', '8', '10', '16']],
  ['Welcher Vogel kann auch rückwärts fliegen?', ['Kolibri', 'Spatz', 'Adler', 'Taube']],
  ['Wie viel Grad hat ein rechter Winkel?', ['90°', '180°', '45°', '360°']],
  ['Wofür steht „www“ in Internetadressen?', ['World Wide Web', 'Wide World Web', 'World Web Wide', 'Web World Wide']],
  ['Welches Element hat das Symbol „Fe“?', ['Eisen', 'Fluor', 'Zinn', 'Blei']],
  ['Welcher Planet wird „Roter Planet“ genannt?', ['Mars', 'Venus', 'Jupiter', 'Merkur']],
  ['Welches Land hat die Form eines Stiefels?', ['Italien', 'Spanien', 'Griechenland', 'Portugal']],
  ['Wie viele Felder hat ein Schachbrett?', ['64', '81', '49', '100']],
  ['Welches Säugetier legt Eier?', ['Schnabeltier', 'Delfin', 'Fledermaus', 'Känguru']],
  ['Wer betrat als erster Mensch den Mond?', ['Neil Armstrong', 'Buzz Aldrin', 'Juri Gagarin', 'Michael Collins']],
  ['Womit misst man die elektrische Stromstärke?', ['Amperemeter', 'Voltmeter', 'Thermometer', 'Barometer']],
  ['Wie viele Ecken hat ein Würfel?', ['8', '6', '12', '4']],
  ['Wie viele Stunden hat ein Tag?', ['24', '12', '20', '48']],
  ['Was ist die Hauptstadt von Deutschland?', ['Berlin', 'München', 'Hamburg', 'Frankfurt']],
  ['Wie viele Augen hat ein normaler Spielwürfel insgesamt?', ['21', '18', '24', '36']],
  ['Welches Tier ist das Wappentier Österreichs?', ['Adler', 'Löwe', 'Bär', 'Hirsch']],
  ['Was ist 15 + 27?', ['42', '32', '41', '52']]
];
const WORDS = ['Haus', 'Katze', 'Hund', 'Sonne', 'Baum', 'Auto', 'Fisch', 'Blume', 'Brille', 'Pizza', 'Rakete', 'Schiff', 'Apfel', 'Banane',
  'Schneemann', 'Regenschirm', 'Fahrrad', 'Gitarre', 'Krone', 'Schlüssel', 'Herz', 'Stern', 'Mond', 'Wolke', 'Berg', 'Brücke', 'Uhr', 'Handy',
  'Burger', 'Eis', 'Drache', 'Geist', 'Roboter', 'Zug', 'Flugzeug', 'Ballon', 'Kerze', 'Pilz', 'Schlange', 'Spinne', 'Biene', 'Schildkröte',
  'Elefant', 'Giraffe', 'Leiter', 'Hammer', 'Glühbirne', 'Kamera', 'Kuchen', 'Ball', 'Zelt', 'Insel', 'Vulkan', 'Regenbogen', 'Schwert',
  'Schatz', 'Pinguin', 'Zahnbürste', 'Kaktus', 'Tisch', 'Stuhl', 'Bett', 'Fenster', 'Hut', 'Schuh', 'Maus', 'Brot', 'Blitz', 'Anker', 'Krake'];
const PAL = ['#F5F5FF', '#00E5FF', '#A855F7', '#FF36B8', '#3DF5A0', '#FFC93C', '#FF5470', '#0d0a1c'];
const WID = [3, 7, 14, 30];
const CV_BG = '#0d0a1c';

/* ---------- Spiele (Host-Logik + Ansicht) ---------- */
const GAMES = {};
const LINES3 = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function line3(b, off, pc){ for(const l of LINES3) if(l.every(i => b[off + i] === pc)) return l.map(i => off + i); return null; }

/* gemeinsamer Rahmen für 2-Spieler-Zugspiele */
function duel(spec){
  const G = Object.assign({
    min: 2, max: 2, rounds: [1, 3, 5], dRounds: 3, roundsLabel: 'Partien', times: [0, 15, 30], dTime: 0, timeLabel: 'Zeit pro Zug', drop: false,
    init(S, H){
      const p = S.players.slice(0, 2).map(x => x.u);
      const g = { p, sc: {}, k: 0, b: [], t: 0, over: null, lc: -1, n: 0 };
      p.forEach(u => g.sc[u] = 0);
      this.next(S, g, H); return g;
    },
    next(S, g, H){
      g.k++; g.t = (g.k - 1) % 2; g.over = null; g.lc = -1; g.n = 0;
      spec.reset(g, S.rules);
      H.dl(S.rules.time ? S.rules.time * 1000 : null);
    },
    intent(S, g, u, d, H){
      if(d.a !== 'mv' || g.over || u !== g.p[g.t]) return false;
      const m = int(d.m, 0, 80, -1);
      if(m < 0 || !spec.legal(g, m)) return false;
      this.play(S, g, m, H); return true;
    },
    play(S, g, m, H){
      const res = spec.apply(g, m, g.t + 1); g.n++;
      if(res){ g.over = res; if(res.w) g.sc[g.p[res.w - 1]]++; H.dl(3500); }
      else { g.t = 1 - g.t; H.dl(S.rules.time ? S.rules.time * 1000 : null); }
    },
    timeout(S, g, H){
      if(g.over){
        const need = Math.floor(S.rules.rounds / 2) + 1;
        if(g.k >= S.rules.rounds || g.p.some(u => g.sc[u] >= need)) H.end(); else this.next(S, g, H);
        return true;
      }
      const ms = spec.moves(g); if(!ms.length) return false;
      this.play(S, g, ms[Math.floor(Math.random() * ms.length)], H); return true;
    },
    valid(g, players, rules){
      return isObj(g) && uidList(g.p, 2) && g.p.length === 2 && Array.isArray(g.b) && g.b.length === spec.size(g) &&
        g.b.every(v => v === 0 || v === 1 || v === 2) && (g.t === 0 || g.t === 1) && int(g.k, 1, 9, 0) > 0 && int(g.n, 0, 99, -1) >= 0 &&
        scoreObj(g.sc, g.p) && int(g.lc, -1, 80, -2) > -2 &&
        (g.over === null || (isObj(g.over) && int(g.over.w, 0, 2, -1) >= 0 && Array.isArray(g.over.line) && g.over.line.length <= 9 && g.over.line.every(i => int(i, 0, 80, -1) >= 0))) &&
        (!spec.validX || spec.validX(g));
    },
    render(area, S, g, V){
      const mi = g.p.indexOf(V.me), can = mi >= 0 && g.t === mi && !g.over && !S.paused;
      const key = g.k + ':' + g.n;
      if(V.local.key !== key){
        if(V.local.key){ if(g.over){ V.sound(g.over.w && g.p[g.over.w - 1] === V.me ? 'win' : g.over.w && mi >= 0 ? 'lose' : 'pop'); } else V.sound('move'); }
        if(can && V.local.key) V.vibrate(15);
        V.local.key = key;
      }
      const status = g.over ? (g.over.w ? (g.p[g.over.w - 1] === V.me ? 'Du gewinnst die Partie! 🎉' : V.name(g.p[g.over.w - 1]) + ' gewinnt die Partie') : 'Unentschieden!')
        : can ? 'Du bist dran!' : (V.name(g.p[g.t]) + ' ist dran…');
      area.append(el('div', { class: 'b-stack tight' }, [
        el('div', { class: 'on-duel' }, g.p.map((u, i) => el('div', { class: 'on-duelp' + (g.t === i && !g.over ? ' turn' : '') }, [
          spec.token(i + 1), el('b', { text: V.name(u) + (u === V.me ? ' (du)' : '') }), el('span', { class: 'on-sc', text: String(g.sc[u] || 0) })
        ]))),
        el('div', { class: 'on-sub' }, [el('span', { text: spec.label(g) + ' · Partie ' + g.k + '/' + S.rules.rounds }), S.rules.time && !g.over ? el('span', { class: 'on-cd', text: '' }) : el('span', { text: '' })]),
        el('div', { class: 'on-status' + (can ? ' go' : ''), text: status })
      ]));
      area.append(spec.board(g, can, m => V.intent({ a: 'mv', m }, s => s.g.k === g.k && s.g.n === g.n && !s.g.over)));
      if(mi < 0) area.append(el('p', { class: 'b-hint', text: 'Du schaust zu.' }));
    }
  }, spec);
  return G;
}

GAMES.c4 = duel({
  id: 'c4', name: 'Vier gewinnt', icon: '🔴', desc: 'Steine fallen lassen – vier in einer Reihe gewinnt.',
  size: () => 42,
  label: () => 'Vier gewinnt',
  reset(g){ g.b = Array(42).fill(0); },
  legal: (g, m) => m >= 0 && m < 7 && g.b[m] === 0,
  moves: g => [0, 1, 2, 3, 4, 5, 6].filter(c => g.b[c] === 0),
  apply(g, col, pc){
    let r = 5; while(r >= 0 && g.b[r * 7 + col] !== 0) r--;
    const i = r * 7 + col; g.b[i] = pc; g.lc = i;
    for(const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]){
      const line = [i];
      for(const s of [1, -1]){ let rr = r + dr * s, cc = col + dc * s; while(rr >= 0 && rr < 6 && cc >= 0 && cc < 7 && g.b[rr * 7 + cc] === pc){ line.push(rr * 7 + cc); rr += dr * s; cc += dc * s; } }
      if(line.length >= 4) return { w: pc, line: line.slice(0, 9) };
    }
    return g.b.slice(0, 7).every(v => v) ? { w: 0, line: [] } : null;
  },
  token: pc => el('span', { class: 'on-piece on-p' + pc }),
  board(g, can, mv){
    const w = el('div', { class: 'on-c4' + (can ? ' can' : ''), role: 'grid', 'aria-label': 'Vier-gewinnt-Brett' });
    for(let r = 0; r < 6; r++) for(let c = 0; c < 7; c++){
      const i = r * 7 + c, v = g.b[i];
      const cls = v ? 'on-p' + v + (g.over && g.over.line.includes(i) ? ' on-wl' : '') + (i === g.lc ? ' on-last' : '') : '';
      w.append(el('button', { class: 'on-c4c', 'data-col': c, 'aria-label': 'Spalte ' + (c + 1), onclick: () => { if(can && g.b[c] === 0) mv(c); } }, [el('i', { class: cls })]));
    }
    return w;
  }
});

GAMES.ttt = duel({
  id: 'ttt', name: 'Tic-Tac-Toe', icon: '❌', desc: 'Klassisch 3×3 oder Ultimate mit 9 Feldern im Feld.',
  variants: [{ id: 'normal', label: 'Normal' }, { id: 'ultimate', label: 'Ultimate' }],
  size: g => g.u ? 81 : 9,
  label: g => g.u ? 'Ultimate' : 'Normal',
  reset(g, rules){ g.u = rules.variant === 'ultimate'; g.b = Array(g.u ? 81 : 9).fill(0); g.sb = g.u ? Array(9).fill(0) : null; g.nx = -1; },
  validX: g => typeof g.u === 'boolean' && (g.u ? Array.isArray(g.sb) && g.sb.length === 9 && g.sb.every(v => int(v, 0, 3, -1) >= 0) && int(g.nx, -1, 8, -2) > -2 : g.sb === null),
  legal(g, m){
    if(!g.u) return m < 9 && g.b[m] === 0;
    const bi = Math.floor(m / 9);
    return m < 81 && g.b[m] === 0 && g.sb[bi] === 0 && (g.nx < 0 || g.nx === bi);
  },
  moves(g){ const r = []; for(let i = 0; i < g.b.length; i++) if(this.legal(g, i)) r.push(i); return r; },
  apply(g, m, pc){
    g.b[m] = pc; g.lc = m;
    if(!g.u){ const l = line3(g.b, 0, pc); if(l) return { w: pc, line: l }; return g.b.every(v => v) ? { w: 0, line: [] } : null; }
    const bi = Math.floor(m / 9), ci = m % 9;
    if(line3(g.b, bi * 9, pc)) g.sb[bi] = pc;
    else if(g.b.slice(bi * 9, bi * 9 + 9).every(v => v)) g.sb[bi] = 3;
    const big = line3(g.sb, 0, pc); if(big) return { w: pc, line: big };
    if(g.sb.every(v => v)) return { w: 0, line: [] };
    g.nx = g.sb[ci] === 0 ? ci : -1;
    return null;
  },
  token: pc => el('span', { class: pc === 1 ? 'on-x' : 'on-o', style: { fontFamily: 'var(--display)', fontWeight: 800, fontSize: '18px' }, text: pc === 1 ? 'X' : 'O' }),
  board(g, can, mv){
    const sym = v => v === 1 ? 'X' : v === 2 ? 'O' : '';
    const cl = v => v === 1 ? ' on-x' : v === 2 ? ' on-o' : '';
    if(!g.u){
      const w = el('div', { class: 'on-t3' });
      g.b.forEach((v, i) => w.append(el('button', { class: 'on-t3c' + cl(v) + (g.over && g.over.line.includes(i) ? ' on-wl' : ''), 'data-cell': i, 'aria-label': 'Feld ' + (i + 1), text: sym(v), onclick: () => { if(can && this.legal(g, i)) mv(i); } })));
      return w;
    }
    const w = el('div', { class: 'on-ut' });
    for(let bi = 0; bi < 9; bi++){
      const act = can && g.sb[bi] === 0 && (g.nx < 0 || g.nx === bi);
      const sb = el('div', { class: 'on-utb' + (act ? ' act' : '') });
      for(let ci = 0; ci < 9; ci++){
        const i = bi * 9 + ci, v = g.b[i];
        sb.append(el('button', { class: 'on-utc' + cl(v) + (i === g.lc ? ' on-last' : ''), 'data-cell': i, 'aria-label': 'Feld ' + (bi + 1) + '-' + (ci + 1), text: sym(v), onclick: () => { if(can && this.legal(g, i)) mv(i); } }));
      }
      if(g.sb[bi]) sb.append(el('div', { class: 'on-utw' + cl(g.sb[bi]) + (g.over && g.over.line.includes(bi) ? ' on-wl' : ''), text: g.sb[bi] === 3 ? '–' : sym(g.sb[bi]) }));
      w.append(sb);
    }
    return w;
  }
});

GAMES.react = {
  id: 'react', name: 'Reaktionsduell', icon: '⚡', min: 2, max: 8, desc: 'Warte auf Grün – wer zuerst tippt, gewinnt die Runde.',
  rounds: [3, 5, 7], dRounds: 5, roundsLabel: 'Runden', times: null, drop: true,
  init(S, H){ const g = { r: 0, ph: 'ready', rid: '', delay: 0, res: {}, sc: {}, best: {}, pl: S.players.map(p => p.u), win: null }; g.pl.forEach(u => g.sc[u] = 0); this.round(S, g, H); return g; },
  round(S, g, H){ g.r++; g.ph = 'ready'; g.rid = rid(8); g.delay = 1500 + Math.floor(Math.random() * 3000); g.res = {}; g.win = null; H.dl(g.delay + 5000); },
  intent(S, g, u, d, H){
    if(d.a !== 'react' || g.ph !== 'ready' || d.rid !== g.rid || !g.pl.includes(u) || own(g.res, u)) return false;
    if(d.early === true) g.res[u] = -1;
    else { const ms = d.ms; if(typeof ms !== 'number' || !isFinite(ms) || ms < 0 || ms > 10000) return false; g.res[u] = Math.max(60, Math.round(ms)); }
    if(g.pl.every(x => own(g.res, x))) this.fin(S, g, H);
    return true;
  },
  fin(S, g, H){
    const ok = g.pl.filter(u => g.res[u] > 0).sort((a, b) => g.res[a] - g.res[b]);
    ok.forEach((u, i) => { g.sc[u] += [3, 2, 1][i] || 0; if(!g.best[u] || g.res[u] < g.best[u]) g.best[u] = g.res[u]; });
    g.pl.forEach(u => { if(g.res[u] === -1) g.sc[u] -= 2; });
    g.win = ok[0] || null; g.ph = 'res'; H.dl(3200);
  },
  timeout(S, g, H){ if(g.ph === 'ready') this.fin(S, g, H); else if(g.r >= S.rules.rounds) H.end(); else this.round(S, g, H); return true; },
  drop(S, g, u, H){ g.pl = g.pl.filter(x => x !== u); if(g.ph === 'ready' && g.pl.length && g.pl.every(x => own(g.res, x))) this.fin(S, g, H); },
  tb: (g, u) => g.best[u] || 99999,
  extra: (g, u) => g.best[u] ? 'Best ' + g.best[u] + ' ms' : '',
  valid(g){
    return isObj(g) && uidList(g.pl, 8) && int(g.r, 1, 20, 0) > 0 && (g.ph === 'ready' || g.ph === 'res') && typeof g.rid === 'string' && g.rid.length <= 12 &&
      int(g.delay, 0, 10000, -1) >= 0 && isObj(g.res) && Object.keys(g.res).every(k => isUid(k) && int(g.res[k], -1, 10000, -2) > -2) &&
      scoreObj(g.sc) && scoreObj(g.best) && (g.win === null || isUid(g.win));
  },
  render(area, S, g, V){
    const L = V.local;
    if(L.rid !== g.rid){
      clearTimeout(L.to); L.rid = g.rid; L.state = 'wait'; L.ms = 0;
      if(g.ph === 'ready' && V.isPlayer && g.pl.includes(V.me)){
        const r = g.rid;
        L.to = V.timeout(() => { if(L.rid !== r || L.state !== 'wait') return; L.state = 'go'; L.greenAt = performance.now(); L.paint && L.paint(); V.sound('pop'); V.vibrate(25); }, g.delay);
      } else L.state = 'watch';
    }
    const playing = g.pl.includes(V.me);
    area.append(el('div', { class: 'on-sub' }, [el('span', { text: 'Runde ' + g.r + '/' + S.rules.rounds }), el('span', { text: playing ? 'Du: ' + (g.sc[V.me] || 0) + ' Pkt.' : 'Zuschauer' })]));
    if(g.ph === 'ready'){
      const pad = el('div', { class: 'b-pad on-rpad', role: 'button', 'aria-label': 'Reaktionsfeld' });
      const paint = () => {
        const st = L.state; pad.className = 'b-pad on-rpad ' + (st === 'go' ? 'go' : st === 'early' ? 'early' : st === 'done' ? 'done' : 'wait');
        pad.innerHTML = '';
        const [t, s] = st === 'go' ? ['JETZT!', 'Tippen!'] : st === 'early' ? ['Zu früh! 😬', '−2 Punkte – warte auf die anderen'] : st === 'done' ? [L.ms + ' ms', 'Warte auf die anderen…'] : st === 'watch' ? ['Warte…', 'Die anderen reagieren gerade'] : ['Warte auf Grün…', 'Nicht zu früh tippen!'];
        pad.append(el('div', { text: t }), el('small', { text: s }));
      };
      L.paint = paint; paint();
      pad.addEventListener('pointerdown', e => {
        e.preventDefault();
        if(!playing || S.paused) return;
        const keep = s => s.g.rid === g.rid && s.g.ph === 'ready' && !own(s.g.res, V.me);
        if(L.state === 'wait'){ L.state = 'early'; clearTimeout(L.to); V.sound('bad'); V.vibrate(60); V.intent({ a: 'react', rid: g.rid, early: true }, keep); }
        else if(L.state === 'go'){ L.ms = Math.round(performance.now() - L.greenAt); L.state = 'done'; V.sound('good'); V.intent({ a: 'react', rid: g.rid, ms: L.ms }, keep); }
        paint();
      });
      area.append(pad);
      const done = g.pl.filter(u => own(g.res, u)).length;
      area.append(el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: done + '/' + g.pl.length + ' haben getippt' }));
    } else {
      L.paint = null;
      const list = g.pl.slice().sort((a, b) => { const x = g.res[a] > 0 ? g.res[a] : 1e9 + (g.res[a] === -1 ? 1 : 2), y = g.res[b] > 0 ? g.res[b] : 1e9 + (g.res[b] === -1 ? 1 : 2); return x - y; });
      area.append(el('div', { class: 'on-status go', text: g.win ? (g.win === V.me ? 'Du warst am schnellsten! ⚡' : V.name(g.win) + ' war am schnellsten') : 'Niemand hat gültig getippt' }));
      area.append(el('div', { class: 'on-res' }, list.map((u, i) => el('div', { class: 'on-pl' + (u === V.me ? ' me' : '') }, [
        el('span', { class: 'on-medal', text: g.res[u] > 0 ? (['🥇', '🥈', '🥉'][i] || '·') : g.res[u] === -1 ? '😬' : '💤' }),
        el('span', { class: 'tx', text: V.name(u) }),
        el('span', { class: 'b-pill ' + (g.res[u] > 0 ? 'cyan' : 'bad'), text: g.res[u] > 0 ? g.res[u] + ' ms' : g.res[u] === -1 ? 'Frühstart' : 'kein Tipp' }),
        el('span', { class: 'on-sc', text: String(g.sc[u] || 0) })
      ]))));
      if(L.lastRes !== g.rid){ L.lastRes = g.rid; V.sound(g.win === V.me ? 'good' : 'tap'); }
    }
  }
};

GAMES.quiz = {
  id: 'quiz', name: 'Quiz-Battle', icon: '❓', min: 2, max: 8, desc: 'Alle bekommen dieselbe Frage – schnell & richtig gibt mehr Punkte.',
  rounds: [5, 10, 15], dRounds: 10, roundsLabel: 'Fragen', times: [10, 15, 20], dTime: 15, timeLabel: 'Zeit pro Frage', drop: true,
  init(S, H){ const g = { qn: 0, qi: -1, ord: [0, 1, 2, 3], ph: 'q', ans: {}, sc: {}, used: [], pl: S.players.map(p => p.u) }; g.pl.forEach(u => g.sc[u] = 0); this.q(S, g, H); return g; },
  q(S, g, H){
    g.qn++;
    const free = QUIZ.map((_, i) => i).filter(i => !g.used.includes(i));
    g.qi = free[Math.floor(Math.random() * free.length)]; g.used.push(g.qi);
    g.ord = shuffle([0, 1, 2, 3]); g.ans = {}; g.ph = 'q';
    H.dl(S.rules.time * 1000 + 800);
  },
  intent(S, g, u, d, H){
    if(d.a !== 'ans' || g.ph !== 'q' || d.qn !== g.qn || !g.pl.includes(u) || own(g.ans, u)) return false;
    const c = int(d.c, 0, 3, -1); if(c < 0) return false;
    const lim = S.rules.time * 1000, hostEl = Math.max(0, lim + 800 - H.left());
    let ms = typeof d.ms === 'number' && isFinite(d.ms) ? d.ms : lim;
    ms = Math.min(Math.max(ms, hostEl - 2500, 0), hostEl);
    const p = g.ord[c] === 0 ? Math.round(1000 - 600 * Math.min(1, ms / lim)) : 0;
    g.ans[u] = { c, p };
    if(g.pl.every(x => own(g.ans, x))) this.rev(S, g, H);
    return true;
  },
  rev(S, g, H){ g.ph = 'rev'; Object.keys(g.ans).forEach(u => { if(own(g.sc, u)) g.sc[u] += g.ans[u].p; }); H.dl(3800); },
  timeout(S, g, H){ if(g.ph === 'q') this.rev(S, g, H); else if(g.qn >= S.rules.rounds) H.end(); else this.q(S, g, H); return true; },
  drop(S, g, u, H){ g.pl = g.pl.filter(x => x !== u); if(g.ph === 'q' && g.pl.length && g.pl.every(x => own(g.ans, x))) this.rev(S, g, H); },
  valid(g){
    return isObj(g) && uidList(g.pl, 8) && int(g.qn, 1, 50, 0) > 0 && int(g.qi, 0, QUIZ.length - 1, -1) >= 0 &&
      Array.isArray(g.ord) && g.ord.length === 4 && [0, 1, 2, 3].every(i => g.ord.includes(i)) && (g.ph === 'q' || g.ph === 'rev') &&
      isObj(g.ans) && Object.keys(g.ans).every(k => isUid(k) && isObj(g.ans[k]) && int(g.ans[k].c, 0, 3, -1) >= 0 && int(g.ans[k].p, 0, 1000, -1) >= 0) &&
      scoreObj(g.sc) && Array.isArray(g.used) && g.used.length <= 50 && g.used.every(i => int(i, 0, QUIZ.length - 1, -1) >= 0);
  },
  render(area, S, g, V){
    const L = V.local, Q = QUIZ[g.qi], playing = g.pl.includes(V.me);
    if(L.qn !== g.qn){ L.qn = g.qn; L.start = performance.now(); L.choice = -1; if(L.started) V.sound('flip'); L.started = true; }
    const mine = own(g.ans, V.me) ? g.ans[V.me] : null;
    const choice = mine ? mine.c : L.choice;
    area.append(el('div', { class: 'on-sub' }, [el('span', { text: 'Frage ' + g.qn + '/' + S.rules.rounds }), g.ph === 'q' ? el('span', { class: 'on-cd', text: '' }) : el('span', { text: 'Auflösung' })]));
    area.append(el('div', { class: 'b-card glow' }, [el('p', { class: 'on-q', text: Q[0] })]));
    const ans = el('div', { class: 'on-ans' });
    g.ord.forEach((oi, i) => {
      let cls = 'on-ab';
      if(g.ph === 'rev'){ if(oi === 0) cls += ' ok'; else if(i === choice) cls += ' bad'; }
      else if(i === choice) cls += ' sel';
      ans.append(el('button', { class: cls, 'data-ans': i, disabled: g.ph !== 'q' || choice >= 0 || !playing || S.paused ? true : null, onclick: () => {
        if(L.choice >= 0 || !playing || S.paused) return;
        L.choice = i; V.sound('click');
        V.intent({ a: 'ans', qn: g.qn, c: i, ms: Math.round(performance.now() - L.start) }, s => s.g.qn === g.qn && s.g.ph === 'q' && !own(s.g.ans, V.me));
        V.rerender();
      } }, [el('i', { text: 'ABCD'[i] }), el('span', { text: Q[1][oi] })]));
    });
    area.append(ans);
    if(g.ph === 'q'){
      area.append(el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: Object.keys(g.ans).length + '/' + g.pl.length + ' haben geantwortet' + (choice >= 0 ? ' · warte auf die anderen' : '') }));
    } else {
      if(L.revd !== g.qn){ L.revd = g.qn; V.sound(mine && mine.p > 0 ? 'good' : playing ? 'bad' : 'tap'); }
      area.append(el('div', { class: 'on-res' }, g.pl.slice().sort((a, b) => (g.sc[b] || 0) - (g.sc[a] || 0)).map(u => el('div', { class: 'on-pl' + (u === V.me ? ' me' : '') }, [
        el('span', { class: 'on-medal', text: own(g.ans, u) ? (g.ans[u].p > 0 ? '✅' : '❌') : '💤' }),
        el('span', { class: 'tx', text: V.name(u) }),
        el('span', { class: 'b-pill ' + (own(g.ans, u) && g.ans[u].p > 0 ? 'good' : 'bad'), text: '+' + (own(g.ans, u) ? g.ans[u].p : 0) }),
        el('span', { class: 'on-sc', text: String(g.sc[u] || 0) })
      ]))));
    }
  }
};

const drawRL = new Map();
GAMES.draw = {
  id: 'draw', name: 'Zeichne & Rate', icon: '🎨', min: 3, max: 8, desc: 'Eine Person zeichnet, alle anderen raten im Chat.',
  rounds: [1, 2, 3], dRounds: 1, roundsLabel: 'Runden (jeder zeichnet)', times: [60, 80, 100], dTime: 80, timeLabel: 'Zeit pro Bild', drop: true,
  init(S, H){ const g = { pl: S.players.map(p => p.u), turn: 0, tot: 0, dr: '', w: '', ph: 'draw', ok: {}, feed: [], sc: {}, tid: '', usedW: [] }; g.tot = g.pl.length * S.rules.rounds; g.pl.forEach(u => g.sc[u] = 0); this.turn(S, g, H); return g; },
  turn(S, g, H){
    g.dr = g.pl[g.turn % g.pl.length]; g.turn++;
    const free = WORDS.map((_, i) => i).filter(i => !g.usedW.includes(i));
    const wi = free[Math.floor(Math.random() * free.length)]; g.usedW.push(wi); if(g.usedW.length > 40) g.usedW.shift();
    g.w = WORDS[wi]; g.tid = rid(8); g.ok = {}; g.feed = []; g.ph = 'draw';
    H.dl(S.rules.time * 1000);
  },
  intent(S, g, u, d, H){
    if(g.ph !== 'draw' || d.tid !== g.tid || !g.pl.includes(u)) return false;
    if(d.a === 'skip'){ if(u !== g.dr) return false; g.feed.push({ u, k: 'skip', t: '' }); this.rev(S, g, H); return true; }
    if(d.a !== 'guess' || u === g.dr || own(g.ok, u)) return false;
    const now = Date.now(), last = drawRL.get(u) || 0; if(now - last < 600) return false; drawRL.set(u, now);
    const text = str(d.text, 40).trim(); if(!text) return false;
    const m = matchWord(text, g.w);
    if(m === 2){
      const pts = Math.round(60 + 140 * H.left() / (S.rules.time * 1000));
      g.ok[u] = pts; g.sc[u] += pts; if(own(g.sc, g.dr)) g.sc[g.dr] += 30;
      g.feed.push({ u, k: 'ok', t: '' });
    } else g.feed.push({ u, k: m === 1 ? 'near' : 'x', t: m === 1 ? '' : text });
    if(g.feed.length > 10) g.feed.splice(0, g.feed.length - 10);
    if(g.pl.filter(x => x !== g.dr).every(x => own(g.ok, x))) this.rev(S, g, H);
    return true;
  },
  rev(S, g, H){ g.ph = 'rev'; H.dl(4500); },
  timeout(S, g, H){ if(g.ph === 'draw') this.rev(S, g, H); else if(g.turn >= g.tot) H.end(); else this.turn(S, g, H); return true; },
  drop(S, g, u, H){
    const idx = g.pl.indexOf(u); if(idx < 0) return;
    g.pl.splice(idx, 1);
    g.tot = Math.max(g.turn, Math.min(g.tot, g.pl.length * S.rules.rounds));
    if(g.ph === 'draw' && (u === g.dr || g.pl.filter(x => x !== g.dr).every(x => own(g.ok, x)))) this.rev(S, g, H);
  },
  valid(g){
    return isObj(g) && uidList(g.pl, 8) && int(g.turn, 1, 100, 0) > 0 && int(g.tot, 0, 100, -1) >= 0 && isUid(g.dr) && typeof g.w === 'string' && g.w.length > 0 && g.w.length <= 30 &&
      (g.ph === 'draw' || g.ph === 'rev') && scoreObj(g.ok) && scoreObj(g.sc) && typeof g.tid === 'string' && g.tid.length <= 12 &&
      Array.isArray(g.feed) && g.feed.length <= 12 && g.feed.every(f => isObj(f) && typeof f.u === 'string' && ['ok', 'near', 'x', 'skip'].includes(f.k) && typeof f.t === 'string' && f.t.length <= 40) &&
      Array.isArray(g.usedW) && g.usedW.length <= 41;
  },
  /* In-place-Update, damit die Leinwand beim Zeichnen nicht neu aufgebaut wird */
  patch(area, S, g, V){
    const C = V.cache;
    if(!C.root || C.tid !== g.tid || C.ph !== g.ph || C.paused !== !!S.paused) return false;
    this.fill(C, S, g, V); return true;
  },
  fill(C, S, g, V){
    C.head.textContent = 'Bild ' + g.turn + '/' + g.tot + ' · ' + V.name(g.dr) + ' zeichnet';
    C.feed.innerHTML = '';
    const fresh = g.feed.length > (C.feedN || 0) && g.feed.length && g.feed[g.feed.length - 1].k === 'ok';
    if(fresh && C.feedN != null) V.sound('good');
    C.feedN = g.feed.length;
    if(!g.feed.length) C.feed.append(el('div', { class: 'on-sys', text: g.ph === 'draw' ? 'Noch keine Tipps.' : '' }));
    g.feed.forEach(f => {
      const n = V.name(f.u);
      C.feed.append(f.k === 'ok' ? el('div', { class: 'ok', text: '✅ ' + n + ' hat es erraten!' })
        : f.k === 'near' ? el('div', { class: 'near', text: '🔥 ' + n + ' ist knapp dran!' })
        : f.k === 'skip' ? el('div', { class: 'on-sys', text: n + ' hat aufgegeben.' })
        : el('div', {}, [el('b', { style: { color: 'var(--mute)' }, text: n + ': ' }), el('span', { text: f.t })]));
    });
    C.feed.scrollTop = C.feed.scrollHeight;
    const guessed = Object.keys(g.ok).length, need = g.pl.filter(x => x !== g.dr).length;
    C.info.textContent = guessed + '/' + need + ' erraten' + (own(g.ok, V.me) ? ' · du hast es! +' + g.ok[V.me] : '');
  },
  render(area, S, g, V){
    const C = V.cache, me = V.me, iDraw = g.dr === me && g.ph === 'draw';
    if(C.cvTid !== g.tid){ C.cv = el('canvas', { class: 'on-cv', width: 600, height: 600, 'aria-label': 'Zeichenfläche' }); C.cvTid = g.tid; C.bound = false; V.net.attach(C.cv); }
    C.tid = g.tid; C.ph = g.ph; C.paused = !!S.paused; C.feedN = null;
    const root = el('div', { class: 'b-stack tight' });
    C.root = root;
    C.head = el('span'); C.info = el('span');
    root.append(el('div', { class: 'on-sub' }, [C.head, g.ph === 'draw' ? el('span', { class: 'on-cd', text: '' }) : el('span', { text: 'Auflösung' })]));
    if(g.ph === 'rev'){
      root.append(el('div', { class: 'on-word secret', text: 'Das Wort war: ' + g.w }));
      if(C.revd !== g.tid){ C.revd = g.tid; V.sound('check'); }
    } else if(iDraw){
      root.append(el('div', { class: 'b-kicker', style: { textAlign: 'center' }, text: 'Dein Wort – zeichne es!' }), el('div', { class: 'on-word secret', text: g.w }));
    } else {
      root.append(el('div', { class: 'on-word', text: own(g.ok, me) ? g.w : [...g.w].map(ch => ch === ' ' ? ' ' : '_').join('') }));
      root.append(el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: g.pl.includes(me) && !own(g.ok, me) && g.dr !== me ? '💡 Tippe deinen Tipp unten in den Chat!' : (g.pl.includes(me) ? 'Warte, bis alle es erraten haben.' : 'Du schaust zu.') }));
    }
    root.append(C.cv);
    if(!C.bound){
      C.bound = true;
      const cv = C.cv; let cur = null;
      const live = () => { const s = V.S(); return s && s.phase === 'play' && s.gid === 'draw' && s.g.tid === C.cvTid && s.g.ph === 'draw' && s.g.dr === me && !s.paused; };
      const pt = e => { const r = cv.getBoundingClientRect(); return [Math.max(0, Math.min(1000, Math.round((e.clientX - r.left) / r.width * 1000))), Math.max(0, Math.min(1000, Math.round((e.clientY - r.top) / r.height * 1000)))]; };
      const flush = () => { if(!cur || !cur.buf.length) return; const pts = (cur.prev ? cur.prev : []).concat(...cur.buf); if(pts.length === 2) pts.push(pts[0], pts[1]); V.net.send({ k: 's', c: cur.c, w: cur.w, p: pts }); cur.prev = cur.buf[cur.buf.length - 1]; cur.buf = []; };
      const end = () => { if(cur){ flush(); clearInterval(cur.iv); cur = null; } };
      cv.addEventListener('pointerdown', e => {
        if(!live()) return; e.preventDefault();
        try{ cv.setPointerCapture(e.pointerId); }catch(err){}
        const t = V.local.tool || { c: 0, w: 1 };
        const p = pt(e); cur = { c: t.c, w: t.w, prev: null, buf: [p], last: p, iv: setInterval(flush, 70) };
        V.net.dot(p, t.c, t.w);
      });
      cv.addEventListener('pointermove', e => {
        if(!cur) return; e.preventDefault();
        if(!live()){ end(); return; }
        const p = pt(e); if(Math.abs(p[0] - cur.last[0]) + Math.abs(p[1] - cur.last[1]) < 4) return;
        V.net.seg(cur.last, p, cur.c, cur.w); cur.last = p; cur.buf.push(p);
        if(cur.buf.length >= 60) flush();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cv.addEventListener(ev, end));
      V.onCleanup(end);
    }
    if(iDraw){
      const t = V.local.tool = V.local.tool || { c: 0, w: 1 };
      const tools = el('div', { class: 'on-tools' });
      const rt = () => {
        tools.innerHTML = '';
        PAL.forEach((col, i) => tools.append(el('button', { class: 'on-sw', 'aria-label': i === 7 ? 'Radierer' : 'Farbe ' + (i + 1), 'aria-pressed': String(t.c === i), style: { background: i === 7 ? 'repeating-linear-gradient(45deg,#333 0 5px,#111 5px 10px)' : col }, onclick: () => { t.c = i; if(i === 7 && t.w < 2) t.w = 2; V.sound('tap'); rt(); } })));
        WID.forEach((w, i) => tools.append(el('button', { class: 'b-chip', 'aria-pressed': String(t.w === i), text: ['Fein', 'Mittel', 'Dick', 'XXL'][i], onclick: () => { t.w = i; V.sound('tap'); rt(); } })));
      };
      rt();
      root.append(tools, el('div', { class: 'b-grid2' }, [
        el('button', { class: 'b-btn ghost sm', text: '🗑 Leeren', onclick: () => { V.net.send({ k: 'c', c: 0, w: 0, p: [] }); V.sound('flip'); } }),
        el('button', { class: 'b-btn ghost sm', text: '🏳 Aufgeben', onclick: () => { A_confirm(V, 'Wirklich aufgeben? Das Wort wird aufgelöst.', 'Aufgeben').then(ok => { if(ok) V.intent({ a: 'skip', tid: g.tid }); }); } })
      ]));
    }
    C.feed = el('div', { class: 'on-feed', 'aria-live': 'polite' });
    root.append(el('div', { class: 'b-card' }, [el('div', { class: 'on-sub' }, [el('span', { text: 'Tipps' }), C.info]), C.feed]));
    root.append(el('div', { class: 'on-peers' }, g.pl.slice().sort((a, b) => (g.sc[b] || 0) - (g.sc[a] || 0)).map(u => el('span', { class: 'on-peer' + (u === me ? ' you' : '') }, [
      el('span', { text: u === g.dr ? '✏️' : own(g.ok, u) ? '✅' : '🤔' }), el('span', { class: 'on-nm', text: V.name(u) }), el('b', { text: String(g.sc[u] || 0) })
    ]))));
    area.append(root);
    this.fill(C, S, g, V);
  }
};
function A_confirm(V, t, ok){ return V.confirm(t, ok, 'Abbrechen'); }

/* Strich-Übertragung für Zeichne & Rate (Chunks mit Sequenznummern, Nachforderung bei Lücken) */
function makeDrawNet(emit, getMe){
  const N = { tid: '', dr: '', out: [], inn: new Map(), next: 0, max: -1, cv: null, cx: null, lastNeed: 0, budget: 0, budgetAt: 0 };
  const ctx = () => N.cx;
  const bg = () => { const c = ctx(); if(!c) return; c.fillStyle = CV_BG; c.fillRect(0, 0, 600, 600); };
  const sty = (c, col, w) => { c.strokeStyle = PAL[col]; c.fillStyle = PAL[col]; c.lineWidth = WID[w]; c.lineCap = 'round'; c.lineJoin = 'round'; };
  function paint(ch){
    const c = ctx(); if(!c) return;
    if(ch.k === 'c'){ bg(); return; }
    sty(c, ch.c, ch.w); const p = ch.p;
    c.beginPath(); c.moveTo(p[0] * .6, p[1] * .6);
    for(let i = 2; i < p.length; i += 2) c.lineTo(p[i] * .6, p[i + 1] * .6);
    if(p.length === 4 && p[0] === p[2] && p[1] === p[3]){ c.arc(p[0] * .6, p[1] * .6, WID[ch.w] / 2, 0, Math.PI * 2); c.fill(); } else c.stroke();
  }
  function validChunk(d){
    if(d.k !== 's' && d.k !== 'c') return null;
    const c = int(d.c, 0, PAL.length - 1, -1), w = int(d.w, 0, WID.length - 1, -1), seq = int(d.seq, 0, 100000, -1);
    if(c < 0 || w < 0 || seq < 0) return null;
    if(d.k === 'c') return { k: 'c', c: 0, w: 0, p: [], seq };
    if(!Array.isArray(d.p) || d.p.length < 4 || d.p.length > 260 || d.p.length % 2 || !d.p.every(v => int(v, 0, 1000, -1) >= 0)) return null;
    return { k: 's', c, w, p: d.p.slice(), seq };
  }
  N.reset = (tid, dr) => { if(N.tid === tid) return; N.tid = tid; N.dr = dr; N.out = []; N.inn = new Map(); N.next = 0; N.max = -1; N.cv = null; N.cx = null; };
  N.attach = cv => {
    N.cv = cv; N.cx = cv.getContext('2d'); bg();
    if(N.dr === getMe()) N.out.forEach(paint);
    else for(let i = 0; i < N.next; i++) if(N.inn.has(i)) paint(N.inn.get(i));
  };
  N.send = ch => {
    if(N.dr !== getMe() || !N.tid) return;
    const c = Object.assign({}, ch, { seq: N.out.length }); N.out.push(c);
    if(c.k === 'c') paint(c);
    emit({ type: 'draw', tid: N.tid, k: c.k, c: c.c, w: c.w, p: c.p, seq: c.seq });
  };
  N.seg = (a, b, col, w) => { const c = ctx(); if(!c) return; sty(c, col, w); c.beginPath(); c.moveTo(a[0] * .6, a[1] * .6); c.lineTo(b[0] * .6, b[1] * .6); c.stroke(); };
  N.dot = (a, col, w) => { const c = ctx(); if(!c) return; sty(c, col, w); c.beginPath(); c.arc(a[0] * .6, a[1] * .6, WID[w] / 2, 0, Math.PI * 2); c.fill(); };
  N.have = () => { if(N.dr === getMe() && N.tid) emit({ type: 'dhave', tid: N.tid, n: N.out.length }); };
  N.need = () => {
    if(Date.now() - N.lastNeed < 1200) return;
    const miss = []; for(let i = N.next; i <= N.max && miss.length < 40; i++) if(!N.inn.has(i)) miss.push(i);
    if(miss.length){ N.lastNeed = Date.now(); emit({ type: 'dneed', tid: N.tid, miss }); }
  };
  N.onMsg = (d, u) => {
    if(d.tid !== N.tid || !N.tid) return;
    if(d.type === 'draw'){
      if(u !== N.dr || N.dr === getMe()) return;
      const ch = validChunk(d); if(!ch || N.inn.has(ch.seq) || ch.seq < N.next) return;
      N.inn.set(ch.seq, ch); N.max = Math.max(N.max, ch.seq);
      while(N.inn.has(N.next)){ paint(N.inn.get(N.next)); N.next++; }
      if(N.max >= N.next) N.need();
    } else if(d.type === 'dhave'){
      if(u !== N.dr || N.dr === getMe()) return;
      const n = int(d.n, 0, 100000, -1); if(n < 0) return;
      N.max = Math.max(N.max, n - 1); if(N.max >= N.next) N.need();
    } else if(d.type === 'dneed'){
      if(N.dr !== getMe() || !Array.isArray(d.miss)) return;
      const now = Date.now(); if(now - N.budgetAt > 1000){ N.budgetAt = now; N.budget = 120; }
      d.miss.slice(0, 40).forEach(s => { const i = int(s, 0, 100000, -1); if(i < 0 || i >= N.out.length || N.budget <= 0) return; N.budget--; const c = N.out[i]; emit({ type: 'draw', tid: N.tid, k: c.k, c: c.c, w: c.w, p: c.p, seq: c.seq }); });
    }
  };
  return N;
}

function cleanRules(G, r){
  r = isObj(r) ? r : {};
  return {
    rounds: G.rounds.includes(r.rounds) ? r.rounds : G.dRounds,
    time: G.times ? (G.times.includes(r.time) ? r.time : G.dTime) : 0,
    variant: G.variants ? (G.variants.some(v => v.id === r.variant) ? r.variant : G.variants[0].id) : ''
  };
}
function rulesText(G, rules){
  const t = [G.roundsLabel + ': ' + rules.rounds];
  if(G.times) t.push((G.timeLabel || 'Zeit') + ': ' + (rules.time ? rules.time + ' s' : 'aus'));
  if(G.variants) t.push('Variante: ' + G.variants.find(v => v.id === rules.variant).label);
  return t.join(' · ');
}
function cleanState(s){
  if(!isObj(s)) return null;
  try{ if(JSON.stringify(s).length > 30000) return null; }catch(e){ return null; }
  const v = int(s.v, 0, 1e9, -1); if(v < 0) return null;
  if(!isUid(s.host) || typeof s.code !== 'string' || !CODE_RE.test(s.code)) return null;
  if(typeof s.gid !== 'string' || !own(GAMES, s.gid)) return null;
  const G = GAMES[s.gid];
  const max = int(s.max, G.min, G.max, -1); if(max < 0) return null;
  const rules = cleanRules(G, s.rules);
  if(!Array.isArray(s.players) || s.players.length > 8) return null;
  const players = [];
  for(const p of s.players){ if(!isObj(p) || !isUid(p.u) || players.some(x => x.u === p.u)) return null; players.push({ u: p.u, n: cleanName(p.n), a: cleanAv(p.a) }); }
  const banned = Array.isArray(s.banned) ? s.banned.filter(isUid).slice(0, 40) : [];
  if(!['lobby', 'play', 'end'].includes(s.phase)) return null;
  const mid = int(s.mid, 0, 1e6, 0);
  const paused = isObj(s.paused) && Array.isArray(s.paused.who) ? { who: s.paused.who.filter(isUid).slice(0, 8) } : null;
  const left = typeof s.left === 'number' && isFinite(s.left) ? Math.max(0, Math.min(600000, s.left)) : null;
  let g = null;
  if(s.phase === 'play'){ try{ if(!G.valid(s.g, players, rules)) return null; }catch(e){ return null; } g = s.g; }
  let rank = null;
  if(s.phase === 'end'){
    if(!Array.isArray(s.rank)) return null;
    rank = s.rank.slice(0, 8).filter(isObj).map(r => ({ u: isUid(r.u) ? r.u : '', n: cleanName(r.n), a: cleanAv(r.a), s: typeof r.s === 'number' && isFinite(r.s) ? Math.round(r.s) : 0, x: str(r.x, 24) }));
  }
  return { v, host: s.host, code: s.code, gid: s.gid, max, pub: s.pub === true, rules, players, banned, phase: s.phase, mid, paused, left, g, rank, note: str(s.note, 80) };
}

/* ---------- Alternativen ohne Online ---------- */
function altLinks(){
  const items = [];
  const chess = B.getGame && B.getGame('chess');
  if(chess) items.push(chess);
  (B.games || []).filter(g => g.cat === 'party').slice(0, 4).forEach(g => items.push(g));
  const box = el('div', { class: 'b-stack tight' }, [el('span', { class: 'b-label', text: 'Stattdessen lokal am selben Handy' })]);
  if(!items.length) box.append(el('p', { class: 'b-hint', text: 'Schach für 2 Spieler und die Partyspiele findest du im Spiele-Tab.' }));
  items.forEach(g => box.append(el('button', { class: 'b-item', onclick: () => B.openGame(g.id) }, [
    el('span', { class: 'ic', text: g.icon || '🎮' }), el('span', { class: 'tx' }, [el('b', { text: g.name }), el('small', { text: g.id === 'chess' ? '2 Spieler an einem Handy' : (g.desc || 'Partyspiel') })])
  ])));
  return box;
}
function unavailableCard(compact){
  if(compact) return el('div', { class: 'b-stack' }, [
    el('div', { class: 'b-card', style: { borderColor: 'var(--warn)' } }, [
      el('div', { class: 'b-h', text: '📡 Warum nicht verfügbar?' }),
      el('p', { class: 'b-hint', text: 'Echtzeit-Räume gibt es nur, wenn BORED? als geteilter Claude-Link geöffnet ist. Hier fehlt diese Verbindung – darum zeigen wir auch keine erfundenen Mitspieler.' })
    ]),
    altLinks()
  ]);
  return el('div', { class: 'b-stack' }, [
    el('div', { class: 'b-card glow b-rgb on-hero b-center' }, [
      el('div', { class: 'on-big', text: '📡' }),
      el('h3', { class: 'b-title b-grad', text: 'Online gerade nicht verfügbar' }),
      el('p', { class: 'b-hint', text: 'Echtzeit-Räume gibt es nur, wenn BORED? als geteilter Claude-Link geöffnet ist. Hier (z. B. in einer Vorschau oder Testseite) fehlt diese Verbindung – darum zeigen wir auch keine erfundenen Mitspieler.' }),
      el('p', { class: 'b-hint', text: 'So geht’s: Teil den App-Link mit Freunden, öffnet ihn gleichzeitig und geht in den FRIENDS-Tab.' })
    ]),
    altLinks()
  ]);
}

/* ---------- Lobby ---------- */
function mountLobby(root, api){
  injectCss();
  api = api || {};
  const A = {
    sound: n => { try{ (api.sound || B.sound)(n); }catch(e){} },
    vibrate: ms => { try{ (api.vibrate || B.vibrate)(ms); }catch(e){} },
    toast: t => { try{ (api.toast || B.toast)(t); }catch(e){} },
    sheet: f => (api.sheet || B.sheet)(f),
    /* eigener Dialog: BORED.confirm löst beim OK-Knopf über onClose zuerst false aus */
    confirm: (t, o = 'OK', c = 'Abbrechen') => new Promise(res => {
      let done = false; const fin = v => { if(!done){ done = true; res(v); } };
      (api.sheet || B.sheet)(close => el('div', { class: 'b-stack' }, [
        el('p', { class: 'b-h', text: t }),
        el('div', { class: 'b-grid2' }, [
          el('button', { class: 'b-btn ghost', text: c, onclick: () => { fin(false); close(); } }),
          el('button', { class: 'b-btn', 'data-on': 'ok', text: o, onclick: () => { fin(true); close(); } })
        ])
      ]));
      setTimeout(() => fin(false), 120000);
    }),
    finish: r => { try{ if(typeof api.finish === 'function') return api.finish(r); }catch(e){} return 0; }
  };
  const ME = { uid: rid(12) };
  const myName = () => cleanName(B.profile && B.profile.name);
  const myAv = () => cleanAv(B.profile && B.profile.avatar);
  let dead = false, lobbyRaw = null, lobby = null, lobbyPeers = [], sess = null, view = 'load', lastLobbyPres = '', homeRefs = null;
  const box = el('div', { class: 'on-root' });
  root.innerHTML = ''; root.append(box);
  box.append(el('div', { class: 'b-card b-center on-hero' }, [el('div', { class: 'on-big', text: '🌐' }), el('p', { class: 'b-hint', text: 'Verbinde mit der Lobby…' })]));

  const iv = setInterval(() => { if(dead) return; try{ if(sess) sess.tick(); else if(view === 'home') updateConn(); lobbyPresence(); }catch(e){ console.warn(e); } }, 250);
  const onNet = () => { if(sess) sess.conn(); else updateConn(); };
  window.addEventListener('online', onNet); window.addEventListener('offline', onNet);

  function lobbyPresence(){
    if(!lobby) return;
    const p = { uid: ME.uid, name: myName(), av: myAv(), app: 'bored-online' };
    const st = sess && sess.state();
    if(sess && sess.isHost() && st && st.pub) p.pub = { code: sess.code, gid: st.gid, n: st.players.length, max: st.max, ph: st.phase };
    const j = JSON.stringify(p);
    if(j === lastLobbyPres) return;
    lastLobbyPres = j; lobby.presence(p);
  }

  const timeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);
  timeout(Promise.resolve().then(() => api.room ? api.room() : B.cap('room')).catch(() => null), 8000).then(r => {
    if(dead) return;
    if(!r || typeof r.join !== 'function' || typeof r.onPeers !== 'function'){ renderUnavailable(); return; }
    lobbyRaw = r; lobby = wrapRoom(r, true);
    lobby.onPeers(raw => { if(dead) return; lobbyPeers = normPeers(raw); if(view === 'home') updateLists(); });
    lobbyPresence();
    renderHome();
  });

  function renderUnavailable(){ view = 'na'; box.innerHTML = ''; box.append(unavailableCard()); }

  function profileCard(){
    const av = el('button', { class: 'on-avbtn', 'aria-label': 'Avatar wählen', text: myAv(), onclick: () => {
      A.sound('click');
      const close = A.sheet(cl => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: 'Avatar wählen' }),
        el('div', { class: 'on-avgrid' }, AVATARS.map(e => el('button', { 'aria-pressed': String(e === myAv()), text: e, onclick: () => { B.profile.avatar = e; B.saveProfile && B.saveProfile(); av.textContent = e; A.sound('pop'); lobbyPresence(); if(sess) sess.pres(); cl(); } })))
      ]));
      return close;
    } });
    const nameIn = el('input', { class: 'b-input', maxlength: 16, placeholder: 'Dein Name (max. 16)', 'aria-label': 'Spielername', autocomplete: 'off' });
    nameIn.value = (B.profile && B.profile.name || '').slice(0, 16);
    nameIn.addEventListener('input', () => { if(nameIn.value.length > 16) nameIn.value = nameIn.value.slice(0, 16); B.profile.name = nameIn.value; });
    nameIn.addEventListener('change', () => { B.profile.name = str(nameIn.value, 16).trim(); B.saveProfile && B.saveProfile(); lobbyPresence(); });
    return el('div', { class: 'b-card glow' }, [
      el('span', { class: 'b-label', text: 'So sehen dich die anderen' }),
      el('div', { class: 'b-row' }, [av, el('div', { class: 'grow' }, [nameIn])])
    ]);
  }

  function renderHome(){
    view = 'home'; box.innerHTML = '';
    const connPill = el('span', { class: 'b-pill good' });
    const codeIn = el('input', { class: 'b-input on-codein', maxlength: 5, placeholder: 'CODE', 'aria-label': 'Raumcode', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false' });
    codeIn.addEventListener('input', () => { const v = codeIn.value.toUpperCase().replace(/[^A-Z0-9]/g, '').split('').filter(c => CODE_CHARS.includes(c)).join('').slice(0, 5); if(v !== codeIn.value) codeIn.value = v; });
    const join = () => { const c = codeIn.value.toUpperCase(); if(!CODE_RE.test(c)){ A.toast('Der Code hat 5 Zeichen.'); codeIn.classList.add('b-shake'); setTimeout(() => codeIn.classList.remove('b-shake'), 400); return; } A.sound('click'); startSession(c, null); };
    codeIn.addEventListener('keydown', e => { if(e.key === 'Enter') join(); });
    const pubBox = el('div', { class: 'b-list' }), onBox = el('div', { class: 'on-peers' }), onCount = el('span', { class: 'b-pill cyan', text: '0' });
    homeRefs = { connPill, pubBox, onBox, onCount };
    box.append(
      el('div', { class: 'b-card glow b-rgb on-hero b-center' }, [
        el('div', { class: 'on-big', text: '🌐' }),
        el('h3', { class: 'b-title b-grad', text: 'Online spielen' }),
        el('p', { class: 'b-hint', text: 'Echtzeit mit allen, die BORED? gerade offen haben. Erstell einen Raum und schick deinen Freunden den Code.' }),
        connPill
      ]),
      profileCard(),
      el('div', { class: 'b-grid2' }, [
        el('button', { class: 'b-btn', 'data-on': 'create', text: '＋ Raum', onclick: () => { A.sound('click'); rulesSheet(null, cfg => startSession(randCode(), cfg)); } }),
        el('button', { class: 'b-btn ghost', text: '🎲 Spiele', onclick: () => { A.sound('click'); gamesInfo(); } })
      ]),
      el('div', { class: 'b-card' }, [
        el('span', { class: 'b-label', text: 'Raum beitreten' }),
        el('div', { class: 'on-chatform' }, [codeIn, el('button', { class: 'b-btn cyan', 'data-on': 'join', text: 'Los', onclick: join })])
      ]),
      el('div', { class: 'b-card' }, [el('div', { class: 'b-between' }, [el('span', { class: 'b-h', text: 'Öffentliche Räume' })]), el('div', { style: { height: '8px' } }), pubBox]),
      el('div', { class: 'b-card' }, [el('div', { class: 'b-between' }, [el('span', { class: 'b-h', text: 'Gerade online' }), onCount]), el('div', { style: { height: '8px' } }), onBox,
        el('p', { class: 'b-hint', style: { marginTop: '10px' }, text: 'Nur echte Leute, die die App jetzt offen haben. Nichts wird gespeichert.' })])
    );
    updateConn(); updateLists();
  }
  function updateConn(){
    if(!homeRefs) return;
    const off = navigator.onLine === false;
    homeRefs.connPill.className = 'b-pill ' + (off ? 'bad' : 'good');
    homeRefs.connPill.textContent = off ? '● Offline' : '● Lobby verbunden';
  }
  function updateLists(){
    if(!homeRefs) return;
    const { pubBox, onBox, onCount } = homeRefs;
    const seen = new Set(), ppl = [];
    lobbyPeers.forEach(p => { const k = p.uid || p.pid; if(!k || seen.has(k)) return; seen.add(k); ppl.push(p); });
    onCount.textContent = String(ppl.length);
    onBox.innerHTML = '';
    if(!ppl.length) onBox.append(el('p', { class: 'b-hint', text: 'Noch niemand sichtbar.' }));
    ppl.sort((a, b) => (b.uid === ME.uid || b.self) - (a.uid === ME.uid || a.self)).slice(0, 60).forEach(p => {
      const you = p.uid === ME.uid || p.self;
      onBox.append(el('span', { class: 'on-peer' + (you ? ' you' : '') }, [el('span', { class: 'on-av', text: you ? myAv() : cleanAv(p.pres.av) }), el('span', { class: 'on-nm', text: (you ? myName() : (p.uid ? cleanName(p.pres.name) : 'Verbindet…')) + (you ? ' (du)' : '') })]));
    });
    pubBox.innerHTML = '';
    const rooms = [];
    ppl.forEach(p => {
      if(p.uid === ME.uid) return;
      const r = p.pres.pub;
      if(!isObj(r) || typeof r.code !== 'string' || !CODE_RE.test(r.code) || typeof r.gid !== 'string' || !own(GAMES, r.gid)) return;
      const n = int(r.n, 0, 8, -1), max = int(r.max, 2, 8, -1); if(n < 0 || max < 0 || rooms.some(x => x.code === r.code)) return;
      rooms.push({ code: r.code, gid: r.gid, n, max, ph: ['lobby', 'play', 'end'].includes(r.ph) ? r.ph : 'lobby', host: cleanName(p.pres.name), av: cleanAv(p.pres.av) });
    });
    if(!rooms.length) pubBox.append(el('p', { class: 'b-hint', text: 'Gerade keine öffentlichen Räume. Erstell doch einen!' }));
    rooms.slice(0, 20).forEach(r => {
      const G = GAMES[r.gid];
      pubBox.append(el('button', { class: 'b-item', onclick: () => { A.sound('click'); startSession(r.code, null); } }, [
        el('span', { class: 'ic', text: G.icon }),
        el('span', { class: 'tx' }, [el('b', { text: G.name }), el('small', { text: 'Host: ' + r.host + ' · ' + r.code })]),
        el('span', { class: 'b-pill ' + (r.ph === 'play' ? 'warn' : r.n >= r.max ? 'bad' : 'good'), text: r.ph === 'play' ? 'läuft' : r.n + '/' + r.max })
      ]));
    });
  }
  function gamesInfo(){
    A.sheet(close => el('div', { class: 'b-stack' }, [
      el('div', { class: 'b-kicker', text: 'Online-Spiele' }),
      el('div', { class: 'b-list' }, Object.values(GAMES).map(G => el('div', { class: 'b-item' }, [el('span', { class: 'ic', text: G.icon }), el('span', { class: 'tx' }, [el('b', { text: G.name + ' · ' + (G.min === G.max ? G.min : G.min + '–' + G.max) + ' Spieler' }), el('small', { style: { whiteSpace: 'normal' }, text: G.desc })])]))),
      el('button', { class: 'b-btn block', text: 'Raum erstellen', onclick: () => { close(); rulesSheet(null, cfg => startSession(randCode(), cfg)); } })
    ]));
  }

  /* Raum erstellen / Regeln ändern */
  function rulesSheet(init, onOk){
    const last = (api.store && api.store.get) ? api.store.get('onlineCfg', null) : null;
    const base = init || (isObj(last) ? last : {});
    let gid = typeof base.gid === 'string' && own(GAMES, base.gid) ? base.gid : 'c4';
    let G = GAMES[gid];
    let max = int(base.max, G.min, G.max, G.max), pub = base.pub === true, rules = cleanRules(G, base.rules);
    A.sheet(close => {
      const body = el('div', { class: 'b-stack' });
      const chips = (opts, cur, set, lab) => el('div', { class: 'b-chips', role: 'group', 'aria-label': lab }, opts.map(o => el('button', { class: 'b-chip', 'aria-pressed': String(o.v === cur), text: o.l, onclick: () => { set(o.v); A.sound('click'); draw(); } })));
      const draw = () => {
        body.innerHTML = '';
        body.append(el('div', { class: 'b-kicker', text: init ? 'Raum anpassen' : 'Neuer Raum' }));
        body.append(el('div', {}, [el('span', { class: 'b-label', text: 'Spiel' }), el('div', { class: 'on-gpick' }, Object.values(GAMES).map(g2 => el('button', { 'aria-pressed': String(g2.id === gid), 'data-game': g2.id, onclick: () => {
          gid = g2.id; G = g2; max = G.max; rules = cleanRules(G, {}); A.sound('click'); draw();
        } }, [el('b', { text: g2.icon + ' ' + g2.name }), el('small', { text: (g2.min === g2.max ? g2.min : g2.min + '–' + g2.max) + ' Spieler' })])))]));
        if(G.min !== G.max){ const o = []; for(let i = G.min; i <= G.max; i++) o.push({ v: i, l: String(i) }); body.append(el('div', {}, [el('span', { class: 'b-label', text: 'Max. Spieler' }), chips(o, max, v => max = v, 'Max. Spieler')])); }
        body.append(el('div', {}, [el('span', { class: 'b-label', text: 'Sichtbarkeit' }), chips([{ v: false, l: '🔒 Privat (nur Code)' }, { v: true, l: '🌍 Öffentlich' }], pub, v => pub = v, 'Sichtbarkeit')]));
        body.append(el('div', {}, [el('span', { class: 'b-label', text: G.roundsLabel }), chips(G.rounds.map(v => ({ v, l: String(v) })), rules.rounds, v => rules.rounds = v, G.roundsLabel)]));
        if(G.times) body.append(el('div', {}, [el('span', { class: 'b-label', text: G.timeLabel || 'Zeitlimit' }), chips(G.times.map(v => ({ v, l: v ? v + ' s' : 'Aus' })), rules.time, v => rules.time = v, 'Zeitlimit')]));
        if(G.variants) body.append(el('div', {}, [el('span', { class: 'b-label', text: 'Variante' }), chips(G.variants.map(v => ({ v: v.id, l: v.label })), rules.variant, v => rules.variant = v, 'Variante')]));
        body.append(el('p', { class: 'b-hint', text: G.desc }));
        body.append(el('button', { class: 'b-btn block', 'data-on': 'confirm', text: init ? 'Übernehmen' : '▶ Raum erstellen', onclick: () => {
          const cfg = { gid, max, pub, rules: Object.assign({}, rules) };
          try{ api.store && api.store.set && api.store.set('onlineCfg', cfg); }catch(e){}
          close(); A.sound('good'); onOk(cfg);
        } }));
      };
      draw(); return body;
    });
  }

  async function startSession(code, cfg){
    if(!lobbyRaw) return;
    if(sess) sess.leave(true);
    let raw = null;
    try{ raw = await lobbyRaw.join('bored-' + code); }catch(e){ raw = null; }
    if(dead){ try{ raw && raw.leave && raw.leave(); }catch(e){} return; }
    if(!raw || typeof raw.emit !== 'function' || typeof raw.on !== 'function'){ A.toast('Raum konnte nicht geöffnet werden.'); return; }
    sess = makeSession(code, wrapRoom(raw, false), cfg);
    lobbyPresence();
  }

  /* ---------- Raum-Sitzung ---------- */
  function makeSession(code, R, cfg){
    let S = null, lastV = -1, isHost = false, hostDl = null, clientDl = null, pausedLeft = null, lastBcast = 0, lastHeard = 0, lastHello = 0, lastHave = 0, lastResend = 0, lastPres = '';
    const joinedAt = Date.now();
    let hostMissing = 0, peers = [], byUid = new Map(), byPid = new Map(), gotPeers = false, left = false, finishedMid = -1;
    const chat = [], seenChat = new Set(), rl = new Map(), timers = new Set(), cleanups = [];
    let V = null, pending = null;
    const net = makeDrawNet(d => R.emit('move', Object.assign({ uid: ME.uid }, d)), () => ME.uid);
    const X = { code };

    const H = {
      dl(ms){ hostDl = ms == null ? null : Date.now() + ms; },
      left(){ return hostDl ? Math.max(0, hostDl - Date.now()) : 0; },
      end(){ endMatch(); }
    };
    const present = u => u === ME.uid || byUid.has(u);
    const keyOf = u => { const p = byUid.get(u); return p && p.pid ? p.pid : 'u:' + u; };
    const nameOf = u => { if(u === ME.uid) return myName(); const p = S && S.players.find(x => x.u === u); if(p) return p.n; const q = byUid.get(u); return q ? cleanName(q.pres.name) : 'Spieler'; };
    const isPlayer = () => !!(S && S.players.some(p => p.u === ME.uid));

    function resolveFrom(from){
      if(from == null) return null;
      if(typeof from === 'string' || typeof from === 'number'){ const p = byPid.get(String(from)); return p ? p.uid : null; }
      if(isObj(from)){ const pr = pickPres(from); if(pr && isUid(pr.uid)) return pr.uid; const pid = pidOf(from); const p = pid && byPid.get(pid); return p ? p.uid : null; }
      return null;
    }
    function sender(d, from){ if(!isObj(d) || !isUid(d.uid)) return null; const f = resolveFrom(from); if(f && f !== d.uid) return null; return d.uid; }

    /* DOM */
    const banner = el('div', { class: 'on-banner', role: 'status', style: { display: 'none' } });
    const head = el('div', { class: 'b-card glow' });
    const pauseBox = el('div');
    const area = el('div', { class: 'b-stack', 'data-on': 'area' });
    const plist = el('div', { class: 'b-card' });
    const chatList = el('div', { class: 'on-chatlist', role: 'log', 'aria-live': 'polite' });
    const chatIn = el('input', { class: 'b-input', maxlength: 200, placeholder: 'Nachricht an den Raum…', 'aria-label': 'Chat', autocomplete: 'off' });
    const chatLbl = el('span', { class: 'b-label', text: 'Raum-Chat' });
    const chatCard = el('div', { class: 'b-card on-chat' }, [chatLbl, chatList, el('div', { style: { height: '8px' } }),
      el('form', { class: 'on-chatform', onsubmit: e => { e.preventDefault(); sendChat(chatIn.value); chatIn.value = ''; } }, [chatIn, el('button', { class: 'b-btn sm', type: 'submit', text: 'Senden' })])]);
    view = 'room'; homeRefs = null; box.innerHTML = '';
    box.append(banner, head, pauseBox, area, chatCard, plist);
    sysChat('Du bist im Raum ' + code + '.');

    if(cfg){
      isHost = true;
      const G = GAMES[cfg.gid];
      S = { v: 1, host: ME.uid, code, gid: cfg.gid, max: int(cfg.max, G.min, G.max, G.max), pub: !!cfg.pub, rules: cleanRules(G, cfg.rules), players: [{ u: ME.uid, n: myName(), a: myAv() }], banned: [], phase: 'lobby', mid: 0, paused: null, g: null, rank: null, note: '', left: null };
      lastV = 1;
    }
    pres();
    R.onPeers(onPeers);
    R.on('move', onMove);
    R.on('chat', onChat);
    if(isHost) broadcast(); else hello();
    render();

    function pres(){ const p = { uid: ME.uid, name: myName(), av: myAv() }; const j = JSON.stringify(p); if(j === lastPres) return; lastPres = j; R.presence(p); }
    function hello(){ lastHello = Date.now(); R.emit('move', { type: 'hello', uid: ME.uid }); }

    function onPeers(raw){
      if(left) return;
      peers = normPeers(raw); byUid = new Map(); byPid = new Map();
      peers.forEach(p => { if(p.uid && p.uid !== ME.uid && !byUid.has(p.uid)) byUid.set(p.uid, p); if(p.pid) byPid.set(p.pid, p); });
      if(peers.some(p => p.uid === ME.uid)){ const m = peers.find(p => p.uid === ME.uid); byUid.set(ME.uid, m); }
      gotPeers = true;
      renderPlayers(); renderHead();
    }
    function onMove(d, from){
      if(left || !isObj(d) || typeof d.type !== 'string') return;
      const u = sender(d, from); if(!u || u === ME.uid) return;
      if(S && S.banned.includes(u) && d.type !== 'state') return;
      if(d.type === 'state') onState(d, u);
      else if(d.type === 'intent'){ if(isHost) onIntent(u, d); }
      else if(d.type === 'hello'){ if(isHost && Date.now() - lastBcast > 300) broadcast(); }
      else if(d.type === 'kick'){ if(S && u === S.host && d.target === ME.uid) kicked(); }
      else if(d.type === 'draw' || d.type === 'dhave' || d.type === 'dneed') net.onMsg(d, u);
    }
    function onState(d, u){
      const s = cleanState(d.s);
      if(!s || s.host !== u || s.code !== code) return;
      if(isHost){
        if(present(u) && keyOf(u) < keyOf(ME.uid)){ isHost = false; hostDl = null; pausedLeft = null; }
        else { if(Date.now() - lastBcast > 600) broadcast(); return; }
      } else if(S && S.host !== u && present(S.host) && keyOf(u) > keyOf(S.host)) return;
      lastHeard = Date.now();
      if(S && S.host === u && s.v <= lastV) return; // Duplikat / veraltet
      S = s; lastV = s.v; clientDl = s.left != null && !s.paused ? Date.now() + s.left : null; hostMissing = 0;
      if(S.banned.includes(ME.uid)){ kicked(); return; }
      syncNet(); render();
    }
    function onIntent(u, d){
      if(!S || S.phase !== 'play' || S.paused || d.mid !== S.mid || !S.players.some(p => p.u === u)) return;
      let ch = false;
      try{ ch = GAMES[S.gid].intent(S, S.g, u, d, H); }catch(e){ ch = false; }
      if(ch) bump();
    }
    function intent(obj, keep){
      if(!S || S.phase !== 'play') return;
      const msg = Object.assign({}, obj, { type: 'intent', uid: ME.uid, mid: S.mid });
      if(isHost) onIntent(ME.uid, msg);
      else { R.emit('move', msg); pending = keep ? { msg, keep, until: Date.now() + 15000 } : null; lastResend = Date.now(); }
    }
    function broadcast(){
      if(!S) return;
      S.left = S.paused ? pausedLeft : (hostDl ? Math.max(0, hostDl - Date.now()) : null);
      lastBcast = Date.now();
      R.emit('move', { type: 'state', uid: ME.uid, s: S });
    }
    function bump(){ S.v = Math.max(S.v, lastV) + 1; lastV = S.v; broadcast(); clientDl = hostDl; syncNet(); render(); }
    function syncNet(){ if(S && S.phase === 'play' && S.gid === 'draw' && S.g) net.reset(S.g.tid, S.g.dr); }
    function becomeHost(){
      isHost = true; S.host = ME.uid; S.v = lastV + 1; lastV = S.v;
      if(S.paused){ pausedLeft = S.left; hostDl = null; } else hostDl = clientDl;
      hostMissing = 0; A.toast('👑 Du bist jetzt Host.'); sysChat('Du bist jetzt Host.');
      broadcast(); render();
    }
    function endMatch(){
      const G = GAMES[S.gid], g = S.g;
      const list = S.players.filter(p => own(g.sc, p.u));
      list.sort((a, b) => (g.sc[b.u] - g.sc[a.u]) || (G.tb ? G.tb(g, a.u) - G.tb(g, b.u) : 0));
      S.rank = list.map(p => ({ u: p.u, n: p.n, a: p.a, s: Math.round(g.sc[p.u]), x: G.extra ? G.extra(g, p.u) : '' }));
      S.phase = 'end'; hostDl = null; S.paused = null;
    }
    function startMatch(){
      const G = GAMES[S.gid];
      if(!isHost || S.players.length < G.min) return;
      S.mid++; S.note = ''; S.paused = null; S.rank = null; pausedLeft = null;
      S.g = G.init(S, H); S.phase = 'play'; A.sound('good'); bump();
    }
    function abortMatch(note){ S.phase = 'lobby'; S.g = null; S.paused = null; S.rank = null; hostDl = null; pausedLeft = null; S.note = note; bump(); }
    function kick(u){
      if(!isHost || u === ME.uid) return;
      if(!S.banned.includes(u)) S.banned.push(u);
      S.players = S.players.filter(p => p.u !== u);
      R.emit('move', { type: 'kick', uid: ME.uid, target: u });
      bump();
    }
    function kicked(){ A.toast('Du wurdest aus dem Raum entfernt.'); A.sound('bad'); X.leave(); }

    function hostTick(now){
      let ch = false;
      S.players.forEach(p => {
        if(p.u === ME.uid){ const n = myName(), a = myAv(); if(p.n !== n || p.a !== a){ p.n = n; p.a = a; ch = true; } return; }
        const q = byUid.get(p.u); if(q){ const n = cleanName(q.pres.name), a = cleanAv(q.pres.av); if(n !== p.n || a !== p.a){ p.n = n; p.a = a; ch = true; } }
      });
      if(gotPeers){
        if(S.phase !== 'play'){
          const before = S.players.length;
          S.players = S.players.filter(p => present(p.u));
          if(S.players.length !== before) ch = true;
          for(const pe of byUid.values()){
            if(!pe.uid || pe.uid === ME.uid || S.banned.includes(pe.uid) || S.players.some(p => p.u === pe.uid)) continue;
            if(S.players.length >= S.max) break;
            S.players.push({ u: pe.uid, n: cleanName(pe.pres.name), a: cleanAv(pe.pres.av) }); ch = true;
          }
        } else {
          const miss = S.players.filter(p => !present(p.u)).map(p => p.u);
          if(miss.length && !S.paused){ S.paused = { who: miss }; pausedLeft = hostDl ? Math.max(0, hostDl - now) : null; hostDl = null; ch = true; }
          else if(S.paused && !miss.length){ S.paused = null; hostDl = pausedLeft != null ? now + pausedLeft : null; pausedLeft = null; ch = true; }
          else if(S.paused && miss.join() !== S.paused.who.join()){ S.paused.who = miss; ch = true; }
        }
      }
      if(S.phase === 'play' && !S.paused && hostDl && now >= hostDl){ hostDl = null; try{ GAMES[S.gid].timeout(S, S.g, H); }catch(e){ console.warn(e); } ch = true; }
      if(ch) bump(); else if(now - lastBcast >= 2000) broadcast();
    }
    function clientTick(now){
      if(!S){ if(now - lastHello > 2500) hello(); return; }
      if(gotPeers && !present(S.host)){
        if(!hostMissing) hostMissing = now;
        const pl = S.players.filter(p => present(p.u)).map(p => p.u).sort((a, b) => keyOf(a) < keyOf(b) ? -1 : 1);
        const rest = [...byUid.keys()].concat(ME.uid).filter((u, i, a) => a.indexOf(u) === i && !pl.includes(u) && !S.banned.includes(u)).sort((a, b) => keyOf(a) < keyOf(b) ? -1 : 1);
        const idx = pl.concat(rest).indexOf(ME.uid);
        if(idx >= 0 && now - hostMissing > 3000 + idx * 3000) becomeHost();
      } else hostMissing = 0;
      if(pending){
        if(now > pending.until || !pending.keep(S)) pending = null;
        else if(now - lastResend > 1500){ lastResend = now; R.emit('move', pending.msg); }
      }
    }
    let tickN = 0;
    X.tick = () => {
      if(left) return;
      const now = Date.now(); tickN++;
      if(isHost && S) hostTick(now); else clientTick(now);
      if(S && S.phase === 'play' && S.gid === 'draw' && S.g.dr === ME.uid && S.g.ph === 'draw' && now - lastHave > 1500){ lastHave = now; net.have(); }
      if(tickN % 4 === 0){ pres(); X.conn(); if(peers.length && peers.some(p => p.self) && !peers.some(p => p.uid === ME.uid) && now - joinedAt > 6000){ lastPres = ''; pres(); } }
      const dl = isHost ? hostDl : clientDl;
      box.querySelectorAll('.on-cd').forEach(e => { e.textContent = S && S.paused ? '⏸' : dl ? '⏱ ' + Math.max(0, Math.ceil((dl - now) / 1000)) + ' s' : ''; });
    };
    X.conn = () => {
      const now = Date.now(); let msg = '', cls = '';
      if(navigator.onLine === false) msg = '📴 Du bist offline – warte auf Verbindung…';
      else if(!S && now - joinedAt > 6000) msg = (byUid.size ? '⏳ Warte auf den Host…' : '🤷 Niemand in Raum ' + code + '. Code richtig? Der Host muss den Raum offen haben.'), cls = 'warn';
      else if(S && !isHost && !present(S.host) && gotPeers) msg = '👑 Host ist weg – neuer Host wird bestimmt…', cls = 'warn';
      else if(S && !isHost && now - lastHeard > 7000) msg = '📶 Verbindung zum Host wackelt… (keine Daten seit ' + Math.round((now - lastHeard) / 1000) + ' s)';
      banner.style.display = msg ? '' : 'none'; banner.className = 'on-banner ' + cls; banner.textContent = msg;
    };
    X.isHost = () => isHost;
    X.state = () => S;
    X.pres = pres;
    X.leave = (silent) => {
      if(left) return; left = true;
      timers.forEach(t => clearTimeout(t)); timers.clear();
      cleanups.forEach(f => { try{ f(); }catch(e){} });
      R.leave(); if(sess === X) sess = null;
      lastLobbyPres = ''; lobbyPresence();
      if(!dead && !silent) renderHome();
    };

    /* Chat */
    function sysChat(t){ chatList.append(el('div', { class: 'on-sys', text: t })); trimChat(); }
    function trimChat(){ while(chatList.childNodes.length > 60) chatList.firstChild.remove(); chatList.scrollTop = chatList.scrollHeight; }
    function guessMode(){ return !!(S && S.phase === 'play' && S.gid === 'draw' && S.g.ph === 'draw' && S.g.dr !== ME.uid && S.g.pl.includes(ME.uid) && !own(S.g.ok, ME.uid) && !S.paused); }
    function maskText(t){ return S && S.phase === 'play' && S.gid === 'draw' && S.g.ph === 'draw' && containsWord(t, S.g.w) ? '🤐 (Lösung versteckt)' : t; }
    function addChat(u, n, a, t, mine){
      chatList.append(el('div', { class: 'on-msg' + (mine ? ' mine' : '') }, [el('span', { text: a + ' ' }), el('b', { text: n + ':' }), el('span', { text: maskText(t) })]));
      trimChat();
    }
    function sendChat(v){
      const t = str(v, 200).trim(); if(!t) return;
      if(guessMode()){ intent({ a: 'guess', tid: S.g.tid, text: t.slice(0, 40) }); A.sound('tap'); return; }
      const m = { uid: ME.uid, n: myName(), a: myAv(), t, id: rid(8) };
      R.emit('chat', m); addChat(ME.uid, m.n, m.a, t, true); A.sound('tap');
    }
    function onChat(d, from){
      if(left || !isObj(d)) return;
      const u = sender(d, from); if(!u || u === ME.uid) return;
      if(S && S.banned.includes(u)) return;
      const id = str(d.id, 12); if(!id || seenChat.has(id)) return;
      const now = Date.now(), r = (rl.get(u) || []).filter(t => now - t < 5000); if(r.length >= 6) return; r.push(now); rl.set(u, r);
      seenChat.add(id); if(seenChat.size > 500) seenChat.clear();
      const t = str(d.t, 200).trim(); if(!t) return;
      const q = byUid.get(u);
      addChat(u, q ? cleanName(q.pres.name) : cleanName(d.n), q ? cleanAv(q.pres.av) : cleanAv(d.a), t, false);
      A.sound('tick');
    }

    /* Rendern */
    function renderHead(){
      head.innerHTML = '';
      const G = S ? GAMES[S.gid] : null;
      head.append(el('div', { class: 'b-between' }, [
        el('div', {}, [el('div', { class: 'b-kicker', text: 'Raumcode' }), el('div', { class: 'on-code', 'data-on': 'code', text: code })]),
        el('div', { class: 'b-row', style: { gap: '6px' } }, [
          el('button', { class: 'b-icon-btn', 'aria-label': 'Code teilen', text: '📋', onclick: async () => { const ok = await copyText('Spiel mit mir auf BORED? – Raumcode: ' + code); A.toast(ok ? 'Code kopiert! Schick ihn deinen Freunden.' : 'Kopieren geht hier nicht – Code: ' + code); A.sound('pop'); } }),
          el('button', { class: 'b-icon-btn', 'aria-label': 'Raum verlassen', text: '🚪', onclick: () => { A.confirm('Raum verlassen?', 'Verlassen', 'Bleiben').then(ok => { if(ok){ A.sound('click'); X.leave(); } }); } })
        ])
      ]));
      const pills = el('div', { class: 'b-chips', style: { marginTop: '8px' } });
      if(G) pills.append(el('span', { class: 'b-pill cyan', text: G.icon + ' ' + G.name }), el('span', { class: 'b-pill', text: S.pub ? '🌍 öffentlich' : '🔒 privat' }), el('span', { class: 'b-pill ' + (S.players.length >= S.max ? 'warn' : 'good'), text: S.players.length + '/' + S.max + ' Spieler' }));
      pills.append(el('span', { class: 'b-pill ' + (isHost ? 'pink' : ''), text: isHost ? '👑 Du bist Host' : S ? 'Host: ' + nameOf(S.host) : 'verbinde…' }));
      head.append(pills);
    }
    function renderPlayers(){
      plist.innerHTML = '';
      if(!S){ plist.append(el('span', { class: 'b-label', text: 'Spieler' }), el('p', { class: 'b-hint', text: 'Warte auf Daten vom Host…' })); return; }
      const sc = S.phase === 'play' && S.g && S.g.sc ? S.g.sc : null;
      plist.append(el('span', { class: 'b-label', text: 'Spieler (' + S.players.length + '/' + S.max + ')' }));
      const list = el('div', { class: 'b-stack tight', 'data-on': 'players' });
      S.players.forEach(p => {
        const on = present(p.u), me = p.u === ME.uid;
        list.append(el('div', { class: 'on-pl' + (me ? ' me' : '') }, [
          el('span', { class: 'on-av', text: me ? myAv() : p.a }),
          el('span', { class: 'tx', text: (me ? myName() : p.n) + (me ? ' (du)' : '') }),
          p.u === S.host ? el('span', { class: 'b-pill pink', text: '👑 Host' }) : null,
          !on && gotPeers ? el('span', { class: 'b-pill bad', text: 'weg' }) : null,
          sc && own(sc, p.u) ? el('span', { class: 'on-sc', text: String(Math.round(sc[p.u])) }) : null,
          isHost && !me && S.phase !== 'play' ? el('button', { class: 'on-kick', 'aria-label': p.n + ' entfernen', text: '✕', onclick: () => { A.confirm(p.n + ' aus dem Raum entfernen?', 'Entfernen', 'Abbrechen').then(ok => { if(ok) kick(p.u); }); } }) : null
        ]));
      });
      plist.append(list);
      const spec = [...byUid.values()].filter(p => p.uid !== ME.uid && !S.players.some(x => x.u === p.uid) && !S.banned.includes(p.uid));
      if(!isPlayer()) spec.unshift({ uid: ME.uid, pres: { name: myName() } });
      if(spec.length) plist.append(el('p', { class: 'b-hint', style: { marginTop: '8px' }, text: '👀 Zuschauer: ' + spec.map(p => p.uid === ME.uid ? myName() + ' (du)' : cleanName(p.pres.name)).join(', ') }));
    }
    function renderPause(){
      pauseBox.innerHTML = '';
      if(!S || S.phase !== 'play' || !S.paused) return;
      const G = GAMES[S.gid], who = S.paused.who.map(nameOf).join(', ');
      const canDrop = G.drop && S.players.length - S.paused.who.length >= G.min;
      pauseBox.append(el('div', { class: 'b-card glow b-center', style: { borderColor: 'var(--warn)' } }, [
        el('div', { class: 'b-h', text: '⏸ Pause' }),
        el('p', { class: 'b-hint', text: (who || 'Jemand') + ' hat die Verbindung verloren. Wir warten kurz…' }),
        isHost ? el('div', { class: 'b-grid2', style: { width: '100%' } }, [
          canDrop ? el('button', { class: 'b-btn sm', text: 'Ohne weiter', onclick: () => {
            const gone = S.paused.who.slice(); const now = Date.now();
            S.paused = null; hostDl = pausedLeft != null ? now + pausedLeft : null; pausedLeft = null;
            gone.forEach(u => { S.players = S.players.filter(p => p.u !== u); try{ G.drop(S, S.g, u, H); }catch(e){} });
            if(S.players.length < G.min) abortMatch('Zu wenige Spieler – Spiel abgebrochen.'); else bump();
          } }) : el('span'),
          el('button', { class: 'b-btn danger sm', text: 'Abbrechen', onclick: () => abortMatch('Spiel abgebrochen.') })
        ]) : el('p', { class: 'b-hint', text: 'Der Host entscheidet, ob es ohne weitergeht.' })
      ]));
    }
    function viewCtx(){
      if(!V || V.mid !== S.mid + ':' + S.gid){
        if(V) V.cleanupFns.forEach(f => { try{ f(); }catch(e){} });
        V = { mid: S.mid + ':' + S.gid, cache: {}, local: {}, cleanupFns: [] };
        Object.assign(V, {
          me: ME.uid, net, sound: A.sound, vibrate: A.vibrate, confirm: A.confirm,
          name: nameOf, intent, S: () => S, rerender: () => renderArea(true),
          timeout: (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if(!left) fn(); }, ms); timers.add(t); return t; },
          onCleanup: f => V.cleanupFns.push(f)
        });
        const vv = V; cleanups.push(() => vv.cleanupFns.forEach(f => { try{ f(); }catch(e){} }));
      }
      V.isPlayer = isPlayer();
      return V;
    }
    function renderArea(force){
      if(!S){
        area.innerHTML = '';
        area.append(el('div', { class: 'b-card b-center on-hero' }, [el('div', { class: 'on-big', text: '🛰️' }), el('p', { class: 'b-h', text: 'Verbinde…' }), el('p', { class: 'b-hint', text: 'Hole den Spielstand vom Host von Raum ' + code + '.' })]));
        return;
      }
      const G = GAMES[S.gid];
      if(S.phase === 'play'){
        const v = viewCtx();
        if(!force && G.patch && v.cache.root && v.cache.root.parentNode === area && G.patch(area, S, S.g, v)) return;
        area.innerHTML = '';
        try{ G.render(area, S, S.g, v); }catch(e){ console.warn(e); area.append(el('p', { class: 'b-hint', text: 'Anzeige-Fehler – warte auf den nächsten Zug.' })); }
        return;
      }
      area.innerHTML = '';
      if(S.phase === 'lobby') renderWaiting(G); else renderEnd(G);
    }
    function renderWaiting(G){
      const enough = S.players.length >= G.min;
      const card = el('div', { class: 'b-card glow b-rgb b-center on-hero' }, [
        el('div', { class: 'on-big', text: G.icon }),
        el('h3', { class: 'b-title b-grad', text: G.name }),
        el('p', { class: 'b-hint', text: G.desc }),
        el('span', { class: 'b-pill cyan', text: rulesText(G, S.rules) })
      ]);
      area.append(card);
      if(S.note) area.append(el('p', { class: 'b-hint', style: { textAlign: 'center', color: 'var(--warn)' }, text: S.note }));
      if(!isPlayer()) area.append(el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: '👀 Raum ist voll – du schaust zu und kannst chatten.' }));
      if(isHost){
        area.append(
          el('button', { class: 'b-btn block', 'data-on': 'start', disabled: enough ? null : true, style: { minHeight: '56px', fontSize: '19px' }, text: enough ? '▶ Runde starten' : 'Mind. ' + G.min + ' Spieler nötig', onclick: startMatch }),
          el('button', { class: 'b-btn ghost block', text: '⚙ Spiel & Regeln ändern', onclick: () => rulesSheet({ gid: S.gid, max: S.max, pub: S.pub, rules: S.rules }, c => {
            if(!isHost || S.phase !== 'lobby') return;
            const G2 = GAMES[c.gid]; S.gid = c.gid; S.max = int(c.max, G2.min, G2.max, G2.max); S.pub = !!c.pub; S.rules = cleanRules(G2, c.rules);
            if(S.players.length > S.max){ const meP = S.players.find(p => p.u === ME.uid); S.players = [meP].concat(S.players.filter(p => p.u !== ME.uid)).slice(0, S.max); }
            S.note = ''; bump();
          }) }),
          el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: 'Schick deinen Freunden den Code ' + code + ' (📋 oben).' })
        );
      } else area.append(el('div', { class: 'b-card b-center' }, [el('span', { class: 'on-dot wait' }), el('p', { class: 'b-hint', text: 'Warte, bis der Host die Runde startet…' })]));
    }
    function renderEnd(G){
      const rank = S.rank || [];
      const meR = rank.findIndex(r => r.u === ME.uid);
      const top = rank.length ? rank[0].s : 0, tied = rank.filter(r => r.s === top).length > 1;
      const myWin = meR < 0 ? null : rank[meR].s === top ? (tied ? null : true) : false;
      if(meR >= 0 && finishedMid !== S.mid){
        finishedMid = S.mid;
        const xp = myWin ? 40 : myWin === null ? 25 : Math.max(10, 22 - meR * 3);
        A.finish({ win: myWin, xp, score: rank[meR].s });
        A.sound(myWin ? 'win' : myWin === null ? 'pop' : 'lose');
      }
      area.append(el('div', { class: 'b-card glow b-rgb b-center on-hero' }, [
        el('div', { class: 'on-big', text: meR < 0 ? '🏁' : myWin ? '🏆' : myWin === null ? '🤝' : ['🥈', '🥉'][meR - 1] || '💪' }),
        el('h3', { class: 'b-title b-grad', text: meR < 0 ? 'Spiel vorbei' : myWin ? 'Du hast gewonnen!' : myWin === null ? 'Unentschieden!' : 'Platz ' + (meR + 1) }),
        el('p', { class: 'b-hint', text: G.name + ' · ' + rulesText(G, S.rules) })
      ]));
      area.append(el('div', { class: 'on-rank', 'data-on': 'rank' }, rank.map((r, i) => el('div', { class: 'on-pl' + (r.u === ME.uid ? ' me' : '') }, [
        el('span', { class: 'on-medal', text: ['🥇', '🥈', '🥉'][i] || String(i + 1) }),
        el('span', { class: 'on-av', text: r.a }),
        el('span', { class: 'tx', text: r.n + (r.u === ME.uid ? ' (du)' : '') }),
        r.x ? el('span', { class: 'b-pill', text: r.x }) : null,
        el('span', { class: 'on-sc', text: String(r.s) })
      ]))));
      if(isHost) area.append(el('div', { class: 'b-grid2' }, [
        el('button', { class: 'b-btn', 'data-on': 'again', disabled: S.players.length >= G.min ? null : true, text: '↻ Nochmal', onclick: startMatch }),
        el('button', { class: 'b-btn ghost', text: 'Warteraum', onclick: () => { S.phase = 'lobby'; S.rank = null; S.g = null; S.note = ''; bump(); } })
      ]));
      else area.append(el('p', { class: 'b-hint', style: { textAlign: 'center' }, text: 'Der Host kann gleich „Nochmal“ starten.' }));
    }
    function render(){
      if(left) return;
      renderHead(); renderPause(); renderArea(false); renderPlayers();
      const gm = guessMode();
      chatCard.classList.toggle('guess', gm);
      chatIn.placeholder = gm ? '💡 Dein Tipp…' : 'Nachricht an den Raum…';
      chatLbl.textContent = gm ? 'Raten – dein Tipp geht nur an den Host' : 'Raum-Chat';
      if(X.conn) X.conn();
    }
    return X;
  }

  return function cleanup(){
    dead = true; clearInterval(iv);
    window.removeEventListener('online', onNet); window.removeEventListener('offline', onNet);
    if(sess) sess.leave(true);
    if(lobby){ lastLobbyPres = ''; lobbyPresence(); lobby.leave(); }
  };
}

B.registerLobby({ id: 'online', name: 'Online spielen', mount: mountLobby });

/* Info-Eintrag in der Spieleliste */
B.registerGame({
  id: 'online-info', name: 'Online spielen', icon: '🌐', cat: 'online', kind: 'tool',
  desc: 'Echtzeit mit Freunden: Vier gewinnt, Reaktionsduell, Quiz-Battle, Zeichne & Rate und Tic-Tac-Toe.',
  rules: ['Geh in den FRIENDS-Tab und tippe auf „Raum“.', 'Wähl ein Spiel und schick deinen Freunden den 5-stelligen Code.', 'Der Host startet die Runde – alle spielen live mit.', 'Online klappt nur, wenn alle die App gleichzeitig offen haben.'],
  players: 'online', tags: ['freunde', 'kurz', 'einfach'],
  mount(root, api){
    injectCss();
    let dead = false;
    root.innerHTML = '';
    const status = el('span', { class: 'b-pill', text: 'Prüfe Verbindung…' });
    const extra = el('div');
    root.append(el('div', { class: 'b-stack on-root' }, [
      el('div', { class: 'b-card glow b-rgb on-hero b-center' }, [
        el('div', { class: 'on-big', text: '🌐' }),
        el('h3', { class: 'b-title b-grad', text: 'Online spielen' }),
        el('p', { class: 'b-hint', text: 'Spiel live gegen Freunde – jeder am eigenen Handy. Raum erstellen, Code teilen, los geht’s.' }),
        status
      ]),
      extra,
      el('div', { class: 'b-list' }, Object.values(GAMES).map(G => el('div', { class: 'b-item' }, [el('span', { class: 'ic', text: G.icon }), el('span', { class: 'tx' }, [el('b', { text: G.name }), el('small', { text: (G.min === G.max ? G.min : G.min + '–' + G.max) + ' Spieler · ' + G.desc })])]))),
      el('button', { class: 'b-btn block', 'data-on': 'tofriends', style: { minHeight: '56px' }, text: '👥 Zum FRIENDS-Tab', onclick: () => { api.sound('click'); B.emit('nav', 'friends'); api.exit(); } })
    ]));
    Promise.race([Promise.resolve().then(() => api.room()).catch(() => null), new Promise(r => setTimeout(() => r(null), 8000))]).then(r => {
      if(dead) return;
      if(r){ status.className = 'b-pill good'; status.textContent = '● Online verfügbar'; }
      else { status.className = 'b-pill bad'; status.textContent = '● Gerade nicht verfügbar'; extra.append(unavailableCard(true)); }
    });
    return () => { dead = true; };
  }
});
})();
