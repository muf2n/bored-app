/* BORED? – Denkspiele: Sudoku, Memory, Mastermind, Wortel, 2048, Logikrätsel, Escape Room.
   Alle Module registrieren sich über BORED.registerGame (cat 'denk'). Eigenes CSS mit Präfix .br- */
(function(){
'use strict';
const B = window.BORED;
const el = B.el;

/* ================= Gemeinsame Helfer ================= */
const CSS = `
.br-top{display:flex;gap:8px;align-items:stretch;margin-bottom:10px}
.br-mini{flex:1;background:var(--glass-2);border:1px solid var(--line-2);border-radius:12px;padding:5px 10px;min-width:0;transition:border-color .2s,box-shadow .2s}
.br-mini small{display:block;color:var(--mute);font-size:11px;font-family:var(--head);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.br-mini b{font-family:var(--display);font-size:17px;font-variant-numeric:tabular-nums;white-space:nowrap}
.br-mini.on{border-color:var(--cyan);box-shadow:var(--glow-c)}
.br-mini.on2{border-color:var(--pink);box-shadow:var(--glow-p)}
.br-mini.bad b{color:var(--bad)}
.br-gen{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}
.br-spin{width:46px;height:46px;border-radius:50%;border:4px solid var(--line-2);border-top-color:var(--cyan);animation:brSpin .8s linear infinite}
@keyframes brSpin{to{transform:rotate(360deg)}}
@keyframes brPop{50%{transform:scale(1.15)}}
@keyframes brFlash{50%{background:rgba(61,245,160,.38)}}
@keyframes brGlow{0%,100%{box-shadow:0 0 6px rgba(61,245,160,.3)}50%{box-shadow:0 0 22px rgba(61,245,160,.8)}}
.br-row2{display:flex;gap:8px}
.br-row2>*{flex:1}

/* Sudoku */
.br-su{display:grid;grid-template-columns:repeat(9,1fr);width:100%;max-width:430px;margin:0 auto;aspect-ratio:1;border:2px solid var(--violet);border-radius:12px;overflow:hidden;box-shadow:var(--glow-v);background:rgba(8,8,18,.92)}
.br-c{position:relative;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:clamp(17px,5.6vw,26px);font-weight:700;border-right:1px solid var(--line-2);border-bottom:1px solid var(--line-2);color:var(--cyan);padding:0;min-width:0;min-height:0;transition:background .12s;text-shadow:0 0 8px rgba(0,229,255,.35)}
.br-c:nth-child(9n){border-right:0}.br-c:nth-child(n+73){border-bottom:0}
.br-c.br-r3{border-right:2px solid var(--violet)}.br-c.br-b3{border-bottom:2px solid var(--violet)}
.br-c.giv{color:var(--ink);text-shadow:none}
.br-c.rel{background:rgba(168,85,247,.12)}
.br-c.same{background:rgba(0,229,255,.2)}
.br-c.sel{background:rgba(0,229,255,.32);box-shadow:inset 0 0 0 2px var(--cyan)}
.br-c.err{color:var(--bad);background:rgba(255,84,112,.2);text-shadow:none}
.br-c.flash{animation:brFlash .7s}
.br-notes{position:absolute;inset:1px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);font-size:clamp(8px,2.5vw,11px);color:var(--mute);font-family:var(--body);font-weight:700;line-height:1;text-shadow:none}
.br-notes i{font-style:normal;display:flex;align-items:center;justify-content:center}
.br-notes i.hl{color:var(--cyan)}
.br-tools{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0 10px}
.br-tool{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:5px 0;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);font-size:20px;min-height:52px;line-height:1.1}
.br-tool small{font-size:11px;font-family:var(--head);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.br-tool.on{border-color:var(--cyan);box-shadow:var(--glow-c);background:rgba(0,229,255,.12)}.br-tool.on small{color:var(--cyan)}
.br-tool:disabled{opacity:.35}
.br-tool:active{transform:scale(.95)}
.br-pad{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}
.br-num{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:58px;border-radius:12px;background:linear-gradient(160deg,rgba(168,85,247,.32),rgba(0,229,255,.12));border:1px solid var(--line);font-family:var(--display);font-size:24px;font-weight:700;padding:0;line-height:1.05;min-width:0}
.br-num small{font-size:10px;color:var(--mute);font-family:var(--body);font-weight:600}
.br-num:active{transform:scale(.92)}
.br-num:disabled{opacity:.2}
.br-num.nm{background:linear-gradient(160deg,rgba(0,229,255,.25),rgba(168,85,247,.12));border-color:var(--cyan)}

/* Memory */
.br-mg{display:grid;gap:8px;margin:0 auto}
.br-mc{perspective:700px;aspect-ratio:3/4;padding:0;border-radius:12px;min-width:0}
.br-mc-in{position:relative;width:100%;height:100%;transition:transform .45s cubic-bezier(.3,1.25,.5,1);transform-style:preserve-3d}
.br-mc.up .br-mc-in{transform:rotateY(180deg)}
.br-mc-f{position:absolute;inset:0;border-radius:12px;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;-webkit-backface-visibility:hidden;border:1px solid var(--line)}
.br-mc-b{background:repeating-linear-gradient(45deg,rgba(168,85,247,.32) 0 6px,rgba(0,229,255,.1) 6px 12px),var(--bg2);font-family:var(--display);font-weight:800;font-size:22px;color:var(--violet);text-shadow:var(--glow-v)}
.br-mc-fr{transform:rotateY(180deg);background:linear-gradient(160deg,var(--glass-2),rgba(8,8,18,.9));font-size:clamp(24px,8.5vw,44px)}
.br-mc.done .br-mc-fr{border-color:var(--good);animation:brGlow 1s 1}
.br-mc.done{opacity:.8}
.br-mc.miss .br-mc-fr{border-color:var(--bad);box-shadow:0 0 14px rgba(255,84,112,.5)}

/* Mastermind */
.br-mm-rows{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.br-mm-row{display:flex;align-items:center;gap:8px;padding:3px 8px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid transparent}
.br-mm-row.cur{border-color:var(--cyan);background:rgba(0,229,255,.07);box-shadow:var(--glow-c)}
.br-mm-n{width:18px;color:var(--mute);font-size:12px;font-family:var(--head);font-weight:700;text-align:right}
.br-mm-pegs{display:flex;gap:6px;flex:1}
.br-peg{width:30px;height:30px;border-radius:50%;border:1.5px dashed var(--line);display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(0,0,0,.55);padding:0;flex:0 0 auto}
.br-mm-row.cur .br-peg{width:34px;height:34px}
.br-peg.f{border:0;background:var(--pc);box-shadow:0 0 9px var(--pc),inset 0 -3px 6px rgba(0,0,0,.35);animation:brPop .18s}
.br-fb{display:grid;grid-template-columns:repeat(3,10px);gap:3px;width:36px}
.br-fb i{width:10px;height:10px;border-radius:50%;border:1px solid var(--line-2)}
.br-fb i.k{background:var(--bg);border:2px solid var(--ink)}
.br-fb i.w{background:var(--ink);border-color:var(--ink);box-shadow:0 0 5px rgba(245,245,255,.6)}
.br-pal{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin-bottom:10px}
.br-pal button{width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:var(--pc);box-shadow:0 0 10px var(--pc),inset 0 -4px 8px rgba(0,0,0,.35);font-size:17px;color:rgba(0,0,0,.55);font-weight:800}
.br-pal button:active{transform:scale(.88)}
.br-secret{display:flex;gap:6px;align-items:center;justify-content:center;padding:6px;border-radius:12px;background:rgba(255,255,255,.04);margin-bottom:8px}
.br-legend{display:flex;gap:14px;justify-content:center;font-size:12px;color:var(--mute);margin-top:4px;align-items:center}
.br-legend .br-fb{display:inline-grid;grid-template-columns:10px;width:auto}

/* Wortel */
.br-wg{display:grid;gap:6px;width:min(100%,300px);margin:0 auto 12px}
.br-wr{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.br-wr.b-shake{animation:shake .35s}
.br-wt{aspect-ratio:1;border:2px solid var(--line-2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:25px;font-weight:800;background:rgba(8,8,18,.5)}
.br-wt.fill{border-color:var(--mute);animation:brPop .12s}
.br-wt.s2{background:color-mix(in srgb,var(--good) 78%,transparent);border-color:var(--good);color:var(--bg);box-shadow:0 0 12px rgba(61,245,160,.4)}
.br-wt.s1{background:color-mix(in srgb,var(--warn) 82%,transparent);border-color:var(--warn);color:var(--bg)}
.br-wt.s0{background:rgba(255,255,255,.09);border-color:transparent;color:var(--mute)}
.br-wt.rev{animation:brFlip .5s both}
@keyframes brFlip{0%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
.br-kb{display:flex;flex-direction:column;gap:6px}
.br-kr{display:flex;gap:4px;justify-content:center}
.br-k{flex:1;min-width:0;min-height:52px;border-radius:9px;background:var(--glass-2);border:1px solid var(--line-2);font-family:var(--head);font-weight:700;font-size:17px;padding:0;text-transform:uppercase}
.br-k.wide{flex:1.6;font-size:12px;letter-spacing:.04em}
.br-k:active{transform:scale(.92)}
.br-k.s2{background:color-mix(in srgb,var(--good) 75%,transparent);color:var(--bg);border-color:var(--good)}
.br-k.s1{background:color-mix(in srgb,var(--warn) 80%,transparent);color:var(--bg);border-color:var(--warn)}
.br-k.s0{background:rgba(255,255,255,.03);color:rgba(167,163,201,.45);border-color:transparent}
.br-dist{display:flex;flex-direction:column;gap:5px}
.br-dist div{display:flex;align-items:center;gap:8px;font-family:var(--head);font-weight:700}
.br-dist i{display:block;height:20px;min-width:22px;border-radius:6px;background:linear-gradient(90deg,var(--violet),var(--cyan));font-style:normal;text-align:right;padding:0 6px;font-size:13px;line-height:20px;color:var(--bg)}
.br-dist i.cur{background:linear-gradient(90deg,var(--good),var(--cyan))}

/* 2048 */
.br-48{position:relative;width:100%;max-width:400px;margin:0 auto;aspect-ratio:1;border-radius:16px;background:rgba(8,8,18,.75);border:1px solid var(--line);box-shadow:0 0 30px rgba(168,85,247,.25);touch-action:none;user-select:none;-webkit-user-select:none;--g:8px;overflow:hidden}
.br-48 .br-bg,.br-t{position:absolute;left:var(--g);top:var(--g);width:calc((100% - var(--g) * (var(--n) + 1)) / var(--n));height:calc((100% - var(--g) * (var(--n) + 1)) / var(--n));border-radius:10px;transform:translate(calc(var(--c) * (100% + var(--g))),calc(var(--r) * (100% + var(--g))))}
.br-48 .br-bg{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.04)}
.br-t{transition:transform .11s ease-out;z-index:2}
.br-t i{font-style:normal;display:flex;width:100%;height:100%;align-items:center;justify-content:center;border-radius:10px;font-family:var(--display);font-weight:800;font-size:var(--fs,30px);color:var(--ink);background:rgba(255,255,255,.12)}
.br-t.new i{animation:brIn .2s .09s both}
.br-t.mrg i{animation:brPop .2s}
.br-t.dead{z-index:1}
@keyframes brIn{from{transform:scale(0);opacity:0}}
.br-t.v4 i{background:color-mix(in srgb,var(--violet) 32%,transparent)}
.br-t.v8 i{background:color-mix(in srgb,var(--violet) 62%,transparent)}
.br-t.v16 i{background:color-mix(in srgb,var(--pink) 55%,transparent)}
.br-t.v32 i{background:color-mix(in srgb,var(--pink) 85%,transparent);box-shadow:var(--glow-p)}
.br-t.v64 i{background:color-mix(in srgb,var(--bad) 88%,transparent);box-shadow:0 0 16px rgba(255,84,112,.55)}
.br-t.v128 i{background:color-mix(in srgb,var(--warn) 70%,transparent);color:var(--bg)}
.br-t.v256 i{background:var(--warn);color:var(--bg);box-shadow:0 0 18px rgba(255,201,60,.6)}
.br-t.v512 i{background:color-mix(in srgb,var(--good) 80%,transparent);color:var(--bg);box-shadow:0 0 18px rgba(61,245,160,.55)}
.br-t.v1024 i{background:color-mix(in srgb,var(--cyan) 80%,transparent);color:var(--bg);box-shadow:var(--glow-c)}
.br-t.v2048 i{background:linear-gradient(135deg,var(--cyan),var(--violet),var(--pink));box-shadow:0 0 26px rgba(168,85,247,.9)}
.br-t.vbig i{background:var(--ink);color:var(--bg);box-shadow:0 0 26px rgba(245,245,255,.8)}

/* Logik */
.br-q{padding:18px 16px}
.br-q p{font-size:18px;line-height:1.45}
.br-q .br-seq{font-family:var(--display);font-size:22px;letter-spacing:.04em;color:var(--cyan);text-shadow:var(--glow-c);margin-top:8px;word-break:break-word}
.br-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.br-opt{min-height:58px;padding:10px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--head);font-weight:700;font-size:18px;letter-spacing:.02em;transition:transform .12s,background .2s,border-color .2s}
.br-opt:active{transform:scale(.96)}
.br-opt.ok{background:color-mix(in srgb,var(--good) 30%,transparent);border-color:var(--good);box-shadow:0 0 14px rgba(61,245,160,.5)}
.br-opt.no{background:color-mix(in srgb,var(--bad) 30%,transparent);border-color:var(--bad)}
.br-opt:disabled{cursor:default}
.br-exp{border-left:3px solid var(--cyan)}
.br-exp.bad{border-left-color:var(--bad)}

/* Escape */
.br-room{position:relative;width:100%;aspect-ratio:358/440;border-radius:18px;overflow:hidden;border:1px solid var(--line);
  background:repeating-linear-gradient(90deg,rgba(0,229,255,.035) 0 1px,transparent 1px 34px),repeating-linear-gradient(0deg,rgba(0,229,255,.035) 0 1px,transparent 1px 34px),linear-gradient(180deg,var(--bg2) 0 64%,var(--bg) 64% 100%);box-shadow:inset 0 0 60px rgba(0,0,0,.6),0 0 24px rgba(168,85,247,.25)}
.br-room::after{content:"";position:absolute;left:0;right:0;top:64%;height:2px;background:linear-gradient(90deg,transparent,var(--violet),transparent);opacity:.7}
.br-desk{position:absolute;left:24%;width:44%;top:70%;height:5%;border-radius:6px;background:linear-gradient(180deg,var(--glass-2),rgba(8,8,18,.8));border:1px solid var(--line)}
.br-obj{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);font-size:36px;line-height:1;min-width:52px;min-height:52px;padding:4px 2px;border-radius:12px;transition:transform .12s}
.br-obj:active{transform:translate(-50%,-50%) scale(.9)}
.br-obj small{font-size:10px;font-family:var(--head);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:3px;white-space:nowrap}
.br-obj.big{font-size:54px}
.br-obj.glim{animation:brGlim 2.2s infinite}
.br-obj.ok small{color:var(--good)}
@keyframes brGlim{50%{filter:drop-shadow(0 0 10px var(--cyan)) brightness(1.2)}}
.br-inv{display:flex;gap:8px;min-height:60px;align-items:center;padding:6px 10px;border-radius:14px;background:var(--glass);border:1px solid var(--line-2);margin-top:10px;overflow-x:auto}
.br-inv .b-hint{font-size:13px}
.br-it{flex:0 0 52px;width:52px;height:52px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line);font-size:26px;animation:brPop .3s}
.br-code{display:flex;gap:8px;justify-content:center}
.br-code span{width:46px;height:56px;border-radius:12px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:26px;font-weight:800;color:var(--cyan);background:rgba(8,8,18,.6)}
.br-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.br-keys button{min-height:52px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--display);font-size:22px;font-weight:700}
.br-keys button:active{transform:scale(.94)}
.br-shelf{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:14px 8px;border-radius:14px;background:rgba(8,8,18,.5);border:1px solid var(--line-2);border-bottom:4px solid var(--violet);font-size:30px}
.br-bottle{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:26px;line-height:1}
.br-bottle small{font-size:16px;height:18px}
.br-books{display:grid;grid-template-columns:repeat(9,1fr);gap:4px;align-items:end;padding:10px 6px;border-radius:12px;background:rgba(8,8,18,.5);border-bottom:4px solid var(--violet)}
.br-book{height:96px;border-radius:5px 5px 2px 2px;font-family:var(--display);font-weight:800;font-size:15px;color:var(--bg);display:flex;align-items:flex-start;justify-content:center;padding-top:8px;background:var(--pc);box-shadow:inset -4px 0 0 rgba(0,0,0,.25);min-width:0}
.br-book:active{transform:translateY(-6px)}
.br-screen{font-family:var(--mono);background:rgba(0,0,0,.55);border:1px solid var(--good);color:var(--good);border-radius:12px;padding:12px;font-size:14px;text-shadow:0 0 6px rgba(61,245,160,.6);white-space:pre-wrap}
.br-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.br-cols button{height:54px;border-radius:12px;background:var(--pc);box-shadow:0 0 12px var(--pc);font-size:12px;font-family:var(--head);font-weight:700;color:var(--bg);text-transform:uppercase}
.br-cols button:active{transform:scale(.92)}
.br-uv{font-family:var(--display);color:var(--violet);text-shadow:0 0 10px var(--violet),0 0 20px var(--violet);letter-spacing:.08em;font-size:17px;text-align:center;padding:8px}
`;
function css(){
  if(document.getElementById('br-style')) return;
  const s = document.createElement('style'); s.id = 'br-style'; s.textContent = CSS; document.head.append(s);
}
const fmt = s => { s = Math.max(0, Math.floor(s || 0)); const m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); };
/* Aufräum-Sammler: Timer und Listener einer Runde */
function scope(){
  const fns = [];
  return {
    add(f){ fns.push(f); },
    interval(fn, ms){ const id = setInterval(fn, ms); fns.push(() => clearInterval(id)); return id; },
    timeout(fn, ms){ const id = setTimeout(fn, ms); fns.push(() => clearTimeout(id)); return id; },
    on(t, ev, fn, o){ t.addEventListener(ev, fn, o); fns.push(() => t.removeEventListener(ev, fn, o)); },
    clear(){ while(fns.length){ try{ fns.pop()(); }catch(e){} } }
  };
}
const rshuffle = (a, rng = Math.random) => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mini = (label, valEl, cls) => el('div', { class: 'br-mini' + (cls ? ' ' + cls : '') }, [el('small', { text: label }), valEl]);
/* Startbildschirm mit optionalem „Weiterspielen“ */
function startScreen(root, api, opt, save, onContinue, contText){
  const parts = [];
  if(save) parts.push(el('button', { class: 'b-btn cyan block', text: contText || '▶ Weiterspielen', onclick: () => { api.sound('good'); onContinue(save); } }));
  if(opt.extra) parts.push(opt.extra);
  B.ui.start(root, api, Object.assign({}, opt, { extra: parts.length ? el('div', { class: 'b-stack tight' }, parts) : null }));
}
function toggleChip(label, on, onChange, api){
  const b = el('button', { class: 'b-chip', 'aria-pressed': String(!!on), text: label });
  b.onclick = () => { on = !on; b.setAttribute('aria-pressed', String(on)); api.sound('click'); onChange(on); };
  return b;
}

/* ================= SUDOKU ================= */
const SU = (() => {
  const ROW = [], COL = [], BOX = [], PEERS = [];
  for(let i = 0; i < 81; i++){ ROW[i] = Math.floor(i / 9); COL[i] = i % 9; BOX[i] = Math.floor(ROW[i] / 3) * 3 + Math.floor(COL[i] / 3); }
  for(let i = 0; i < 81; i++){ const p = []; for(let j = 0; j < 81; j++) if(j !== i && (ROW[j] === ROW[i] || COL[j] === COL[i] || BOX[j] === BOX[i])) p.push(j); PEERS[i] = p; }
  const pc = m => { let c = 0; while(m){ m &= m - 1; c++; } return c; };
  /* Zählt Lösungen bis limit. Mit rng werden Kandidaten zufällig probiert (Generator). */
  function solve(grid, limit, rng){
    const g = grid.slice(), rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
    for(let i = 0; i < 81; i++) if(g[i]){
      const b = 1 << g[i];
      if((rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]) & b) return { n: 0, sol: null };
      rows[ROW[i]] |= b; cols[COL[i]] |= b; boxes[BOX[i]] |= b;
    }
    let n = 0, sol = null;
    (function rec(){
      let best = -1, bestMask = 0, bestCnt = 10;
      for(let i = 0; i < 81; i++) if(!g[i]){
        const m = ~(rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]) & 0x3FE, c = pc(m);
        if(c < bestCnt){ bestCnt = c; best = i; bestMask = m; if(c <= 1) break; }
      }
      if(best < 0){ n++; if(!sol) sol = g.slice(); return n >= limit; }
      if(!bestCnt) return false;
      let ds = []; for(let d = 1; d <= 9; d++) if(bestMask & (1 << d)) ds.push(d);
      if(rng) ds = rshuffle(ds, rng);
      const r = ROW[best], c = COL[best], x = BOX[best];
      for(const d of ds){
        const b = 1 << d;
        g[best] = d; rows[r] |= b; cols[c] |= b; boxes[x] |= b;
        if(rec()) return true;
        rows[r] &= ~b; cols[c] &= ~b; boxes[x] &= ~b;
      }
      g[best] = 0; return false;
    })();
    return { n, sol };
  }
  const TARGET = [38, 31, 25];
  function generate(level, rng = Math.random){
    const full = solve(new Array(81).fill(0), 1, rng).sol;
    const p = full.slice(); let clues = 81;
    for(const i of rshuffle([...Array(81).keys()], rng)){
      if(clues <= TARGET[level]) break;
      const v = p[i]; p[i] = 0;
      if(solve(p, 2).n !== 1) p[i] = v; else clues--;
    }
    return { puzzle: p, solution: full, clues };
  }
  return { ROW, COL, BOX, PEERS, solve, generate };
})();

