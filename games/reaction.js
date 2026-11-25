/* BORED? – Reaktions- & Geschicklichkeitsspiele
   reaction-test, speed-tap, color-reflex, quick-memory, pattern, number-rush, timing, neon-dodge, stack */
(function(){
'use strict';
const B = window.BORED;
if(!B || !B.registerGame) return;
const el = B.el;

/* ---------- Gemeinsames CSS (einmalig) ---------- */
const CSS = `
.rx-hud{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:8px;margin-bottom:12px}
.rx-hs{background:var(--glass-2);border:1px solid var(--line-2);border-radius:var(--r-sm);padding:6px 8px;text-align:center;min-width:0}
.rx-hs small{display:block;color:var(--mute);font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.rx-hs b{display:block;font-family:var(--display);font-size:18px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rx-hs b.bump{animation:rxBump .25s}
@keyframes rxBump{50%{transform:scale(1.22);color:var(--cyan);text-shadow:var(--glow-c)}}
.rx-msg{text-align:center;font-family:var(--head);font-weight:700;font-size:18px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);min-height:28px;margin:6px 0 10px;transition:color .2s}
.rx-msg.go{color:var(--cyan);text-shadow:var(--glow-c)}
.rx-msg.bad{color:var(--bad)}
.rx-float{position:absolute;pointer-events:none;z-index:5;font-family:var(--display);font-weight:800;font-size:18px;color:var(--c,var(--cyan));
  text-shadow:0 0 10px currentColor;transform:translate(-50%,-50%);animation:rxFloat .7s ease-out forwards;white-space:nowrap}
@keyframes rxFloat{to{transform:translate(-50%,-160%);opacity:0}}
.rx-noselect{user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}

/* Reaktionstest */
.rx-rt{min-height:min(440px,calc(100dvh - 250px));flex-direction:column;gap:10px;cursor:pointer;touch-action:none;
  transition:background .1s,border-color .1s,box-shadow .1s}
.rx-rt .rx-big{font-family:var(--display);font-weight:800;font-size:40px;letter-spacing:.03em;line-height:1.1}
.rx-rt.wait{background:color-mix(in srgb,var(--bad) 14%,transparent);border-color:var(--bad)}
.rx-rt.wait .rx-big{color:var(--bad);text-shadow:0 0 16px var(--bad)}
.rx-rt.fake{background:color-mix(in srgb,var(--warn) 22%,transparent);border-color:var(--warn);box-shadow:0 0 30px color-mix(in srgb,var(--warn) 45%,transparent)}
.rx-rt.fake .rx-big{color:var(--warn)}
.rx-rt.go{background:color-mix(in srgb,var(--good) 30%,transparent);border-color:var(--good);
  box-shadow:0 0 44px color-mix(in srgb,var(--good) 60%,transparent),inset 0 0 70px color-mix(in srgb,var(--good) 35%,transparent)}
.rx-rt.go .rx-big{color:var(--ink);text-shadow:0 0 18px var(--good);font-size:54px}
.rx-rt.early{background:color-mix(in srgb,var(--pink) 16%,transparent);border-color:var(--pink)}
.rx-rt.early .rx-big{color:var(--pink);text-shadow:var(--glow-p)}
.rx-rt.show .rx-big{color:var(--cyan);text-shadow:var(--glow-c);font-size:54px}
.rx-dots{display:flex;gap:10px;justify-content:center;margin:14px 0 0}
.rx-dots i{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.12);transition:background .2s,box-shadow .2s}
.rx-dots i.on{background:var(--cyan);box-shadow:var(--glow-c)}

/* Stage (Speed Tap) */
.rx-stage{position:relative;height:min(560px,calc(100dvh - 200px));border-radius:var(--r);border:1px solid var(--line);overflow:hidden;
  background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--violet) 16%,transparent),transparent 70%),var(--glass);
  touch-action:none;box-shadow:0 0 30px color-mix(in srgb,var(--violet) 22%,transparent);transition:box-shadow .2s}
.rx-stage.hurt{box-shadow:inset 0 0 60px color-mix(in srgb,var(--bad) 60%,transparent),0 0 30px color-mix(in srgb,var(--bad) 40%,transparent)}
.rx-tg{position:absolute;border-radius:50%;transform:translate(-50%,-50%);--c:var(--cyan);border:3px solid var(--c);cursor:pointer;
  background:radial-gradient(circle,color-mix(in srgb,var(--c) 70%,transparent) 0 22%,color-mix(in srgb,var(--c) 18%,transparent) 24% 100%);
  box-shadow:0 0 18px var(--c),inset 0 0 16px color-mix(in srgb,var(--c) 50%,transparent);animation:rxIn .16s ease-out;color:var(--c)}
.rx-tg::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--c);animation:rxRing var(--life,1s) linear forwards;pointer-events:none}
.rx-tg.gold{--c:var(--warn)}
.rx-tg.gold::before{content:"★";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;text-shadow:0 0 10px var(--warn)}
.rx-tg.hit{animation:rxHit .22s ease-out forwards;pointer-events:none}
.rx-tg.gone{animation:rxGone .25s ease-in forwards;pointer-events:none}
@keyframes rxIn{from{transform:translate(-50%,-50%) scale(.2);opacity:0}}
@keyframes rxRing{from{transform:scale(1.9);opacity:.15}to{transform:scale(1);opacity:1}}
@keyframes rxHit{to{transform:translate(-50%,-50%) scale(1.7);opacity:0}}
@keyframes rxGone{to{transform:translate(-50%,-50%) scale(.3);opacity:0;filter:grayscale(1)}}
.rx-combo{position:absolute;left:0;right:0;top:12px;text-align:center;font-family:var(--display);font-weight:900;font-size:26px;
  color:var(--pink);text-shadow:var(--glow-p);pointer-events:none;opacity:0;transition:opacity .2s}
.rx-combo.on{opacity:1}

/* Color Reflex */
.rx-wordcard{min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.rx-word{font-family:var(--display);font-weight:900;font-size:clamp(38px,12vw,58px);letter-spacing:.06em;text-shadow:0 0 22px currentColor}
.rx-word.in{animation:popIn .18s cubic-bezier(.3,1.5,.5,1)}
.rx-tbar{height:10px;border-radius:9px;background:rgba(255,255,255,.08);overflow:hidden;margin:12px 0 14px}
.rx-tbar>i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--pink),var(--violet),var(--cyan));box-shadow:var(--glow-c)}
.rx-cbtns{display:grid;gap:10px}
.rx-cbtn{min-height:66px;border-radius:16px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);
  font-family:var(--head);font-weight:700;font-size:17px;letter-spacing:.08em;color:var(--ink);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:6px;box-shadow:0 0 14px color-mix(in srgb,var(--c) 40%,transparent);transition:transform .1s;touch-action:manipulation}
.rx-cbtn i{width:20px;height:20px;border-radius:50%;background:var(--c);box-shadow:0 0 12px var(--c)}
.rx-cbtn:active{transform:scale(.94)}

/* Simon */
.rx-simon{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px;width:min(100%,340px);aspect-ratio:1;margin:6px auto 0}
.rx-sp{--c:var(--cyan);border:2px solid var(--c);background:color-mix(in srgb,var(--c) 12%,transparent);border-radius:22px;touch-action:manipulation;
  box-shadow:0 0 12px color-mix(in srgb,var(--c) 30%,transparent);transition:background .08s,box-shadow .08s,transform .08s}
.rx-sp:nth-child(1){border-top-left-radius:140px}.rx-sp:nth-child(2){border-top-right-radius:140px}
.rx-sp:nth-child(3){border-bottom-left-radius:140px}.rx-sp:nth-child(4){border-bottom-right-radius:140px}
.rx-sp.lit{background:color-mix(in srgb,var(--c) 80%,white 10%);box-shadow:0 0 46px var(--c),inset 0 0 30px rgba(255,255,255,.4);transform:scale(.96)}
.rx-simon.lock .rx-sp{pointer-events:none}
.rx-scen{position:absolute;left:50%;top:50%;width:96px;height:96px;transform:translate(-50%,-50%);border-radius:50%;background:var(--bg);
  border:2px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;box-shadow:var(--glow-v)}
.rx-scen b{font-family:var(--display);font-size:30px;line-height:1}
.rx-scen small{font-family:var(--head);font-size:11px;letter-spacing:.12em;color:var(--mute);text-transform:uppercase}

/* Pattern + Number Rush */
.rx-grid{display:grid;gap:8px;width:min(100%,350px);aspect-ratio:1;margin:0 auto}
.rx-cell{border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);transition:background .15s,box-shadow .15s,border-color .15s,transform .1s;touch-action:manipulation}
.rx-cell:active{transform:scale(.94)}
.rx-cell.lit{background:color-mix(in srgb,var(--cyan) 70%,transparent);border-color:var(--cyan);box-shadow:0 0 22px var(--cyan)}
.rx-cell.ok{background:color-mix(in srgb,var(--violet) 70%,transparent);border-color:var(--violet);box-shadow:0 0 18px var(--violet)}
.rx-cell.no{background:color-mix(in srgb,var(--bad) 60%,transparent);border-color:var(--bad);box-shadow:0 0 18px var(--bad)}
.rx-cell.miss{border:2px dashed var(--cyan);box-shadow:inset 0 0 14px color-mix(in srgb,var(--cyan) 50%,transparent)}
.rx-grid.lock .rx-cell{pointer-events:none}
.rx-grid.win .rx-cell.ok{background:color-mix(in srgb,var(--good) 70%,transparent);border-color:var(--good);box-shadow:0 0 22px var(--good)}
.rx-num{font-family:var(--display);font-weight:800;font-size:clamp(18px,6vw,26px);color:var(--ink);display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg,var(--glass-2),color-mix(in srgb,var(--violet) 10%,transparent))}
.rx-num.done{opacity:.25;background:color-mix(in srgb,var(--cyan) 20%,transparent);border-color:var(--cyan);color:var(--cyan);transform:scale(.9)}
.rx-num.wrong{background:color-mix(in srgb,var(--bad) 50%,transparent);border-color:var(--bad);animation:shake .3s}
.rx-cd{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:900;font-size:90px;
  color:var(--cyan);text-shadow:var(--glow-c);background:color-mix(in srgb,var(--bg) 60%,transparent);border-radius:var(--r);z-index:4;pointer-events:none}
.rx-cd span{animation:popIn .35s cubic-bezier(.3,1.5,.5,1)}

/* Timing */
.rx-tpad{flex-direction:column;gap:22px;min-height:min(460px,calc(100dvh - 230px));cursor:pointer;touch-action:none}
.rx-track{position:relative;width:100%;height:70px;border-radius:16px;background:rgba(8,8,18,.6);border:1px solid var(--line);overflow:hidden}
.rx-zone{position:absolute;top:0;bottom:0;background:color-mix(in srgb,var(--good) 26%,transparent);border-left:2px solid var(--good);border-right:2px solid var(--good);
  box-shadow:inset 0 0 22px color-mix(in srgb,var(--good) 45%,transparent);transition:left .25s cubic-bezier(.2,.8,.2,1),width .25s}
.rx-perf{position:absolute;top:0;bottom:0;background:color-mix(in srgb,var(--pink) 55%,transparent);box-shadow:0 0 14px var(--pink);transition:left .25s cubic-bezier(.2,.8,.2,1),width .25s}
.rx-needle{position:absolute;top:4px;bottom:4px;left:0;width:6px;margin-left:-3px;border-radius:3px;background:var(--ink);
  box-shadow:0 0 12px var(--cyan),0 0 26px var(--cyan);will-change:transform}
.rx-track.hit{box-shadow:0 0 30px var(--good)}.rx-track.perfect{box-shadow:0 0 36px var(--pink)}.rx-track.miss{box-shadow:0 0 30px var(--bad)}
.rx-tbig{font-family:var(--display);font-weight:900;font-size:34px;letter-spacing:.06em;min-height:44px}
.rx-tbig.hit{color:var(--good);text-shadow:0 0 16px var(--good)}.rx-tbig.perfect{color:var(--pink);text-shadow:var(--glow-p)}.rx-tbig.miss{color:var(--bad)}

/* Canvas-Spiele */
.rx-cv{position:relative;height:min(600px,calc(100dvh - 190px));border-radius:var(--r);border:1px solid var(--line);overflow:hidden;background:var(--bg);
  touch-action:none;box-shadow:0 0 30px color-mix(in srgb,var(--violet) 25%,transparent)}
.rx-cv canvas{display:block;width:100%;height:100%}
.rx-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:20px;
  background:color-mix(in srgb,var(--bg) 55%,transparent);font-family:var(--head);font-weight:700;font-size:22px;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
.rx-ov[hidden]{display:none}
.rx-ov .b-hint{text-transform:none;letter-spacing:0;font-family:var(--body);font-weight:400}
.rx-ov .rx-pulse{font-size:46px;animation:rxPulse 1.2s ease-in-out infinite}
@keyframes rxPulse{50%{transform:scale(1.15);filter:drop-shadow(0 0 14px var(--cyan))}}
`;
function css(){
  if(document.getElementById('rx-style')) return;
  document.head.append(el('style', { id: 'rx-style', text: CSS }));
}

/* ---------- Helfer ---------- */
// Timer/rAF/Listener-Verwaltung – clear() stoppt alles.
function kit(){
  const T = new Set(), I = new Set(), R = new Set(), offs = [];
  return {
    to(fn, ms){ const id = setTimeout(() => { T.delete(id); fn(); }, ms); T.add(id); return id; },
    iv(fn, ms){ const id = setInterval(fn, ms); I.add(id); return id; },
    raf(fn){ const id = requestAnimationFrame(t => { R.delete(id); fn(t); }); R.add(id); return id; },
    on(t, ev, fn, o){ t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); },
    clear(){
      T.forEach(clearTimeout); T.clear(); I.forEach(clearInterval); I.clear();
      R.forEach(cancelAnimationFrame); R.clear(); offs.splice(0).forEach(f => f());
    }
  };
}
function makeHud(items){
  const vals = {};
  const node = el('div', { class: 'rx-hud' }, items.map(([k, l, v]) => { const b = el('b', { text: v }); vals[k] = b; return el('div', { class: 'rx-hs' }, [el('small', { text: l }), b]); }));
  return { node, set(k, v, bump){ const b = vals[k]; v = String(v); if(b.textContent === v) return; b.textContent = v; if(bump){ b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } } };
}
const hearts = (n, max) => '❤️'.repeat(Math.max(0, n)) + '🖤'.repeat(Math.max(0, max - n));
function floatTxt(k, parent, x, y, text, color){
  const f = el('div', { class: 'rx-float', text, style: { left: x + 'px', top: y + 'px' } });
  if(color) f.style.setProperty('--c', color);
  parent.append(f); k.to(() => f.remove(), 750);
}
function shake(node){ node.classList.remove('b-shake'); void node.offsetWidth; node.classList.add('b-shake'); }
function tokens(){
  const cs = getComputedStyle(document.documentElement), o = {};
  ['cyan', 'violet', 'pink', 'good', 'warn', 'bad', 'ink', 'mute', 'bg', 'bg2'].forEach(n => o[n] = cs.getPropertyValue('--' + n).trim() || '#fff');
  return o;
}
const hexRgb = h => { h = h.replace('#', ''); if(h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const lerpCol = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
const pd = fn => e => { e.preventDefault(); fn(e); };

/* Runde abschließen: Highscore, XP, Ergebnis */
function endGame(api, k, o){
  k.clear();
  const rep = api.reportScore(o.score, String(o.lvl));
  api.finish({ win: !!o.win, score: o.score, difficulty: o.lvl, xp: o.xp });
  api.sound(rep.isBest ? 'level' : o.win ? 'win' : 'lose');
  if(rep.isBest) api.vibrate(60);
  const fmt = o.fmt || (v => v);
  B.ui.result(api.root, api, {
    win: o.win, title: rep.isBest ? 'Neuer Rekord!' : o.title, emoji: rep.isBest ? '🏆' : o.emoji,
    sub: o.sub, lines: (o.lines || []).concat([['Rekord', fmt(rep.best)]]),
    onAgain: o.onAgain, onMenu: o.onMenu
  });
}
const clampXP = v => Math.max(5, Math.min(60, Math.round(v)));
const LV = ['Leicht', 'Mittel', 'Schwer'];

/* Gemeinsames Gerüst: Startbildschirm → play(lvl) */
function shell(api, root, opt, play){
  css();
  const k = kit();
  const menu = () => { k.clear(); B.ui.start(root, api, Object.assign({ levels: LV, onStart: lvl => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); } }, opt)); };
  menu();
  return { k, cleanup: () => { k.clear(); opt.onCleanup && opt.onCleanup(); } };
}

/* =====================================================================
   1) Reaktionstest
   ===================================================================== */
B.registerGame({
  id: 'reaction-test', name: 'Reaktionstest', icon: '⚡', cat: 'reaktion',
  desc: 'Warte auf Grün – und dann so schnell tippen, wie du kannst.',
  rules: [
    'Tippe aufs Feld, um eine Runde zu starten. Es wird rot – warte.',
    'Sobald es GRÜN wird, tippe so schnell du kannst.',
    '5 Runden – gewertet wird dein Durchschnitt in Millisekunden. Weniger ist besser.',
    'Frühstart (Tippen vor Grün) = 250 ms Strafe, die Runde wird wiederholt.',
    'Auf Schwer gibt es gelbe Fake-Signale: NICHT tippen!',
    'Unter 300 ms Schnitt zählt als Sieg.'
  ],
  players: '1', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'], lowerIsBetter: true,
  mount(root, api){
    const CFG = [{ min: 1500, max: 3000, fake: 0 }, { min: 1000, max: 4200, fake: 0 }, { min: 800, max: 5000, fake: .4 }];
    const PEN = 250;
    const grade = ms => ms < 180 ? 'Unmenschlich – bist du ein Bot? 🤖' : ms < 220 ? 'Blitzschnell ⚡ Pro-Gamer-Level' : ms < 260 ? 'Sehr schnell 🔥' :
      ms < 300 ? 'Stark 💪 über dem Schnitt' : ms < 360 ? 'Solide 👍 ganz normal' : ms < 450 ? 'Geht noch besser 🙂' : 'Eingeschlafen? 😴';
    const s = shell(api, root, { formatScore: v => v + ' ms', bestLabel: 'Bestschnitt' }, function play(k, lvl, menu){
      const c = CFG[lvl];
      let round = 0, early = 0, state = 'ready', tok = 0, goAt = 0;
      const times = [];
      const h = makeHud([['r', 'Runde', '1/5'], ['last', 'Letzte', '–'], ['early', 'Frühstarts', '0']]);
      const big = el('div', { class: 'rx-big' }), sub = el('div', { class: 'b-hint' });
      const pad = el('div', { class: 'b-pad rx-rt rx-noselect' }, [big, sub]);
      const dots = el('div', { class: 'rx-dots' }, [0, 1, 2, 3, 4].map(() => el('i')));
      root.append(h.node, pad, dots);
      const setPad = (cls, b, t) => { pad.className = 'b-pad rx-rt rx-noselect ' + cls; big.textContent = b; sub.textContent = t; };
      setPad('', 'Tippen zum Starten', 'Runde 1 von 5 – warte dann auf GRÜN');
      function arm(){
        const my = ++tok; state = 'wait';
        setPad('wait', 'Warte…', 'Erst bei GRÜN tippen');
        const d = c.min + Math.random() * (c.max - c.min);
        if(c.fake && Math.random() < c.fake && d > 1400){
          const fd = d * (.3 + Math.random() * .3);
          k.to(() => { if(tok !== my || state !== 'wait') return; state = 'fake'; setPad('fake', 'Nicht!', 'Nur ein Fake …'); api.sound('tick');
            k.to(() => { if(tok === my && state === 'fake'){ state = 'wait'; setPad('wait', 'Warte…', 'Erst bei GRÜN tippen'); } }, 420); }, fd);
        }
        k.to(() => {
          if(tok !== my || (state !== 'wait' && state !== 'fake')) return;
          state = 'go'; setPad('go', 'JETZT!', ''); goAt = performance.now();
          k.raf(() => { if(state === 'go') goAt = performance.now(); });
        }, d);
      }
      k.on(pad, 'pointerdown', pd(() => {
        if(state === 'ready'){ api.sound('click'); arm(); }
        else if(state === 'wait' || state === 'fake'){
          tok++; early++; state = 'cool'; h.set('early', early, true);
          api.sound('bad'); api.vibrate(120); shake(pad);
          setPad('early', 'Zu früh! 😬', '+' + PEN + ' ms Strafe · tippe für neuen Versuch');
          k.to(() => { if(state === 'cool') state = 'ready'; }, 500);
        } else if(state === 'go'){
          const ms = Math.max(1, Math.round(performance.now() - goAt));
          times.push(ms); round++; state = 'show';
          api.sound('good'); api.vibrate(15);
          dots.children[round - 1].classList.add('on');
          h.set('last', ms + ' ms', true); h.set('r', Math.min(5, round + 1) + '/5');
          setPad('show', ms + ' ms', grade(ms));
          if(round >= 5) k.to(end, 1000);
          else k.to(() => { if(state === 'show'){ state = 'ready'; sub.textContent = grade(ms) + ' · tippe für Runde ' + (round + 1); } }, 450);
        }
      }));
      function end(){
        const sum = times.reduce((a, b) => a + b, 0);
        const avg = Math.round((sum + early * PEN) / 5);
        const win = avg < 300;
        endGame(api, k, {
          lvl, score: avg, win, fmt: v => v + ' ms', emoji: avg < 250 ? '⚡' : win ? '🔥' : '🐢',
          title: avg + ' ms', sub: grade(avg) + (early ? ' (inkl. ' + early + '× Frühstart-Strafe)' : ''),
          xp: clampXP(win ? 30 - early * 3 + (lvl === 2 ? 6 : 0) : 12),
          lines: [['Schnitt', avg + ' ms'], ['Bester Versuch', Math.min(...times) + ' ms'], ['Frühstarts', early]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
    });
    return s.cleanup;
  }
});

/* =====================================================================
   2) Speed Tap
   ===================================================================== */
B.registerGame({
  id: 'speed-tap', name: 'Speed Tap', icon: '🎯', cat: 'reaktion',
  desc: 'Neon-Ziele ploppen auf – tipp sie weg, bevor sie verschwinden.',
  rules: [
    'Tippe die leuchtenden Ziele an, bevor der äußere Ring sie erreicht.',
    'Verpasst du ein Ziel, verlierst du ein Leben (3 Leben).',
    'Treffer in Folge bauen eine Combo auf – je höher, desto mehr Punkte.',
    'Daneben tippen kostet kein Leben, aber die Combo.',
    'Goldene ★-Ziele geben +30 Bonus.',
    'Es wird immer schneller. Überlebst du die 45 Sekunden, hast du gewonnen.'
  ],
  players: '1', tags: ['alleine', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    const CFG = [{ life: 1600, size: 78, gap: 900 }, { life: 1250, size: 66, gap: 760 }, { life: 980, size: 56, gap: 640 }];
    const DUR = 45000, MAXL = 3;
    const COLS = ['var(--cyan)', 'var(--violet)', 'var(--pink)'];
    const s = shell(api, root, { bestLabel: 'Highscore' }, function play(k, lvl, menu){
      const c = CFG[lvl];
      let score = 0, lives = MAXL, combo = 0, maxCombo = 0, hits = 0, misses = 0, over = false, t0 = 0;
      const targets = new Set();
      const h = makeHud([['s', 'Punkte', '0'], ['t', 'Zeit', '45'], ['l', 'Leben', hearts(MAXL, MAXL)]]);
      const stage = el('div', { class: 'rx-stage rx-noselect' });
      const comboEl = el('div', { class: 'rx-combo' });
      stage.append(comboEl);
      root.append(h.node, stage);
      const showCombo = () => { comboEl.textContent = combo >= 3 ? 'COMBO ×' + combo : ''; comboEl.classList.toggle('on', combo >= 3); };
      const speed = () => Math.max(.5, 1 - (performance.now() - t0) / DUR * .5);
      function hurt(){ stage.classList.add('hurt'); k.to(() => stage.classList.remove('hurt'), 220); }
      function spawn(){
        if(over) return;
        const W = stage.clientWidth, H = stage.clientHeight;
        const gold = Math.random() < .08;
        const size = Math.round(c.size * (gold ? .8 : 1) * (0.9 + speed() * .1));
        let x, y, tries = 0;
        do{
          x = size / 2 + 8 + Math.random() * (W - size - 16);
          y = size / 2 + 50 + Math.random() * (H - size - 60);
        } while(tries++ < 12 && [...targets].some(t => Math.hypot(t.x - x, t.y - y) < size + 10));
        const life = Math.round(c.life * speed());
        const n = el('div', { class: 'rx-tg' + (gold ? ' gold' : ''), style: { left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px' } });
        if(!gold) n.style.setProperty('--c', api.pick(COLS));
        n.style.setProperty('--life', life + 'ms');
        const t = { n, x, y, gold, dead: false };
        targets.add(t); stage.append(n);
        k.on(n, 'pointerdown', e => {
          e.preventDefault(); e.stopPropagation();
          if(t.dead || over) return;
          t.dead = true; targets.delete(t);
          combo++; hits++; maxCombo = Math.max(maxCombo, combo);
          const pts = (gold ? 30 : 10) + Math.min(combo - 1, 10) * 2;
          score += pts;
          h.set('s', score, true); showCombo();
          api.sound(gold ? 'good' : 'pop'); api.vibrate(gold ? 25 : 10);
          floatTxt(k, stage, x, y, '+' + pts, gold ? 'var(--warn)' : n.style.getPropertyValue('--c'));
          n.classList.add('hit'); k.to(() => n.remove(), 230);
        });
        k.to(() => {
          if(t.dead || over) return;
          t.dead = true; targets.delete(t);
          n.classList.add('gone'); k.to(() => n.remove(), 260);
          if(gold) return; // Bonusziele verpassen kostet nichts
          lives--; misses++; combo = 0; showCombo();
          h.set('l', hearts(lives, MAXL), true);
          api.sound('bad'); api.vibrate(70); hurt();
          floatTxt(k, stage, x, y, 'Verpasst', 'var(--bad)');
          if(lives <= 0) finish();
        }, life);
        const gap = c.gap * speed();
        k.to(spawn, gap * (0.75 + Math.random() * .5));
        if(speed() < .75 && Math.random() < .25) k.to(spawn, gap * .4); // Doppelziel später im Spiel
      }
      k.on(stage, 'pointerdown', e => {
        e.preventDefault();
        if(over || !t0) return;
        if(combo) floatTxt(k, stage, e.offsetX, e.offsetY, 'Combo weg', 'var(--mute)');
        combo = 0; showCombo(); api.sound('tick');
      });
      function finish(){
        if(over) return; over = true;
        targets.forEach(t => t.n.classList.add('gone'));
        const win = lives > 0;
        k.to(() => endGame(api, k, {
          lvl, score, win, title: win ? 'Durchgehalten!' : 'Keine Leben mehr', emoji: win ? '🎯' : '💥',
          sub: win ? 'Du hast die 45 Sekunden überlebt.' : 'Zu viele Ziele verpasst.',
          xp: clampXP(8 + hits * .6 + (win ? 12 : 0)),
          lines: [['Punkte', score], ['Treffer', hits], ['Beste Combo', '×' + maxCombo]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        }), 700);
      }
      // kurzer Countdown
      const cd = el('div', { class: 'rx-cd' }); stage.append(cd);
      let n = 3;
      const tickCd = () => {
        if(n === 0){ cd.remove(); t0 = performance.now(); api.sound('good'); spawn();
          k.iv(() => { if(over) return; const left = Math.max(0, DUR - (performance.now() - t0)); h.set('t', Math.ceil(left / 1000)); if(left <= 0) finish(); }, 100);
          return; }
        cd.innerHTML = ''; cd.append(el('span', { text: n })); api.sound('tick'); n--; k.to(tickCd, 650);
      };
      tickCd();
    });
    return s.cleanup;
  }
});

/* =====================================================================
   3) Color Reflex (Stroop)
   ===================================================================== */
B.registerGame({
  id: 'color-reflex', name: 'Color Reflex', icon: '🌈', cat: 'reaktion',
  desc: 'Das Wort sagt GELB, leuchtet aber PINK? Tipp die Schriftfarbe!',
  rules: [
    'Oben steht ein Farbwort – in einer ANDEREN Farbe geschrieben.',
    'Tippe den Knopf mit der SCHRIFTFARBE, nicht mit dem Wort.',
    'Der Zeitbalken läuft – zu langsam oder falsch kostet ein Leben (3 Leben).',
    'Schnelle Antworten und Serien geben Bonuspunkte. Mit jeder richtigen Antwort wird es schneller.',
    'Leicht: 3 Farben · Mittel: 4 · Schwer: 5 Farben und die Knöpfe mischen sich.',
    'Ab 20 richtigen Antworten zählt die Runde als Sieg.'
  ],
  players: '1', tags: ['alleine', 'drinnen', 'kurz', 'schwierig'],
  mount(root, api){
    const COLORS = [{ n: 'GRÜN', c: 'var(--good)' }, { n: 'PINK', c: 'var(--pink)' }, { n: 'GELB', c: 'var(--warn)' }, { n: 'TÜRKIS', c: 'var(--cyan)' }, { n: 'LILA', c: 'var(--violet)' }];
    const CFG = [{ n: 3, t: 3200, mix: false }, { n: 4, t: 2500, mix: false }, { n: 5, t: 2000, mix: true }];
    const MAXL = 3;
    const s = shell(api, root, { bestLabel: 'Highscore' }, function play(k, lvl, menu){
      const c = CFG[lvl], cols = COLORS.slice(0, c.n);
      let score = 0, lives = MAXL, streak = 0, best = 0, correct = 0, ink = 0, tStart = 0, tLen = c.t, busy = false, over = false;
      const h = makeHud([['s', 'Punkte', '0'], ['st', 'Serie', '0'], ['l', 'Leben', hearts(MAXL, MAXL)]]);
      const word = el('div', { class: 'rx-word' });
      const card = el('div', { class: 'b-card glow rx-wordcard rx-noselect' }, [el('div', { class: 'b-kicker', text: 'Tippe die Schriftfarbe' }), word]);
      const barI = el('i'), bar = el('div', { class: 'rx-tbar' }, [barI]);
      const btns = el('div', { class: 'rx-cbtns rx-noselect', style: { gridTemplateColumns: c.n === 4 ? '1fr 1fr' : '1fr 1fr 1fr' } });
      const box = el('div', { style: { position: 'relative' } }, [h.node, card, bar, btns]);
      root.append(box);
      function renderBtns(){
        btns.innerHTML = '';
        (c.mix ? api.shuffle(cols.map((x, i) => i)) : cols.map((x, i) => i)).forEach(i => {
          const b = el('button', { class: 'rx-cbtn', 'aria-label': cols[i].n }, [el('i'), el('span', { text: cols[i].n })]);
          b.style.setProperty('--c', cols[i].c);
          k.on(b, 'pointerdown', pd(() => answer(i, b)));
          btns.append(b);
        });
      }
      function next(){
        if(over) return;
        busy = false;
        ink = Math.floor(Math.random() * cols.length);
        let w; do{ w = Math.floor(Math.random() * cols.length); } while(w === ink);
        word.textContent = cols[w].n; word.style.color = cols[ink].c;
        word.classList.remove('in'); void word.offsetWidth; word.classList.add('in');
        if(c.mix) renderBtns();
        tStart = performance.now();
      }
      function lose(why){
        lives--; streak = 0; h.set('st', 0); h.set('l', hearts(lives, MAXL), true);
        api.sound('bad'); api.vibrate(90); shake(card);
        word.textContent = why; word.style.color = 'var(--bad)';
        busy = true;
        if(lives <= 0){ over = true; k.to(end, 800); }
        else k.to(next, 650);
      }
      function answer(i, b){
        if(busy || over) return;
        if(i === ink){
          const frac = Math.max(0, 1 - (performance.now() - tStart) / tLen);
          streak++; correct++; best = Math.max(best, streak);
          const pts = 10 + Math.round(frac * 10) + Math.min(streak, 10);
          score += pts; h.set('s', score, true); h.set('st', streak, streak % 5 === 0);
          api.sound(streak % 5 === 0 ? 'good' : 'pop'); api.vibrate(8);
          const r = b.getBoundingClientRect(), rr = box.getBoundingClientRect();
          floatTxt(k, box, r.left - rr.left + r.width / 2, r.top - rr.top, '+' + pts, cols[ink].c);
          tLen = Math.max(c.t * .45, tLen * .97);
          next();
        } else lose('FALSCH');
      }
      function loop(){
        if(over) return;
        if(!busy){
          const left = 1 - (performance.now() - tStart) / tLen;
          barI.style.width = Math.max(0, left * 100) + '%';
          if(left <= 0) lose('ZU LANGSAM');
        }
        k.raf(loop);
      }
      function end(){
        const win = correct >= 20;
        endGame(api, k, {
          lvl, score, win, title: win ? 'Farb-Profi!' : 'Game Over', emoji: win ? '🌈' : '🎨',
          sub: correct + ' richtige Antworten' + (win ? '' : ' – ab 20 ist es ein Sieg.'),
          xp: clampXP(8 + correct), lines: [['Punkte', score], ['Richtig', correct], ['Beste Serie', best]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
      renderBtns(); next(); loop();
    });
    return s.cleanup;
  }
});

/* =====================================================================
   4) Quick Memory (Simon)
   ===================================================================== */
function toneMaker(){
  let ctx = null;
  return {
    play(f, dur){
      if(!B.settings.sound) return;
      try{
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if(ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
        o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .05);
      }catch(e){}
    },
    close(){ try{ ctx && ctx.close(); }catch(e){} ctx = null; }
  };
}
B.registerGame({
  id: 'quick-memory', name: 'Quick Memory', icon: '🔊', cat: 'reaktion',
  desc: 'Vier Neonfelder, eine Folge, die immer länger wird. Merk sie dir!',
  rules: [
    'Schau zu: Die Felder leuchten in einer Reihenfolge auf und spielen Töne.',
    'Tippe danach dieselbe Folge nach.',
    'Jede Runde kommt ein Schritt dazu – und es wird schneller.',
    'Ein Fehler beendet das Spiel (auf Leicht hast du eine zweite Chance).',
    'Punkte = längste geschaffte Folge. Ab Länge 8 ist es ein Sieg.'
  ],
  players: '1', tags: ['alleine', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    const PADS = [{ c: 'var(--cyan)', f: 329.63 }, { c: 'var(--violet)', f: 392.0 }, { c: 'var(--pink)', f: 523.25 }, { c: 'var(--good)', f: 659.25 }];
    const CFG = [{ on: 560, off: 200, lives: 2 }, { on: 420, off: 150, lives: 1 }, { on: 320, off: 110, lives: 1 }];
    const tone = toneMaker();
    const s = shell(api, root, { bestLabel: 'Längste Folge', onCleanup: () => tone.close() }, function play(k, lvl, menu){
      const c = CFG[lvl];
      const seq = [];
      let pos = 0, lives = c.lives, score = 0, mode = 'watch';
      const h = makeHud([['s', 'Geschafft', '0'], ['l', 'Leben', hearts(lives, c.lives)]]);
      const msg = el('div', { class: 'rx-msg' });
      const cen = el('div', { class: 'rx-scen' }, [el('b', { text: '0' }), el('small', { text: 'Länge' })]);
      const board = el('div', { class: 'rx-simon lock rx-noselect' });
      const pads = PADS.map((p, i) => { const b = el('button', { class: 'rx-sp', 'aria-label': 'Feld ' + (i + 1) }); b.style.setProperty('--c', p.c); k.on(b, 'pointerdown', pd(() => press(i))); board.append(b); return b; });
      board.append(cen);
      root.append(h.node, msg, board);
      const setMsg = (t, cls) => { msg.textContent = t; msg.className = 'rx-msg ' + (cls || ''); };
      const flash = (i, ms) => { pads[i].classList.add('lit'); tone.play(PADS[i].f, Math.min(.5, ms / 1000 + .08)); k.to(() => pads[i].classList.remove('lit'), ms); };
      function show(){
        mode = 'watch'; board.classList.add('lock'); setMsg('Schau genau hin …');
        cen.firstChild.textContent = seq.length;
        const sp = Math.max(.55, 1 - seq.length * .03);
        const on = c.on * sp, off = c.off * sp;
        seq.forEach((v, idx) => k.to(() => flash(v, on), 500 + idx * (on + off)));
        k.to(() => { mode = 'input'; pos = 0; board.classList.remove('lock'); setMsg('Du bist dran!', 'go'); }, 500 + seq.length * (on + off));
      }
      function nextRound(){ seq.push(Math.floor(Math.random() * 4)); show(); }
      function press(i){
        if(mode !== 'input') return;
        flash(i, 180); api.vibrate(8);
        if(i === seq[pos]){
          pos++;
          if(pos === seq.length){
            mode = 'watch'; board.classList.add('lock');
            score = seq.length; h.set('s', score, true);
            setMsg(score % 5 === 0 ? 'Stark! ' + score + ' geschafft 🔥' : 'Richtig!', 'go');
            k.to(() => api.sound('good'), 220);
            k.to(nextRound, 900);
          }
        } else {
          mode = 'watch'; board.classList.add('lock');
          lives--; h.set('l', hearts(lives, c.lives), true);
          api.sound('bad'); api.vibrate(150); shake(board);
          pads[seq[pos]].classList.add('lit'); k.to(() => pads[seq[pos]] && pads[seq[pos]].classList.remove('lit'), 600);
          if(lives > 0){ setMsg('Falsch – nochmal ansehen', 'bad'); k.to(show, 1300); }
          else { setMsg('Falsch! Richtig wäre das leuchtende Feld.', 'bad'); k.to(end, 1400); }
        }
      }
      function end(){
        const win = score >= 8;
        endGame(api, k, {
          lvl, score, win, title: win ? 'Gedächtnis-Monster!' : 'Folge gerissen', emoji: win ? '🧠' : '🔇',
          sub: 'Deine längste Folge: ' + score + (win ? '' : ' – ab 8 ist es ein Sieg.'),
          xp: clampXP(6 + score * 3), lines: [['Längste Folge', score], ['Tempo', LV[lvl]]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
      k.to(nextRound, 300);
    });
    return s.cleanup;
  }
});

/* =====================================================================
   5) Pattern Challenge
   ===================================================================== */
B.registerGame({
  id: 'pattern', name: 'Pattern Challenge', icon: '🔳', cat: 'reaktion',
  desc: 'Das Raster blitzt kurz ein Muster auf – bau es aus dem Kopf nach.',
  rules: [
    'Einige Felder leuchten kurz auf. Merk dir, welche.',
    'Tippe danach genau diese Felder an (Reihenfolge egal).',
    'Ein falsches Feld kostet ein Leben (3 Leben) und es gibt ein neues Muster.',
    'Mit jedem Level kommen Felder dazu – das Raster wächst von 3×3 über 4×4 auf 5×5.',
    'Erreichst du das 5×5-Raster, hast du gewonnen. Weiter geht’s trotzdem für mehr Punkte!'
  ],
  players: '1', tags: ['alleine', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    const CFG = [{ start: 3, show: 1300 }, { start: 3, show: 950 }, { start: 4, show: 700 }];
    const MAXL = 3;
    const s = shell(api, root, { bestLabel: 'Highscore' }, function play(k, lvl, menu){
      const c = CFG[lvl];
      let level = 1, lives = MAXL, score = 0, pattern = new Set(), found = new Set(), mode = 'watch', reached5 = false;
      const h = makeHud([['lv', 'Level', '1'], ['s', 'Punkte', '0'], ['l', 'Leben', hearts(MAXL, MAXL)]]);
      const msg = el('div', { class: 'rx-msg' });
      const grid = el('div', { class: 'rx-grid lock rx-noselect' });
      root.append(h.node, msg, grid);
      const setMsg = (t, cls) => { msg.textContent = t; msg.className = 'rx-msg ' + (cls || ''); };
      let cells = [];
      const sizeFor = l => l <= 3 ? 3 : l <= 6 ? 4 : 5;
      function round(){
        const n = sizeFor(level);
        if(n === 5) reached5 = true;
        const count = Math.min(Math.floor(n * n * .6), c.start + level - 1 - (n === 4 ? 1 : n === 5 ? 2 : 0));
        grid.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
        grid.innerHTML = ''; grid.className = 'rx-grid lock rx-noselect b-pop';
        cells = Array.from({ length: n * n }, (x, i) => { const b = el('button', { class: 'rx-cell', 'aria-label': 'Feld ' + (i + 1) }); k.on(b, 'pointerdown', pd(() => tap(i))); grid.append(b); return b; });
        pattern = new Set(api.shuffle(cells.map((x, i) => i)).slice(0, count)); found = new Set();
        mode = 'watch'; setMsg('Merk dir ' + count + ' Felder …');
        const showT = c.show + count * 70;
        k.to(() => { pattern.forEach(i => cells[i].classList.add('lit')); api.sound('flip'); }, 550);
        k.to(() => { pattern.forEach(i => cells[i].classList.remove('lit')); grid.classList.remove('lock'); mode = 'input'; setMsg('Bau das Muster nach!', 'go'); }, 550 + showT);
      }
      function tap(i){
        if(mode !== 'input' || found.has(i)) return;
        if(pattern.has(i)){
          found.add(i); cells[i].classList.add('ok'); api.sound('pop'); api.vibrate(8);
          if(found.size === pattern.size){
            mode = 'done'; grid.classList.add('lock', 'win');
            score += pattern.size * 10 + level * 5; level++;
            h.set('s', score, true); h.set('lv', level, true);
            api.sound('good'); api.vibrate(25);
            const grows = sizeFor(level) > sizeFor(level - 1);
            setMsg(grows ? 'Raster wächst! ' + sizeFor(level) + '×' + sizeFor(level) : 'Perfekt!', 'go');
            if(grows) k.to(() => api.sound('level'), 300);
            k.to(round, grows ? 1300 : 900);
          }
        } else {
          mode = 'done'; grid.classList.add('lock');
          cells[i].classList.add('no'); lives--; h.set('l', hearts(lives, MAXL), true);
          api.sound('bad'); api.vibrate(130); shake(grid);
          pattern.forEach(j => { if(!found.has(j)) cells[j].classList.add('miss'); });
          setMsg(lives > 0 ? 'Daneben – neues Muster' : 'Aus!', 'bad');
          k.to(lives > 0 ? round : end, 1400);
        }
      }
      function end(){
        const n = sizeFor(level);
        endGame(api, k, {
          lvl, score, win: reached5, title: reached5 ? 'Muster-Meister!' : 'Muster verloren', emoji: reached5 ? '🧩' : '🔳',
          sub: 'Level ' + level + ' erreicht (' + n + '×' + n + ')' + (reached5 ? '' : ' – schaff das 5×5-Raster für den Sieg.'),
          xp: clampXP(6 + level * 4), lines: [['Punkte', score], ['Level', level], ['Raster', n + '×' + n]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
      round();
    });
    return s.cleanup;
  }
});

/* =====================================================================
   6) Number Rush
   ===================================================================== */
B.registerGame({
  id: 'number-rush', name: 'Number Rush', icon: '🔢', cat: 'reaktion',
  desc: 'Zahlen wild verteilt – tipp sie der Reihe nach, so schnell es geht.',
  rules: [
    'Tippe die Zahlen in aufsteigender Reihenfolge an: 1, 2, 3 …',
    'Die Zeit läuft ab dem Countdown. Weniger ist besser.',
    'Jeder falsche Tipp kostet 1 Sekunde Strafe.',
    'Leicht: 1–16 · Mittel: 1–25 · Schwer: 1–25 und alle 5 Zahlen wird neu gemischt.'
  ],
  players: '1', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'], lowerIsBetter: true,
  mount(root, api){
    const CFG = [{ n: 16, cols: 4, mix: 0 }, { n: 25, cols: 5, mix: 0 }, { n: 25, cols: 5, mix: 5 }];
    const fmt = v => (v / 1000).toFixed(2) + ' s';
    const s = shell(api, root, { formatScore: fmt, bestLabel: 'Bestzeit' }, function play(k, lvl, menu){
      const c = CFG[lvl];
      let next = 1, t0 = 0, pen = 0, errs = 0, running = false;
      let order = api.shuffle(Array.from({ length: c.n }, (x, i) => i + 1));
      const h = makeHud([['t', 'Zeit', '0.00'], ['n', 'Nächste', '1'], ['e', 'Fehler', '0']]);
      const grid = el('div', { class: 'rx-grid rx-noselect', style: { gridTemplateColumns: 'repeat(' + c.cols + ',1fr)', position: 'relative' } });
      root.append(h.node, el('div', { class: 'rx-msg', text: 'Tippe 1 bis ' + c.n }), grid);
      function render(){
        grid.querySelectorAll('.rx-cell').forEach(x => x.remove());
        order.forEach(v => {
          const b = el('button', { class: 'rx-cell rx-num' + (v < next ? ' done' : ''), text: v });
          k.on(b, 'pointerdown', pd(() => tap(v, b)));
          grid.append(b);
        });
      }
      function tap(v, b){
        if(!running || v < next) return;
        if(v === next){
          b.classList.add('done'); next++; api.sound('tick'); api.vibrate(6);
          h.set('n', next > c.n ? '✓' : next);
          if(next > c.n){ running = false; const total = Math.round(performance.now() - t0 + pen); h.set('t', (total / 1000).toFixed(2)); api.sound('good'); k.to(() => end(total), 500); return; }
          if(c.mix && (next - 1) % c.mix === 0){ order = api.shuffle(order); grid.classList.remove('b-pop'); void grid.offsetWidth; grid.classList.add('b-pop'); render(); api.sound('flip'); }
        } else {
          pen += 1000; errs++; h.set('e', errs, true);
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); k.to(() => b.classList.remove('wrong'), 320);
          api.sound('bad'); api.vibrate(80);
          const r = b.getBoundingClientRect(), gr = grid.getBoundingClientRect();
          floatTxt(k, grid, r.left - gr.left + r.width / 2, r.top - gr.top, '+1 s', 'var(--bad)');
        }
      }
      render();
      const cd = el('div', { class: 'rx-cd' }); grid.append(cd);
      let n = 3;
      const tick = () => {
        if(n === 0){ cd.remove(); running = true; t0 = performance.now(); api.sound('good');
          k.iv(() => { if(running) h.set('t', ((performance.now() - t0 + pen) / 1000).toFixed(2)); }, 50); return; }
        cd.innerHTML = ''; cd.append(el('span', { text: n })); api.sound('tick'); n--; k.to(tick, 650);
      };
      tick();
      function end(total){
        const par = [14000, 22000, 26000][lvl];
        endGame(api, k, {
          lvl, score: total, win: true, fmt, title: fmt(total), emoji: total < par ? '🚀' : '🔢',
          sub: total < par ? 'Richtig flott!' : 'Unter ' + (par / 1000) + ' s wäre richtig stark.',
          xp: clampXP(total < par ? 28 : 16), lines: [['Zeit', fmt(total)], ['Fehler', errs + (errs ? ' (+' + errs + ' s)' : '')], ['Zahlen', '1–' + c.n]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
    });
    return s.cleanup;
  }
});

/* =====================================================================
   7) Timing-Challenge
   ===================================================================== */
B.registerGame({
  id: 'timing', name: 'Timing-Challenge', icon: '⏱️', cat: 'geschick',
  desc: 'Der Balken schwingt hin und her – stopp ihn genau im grünen Bereich.',
  rules: [
    'Die Nadel saust über den Balken. Tippe irgendwo aufs Feld, um sie zu stoppen.',
    'Im grünen Bereich: +100. In der pinken Mitte: PERFEKT, +250!',
    'Perfekt-Serien geben zusätzlich Bonus.',
    'Nach jedem Treffer wird der Bereich kleiner und die Nadel schneller.',
    'Daneben kostet ein Leben (3 Leben). Ab 10 Treffern zählt es als Sieg.'
  ],
  players: '1', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    const CFG = [{ w: .30, sp: .6, shr: .93 }, { w: .22, sp: .8, shr: .91 }, { w: .16, sp: 1.0, shr: .89 }];
    const MAXL = 3;
    const s = shell(api, root, { bestLabel: 'Highscore' }, function play(k, lvl, menu){
      const c = CFG[lvl];
      let p = 0, dir = 1, sp = c.sp, w = c.w, zx = 0, score = 0, lives = MAXL, hits = 0, perfects = 0, pStreak = 0, state = 'run', last = 0;
      const h = makeHud([['s', 'Punkte', '0'], ['h', 'Treffer', '0'], ['l', 'Leben', hearts(MAXL, MAXL)]]);
      const zone = el('div', { class: 'rx-zone' }), perf = el('div', { class: 'rx-perf' }), needle = el('div', { class: 'rx-needle' });
      const track = el('div', { class: 'rx-track' }, [zone, perf, needle]);
      const big = el('div', { class: 'rx-tbig', text: 'TIPP!' });
      const hint = el('div', { class: 'b-hint', text: 'Tippe irgendwo hier, um zu stoppen' });
      const pad = el('div', { class: 'b-pad rx-tpad rx-noselect' }, [big, track, hint]);
      root.append(h.node, pad);
      const pw = () => Math.max(.012, w * .2);
      function placeZone(){
        zx = .04 + Math.random() * (.92 - w);
        zone.style.left = zx * 100 + '%'; zone.style.width = w * 100 + '%';
        perf.style.left = (zx + w / 2 - pw() / 2) * 100 + '%'; perf.style.width = pw() * 100 + '%';
      }
      placeZone();
      function frame(ts){
        const dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts;
        if(state === 'run'){
          p += dir * sp * dt;
          if(p >= 1){ p = 1; dir = -1; } else if(p <= 0){ p = 0; dir = 1; }
        }
        needle.style.transform = 'translateX(' + (p * track.clientWidth) + 'px)';
        k.raf(frame);
      }
      k.raf(frame);
      const setBig = (t, cls) => { big.textContent = t; big.className = 'rx-tbig ' + (cls || ''); track.className = 'rx-track ' + (cls || ''); };
      k.on(pad, 'pointerdown', pd(() => {
        if(state !== 'run') return;
        state = 'hold';
        const cx = zx + w / 2;
        if(Math.abs(p - cx) <= pw() / 2 + .004){
          pStreak++; perfects++; hits++;
          const pts = 250 + (pStreak - 1) * 50;
          score += pts; setBig('PERFEKT! +' + pts, 'perfect'); api.sound('check'); api.vibrate([20, 40, 20]);
          if(pStreak >= 2) hint.textContent = 'Perfekt-Serie ×' + pStreak + '!';
        } else if(p >= zx && p <= zx + w){
          pStreak = 0; hits++; score += 100; setBig('TREFFER +100', 'hit'); api.sound('good'); api.vibrate(15);
          hint.textContent = 'Gut! Ziel auf die pinke Mitte.';
        } else {
          pStreak = 0; lives--; setBig('DANEBEN', 'miss'); api.sound('bad'); api.vibrate(120); shake(track);
          hint.textContent = lives > 0 ? 'Noch ' + lives + (lives === 1 ? ' Leben' : ' Leben') : 'Keine Leben mehr';
          h.set('l', hearts(lives, MAXL), true);
          if(lives <= 0){ state = 'over'; k.to(end, 900); return; }
        }
        h.set('s', score, true); h.set('h', hits);
        k.to(() => {
          if(state !== 'hold') return;
          if(big.classList.contains('hit') || big.classList.contains('perfect')){ w = Math.max(.045, w * c.shr); sp = Math.min(2.6, sp * 1.06); }
          placeZone(); setBig('TIPP!'); state = 'run';
        }, 650);
      }));
      function end(){
        const win = hits >= 10;
        endGame(api, k, {
          lvl, score, win, title: win ? 'Perfektes Timing!' : 'Zeitlich daneben', emoji: win ? '⏱️' : '⌛',
          sub: hits + ' Treffer, davon ' + perfects + '× perfekt' + (win ? '' : ' – ab 10 Treffern ist es ein Sieg.'),
          xp: clampXP(6 + hits * 2 + perfects), lines: [['Punkte', score], ['Treffer', hits], ['Perfekt', perfects]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
    });
    return s.cleanup;
  }
});

/* ---------- Canvas-Helfer ---------- */
function canvasStage(k, root){
  const wrap = el('div', { class: 'rx-cv rx-noselect' });
  const cv = el('canvas');
  const ov = el('div', { class: 'rx-ov' });
  wrap.append(cv, ov); root.append(wrap);
  const ctx = cv.getContext('2d');
  const st = { wrap, cv, ov, ctx, W: 0, H: 0 };
  st.resize = () => {
    const r = wrap.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    st.W = Math.max(1, r.width); st.H = Math.max(1, r.height);
    cv.width = Math.round(st.W * dpr); cv.height = Math.round(st.H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  st.resize(); k.on(window, 'resize', st.resize);
  st.overlay = (icon, title, hint) => {
    if(icon == null){ ov.hidden = true; return; }
    ov.hidden = false; ov.innerHTML = '';
    ov.append(el('div', { class: 'rx-pulse', text: icon }), el('div', { text: title }), hint ? el('div', { class: 'b-hint', text: hint }) : null);
  };
  return st;
}

/* =====================================================================
   8) Neon Dodge
   ===================================================================== */
B.registerGame({
  id: 'neon-dodge', name: 'Neon Dodge', icon: '🟪', cat: 'geschick',
  desc: 'Steuer deinen Neon-Orb mit dem Finger durch einen Hagel aus Blöcken.',
  rules: [
    'Leg den Finger aufs Spielfeld – dein Orb folgt ihm (leicht über dem Finger, damit du ihn siehst).',
    'Weich den fallenden Neon-Blöcken aus. Eine Berührung und es ist vorbei.',
    'Je länger du überlebst, desto schneller und dichter wird es.',
    'Finger loslassen oder App verlassen pausiert das Spiel.',
    'Punkte = Überlebenszeit. Ab 30 Sekunden zählt es als Sieg.'
  ],
  players: '1', tags: ['alleine', 'drinnen', 'kurz', 'schwierig'],
  mount(root, api){
    const CFG = [{ rate: 1.1, speed: 170, wide: 1 }, { rate: 1.6, speed: 215, wide: 1.1 }, { rate: 2.1, speed: 260, wide: 1.2, drift: true }];
    const fmt = v => Number(v).toFixed(1) + ' s';
    const s = shell(api, root, { formatScore: fmt, bestLabel: 'Bestzeit' }, function play(k, lvl, menu){
      const c = CFG[lvl], col = tokens();
      const h = makeHud([['t', 'Zeit', '0.0 s'], ['b', 'Rekord', api.best(String(lvl)) == null ? '–' : fmt(api.best(String(lvl)))]]);
      root.append(h.node);
      const st = canvasStage(k, root), ctx = st.ctx;
      const BCOL = [col.cyan, col.violet, col.pink];
      const P = { x: st.W / 2, y: st.H * .78, r: 11, tx: st.W / 2, ty: st.H * .78 };
      let blocks = [], parts = [], t = 0, acc = 0, state = 'ready', last = 0, scroll = 0, looping = false, offY = 0;
      const fx = B.settings.particles && B.settings.anim;
      st.overlay('👆', 'Finger aufs Feld', 'Halte gedrückt und weich den Blöcken aus');
      const local = e => { const r = st.cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      function setTarget(e){ const q = local(e); P.tx = Math.max(P.r, Math.min(st.W - P.r, q.x)); P.ty = Math.max(P.r, Math.min(st.H - P.r, q.y - offY)); }
      k.on(st.wrap, 'pointerdown', e => {
        e.preventDefault();
        try{ st.wrap.setPointerCapture(e.pointerId); }catch(x){}
        offY = e.pointerType === 'mouse' ? 0 : 46;
        setTarget(e);
        if(state === 'ready'){ P.x = P.tx; P.y = P.ty; state = 'run'; st.overlay(null); api.sound('good'); startLoop(); }
        else if(state === 'pause'){ state = 'run'; st.overlay(null); api.sound('click'); startLoop(); }
      });
      k.on(st.wrap, 'pointermove', e => { if(state === 'run') setTarget(e); });
      const lift = e => { if(state === 'run' && e.pointerType !== 'mouse') pause(); };
      k.on(st.wrap, 'pointerup', lift); k.on(st.wrap, 'pointercancel', lift);
      k.on(document, 'visibilitychange', () => { if(document.hidden) pause(); });
      k.on(window, 'blur', () => pause());
      function pause(){ if(state !== 'run') return; state = 'pause'; st.overlay('⏸️', 'Pause', 'Finger wieder aufs Feld zum Weiterspielen'); draw(); }
      function startLoop(){ if(looping) return; looping = true; last = 0; k.raf(frame); }
      function spawn(){
        const diff = 1 + t / 40;
        const bw = (26 + Math.random() * 54) * c.wide * Math.min(1.5, .9 + t / 80);
        const bh = 16 + Math.random() * 26;
        blocks.push({ x: Math.random() * (st.W - bw), y: -bh - 4, w: bw, h: bh, vy: c.speed * diff * (.8 + Math.random() * .45),
          vx: c.drift && Math.random() < .35 ? (Math.random() - .5) * 120 : 0, c: BCOL[Math.floor(Math.random() * 3)] });
      }
      function burst(x, y, color, n, spd){
        if(!fx) return;
        for(let i = 0; i < n; i++){ const a = Math.random() * Math.PI * 2, v = spd * (.3 + Math.random()); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .5 + Math.random() * .6, max: 1.1, c: color, r: 1.5 + Math.random() * 2.5 }); }
      }
      function hit(b){
        const cx = Math.max(b.x, Math.min(P.x, b.x + b.w)), cy = Math.max(b.y, Math.min(P.y, b.y + b.h));
        return (P.x - cx) ** 2 + (P.y - cy) ** 2 < (P.r - 1.5) ** 2;
      }
      function update(dt){
        t += dt;
        const k2 = Math.min(1, dt * 22);
        P.x += (P.tx - P.x) * k2; P.y += (P.ty - P.y) * k2;
        acc += dt * c.rate * (1 + t / 25);
        while(acc >= 1){ acc -= 1; spawn(); }
        for(const b of blocks){
          b.y += b.vy * dt; b.x += b.vx * dt;
          if(b.x < 0 || b.x + b.w > st.W) b.vx *= -1;
          if(hit(b)){ die(b); return; }
        }
        blocks = blocks.filter(b => b.y < st.H + 10);
        if(fx && Math.random() < .8) parts.push({ x: P.x + (Math.random() - .5) * 6, y: P.y + 6, vx: (Math.random() - .5) * 20, vy: 60 + Math.random() * 60, life: .35, max: .35, c: col.cyan, r: 2 });
        const tt = Math.floor(t * 10) / 10;
        h.set('t', tt.toFixed(1) + ' s');
        if(Math.floor(t) % 10 === 0 && Math.floor(t - dt) % 10 === 9) { api.sound('tick'); }
      }
      function die(b){
        state = 'dead';
        burst(P.x, P.y, col.pink, 60, 260); burst(P.x, P.y, col.cyan, 40, 180); burst(P.x, P.y, b.c, 30, 220);
        api.sound('capture'); api.vibrate([80, 40, 160]);
        const score = Math.round(t * 10) / 10;
        k.to(() => endGame(api, k, {
          lvl, score, win: score >= 30, fmt, title: fmt(score), emoji: score >= 30 ? '🛡️' : '💥',
          sub: score >= 30 ? 'Wahnsinn – du bist ausgewichen wie ein Profi.' : 'Erwischt! Ab 30 s ist es ein Sieg.',
          xp: clampXP(6 + score * 1.2), lines: [['Überlebt', fmt(score)], ['Stufe', LV[lvl]]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        }), 1100);
      }
      function draw(){
        const W = st.W, H = st.H;
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, col.bg); g.addColorStop(1, col.bg2);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // Synthwave-Gitter
        ctx.strokeStyle = col.violet; ctx.lineWidth = 1; ctx.globalAlpha = .13;
        const gs = 38; const off = scroll % gs;
        ctx.beginPath();
        for(let y = off - gs; y < H; y += gs){ ctx.moveTo(0, y); ctx.lineTo(W, y); }
        for(let x = (W % gs) / 2; x < W; x += gs){ ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        ctx.stroke(); ctx.globalAlpha = 1;
        // Blöcke
        for(const b of blocks){
          ctx.shadowColor = b.c; ctx.shadowBlur = 16;
          ctx.globalAlpha = .22; ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.globalAlpha = 1; ctx.strokeStyle = b.c; ctx.lineWidth = 2; ctx.strokeRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
        }
        // Partikel
        ctx.shadowBlur = 0;
        for(const p of parts){ ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
        ctx.globalAlpha = 1;
        // Spieler
        if(state !== 'dead'){
          ctx.shadowColor = col.cyan; ctx.shadowBlur = 22;
          const rg = ctx.createRadialGradient(P.x, P.y, 1, P.x, P.y, P.r);
          rg.addColorStop(0, '#fff'); rg.addColorStop(.45, col.cyan); rg.addColorStop(1, col.violet);
          ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(P.x, P.y, P.r, 0, 6.283); ctx.fill();
          ctx.shadowBlur = 0; ctx.strokeStyle = col.cyan; ctx.globalAlpha = .35; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(P.x, P.y, P.r + 6 + Math.sin(performance.now() / 160) * 2, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
      function frame(ts){
        const dt = last ? Math.min(.033, (ts - last) / 1000) : 1 / 60; last = ts;
        if(state === 'run'){ update(dt); scroll += dt * (60 + t * 3); }
        for(const p of parts){ p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy *= .97; p.life -= dt; }
        parts = parts.filter(p => p.life > 0);
        draw();
        if(state === 'run' || state === 'dead') k.raf(frame); else looping = false;
      }
      draw();
    });
    return s.cleanup;
  }
});

/* =====================================================================
   9) Neon Stack
   ===================================================================== */
B.registerGame({
  id: 'stack', name: 'Neon Stack', icon: '🧱', cat: 'geschick',
  desc: 'Stapel Neon-Blöcke zum Turm – was übersteht, wird abgeschnitten.',
  rules: [
    'Ein Block pendelt über dem Turm. Tippe, um ihn abzusetzen.',
    'Was über den Block darunter hinausragt, wird abgeschnitten – der Turm wird schmaler.',
    'Genau getroffen = PERFEKT: nichts wird abgeschnitten. 3 Perfekte in Folge lassen den Block wieder wachsen.',
    'Verfehlst du den Turm ganz, ist das Spiel vorbei.',
    'Punkte = Anzahl gestapelter Blöcke. Ab 20 Blöcken zählt es als Sieg.'
  ],
  players: '1', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    const CFG = [{ w: .62, sp: 1.9, tol: 6 }, { w: .52, sp: 2.4, tol: 5 }, { w: .44, sp: 3.0, tol: 4 }];
    const s = shell(api, root, { bestLabel: 'Höchster Turm' }, function play(k, lvl, menu){
      const c = CFG[lvl], col = tokens();
      const PAL = [hexRgb(col.cyan), hexRgb(col.violet), hexRgb(col.pink)];
      const colorAt = i => { const f = (i * .12) % 3, a = Math.floor(f), t = f - a; return lerpCol(PAL[a], PAL[(a + 1) % 3], t); };
      const h = makeHud([['s', 'Höhe', '0'], ['p', 'Perfekt', '0'], ['b', 'Rekord', api.best(String(lvl)) == null ? '–' : api.best(String(lvl))]]);
      root.append(h.node);
      const st = canvasStage(k, root), ctx = st.ctx;
      const BH = 26;
      const W0 = Math.round(st.W * c.w);
      const stack = [{ x: (st.W - W0) / 2, w: W0, c: colorAt(0) }];
      let cur = null, phase = 0, falls = [], parts = [], cam = 0, state = 'ready', last = 0, perfects = 0, pRun = 0, flash = 0, flashTxt = '', looping = false;
      const fx = B.settings.particles && B.settings.anim;
      const baseY = () => st.H - 60; // Unterkante des Sockels (Bildschirm, ohne Kamera)
      const yOf = i => baseY() - (i + 1) * BH; // Oberkante von Block i
      function newBlock(){
        const top = stack[stack.length - 1];
        phase = Math.random() < .5 ? -Math.PI / 2 : Math.PI / 2;
        cur = { w: top.w, x: 0, c: colorAt(stack.length) };
        posCur();
      }
      function posCur(){ const amp = (st.W - cur.w) / 2 + cur.w * .35; cur.x = (st.W - cur.w) / 2 + Math.sin(phase) * amp; }
      st.overlay('🧱', 'Tippen zum Starten', 'Setz den pendelnden Block genau auf den Turm');
      k.on(st.wrap, 'pointerdown', e => {
        e.preventDefault();
        if(state === 'ready'){ state = 'run'; st.overlay(null); newBlock(); api.sound('good'); startLoop(); return; }
        if(state === 'run') place();
      });
      k.on(document, 'visibilitychange', () => { if(!document.hidden && looping) last = 0; });
      function place(){
        const top = stack[stack.length - 1];
        const dx = cur.x - top.x;
        const idx = stack.length;
        if(Math.abs(dx) <= c.tol){
          cur.x = top.x; perfects++; pRun++;
          if(pRun >= 3 && cur.w < W0){ const g = Math.min(W0 - cur.w, 14); cur.w += g; cur.x -= g / 2; }
          stack.push(cur);
          flash = 1; flashTxt = pRun >= 3 ? 'PERFEKT ×' + pRun : 'PERFEKT!';
          api.sound('check'); api.vibrate([15, 30, 15]);
          spark(cur.x, cur.w, idx, cur.c, 26);
          h.set('p', perfects, true);
        } else {
          pRun = 0;
          const L = Math.max(cur.x, top.x), R = Math.min(cur.x + cur.w, top.x + top.w), ov = R - L;
          if(ov <= 0){
            falls.push({ x: cur.x, y: yOf(idx), w: cur.w, c: cur.c, vy: 0, vx: dx > 0 ? 60 : -60, r: 0, vr: dx > 0 ? 2 : -2 });
            cur = null; state = 'over'; api.sound('capture'); api.vibrate([60, 40, 140]);
            k.to(end, 1200); return;
          }
          // abgeschnittener Teil fällt
          const cutX = dx > 0 ? R : cur.x, cutW = cur.w - ov;
          falls.push({ x: cutX, y: yOf(idx), w: cutW, c: cur.c, vy: 0, vx: dx > 0 ? 50 : -50, r: 0, vr: dx > 0 ? 1.8 : -1.8 });
          stack.push({ x: L, w: ov, c: cur.c });
          api.sound('tap'); api.vibrate(12);
          spark(dx > 0 ? R : L, 2, idx, cur.c, 10);
        }
        h.set('s', stack.length - 1, true);
        if((stack.length - 1) % 10 === 0) api.sound('level');
        newBlock();
      }
      function spark(x, w, idx, color, n){
        if(!fx) return;
        for(let i = 0; i < n; i++) parts.push({ x: x + Math.random() * w, y: yOf(idx) + BH, vx: (Math.random() - .5) * 160, vy: -Math.random() * 160, life: .6, c: color });
      }
      function startLoop(){ if(looping) return; looping = true; last = 0; k.raf(frame); }
      function frame(ts){
        const dt = last ? Math.min(.033, (ts - last) / 1000) : 1 / 60; last = ts;
        const n = stack.length;
        if(state === 'run' && cur){ phase += dt * c.sp * Math.min(1.9, 1 + n * .025); posCur(); }
        const camT = Math.max(0, (n - 9) * BH);
        cam += (camT - cam) * Math.min(1, dt * 6);
        for(const f of falls){ f.vy += 1100 * dt; f.y += f.vy * dt; f.x += f.vx * dt; f.r += f.vr * dt; }
        falls = falls.filter(f => f.y + cam < st.H + 80);
        for(const p of parts){ p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
        parts = parts.filter(p => p.life > 0);
        flash = Math.max(0, flash - dt * 1.4);
        draw();
        if(state === 'run' || falls.length || parts.length || flash > 0) k.raf(frame); else looping = false;
      }
      function block(x, y, w, color, glow){
        ctx.shadowColor = color; ctx.shadowBlur = glow ? 18 : 8;
        ctx.globalAlpha = .85; ctx.fillStyle = color; ctx.fillRect(x, y, w, BH - 2);
        ctx.shadowBlur = 0; ctx.globalAlpha = .55; ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, 3);
        ctx.globalAlpha = 1;
      }
      function draw(){
        const W = st.W, H = st.H;
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, col.bg2); g.addColorStop(1, col.bg);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // Sterne (wandern mit der Kamera)
        ctx.fillStyle = col.ink;
        for(let i = 0; i < 40; i++){ const sx = (i * 97.3) % W, sy = ((i * 61.7 + cam * .3) % H); ctx.globalAlpha = .15 + (i % 5) * .07; ctx.fillRect(sx, sy, 1.6, 1.6); }
        ctx.globalAlpha = 1;
        ctx.save(); ctx.translate(0, cam);
        // Sockel
        ctx.fillStyle = col.violet; ctx.globalAlpha = .18; ctx.fillRect(0, baseY(), W, 400); ctx.globalAlpha = 1;
        ctx.strokeStyle = col.violet; ctx.shadowColor = col.violet; ctx.shadowBlur = 12; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, baseY()); ctx.lineTo(W, baseY()); ctx.stroke(); ctx.shadowBlur = 0;
        const from = Math.max(0, Math.floor((cam - 60) / BH) - 1);
        for(let i = from; i < stack.length; i++){ const b = stack[i]; const y = yOf(i); if(y - (-cam) > H + BH) continue; block(b.x, y, b.w, b.c, i >= stack.length - 2); }
        if(cur && state === 'run'){
          const y = yOf(stack.length);
          // Führungslinien
          ctx.globalAlpha = .25; ctx.strokeStyle = cur.c; ctx.setLineDash([4, 6]); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cur.x, y + BH); ctx.lineTo(cur.x, y + BH * 2); ctx.moveTo(cur.x + cur.w, y + BH); ctx.lineTo(cur.x + cur.w, y + BH * 2); ctx.stroke();
          ctx.setLineDash([]); ctx.globalAlpha = 1;
          block(cur.x, y, cur.w, cur.c, true);
        }
        for(const f of falls){
          ctx.save(); ctx.translate(f.x + f.w / 2, f.y + BH / 2); ctx.rotate(f.r); ctx.globalAlpha = .7;
          ctx.fillStyle = f.c; ctx.shadowColor = f.c; ctx.shadowBlur = 10; ctx.fillRect(-f.w / 2, -BH / 2, f.w, BH - 2); ctx.restore();
        }
        for(const p of parts){ ctx.globalAlpha = Math.max(0, p.life / .6); ctx.fillStyle = p.c; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); }
        ctx.globalAlpha = 1;
        ctx.restore();
        // Höhe groß
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.font = '900 52px ' + getComputedStyle(document.documentElement).getPropertyValue('--display');
        ctx.fillStyle = col.ink; ctx.shadowColor = col.violet; ctx.shadowBlur = 20; ctx.globalAlpha = .9;
        ctx.fillText(String(stack.length - 1), W / 2, 22);
        if(flash > 0){
          ctx.globalAlpha = flash; ctx.font = '800 22px ' + getComputedStyle(document.documentElement).getPropertyValue('--head');
          ctx.fillStyle = col.pink; ctx.shadowColor = col.pink; ctx.fillText(flashTxt, W / 2, 84 - (1 - flash) * 14);
        }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      function end(){
        const score = stack.length - 1, win = score >= 20;
        endGame(api, k, {
          lvl, score, win, title: win ? 'Wolkenkratzer!' : 'Turm eingestürzt', emoji: win ? '🏙️' : '🧱',
          sub: score + ' Blöcke, davon ' + perfects + '× perfekt' + (win ? '' : ' – ab 20 ist es ein Sieg.'),
          xp: clampXP(6 + score * 1.5 + perfects), lines: [['Höhe', score], ['Perfekt', perfects]],
          onAgain: () => { k.clear(); root.innerHTML = ''; play(k, lvl, menu); }, onMenu: menu
        });
      }
      draw();
    });
    return s.cleanup;
  }
});
})();