B.registerGame({
  id: 'sudoku', name: 'Sudoku', icon: '🔢', cat: 'denk', players: '1',
  desc: 'Der Klassiker: Fülle das 9×9-Gitter – jede Zahl 1–9 genau einmal pro Zeile, Spalte und Block.',
  rules: [
    'Jede Zeile, jede Spalte und jeder 3×3-Block enthält die Zahlen 1 bis 9 genau einmal.',
    'Tippe ein Feld an und dann unten eine Zahl. Die kleine Zahl unter jeder Taste zeigt, wie oft sie noch fehlt.',
    '✏️ Notizen: Kleine Merkzahlen setzen. ⌫ Radierer löscht Notizen und falsche Zahlen. ↶ macht den letzten Schritt rückgängig.',
    '💡 Hinweis füllt ein Feld richtig aus (kostet Punkte).',
    'Mit der 3-Fehler-Regel ist bei 3 falschen Zahlen Schluss. Ohne sie zählen Fehler nur gegen deine Punkte.',
    'Jedes Rätsel hat genau eine Lösung. Das Tages-Sudoku ist für alle gleich. Dein Spielstand wird automatisch gespeichert.'
  ],
  tags: ['alleine', 'drinnen', 'lang', 'schwierig'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht', 'Mittel', 'Schwer'];
    let S = null, cells = [], refs = {};
    const save = () => { if(S && !S.over) api.store.set('save', { ...S, hist: S.hist.slice(-40) }); };

    function menu(){
      sc.clear(); S = null;
      const sv = api.store.get('save', null);
      let strict = api.store.get('strict', true);
      const opts = el('div', {}, [el('span', { class: 'b-label', text: 'Optionen' }), el('div', { class: 'b-chips' }, [
        toggleChip('❌ 3-Fehler-Regel', strict, v => { strict = v; api.store.set('strict', v); }, api)
      ])]);
      startScreen(root, api, {
        levels: LV, extra: opts,
        modes: [{ id: 'frei', label: '🎲 Zufall' }, { id: 'tag', label: '📅 Tages-Sudoku' }],
        bestKey: l => String(l), bestLabel: 'Rekord',
        onStart: (l, m) => newGame(l, m === 'tag', strict)
      }, sv, s => { S = s; play(); }, sv ? '▶ Weiterspielen (' + LV[sv.lvl] + (sv.daily ? ', Tages-Sudoku' : '') + ', ' + fmt(sv.t) + ')' : '');
    }

    function newGame(lvl, daily, strict){
      sc.clear(); root.innerHTML = '';
      const date = B.today();
      if(daily && api.store.get('dailyDone.' + date + '.' + lvl, false)) api.toast('Heute schon gelöst ✔ – zum Üben darfst du nochmal.');
      root.append(el('div', { class: 'br-gen' }, [el('div', { class: 'br-spin' }), el('p', { class: 'b-hint', text: 'Sudoku wird gebaut … (eindeutige Lösung wird geprüft)' })]));
      sc.timeout(() => {
        const rng = daily ? api.seeded('sudoku-' + date + '-' + lvl) : Math.random;
        const g = SU.generate(lvl, rng);
        S = { lvl, daily, date, strict, puz: g.puzzle, sol: g.solution, val: g.puzzle.slice(), notes: new Array(81).fill(0),
              mist: 0, hints: 0, t: 0, sel: -1, noteMode: false, hist: [], over: false };
        save(); play();
      }, 60);
    }

    function play(){
      sc.clear(); root.innerHTML = ''; S.over = false;
      refs.time = el('b', { class: 'b-num', text: fmt(S.t) });
      refs.mist = el('b', { class: 'b-num' });
      refs.mistBox = mini('Fehler', refs.mist);
      const top = el('div', { class: 'br-top' }, [
        mini(S.daily ? 'Tages-Sudoku' : 'Stufe', el('b', { text: LV[S.lvl] })), refs.mistBox, mini('Zeit', refs.time)
      ]);
      const grid = el('div', { class: 'br-su', role: 'grid', 'aria-label': 'Sudoku-Gitter' });
      cells = [];
      for(let i = 0; i < 81; i++){
        const r = SU.ROW[i], c = SU.COL[i];
        const b = el('button', { class: 'br-c' + (c % 3 === 2 && c < 8 ? ' br-r3' : '') + (r % 3 === 2 && r < 8 ? ' br-b3' : ''),
          'aria-label': 'Zeile ' + (r + 1) + ', Spalte ' + (c + 1), onclick: () => { S.sel = i; api.sound('tap'); draw(); } });
        cells.push(b); grid.append(b);
      }
      const tool = (ic, label, fn) => { const s = el('small', { text: label }); const b = el('button', { class: 'br-tool', onclick: fn }, [el('span', { text: ic }), s]); b._s = s; return b; };
      refs.undo = tool('↶', 'Zurück', undo);
      refs.erase = tool('⌫', 'Radierer', erase);
      refs.note = tool('✏️', 'Notizen', () => { S.noteMode = !S.noteMode; api.sound('click'); draw(); });
      refs.hint = tool('💡', 'Hinweis', hint);
      const pad = el('div', { class: 'br-pad' });
      refs.nums = [];
      for(let d = 1; d <= 9; d++){
        const cnt = el('small');
        const b = el('button', { class: 'br-num', 'aria-label': 'Zahl ' + d, onclick: () => input(d) }, [el('span', { text: d }), cnt]);
        b._c = cnt; refs.nums.push(b); pad.append(b);
      }
      root.append(top, grid, el('div', { class: 'br-tools' }, [refs.undo, refs.erase, refs.note, refs.hint]), pad);
      draw();
      sc.interval(() => {
        if(document.hidden || S.over) return;
        S.t++; refs.time.textContent = fmt(S.t);
        if(S.t % 5 === 0) save();
      }, 1000);
      sc.on(document, 'keydown', e => {
        if(S.over) return;
        if(/^[1-9]$/.test(e.key)){ input(+e.key); e.preventDefault(); }
        else if(e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') erase();
        else if(e.key === 'n' || e.key === 'N'){ S.noteMode = !S.noteMode; draw(); }
        else if(e.key.startsWith('Arrow')){
          e.preventDefault(); let i = S.sel < 0 ? 40 : S.sel;
          const r = SU.ROW[i], c = SU.COL[i];
          if(e.key === 'ArrowUp') i = ((r + 8) % 9) * 9 + c; if(e.key === 'ArrowDown') i = ((r + 1) % 9) * 9 + c;
          if(e.key === 'ArrowLeft') i = r * 9 + (c + 8) % 9; if(e.key === 'ArrowRight') i = r * 9 + (c + 1) % 9;
          S.sel = i; draw();
        }
      });
    }

    function draw(){
      const sel = S.sel, sv = sel >= 0 ? S.val[sel] : 0;
      for(let i = 0; i < 81; i++){
        const b = cells[i], v = S.val[i], giv = S.puz[i] !== 0;
        let cls = 'br-c' + (SU.COL[i] % 3 === 2 && SU.COL[i] < 8 ? ' br-r3' : '') + (SU.ROW[i] % 3 === 2 && SU.ROW[i] < 8 ? ' br-b3' : '');
        if(giv) cls += ' giv';
        if(v && !giv && v !== S.sol[i]) cls += ' err';
        if(sel >= 0){
          if(i === sel) cls += ' sel';
          else if(sv && v === sv) cls += ' same';
          else if(SU.ROW[i] === SU.ROW[sel] || SU.COL[i] === SU.COL[sel] || SU.BOX[i] === SU.BOX[sel]) cls += ' rel';
        }
        if(b._f) cls += ' flash';
        b.className = cls;
        if(v){ if(b._v !== 'v' + v){ b.textContent = v; b._v = 'v' + v; } }
        else if(S.notes[i]){
          let h = '<div class="br-notes">';
          for(let d = 1; d <= 9; d++) h += '<i' + (sv === d ? ' class="hl"' : '') + '>' + (S.notes[i] & (1 << d) ? d : '') + '</i>';
          h += '</div>';
          const key = 'n' + S.notes[i] + '-' + sv;
          if(b._v !== key){ b.innerHTML = h; b._v = key; }
        } else if(b._v !== ''){ b.textContent = ''; b._v = ''; }
      }
      refs.mist.textContent = S.strict ? S.mist + ' / 3' : String(S.mist);
      refs.mistBox.classList.toggle('bad', S.mist > 0);
      refs.note.classList.toggle('on', S.noteMode);
      refs.note._s.textContent = S.noteMode ? 'Notiz: an' : 'Notizen';
      refs.undo.disabled = !S.hist.length;
      refs.hint._s.textContent = S.hints ? 'Hinweis ·' + S.hints : 'Hinweis';
      for(let d = 1; d <= 9; d++){
        let n = 0; for(let i = 0; i < 81; i++) if(S.val[i] === d && S.sol[i] === d) n++;
        const b = refs.nums[d - 1]; b._c.textContent = 9 - n; b.disabled = n >= 9;
        b.classList.toggle('nm', S.noteMode);
      }
    }
    const flash = idx => { idx.forEach(i => cells[i]._f = true); draw(); sc.timeout(() => { idx.forEach(i => cells[i]._f = false); draw(); }, 700); };
    const pushHist = i => { S.hist.push({ i, v: S.val[i], n: S.notes.slice() }); if(S.hist.length > 120) S.hist.shift(); };
    const locked = i => S.puz[i] !== 0 || (S.val[i] && S.val[i] === S.sol[i]);
    function placedCorrect(i){
      const d = S.val[i];
      SU.PEERS[i].forEach(j => { S.notes[j] &= ~(1 << d); });
      // fertige Einheiten aufleuchten lassen
      const units = [];
      const rowC = [...Array(9)].map((_, k) => SU.ROW[i] * 9 + k), colC = [...Array(9)].map((_, k) => k * 9 + SU.COL[i]);
      const boxC = []; for(let j = 0; j < 81; j++) if(SU.BOX[j] === SU.BOX[i]) boxC.push(j);
      [rowC, colC, boxC].forEach(u => { if(u.every(j => S.val[j] === S.sol[j])) units.push(...u); });
      if(units.length){ api.sound('good'); flash(units); } else api.sound('pop');
    }
    function input(d){
      const i = S.sel;
      if(S.over) return;
      if(i < 0){ api.toast('Tippe zuerst ein Feld an'); return; }
      if(locked(i)){ api.sound('tap'); return; }
      if(S.noteMode){
        if(S.val[i]) return;
        pushHist(i); S.notes[i] ^= (1 << d); api.sound('tick');
      } else {
        if(S.val[i] === d) return;
        pushHist(i); S.val[i] = d; S.notes[i] = 0;
        if(d !== S.sol[i]){
          S.mist++; api.sound('bad'); api.vibrate(60);
          const c = cells[i]; c.classList.remove('b-shake'); void c.offsetWidth; c.classList.add('b-shake');
          if(S.strict && S.mist >= 3){ draw(); return end(false); }
        } else placedCorrect(i);
      }
      save(); draw();
      if(S.val.every((v, k) => v === S.sol[k])) end(true);
    }
    function erase(){
      const i = S.sel; if(i < 0 || S.over) return;
      if(locked(i)){ api.toast(S.puz[i] ? 'Vorgegebene Zahl' : 'Diese Zahl ist richtig'); return; }
      if(!S.val[i] && !S.notes[i]) return;
      pushHist(i); S.val[i] = 0; S.notes[i] = 0; api.sound('click'); save(); draw();
    }
    function undo(){
      const h = S.hist.pop(); if(!h || S.over) return;
      S.val[h.i] = h.v; S.notes = h.n; S.sel = h.i; api.sound('move'); save(); draw();
    }
    function hint(){
      if(S.over) return;
      let i = S.sel;
      if(i < 0 || S.val[i] === S.sol[i]){
        const open = []; for(let k = 0; k < 81; k++) if(S.val[k] !== S.sol[k]) open.push(k);
        if(!open.length) return; i = api.pick(open);
      }
      pushHist(i); S.val[i] = S.sol[i]; S.notes[i] = 0; S.hints++; S.sel = i;
      api.sound('check'); placedCorrect(i); save(); draw();
      if(S.val.every((v, k) => v === S.sol[k])) end(true);
    }
    function end(win){
      S.over = true; api.store.set('save', null); sc.clear();
      const base = [1500, 3000, 5000][S.lvl];
      const score = win ? Math.max(100, Math.round(base - S.t * 2 - S.hints * 150 - S.mist * 100)) : 0;
      let rep = null;
      if(win){ rep = api.reportScore(score, String(S.lvl)); if(S.daily) api.store.set('dailyDone.' + S.date + '.' + S.lvl, true); }
      api.finish({ win, score, difficulty: S.lvl, xp: win ? [22, 36, 52][S.lvl] - Math.min(12, S.hints * 3) : 6 });
      if(win) api.sound('win'); else api.sound('lose');
      setTimeout(() => B.ui.result(root, api, {
        win, title: win ? (S.daily ? 'Tages-Sudoku gelöst!' : 'Gelöst!') : '3 Fehler – vorbei',
        sub: win ? (rep && rep.isBest ? 'Neuer Rekord! 🔥' : 'Sauber durchgezogen.') : 'Kopf hoch – nächstes Mal ohne Raten.',
        lines: [['Zeit', fmt(S.t)], ['Fehler', S.mist], ['Hinweise', S.hints], ['Punkte', score], ['Rekord', api.best(String(S.lvl)) ?? '–'], ['Stufe', LV[S.lvl]]],
        onAgain: () => newGame(S.lvl, false, S.strict), againLabel: 'Neues Sudoku', onMenu: menu
      }), win ? 700 : 400);
    }
    menu();
    return () => { save(); sc.clear(); };
  }
});

/* ================= MEMORY ================= */
const MEM_SETS = {
  gaming: { label: '🎮 Gaming', e: ['🎮', '🕹️', '👾', '🎲', '🏆', '🎯', '🧩', '⚔️', '🛡️', '👑', '💎', '🚀', '🏎️', '🎧', '🤖'] },
  tiere: { label: '🐼 Tiere', e: ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐯', '🐨', '🐵', '🦄', '🐙', '🦉', '🐧', '🐢', '🦈'] },
  essen: { label: '🍕 Essen', e: ['🍕', '🍔', '🍟', '🌭', '🍩', '🍪', '🍓', '🍉', '🍌', '🥨', '🌮', '🍣', '🧁', '🍦', '🥑'] },
  space: { label: '🪐 Weltraum', e: ['🪐', '🌙', '⭐', '☄️', '🚀', '👽', '🛸', '🌍', '☀️', '🌌', '🔭', '👩‍🚀', '🛰️', '🌠', '🌑'] }
};
const MEM_SIZES = [{ c: 4, r: 3 }, { c: 4, r: 4 }, { c: 5, r: 6 }];

B.registerGame({
  id: 'memory', name: 'Memory', icon: '🃏', cat: 'denk', players: '1-2',
  desc: 'Finde alle Kartenpaare – alleine auf Zeit oder zu zweit abwechselnd am Handy.',
  rules: [
    'Tippe zwei Karten an. Gleiche Bilder bleiben offen, sonst drehen sie sich wieder um.',
    'Solo: Je weniger Züge und je schneller, desto mehr Punkte und Sterne (bis ★★★).',
    '2 Spieler: Ihr wechselt euch ab. Wer ein Paar findet, darf nochmal. Wer am Ende mehr Paare hat, gewinnt.',
    'Wähle dein Lieblings-Set: Gaming, Tiere, Essen oder Weltraum.'
  ],
  tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht 4×3', 'Mittel 4×4', 'Schwer 5×6'];
    let G = null;
    function menu(){
      sc.clear();
      let set = api.store.get('set', 'gaming');
      const chips = el('div', { class: 'b-chips' });
      const rc = () => { chips.innerHTML = ''; Object.keys(MEM_SETS).forEach(k => chips.append(el('button', { class: 'b-chip', 'aria-pressed': String(k === set), text: MEM_SETS[k].label, onclick: () => { set = k; api.store.set('set', k); api.sound('click'); rc(); } }))); };
      rc();
      B.ui.start(root, api, {
        levels: LV, modes: [{ id: 'solo', label: '👤 Solo' }, { id: 'zwei', label: '👥 2 Spieler' }],
        extra: el('div', {}, [el('span', { class: 'b-label', text: 'Karten-Set' }), chips]),
        bestKey: (l, m) => l + '-' + m, bestLabel: 'Rekord',
        onStart: (l, m) => start(l, m, set)
      });
    }
    function start(lvl, mode, set){
      sc.clear(); root.innerHTML = '';
      const sz = MEM_SIZES[lvl], pairs = sz.c * sz.r / 2;
      const em = api.shuffle(MEM_SETS[set].e).slice(0, pairs);
      G = { lvl, mode, pairs, deck: api.shuffle([...em, ...em]), open: [], done: 0, moves: 0, t: 0, started: false, lock: false, turn: 0, pts: [0, 0], over: false };
      const r = {};
      let top;
      if(mode === 'solo'){
        r.moves = el('b', { text: '0' }); r.time = el('b', { text: '0:00' }); r.pairs = el('b', { text: '0/' + pairs });
        top = el('div', { class: 'br-top' }, [mini('Züge', r.moves), mini('Zeit', r.time), mini('Paare', r.pairs)]);
      } else {
        r.p = [el('b', { text: '0' }), el('b', { text: '0' })];
        r.box = [mini('🔵 Spieler 1', r.p[0]), mini('🩷 Spieler 2', r.p[1])];
        r.turn = el('div', { class: 'b-kicker', style: { textAlign: 'center', marginBottom: '8px' } });
        top = el('div', {}, [el('div', { class: 'br-top' }, r.box), r.turn]);
      }
      const grid = el('div', { class: 'br-mg', style: { gridTemplateColumns: 'repeat(' + sz.c + ',1fr)' } });
      const cards = G.deck.map((e, i) => {
        const c = el('button', { class: 'br-mc', 'aria-label': 'Karte ' + (i + 1) }, [el('div', { class: 'br-mc-in' }, [
          el('div', { class: 'br-mc-f br-mc-b', text: '?' }), el('div', { class: 'br-mc-f br-mc-fr', text: e })
        ])]);
        c.addEventListener('click', () => flip(i));
        return c;
      });
      cards.forEach(c => grid.append(c));
      root.append(top, grid);
      // Größe an verfügbaren Platz anpassen
      const fit = () => {
        const w = root.clientWidth - 32, h = root.clientHeight - top.offsetHeight - 56;
        const maxW = Math.min(w, (h - (sz.r - 1) * 8) / sz.r * 0.75 * sz.c + (sz.c - 1) * 8);
        grid.style.width = Math.max(220, Math.floor(maxW)) + 'px';
      };
      fit(); sc.on(window, 'resize', fit);
      const upd = () => {
        if(mode === 'solo'){ r.moves.textContent = G.moves; r.pairs.textContent = G.done + '/' + pairs; }
        else {
          r.p[0].textContent = G.pts[0]; r.p[1].textContent = G.pts[1];
          r.box[0].className = 'br-mini' + (G.turn === 0 ? ' on' : ''); r.box[1].className = 'br-mini' + (G.turn === 1 ? ' on2' : '');
          r.turn.textContent = (G.turn === 0 ? '🔵 Spieler 1' : '🩷 Spieler 2') + ' ist dran';
          r.turn.style.color = G.turn === 0 ? 'var(--cyan)' : 'var(--pink)';
        }
      };
      upd();
      function flip(i){
        if(G.lock || G.over) return;
        const c = cards[i];
        if(c.classList.contains('up')) return;
        if(!G.started && mode === 'solo'){ G.started = true; sc.interval(() => { if(!document.hidden && !G.over){ G.t++; r.time.textContent = fmt(G.t); } }, 1000); }
        c.classList.add('up'); api.sound('flip'); G.open.push(i);
        if(G.open.length < 2) return;
        G.moves++; G.lock = true;
        const [a, b] = G.open;
        if(G.deck[a] === G.deck[b]){
          sc.timeout(() => {
            cards[a].classList.add('done'); cards[b].classList.add('done');
            G.done++; G.pts[G.turn]++; G.open = []; G.lock = false; api.sound('good'); api.vibrate(20); upd();
            if(G.done === pairs) end();
          }, 380);
        } else {
          sc.timeout(() => { cards[a].classList.add('miss'); cards[b].classList.add('miss'); }, 350);
          sc.timeout(() => {
            [a, b].forEach(k => cards[k].classList.remove('up', 'miss'));
            G.open = []; G.lock = false;
            if(mode === 'zwei'){ G.turn = 1 - G.turn; api.sound('click'); }
            upd();
          }, 950);
        }
        upd();
      }
    }
    function end(){
      G.over = true; sc.clear();
      const { pairs, moves, t, lvl } = G;
      if(G.mode === 'solo'){
        const stars = moves <= Math.round(pairs * 1.6) ? 3 : moves <= Math.round(pairs * 2.3) ? 2 : 1;
        const score = Math.max(10, Math.round(pairs * 120 - (moves - pairs) * 15 - t * 2 + stars * 50));
        const rep = api.reportScore(score, lvl + '-solo');
        api.finish({ win: true, score, difficulty: lvl, xp: 10 + stars * 5 + lvl * 4 });
        api.sound('win');
        setTimeout(() => B.ui.result(root, api, {
          win: true, title: 'Alle Paare gefunden!', emoji: ['', '⭐', '🌟', '🏆'][stars],
          sub: '★★★'.slice(0, stars) + '☆☆☆'.slice(0, 3 - stars) + (rep.isBest ? ' · Neuer Rekord!' : ''),
          lines: [['Züge', moves], ['Zeit', fmt(t)], ['Punkte', score], ['Rekord', rep.best]],
          onAgain: () => start(lvl, 'solo', api.store.get('set', 'gaming')), onMenu: menu
        }), 600);
      } else {
        const [p1, p2] = G.pts;
        api.finish({ win: null, difficulty: lvl, xp: 12 + lvl * 4 });
        api.sound('win');
        setTimeout(() => B.ui.result(root, api, {
          win: null, emoji: p1 === p2 ? '🤝' : '🏆',
          title: p1 === p2 ? 'Unentschieden!' : (p1 > p2 ? '🔵 Spieler 1' : '🩷 Spieler 2') + ' gewinnt!',
          sub: p1 + ' : ' + p2 + ' Paare',
          lines: [['🔵 Spieler 1', p1 + ' Paare'], ['🩷 Spieler 2', p2 + ' Paare'], ['Züge gesamt', moves], ['Karten', pairs * 2]],
          onAgain: () => start(lvl, 'zwei', api.store.get('set', 'gaming')), againLabel: 'Revanche', onMenu: menu
        }), 600);
      }
    }
    menu();
    return () => sc.clear();
  }
});

/* ================= MASTERMIND ================= */
const MM_COLORS = [['bad', 'Rot', '♥'], ['warn', 'Gelb', '★'], ['good', 'Grün', '♣'], ['cyan', 'Cyan', '◆'], ['violet', 'Violett', '♠'], ['pink', 'Pink', '✿'], ['ink', 'Weiß', '●'], ['mute', 'Grau', '▲']];
const MM_LV = [{ n: 4, k: 6, dup: false }, { n: 4, k: 6, dup: true }, { n: 5, k: 8, dup: true }];
/* schwarz = richtige Farbe an richtiger Stelle, weiß = richtige Farbe an falscher Stelle */
function mmEval(secret, guess){
  let black = 0; const cs = {}, cg = {};
  for(let i = 0; i < secret.length; i++){
    if(secret[i] === guess[i]) black++;
    else { cs[secret[i]] = (cs[secret[i]] || 0) + 1; cg[guess[i]] = (cg[guess[i]] || 0) + 1; }
  }
  let white = 0; for(const k in cg) white += Math.min(cg[k], cs[k] || 0);
  return [black, white];
}

B.registerGame({
  id: 'mastermind', name: 'Mastermind', icon: '🎯', cat: 'denk', players: '1',
  desc: 'Knacke den geheimen Farbcode in maximal 10 Versuchen.',
  rules: [
    'Der Computer versteckt einen Farbcode (Leicht/Mittel: 4 Stellen aus 6 Farben, Schwer: 5 Stellen aus 8 Farben).',
    'Tippe Farben an, um deinen Tipp zu füllen. Tippe auf eine gesetzte Farbe, um sie zu entfernen. Dann „Prüfen“.',
    'Schwarzer Stecker (dunkel mit Rand) = richtige Farbe an der richtigen Stelle.',
    'Weißer Stecker = richtige Farbe, aber an der falschen Stelle. Die Reihenfolge der Stecker verrät nicht, welche Stelle gemeint ist.',
    'Leicht: Jede Farbe kommt höchstens einmal vor. Mittel und Schwer: Farben können mehrfach vorkommen.',
    'Weniger Versuche und schneller = mehr Punkte. Dein Spiel wird gespeichert.'
  ],
  tags: ['alleine', 'drinnen', 'kurz', 'schwierig'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht', 'Mittel', 'Schwer'];
    let M = null;
    const save = () => { if(M && !M.over) api.store.set('save', M); };
    function menu(){
      sc.clear();
      const sv = api.store.get('save', null);
      startScreen(root, api, { levels: LV, onStart: l => newGame(l) }, sv, s => { M = s; play(); },
        sv ? '▶ Weiterspielen (' + LV[sv.lvl] + ', Versuch ' + (sv.rows.length + 1) + ')' : '');
    }
    function newGame(lvl){
      const L = MM_LV[lvl];
      let secret;
      if(L.dup) secret = Array.from({ length: L.n }, () => Math.floor(Math.random() * L.k));
      else secret = api.shuffle([...Array(L.k).keys()]).slice(0, L.n);
      M = { lvl, secret, rows: [], cur: [], t: 0, over: false };
      save(); play();
    }
    const peg = (ci, big) => {
      const p = el('span', { class: 'br-peg' + (ci != null ? ' f' : '') });
      if(ci != null){ p.style.setProperty('--pc', 'var(--' + MM_COLORS[ci][0] + ')'); p.textContent = MM_COLORS[ci][2]; p.title = MM_COLORS[ci][1]; }
      return p;
    };
    const fbEl = (b, w, n) => {
      const f = el('div', { class: 'br-fb', 'aria-label': b + ' schwarz, ' + w + ' weiß' });
      for(let i = 0; i < n; i++) f.append(el('i', { class: i < b ? 'k' : i < b + w ? 'w' : '' }));
      return f;
    };
    function play(){
      sc.clear(); root.innerHTML = '';
      const L = MM_LV[M.lvl];
      const r = { time: el('b', { text: fmt(M.t) }), tries: el('b') };
      const top = el('div', { class: 'br-top' }, [mini('Stufe', el('b', { text: LV[M.lvl] })), mini('Versuch', r.tries), mini('Zeit', r.time)]);
      const rowsBox = el('div', { class: 'br-mm-rows' });
      const pal = el('div', { class: 'br-pal' });
      for(let ci = 0; ci < L.k; ci++){
        const b = el('button', { 'aria-label': MM_COLORS[ci][1], text: MM_COLORS[ci][2], onclick: () => add(ci) });
        b.style.setProperty('--pc', 'var(--' + MM_COLORS[ci][0] + ')');
        pal.append(b);
      }
      r.check = el('button', { class: 'b-btn', text: 'Prüfen', onclick: check });
      const back = el('button', { class: 'b-btn ghost', text: '⌫', 'aria-label': 'Letzte Farbe löschen', onclick: () => { if(M.cur.length){ M.cur.pop(); api.sound('click'); draw(); } } });
      root.append(top, rowsBox, pal, el('div', { class: 'br-row2' }, [back, r.check]),
        el('div', { class: 'br-legend' }, [el('span', {}, [el('span', { class: 'br-fb' }, [el('i', { class: 'k' })]), ' richtige Stelle']), el('span', {}, [el('span', { class: 'br-fb' }, [el('i', { class: 'w' })]), ' falsche Stelle'])]));
      function draw(){
        rowsBox.innerHTML = '';
        for(let k = 0; k < 10; k++){
          const row = el('div', { class: 'br-mm-row' + (k === M.rows.length ? ' cur' : '') }, [el('span', { class: 'br-mm-n', text: k + 1 })]);
          const pegs = el('div', { class: 'br-mm-pegs' });
          if(k < M.rows.length){
            M.rows[k].g.forEach(ci => pegs.append(peg(ci)));
            row.append(pegs, fbEl(M.rows[k].b, M.rows[k].w, L.n));
          } else if(k === M.rows.length){
            for(let i = 0; i < L.n; i++){
              const p = peg(M.cur[i]);
              if(M.cur[i] != null){ p.setAttribute('role', 'button'); p.onclick = () => { M.cur.splice(i, 1); api.sound('click'); draw(); }; }
              pegs.append(p);
            }
            row.append(pegs, fbEl(0, 0, L.n));
          } else {
            for(let i = 0; i < L.n; i++) pegs.append(peg(null));
            row.append(pegs, fbEl(0, 0, L.n));
            row.style.opacity = .45;
          }
          rowsBox.append(row);
        }
        r.tries.textContent = Math.min(10, M.rows.length + 1) + ' / 10';
        r.check.disabled = M.cur.length !== L.n;
      }
      function add(ci){
        if(M.over) return;
        if(M.cur.length >= L.n){ api.toast('Reihe ist voll – tippe „Prüfen“'); return; }
        if(!L.dup && M.cur.includes(ci)){ api.toast('Auf Leicht kommt jede Farbe nur einmal vor'); api.sound('bad'); return; }
        M.cur.push(ci); api.sound('pop'); draw(); save();
      }
      function check(){
        if(M.over || M.cur.length !== L.n) return;
        const [b, w] = mmEval(M.secret, M.cur);
        M.rows.push({ g: M.cur.slice(), b, w }); M.cur = [];
        api.sound(b === L.n ? 'win' : b ? 'good' : w ? 'check' : 'bad');
        draw(); save();
        if(b === L.n) end(true); else if(M.rows.length >= 10) end(false);
      }
      draw();
      sc.interval(() => { if(!document.hidden && !M.over){ M.t++; r.time.textContent = fmt(M.t); if(M.t % 5 === 0) save(); } }, 1000);
    }
    function end(win){
      M.over = true; api.store.set('save', null); sc.clear();
      const tries = M.rows.length;
      const score = win ? Math.round((11 - tries) * 100 * (1 + M.lvl * 0.5) + Math.max(0, 300 - M.t)) : 0;
      const rep = win ? api.reportScore(score, String(M.lvl)) : null;
      api.finish({ win, score, difficulty: M.lvl, xp: win ? 14 + (10 - tries) * 2 + M.lvl * 6 : 6 });
      if(!win) api.sound('lose');
      const sec = el('div', { class: 'br-secret' }, [el('span', { class: 'b-hint', text: 'Code:' }), ...M.secret.map(ci => peg(ci))]);
      setTimeout(() => {
        B.ui.result(root, api, {
          win, title: win ? 'Code geknackt!' : 'Code nicht geknackt',
          sub: win ? 'In ' + tries + (tries === 1 ? ' Versuch – Hellseher?!' : ' Versuchen.') + (rep && rep.isBest ? ' Neuer Rekord!' : '') : 'So sah der Code aus:',
          lines: [['Versuche', tries], ['Zeit', fmt(M.t)], ['Punkte', score], ['Rekord', api.best(String(M.lvl)) ?? '–']],
          onAgain: () => newGame(M.lvl), onMenu: menu
        });
        const card = root.querySelector('.b-card'); if(card) card.append(sec);
      }, 500);
    }
    menu();
    return () => { save(); sc.clear(); };
  }
});

const WORT_LIST = ('abend acker adler agent ahorn aktie alarm album alles alter ampel angel angst anker anruf apfel arena armee armut asche atlas autor äpfel ärger ärmel achse aktiv allee amsel anbau bauch bauer beere beben beide beine beruf besen biber biene birne bitte blase blatt blech blick blind blitz block blume boden bogen bohne bombe börse brand braun brett brief brust bruch buche bühne busch basis bauen beten biest bingo birke blank blass bluse blüte brise brühe bucht breit bügel beule beute bälle bäume chaos chips chlor comic couch creme dachs dampf datei datum decke degen deich delle dicht diele docht dolch draht drama drang dreck duell dübel dumpf dunst durst dürre dicke dosen ebene echse eimer eisen eilig engel enkel erbse erben ernte essen etage extra eklig einig eitel erker ernst enden eisig fabel faden fähre falle falte farbe faser feder feier feige felge ferne ferse feuer figur firma fisch flach flöte fluch fluss folge forst frage frech frist front frost frust fuchs fülle funke fürst feind fleck fahne faust fazit flink flott folie forum fromm gabel gänse gasse gebet geige geist genie gerät glanz glatt gleis glück gnade gramm greis grill grube grund gummi gurke gäste geier gehen genau gerne geste grell hafen hagel haken halle handy harfe haube haupt hebel hecke heide henne herde heute hilfe hirte hitze hobby hobel höhle hölle honig hörer hotel hügel hülle hunde hütte hymne hafer härte heben hören humor hüfte ideal ideen immer index insel irren jacke jäger jagen jahre jause joker jubel junge juwel jeans kabel käfer kakao kälte kamel kamin kampf kanal kanne kante kappe karte kasse kater katze kegel kehle kelch kelle kerze kette keule kiste klang kleid klima klotz kluft knall knapp knopf koala kohle komma könig kopie kraft krake kranz kraut krebs kreis kreuz krone kröte kugel kunde kunst kurve küste kiosk klage knabe knete krach küche kauen labor lachs laden lager lampe länge lanze laser laune leben leber leder leere lehre leine leise leser leute licht liebe liste liter logik lotse lücke lunge lasso latte laute lesen links löten lügen lyrik macht magen magie makel malen mango mappe marke markt masse maske mauer meile meise meter menge messe miete milch minze mitte möbel moped moral motiv motor mücke mühle münze musik mutig mütze mixer monat mulde mumie mäuse mimik minus mixen nabel nacht nadel nagel nähen narbe natur nebel neffe niere nonne notiz nudel nagen nelke nobel noten nüsse ochse ohren onkel opfer optik orden organ ozean orgel osten otter paket panda panik papst party pasta pause pedal pegel perle pfahl pfand pfeil pferd pflug pfote pfund pilot piste pixel pizza plage plane platz pokal preis probe profi puder pulli punkt puppe püree pirat panne pfiff plump porto prall prinz prima pumpe qualm quark quarz quote quirl rache radar radio ranke rasen rasse ratte raten rauch raupe recht regal regel regen reich reife reihe reise rente riese rinde rinne robbe rolle roman rosen rubin ruder ruine rumpf runde rasch rasur reden rosig rufen ruhig säbel sache sahne saite salat salbe salto samen sauce säule sauna schaf schal scham schau schuh seele segel segen seife seite senat serie silbe sirup sitte skala socke sohle sonne sorge sorte spalt speck speer spiel spion spitz sport spott spray sprit spule staat stadt stahl stall stamm stand stark start staub steak stein stern stiel stier stift stirn stock stoff stolz strom stube stück stufe stuhl sturm sturz stute sucht summe suppe süden sünde sushi szene säure sagen sauer schön sechs sehen seide stumm super sicht tabak tafel tanne tante tasse taste tatze taube teich tempo thema tiger tinte tisch titel toast tonne torte trank traum treue trieb tritt trick trost truhe trupp tulpe tadel tango teuer toben total träge trend turbo umweg umzug unfug union unten umbau unmut vater video villa virus vogel vokal vorne waage wache waffe wagen waise walze wange wanne wanze wärme watte wedel weide weile weise weite welle welpe wende werft wespe weste wette wiege wiese wille woche wolke wolle wonne wunde würde wurst würze wüste wachs weich wenig witwe zacke zange zebra zeche zehen zeile zelle zeuge ziege zitat zucht zunge zweig zwerg zwang zwirn zähne zivil zügig zwölf yacht').split(' ');

/* ================= WORTEL (Wordle auf Deutsch) ================= */
/* 0 = grau, 1 = gelb, 2 = grün. Doppelbuchstaben korrekt: Gelb nur so oft, wie der Buchstabe in der Lösung noch übrig ist. */
function wEval(guess, sol){
  const g = [...guess], s = [...sol], res = new Array(g.length).fill(0), left = {};
  for(let i = 0; i < g.length; i++){ if(g[i] === s[i]) res[i] = 2; else left[s[i]] = (left[s[i]] || 0) + 1; }
  for(let i = 0; i < g.length; i++) if(res[i] !== 2 && left[g[i]] > 0){ res[i] = 1; left[g[i]]--; }
  return res;
}
/* Profi-Modus: gefundene Hinweise müssen weiterverwendet werden. Gibt Fehlermeldung oder '' zurück. */
function wHardCheck(guess, rows){
  const g = [...guess];
  for(const r of rows){
    const w = [...r.w];
    for(let i = 0; i < 5; i++) if(r.e[i] === 2 && g[i] !== w[i]) return 'Profi-Modus: ' + (i + 1) + '. Buchstabe muss ' + w[i].toUpperCase() + ' sein';
    const need = {};
    for(let i = 0; i < 5; i++) if(r.e[i] > 0) need[w[i]] = (need[w[i]] || 0) + 1;
    for(const ch in need){ const have = g.filter(x => x === ch).length; if(have < need[ch]) return 'Profi-Modus: ' + ch.toUpperCase() + ' muss vorkommen'; }
  }
  return '';
}

B.registerGame({
  id: 'wortel', name: 'Wortel', icon: '🟩', cat: 'denk', players: '1',
  desc: 'Errate das deutsche Wort mit 5 Buchstaben in 6 Versuchen – jeden Tag ein neues.',
  rules: [
    'Tippe ein Wort mit 5 Buchstaben und bestätige mit ENTER. Jedes Wort mit 5 Buchstaben ist als Versuch erlaubt.',
    '🟩 Grün: Buchstabe ist richtig und an der richtigen Stelle.',
    '🟨 Gelb: Buchstabe kommt im Wort vor, aber an einer anderen Stelle.',
    '⬜ Grau: Buchstabe kommt nicht (bzw. nicht noch öfter) vor.',
    'Ä, Ö und Ü sind eigene Buchstaben (eigene Tasten). Lösungen sind gängige deutsche Wörter, keine Namen.',
    'Profi-Modus: Grüne Buchstaben müssen an ihrer Stelle bleiben, gelbe müssen wieder vorkommen.',
    'Tageswort: einmal pro Tag, für alle gleich. Endlos: so oft du willst. Deine Serie zählt Siege am Stück.'
  ],
  tags: ['alleine', 'drinnen', 'kurz'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Normal', 'Profi'];
    let W = null;
    const stats = () => Object.assign({ played: 0, wins: 0, streak: 0, best: 0, dist: [0, 0, 0, 0, 0, 0] }, api.store.get('stats', {}));
    const saveW = () => { if(!W) return; if(W.mode === 'tag') api.store.set('daily', W); else if(!W.over) api.store.set('frei', W); else api.store.set('frei', null); };
    function statsNode(cur){
      const s = stats(), max = Math.max(1, ...s.dist);
      return el('div', { class: 'b-stack tight' }, [
        el('div', { class: 'b-grid2' }, [
          el('div', { class: 'b-stat' }, [el('small', { text: 'Gespielt' }), el('b', { text: s.played })]),
          el('div', { class: 'b-stat' }, [el('small', { text: 'Siege' }), el('b', { text: s.played ? Math.round(s.wins / s.played * 100) + ' %' : '–' })]),
          el('div', { class: 'b-stat' }, [el('small', { text: 'Serie' }), el('b', { text: s.streak })]),
          el('div', { class: 'b-stat' }, [el('small', { text: 'Beste Serie' }), el('b', { text: s.best })])
        ]),
        el('span', { class: 'b-label', text: 'Verteilung der Versuche' }),
        el('div', { class: 'br-dist' }, s.dist.map((n, i) => el('div', {}, [el('span', { text: i + 1, style: { width: '14px' } }),
          el('i', { class: cur === i + 1 ? 'cur' : '', text: n, style: { width: Math.max(8, n / max * 100) + '%' } })])))
      ]);
    }
    function menu(){
      sc.clear(); W = null;
      const fr = api.store.get('frei', null);
      const statBtn = el('button', { class: 'b-btn ghost block', text: '📊 Statistik', onclick: () => api.sheet(close => el('div', { class: 'b-stack' }, [
        el('h3', { class: 'b-title', text: 'Deine Statistik' }), statsNode(0), el('button', { class: 'b-btn block', text: 'Schließen', onclick: close })])) });
      startScreen(root, api, {
        levels: LV, modes: [{ id: 'tag', label: '📅 Tageswort' }, { id: 'frei', label: '♾️ Endlos' }],
        extra: statBtn, bestLabel: 'Rekord',
        onStart: (l, m) => begin(l, m)
      }, fr && !fr.over ? fr : null, s => { W = s; play(); }, fr ? '▶ Endlos-Runde fortsetzen (Versuch ' + (fr.rows.length + 1) + ')' : '');
    }
    function begin(lvl, mode){
      if(mode === 'tag'){
        const d = B.today(), sv = api.store.get('daily', null);
        if(sv && sv.date === d){
          W = sv;
          if(W.over){ api.toast('Das Tageswort hast du heute schon gespielt.'); return showResult(false); }
          return play();
        }
        const rng = api.seeded('wortel-' + d);
        W = { mode, lvl, date: d, sol: WORT_LIST[Math.floor(rng() * WORT_LIST.length)], rows: [], cur: '', over: false, win: false };
      } else {
        const recent = api.store.get('recent', []);
        let sol; do{ sol = api.pick(WORT_LIST); } while(recent.includes(sol));
        api.store.set('recent', [sol, ...recent].slice(0, 120));
        W = { mode, lvl, sol, rows: [], cur: '', over: false, win: false };
      }
      saveW(); play();
    }
    function play(){
      sc.clear(); root.innerHTML = '';
      const top = el('div', { class: 'br-top' }, [
        mini('Modus', el('b', { text: W.mode === 'tag' ? 'Tageswort' : 'Endlos' })),
        mini('Stufe', el('b', { text: LV[W.lvl] })), mini('Serie', el('b', { text: stats().streak }))
      ]);
      const grid = el('div', { class: 'br-wg' });
      const rowEls = [], tiles = [];
      for(let r = 0; r < 6; r++){
        const row = el('div', { class: 'br-wr' }); const ts = [];
        for(let c = 0; c < 5; c++){ const t = el('div', { class: 'br-wt' }); ts.push(t); row.append(t); }
        rowEls.push(row); tiles.push(ts); grid.append(row);
      }
      const kb = el('div', { class: 'br-kb' }), keys = {};
      const layout = ['qwertzuiopü', 'asdfghjklöä', '+yxcvbnm-'];
      layout.forEach(line => {
        const kr = el('div', { class: 'br-kr' });
        [...line].forEach(ch => {
          let b;
          if(ch === '+') b = el('button', { class: 'br-k wide', text: 'Enter', onclick: submit });
          else if(ch === '-') b = el('button', { class: 'br-k wide', text: '⌫', 'aria-label': 'Löschen', onclick: del });
          else { b = el('button', { class: 'br-k', text: ch, onclick: () => type(ch) }); keys[ch] = b; }
          kr.append(b);
        });
        kb.append(kr);
      });
      root.append(top, grid, kb);
      function paintKeys(){
        const best = {};
        W.rows.forEach(r => [...r.w].forEach((ch, i) => { best[ch] = Math.max(best[ch] ?? -1, r.e[i]); }));
        for(const ch in keys) keys[ch].className = 'br-k' + (ch in best ? ' s' + best[ch] : '');
      }
      function drawRows(animRow){
        for(let r = 0; r < 6; r++){
          const done = W.rows[r], chars = done ? [...done.w] : r === W.rows.length ? [...W.cur] : [];
          for(let c = 0; c < 5; c++){
            const t = tiles[r][c], ch = chars[c] || '';
            t.textContent = ch.toUpperCase();
            let cls = 'br-wt';
            if(done){ cls += ' s' + done.e[c]; if(r === animRow){ cls += ' rev'; t.style.animationDelay = (c * 0.12) + 's'; } else t.style.animationDelay = ''; }
            else if(ch) cls += ' fill';
            t.className = cls;
          }
        }
      }
      drawRows(-1); paintKeys();
      function type(ch){
        if(W.over) return;
        if([...W.cur].length >= 5) return;
        W.cur += ch; api.sound('tap'); drawRows(-1);
      }
      function del(){ if(W.over || !W.cur) return; W.cur = [...W.cur].slice(0, -1).join(''); api.sound('click'); drawRows(-1); }
      function shakeRow(msg){
        api.toast(msg); api.sound('bad');
        const row = rowEls[W.rows.length]; row.classList.remove('b-shake'); void row.offsetWidth; row.classList.add('b-shake');
      }
      function submit(){
        if(W.over) return;
        const g = W.cur.normalize('NFC');
        if([...g].length < 5) return shakeRow('Zu kurz – 5 Buchstaben');
        if(W.lvl === 1){ const m = wHardCheck(g, W.rows); if(m) return shakeRow(m); }
        const e = wEval(g, W.sol);
        W.rows.push({ w: g, e }); W.cur = '';
        drawRows(W.rows.length - 1); api.sound('flip');
        const win = e.every(x => x === 2);
        if(win || W.rows.length >= 6){
          W.over = true; W.win = win; saveW();
          sc.timeout(() => { paintKeys(); finishRound(); }, 800);
        } else { saveW(); sc.timeout(paintKeys, 650); }
      }
      sc.on(document, 'keydown', e => {
        if(e.ctrlKey || e.metaKey || e.altKey) return;
        const k = e.key;
        if(k === 'Enter'){ e.preventDefault(); submit(); }
        else if(k === 'Backspace'){ e.preventDefault(); del(); }
        else if(/^[a-zA-ZäöüÄÖÜ]$/.test(k)) type(k.toLowerCase());
      });
    }
    function finishRound(){
      const s = stats(), n = W.rows.length;
      s.played++;
      if(W.win){ s.wins++; s.streak++; s.best = Math.max(s.best, s.streak); s.dist[n - 1]++; } else s.streak = 0;
      api.store.set('stats', s);
      const score = W.win ? (7 - n) * 100 + (W.lvl ? 100 : 0) + (W.mode === 'tag' ? 50 : 0) : 0;
      W.score = score; saveW();
      if(W.win) api.reportScore(score, String(W.lvl));
      api.finish({ win: W.win, score, difficulty: W.lvl * 2, xp: W.win ? 12 + (6 - n) * 4 + (W.mode === 'tag' ? 6 : 0) : 6 });
      api.sound(W.win ? 'win' : 'lose');
      showResult(true);
    }
    function showResult(fresh){
      const n = W.rows.length;
      const tag = W.mode === 'tag';
      B.ui.result(root, api, {
        win: W.win, emoji: W.win ? ['🤯', '🔥', '😎', '👍', '😅', '😮‍💨'][n - 1] : '💀',
        title: W.win ? ['Unglaublich!', 'Genial!', 'Stark!', 'Gut gemacht!', 'Knapp!', 'Puh, geschafft!'][n - 1] : 'Nicht erraten',
        sub: 'Das Wort war: ' + W.sol.toUpperCase() + (tag ? ' · Morgen gibt’s ein neues Tageswort.' : ''),
        lines: [['Versuche', W.win ? n + ' / 6' : '✗ / 6'], ['Punkte', W.score || 0]],
        againLabel: tag ? '♾️ Endlos spielen' : 'Nächstes Wort',
        onAgain: () => begin(W.lvl, 'frei'), onMenu: menu
      });
      // Ergebnis-Raster + Verteilung anhängen
      const st = root.querySelector('.b-stack');
      if(st){
        const pattern = W.rows.map(r => r.e.map(x => ['⬛', '🟨', '🟩'][x]).join('')).join('\n');
        st.insertBefore(el('div', { class: 'b-card b-center' }, [el('div', { text: pattern, style: { whiteSpace: 'pre', fontSize: '20px', lineHeight: '1.25' } })]), st.children[1]);
        st.insertBefore(el('div', { class: 'b-card' }, [statsNode(W.win ? n : 0)]), st.children[3]);
      }
    }
    menu();
    return () => { saveW(); sc.clear(); };
  }
});

/* ================= 2048 ================= */
const G48_LV = [{ n: 5, undo: true, four: .1 }, { n: 4, undo: true, four: .1 }, { n: 4, undo: false, four: .25 }];
/* Reine Zuglogik (für Tests): grid = Array n*n mit Zahlen, dir 0 links 1 rechts 2 hoch 3 runter → {grid, gained, moved} */
function g48Move(grid, n, dir){
  const out = grid.slice(); let gained = 0, moved = false;
  for(let line = 0; line < n; line++){
    const idx = [];
    for(let k = 0; k < n; k++) idx.push(dir === 0 ? line * n + k : dir === 1 ? line * n + (n - 1 - k) : dir === 2 ? k * n + line : (n - 1 - k) * n + line);
    const vals = idx.map(i => out[i]).filter(Boolean), res = [];
    for(let i = 0; i < vals.length; i++){
      if(i + 1 < vals.length && vals[i] === vals[i + 1]){ res.push(vals[i] * 2); gained += vals[i] * 2; i++; } else res.push(vals[i]);
    }
    idx.forEach((i, k) => { const v = res[k] || 0; if(out[i] !== v) moved = true; out[i] = v; });
  }
  return { grid: out, gained, moved };
}
function g48CanMove(grid, n){
  for(let i = 0; i < n * n; i++){
    if(!grid[i]) return true;
    if(i % n < n - 1 && grid[i] === grid[i + 1]) return true;
    if(i + n < n * n && grid[i] === grid[i + n]) return true;
  }
  return false;
}

B.registerGame({
  id: '2048', name: '2048', icon: '🧮', cat: 'denk', players: '1',
  desc: 'Wische die Kacheln zusammen – gleiche Zahlen verschmelzen. Schaffst du die 2048?',
  rules: [
    'Wische nach oben, unten, links oder rechts (oder Pfeiltasten/WASD). Alle Kacheln rutschen in diese Richtung.',
    'Zwei gleiche Zahlen, die zusammenstoßen, verschmelzen zu ihrer Summe – das gibt Punkte.',
    'Nach jedem Zug erscheint eine neue 2 oder 4. Geht kein Zug mehr, ist das Spiel vorbei.',
    'Leicht: 5×5-Feld. Mittel: 4×4. Schwer: 4×4, mehr 4er und kein Rückgängig.',
    '↶ Rückgängig nimmt den letzten Zug zurück (immer nur 1 Zug). Dein Spiel wird automatisch gespeichert.'
  ],
  tags: ['alleine', 'drinnen', 'lang'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht 5×5', 'Mittel 4×4', 'Schwer 4×4'];
    let S = null, tiles = [], nextId = 1, board = null, refs = {};
    const save = () => { if(S && !S.over) api.store.set('save', { lvl: S.lvl, grid: gridOf(), score: S.score, won: S.won, moves: S.moves, prev: S.prev }); };
    function gridOf(){ const g = new Array(S.n * S.n).fill(0); tiles.forEach(t => { if(!t.dead) g[t.r * S.n + t.c] = t.v; }); return g; }
    function menu(){
      sc.clear(); S = null;
      const sv = api.store.get('save', null);
      startScreen(root, api, { levels: LV, onStart: l => start(l, null) }, sv, s => start(s.lvl, s),
        sv ? '▶ Weiterspielen (' + LV[sv.lvl] + ', ' + sv.score + ' Punkte)' : '');
    }
    function start(lvl, sv){
      sc.clear(); root.innerHTML = '';
      const L = G48_LV[lvl];
      S = { lvl, n: L.n, score: sv ? sv.score : 0, won: sv ? sv.won : false, moves: sv ? sv.moves : 0, prev: sv ? sv.prev : null, over: false, busy: false };
      tiles = [];
      refs.score = el('b', { text: S.score }); refs.best = el('b', { text: api.best(String(lvl)) ?? 0 });
      refs.undo = el('button', { class: 'b-btn ghost sm', text: '↶ Rückgängig', onclick: undo });
      if(!L.undo) refs.undo.style.display = 'none';
      const restart = el('button', { class: 'b-btn ghost sm', text: '⟳ Neu', onclick: async () => { if(await api.confirm('Neues Spiel starten? Der aktuelle Stand geht verloren.', 'Neu starten')){ api.store.set('save', null); start(lvl, null); } } });
      board = el('div', { class: 'br-48' });
      board.style.setProperty('--n', S.n);
      board.style.setProperty('--g', S.n === 5 ? '7px' : '9px');
      for(let i = 0; i < S.n * S.n; i++){ const b = el('div', { class: 'br-bg' }); b.style.setProperty('--r', Math.floor(i / S.n)); b.style.setProperty('--c', i % S.n); board.append(b); }
      root.append(
        el('div', { class: 'br-top' }, [mini('Punkte', refs.score), mini('Rekord', refs.best), mini('Stufe', el('b', { text: ['Leicht', 'Mittel', 'Schwer'][lvl] }))]),
        board,
        el('div', { class: 'b-between', style: { marginTop: '12px' } }, [restart, el('span', { class: 'b-hint', text: 'Wischen zum Spielen' }), refs.undo])
      );
      if(sv) sv.grid.forEach((v, i) => { if(v) addTile(Math.floor(i / S.n), i % S.n, v, false); });
      else { spawn(); spawn(); }
      render(); updUndo();
      // Eingabe
      let sx = 0, sy = 0, down = false;
      sc.on(board, 'pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; });
      sc.on(window, 'pointerup', e => {
        if(!down) return; down = false;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if(Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if(Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 0 : 1); else move(dy < 0 ? 2 : 3);
      });
      sc.on(board, 'pointercancel', () => { down = false; });
      sc.on(document, 'keydown', e => {
        const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3, a: 0, d: 1, w: 2, s: 3 }[e.key];
        if(m != null){ e.preventDefault(); move(m); }
      });
    }
    function addTile(r, c, v, isNew){ const t = { id: nextId++, r, c, v, isNew }; tiles.push(t); return t; }
    function spawn(){
      const g = gridOf(), free = [];
      g.forEach((v, i) => { if(!v) free.push(i); });
      if(!free.length) return;
      const i = api.pick(free);
      addTile(Math.floor(i / S.n), i % S.n, Math.random() < G48_LV[S.lvl].four ? 4 : 2, true);
    }
    function tileEl(t){
      if(!t.el){ t.el = el('div', { class: 'br-t' }, [el('i')]); board.append(t.el); }
      return t.el;
    }
    function paint(t){
      const e = tileEl(t), i = e.firstChild;
      i.textContent = t.v;
      const len = String(t.v).length, base = S.n === 5 ? 26 : 32;
      e.style.setProperty('--fs', (len <= 2 ? base : len === 3 ? base * .8 : len === 4 ? base * .64 : base * .52) + 'px');
      e.className = 'br-t ' + (t.v > 2048 ? 'vbig' : 'v' + t.v) + (t.isNew ? ' new' : '') + (t.mrg ? ' mrg' : '');
    }
    function render(){
      tiles.forEach(t => {
        const e = tileEl(t);
        e.style.setProperty('--r', t.r); e.style.setProperty('--c', t.c);
        if(!t.pending) paint(t);
      });
    }
    function move(dir){
      if(!S || S.over || S.busy) return;
      const n = S.n, before = gridOf();
      const grid = []; tiles.forEach(t => { grid[t.r * n + t.c] = t; });
      let moved = false, gained = 0;
      tiles.forEach(t => { t.isNew = false; t.mrg = false; });
      for(let line = 0; line < n; line++){
        const idx = [];
        for(let k = 0; k < n; k++) idx.push(dir === 0 ? line * n + k : dir === 1 ? line * n + (n - 1 - k) : dir === 2 ? k * n + line : (n - 1 - k) * n + line);
        const ts = idx.map(i => grid[i]).filter(Boolean);
        let k = 0;
        for(let i = 0; i < ts.length; i++){
          const t = ts[i], pos = idx[k], r = Math.floor(pos / n), c = pos % n;
          if(i + 1 < ts.length && ts[i + 1].v === t.v){
            const t2 = ts[i + 1];
            [t, t2].forEach(x => { if(x.r !== r || x.c !== c) moved = true; x.r = r; x.c = c; });
            t2.dead = true; t.v *= 2; t.mrg = true; t.pending = true; gained += t.v; moved = true; i++;
          } else { if(t.r !== r || t.c !== c) moved = true; t.r = r; t.c = c; }
          k++;
        }
      }
      if(!moved){ tiles.forEach(t => { t.mrg = false; t.pending = false; }); return; }
      S.prev = { grid: before, score: S.score };
      S.score += gained; S.moves++; S.busy = true;
      render(); api.sound(gained ? (gained >= 128 ? 'good' : 'pop') : 'move');
      sc.timeout(() => {
        tiles.filter(t => t.dead).forEach(t => t.el && t.el.remove());
        tiles = tiles.filter(t => !t.dead);
        tiles.forEach(t => { if(t.pending){ t.pending = false; paint(t); } });
        spawn(); render(); S.busy = false;
        refs.score.textContent = S.score;
        if(S.score > (api.best(String(S.lvl)) || 0)) refs.best.textContent = S.score;
        updUndo(); save();
        if(!S.won && tiles.some(t => t.v >= 2048)){
          S.won = true; save(); api.sound('win'); api.confetti();
          api.toast('🎉 2048 geschafft! Spiel weiter für mehr Punkte.');
        }
        if(!g48CanMove(gridOf(), n)) gameOver();
      }, 120);
    }
    function updUndo(){ refs.undo.disabled = !S.prev || !G48_LV[S.lvl].undo; }
    function undo(){
      if(!S.prev || S.busy || S.over || !G48_LV[S.lvl].undo) return;
      tiles.forEach(t => t.el && t.el.remove()); tiles = [];
      S.prev.grid.forEach((v, i) => { if(v) addTile(Math.floor(i / S.n), i % S.n, v, false); });
      S.score = S.prev.score; S.prev = null; refs.score.textContent = S.score;
      render(); updUndo(); save(); api.sound('move');
    }
    function gameOver(){
      S.over = true; api.store.set('save', null);
      const maxT = Math.max(...tiles.map(t => t.v));
      const rep = api.reportScore(S.score, String(S.lvl));
      api.finish({ win: S.won, score: S.score, difficulty: S.lvl, xp: Math.min(60, 8 + Math.round(Math.log2(maxT) * 3)) });
      api.sound(S.won ? 'win' : 'lose');
      sc.timeout(() => {
        sc.clear();
        B.ui.result(root, api, {
          win: S.won ? true : null, emoji: S.won ? '🏆' : '🧱', title: S.won ? '2048 geknackt!' : 'Keine Züge mehr',
          sub: rep.isBest ? 'Neuer Rekord! 🔥' : 'Größte Kachel: ' + maxT,
          lines: [['Punkte', S.score], ['Rekord', rep.best], ['Größte Kachel', maxT], ['Züge', S.moves]],
          onAgain: () => start(S.lvl, null), onMenu: menu
        });
      }, 900);
    }
    menu();
    return () => { save(); sc.clear(); };
  }
});

/* ================= LOGIKRÄTSEL ================= */
/* l: 0 leicht, 1 mittel, 2 schwer · a: richtige Antwort · o: falsche Antworten · e: Erklärung */
const LOGIC = [
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '2 · 4 · 8 · 16 · ?', a: '32', o: ['24', '30', '20'], e: 'Jede Zahl wird verdoppelt: 16 × 2 = 32.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '3 · 7 · 11 · 15 · ?', a: '19', o: ['18', '21', '17'], e: 'Es kommt immer 4 dazu: 15 + 4 = 19.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '1 · 4 · 9 · 16 · 25 · ?', a: '36', o: ['30', '35', '49'], e: 'Quadratzahlen: 1², 2², 3², 4², 5² – als Nächstes 6² = 36.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '81 · 27 · 9 · 3 · ?', a: '1', o: ['0', '2', '−3'], e: 'Jede Zahl wird durch 3 geteilt: 3 : 3 = 1.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '1 · 1 · 2 · 3 · 5 · 8 · ?', a: '13', o: ['11', '12', '15'], e: 'Fibonacci: Jede Zahl ist die Summe der zwei davor: 5 + 8 = 13.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '100 · 95 · 85 · 70 · ?', a: '50', o: ['55', '45', '60'], e: 'Abgezogen wird 5, 10, 15, dann 20: 70 − 20 = 50.' },
  { l: 0, q: 'Ein Bauer hat 17 Schafe. Alle außer 9 laufen weg. Wie viele Schafe hat er noch?', a: '9', o: ['8', '17', '0'], e: '„Alle außer 9“ laufen weg – also bleiben genau 9.' },
  { l: 0, q: 'Ein Ziegel wiegt 1 kg plus einen halben Ziegel. Wie schwer ist ein ganzer Ziegel?', a: '2 kg', o: ['1,5 kg', '1 kg', '3 kg'], e: 'Ziegel = 1 kg + ½ Ziegel. Also ist ½ Ziegel = 1 kg und der ganze Ziegel 2 kg.' },
  { l: 0, q: 'Wie viele Monate haben 28 Tage?', a: 'Alle 12', o: ['1', '11', '2'], e: 'Jeder Monat hat mindestens 28 Tage – also alle 12.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '2 · 3 · 5 · 7 · 11 · ?', a: '13', o: ['12', '14', '15'], e: 'Das sind Primzahlen (nur durch 1 und sich selbst teilbar). Nach 11 kommt 13.' },
  { l: 0, q: 'Lisa ist 10, ihr Bruder ist halb so alt. Wie alt ist der Bruder, wenn Lisa 20 ist?', a: '15', o: ['10', '20', '12'], e: 'Der Bruder ist 5, also 5 Jahre jünger. Der Abstand bleibt: 20 − 5 = 15.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '1 · 3 · 6 · 10 · 15 · ?', a: '21', o: ['20', '22', '25'], e: 'Es kommt immer eins mehr dazu: +2, +3, +4, +5, dann +6 → 21.' },
  { l: 0, q: '3 Katzen fangen 3 Mäuse in 3 Minuten. Wie viele Katzen fangen 100 Mäuse in 100 Minuten?', a: '3', o: ['100', '33', '300'], e: 'Jede Katze fängt 1 Maus pro 3 Minuten. In 100 Minuten schaffen 3 Katzen zusammen 100 Mäuse.' },
  { l: 0, q: 'Welcher Buchstabe kommt als Nächstes?', s: 'M · D · M · D · F · S · ?', a: 'S', o: ['M', 'D', 'F'], e: 'Die Anfangsbuchstaben der Wochentage: Montag … Samstag, dann Sonntag.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '2 · 6 · 18 · 54 · ?', a: '162', o: ['108', '148', '216'], e: 'Jede Zahl wird mal 3 genommen: 54 × 3 = 162.' },
  { l: 0, q: 'Tom, Mia und Leo haben je ein Haustier: Hund, Katze oder Fisch. Tom hat keinen Hund. Mia hat die Katze. Wer hat den Hund?', a: 'Leo', o: ['Tom', 'Mia', 'Keiner'], e: 'Mia hat die Katze. Tom hat keinen Hund, also den Fisch. Bleibt für Leo der Hund.' },
  { l: 0, q: 'Ein Auto fährt konstant 60 km/h. Wie weit kommt es in 2,5 Stunden?', a: '150 km', o: ['120 km', '180 km', '125 km'], e: '60 km pro Stunde × 2,5 Stunden = 150 km.' },
  { l: 0, q: 'Wie viele Beine haben 3 Hühner und 2 Kühe zusammen?', a: '14', o: ['10', '12', '16'], e: '3 Hühner × 2 Beine = 6, 2 Kühe × 4 Beine = 8. Zusammen 14.' },
  { l: 0, q: 'Wie geht die Reihe weiter?', s: '9 · 16 · 23 · 30 · ?', a: '37', o: ['36', '38', '39'], e: 'Es kommt immer 7 dazu: 30 + 7 = 37.' },

  { l: 1, q: 'Wie geht die Reihe weiter?', s: '1 · 2 · 6 · 24 · 120 · ?', a: '720', o: ['240', '600', '840'], e: 'Multipliziert wird mit 2, 3, 4, 5, dann 6: 120 × 6 = 720.' },
  { l: 1, q: 'Wie geht die Reihe weiter?', s: '2 · 5 · 11 · 23 · ?', a: '47', o: ['46', '45', '49'], e: 'Immer mal 2 plus 1: 23 × 2 + 1 = 47.' },
  { l: 1, q: 'Wie geht die Reihe weiter?', s: '3 · 5 · 9 · 17 · 33 · ?', a: '65', o: ['64', '66', '49'], e: 'Immer mal 2 minus 1: 33 × 2 − 1 = 65. (Die Abstände verdoppeln sich: 2, 4, 8, 16, 32.)' },
  { l: 1, q: 'Schläger und Ball kosten zusammen 1,10 €. Der Schläger kostet 1 € mehr als der Ball. Was kostet der Ball?', a: '5 Cent', o: ['10 Cent', '1 Cent', '15 Cent'], e: 'Ball = 0,05 €, Schläger = 1,05 €. Zusammen 1,10 € und der Unterschied ist genau 1 €. (10 Cent wäre falsch: dann kostet der Schläger 1,10 € und alles 1,20 €.)' },
  { l: 1, q: 'Seerosen auf einem Teich verdoppeln ihre Fläche jeden Tag. Nach 48 Tagen ist der Teich voll. Wann war er halb voll?', a: 'Tag 47', o: ['Tag 24', 'Tag 46', 'Tag 36'], e: 'Weil sich die Fläche täglich verdoppelt, war der Teich genau einen Tag vorher halb voll.' },
  { l: 1, q: '5 Maschinen machen 5 Teile in 5 Minuten. Wie lange brauchen 100 Maschinen für 100 Teile?', a: '5 Minuten', o: ['100 Minuten', '20 Minuten', '1 Minute'], e: 'Jede Maschine baut 1 Teil in 5 Minuten. 100 Maschinen bauen gleichzeitig 100 Teile – auch in 5 Minuten.' },
  { l: 1, q: 'Wie geht die Reihe weiter?', s: '1 · 8 · 27 · 64 · ?', a: '125', o: ['100', '81', '216'], e: 'Kubikzahlen: 1³, 2³, 3³, 4³ – dann 5³ = 125.' },
  { l: 1, q: 'Wie geht die Reihe weiter?', s: '7 · 10 · 8 · 11 · 9 · 12 · ?', a: '10', o: ['13', '11', '8'], e: 'Abwechselnd +3 und −2: 12 − 2 = 10.' },
  { l: 1, q: 'Ich denke mir eine Zahl, nehme sie mal 3 und addiere 6. Heraus kommt 27. Welche Zahl war es?', a: '7', o: ['6', '8', '9'], e: 'Rückwärts rechnen: 27 − 6 = 21, 21 : 3 = 7.' },
  { l: 1, q: 'Du überholst bei einem Rennen den Zweiten. Auf welchem Platz bist du jetzt?', a: 'Zweiter', o: ['Erster', 'Dritter', 'Letzter'], e: 'Du nimmst seinen Platz ein – du bist Zweiter. Der Erste ist immer noch vor dir.' },
  { l: 1, q: 'Vater und Sohn sind zusammen 36 Jahre alt. Der Vater ist 30 Jahre älter als der Sohn. Wie alt ist der Sohn?', a: '3', o: ['6', '4', '5'], e: 'Sohn 3, Vater 33: zusammen 36, Unterschied 30. (Bei 6 wäre der Vater 30 – Unterschied nur 24.)' },
  { l: 1, q: 'Wie geht die Reihe weiter?', s: '2 · 3 · 5 · 8 · 12 · 17 · ?', a: '23', o: ['22', '24', '25'], e: 'Die Abstände wachsen um 1: +1, +2, +3, +4, +5, dann +6 → 23.' },
  { l: 1, q: '6 Leute treffen sich und jeder gibt jedem genau einmal die Hand. Wie viele Handschläge sind das?', a: '15', o: ['30', '36', '12'], e: 'Der Erste schüttelt 5 Hände, der Nächste noch 4 neue, dann 3, 2, 1: 5+4+3+2+1 = 15.' },
  { l: 1, q: 'Welche Zahl passt nicht dazu?', s: '2 · 3 · 5 · 9 · 11 · 13', a: '9', o: ['2', '11', '13'], e: 'Alle anderen sind Primzahlen. 9 = 3 × 3 ist keine.' },
  { l: 1, q: 'Heute ist Montag. Welcher Wochentag ist in 100 Tagen?', a: 'Mittwoch', o: ['Dienstag', 'Donnerstag', 'Freitag'], e: '100 = 14 × 7 + 2. Nach 14 ganzen Wochen ist wieder Montag, plus 2 Tage → Mittwoch.' },
  { l: 1, q: 'Drei aufeinanderfolgende Zahlen ergeben zusammen 48. Wie heißt die größte?', a: '17', o: ['16', '18', '15'], e: '48 : 3 = 16 ist die mittlere Zahl. Also 15 + 16 + 17 – die größte ist 17.' },
  { l: 1, q: 'In einer Lade liegen 10 schwarze und 10 weiße Socken. Im Dunkeln: Wie viele musst du mindestens ziehen, um sicher ein gleichfarbiges Paar zu haben?', a: '3', o: ['2', '11', '10'], e: 'Es gibt nur 2 Farben. Spätestens die 3. Socke passt farblich zu einer der ersten beiden.' },
  { l: 1, q: 'Anna ist größer als Ben. Clara ist kleiner als Ben. David ist größer als Anna. Wer ist am zweitgrößten?', a: 'Anna', o: ['Ben', 'Clara', 'David'], e: 'Reihenfolge: David > Anna > Ben > Clara. Auf Platz 2 steht Anna.' },
  { l: 1, q: 'Drei Häuser stehen nebeneinander: rot, blau und grün. Das rote steht ganz links. Das blaue steht nicht neben dem roten. Welche Farbe hat das mittlere Haus?', a: 'Grün', o: ['Rot', 'Blau', 'Nicht lösbar'], e: 'Rot ist links (Platz 1). Blau darf nicht auf Platz 2, also Platz 3. Für die Mitte bleibt Grün.' },
  { l: 1, q: 'Wie oft kannst du 5 von 25 abziehen?', a: 'Einmal', o: ['5-mal', '4-mal', 'Gar nicht'], e: 'Nach dem ersten Mal ziehst du nicht mehr von 25 ab, sondern von 20.' },
  { l: 1, q: 'Ein Shirt kostet 20 €. Es wird erst um 50 % teurer und danach um 50 % billiger. Was kostet es jetzt?', a: '15 €', o: ['20 €', '10 €', '25 €'], e: '20 € + 50 % = 30 €. Davon 50 % weniger = 15 €. Die 50 % beziehen sich jedes Mal auf einen anderen Betrag.' },

  { l: 2, q: 'Wie viel Grad liegen um 3:30 Uhr zwischen Stunden- und Minutenzeiger?', a: '75°', o: ['90°', '60°', '85°'], e: 'Minutenzeiger auf 6 = 180°. Der Stundenzeiger steht halb zwischen 3 und 4: 90° + 15° = 105°. 180° − 105° = 75°.' },
  { l: 2, q: 'Ein Buch hat die Seiten 1 bis 100. Wie oft kommt die Ziffer 9 in den Seitenzahlen vor?', a: '20', o: ['10', '19', '21'], e: 'Als Einerstelle: 9, 19, …, 99 = 10-mal. Als Zehnerstelle: 90–99 = 10-mal. Zusammen 20 (die 99 zählt doppelt).' },
  { l: 2, q: 'Wie geht die Reihe weiter?', s: '0 · 1 · 1 · 2 · 4 · 7 · 13 · ?', a: '24', o: ['20', '21', '26'], e: 'Jede Zahl ist die Summe der drei davor: 4 + 7 + 13 = 24.' },
  { l: 2, q: 'Eine Schnecke sitzt am Boden eines 10 m tiefen Brunnens. Tagsüber klettert sie 3 m hoch, nachts rutscht sie 2 m ab. An welchem Tag ist sie draußen?', a: 'Tag 8', o: ['Tag 10', 'Tag 7', 'Tag 9'], e: 'Pro Tag+Nacht schafft sie 1 m. Nach 7 Nächten ist sie auf 7 m, am 8. Tag klettert sie 3 m auf 10 m – raus, bevor sie abrutscht.' },
  { l: 2, q: 'Wie geht die Reihe weiter?', s: '1 · 11 · 21 · 1211 · 111221 · ?', a: '312211', o: ['1112221', '211221', '1231'], e: 'Jede Zahl beschreibt die vorige: 111221 = „drei 1, zwei 2, eine 1“ → 31 22 11.' },
  { l: 2, q: 'Wie geht die Reihe weiter?', s: '2 · 4 · 12 · 48 · 240 · ?', a: '1440', o: ['960', '1200', '1680'], e: 'Multipliziert wird mit 2, 3, 4, 5, dann 6: 240 × 6 = 1440.' },
  { l: 2, q: 'Wie viele Quadrate siehst du insgesamt in einem 3×3-Gitter (wie ein Tic-Tac-Toe-Feld mit Rand)?', a: '14', o: ['9', '13', '10'], e: '9 kleine (1×1), 4 mittlere (2×2) und 1 großes (3×3): 9 + 4 + 1 = 14.' },
  { l: 2, q: 'Drei Kisten sind beschriftet: „Äpfel“, „Birnen“, „Gemischt“. ALLE Schilder sind falsch. Aus welcher Kiste musst du eine Frucht ziehen, um alle richtig zu beschriften?', a: '„Gemischt“', o: ['„Äpfel“', '„Birnen“', 'Geht nicht'], e: 'Die „Gemischt“-Kiste ist sicher nicht gemischt. Ziehst du z. B. einen Apfel, ist es die Äpfel-Kiste. Die Kiste „Birnen“ kann dann nur noch gemischt sein, und „Äpfel“ enthält die Birnen.' },
  { l: 2, q: 'Wie geht die Reihe weiter?', s: '31 · 28 · 31 · 30 · 31 · ?', a: '30', o: ['29', '31', '28'], e: 'Die Tage der Monate: Jänner 31, Februar 28, März 31, April 30, Mai 31, Juni 30.' },
  { l: 2, q: '8 gleich aussehende Kugeln, eine davon ist schwerer. Wie oft musst du mit einer Balkenwaage mindestens wiegen, um sie sicher zu finden?', a: '2-mal', o: ['1-mal', '3-mal', '4-mal'], e: 'Lege 3 gegen 3. Gleich schwer? Dann ist es eine der 2 übrigen – einmal gegeneinander wiegen. Sonst: aus den 3 schwereren 1 gegen 1 wiegen; bei Gleichstand ist es die dritte.' },
  { l: 2, q: 'Ein 1 km langer Zug fährt mit 1 km pro Minute durch einen 1 km langen Tunnel. Wie lange dauert es, bis der ganze Zug durch ist?', a: '2 Minuten', o: ['1 Minute', '1,5 Minuten', '3 Minuten'], e: 'Die Spitze muss 1 km durch den Tunnel plus 1 km weiter, bis auch das Ende draußen ist: 2 km → 2 Minuten.' },
  { l: 2, q: 'Mit wie vielen Nullen endet das Ergebnis von 1 · 2 · 3 · … · 20?', a: '4', o: ['2', '3', '5'], e: 'Jede Null entsteht aus 2 × 5. Fünfer stecken in 5, 10, 15 und 20 – also 4 Stück (Zweier gibt es genug). 20! = 2 432 902 008 176 640 000.' },
  { l: 2, q: 'Ein Frosch springt Stufen hoch: immer 1 oder 2 Stufen auf einmal. Auf wie viele Arten kommt er 5 Stufen hoch?', a: '8', o: ['5', '10', '13'], e: 'Für n Stufen: Arten(n) = Arten(n−1) + Arten(n−2). 1 Stufe: 1, 2: 2, 3: 3, 4: 5, 5: 8.' },
  { l: 2, q: 'In einem Raum sind 3 Lichtschalter, im Nebenraum hängen 3 Lampen. Du darfst nur EINMAL rüberschauen. Was ist der Trick?', a: 'Wärme der Lampen prüfen', o: ['Alle gleichzeitig einschalten', 'Geht nicht', 'Raten'], e: 'Schalter 1 lange an, dann aus; Schalter 2 an; rübergehen. Leuchtet = 2, warm aber aus = 1, kalt und aus = 3.' }
];

B.registerGame({
  id: 'logic', name: 'Logikrätsel', icon: '🧠', cat: 'denk', players: '1',
  desc: 'Zahlenreihen, Knobelfragen und Denksport – mit Erklärung nach jeder Antwort.',
  rules: [
    'Eine Runde hat 8 Rätsel aus deiner Schwierigkeitsstufe.',
    'Tippe auf die Antwort, die du für richtig hältst. Danach siehst du die Erklärung.',
    'Richtige Antwort = 100 Punkte, plus bis zu 50 Bonuspunkte, wenn du schnell bist.',
    'Ab 5 richtigen Antworten hast du die Runde gewonnen. Rätsel, die du schon hattest, kommen erst später wieder.'
  ],
  tags: ['alleine', 'drinnen', 'kurz'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht', 'Mittel', 'Schwer'], PER = 8;
    let R = null;
    function menu(){ sc.clear(); B.ui.start(root, api, { levels: LV, onStart: l => start(l) }); }
    function pickSet(lvl){
      const pool = LOGIC.map((p, i) => i).filter(i => LOGIC[i].l === lvl);
      let seen = api.store.get('seen', []).filter(i => pool.includes(i));
      let fresh = pool.filter(i => !seen.includes(i));
      if(fresh.length < PER){ seen = []; fresh = pool.slice(); api.store.set('seen', api.store.get('seen', []).filter(i => !pool.includes(i))); }
      return api.shuffle(fresh).slice(0, PER);
    }
    function start(lvl){
      R = { lvl, set: pickSet(lvl), k: 0, right: 0, score: 0, t0: 0 };
      question();
    }
    function question(){
      sc.clear(); root.innerHTML = '';
      const p = LOGIC[R.set[R.k]];
      const opts = api.shuffle([p.a, ...p.o]);
      const bar = el('div', { class: 'b-bar' }, [el('i', { style: { width: (R.k / R.set.length * 100) + '%' } })]);
      const scoreEl = el('b', { text: R.score });
      const optBox = el('div', { class: 'br-opts' });
      const after = el('div', { class: 'b-stack tight' });
      R.t0 = Date.now();
      opts.forEach(o => {
        const b = el('button', { class: 'br-opt', text: o });
        b.onclick = () => answer(o, b);
        optBox.append(b);
      });
      root.append(el('div', { class: 'b-stack' }, [
        el('div', { class: 'br-top' }, [mini('Rätsel', el('b', { text: (R.k + 1) + ' / ' + R.set.length })), mini('Richtig', el('b', { text: R.right })), mini('Punkte', scoreEl)]),
        bar,
        el('div', { class: 'b-card glow br-q b-pop' }, [el('div', { class: 'b-kicker', text: p.s ? 'Zahlenreihe' : 'Denksport' }), el('p', { text: p.q }), p.s ? el('div', { class: 'br-seq', text: p.s }) : null]),
        optBox, after
      ]));
      function answer(o, btn){
        if(optBox.dataset.done) return; optBox.dataset.done = '1';
        const ok = o === p.a, sec = (Date.now() - R.t0) / 1000;
        [...optBox.children].forEach(b => { b.disabled = true; if(b.textContent === p.a) b.classList.add('ok'); });
        if(ok){ const bonus = Math.max(0, Math.round(50 - Math.max(0, sec - 8) * 2.5)); R.right++; R.score += 100 + bonus; api.sound('good'); scoreEl.textContent = R.score; }
        else { btn.classList.add('no'); api.sound('bad'); api.vibrate(40); }
        const seen = api.store.get('seen', []); if(!seen.includes(R.set[R.k])){ seen.push(R.set[R.k]); api.store.set('seen', seen); }
        after.append(
          el('div', { class: 'b-card br-exp b-pop' + (ok ? '' : ' bad') }, [el('div', { class: 'b-kicker', text: ok ? '✔ Richtig!' : '✖ Leider falsch – richtig ist: ' + p.a, style: { color: ok ? 'var(--good)' : 'var(--bad)' } }), el('p', { text: p.e, style: { marginTop: '6px' } })]),
          el('button', { class: 'b-btn block', text: R.k + 1 < R.set.length ? 'Weiter ›' : 'Ergebnis', onclick: () => { api.sound('click'); R.k++; if(R.k < R.set.length) question(); else end(); } })
        );
        after.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    function end(){
      const win = R.right >= 5;
      const rep = api.reportScore(R.score, String(R.lvl));
      api.finish({ win, score: R.score, difficulty: R.lvl, xp: 6 + R.right * 4 });
      api.sound(win ? 'win' : 'lose');
      B.ui.result(root, api, {
        win, emoji: R.right === R.set.length ? '🧠' : win ? '🏆' : '🤔',
        title: R.right === R.set.length ? 'Perfekt! Alle richtig!' : win ? 'Gut geknobelt!' : 'Da geht noch was',
        sub: R.right + ' von ' + R.set.length + ' richtig' + (rep.isBest ? ' · Neuer Rekord!' : ''),
        lines: [['Richtig', R.right + ' / ' + R.set.length], ['Punkte', R.score], ['Rekord', rep.best], ['Stufe', LV[R.lvl]]],
        againLabel: 'Neue Runde', onAgain: () => start(R.lvl), onMenu: menu
      });
    }
    menu();
    return () => sc.clear();
  }
});

/* ================= ESCAPE ROOM: DAS LABOR ================= */
const ESC_CODE = '3142';                       // Reagenzgläser: 3 rot, 1 blau, 4 grün, 2 gelb
const ESC_TUBES = ['🟢', '🔴', '🟡', '🟢', '🔵', '🔴', '🟢', '🟡', '🔴', '🟢'];
const ESC_BOTTLES = [['🔴', 1], ['🟢', 0], ['🔵', 1], ['🟡', 0], ['🟢', 1], ['🔴', 0], ['🟡', 1]]; // [Farbe, Totenkopf?]
const ESC_COLORS = [['🔴', 'Rot', 'bad'], ['🔵', 'Blau', 'cyan'], ['🟢', 'Grün', 'good'], ['🟡', 'Gelb', 'warn']];
const ESC_SEQ = ESC_BOTTLES.filter(b => b[1]).map(b => b[0]); // 🔴 🔵 🟢 🟡
const ESC_ITEMS = {
  key: { e: '🗝️', n: 'Kleiner Schlüssel', d: 'Ein winziger Messingschlüssel. Passt sicher in ein kleines Schloss.' },
  uv: { e: '🔦', n: 'UV-Lampe', d: 'Eine Schwarzlicht-Taschenlampe. Macht unsichtbare Schrift sichtbar.' },
  usb: { e: '💾', n: 'Sicherheits-Stick', d: 'Ein USB-Stick mit der Aufschrift „LOGIN“.' },
  note: { e: '📝', n: 'Notiz', d: 'Handschrift: „Passwort = die Flaschen mit ☠️ – von links nach rechts.“' },
  card: { e: '💳', n: 'Keycard', d: 'Notfall-Keycard des Labors. Öffnet elektronische Türen.' }
};

B.registerGame({
  id: 'escape', name: 'Escape: Das Labor', icon: '🔐', cat: 'denk', players: '1',
  desc: 'Du bist im Labor eingesperrt. Untersuche alles, sammle Gegenstände und knacke die Schlösser.',
  rules: [
    'Tippe Gegenstände im Raum an, um sie zu untersuchen.',
    'Gefundene Dinge landen im Inventar unten. Im Untersuchen-Fenster kannst du sie benutzen.',
    'Die Rätsel hängen zusammen: Ein Fund führt zum nächsten. Am Ende musst du durch die Tür.',
    'Leicht: Hinweise ohne Limit, wichtige Objekte leuchten. Mittel: 3 Hinweise. Schwer: 1 Hinweis und 10 Minuten Zeit.',
    'Je schneller und mit weniger Hinweisen, desto mehr Punkte. Dein Fortschritt wird gespeichert.'
  ],
  tags: ['alleine', 'drinnen', 'lang', 'schwierig'],
  mount(root, api){
    css();
    const sc = scope(), LV = ['Leicht', 'Mittel', 'Schwer'], HINTS = [Infinity, 3, 1], LIMIT = [0, 0, 600];
    let E = null, closeSheet = null, refs = {};
    const save = () => { if(E && !E.over) api.store.set('save', E); };
    const has = id => E.inv.includes(id);
    const give = id => { if(!has(id)){ E.inv.push(id); api.sound('level'); api.vibrate(30); api.toast(ESC_ITEMS[id].e + ' ' + ESC_ITEMS[id].n + ' eingesteckt'); } };
    const take = id => { E.inv = E.inv.filter(x => x !== id); };
    function menu(){
      sc.clear(); E = null;
      const sv = api.store.get('save', null);
      startScreen(root, api, { levels: LV, startLabel: '▶ Neu starten', onStart: l => begin(l) }, sv, s => { E = s; play(); },
        sv ? '▶ Weiterspielen (' + LV[sv.lvl] + ', ' + fmt(sv.t) + ')' : '');
    }
    function begin(lvl){
      E = { lvl, t: 0, hints: 0, inv: [], f: {}, over: false };
      save(); play();
      sc.timeout(() => api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: 'Story' }), el('h3', { class: 'b-title', text: '🧪 Das Labor' }),
        el('p', { text: 'Ein Alarm, ein Knall – und die Labortür ist verriegelt. Das Notfallsystem lässt dich nur mit der Keycard raus. Irgendwo hier muss es einen Weg geben …' }),
        el('button', { class: 'b-btn block', text: 'Los geht’s', onclick: () => { api.sound('click'); close(); } })
      ])), 350);
    }
    /* Objekte im Raum: x/y in %, size */
    const OBJ = [
      { id: 'poster', e: '🧬', n: 'Poster', x: 17, y: 14 },
      { id: 'uhr', e: '🕒', n: 'Uhr', x: 50, y: 9 },
      { id: 'tubes', e: '🧪', n: 'Reagenzgläser', x: 82, y: 13 },
      { id: 'bottles', e: '⚗️', n: 'Flaschenregal', x: 16, y: 40 },
      { id: 'books', e: '📚', n: 'Bücherregal', x: 47, y: 37 },
      { id: 'door', e: '🚪', n: 'Tür', x: 83, y: 46, big: true },
      { id: 'pc', e: '🖥️', n: 'Computer', x: 40, y: 63 },
      { id: 'drawer', e: '🗄️', n: 'Schublade', x: 59, y: 66 },
      { id: 'plant', e: '🪴', n: 'Pflanze', x: 12, y: 84 },
      { id: 'safe', e: '🔐', n: 'Tresor', x: 50, y: 88 },
      { id: 'trash', e: '🗑️', n: 'Mülleimer', x: 84, y: 86 }
    ];
    function nextHint(){
      const f = E.f;
      if(!has('key') && !f.drawer) return 'Die Erde der Pflanze sieht frisch umgegraben aus …';
      if(!f.drawer) return 'Dein kleiner Schlüssel passt in die Schreibtisch-Schublade.';
      if(!f.poster) return 'Leuchte mit der UV-Lampe auf das Poster an der Wand.';
      if(!f.safe) return 'Zähle die Reagenzgläser je Farbe – in der Reihenfolge vom Poster: Rot, Blau, Grün, Gelb. Das ist der Tresor-Code.';
      if(!f.usbIn) return 'Steck den Sicherheits-Stick in den Computer.';
      if(!f.pc) return 'Lies die Notiz und schau dir das Flaschenregal an: Nur die Flaschen mit ☠️ zählen – von links nach rechts.';
      if(!has('card')) return 'Der Computer hat Band 7 im Bücherregal entriegelt.';
      return 'Halte die Keycard an die Tür!';
    }
    const important = () => {
      const f = E.f, s = new Set();
      if(!has('key') && !f.drawer) s.add('plant');
      if(has('key')) s.add('drawer');
      if(has('uv') && !f.poster) s.add('poster');
      if(f.poster && !f.safe){ s.add('tubes'); s.add('safe'); }
      if(has('usb')) s.add('pc');
      if(f.usbIn && !f.pc){ s.add('bottles'); s.add('pc'); }
      if(f.pc && !has('card')) s.add('books');
      if(has('card')) s.add('door');
      return s;
    };
    function play(){
      sc.clear(); root.innerHTML = '';
      refs.time = el('b', { text: fmt(LIMIT[E.lvl] ? LIMIT[E.lvl] - E.t : E.t) });
      refs.hintBtn = el('button', { class: 'b-btn ghost sm', onclick: hint });
      refs.room = el('div', { class: 'br-room', role: 'img', 'aria-label': 'Laborraum' });
      refs.inv = el('div', { class: 'br-inv' });
      root.append(
        el('div', { class: 'br-top' }, [mini(LIMIT[E.lvl] ? 'Restzeit' : 'Zeit', refs.time), mini('Funde', refs.found = el('b')), el('div', { style: { display: 'flex', alignItems: 'center' } }, [refs.hintBtn])]),
        refs.room, refs.inv
      );
      draw();
      sc.interval(() => {
        if(document.hidden || E.over) return;
        E.t++;
        if(LIMIT[E.lvl]){
          const left = LIMIT[E.lvl] - E.t; refs.time.textContent = fmt(left);
          if(left <= 60 && left > 0 && left % 10 === 0) api.sound('tick');
          if(left <= 0) return end(false);
        } else refs.time.textContent = fmt(E.t);
        if(E.t % 5 === 0) save();
      }, 1000);
    }
    function draw(){
      const imp = E.lvl === 0 ? important() : new Set();
      refs.room.innerHTML = '';
      refs.room.append(el('div', { class: 'br-desk' }));
      OBJ.forEach(o => {
        let e = o.e;
        if(o.id === 'drawer' && E.f.drawer) e = '📂';
        if(o.id === 'safe' && E.f.safe) e = '🔓';
        if(o.id === 'plant' && E.f.dug) e = '🪴';
        const solved = (o.id === 'drawer' && E.f.drawer) || (o.id === 'safe' && E.f.safe) || (o.id === 'pc' && E.f.pc) || (o.id === 'poster' && E.f.poster);
        const b = el('button', { class: 'br-obj' + (o.big ? ' big' : '') + (imp.has(o.id) ? ' glim' : '') + (solved ? ' ok' : ''),
          style: { left: o.x + '%', top: o.y + '%' }, 'aria-label': o.n, 'data-obj': o.id, onclick: () => { api.sound('tap'); open(o.id); } },
          [el('span', { text: e }), el('small', { text: o.n })]);
        refs.room.append(b);
      });
      refs.inv.innerHTML = '';
      if(!E.inv.length) refs.inv.append(el('span', { class: 'b-hint', text: '🎒 Inventar leer – untersuche den Raum!' }));
      E.inv.forEach(id => refs.inv.append(el('button', { class: 'br-it', 'aria-label': ESC_ITEMS[id].n, 'data-item': id, text: ESC_ITEMS[id].e, onclick: () => showItem(id) })));
      refs.found.textContent = (['drawer', 'poster', 'safe', 'usbIn', 'pc'].filter(k => E.f[k]).length + (has('card') || E.f.door ? 1 : 0) + (has('key') || E.f.drawer ? 1 : 0)) + ' / 7';
      const left = HINTS[E.lvl] - E.hints;
      refs.hintBtn.textContent = '💡 Hinweis' + (isFinite(left) ? ' (' + left + ')' : '');
      refs.hintBtn.disabled = left <= 0;
    }
    function showItem(id){
      api.sound('click');
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { style: { fontSize: '54px', textAlign: 'center' }, text: ESC_ITEMS[id].e }),
        el('h3', { class: 'b-title', text: ESC_ITEMS[id].n, style: { textAlign: 'center' } }),
        el('p', { text: ESC_ITEMS[id].d }),
        el('p', { class: 'b-hint', text: 'Tipp: Untersuche ein Objekt im Raum und benutze den Gegenstand dort.' }),
        el('button', { class: 'b-btn block', text: 'OK', onclick: close })
      ]));
    }
    function hint(){
      if(E.hints >= HINTS[E.lvl]) return;
      E.hints++; api.sound('check'); save(); draw();
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: '💡 Hinweis' }), el('p', { class: 'b-h', text: nextHint(), style: { textTransform: 'none', fontSize: '19px' } }),
        el('button', { class: 'b-btn block', text: 'Danke!', onclick: close })
      ]));
    }
    /* Untersuchen-Fenster */
    function open(id){
      if(E.over) return;
      if(closeSheet){ try{ closeSheet(); }catch(e){} }
      const o = OBJ.find(x => x.id === id);
      const msg = el('p', { class: 'b-hint', style: { minHeight: '20px', color: 'var(--warn)' } });
      const body = el('div', { class: 'b-stack tight' });
      const say = (t, snd) => { msg.textContent = t; if(snd) api.sound(snd); };
      const refresh = () => { save(); draw(); open(id); };
      const useRow = handler => {
        const usable = E.inv.filter(i => i !== 'note');
        if(!usable.length) return null;
        return el('div', {}, [el('span', { class: 'b-label', text: 'Benutzen' }), el('div', { class: 'b-row' }, usable.map(it =>
          el('button', { class: 'b-btn ghost sm', 'data-use': it, text: ESC_ITEMS[it].e + ' ' + ESC_ITEMS[it].n, onclick: () => { if(!handler(it)) say('Das bringt hier nichts.', 'bad'); } })))]);
      };
      let content = [];
      switch(id){
        case 'plant':
          if(!E.f.dug) content = [el('p', { text: 'Eine Laborpflanze in einem großen Topf. Die Erde sieht frisch umgegraben aus.' }),
            el('button', { class: 'b-btn block', 'data-act': 'dig', text: '✋ In der Erde graben', onclick: () => { E.f.dug = true; give('key'); refresh(); } })];
          else content = [el('p', { text: 'Hier hast du den kleinen Schlüssel ausgegraben. Sonst nur Erde.' })];
          break;
        case 'drawer':
          if(!E.f.drawer) content = [el('p', { text: 'Die Schreibtisch-Schublade ist abgeschlossen. Ein winziges Schlüsselloch.' }),
            useRow(it => { if(it !== 'key') return false; E.f.drawer = true; take('key'); give('uv'); api.sound('good'); refresh(); return true; })];
          else content = [el('p', { text: 'Die Schublade ist offen. Darin lag die UV-Lampe – jetzt ist sie leer.' })];
          break;
        case 'poster':
          if(!E.f.poster) content = [el('p', { text: 'Ein Poster: „SICHERHEIT IM LABOR – Ordnung ist alles!“ Seltsam, auf der weißen Fläche glänzt etwas …' }),
            useRow(it => { if(it !== 'uv') return false; E.f.poster = true; api.sound('good'); refresh(); return true; })];
          else content = [el('p', { text: 'Im Schwarzlicht leuchtet eine geheime Schrift:' }),
            el('div', { class: 'b-card br-uv', text: 'ZÄHLE DIE GLÄSER\n🔴 → 🔵 → 🟢 → 🟡', style: { whiteSpace: 'pre-line' } })];
          break;
        case 'tubes':
          content = [el('p', { text: 'Ein Ständer mit bunten Reagenzgläsern:' }),
            el('div', { class: 'br-shelf' }, ESC_TUBES.map(t => el('span', { class: 'br-bottle' }, [el('span', { text: '🧪' }), el('small', { text: t })])))];
          break;
        case 'bottles':
          content = [el('p', { text: 'Ein Regal mit Chemikalien. Manche Flaschen tragen ein Warnetikett.' }),
            el('div', { class: 'br-shelf' }, ESC_BOTTLES.map(([c, skull]) => el('span', { class: 'br-bottle' }, [el('span', { text: c }), el('small', { text: skull ? '☠️' : '' })])))];
          break;
        case 'safe':
          if(!E.f.safe){
            let code = '';
            const disp = el('div', { class: 'br-code' }, [0, 1, 2, 3].map(() => el('span')));
            const show = () => [...disp.children].forEach((s, i) => s.textContent = code[i] || '');
            const keys = el('div', { class: 'br-keys' });
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].forEach(k => keys.append(el('button', { text: k, 'data-key': k, onclick: () => {
              if(k === '⌫'){ code = code.slice(0, -1); api.sound('click'); }
              else if(k === 'OK'){
                if(code === ESC_CODE){ E.f.safe = true; give('usb'); give('note'); api.sound('win'); refresh(); return; }
                say(code.length < 4 ? 'Der Code hat 4 Stellen.' : 'Falscher Code. Es piept böse.', 'bad'); disp.classList.remove('b-shake'); void disp.offsetWidth; disp.classList.add('b-shake'); code = '';
              } else if(code.length < 4){ code += k; api.sound('tick'); }
              show();
            } })));
            content = [el('p', { text: 'Ein Tresor mit 4-stelligem Zahlenschloss.' }), disp, keys];
          } else content = [el('p', { text: 'Der Tresor ist offen. Darin lagen ein USB-Stick und eine Notiz.' })];
          break;
        case 'pc':
          if(!E.f.usbIn) content = [el('div', { class: 'br-screen', text: '> SYSTEM GESPERRT\n> Bitte Sicherheits-Stick einstecken_' }),
            useRow(it => { if(it !== 'usb') return false; E.f.usbIn = true; take('usb'); api.sound('good'); refresh(); return true; })];
          else if(!E.f.pc){
            let seq = [];
            const scr = el('div', { class: 'br-screen' });
            const showS = () => { scr.textContent = '> STICK ERKANNT\n> Farb-Passwort eingeben:\n> ' + (seq.join(' ') || '_') + '\n' + (E.inv.includes('note') ? '' : ''); };
            showS();
            const cols = el('div', { class: 'br-cols' }, ESC_COLORS.map(([c, n, v]) => {
              const b = el('button', { text: n, 'data-col': c, onclick: () => {
                if(seq.length >= 4) return;
                seq.push(c); api.sound('tick'); showS();
                if(seq.length === 4){
                  if(seq.join('') === ESC_SEQ.join('')){ E.f.pc = true; api.sound('win'); refresh(); }
                  else { say('ZUGRIFF VERWEIGERT – falsche Reihenfolge.', 'bad'); setTimeout(() => { seq = []; showS(); }, 500); }
                }
              } });
              b.style.setProperty('--pc', 'var(--' + v + ')'); return b;
            }));
            content = [scr, cols, el('button', { class: 'b-btn ghost sm', text: 'Eingabe löschen', onclick: () => { seq = []; showS(); api.sound('click'); } })];
          } else content = [el('div', { class: 'br-screen', text: '> ZUGANG GEWÄHRT\n> Notfall-Keycard: Bücherregal, Band 7\n> Magnetschloss von Band 7 geöffnet.' })];
          break;
        case 'books': {
          const shelf = el('div', { class: 'br-books' });
          const cols = ['cyan', 'violet', 'pink', 'warn', 'good', 'bad', 'violet', 'cyan', 'pink'];
          const flavor = ['„Chemie für Anfänger“ – voller Kaffeeflecken.', '„Periodensystem zum Ausmalen“. Nett.', '„Explosionen und wie man sie vermeidet“. Hm.', 'Ein Laborjournal. Nur Formeln.', '„Pflanzen richtig gießen“.', 'Ein Kochbuch?! In einem Labor?', null, 'Ein Wörterbuch Latein–Deutsch.', '„Band 9 – Anhang“. Langweilig.'];
          for(let i = 0; i < 9; i++){
            const b = el('button', { class: 'br-book', text: i + 1, 'data-book': i + 1, 'aria-label': 'Band ' + (i + 1), style: { height: (80 + (i * 37 % 30)) + 'px' }, onclick: () => {
              if(i === 6){
                if(!E.f.pc) say('Band 7 lässt sich nicht bewegen – ein Magnetschloss hält es fest. 🔒', 'bad');
                else if(!has('card') && !E.f.door){ give('card'); refresh(); }
                else say('Band 7 ist hohl – und jetzt leer.');
              } else say(flavor[i], 'click');
            } });
            b.style.setProperty('--pc', 'var(--' + cols[i] + ')'); shelf.append(b);
          }
          content = [el('p', { text: 'Ein Regal mit 9 nummerierten Bänden.' }), shelf];
          break;
        }
        case 'door':
          content = [el('p', { text: 'Eine schwere Stahltür. Daneben ein Kartenleser mit rotem Licht.' }),
            useRow(it => { if(it !== 'card') return false; E.f.door = true; take('card'); if(closeSheet) closeSheet(); end(true); return true; })];
          break;
        case 'uhr':
          content = [el('p', { text: 'Tick, tack. Die Uhr läuft unerbittlich weiter – beeil dich!' })];
          break;
        case 'trash':
          content = [el('p', { text: 'Ein Mülleimer. Darin: ein zerknülltes Pausenbrot und benutzte Handschuhe. Igitt.' })];
          break;
      }
      closeSheet = api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-between' }, [el('h3', { class: 'b-title', text: o.e + ' ' + o.n }), el('button', { class: 'b-icon-btn', text: '✕', 'aria-label': 'Schließen', onclick: close })]),
        body, msg
      ]), { onClose: () => { closeSheet = null; } });
      content.filter(Boolean).forEach(c => body.append(c));
    }
    function end(win){
      if(E.over) return;
      E.over = true; api.store.set('save', null);
      if(closeSheet){ try{ closeSheet(); }catch(e){} }
      sc.clear();
      const score = win ? Math.max(100, Math.round([2000, 3000, 4500][E.lvl] - E.t * 3 - E.hints * 250)) : 0;
      const rep = win ? api.reportScore(score, String(E.lvl)) : null;
      api.finish({ win, score, difficulty: E.lvl, xp: win ? [30, 42, 55][E.lvl] - Math.min(15, E.hints * 5) : 8 });
      api.sound(win ? 'win' : 'lose');
      B.ui.result(root, api, {
        win, emoji: win ? '🚪' : '⏰', title: win ? 'Entkommen!' : 'Zeit abgelaufen',
        sub: win ? 'Die Tür gleitet auf – du bist frei!' + (rep && rep.isBest ? ' Neuer Rekord!' : '') : 'Das Labor hält dich fest. Versuch es nochmal!',
        lines: [['Zeit', fmt(E.t)], ['Hinweise', E.hints], ['Punkte', score], ['Rekord', api.best(String(E.lvl)) ?? '–']],
        againLabel: 'Nochmal spielen', onAgain: () => begin(E.lvl), onMenu: menu
      });
    }
    menu();
    return () => { save(); if(closeSheet){ try{ closeSheet(); }catch(e){} } sc.clear(); };
  }
});


B._brain = { SU, mmEval, wEval, wHardCheck, WORT_LIST, g48Move, g48CanMove, LOGIC, ESC_CODE, ESC_TUBES, ESC_SEQ };
})();
