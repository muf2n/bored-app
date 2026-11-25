/* BORED? – Partyspiele für EIN Handy (weitergeben). 10 Spiele, gemeinsames Spieler-Setup in BORED.store 'party.players'. */
(function(){
'use strict';
const el = BORED.el;

/* ---------- CSS ---------- */
function injectStyle(){
  if(document.getElementById('pt-style')) return;
  const css = `
.pt-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.pt-top .b-pill{font-size:13px}
.pt-name{font-family:var(--display);font-weight:800;font-size:30px;letter-spacing:.03em;text-align:center;line-height:1.15;word-break:break-word;
  background:linear-gradient(90deg,var(--cyan),var(--violet),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent}
.pt-q{font-family:var(--head);font-weight:700;font-size:26px;line-height:1.25;text-align:center;letter-spacing:.01em;text-wrap:balance}
.pt-q.sm{font-size:22px}
.pt-card{background:var(--glass);border:1px solid var(--line);border-radius:22px;padding:22px 16px;min-height:170px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:12px;text-align:center;box-shadow:0 0 26px rgba(168,85,247,.22)}
.pt-card.cyan{border-color:var(--cyan);box-shadow:var(--glow-c)}
.pt-card.pink{border-color:var(--pink);box-shadow:var(--glow-p)}
.pt-big{font-size:20px;min-height:64px}
.pt-huge{font-size:24px;min-height:84px}
.pt-pass{font-size:72px;line-height:1;filter:drop-shadow(0 0 18px rgba(0,229,255,.6))}
.pt-timer{display:flex;align-items:center;gap:10px}
.pt-timer b{font-family:var(--display);font-size:30px;min-width:64px;text-align:right;font-variant-numeric:tabular-nums;color:var(--cyan);text-shadow:var(--glow-c)}
.pt-timer.warn b{color:var(--bad);text-shadow:0 0 14px rgba(255,84,112,.7)}
.pt-timer .b-bar{flex:1;height:12px}
.pt-timer.warn .b-bar>i{background:var(--bad)}
.pt-cd{font-family:var(--display);font-weight:900;font-size:130px;line-height:1;text-align:center;color:var(--ink);
  text-shadow:0 0 30px var(--pink),0 0 60px var(--violet);animation:ptCd .9s ease-out both}
@keyframes ptCd{from{transform:scale(2.2);opacity:0}30%{opacity:1}to{transform:scale(1);opacity:1}}
.pt-rank{display:flex;flex-direction:column;gap:8px}
.pt-rank .b-item b{font-family:var(--head);font-size:18px}
.pt-rank .pt-pts{font-family:var(--display);font-size:22px;color:var(--cyan)}
.pt-pl{display:flex;gap:8px;align-items:center}
.pt-pl .b-input{flex:1}
.pt-x{width:48px;height:48px;flex:0 0 48px;border-radius:12px;background:rgba(255,84,112,.15);border:1px solid rgba(255,84,112,.4);color:var(--bad);font-size:20px}
.pt-chipline{display:flex;flex-wrap:wrap;gap:6px}
.pt-chipline span{padding:5px 11px;border-radius:99px;background:var(--glass-2);border:1px solid var(--line-2);font-family:var(--head);font-weight:600;font-size:15px}
.pt-choice{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pt-choice button{min-height:150px;border-radius:22px;font-family:var(--display);font-weight:800;font-size:22px;letter-spacing:.04em;color:#fff;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transition:transform .12s}
.pt-choice button:active{transform:scale(.95)}
.pt-choice .t{background:linear-gradient(150deg,#0077a8,var(--cyan));box-shadow:var(--glow-c);color:#04131b}
.pt-choice .d{background:linear-gradient(150deg,#b0127c,var(--pink));box-shadow:var(--glow-p)}
.pt-choice button span{font-size:44px}
.pt-split{display:flex;flex-direction:column;gap:10px;position:relative}
.pt-split button{min-height:150px;border-radius:22px;padding:18px;font-family:var(--head);font-weight:700;font-size:24px;line-height:1.2;color:#fff;
  display:flex;align-items:center;justify-content:center;text-align:center;transition:transform .12s;text-wrap:balance}
.pt-split button:active{transform:scale(.96)}
.pt-split .a{background:linear-gradient(135deg,rgba(0,229,255,.35),rgba(0,119,168,.45));border:2px solid var(--cyan);box-shadow:var(--glow-c)}
.pt-split .b{background:linear-gradient(135deg,rgba(255,54,184,.35),rgba(168,85,247,.45));border:2px solid var(--pink);box-shadow:var(--glow-p)}
.pt-or{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;width:56px;height:56px;border-radius:50%;background:var(--bg);
  border:2px solid var(--violet);box-shadow:var(--glow-v);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:900;font-size:15px}
.pt-res{border-radius:16px;padding:12px 14px;background:var(--glass-2);border:1px solid var(--line-2);display:flex;flex-direction:column;gap:6px}
.pt-res .pt-pct{font-family:var(--display);font-weight:900;font-size:30px}
.pt-res.a .pt-pct{color:var(--cyan)} .pt-res.b .pt-pct{color:var(--pink)}
.pt-res .b-bar{height:12px}
.pt-res.b .b-bar>i{background:linear-gradient(90deg,var(--violet),var(--pink))}
.pt-vote{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pt-vote button{min-height:64px;border-radius:16px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--head);font-weight:700;font-size:19px;
  display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;text-align:left;word-break:break-word}
.pt-vote button[aria-pressed="true"]{border-color:var(--cyan);background:rgba(0,229,255,.14);box-shadow:var(--glow-c)}
.pt-vote button i{font-style:normal;font-family:var(--display);font-size:22px;color:var(--pink);min-width:28px;text-align:right}
.pt-vote button:disabled{opacity:.4}
.pt-cnt{display:flex;align-items:center;gap:8px}
.pt-cnt button{width:48px;height:48px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line);font-size:22px;font-weight:800}
.pt-cnt b{font-family:var(--display);font-size:22px;min-width:40px;text-align:center}
.pt-reveal{min-height:260px;border-radius:24px;border:2px dashed var(--line);background:var(--glass);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:10px;text-align:center;padding:20px;user-select:none;-webkit-user-select:none;width:100%}
.pt-reveal.open{border-style:solid;border-color:var(--cyan);box-shadow:var(--glow-c)}
.pt-reveal.imp{border-color:var(--pink);box-shadow:var(--glow-p)}
.pt-word{font-family:var(--display);font-weight:900;font-size:36px;line-height:1.1;letter-spacing:.03em;word-break:break-word}
.pt-tabu{border-radius:22px;overflow:hidden;border:2px solid var(--violet);box-shadow:var(--glow-v)}
.pt-tabu .h{background:linear-gradient(135deg,var(--violet),var(--pink));padding:20px 12px;text-align:center;font-family:var(--display);font-weight:900;font-size:30px;letter-spacing:.03em;color:#fff;word-break:break-word}
.pt-tabu ul{list-style:none;padding:12px;display:flex;flex-direction:column;gap:6px;background:var(--glass)}
.pt-tabu li{padding:8px;text-align:center;font-family:var(--head);font-weight:700;font-size:22px;border-radius:10px;background:rgba(255,84,112,.1);color:#ffb3c1;letter-spacing:.03em}
.pt-btn3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.pt-btn3 .b-btn{min-height:68px;font-size:16px;padding:8px 6px;flex-direction:column;gap:2px}
.pt-btn3 .b-btn span{font-size:24px}
.pt-good{background:linear-gradient(135deg,#12a86b,var(--good))!important;color:#04170e!important;box-shadow:0 0 18px rgba(61,245,160,.45)!important}
.pt-letter{font-family:var(--display);font-weight:900;font-size:140px;line-height:1;text-align:center;color:var(--ink);
  text-shadow:0 0 24px var(--cyan),0 0 60px var(--violet)}
.pt-letter.spin{animation:ptSpin .08s linear infinite;color:var(--mute);text-shadow:0 0 16px var(--violet)}
@keyframes ptSpin{from{transform:translateY(-10px);opacity:.5}to{transform:translateY(10px);opacity:1}}
.pt-letter.land{animation:ptLand .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes ptLand{from{transform:scale(1.8)}to{transform:scale(1)}}
.pt-emo{font-size:62px;line-height:1.2;text-align:center;letter-spacing:4px;word-break:break-word}
.pt-opts{display:flex;flex-direction:column;gap:8px}
.pt-opts button{min-height:56px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--head);font-weight:700;font-size:19px;padding:10px 14px}
.pt-opts button.ok{border-color:var(--good);background:rgba(61,245,160,.16);color:var(--good)}
.pt-opts button.no{border-color:var(--bad);background:rgba(255,84,112,.14);color:var(--bad)}
.pt-fh{position:fixed;inset:0;z-index:90;background:var(--bg);display:flex;flex-direction:column;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.pt-fh .bar{display:flex;justify-content:space-between;align-items:center;padding:calc(12px + env(safe-area-inset-top)) 16px 8px}
.pt-fh .term{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px 18px;font-family:var(--display);font-weight:900;
  font-size:44px;line-height:1.1;letter-spacing:.02em;word-break:break-word;text-shadow:0 0 22px rgba(168,85,247,.8)}
.pt-fh .term.flip{transform:rotate(180deg)}
.pt-fh .btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px 12px calc(14px + env(safe-area-inset-bottom))}
.pt-fh .btns button{min-height:110px;border-radius:22px;font-family:var(--display);font-weight:900;font-size:22px;letter-spacing:.04em}
.pt-fh .skip{background:rgba(255,201,60,.14);border:2px solid var(--warn);color:var(--warn)}
.pt-fh .hit{background:rgba(61,245,160,.16);border:2px solid var(--good);color:var(--good);box-shadow:0 0 22px rgba(61,245,160,.4)}
.pt-fh.okflash{background:#06341f}.pt-fh.skflash{background:#33290a}
.pt-stmt{display:flex;flex-direction:column;gap:8px}
.pt-stmt button{min-height:60px;border-radius:16px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--display);font-weight:800;font-size:22px}
.pt-stmt button[aria-pressed="true"]{border-color:var(--pink);background:rgba(255,54,184,.16);box-shadow:var(--glow-p);color:#ffb3e6}
.pt-row3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.pt-row3 button{min-height:46px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);font-family:var(--display);font-weight:800;font-size:18px}
.pt-row3 button[aria-pressed="true"]{border-color:var(--pink);background:rgba(255,54,184,.18);color:#ffb3e6}
.pt-num{font-family:var(--display);font-size:28px;text-align:center;letter-spacing:.04em}
.pt-hidden{font-family:var(--display);font-size:22px;color:var(--mute);letter-spacing:.3em}
.pt-fact{font-size:15px;color:var(--ink);opacity:.9;line-height:1.45}
@media (max-height:640px){.pt-fh .term{font-size:34px}.pt-cd{font-size:100px}.pt-letter{font-size:110px}}
`;
  document.head.append(el('style', { id: 'pt-style', text: css }));
}

/* ---------- Spieler (gemeinsam für alle Partyspiele) ---------- */
const PKEY = 'party.players';
function getPlayers(){
  let p = BORED.store.get(PKEY, null);
  if(!Array.isArray(p)) p = ['Spieler 1', 'Spieler 2', 'Spieler 3'];
  p = p.map(x => String(x == null ? '' : x).trim().slice(0, 16)).filter(Boolean);
  // doppelte Namen eindeutig machen
  const seen = {};
  return p.slice(0, 10).map(n => { if(seen[n]){ seen[n]++; return n + ' ' + seen[n]; } seen[n] = 1; return n; });
}
function savePlayers(p){ BORED.store.set(PKEY, p); }

function editPlayers(api, onDone){
  let list = getPlayers();
  if(!list.length) list = ['Spieler 1', 'Spieler 2'];
  BORED.sheet(close => {
    const box = el('div', { class: 'b-stack tight' });
    const addBtn = el('button', { class: 'b-btn ghost block', text: '+ Spieler hinzufügen' });
    const render = (focusLast) => {
      box.innerHTML = '';
      list.forEach((n, i) => {
        const inp = el('input', { class: 'b-input', maxlength: '16', placeholder: 'Name ' + (i + 1), 'aria-label': 'Name Spieler ' + (i + 1) });
        inp.value = n;
        inp.addEventListener('input', () => { list[i] = inp.value; });
        const x = el('button', { class: 'pt-x', 'aria-label': 'Entfernen', text: '✕', onclick: () => {
          if(list.length <= 1){ api.toast('Mindestens 1 Spieler'); return; }
          list.splice(i, 1); api.sound('pop'); render();
        } });
        box.append(el('div', { class: 'pt-pl' }, [inp, x]));
        if(focusLast && i === list.length - 1) setTimeout(() => inp.focus(), 50);
      });
      addBtn.disabled = list.length >= 10;
      addBtn.textContent = list.length >= 10 ? 'Maximal 10 Spieler' : '+ Spieler hinzufügen';
    };
    addBtn.onclick = () => { if(list.length >= 10) return; list.push(''); api.sound('click'); render(true); };
    render();
    const done = () => { api.sound('good'); close(); };
    return el('div', { class: 'b-stack' }, [
      el('div', { class: 'b-kicker', text: 'Wer spielt mit?' }),
      el('h3', { class: 'b-title', text: '👥 Spieler' }),
      el('p', { class: 'b-hint', text: 'Namen eingeben – gilt für alle Partyspiele. 2 bis 10 Leute, ein Handy.' }),
      box, addBtn,
      el('button', { class: 'b-btn block', text: '✓ Fertig', onclick: done })
    ]);
  }, { onClose: () => {
    const clean = list.map(s => String(s).trim().slice(0, 16)).filter(Boolean);
    savePlayers(clean.length ? clean : ['Spieler 1']);
    onDone && onDone();
  } });
}

function playersCard(api, min){
  const wrap = el('div', { class: 'b-card' });
  const render = () => {
    const p = getPlayers();
    wrap.innerHTML = '';
    wrap.append(
      el('div', { class: 'b-between', style: { marginBottom: '8px' } }, [
        el('span', { class: 'b-label', style: { margin: 0 }, text: '👥 Spieler (' + p.length + ')' }),
        el('button', { class: 'b-btn sm ghost', text: '✏️ Bearbeiten', onclick: () => { api.sound('click'); editPlayers(api, render); } })
      ]),
      el('div', { class: 'pt-chipline' }, p.map(n => el('span', { text: n }))),
      p.length < min ? el('p', { class: 'b-hint', style: { color: 'var(--warn)', marginTop: '8px' }, text: 'Für dieses Spiel braucht ihr mindestens ' + min + ' Spieler.' }) : ''
    );
  };
  render();
  return wrap;
}

/* ---------- Zeit-Verwaltung pro Spiel (alles wird beim Verlassen aufgeräumt) ---------- */
function mkCtx(){
  const ts = new Set(), is = new Set(), extra = new Set();
  let dead = false;
  return {
    to(fn, ms){ const t = setTimeout(() => { ts.delete(t); if(!dead) fn(); }, ms); ts.add(t); return t; },
    iv(fn, ms){ const t = setInterval(() => { if(!dead) fn(); }, ms); is.add(t); return t; },
    stop(t){ clearTimeout(t); clearInterval(t); ts.delete(t); is.delete(t); },
    clear(){ ts.forEach(clearTimeout); is.forEach(clearInterval); ts.clear(); is.clear(); extra.forEach(f => { try{ f(); }catch(e){} }); extra.clear(); },
    onClear(fn){ extra.add(fn); },
    kill(){ dead = true; this.clear(); },
    get dead(){ return dead; }
  };
}

/* Timer-Leiste: gibt {node, stop, add(s), left()} zurück */
function timer(ctx, api, secs, onEnd, opts = {}){
  let left = secs, total = secs, paused = false, done = false;
  const b = el('b', { text: fmt(left) }), fill = el('i');
  const node = el('div', { class: 'pt-timer', role: 'timer' }, [el('div', { class: 'b-bar' }, [fill]), b]);
  function fmt(s){ return s >= 60 ? Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') : String(s); }
  const paint = () => { b.textContent = fmt(left); fill.style.width = (left / total * 100) + '%'; node.classList.toggle('warn', left <= (opts.warn || 10)); };
  paint();
  const id = ctx.iv(() => {
    if(paused || done) return;
    left--; paint();
    if(left <= 5 && left > 0) api.sound('tick');
    if(left <= 0){ done = true; ctx.stop(id); api.sound('bad'); api.vibrate(300); onEnd && onEnd(); }
  }, 1000);
  return {
    node,
    stop(){ done = true; ctx.stop(id); },
    pause(v){ paused = v; },
    add(s){ left = Math.max(1, left + s); total = Math.max(total, left); paint(); },
    left: () => left
  };
}

/* 3-2-1-Countdown in einem Container, dann done() */
function countdown(ctx, api, holder, label, done, from = 3){
  let n = from;
  const step = () => {
    holder.innerHTML = '';
    if(n > 0){
      holder.append(el('div', { class: 'b-center', style: { minHeight: '260px' } }, [
        el('div', { class: 'pt-cd', text: String(n) }), label ? el('p', { class: 'b-h', text: label }) : null
      ]));
      api.sound('tick'); api.vibrate(30); n--; ctx.to(step, 850);
    }else{
      holder.append(el('div', { class: 'b-center', style: { minHeight: '260px' } }, [el('div', { class: 'pt-cd', style: { fontSize: '84px' }, text: 'LOS!' })]));
      api.sound('check'); api.vibrate(80); ctx.to(done, 600);
    }
  };
  step();
}

function screen(root, kids){
  root.innerHTML = '';
  const s = el('div', { class: 'b-stack b-pop' }, kids);
  root.append(s); root.scrollTop = 0;
  return s;
}

/* Eigener Bestätigungsdialog (BORED.confirm löst beim OK-Klick über onClose zuerst mit false auf) */
function ask(api, text, okLabel, cancelLabel, onOk){
  api.sheet(close => el('div', { class: 'b-stack' }, [
    el('p', { class: 'b-h', text }),
    el('div', { class: 'b-grid2' }, [
      el('button', { class: 'b-btn ghost', text: cancelLabel, onclick: () => { api.sound('click'); close(); } }),
      el('button', { class: 'b-btn', text: okLabel, onclick: () => { close(); onOk(); } })
    ])
  ]));
}

/* Kopfzeile im Spiel: links Info-Pille, rechts Punktestand/Beenden */
function topBar(api, info, onScores, onEnd){
  return el('div', { class: 'pt-top' }, [
    el('span', { class: 'b-pill cyan', text: info }),
    el('div', { class: 'b-row', style: { gap: '6px' } }, [
      onScores ? el('button', { class: 'b-btn sm ghost', text: '🏆', 'aria-label': 'Punktestand', onclick: () => { api.sound('click'); onScores(); } }) : null,
      onEnd ? el('button', { class: 'b-btn sm ghost', text: 'Beenden', onclick: () => { api.sound('click'); ask(api, 'Spiel jetzt beenden und Ergebnis zeigen?', 'Beenden', 'Weiterspielen', onEnd); } }) : null
    ])
  ]);
}

function rankList(scores, unit = 'Pkt'){
  const arr = Object.keys(scores).map(n => [n, scores[n]]).sort((a, b) => b[1] - a[1]);
  const medals = ['🥇', '🥈', '🥉'];
  let place = 0, prev = null;
  return el('div', { class: 'pt-rank' }, arr.map(([n, s], i) => {
    if(s !== prev){ place = i; prev = s; }
    return el('div', { class: 'b-item' }, [
      el('div', { class: 'ic', text: medals[place] || String(place + 1) }),
      el('div', { class: 'tx' }, [el('b', { text: n })]),
      el('span', { class: 'pt-pts', text: s + (unit ? ' ' + unit : '') })
    ]);
  }));
}
function showScores(api, scores, title = 'Punktestand', unit){
  BORED.sheet(close => el('div', { class: 'b-stack' }, [
    el('h3', { class: 'b-title', text: '🏆 ' + title }), rankList(scores, unit),
    el('button', { class: 'b-btn block', text: 'Weiter', onclick: close })
  ]));
}
function leaders(scores){
  const max = Math.max(...Object.values(scores));
  return { max, names: Object.keys(scores).filter(n => scores[n] === max) };
}

/* Spielende: XP vergeben + Ergebnisbildschirm mit Rangliste */
function endScreen(root, api, opt){
  if(opt.ctx) opt.ctx.clear();
  const scores = opt.scores || {};
  const hasScores = Object.keys(scores).length > 0;
  const L = hasScores ? leaders(scores) : { max: 0, names: [] };
  if(hasScores && opt.bestKey !== false) api.reportScore(L.max, opt.bestKey != null ? String(opt.bestKey) : '0');
  api.finish({ win: null, score: hasScores ? L.max : null, xp: opt.xp || 20 });
  api.sound('win');
  let title = opt.title;
  if(!title){
    if(!hasScores || L.max <= 0) title = 'Fertig gespielt!';
    else if(L.names.length === 1) title = L.names[0] + ' gewinnt!';
    else title = 'Gleichstand!';
  }
  BORED.ui.result(root, api, {
    win: null, emoji: opt.emoji || '🎉', title,
    sub: opt.sub || (hasScores && L.names.length > 1 && L.max > 0 ? L.names.join(' & ') + ' teilen sich Platz 1.' : ''),
    lines: opt.lines || [],
    onAgain: opt.onAgain, onMenu: opt.onMenu
  });
  const st = root.firstChild;
  if(st && hasScores){
    const card = el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: opt.rankTitle || 'Rangliste' }), rankList(scores, opt.unit)]);
    st.insertBefore(card, st.children[1] || null);
  }
  if(st && opt.extra) st.insertBefore(opt.extra, st.children[2] || null);
  if(hasScores && L.max > 0) api.confetti();
}

function passScreen(root, api, name, text, onGo, btnLabel){
  screen(root, [
    el('div', { class: 'pt-card cyan', style: { minHeight: '320px' } }, [
      el('div', { class: 'pt-pass', text: '📱' }),
      el('div', { class: 'b-kicker', text: 'Gib das Handy an' }),
      el('div', { class: 'pt-name', text: name }),
      text ? el('p', { class: 'b-hint', text }) : null
    ]),
    el('button', { class: 'b-btn block pt-huge', text: btnLabel || ('Ich bin ' + name + ' ✓'), onclick: () => { api.sound('click'); onGo(); } })
  ]);
}

/* Startbildschirm für alle Partyspiele */
function partyStart(root, api, opt){
  const min = opt.min || 2;
  BORED.ui.start(root, api, {
    levels: opt.levels || null,
    modes: opt.modes,
    bestLabel: opt.bestLabel || 'Rekord',
    bestKey: opt.bestKey,
    extra: el('div', { class: 'b-stack tight' }, [opt.solo ? null : playersCard(api, min), opt.extra || null]),
    startLabel: opt.startLabel || '▶ Los geht’s',
    onStart(level, mode){
      const p = getPlayers();
      if(!opt.solo && p.length < min){ api.toast('Ihr braucht mindestens ' + min + ' Spieler'); editPlayers(api, () => partyStart(root, api, opt)); return; }
      opt.onStart(level, mode, p);
    }
  });
}

/* Hilfen */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function zeroScores(players){ const s = {}; players.forEach(p => s[p] = 0); return s; }
/* Ziehstapel ohne Wiederholung (bis alles einmal dran war), merkt sich gesehene Karten pro Spiel */
function deck(api, key, items){
  let seen = api.store.get('seen.' + key, []);
  if(!Array.isArray(seen)) seen = [];
  let pool = [];
  const refill = () => {
    const s = new Set(seen);
    pool = api.shuffle(items.map((_, i) => i).filter(i => !s.has(i)));
    if(!pool.length){ seen = []; pool = api.shuffle(items.map((_, i) => i)); }
  };
  refill();
  return {
    next(){
      if(!pool.length) refill();
      const i = pool.pop(); seen.push(i);
      if(seen.length > items.length) seen = seen.slice(-items.length);
      api.store.set('seen.' + key, seen);
      return items[i];
    },
    size: items.length
  };
}

/* =====================================================================
   1) WAHRHEIT ODER PFLICHT
   ===================================================================== */
const TD = {
  t: [
    [ // Chillig – Wahrheit
      'Was ist dein Lieblingsessen – und was magst du überhaupt nicht?', 'Welches Spiel hast du zuletzt so richtig gesuchtet?', 'Wenn du ein Tier sein könntest, welches wärst du?',
      'Was war dein Lieblingsspielzeug als Kind?', 'Welche Serie würdest du sofort nochmal von vorne schauen?', 'Was ist das Nervigste, das deine Eltern ständig sagen?',
      'Welche Superkraft hättest du gern – und warum?', 'Wohin würdest du sofort reisen, wenn Geld egal wäre?', 'Was ist gerade dein Lieblingslied?',
      'Was regt dich im Alltag am meisten auf?', 'Was war der beste Tag deines Lebens bisher?', 'Welche App öffnest du am öftesten?',
      'Was würdest du mit einer Million Euro als Erstes machen?', 'Bist du eher Frühaufsteher oder Langschläfer?', 'Was ist deine Lieblingsjahreszeit und warum?',
      'Welchen Beruf wolltest du als Kind unbedingt haben?', 'Was ist das Komischste, das du je gegessen hast?', 'Bei welchem Film hast du geweint?',
      'Hast du ein verstecktes Talent? Welches?', 'Welches Emoji benutzt du am meisten?', 'Was ist deine Lieblingssüßigkeit?',
      'Wovor hattest du als Kind Angst?', 'Was ist dein Traumauto?', 'Pizza mit Ananas – ja oder nein? Begründe!',
      'Was war dein erstes Handy?', 'Welche drei Dinge nimmst du auf eine einsame Insel mit?', 'Wer ist dein Lieblings-YouTuber oder -Streamer?',
      'Was ist das beste Geschenk, das du je bekommen hast?', 'Welche Sprache würdest du gern sofort fließend sprechen?', 'Was machst du am liebsten an einem freien Sonntag?',
      'Was war dein schlimmster Haarschnitt?', 'Welches Schulfach magst du am liebsten?', 'Welches Lied kannst du komplett auswendig?',
      'Hund oder Katze – und warum?', 'Was ist dein Lieblingsgericht von Oma oder Opa?', 'Was ist das Mutigste, das du je gemacht hast?',
      'Welche Figur aus einem Film oder Spiel wärst du gern?', 'Was ist dein absolutes Wohlfühl-Essen?', 'Was sammelst du – oder hast du früher gesammelt?',
      'Welche Gewohnheit würdest du gern loswerden?', 'Was ist das Coolste, das du je live gesehen hast?', 'Welches Spiel hast du als Kind am meisten gespielt?',
      'Wenn dein Leben ein Film wäre – welches Genre?', 'Welche Erfindung findest du am genialsten?', 'Was machst du am liebsten bei Regenwetter?',
      'Hast du schon mal einen Promi getroffen? Wen?', 'Was war dein lustigster Moment dieses Jahr?', 'Was isst du am liebsten zum Frühstück?',
      'Welcher Ort in Österreich gefällt dir am besten?', 'Welches Haustier hättest du gern, wenn alles erlaubt wäre?', 'Was ist dein Lieblingswort?',
      'Mit welchem Spielcharakter würdest du gern einen Tag tauschen?', 'Was ist der beste Rat, den du je bekommen hast?', 'Welches Essen könntest du jeden Tag essen?',
      'Wie sieht dein perfekter Geburtstag aus?', 'Über welches Video hast du zuletzt richtig gelacht?', 'Welchen Weltrekord würdest du gern aufstellen?',
      'Was ist dein Lieblingsfeiertag?', 'Was würdest du erfinden, wenn du könntest?', 'Was ist dein Lieblings-Meme?',
      'Welche Zeit in der Geschichte würdest du gern einen Tag besuchen?', 'Sommer am See oder Winter auf der Piste?'
    ],
    [ // Mutig – Wahrheit
      'Was ist das Peinlichste, das dir in der Schule passiert ist?', 'Wann hast du zuletzt geweint – und warum?', 'Was ist die größte Lüge, die du deinen Eltern je erzählt hast?',
      'Wen hier aus der Runde würdest du auf eine einsame Insel mitnehmen?', 'Was ist deine schlechteste Eigenschaft?', 'Hast du schon mal bei einem Test geschummelt?',
      'Was war dein peinlichster Moment im Internet?', 'Welche Nachricht bereust du, geschickt zu haben?', 'Was ist dein heimlicher Guilty-Pleasure-Song?',
      'Was war dein erster Eindruck von der Person links von dir?', 'Wovor hast du heute noch Angst?', 'Wessen Profil hast du zuletzt komplett durchgescrollt?',
      'Was ist das Teuerste, das du je kaputt gemacht hast?', 'Welches Geheimnis hast du lange gehütet, das du jetzt verraten kannst?', 'Was googelst du heimlich?',
      'Was war die dümmste Ausrede, die du je benutzt hast?', 'Welche Gewohnheit von dir findest du selbst peinlich?', 'Wem hier würdest du dein entsperrtes Handy für 5 Minuten geben?',
      'Hast du schon mal so getan, als wärst du krank, um dich vor etwas zu drücken?', 'Wie viele Stunden Bildschirmzeit hattest du gestern? Zeig es!', 'Was ist dein peinlichster Spitzname?',
      'Bist du gerade verknallt? (Ja oder Nein reicht!)', 'Welcher Promi ist dein Crush?', 'Hast du schon mal ein Geschenk weiterverschenkt?',
      'Was ist das Schlimmste, das du je zu jemandem gesagt hast – tut es dir leid?', 'Hast du heute in diesem Spiel schon geflunkert? 😉', 'Was magst du an der Person rechts von dir am meisten?',
      'Hast du schon mal so getan, als hättest du eine Nachricht nicht gesehen?', 'Was war dein peinlichster Fail beim Sport?', 'Welchen Song hörst du heimlich in Dauerschleife?',
      'Was ist das Kindischste, das du immer noch machst?', 'Welches Foto von dir würdest du sofort löschen, wenn du könntest?', 'Wovon träumst du heimlich?',
      'Wen würdest du um 3 Uhr nachts anrufen, wenn du Hilfe brauchst?', 'Was ist das Peinlichste in deinem Suchverlauf (jugendfrei!)?', 'Hast du schon mal eine Liebesnachricht geschrieben und nie abgeschickt?',
      'Wann warst du zuletzt richtig eifersüchtig?', 'Was ist deine unbeliebteste Meinung?', 'Hast du schon mal jemanden geghostet?',
      'Was würden deine Lehrer ehrlich über dich sagen?', 'Welches Kompliment hat dich am meisten gefreut?', 'Bei welchem Film hast du dich so gegruselt, dass du nicht schlafen konntest?',
      'Hast du schon mal absichtlich einen Streit angefangen?', 'Was ist dein größter Fehlkauf?', 'Was würdest du an dir ändern, wenn du könntest?',
      'Hast du Angst im Dunkeln? Ehrlich!', 'Wer hier bringt dich am meisten zum Lachen?', 'Was hast du zuletzt heimlich gegessen, das eigentlich für jemand anderen war?',
      'Hast du schon mal Tagebuch geschrieben? Was stand drin?', 'Welche Freundschaft vermisst du?', 'Was war deine peinlichste Phase (Style, Musik, Frisur)?',
      'Wen aus der Runde nimmst du ins Battle-Royale-Team – und wen nie?', 'Aus welchem kindischen Grund warst du zuletzt beleidigt?', 'Hast du schon mal ein Spiel abgebrochen, nur weil du verloren hast?',
      'Bei welchem Talent tust du so, als hättest du es?', 'Was machst du nachts, wenn keiner zuschaut?', 'Wen hast du zuletzt angelogen – und worüber?',
      'Was würde dein bester Freund oder deine beste Freundin über dich verraten?', 'Welches Gerücht über dich stimmt eigentlich?', 'Was war das peinlichste Treffen, das du je hattest?'
    ],
    [ // Wild – Wahrheit (peinlich-lustig, aber harmlos)
      'Was ist das Peinlichste, das deine Eltern je über dich erzählt haben?', 'Hast du schon mal gepupst und es jemand anderem in die Schuhe geschoben?', 'Hast du schon mal mit dir selbst im Spiegel geredet? Worüber?',
      'Hast du als Kind mal einen Popel gegessen? Ehrlich!', 'Was ist das Seltsamste, das du je unter der Dusche gesungen hast?', 'Hast du schon mal zurückgewunken, obwohl gar nicht du gemeint warst?',
      'Was war dein peinlichstes Autokorrektur-Fail?', 'Hast du schon mal heimlich vom Essen von jemandem genascht?', 'Welches Kuscheltier hast du noch immer – und wie heißt es?',
      'Hast du schon mal vor dem Spiegel eine Dankesrede geübt?', 'Was ist das Ekligste, das du je freiwillig gegessen hast?', 'Was war dein peinlichster Moment im Schwimmbad?',
      'Wie lange warst du maximal ohne Duschen?', 'Was ist die peinlichste Musik auf deinem Handy?', 'Hast du schon mal eine Lehrkraft mit „Mama“ oder „Papa“ angesprochen?',
      'Was ist der peinlichste Name, den du je einem Kuscheltier oder Haustier gegeben hast?', 'Hast du schon mal ein Telefonat vorgetäuscht, um jemandem auszuweichen?', 'Was ist das Peinlichste, das dir je in einem Videocall passiert ist?',
      'Bist du schon mal gegen eine Glastür gelaufen?', 'Hast du schon mal nach dem Klo die Hände nicht gewaschen? Ehrlich!', 'Beschreib dein peinlichstes Kinderfoto ganz genau.',
      'Wie viele Tage hintereinander hast du schon dieselben Socken getragen?', 'Was hast du laut gesagt, weil du dachtest, du bist allein – und warst es nicht?', 'Redest du manchmal noch mit Kuscheltieren?',
      'Vor welcher kindischen Sache hast du immer noch Angst?', 'Hast du schon mal an deiner Achsel gerochen, um zu checken, ob du stinkst?', 'Was machst du, wenn du sicher bist, dass dich niemand sieht?',
      'Bist du schon mal im Unterricht eingeschlafen? Was ist passiert?', 'Was war dein peinlichster Versprecher?', 'Welches Lied hast du jahrelang falsch mitgesungen?',
      'Hast du schon mal etwas vom Boden gegessen – nach mehr als 5 Sekunden?', 'Hast du schon mal so getan, als würdest du jemanden kennen, obwohl du keine Ahnung hattest?', 'Was ist das Komischste, das du je gegoogelt hast?',
      'Hast du schon mal wegen eines Videospiels geweint?', 'Hast du schon mal in der Öffentlichkeit laut gefurzt? Wo?', 'Was ist das Peinlichste, das du je in einen Gruppenchat geschickt hast?',
      'Hast du einen Liebesfilm heimlich genossen und es dann geleugnet?', 'Was war dein lächerlichster Wutanfall?', 'Bist du schon mal mit offenem Hosenstall herumgelaufen? Wie lange?',
      'Hat dich schon mal jemand beim Nasenbohren erwischt?', 'Was ist das Seltsamste, das in deinem Zimmer versteckt ist?', 'Hast du schon mal so laut gesungen, dass sich jemand beschwert hat?',
      'Was war der peinlichste Sturz deines Lebens?', 'Wann hast du zuletzt einen ganzen Tag im Pyjama verbracht?', 'In welche Zeichentrickfigur warst du als Kind verknallt?',
      'Hast du schon mal deinen eigenen Namen gegoogelt? Was kam raus?', 'Hast du schon mal einen Brief an dein zukünftiges Ich geschrieben? Was stand drin?', 'Hast du schon mal so getan, als würdest du einen Witz verstehen?',
      'Was ist dein seltsamster Essens-Mix (z. B. Pommes in Eis)?', 'Was war deine peinlichste Reaktion auf eine Überraschung?', 'Hast du schon mal eine Sprachnachricht an die falsche Person geschickt?',
      'Hast du dich schon mal versteckt, weil du eine Lehrkraft im Supermarkt gesehen hast?', 'Was ist die lächerlichste Ausrede für dein Zuspätkommen?', 'Welche Kindersendung schaust du heimlich immer noch?',
      'Was ist das Peinlichste, das du je zu deinem Crush gesagt hast?', 'Was war dein schlimmster Blackout bei einem Referat?', 'Hast du schon mal einen Tanz im Zimmer einstudiert? Zeig 5 Sekunden davon!',
      'Was ist das Lustigste, das dir je auf einem Klo passiert ist?', 'Wann hast du zuletzt im Schlaf gesabbert?', 'Welche TV-Sendung würdest du nie zugeben zu schauen?'
    ]
  ],
  d: [
    [ // Chillig – Pflicht
      'Mach 10 Hampelmänner.', 'Sag das Alphabet rückwärts – so weit du kommst.', 'Sprich bis zu deinem nächsten Zug mit Roboterstimme.',
      'Mach ein Tiergeräusch – die anderen raten das Tier.', 'Erzähl einen Witz. Lacht keiner, gleich noch einen.', 'Steh 30 Sekunden auf einem Bein.',
      'Zeichne mit geschlossenen Augen ein Haus und zeig es allen.', 'Mach 5 Liegestütze oder 10 Kniebeugen.', 'Sag dreimal schnell: „Fischers Fritz fischt frische Fische.“',
      'Spiel eine Lehrkraft nach (ohne Namen) – die anderen raten das Fach.', 'Nenne in 10 Sekunden 5 Automarken.', 'Sing den Refrain deines Lieblingslieds.',
      'Mach 20 Sekunden lang einen Roboter-Tanz.', 'Sprich bis zu deinem nächsten Zug mit britischem Akzent.', 'Mach dein bestes Grimassen-Gesicht und halte es 10 Sekunden.',
      'Erzähl eine Geschichte über einen Toaster – in genau drei Sätzen.', 'Zähl auf Englisch von 20 rückwärts bis 1.', 'Halte 20 Sekunden die Plank-Position.',
      'Die Gruppe gibt dir ein Wort – finde 3 Reime darauf.', 'Spiel Nachrichtensprecher und verkünde eine lustige erfundene Meldung.', 'Nenne in 15 Sekunden 5 Länder mit S.',
      'Mach den Moonwalk einmal quer durchs Zimmer.', 'Spiel 15 Sekunden Luftgitarre mit vollem Einsatz.', 'Sag „Ich liebe Brokkoli“ in drei verschiedenen Gefühlen.',
      'Pantomime: Du kochst Spaghetti.', 'Mach jedem in der Runde ein ehrliches Kompliment.', 'Versuch, 10 Sekunden lang nicht zu blinzeln.',
      'Summ ein Lied – die anderen erraten es.', 'Mach deine beste Kung-Fu-Pose und halte sie 10 Sekunden.', 'Sag 10 Sekunden lang nur Wörter mit B.',
      'Erfinde einen Werbespruch für Socken.', 'Mach 10 Kniebeugen und zähl dabei auf Italienisch (oder versuch es).', 'Stell deinen Lieblingssport pantomimisch dar – die anderen raten.',
      'Stell dich als Superheld vor: Name, Kostüm, Superkraft.', 'Tausch für eine Runde den Platz mit der Person links von dir.', 'Bilde einen Satz, in dem jedes Wort mit demselben Buchstaben beginnt.',
      'Mach das Geräusch eines startenden Flugzeugs.', 'Nenne in 10 Sekunden 7 Obstsorten.', 'Halte 30 Sekunden lang die Arme seitlich ausgestreckt.',
      'Erzähl deinen heutigen Tag wie einen spannenden Kinotrailer.', 'Zeichne mit dem Finger ein Tier in die Luft – die anderen raten.', 'Versuch, mit der Zunge deine Nase zu berühren.',
      'Sing „Alle meine Entchen“ als Rap.', 'Zeig drei Gefühle nur mit dem Gesicht – die anderen raten.', 'Die Gruppe nennt ein Emoji – stell es pantomimisch dar.',
      'Buchstabiere deinen vollen Namen rückwärts.', 'Sprich bis zu deinem nächsten Zug wie ein Pirat.', 'Mach eine 15-Sekunden-Wetteransage für morgen – mit Gesten.',
      'Nenne in 10 Sekunden 5 Pokémon.', 'Berühre mit gestreckten Beinen deine Zehen und halte 10 Sekunden.', 'Lach wie ein fieser Bösewicht.',
      'Erfinde ein neues Wort und erklär, was es bedeutet.', 'Dichte einen netten Vierzeiler über die Person links von dir.', 'Schau der Person gegenüber 20 Sekunden in die Augen, ohne zu lachen.',
      'Mach 10 Sekunden den Ententanz.', 'Nenne in 10 Sekunden 5 Dinge, die rot sind.', 'Hüpf 10-mal auf einem Bein.',
      'Verkauf der Gruppe einen Gegenstand in deiner Nähe – du hast 20 Sekunden.', 'Rede 30 Sekunden über dein Lieblingsessen, ohne „ähm“ zu sagen.', 'Zeitlupen-Pantomime: Du stolperst über einen Stein.'
    ],
    [ // Mutig – Pflicht
      'Zeig der Gruppe deinen letzten Screenshot (oder nimm einen Joker).', 'Zeig dein zuletzt benutztes Emoji und erklär, warum.', 'Lies deine letzte gesendete Nachricht laut vor (oder nimm einen Joker).',
      'Sing 20 Sekunden ein Lied, das die Gruppe aussucht.', 'Tanz 20 Sekunden einen aktuellen Tanz-Trend.', 'Rede die nächsten 3 Runden über dich nur in der dritten Person.',
      'Halte eine 30-Sekunden-Rede, warum Socken die beste Erfindung sind.', 'Sing „Happy Birthday“ als Oper.', 'Imitiere jede Person in der Runde mit einem Satz (freundlich!).',
      'Erzähl einen peinlichen Moment aus deiner Kindheit.', 'Die Gruppe sucht für heute dein Sperrbildschirm-Bild aus deinen eigenen Fotos aus.', 'Lauf 30 Sekunden wie auf einem Laufsteg durch den Raum.',
      'Mach 15 Liegestütze oder 25 Kniebeugen.', 'Rede 30 Sekunden mit einem Gegenstand, als wäre er dein bester Freund.', 'Sag das Alphabet und mach bei jedem Buchstaben eine neue Pose.',
      'Erzähl der Gruppe deinen seltsamsten Traum.', 'Seifenoper-Szene: Du hast gerade erfahren, dass die Chips leer sind.', 'Beatbox 20 Sekunden lang.',
      'Die Gruppe gibt dir ein Thema – rappe 4 Zeilen dazu.', 'Spiel ein Baby, das sein Lieblingsspielzeug verloren hat.', 'Sprich eine Minute lang nur in Fragen.',
      'Halte 45 Sekunden die Plank-Position.', 'Sing 10 Sekunden aus dem letzten Lied, das du gehört hast.', 'Macht ein Gruppenfoto, bei dem alle dein Lieblingsemoji nachstellen.',
      'Zeig der Gruppe deine meistgenutzte App laut Bildschirmzeit.', 'Erfinde ein Lied über die Person links von dir (nett!) und sing es.', 'Spiel einen Influencer, der ein total langweiliges Produkt bewirbt.',
      'Fake-Lachanfall – so lange, bis jemand mitlacht.', 'Tanz wie ein Roboter, dem langsam der Akku ausgeht.', 'Die Gruppe erfindet eine Begrüßung, die du bis Spielende benutzen musst.',
      'Sprich bis zu deinem nächsten Zug mit einem Akzent – die Gruppe rät welchen.', 'Mach deinen lautesten Tarzan-Schrei (Nachbarn beachten 😉).', 'Erzähl einen Witz so schlecht wie möglich.',
      'Spiel deinen größten Gaming-Rage-Moment nach.', 'Lass dich eine Minute interviewen – du musst alles beantworten (jugendfrei).', 'Kommentier wie ein Sportreporter, was die Person rechts gerade macht.',
      'Schreib mit geschlossenen Augen einen Satz, den die Gruppe vorgibt, und zeig das Ergebnis.', 'Halte eine Yoga-Pose deiner Wahl 30 Sekunden.', 'Jemand schreibt dir ein Wort mit dem Finger auf den Rücken – errate es.',
      'Mach eine Minute lang alles in Zeitlupe.', 'Sag jedem in der Runde, was du an ihm oder ihr magst.', 'Spiel ein berühmtes Filmzitat nach – die Gruppe rät den Film.',
      'Pack ein unsichtbares Paket aus – mit maximaler Begeisterung.', 'Nenne alle 9 österreichischen Bundesländer in 15 Sekunden.', 'Erzähl deinen Lieblingsfilm in 30 Sekunden – ohne Namen.',
      'Spiel 15 Sekunden einen Hund, der unbedingt Gassi gehen will.', 'Beende jeden Satz bis zu deinem nächsten Zug mit „… sagte der Pinguin.“', 'Die Person links sucht ein Wort aus, das du in jedem Satz benutzen musst.',
      'Mach den Ententanz komplett mit Gesang.', 'Erklär wie ein Professor, wie man ein Butterbrot schmiert.', 'Versuch 30 Sekunden mit Socken zu jonglieren.',
      'Halte eine Dankesrede, als hättest du gerade einen Oscar gewonnen.', 'Halte ein Kissen wie ein Baby und sing ihm ein Schlaflied.', 'Spiel einen Zombie, der Lust auf Kakao hat – bis jemand lacht.',
      'Mach 20 Hampelmänner und sing dabei.', 'Sag 30 Sekunden nur „Banane“ – in verschiedenen Gefühlen.', 'Die Gruppe wählt ein Tier – du bewegst dich bis zu deinem nächsten Zug wie dieses Tier.',
      'Zeig der Gruppe das älteste Foto in deiner Galerie (oder nimm einen Joker).', 'Mach drei verschiedene Lacher: Hexe, Weihnachtsmann, Bösewicht.', 'Erzähl die Geschichte von Rotkäppchen in 30 Sekunden als Actionfilm.'
    ],
    [ // Wild – Pflicht (peinlich-lustig, aber harmlos)
      'Sing den Refrain eines Kinderlieds im Opernstil.', 'Tanz 30 Sekunden ohne Musik, als wärst du der Star eines Musikvideos.', 'Rede bis zu deinem nächsten Zug wie ein Baby.',
      'Mach eine dramatische Liebeserklärung an dein Lieblingsessen.', 'Spiel ein Huhn, das gerade ein Ei gelegt hat.', 'Die Gruppe sagt dir ein Wort – sing es zu einer Schlager-Melodie.',
      'Mach einen 30-Sekunden-Werbespot für Klopapier.', 'Lauf wie ein Model durchs Zimmer und posiere am Ende dramatisch.', 'Mach die Grimasse, die die Gruppe vorgibt, und halte sie 20 Sekunden.',
      'Telefonier 30 Sekunden mit einer Banane (oder einem anderen Gegenstand).', 'Erzähl eine dramatische Liebesgeschichte zwischen zwei Gegenständen im Raum.', 'Brüll wie ein Dinosaurier – mit vollem Körpereinsatz.',
      'Tanz die Macarena komplett – mit Gesang.', 'Lass dir mit abwaschbarem Stift einen Schnurrbart malen – nur wenn du willst, sonst Joker.', 'Spiel einen Affen, der zum ersten Mal ein Handy sieht.',
      'Sing alles, was du sagst, bis du wieder dran bist.', 'Spiel eine Seifenoper-Szene mit dir selbst als Zwilling.', 'Rappe das Alphabet.',
      'Mach 30 Sekunden Aerobic wie in den 80ern.', 'Gib eine Pressekonferenz: Du bist Weltmeister im Nichtstun.', 'Spiel 20 Sekunden eine Katze, die etwas vom Tisch schubsen will.',
      'Mach 20 Sekunden Bodybuilder-Posen – mit Geräuschen.', 'Sprich bis zu deinem nächsten Zug nur in Reimen.', 'Spiel Fernsehkoch und bereite ein unsichtbares Gericht zu.',
      'Mach einem Sessel einen romantischen Heiratsantrag.', 'Mach 10 Sekunden lang Delfin-Geräusche.', 'Zieh Socken über die Hände und spiel ein Puppentheater.',
      'Tanz wie dein Opa oder deine Oma auf einer Hochzeit.', 'Spiel Navi-Stimme und lotse jemanden zum Kühlschrank.', 'Erzähl, wie dein Tag war – als würdest du gleich weinen.',
      'Kommentier eine unsichtbare Fliege im Zimmer wie ein Fußballspiel.', 'Die Gruppe gibt dir einen neuen Namen – alle nennen dich so bis Spielende.', 'Mach ein Wrestling-Einlauf-Intro für dich selbst.',
      'Sing der Person rechts mit voller Hingabe „Happy Birthday“ – auch wenn sie nicht Geburtstag hat.', 'Mach 10 Sekunden Ballett-Drehungen.', 'Lies einen Text von einer Verpackung vor, als wäre er ein Liebesgedicht.',
      'Sei eine Statue: Die Gruppe darf dich sanft in eine Pose bringen.', 'Watschel wie ein Pinguin einmal durch den Raum.', 'Spiel ein Alien, das zum ersten Mal Pizza isst.',
      'Rede 30 Sekunden mit Quietschestimme.', 'Erfinde den Tanz „Der Kühlschrank“ und bring ihn allen bei.', 'Sing ein Musical-Lied darüber, wie du heute aufgestanden bist.',
      'Spiel einen Ritter, der Angst vor einer Spinne hat.', 'Halte eine Motivationsrede für eine Pflanze oder ein Kissen.', 'Mach 15 Sekunden Geräusche wie eine kaputte Waschmaschine.',
      'Sing ein Lied, bei dem jedes Wort „Miau“ ist.', 'Gib ein Luft-Schlagzeug-Konzert inklusive Verbeugung.', 'Schreib mit dem Po einen Buchstaben in die Luft – die anderen raten.',
      'Spiel eine Szene: Du merkst gerade, dass du in der falschen Klasse sitzt.', 'Stirb dramatisch in Zeitlupe, weil das WLAN ausgefallen ist.', 'Erzähl einen Witz mit der Stimme einer Zeichentrickfigur.',
      'Halte einen übertrieben begeisterten Wetterbericht – 30 Sekunden.', 'Lauf rückwärts im Kreis und gackere dabei.', 'Sing einen Refrain, den die Gruppe aussucht – mit Fistelstimme.',
      'Mach eine Unboxing-Reaktion zu einer Socke.', 'Begrüße alle in der Runde wie lange verschollene Freunde – mit Drama.', 'Posiere in Zeitlupe wie ein Model vor einem Ventilator.',
      'Spiel eine Ziege, die sich beim Kellner beschwert.', 'Zeig pantomimisch, dass du dringend aufs Klo musst – die Gruppe rät.', 'Mach ein Selfie mit deiner witzigsten Grimasse und zeig es (nicht posten nötig).',
      'Tanz den Chicken-Dance, bis jemand mitmacht.', 'Spiel einen Opernsänger, der die Einkaufsliste vorträgt.'
    ]
  ]
};

BORED.registerGame({
  id: 'truth-dare', name: 'Wahrheit oder Pflicht', icon: '🎭', cat: 'party', players: '2-10',
  desc: 'Der Klassiker zum Weitergeben: Wahrheit beantworten oder Pflicht erledigen – in drei Stufen.',
  rules: [
    'Tragt eure Namen ein. Das Handy wandert reihum.',
    'Wer dran ist, wählt Wahrheit oder Pflicht (oder lässt den Zufall entscheiden).',
    'Erledigt = Punkte: Chillig 1, Mutig 2, Wild 3. Kneifen = 0 Punkte.',
    'Jeder hat 2 Joker: neue Karte ohne Punktverlust.',
    'Alles freiwillig – niemand muss etwas tun, das sich blöd anfühlt. Dafür gibt’s Joker und Kneifen.'
  ],
  tags: ['freunde', 'drinnen', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const LV = ['Chillig', 'Mutig', 'Wild'];
    const menu = () => partyStart(root, api, {
      levels: LV,
      modes: [{ id: '3', label: '3 Runden' }, { id: '5', label: '5 Runden' }, { id: '0', label: 'Endlos' }],
      bestLabel: 'Rekord',
      onStart: (lvl, mode, players) => play(lvl, +mode, players)
    });
    function play(lvl, rounds, players){
      const scores = zeroScores(players), jokers = {}; players.forEach(p => jokers[p] = 2);
      const decks = { t: deck(api, 't' + lvl, TD.t[lvl]), d: deck(api, 'd' + lvl, TD.d[lvl]) };
      const pts = lvl + 1;
      let turn = 0, done = 0;
      const total = rounds ? rounds * players.length : 0;
      const end = () => endScreen(root, api, { ctx, scores, bestKey: lvl, xp: 15 + lvl * 4, onAgain: () => play(lvl, rounds, players), onMenu: menu, lines: [['Stufe', LV[lvl]], ['Züge', done]] });
      const info = () => rounds ? 'Runde ' + (Math.floor(turn / players.length) + 1) + '/' + rounds : 'Zug ' + (turn + 1);
      function choose(){
        if(total && turn >= total) return end();
        const p = players[turn % players.length];
        screen(root, [
          topBar(api, info() + ' · ' + LV[lvl], () => showScores(api, scores), end),
          el('div', { class: 'pt-card' }, [el('div', { class: 'b-kicker', text: 'Du bist dran' }), el('div', { class: 'pt-name', text: p }),
            el('p', { class: 'b-hint', text: scores[p] + ' Punkte · ' + jokers[p] + ' Joker' })]),
          el('div', { class: 'pt-choice' }, [
            el('button', { class: 't', onclick: () => card(p, 't') }, [el('span', { text: '🗣️' }), 'WAHRHEIT']),
            el('button', { class: 'd', onclick: () => card(p, 'd') }, [el('span', { text: '🔥' }), 'PFLICHT'])
          ]),
          el('button', { class: 'b-btn ghost block', text: '🎲 Zufall entscheidet', onclick: () => card(p, Math.random() < .5 ? 't' : 'd') })
        ]);
      }
      function card(p, type){
        api.sound('flip'); api.vibrate(20);
        const text = decks[type].next();
        const isT = type === 't';
        const jokerBtn = el('button', { class: 'b-btn ghost', text: '🃏 Joker (' + jokers[p] + ')', disabled: jokers[p] <= 0, onclick: () => {
          if(jokers[p] <= 0) return; jokers[p]--; api.sound('pop'); api.toast('Joker eingesetzt – neue Karte!'); card(p, type);
        } });
        screen(root, [
          topBar(api, info() + ' · ' + LV[lvl], () => showScores(api, scores), end),
          el('div', { class: 'pt-card ' + (isT ? 'cyan' : 'pink'), style: { minHeight: '280px' } }, [
            el('span', { class: 'b-pill ' + (isT ? 'cyan' : 'pink'), text: (isT ? '🗣️ Wahrheit' : '🔥 Pflicht') + ' · ' + LV[lvl] }),
            el('div', { class: 'b-kicker', style: { color: 'var(--mute)' }, text: p }),
            el('div', { class: 'pt-q', text })
          ]),
          el('button', { class: 'b-btn block pt-huge pt-good', text: '✓ Erledigt  +' + pts, onclick: () => { scores[p] += pts; api.sound('good'); next(); } }),
          el('div', { class: 'b-grid2' }, [jokerBtn, el('button', { class: 'b-btn ghost', text: '🙈 Kneifen', onclick: () => { api.sound('bad'); next(); } })])
        ]);
      }
      function next(){ done++; turn++; choose(); }
      choose();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   2) WER WÜRDE EHER …?
   ===================================================================== */
const WR = [
  'bei einem Horrorfilm als Erstes schreien?', 'ein ganzes Wochenende durchzocken?', 'irgendwann berühmt werden?', 'sich im IKEA verlaufen?',
  'bei einer Zombie-Apokalypse als Erstes erwischt werden?', 'aus Versehen die Lehrkraft „Mama“ nennen?', 'das letzte Stück Pizza essen, ohne zu fragen?', 'einen Weltrekord aufstellen?',
  'im Kino einschlafen?', 'das eigene Handy ins Klo fallen lassen?', 'am längsten ohne Handy durchhalten?', 'eine Million Follower bekommen?',
  'für einen Snack quer durch die Stadt gehen?', 'ein Geheimnis ausplaudern?', 'beim Monopoly schummeln?', 'sich mit einer Taube anfreunden?',
  'Bundeskanzler oder Bundeskanzlerin werden?', 'den ganzen Tag im Pyjama bleiben?', 'als Erstes ein Spiel ragequitten?', 'bei einer Quizshow gewinnen?',
  'etwas in den falschen Gruppenchat schicken?', 'bei einer Reality-Show mitmachen?', 'freiwillig zum Mars fliegen?', 'beim Karaoke das Mikro nicht mehr hergeben?',
  'den Wecker zehnmal auf Schlummern drücken?', 'mit Tieren reden, wenn es ginge?', 'ein eigenes Unternehmen gründen?', 'ein Buch schreiben?',
  'im Escape-Room als Erstes die Lösung finden?', 'beim Wandern als Erstes jammern?', 'sich die Haare in Neonfarben färben?', 'ein Jahr lang nur Nudeln essen?',
  'in einer Survival-Show am längsten überleben?', 'einen Song über diese Gruppe schreiben?', 'aus Versehen einen Livestream starten?', '1000 Stunden in ein einziges Spiel stecken?',
  'ein Haustier „Herr Brösel“ nennen?', 'immer zu spät kommen?', 'über den eigenen Witz am lautesten lachen?', 'bei einem traurigen Film weinen?',
  'in der Achterbahn die Augen zumachen?', 'vor einer Spinne auf einen Sessel flüchten?', 'den Geburtstag eines Freundes vergessen?', 'einen Influencer-Account starten?',
  'im Supermarkt vergessen, wofür man gekommen ist?', 'mit vollem Mund reden?', 'jede Diskussion gewinnen – auch ohne recht zu haben?', 'Schnee essen?',
  'einen Tanzwettbewerb gewinnen?', 'beim Kochen den Rauchmelder auslösen?', 'ein Selfie mit einem Promi ergattern?', 'um Mitternacht noch Hausaufgaben machen?',
  'sich in eine Fantasy-Welt beamen lassen?', 'den Weltuntergang verschlafen?', 'beim Fußball ein Eigentor schießen?', 'ein ganzes Glas Nutella auf einmal auslöffeln?',
  'sich bei Lehrkräften einschleimen?', 'in der Öffentlichkeit laut singen?', 'für ein gutes Meme alles tun?', 'etwas kaufen, nur weil es in einer Werbung war?',
  'die Spoiler einer Serie verraten?', 'zu jeder Mahlzeit Pommes essen?', 'einen Marathon laufen?', 'sich ein Meme-T-Shirt drucken lassen?',
  'bei einer Prüfung einschlafen?', 'mit einem Alien Freundschaft schließen?', 'nachts heimlich den Kühlschrank plündern?', 'ein Spiel zu 100 % durchspielen?',
  'den Bus verpassen, obwohl er noch da war?', 'beim Uno als Erstes die Nerven verlieren?', 'einen eigenen Podcast starten?', 'eine Woche allein im Wald überleben?',
  'auf einer Übernachtungsparty als Erstes einschlafen?', 'allen einen harmlosen Streich spielen?', 'Japanisch nur durch Anime lernen?', 'Millionär werden?',
  'das Handy im Unterricht laut klingeln lassen?', 'mit dem Sprachassistenten streiten?', 'beim Schulausflug verloren gehen?', 'die Gruppe in einer Notsituation retten?',
  'sich als Lieblings-Charakter verkleiden?', 'das Ende eines Films vorher googeln?', 'beim Lachen grunzen?', 'eine Pflanze vergessen zu gießen, bis sie eingeht?',
  'im Urlaub nur im Hotelzimmer zocken?', 'ein Gespräch mit dem eigenen Hund führen?', 'Profi-Gamer werden?', 'als Erstes merken, dass jemand flunkert?'
];

BORED.registerGame({
  id: 'would-rather', name: 'Wer würde eher …?', icon: '👉', cat: 'party', players: '2-10',
  desc: 'Frage lesen, 3-2-1 – alle zeigen gleichzeitig auf eine Person. Die App zählt mit.',
  rules: [
    'Eine Person liest die Frage laut vor.',
    'Countdown starten: Bei LOS zeigen alle gleichzeitig mit dem Finger auf die Person, die am ehesten passt.',
    'Tippt dann jede Person so oft an, wie auf sie gezeigt wird („Zurücksetzen“ zum Korrigieren).',
    'Wer am Ende die meisten Stimmen gesammelt hat, führt die Rangliste an.'
  ],
  tags: ['freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const menu = () => partyStart(root, api, {
      min: 3,
      modes: [{ id: '10', label: '10 Fragen' }, { id: '20', label: '20 Fragen' }, { id: '0', label: 'Endlos' }],
      bestLabel: 'Rekord',
      onStart: (l, mode, players) => play(+mode, players)
    });
    function play(rounds, players){
      const scores = zeroScores(players), titles = [];
      const d = deck(api, 'wr', WR);
      let round = 0;
      const end = () => {
        const extra = titles.length ? el('div', { class: 'b-card' }, [
          el('span', { class: 'b-label', text: 'Eure Titel' }),
          el('div', { class: 'b-stack tight' }, titles.slice(-12).map(t => el('p', { style: { fontSize: '15px' } }, [el('b', { text: t[0] + ': ' }), document.createTextNode('würde eher ' + t[1])])))
        ]) : null;
        endScreen(root, api, { ctx, scores, unit: 'Stimmen', rankTitle: 'Rangliste nach Stimmen', xp: 18, extra, lines: [['Fragen', round]], onAgain: () => play(rounds, players), onMenu: menu });
      };
      function ask(){
        if(rounds && round >= rounds) return end();
        const q = d.next();
        screen(root, [
          topBar(api, 'Frage ' + (round + 1) + (rounds ? '/' + rounds : ''), () => showScores(api, scores, 'Stimmen', 'Stimmen'), end),
          el('div', { class: 'pt-card', style: { minHeight: '260px' } }, [
            el('div', { class: 'b-kicker', text: 'Wer würde eher …' }),
            el('div', { class: 'pt-q', text: '… ' + q })
          ]),
          el('p', { class: 'b-hint b-center', text: 'Laut vorlesen, dann Countdown – bei LOS zeigen alle gleichzeitig auf eine Person!' }),
          el('button', { class: 'b-btn block pt-huge', text: '⏱ Countdown 3-2-1', onclick: () => {
            const holder = screen(root, []);
            countdown(ctx, api, holder, 'Gleich zeigen …', () => count(q));
          } }),
          el('button', { class: 'b-btn ghost block', text: '↻ Andere Frage', onclick: () => { api.sound('flip'); ask(); } })
        ]);
      }
      function count(q){
        const votes = {}; players.forEach(p => votes[p] = 0);
        const sum = () => Object.values(votes).reduce((a, b) => a + b, 0);
        const info = el('p', { class: 'b-hint b-center' });
        const grid = el('div', { class: 'pt-vote' });
        const go = el('button', { class: 'b-btn block pt-big', text: 'Auswerten ✓' });
        const render = () => {
          grid.innerHTML = '';
          players.forEach(p => {
            const b = el('button', { 'aria-pressed': String(votes[p] > 0), onclick: () => {
              if(sum() >= players.length){ api.toast('Mehr Stimmen als Leute? 😉'); api.sound('bad'); return; }
              votes[p]++; api.sound('pop'); api.vibrate(10); render();
            } }, [el('span', { text: p }), el('i', { text: votes[p] ? String(votes[p]) : '' })]);
            grid.append(b);
          });
          info.textContent = sum() + ' von ' + players.length + ' Stimmen gezählt – tippe jede Person so oft an, wie auf sie gezeigt wird.';
          go.disabled = sum() === 0;
        };
        const undo = el('button', { class: 'b-btn ghost sm', text: '↺ Zurücksetzen', onclick: () => { players.forEach(p => votes[p] = 0); api.sound('click'); render(); } });
        go.onclick = () => {
          players.forEach(p => scores[p] += votes[p]);
          const max = Math.max(...Object.values(votes));
          const win = players.filter(p => votes[p] === max);
          titles.push([win.join(' & '), q]);
          round++; api.sound('win');
          screen(root, [
            el('div', { class: 'pt-card pink', style: { minHeight: '280px' } }, [
              el('div', { style: { fontSize: '56px' }, text: '👑' }),
              el('div', { class: 'pt-name', text: win.join(' & ') }),
              el('p', { class: 'b-h', text: max + (max === 1 ? ' Stimme' : ' Stimmen') }),
              el('p', { class: 'b-hint', text: 'würde eher ' + q })
            ]),
            el('button', { class: 'b-btn block pt-big', text: 'Nächste Frage →', onclick: () => { api.sound('click'); ask(); } })
          ]);
        };
        render();
        screen(root, [
          el('div', { class: 'b-between' }, [el('span', { class: 'b-kicker', text: 'Wer würde eher …' }), undo]),
          el('p', { class: 'pt-q sm', text: '… ' + q }),
          grid, info, go
        ]);
      }
      ask();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   3) ENTWEDER ODER
   ===================================================================== */
const EO = [
  ['🍕 Pizza', '🍔 Burger'], ['☀️ Sommer', '❄️ Winter'], ['🐶 Hund', '🐱 Katze'], ['📺 Netflix', '▶️ YouTube'], ['⛰️ Berge', '🌊 Meer'],
  ['🌅 Früh aufstehen', '🌙 Lange aufbleiben'], ['🍬 Süß', '🥨 Salzig'], ['🚆 Zug', '✈️ Flugzeug'], ['🎬 Kino', '🛋️ Daheim streamen'], ['🎮 PlayStation', '🟢 Xbox'],
  ['📱 Handy', '🖥️ PC'], ['🕊️ Fliegen können', '👻 Unsichtbar sein'], ['⏪ Reise in die Vergangenheit', '⏩ Reise in die Zukunft'], ['🎵 Nie wieder Musik', '🎞️ Nie wieder Filme'], ['🥩 Schnitzel', '🍝 Spaghetti'],
  ['🥞 Kaiserschmarrn', '🫓 Palatschinken'], ['🏙️ Stadt', '🌾 Land'], ['📸 Instagram', '🎵 TikTok'], ['🍵 Tee', '☕ Kakao'], ['🍅 Ketchup', '🥚 Mayo'],
  ['🏖️ Strandurlaub', '⛷️ Skiurlaub'], ['🦸 Superman', '🦇 Batman'], ['🛡️ Marvel', '⚡ DC'], ['🧙 Harry Potter', '💍 Herr der Ringe'], ['⛏️ Minecraft', '🪂 Fortnite'],
  ['🎤 Singen', '💃 Tanzen'], ['📖 Buch lesen', '🎧 Hörbuch'], ['🌧️ Immer Regen', '🔥 Immer Hitze'], ['👖 Jeans', '🩳 Jogginghose'], ['🍝 Lasagne', '🍜 Ramen'],
  ['🍦 Eis im Becher', '🍦 Eis in der Waffel'], ['🌞 Tag', '🌌 Nacht'], ['🧠 Gedanken lesen', '🔮 In die Zukunft sehen'], ['🥶 Immer ein bisschen kalt', '🥵 Immer ein bisschen warm'], ['📵 1 Woche ohne Handy', '🍫 1 Monat ohne Süßes'],
  ['🏰 Hogwarts', '⚡ Pokémon-Welt'], ['🐉 Drache', '🦄 Einhorn'], ['🤖 Roboter-Butler', '🌀 Teleporter'], ['👯 Wenige enge Freunde', '🎉 Viele Bekannte'], ['🌟 Berühmt', '💰 Reich'],
  ['🚀 Weltraum', '🐙 Tiefsee'], ['🌴 Dschungel', '🏜️ Wüste'], ['⛺ Camping', '🏨 Hotel'], ['🎢 Achterbahn', '🎡 Riesenrad'], ['🏀 Basketball', '⚽ Fußball'],
  ['🍪 Kekse', '🎂 Kuchen'], ['🥔 Chips', '🍫 Schokolade'], ['🍎 Apfel', '🍌 Banane'], ['🥙 Döner', '🍔 Burger'], ['🥤 Cola', '🧋 Eistee'],
  ['💧 Prickelnd', '💦 Still'], ['🎧 In-Ear', '🎧 Over-Ear'], ['🎮 Allein zocken', '👥 Mit Freunden zocken'], ['🎲 Brettspiel', '🕹️ Videospiel'], ['😱 Horrorfilm', '😂 Komödie'],
  ['🍥 Anime', '📺 Cartoons'], ['📚 Hausübung', '🍽️ Abwaschen'], ['🧹 Zimmer aufräumen', '🗑️ Müll rausbringen'], ['🐾 Mit Tieren reden', '🌍 Alle Sprachen sprechen'], ['⏸️ Zeit anhalten', '⏮️ Zeit zurückspulen'],
  ['🚗 Fliegendes Auto', '🏠 Haus unter Wasser'], ['🔴 Rot', '🔵 Blau'], ['🥐 Frühstück', '🍲 Abendessen'], ['🪩 Wochenende Party', '😴 Wochenende chillen'], ['🥇 Erste Reihe', '🔚 Letzte Reihe'],
  ['🎙️ Sprachnachricht', '💬 Textnachricht'], ['📞 Anrufen', '⌨️ Schreiben'], ['🏴‍☠️ Pirat', '🛡️ Ritter'], ['🥷 Ninja', '⚔️ Samurai'], ['🧛 Vampir', '🐺 Werwolf'],
  ['🧟 Zombie-Apokalypse', '👽 Alien-Invasion'], ['🎡 Wien', '🕰️ Graz'], ['🌙 Mond', '🔴 Mars'], ['🃏 Uno', '🎩 Monopoly'], ['🎸 Gitarre', '🎹 Klavier'],
  ['🌳 Baumhaus', '🚪 Geheimgang'], ['🍣 Sushi', '🌮 Tacos'], ['🌭 Hot Dog', '🥪 Toast'], ['🍦 Vanille', '🍫 Schoko'], ['🍿 Popcorn süß', '🧂 Popcorn salzig'],
  ['🕷️ Spider-Man', '🤖 Iron Man'], ['🍄 Mario', '💨 Sonic'], ['🏛️ Städtetrip', '🏝️ Insel-Urlaub'], ['🥟 Knödel', '🍟 Pommes'], ['📷 Selfie', '👨‍👩‍👧 Gruppenfoto'],
  ['🎁 Überraschung', '📋 Alles geplant'], ['🐢 Langsam & sicher', '⚡ Schnell & riskant'], ['🦸 Held sein', '😈 Bösewicht sein'], ['🏆 Gewinnen', '😄 Spaß haben'], ['🍉 Wassermelone', '🍓 Erdbeeren']
];

BORED.registerGame({
  id: 'either-or', name: 'Entweder oder', icon: '⚖️', cat: 'party', players: '2-10',
  desc: 'Zwei Optionen, eine Wahl: Alle stimmen geheim ab – dann seht ihr, wie die Gruppe tickt.',
  rules: [
    'Das Handy wandert reihum. Jede Person tippt geheim auf eine Hälfte.',
    'Nach der letzten Stimme zeigt die App, wie viel Prozent eurer Gruppe was gewählt haben – nur eure echten Stimmen.',
    'Wer mit der Mehrheit stimmt, bekommt 1 Punkt. Bei Gleichstand gibt es keine Punkte.'
  ],
  tags: ['freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const menu = () => partyStart(root, api, {
      modes: [{ id: '10', label: '10 Fragen' }, { id: '20', label: '20 Fragen' }, { id: '0', label: 'Endlos' }],
      bestLabel: 'Rekord',
      onStart: (l, mode, players) => play(+mode, players)
    });
    function play(rounds, players){
      const scores = zeroScores(players), d = deck(api, 'eo', EO);
      let round = 0;
      const end = () => endScreen(root, api, { ctx, scores, rankTitle: 'Mit der Mehrheit gestimmt', xp: 16, lines: [['Fragen', round], ['Spieler', players.length]], onAgain: () => play(rounds, players), onMenu: menu });
      function next(){
        if(rounds && round >= rounds) return end();
        const pair = d.next(), votes = {};
        let i = 0;
        const voteScreen = () => {
          const p = players[i];
          screen(root, [
            topBar(api, 'Frage ' + (round + 1) + (rounds ? '/' + rounds : '') + ' · ' + (i + 1) + '/' + players.length, () => showScores(api, scores), end),
            el('div', { class: 'b-center' }, [el('div', { class: 'b-kicker', text: 'Geheim abstimmen' }), el('div', { class: 'pt-name', style: { fontSize: '26px' }, text: p })]),
            el('div', { class: 'pt-split' }, [
              el('button', { class: 'a', text: pair[0], onclick: () => pick(0) }),
              el('div', { class: 'pt-or', text: 'ODER' }),
              el('button', { class: 'b', text: pair[1], onclick: () => pick(1) })
            ]),
            el('p', { class: 'b-hint b-center', text: i + 1 < players.length ? 'Danach weiter an ' + players[i + 1] : 'Du bist die letzte Stimme.' })
          ]);
        };
        const pick = (side) => {
          votes[players[i]] = side; api.sound('pop'); api.vibrate(15); i++;
          if(i < players.length){
            // kurze Sichtschutz-Seite, damit die nächste Person die Wahl nicht sieht
            screen(root, [el('div', { class: 'pt-card cyan', style: { minHeight: '300px' } }, [el('div', { class: 'pt-pass', text: '✓' }), el('p', { class: 'b-h', text: 'Gespeichert!' }), el('p', { class: 'b-hint', text: 'Weiter an' }), el('div', { class: 'pt-name', text: players[i] })]),
              el('button', { class: 'b-btn block pt-big', text: 'Ich bin ' + players[i] + ' ✓', onclick: () => { api.sound('click'); voteScreen(); } })]);
          } else result();
        };
        const result = () => {
          round++;
          const a = players.filter(p => votes[p] === 0), b = players.filter(p => votes[p] === 1);
          const pa = Math.round(a.length / players.length * 100), pb = 100 - pa;
          if(a.length !== b.length){ (a.length > b.length ? a : b).forEach(p => scores[p]++); }
          api.sound('win');
          const box = (cls, label, pct, names) => {
            const fill = el('i');
            ctx.to(() => { fill.style.width = pct + '%'; }, 60);
            return el('div', { class: 'pt-res ' + cls }, [
              el('div', { class: 'b-between' }, [el('b', { style: { fontSize: '19px' }, text: label }), el('span', { class: 'pt-pct', text: pct + '%' })]),
              el('div', { class: 'b-bar' }, [fill]),
              el('small', { class: 'b-hint', text: names.length ? names.join(', ') : 'niemand' })
            ]);
          };
          screen(root, [
            topBar(api, 'Ergebnis · Frage ' + round, () => showScores(api, scores), end),
            box('a', pair[0], pa, a), box('b', pair[1], pb, b),
            el('p', { class: 'b-hint b-center', text: a.length === b.length ? 'Gleichstand – keine Punkte!' : (a.length === 0 || b.length === 0 ? 'Alle einer Meinung! +1 für alle.' : 'Die Mehrheit bekommt +1.') + ' (' + players.length + ' Stimmen)' }),
            el('button', { class: 'b-btn block pt-big', text: 'Nächste Frage →', onclick: () => { api.sound('click'); next(); } })
          ]);
        };
        voteScreen();
      }
      next();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   4) IMPOSTOR (Wort-Spion)
   ===================================================================== */
const IMP = {
  'Tiere': ['Hund', 'Katze', 'Elefant', 'Giraffe', 'Pinguin', 'Krokodil', 'Känguru', 'Eichhörnchen', 'Delfin', 'Eule', 'Zebra', 'Igel'],
  'Essen': ['Pizza', 'Schnitzel', 'Sushi', 'Döner', 'Spaghetti', 'Burger', 'Kaiserschmarrn', 'Pommes', 'Lasagne', 'Gulasch', 'Tacos', 'Knödel'],
  'Getränke': ['Cola', 'Apfelsaft', 'Kakao', 'Tee', 'Eistee', 'Limonade', 'Milchshake', 'Mineralwasser', 'Smoothie', 'Holundersaft', 'Bubble Tea', 'Orangensaft'],
  'Berufe': ['Arzt', 'Feuerwehrmann', 'Lehrerin', 'Bäcker', 'Pilot', 'Polizistin', 'Koch', 'Friseurin', 'Elektriker', 'Tischler', 'Tierärztin', 'Astronaut'],
  'Sportarten': ['Fußball', 'Tennis', 'Skifahren', 'Schwimmen', 'Basketball', 'Eishockey', 'Volleyball', 'Klettern', 'Boxen', 'Radfahren', 'Tischtennis', 'Handball'],
  'Länder': ['Österreich', 'Italien', 'Japan', 'Brasilien', 'Kanada', 'Ägypten', 'Australien', 'Spanien', 'Norwegen', 'Mexiko', 'Indien', 'Griechenland'],
  'Städte': ['Wien', 'Graz', 'Salzburg', 'Paris', 'London', 'New York', 'Tokio', 'Rom', 'Berlin', 'Barcelona', 'Dubai', 'Venedig'],
  'Orte': ['Schwimmbad', 'Kino', 'Supermarkt', 'Krankenhaus', 'Flughafen', 'Bibliothek', 'Bahnhof', 'Zoo', 'Strand', 'Friseur', 'Bäckerei', 'Fitnessstudio'],
  'In der Schule': ['Tafel', 'Turnsaal', 'Pausenbrot', 'Schularbeit', 'Zeugnis', 'Klassenbuch', 'Schulbus', 'Schultasche', 'Lineal', 'Direktorin', 'Pausenglocke', 'Federpennal'],
  'Im Haushalt': ['Staubsauger', 'Waschmaschine', 'Kühlschrank', 'Toaster', 'Bügeleisen', 'Mikrowelle', 'Besen', 'Geschirrspüler', 'Wasserkocher', 'Föhn', 'Kaffeemaschine', 'Mixer'],
  'Fahrzeuge': ['Fahrrad', 'Bus', 'Straßenbahn', 'Motorrad', 'Traktor', 'Hubschrauber', 'U-Boot', 'Segelboot', 'Feuerwehrauto', 'Skateboard', 'Rakete', 'E-Scooter'],
  'Videospiele': ['Minecraft', 'Fortnite', 'Mario Kart', 'Pokémon', 'Tetris', 'Roblox', 'Zelda', 'FIFA', 'Among Us', 'Pac-Man', 'Animal Crossing', 'Rocket League'],
  'Märchen & Sagen': ['Rotkäppchen', 'Aschenputtel', 'Schneewittchen', 'Hänsel und Gretel', 'Rapunzel', 'Dornröschen', 'Rumpelstilzchen', 'Froschkönig', 'Pinocchio', 'Aladdin', 'Robin Hood', 'Peter Pan'],
  'Fantasy': ['Drache', 'Einhorn', 'Zauberer', 'Elfe', 'Troll', 'Vampir', 'Werwolf', 'Meerjungfrau', 'Zwerg', 'Phönix', 'Hexe', 'Riese'],
  'Musikinstrumente': ['Gitarre', 'Klavier', 'Schlagzeug', 'Geige', 'Trompete', 'Flöte', 'Saxofon', 'Harfe', 'Akkordeon', 'Cello', 'Ukulele', 'Mundharmonika'],
  'Kleidung': ['Jacke', 'Hoodie', 'Jeans', 'Socken', 'Mütze', 'Schal', 'Badehose', 'Pyjama', 'Sneaker', 'Kappe', 'Handschuhe', 'Krawatte'],
  'Obst & Gemüse': ['Apfel', 'Banane', 'Erdbeere', 'Karotte', 'Gurke', 'Tomate', 'Ananas', 'Kartoffel', 'Kirsche', 'Brokkoli', 'Zwiebel', 'Wassermelone'],
  'Süßes': ['Schokolade', 'Gummibärchen', 'Lutscher', 'Eis', 'Donut', 'Muffin', 'Zuckerwatte', 'Mannerschnitten', 'Lebkuchen', 'Popcorn', 'Kaugummi', 'Mozartkugel'],
  'Wetter & Natur': ['Regenbogen', 'Gewitter', 'Schnee', 'Nebel', 'Tornado', 'Vulkan', 'Wasserfall', 'Wüste', 'Gletscher', 'Höhle', 'Sonnenfinsternis', 'Hagel'],
  'Weltraum': ['Mond', 'Mars', 'Sonne', 'Astronaut', 'Rakete', 'Komet', 'Schwarzes Loch', 'Satellit', 'Sternschnuppe', 'Raumstation', 'Saturn', 'Alien'],
  'Körper': ['Nase', 'Ellbogen', 'Knie', 'Zunge', 'Augenbraue', 'Zehe', 'Ohr', 'Daumen', 'Schulter', 'Bauchnabel', 'Ferse', 'Wimper'],
  'Gefühle': ['Freude', 'Wut', 'Angst', 'Langeweile', 'Eifersucht', 'Stolz', 'Peinlichkeit', 'Überraschung', 'Müdigkeit', 'Heimweh', 'Aufregung', 'Neugier'],
  'Hobbys': ['Zeichnen', 'Gaming', 'Lesen', 'Kochen', 'Fotografieren', 'Angeln', 'Tanzen', 'Basteln', 'Gärtnern', 'Singen', 'Stricken', 'Programmieren'],
  'Superhelden': ['Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Hulk', 'Wonder Woman', 'Thor', 'Captain America', 'Black Panther', 'Flash', 'Aquaman', 'Deadpool'],
  'Feiertage & Feste': ['Weihnachten', 'Ostern', 'Silvester', 'Geburtstag', 'Halloween', 'Fasching', 'Hochzeit', 'Muttertag', 'Nikolaus', 'Valentinstag', 'Kirtag', 'Schulschluss'],
  'Technik': ['Handy', 'Laptop', 'Drucker', 'Kopfhörer', 'Tastatur', 'Drohne', 'Smartwatch', 'Fernseher', 'Spielkonsole', 'Router', 'Powerbank', 'Webcam'],
  'Werkzeug': ['Hammer', 'Schraubenzieher', 'Säge', 'Bohrmaschine', 'Zange', 'Wasserwaage', 'Maßband', 'Schraubenschlüssel', 'Lötkolben', 'Leiter', 'Pinsel', 'Feile'],
  'Am Strand': ['Sonnencreme', 'Sandburg', 'Muschel', 'Liegestuhl', 'Surfbrett', 'Sonnenschirm', 'Badetuch', 'Rettungsschwimmer', 'Qualle', 'Möwe', 'Taucherbrille', 'Wasserball'],
  'Im Winter': ['Schneemann', 'Schlitten', 'Iglu', 'Skilift', 'Schneeballschlacht', 'Eislaufen', 'Handschuhe', 'Punsch', 'Lebkuchen', 'Eiszapfen', 'Snowboard', 'Kamin'],
  'Filmgenres': ['Horror', 'Komödie', 'Action', 'Science-Fiction', 'Western', 'Zeichentrick', 'Krimi', 'Fantasy', 'Musical', 'Dokumentation', 'Liebesfilm', 'Abenteuer'],
  'Spielzeug': ['Lego', 'Puppe', 'Jo-Jo', 'Kreisel', 'Teddybär', 'Puzzle', 'Drachen', 'Murmeln', 'Rubik’s Cube', 'Modellauto', 'Springseil', 'Seifenblasen'],
  'Freizeitpark': ['Achterbahn', 'Riesenrad', 'Geisterbahn', 'Autodrom', 'Zuckerwatte', 'Wildwasserbahn', 'Karussell', 'Freefall-Turm', 'Spiegelkabinett', 'Schiffschaukel', 'Losbude', 'Maskottchen'],
  'Social Media': ['Selfie', 'Hashtag', 'Story', 'Follower', 'Like', 'Livestream', 'Filter', 'Kommentar', 'Influencer', 'Meme', 'Reel', 'Emoji']
};

BORED.registerGame({
  id: 'impostor', name: 'Impostor', icon: '🕵️', cat: 'party', players: '2-10',
  desc: 'Alle kennen das geheime Wort – nur der Impostor nicht. Findet ihn, bevor er euch austrickst!',
  rules: [
    'Das Handy geht reihum: Antippen zum Aufdecken, merken, verdecken, weitergeben.',
    'Alle bekommen dasselbe Wort – der Impostor nur die Kategorie (oder ein anderes Wort aus der Kategorie, je nach Modus).',
    'Reihum sagt jede Person EIN Wort, das zum geheimen Wort passt – nicht zu offensichtlich!',
    'Wenn der Timer abläuft, stimmt jede Person geheim ab, wer der Impostor ist.',
    'Impostor entkommt: +2 Punkte. Impostor erwischt: alle anderen +1 – errät er dann das Wort, bekommt er trotzdem +1.'
  ],
  tags: ['freunde', 'drinnen', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const cats = Object.keys(IMP);
    let timeSel = api.store.get('time', 120);
    let impCount = 1;
    const menu = () => {
      const tChips = el('div', { class: 'b-chips' });
      const rT = () => { tChips.innerHTML = ''; [[60, '1 Min'], [120, '2 Min'], [180, '3 Min'], [300, '5 Min']].forEach(([v, l]) => tChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(timeSel === v), text: l, onclick: () => { timeSel = v; api.store.set('time', v); api.sound('click'); rT(); } }))); };
      rT();
      const iChips = el('div', { class: 'b-chips' });
      const rI = () => { iChips.innerHTML = ''; [1, 2].forEach(v => iChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(impCount === v), text: v + ' Impostor', onclick: () => { impCount = v; api.sound('click'); rI(); } }))); };
      rI();
      partyStart(root, api, {
        min: 3,
        modes: [{ id: 'cat', label: 'Impostor sieht Kategorie' }, { id: 'word', label: 'Impostor hat anderes Wort' }],
        bestLabel: 'Rekord',
        extra: el('div', { class: 'b-stack tight' }, [
          el('div', {}, [el('span', { class: 'b-label', text: 'Diskussionszeit' }), tChips]),
          el('div', {}, [el('span', { class: 'b-label', text: 'Anzahl Impostor (2 ab 6 Spielern)' }), iChips])
        ]),
        onStart: (l, mode, players) => {
          if(impCount === 2 && players.length < 6){ api.toast('2 Impostor erst ab 6 Spielern – es gibt 1.'); }
          play(mode, players, { scores: zeroScores(players), round: 0 });
        }
      });
    };
    function play(mode, players, state){
      const nImp = impCount === 2 && players.length >= 6 ? 2 : 1;
      const cat = api.pick(cats);
      const words = api.shuffle(IMP[cat]);
      const word = words[0], fake = words[1];
      const imps = api.shuffle(players.map((_, i) => i)).slice(0, nImp).map(i => players[i]);
      const scores = state.scores;
      const end = () => endScreen(root, api, { ctx, scores, xp: 20, lines: [['Runden', state.round], ['Spieler', players.length]], onAgain: () => play(mode, players, { scores: zeroScores(players), round: 0 }), onMenu: menu });
      let idx = 0;
      const revealNext = () => {
        if(idx >= players.length) return discuss();
        const p = players[idx];
        passScreen(root, api, p, 'Nur ' + p + ' darf schauen! (' + (idx + 1) + '/' + players.length + ')', () => reveal(p));
      };
      const reveal = (p) => {
        const isImp = imps.includes(p);
        let open = false, seen = false;
        const pad = el('button', { class: 'pt-reveal', 'aria-label': 'Aufdecken' });
        const nextBtn = el('button', { class: 'b-btn block pt-big', text: 'Verdecken & weitergeben →', disabled: true });
        const paint = () => {
          pad.innerHTML = ''; pad.classList.toggle('open', open); pad.classList.toggle('imp', open && isImp);
          if(!open){
            pad.append(el('div', { style: { fontSize: '54px' }, text: '🔒' }), el('div', { class: 'b-h', text: 'Antippen zum Aufdecken' }), el('small', { class: 'b-hint', text: 'Nochmal tippen zum Verdecken' }));
          }else if(isImp && mode === 'cat'){
            pad.append(el('div', { style: { fontSize: '54px' }, text: '🕵️' }), el('div', { class: 'pt-word', style: { color: 'var(--pink)' }, text: 'DU BIST DER IMPOSTOR' }),
              el('p', { class: 'b-h', text: 'Kategorie: ' + cat }), el('small', { class: 'b-hint', text: 'Bluffe und finde das Wort heraus!' }));
          }else{
            pad.append(el('div', { class: 'b-kicker', text: 'Kategorie: ' + cat }), el('div', { class: 'pt-word', text: isImp ? fake : word }),
              el('small', { class: 'b-hint', text: 'Merk dir das Wort – nicht laut sagen!' }));
          }
        };
        pad.onclick = () => { open = !open; if(open) seen = true; api.sound('flip'); api.vibrate(15); paint(); nextBtn.disabled = !seen || open; if(seen && open) nextBtn.textContent = 'Erst verdecken 🔒'; else nextBtn.textContent = 'Verdecken & weitergeben →'; };
        nextBtn.onclick = () => { if(open) return; api.sound('click'); idx++; revealNext(); };
        paint();
        screen(root, [topBar(api, 'Runde ' + (state.round + 1) + ' · Wort verteilen', null, null), el('div', { class: 'pt-name', style: { fontSize: '24px' }, text: p }), pad, nextBtn]);
      };
      const discuss = () => {
        const starter = api.pick(players);
        const go = () => {
          const t = timer(ctx, api, timeSel, () => vote(), { warn: 15 });
          screen(root, [
            topBar(api, 'Runde ' + (state.round + 1) + ' · Diskussion', () => showScores(api, scores), end),
            el('div', { class: 'pt-card' }, [
              el('div', { class: 'b-kicker', text: 'Kategorie: ' + (mode === 'cat' ? cat : cat + ' (Achtung, nicht alle haben dasselbe Wort!)') }),
              el('p', { class: 'b-h', text: 'Es beginnt:' }), el('div', { class: 'pt-name', text: starter }),
              el('p', { class: 'b-hint', text: 'Reihum sagt jede Person EIN passendes Wort. Danach dürft ihr diskutieren, wer verdächtig ist.' }),
              el('p', { class: 'b-hint', text: nImp === 2 ? 'Es gibt 2 Impostor!' : 'Es gibt 1 Impostor.' })
            ]),
            t.node,
            el('div', { class: 'b-grid2' }, [
              el('button', { class: 'b-btn ghost', text: '+30 s', onclick: () => { t.add(30); api.sound('click'); } }),
              el('button', { class: 'b-btn', text: 'Abstimmen ✓', onclick: () => { t.stop(); api.sound('click'); vote(); } })
            ])
          ]);
        };
        screen(root, [
          el('div', { class: 'pt-card cyan', style: { minHeight: '260px' } }, [el('div', { class: 'pt-pass', text: '🗣️' }), el('p', { class: 'b-h', text: 'Alle haben ihr Wort gesehen!' }), el('p', { class: 'b-hint', text: 'Legt das Handy in die Mitte. Wenn ihr bereit seid, startet den Timer.' })]),
          el('button', { class: 'b-btn block pt-huge', text: '⏱ Diskussion starten', onclick: go })
        ]);
      };
      const vote = () => {
        const votes = {}; players.forEach(p => votes[p] = 0);
        let vi = 0;
        const vScreen = () => {
          if(vi >= players.length) return reveal2(votes);
          const p = players[vi];
          passScreen(root, api, p, 'Geheime Abstimmung (' + (vi + 1) + '/' + players.length + ')', () => {
            screen(root, [
              el('div', { class: 'b-center' }, [el('div', { class: 'b-kicker', text: p + ', wer ist der Impostor?' })]),
              el('div', { class: 'pt-vote' }, players.filter(x => x !== p).map(x => el('button', { onclick: () => { votes[x]++; api.sound('pop'); api.vibrate(15); vi++; vScreen(); } }, [el('span', { text: x }), el('i', { text: '🎯' })])))
            ]);
          });
        };
        vScreen();
      };
      const reveal2 = (votes) => {
        const max = Math.max(...Object.values(votes));
        const top = players.filter(p => votes[p] === max);
        // Erwischt, wenn ein Impostor (eindeutig) die meisten Stimmen hat
        const caught = top.length === 1 && imps.includes(top[0]) ? top[0] : null;
        const lines = el('div', { class: 'b-stack tight' }, players.slice().sort((a, b) => votes[b] - votes[a]).map(p => el('div', { class: 'b-item' }, [
          el('div', { class: 'ic', text: imps.includes(p) ? '🕵️' : '🙂' }), el('div', { class: 'tx' }, [el('b', { text: p }), el('small', { text: imps.includes(p) ? 'Impostor' : 'unschuldig' })]),
          el('span', { class: 'pt-pts', text: votes[p] + '×' })
        ])));
        const wordLine = () => el('p', { class: 'b-hint', text: 'Das Wort war „' + word + '“' + (mode === 'word' ? ' – der Impostor hatte „' + fake + '“.' : '.') });
        const finishRound = (impGuessed) => {
          if(caught){ players.forEach(p => { if(!imps.includes(p)) scores[p] += 1; }); if(impGuessed) scores[caught] += 1; }
          else imps.forEach(p => scores[p] += 2);
          state.round++;
          screen(root, [
            topBar(api, 'Runde ' + state.round + ' vorbei', () => showScores(api, scores), null),
            el('div', { class: 'pt-card', style: { minHeight: '0' } }, [el('div', { class: 'b-kicker', text: 'Geheimes Wort' }), el('div', { class: 'pt-word', text: word }), mode === 'word' ? el('p', { class: 'b-hint', text: 'Impostor-Wort: ' + fake }) : null]),
            el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: 'Punktestand' }), rankList(scores)]),
            el('button', { class: 'b-btn block pt-big', text: '▶ Nächste Runde', onclick: () => { api.sound('good'); play(mode, players, state); } }),
            el('button', { class: 'b-btn ghost block', text: 'Spiel beenden', onclick: end })
          ]);
        };
        api.sound(caught ? 'win' : 'lose');
        const kids = [
          el('div', { class: 'pt-card ' + (caught ? 'cyan' : 'pink') }, [
            el('div', { style: { fontSize: '54px' }, text: caught ? '🎯' : '😈' }),
            el('div', { class: 'pt-name', style: { fontSize: '26px' }, text: caught ? caught + ' wurde erwischt!' : 'Der Impostor entkommt!' }),
            el('p', { class: 'b-h', text: (imps.length > 1 ? 'Impostor: ' : 'Impostor war: ') + imps.join(' & ') }),
            caught ? el('p', { class: 'b-hint', text: 'Das Wort wird nach dem Rateversuch verraten.' }) : wordLine()
          ]),
          lines
        ];
        if(caught){
          kids.push(el('p', { class: 'b-h b-center', text: caught + ', errätst du das Wort?' }),
            el('p', { class: 'b-hint b-center', text: 'Erst laut raten, dann ehrlich tippen.' }),
            el('div', { class: 'b-grid2' }, [
              el('button', { class: 'b-btn ghost', text: '✗ Nicht erraten', onclick: () => { api.sound('bad'); finishRound(false); } }),
              el('button', { class: 'b-btn pt-good', text: '✓ Erraten (+1)', onclick: () => { api.sound('good'); finishRound(true); } })
            ]));
        }else kids.push(el('button', { class: 'b-btn block pt-big', text: 'Punkte verteilen →', onclick: () => finishRound(false) }));
        screen(root, kids);
      };
      revealNext();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   5) TABU
   ===================================================================== */
const TABU = `Pizza|Italien|Käse|Teig|Ofen|Salami
Schnitzel|Wien|Fleisch|Panier|paniert|Kalb
Fußball|Tor|Ball|Spieler|Elfmeter|Stadion
Handy|telefonieren|Smartphone|Display|App|Akku
Weihnachten|Christkind|Geschenke|Baum|Dezember|Advent
Schule|Lehrer|Klasse|lernen|Unterricht|Hausübung
Sonne|hell|warm|Stern|Himmel|Sommer
Kühlschrank|kalt|Küche|Essen|kühlen|Gefrierfach
Zahnbürste|Zähne|putzen|Zahnpasta|Mund|Borsten
Regenschirm|Regen|nass|aufspannen|Wetter|trocken
Elefant|Rüssel|groß|grau|Afrika|Stoßzähne
Minecraft|Blöcke|bauen|Creeper|Spiel|Steve
Geburtstag|Torte|Kerzen|Party|Geschenk|feiern
Feuerwehr|Brand|löschen|Wasser|Sirene|rot
Kino|Film|Leinwand|Popcorn|Ticket|schauen
Bibliothek|Bücher|leihen|lesen|leise|ausborgen
Zahnarzt|Zähne|Bohrer|Loch|Praxis|Karies
Schneemann|Schnee|Karotte|Winter|bauen|Kugel
Kaffee|Bohnen|trinken|Tasse|Koffein|Espresso
Fahrrad|Pedale|treten|Räder|Lenker|Helm
Gitarre|Saiten|Instrument|spielen|Musik|zupfen
Hausübung|Schule|Aufgabe|daheim|Lehrer|machen
Pinguin|Vogel|Eis|Antarktis|watscheln|schwarz
Burger|Brötchen|Fleisch|Laberl|Fast Food|McDonald's
Achterbahn|Freizeitpark|Looping|schnell|fahren|schreien
Astronaut|Weltraum|Rakete|Mond|Anzug|NASA
Zauberer|Magie|Zauberstab|Hut|Trick|Harry Potter
Wecker|klingeln|aufwachen|Uhr|morgens|Schlummern
Toaster|Brot|Toast|heiß|Küche|springen
Schokolade|Kakao|süß|braun|Tafel|Milka
Eis|kalt|Kugel|Waffel|Sommer|lecken
Bett|schlafen|Decke|Kissen|liegen|Matratze
Schwimmbad|Wasser|Becken|baden|Rutsche|Bademeister
Polizei|Verbrecher|Blaulicht|Uniform|verhaften|Streife
Krankenhaus|Arzt|krank|Patient|Operation|Notaufnahme
Flugzeug|fliegen|Pilot|Flughafen|Flügel|Urlaub
Zug|Schienen|Bahnhof|ÖBB|Waggon|fahren
Spinne|Netz|acht|Beine|krabbeln|Angst
Hund|bellen|Gassi|Haustier|Wau|Leine
Katze|miauen|Haustier|Maus|schnurren|Pfoten
Drache|Feuer|fliegen|Fantasy|Schuppen|speien
Vampir|Blut|beißen|Dracula|Zähne|Nacht
Geist|Gespenst|Spuk|unsichtbar|Halloween|Buh
Halloween|Kürbis|verkleiden|Süßes|Saures|Oktober
Ostern|Hase|Eier|suchen|färben|Frühling
Silvester|Feuerwerk|Neujahr|Mitternacht|Raketen|31.
Strand|Sand|Meer|Urlaub|Sonne|Handtuch
Berg|hoch|wandern|Gipfel|Alpen|klettern
Ski|Schnee|Piste|fahren|Lift|Winter
Kamera|Foto|fotografieren|Objektiv|Bild|knipsen
Fernseher|TV|schauen|Bildschirm|Fernbedienung|Programm
Laptop|Computer|Tastatur|klappen|tragbar|Bildschirm
Kopfhörer|Musik|Ohren|hören|Bluetooth|Kabel
Tastatur|tippen|Tasten|Computer|Buchstaben|schreiben
Maus|Computer|klicken|Tier|Käse|Zeiger
YouTube|Video|Kanal|abonnieren|schauen|YouTuber
TikTok|Video|App|kurz|tanzen|Trend
Selfie|Foto|Handy|selbst|Kamera|posten
Emoji|Smiley|Gesicht|Nachricht|lachen|Bild
WLAN|Internet|Passwort|Router|kabellos|online
Akku|laden|leer|Handy|Strom|Prozent
Ladekabel|Handy|Akku|Strom|Steckdose|anstecken
Roboter|Maschine|Metall|programmieren|Mensch|künstlich
Rakete|Weltraum|Start|fliegen|Countdown|Feuer
Mond|Nacht|Erde|Astronaut|rund|Vollmond
Stern|Himmel|Nacht|leuchten|funkeln|Sonne
Regenbogen|Farben|Regen|Sonne|bunt|Bogen
Gewitter|Blitz|Donner|Regen|Wolken|Sturm
Schnee|weiß|kalt|Winter|Flocken|Schneemann
Vulkan|Lava|Ausbruch|Berg|heiß|Asche
Dinosaurier|ausgestorben|groß|T-Rex|Urzeit|Fossil
Hai|Meer|Fisch|Zähne|Flosse|gefährlich
Delfin|Meer|klug|springen|Säugetier|Flosse
Giraffe|Hals|lang|Afrika|Flecken|groß
Affe|Banane|klettern|Dschungel|Zoo|Gorilla
Löwe|König|Mähne|Raubkatze|brüllen|Afrika
Biene|Honig|summen|stechen|gelb|Blume
Schmetterling|Raupe|Flügel|bunt|fliegen|Insekt
Kuh|Milch|muhen|Bauernhof|Alm|Flecken
Huhn|Ei|gackern|Bauernhof|Vogel|Hahn
Pferd|reiten|Sattel|wiehern|Stall|Hufe
Hase|Ostern|Ohren|hoppeln|Karotte|Kaninchen
Banane|gelb|krumm|Obst|Affe|schälen
Apfel|Obst|rot|grün|Baum|Kern
Erdbeere|rot|Obst|süß|Sommer|Marmelade
Karotte|orange|Gemüse|Hase|Rübe|Möhre
Kartoffel|Erdäpfel|Pommes|Gemüse|Püree|Knolle
Nudeln|Pasta|Spaghetti|Italien|kochen|Sauce
Brot|Bäcker|backen|Semmel|Teig|Scheibe
Käse|Milch|gelb|Loch|Pizza|Emmentaler
Popcorn|Kino|Mais|knallen|salzig|süß
Pommes|Kartoffel|frittiert|Ketchup|Mayo|Fast Food
Döner|Kebab|Fleisch|Brot|Sauce|Zwiebel
Kaiserschmarrn|Mehlspeise|Rosinen|süß|Pfanne|Staubzucker
Palatschinken|Pfannkuchen|Marmelade|süß|Teig|Pfanne
Sachertorte|Schokolade|Wien|Kuchen|Marillen|Hotel
Mozartkugel|Salzburg|Schokolade|Marzipan|rund|Süßigkeit
Wien|Hauptstadt|Österreich|Stephansdom|Prater|Donau
Salzburg|Mozart|Stadt|Festung|Österreich|Festspiele
Prater|Wien|Riesenrad|Wurstelprater|Park|Fahrgeschäfte
Riesenrad|drehen|Prater|hoch|Gondel|Jahrmarkt
Fahrschule|Führerschein|Auto|Prüfung|Fahrlehrer|lernen
Führerschein|Auto|fahren|Prüfung|Karte|Fahrschule
Tankstelle|Benzin|Diesel|tanken|Auto|Zapfsäule
Ampel|rot|grün|gelb|Straße|stehen
Bus|Haltestelle|fahren|Fahrer|Linie|öffentlich
Taxi|fahren|bezahlen|Auto|Fahrer|gelb
Hubschrauber|fliegen|Rotor|Helikopter|Rettung|Propeller
U-Boot|Wasser|tauchen|unter|Schiff|Meer
Pirat|Schiff|Schatz|Augenklappe|Papagei|Meer
Ritter|Rüstung|Schwert|Burg|Pferd|Mittelalter
Prinzessin|Krone|Schloss|König|Märchen|Prinz
Burg|Ritter|Mauern|Turm|Mittelalter|Schloss
Schatz|Gold|suchen|Karte|Pirat|Truhe
Superheld|Kraft|retten|Umhang|Marvel|Bösewicht
Spider-Man|Spinne|Netz|Marvel|Peter Parker|Superheld
Batman|Fledermaus|Gotham|Joker|Superheld|Bruce Wayne
Pokémon|Pikachu|fangen|Ball|Trainer|Spiel
Mario|Nintendo|Klempner|Luigi|Pilz|springen
Konsole|Spiel|PlayStation|Xbox|Controller|zocken
Controller|Knöpfe|Konsole|spielen|Joystick|halten
Zocken|spielen|Videospiel|Konsole|PC|Gamer
Level|Spiel|aufsteigen|Stufe|schaffen|nächste
Schach|König|Dame|Brett|matt|Figuren
Würfel|sechs|Augen|werfen|Spiel|Zahl
Puzzle|Teile|zusammensetzen|Bild|legen|Ecken
Uno|Karten|Farbe|ziehen|Spiel|rufen
Karaoke|singen|Mikrofon|Lied|Text|Bildschirm
Tanzen|Musik|bewegen|Party|Tanzfläche|Schritte
Disco|tanzen|Musik|Party|Licht|DJ
DJ|Musik|auflegen|Party|Mischpult|Platten
Konzert|Musik|Band|Bühne|live|Karten
Mikrofon|sprechen|singen|laut|Bühne|Mikro
Zeitung|lesen|Nachrichten|Papier|täglich|Artikel
Brief|Post|schreiben|Kuvert|Briefmarke|schicken
Briefträger|Post|Brief|Paket|zustellen|Briefkasten
Geld|Euro|bezahlen|Münzen|Scheine|Bank
Bank|Geld|Konto|sparen|sitzen|Park
Supermarkt|einkaufen|Kassa|Wagerl|Lebensmittel|Regal
Einkaufswagen|Supermarkt|schieben|Räder|einkaufen|Münze
Lehrer|Schule|unterrichten|Klasse|Tafel|Schüler
Arzt|krank|Praxis|Medizin|Spital|untersuchen
Koch|kochen|Küche|Restaurant|Essen|Mütze
Friseur|Haare|schneiden|Schere|Frisur|Salon
Bäcker|Brot|backen|Semmel|früh|Ofen
Elektriker|Strom|Kabel|Steckdose|Licht|reparieren
Pilot|fliegen|Flugzeug|Cockpit|Kapitän|Flughafen
Clown|Zirkus|lustig|Nase|rot|lachen
Zirkus|Zelt|Clown|Akrobat|Manege|Tiere
Zoo|Tiere|Gehege|besuchen|Tierpark|Löwen
Bauernhof|Tiere|Kuh|Traktor|Bauer|Stall
Traktor|Bauer|Feld|fahren|Landwirtschaft|grün
Garten|Blumen|Rasen|gießen|draußen|Pflanzen
Blume|Blüte|duften|Garten|Rose|pflücken
Baum|Holz|Blätter|Wald|Stamm|grün
Wald|Bäume|Natur|spazieren|Tiere|grün
Zelt|Camping|schlafen|draußen|aufbauen|Heringe
Lagerfeuer|Holz|Feuer|Camping|Marshmallow|Wärme
Taschenlampe|Licht|dunkel|Batterie|leuchten|Nacht
Spiegel|Gesicht|sehen|Glas|Bad|reflektieren
Dusche|Wasser|waschen|Bad|nass|Shampoo
Seife|waschen|Hände|sauber|Schaum|Bad
Klopapier|Toilette|Rolle|Papier|WC|abwischen
Staubsauger|saugen|Staub|putzen|Boden|laut
Waschmaschine|Wäsche|waschen|Kleidung|schleudern|Trommel
Socken|Füße|Paar|anziehen|Schuhe|Wäsche
Brille|Augen|sehen|Gläser|Optiker|tragen
Uhr|Zeit|Zeiger|Stunde|Armband|tickt
Kalender|Datum|Monat|Tag|Jahr|Termin
Wochenende|Samstag|Sonntag|frei|Schule|ausschlafen
Ferien|Schule|frei|Sommer|Urlaub|Zeugnis
Zeugnis|Noten|Schule|Ende|Semester|Eltern
Schularbeit|Test|Prüfung|Note|lernen|Schule
Pause|Schule|Glocke|Jause|Hof|kurz
Jause|essen|Pause|Brot|Schule|Snack
Turnsaal|Sport|Schule|Halle|Turnen|Geräte
Rucksack|tragen|Schultasche|Rücken|packen|Wandern
Schere|schneiden|Papier|basteln|scharf|Klinge
Kleber|kleben|basteln|Papier|Klebstoff|Tube
Bleistift|schreiben|Mine|Holz|radieren|spitzen
Radiergummi|Bleistift|löschen|Fehler|weg|rubbeln
Hamster|Haustier|Käfig|Laufrad|klein|Nager
Goldfisch|Aquarium|Wasser|orange|Haustier|schwimmen
Eule|Vogel|Nacht|weise|Uhu|Hogwarts
Zombie|untot|Apokalypse|Gehirn|langsam|Film
Alien|außerirdisch|Ufo|Weltall|grün|Mars
Ufo|Alien|fliegen|Untertasse|Weltall|unbekannt
Einhorn|Horn|Pferd|Fantasy|Regenbogen|weiß
Meerjungfrau|Fisch|Schwanz|Meer|Arielle|Flosse
Hexe|Besen|Zauber|Hut|Halloween|Kessel
Schneeballschlacht|Schnee|werfen|Winter|Kugel|treffen
Iglu|Eis|Schnee|Haus|Inuit|bauen
Hängematte|liegen|schaukeln|Garten|Netz|Urlaub
Luftballon|aufblasen|platzen|Party|Gummi|Helium
Seifenblase|Seife|platzen|pusten|rund|schillern
Trampolin|springen|hüpfen|Garten|Netz|hoch
Rutsche|rutschen|Spielplatz|Schwimmbad|runter|Kinder
Schaukel|Spielplatz|hin|her|sitzen|schwingen
Kaugummi|kauen|Blase|Mund|kleben|Pfefferminz
Zahnfee|Zahn|Kopfkissen|Münze|Kind|Milchzahn
Weihnachtsmann|Bart|rot|Geschenke|Rentier|Nordpol
Rentier|Geweih|Schlitten|Weihnachtsmann|Rudolph|Nase
Pyjama|schlafen|anziehen|Bett|Nacht|gemütlich
Wikinger|Helm|Schiff|Norden|Hörner|Krieger
Mumie|Ägypten|Pyramide|Binden|Pharao|Grab
Pyramide|Ägypten|Pharao|Dreieck|Wüste|Stein
Kompass|Norden|Richtung|Nadel|Karte|wandern
Leuchtturm|Licht|Meer|Schiffe|Turm|Küste`.split('\n').map(l => l.split('|'));

BORED.registerGame({
  id: 'tabu', name: 'Tabu', icon: '🚫', cat: 'party', players: '2-10',
  desc: 'Erklär den Begriff – aber die fünf verbotenen Wörter darfst du nicht sagen!',
  rules: [
    'Ihr spielt in 2 Teams. Pro Zug erklärt eine Person, das eigene Team rät.',
    'Ihr habt 60 Sekunden. Die verbotenen Wörter (auch Teile davon) sind tabu – genauso wie Gesten und „klingt wie …“.',
    'Ein Mitglied des anderen Teams schaut mit und drückt TABU, wenn etwas Verbotenes gesagt wird.',
    'Richtig = +1, Tabu = −1, Skip = 0. Nach allen Runden gewinnt das Team mit den meisten Punkten.'
  ],
  tags: ['freunde', 'drinnen', 'lang'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    let teams = null;
    const mkTeams = (players, shuffle) => {
      const p = shuffle ? api.shuffle(players) : players.slice();
      const A = [], B = [];
      p.forEach((n, i) => (i % 2 ? B : A).push(n));
      return [{ name: 'Team Neon', icon: '💜', m: A }, { name: 'Team Cyber', icon: '💙', m: B }];
    };
    const menu = () => {
      const players = getPlayers();
      const prev = teams && teams[0].m.concat(teams[1].m).sort().join('|') === players.slice().sort().join('|');
      if(!prev) teams = mkTeams(players, false);
      const tbox = el('div', { class: 'b-card' });
      const renderT = () => {
        tbox.innerHTML = '';
        tbox.append(el('div', { class: 'b-between', style: { marginBottom: '8px' } }, [el('span', { class: 'b-label', style: { margin: 0 }, text: 'Teams' }),
          el('button', { class: 'b-btn sm ghost', text: '🔀 Mischen', onclick: () => { teams = mkTeams(getPlayers(), true); api.sound('flip'); renderT(); } })]));
        teams.forEach(t => tbox.append(el('p', { style: { fontSize: '15px', marginBottom: '4px' } }, [el('b', { text: t.icon + ' ' + t.name + ': ' }), document.createTextNode(t.m.join(', ') || '–')])));
        tbox.append(el('p', { class: 'b-hint', text: 'Teams werden aus der Spielerliste gebildet. Nach dem Bearbeiten der Spieler einmal „Mischen“ tippen.' }));
      };
      renderT();
      partyStart(root, api, {
        min: 4,
        modes: [{ id: '3', label: '3 Runden' }, { id: '5', label: '5 Runden' }, { id: '8', label: '8 Runden' }],
        bestLabel: 'Rekord',
        extra: tbox,
        onStart: (l, mode, players) => {
          if(teams[0].m.concat(teams[1].m).sort().join('|') !== players.slice().sort().join('|')) teams = mkTeams(players, false);
          if(!teams[0].m.length || !teams[1].m.length){ api.toast('Beide Teams brauchen Spieler'); return; }
          play(+mode);
        }
      });
    };
    function play(rounds){
      const sc = [0, 0], who = [0, 0], d = deck(api, 'tabu', TABU);
      let round = 0, team = 0, stats = { ok: 0, tabu: 0, skip: 0 };
      const scoreObj = () => ({ [teams[0].icon + ' ' + teams[0].name]: sc[0], [teams[1].icon + ' ' + teams[1].name]: sc[1] });
      const end = () => endScreen(root, api, { ctx, scores: scoreObj(), rankTitle: 'Teamwertung', xp: 22, lines: [['Erraten', stats.ok], ['Tabu', stats.tabu]], onAgain: () => play(rounds), onMenu: menu });
      function ready(){
        if(round >= rounds) return end();
        const T = teams[team], exp = T.m[who[team] % T.m.length];
        const other = teams[1 - team];
        screen(root, [
          topBar(api, 'Runde ' + (round + 1) + '/' + rounds, () => showScores(api, scoreObj(), 'Teamwertung'), end),
          el('div', { class: 'b-grid2' }, teams.map((t, i) => el('div', { class: 'b-stat', style: i === team ? { borderColor: 'var(--cyan)', boxShadow: 'var(--glow-c)' } : {} }, [el('small', { text: t.icon + ' ' + t.name }), el('b', { text: sc[i] })]))),
          el('div', { class: 'pt-card cyan', style: { minHeight: '240px' } }, [
            el('div', { class: 'b-kicker', text: T.icon + ' ' + T.name + ' ist dran' }),
            el('p', { class: 'b-h', text: 'Es erklärt:' }), el('div', { class: 'pt-name', text: exp }),
            el('p', { class: 'b-hint', text: 'Jemand aus ' + other.name + ' (' + other.m.join(', ') + ') schaut mit und drückt TABU.' })
          ]),
          el('button', { class: 'b-btn block pt-huge', text: '▶ 60 Sekunden starten', onclick: () => { api.sound('good'); turn(exp); } })
        ]);
      }
      function turn(exp){
        let got = 0, tb = 0, sk = 0;
        const holder = el('div');
        const cnt = el('span', { class: 'b-pill good', text: '+0' });
        const finishTurn = () => {
          t.stop(); sc[team] += got - tb;
          stats.ok += got; stats.tabu += tb; stats.skip += sk;
          who[team]++;
          if(team === 1) round++;
          team = 1 - team;
          api.sound('lose');
          screen(root, [
            el('div', { class: 'pt-card pink' }, [el('div', { style: { fontSize: '50px' }, text: '⏰' }), el('div', { class: 'pt-name', text: 'Zeit um!' }),
              el('p', { class: 'b-h', text: exp + ': ' + (got - tb >= 0 ? '+' : '') + (got - tb) }),
              el('p', { class: 'b-hint', text: got + ' richtig · ' + tb + ' Tabu · ' + sk + ' übersprungen' })]),
            el('div', { class: 'b-grid2' }, teams.map((x, i) => el('div', { class: 'b-stat' }, [el('small', { text: x.icon + ' ' + x.name }), el('b', { text: sc[i] })]))),
            el('button', { class: 'b-btn block pt-big', text: round >= rounds ? 'Zum Ergebnis →' : 'Nächstes Team →', onclick: () => { api.sound('click'); ready(); } })
          ]);
        };
        const t = timer(ctx, api, 60, finishTurn);
        const show = () => {
          const c = d.next();
          holder.innerHTML = '';
          holder.append(el('div', { class: 'pt-tabu b-pop' }, [el('div', { class: 'h', text: c[0] }), el('ul', {}, c.slice(1).map(w => el('li', { text: w })))]));
        };
        const upd = () => { const v = got - tb; cnt.textContent = (v >= 0 ? '+' : '') + v; cnt.className = 'b-pill ' + (v >= 0 ? 'good' : 'bad'); };
        show();
        screen(root, [
          el('div', { class: 'b-between' }, [el('span', { class: 'b-pill cyan', text: teams[team].icon + ' ' + exp }), cnt]),
          t.node, holder,
          el('div', { class: 'pt-btn3' }, [
            el('button', { class: 'b-btn danger', onclick: () => { tb++; api.sound('bad'); api.vibrate(120); upd(); show(); } }, [el('span', { text: '🚫' }), 'Tabu']),
            el('button', { class: 'b-btn ghost', onclick: () => { sk++; api.sound('flip'); show(); } }, [el('span', { text: '⏭️' }), 'Skip']),
            el('button', { class: 'b-btn pt-good', onclick: () => { got++; api.sound('good'); api.vibrate(30); upd(); show(); } }, [el('span', { text: '✓' }), 'Richtig'])
          ])
        ]);
      }
      ready();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   6) KATEGORIEN-BATTLE (Stadt-Land-Fluss-Stil)
   ===================================================================== */
const CAT_ALL = ['Stadt', 'Land', 'Fluss', 'Name', 'Tier', 'Beruf', 'Essen', 'Getränk', 'Marke', 'Sportart', 'Film oder Serie', 'Videospiel',
  'Pflanze', 'Obst oder Gemüse', 'Körperteil', 'Kleidung', 'Musikinstrument', 'Fahrzeug', 'Hobby', 'Süßigkeit', 'Gegenstand im Zimmer',
  'Etwas in der Schule', 'Ausrede fürs Zuspätkommen', 'Film- oder Spielfigur', 'Gefühl', 'App oder Website', 'Märchenfigur', 'Werkzeug',
  'Etwas im Kühlschrank', 'Etwas Rundes', 'Etwas, das stinkt', 'Land in Europa', 'Lied oder Band', 'Superkraft', 'Promi'];
const CAT_DEF = ['Stadt', 'Land', 'Fluss', 'Name', 'Tier', 'Beruf'];
const CAT_LETTERS = 'ABDEFGHIKLMNOPRSTUWZ'.split('');

BORED.registerGame({
  id: 'categories', name: 'Kategorien-Battle', icon: '🔤', cat: 'party', players: '2-10',
  desc: 'Stadt, Land, Fluss in neu: Buchstabe würfeln, Kategorien füllen, Punkte kassieren.',
  rules: [
    'Jede Person braucht Zettel und Stift (oder die Notiz-App am eigenen Handy).',
    'Wählt eure Kategorien und die Zeit. Dann würfelt die App einen Buchstaben.',
    'Schreibt zu jeder Kategorie ein Wort mit diesem Anfangsbuchstaben. Wer fertig ist, ruft STOPP!',
    'Punkte: 10 für ein Wort, das sonst niemand hat, 5 wenn es jemand anderes auch hat, 20 wenn nur du überhaupt eins hast.',
    'Die Punkte tragt ihr danach selbst ein. Nach den Runden gewinnt, wer die meisten Punkte hat.'
  ],
  tags: ['freunde', 'drinnen', 'lang'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    let chosen = api.store.get('cats', CAT_DEF.slice());
    if(!Array.isArray(chosen) || !chosen.length) chosen = CAT_DEF.slice();
    chosen = chosen.filter(c => CAT_ALL.includes(c));
    let secs = api.store.get('secs', 120);
    const menu = () => {
      const cChips = el('div', { class: 'b-chips' });
      const cnt = el('span', { class: 'b-label', style: { margin: 0 } });
      const rC = () => {
        cChips.innerHTML = '';
        CAT_ALL.forEach(c => cChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(chosen.includes(c)), text: c, onclick: () => {
          const i = chosen.indexOf(c);
          if(i >= 0){ if(chosen.length <= 3){ api.toast('Mindestens 3 Kategorien'); return; } chosen.splice(i, 1); }
          else { if(chosen.length >= 10){ api.toast('Maximal 10 Kategorien'); return; } chosen.push(c); }
          api.store.set('cats', chosen); api.sound('click'); rC();
        } })));
        cnt.textContent = 'Kategorien (' + chosen.length + '/10)';
      };
      rC();
      const tChips = el('div', { class: 'b-chips' });
      const rT = () => { tChips.innerHTML = ''; [[60, '1 Min'], [90, '1:30'], [120, '2 Min'], [180, '3 Min']].forEach(([v, l]) => tChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(secs === v), text: l, onclick: () => { secs = v; api.store.set('secs', v); api.sound('click'); rT(); } }))); };
      rT();
      partyStart(root, api, {
        modes: [{ id: '3', label: '3 Runden' }, { id: '5', label: '5 Runden' }, { id: '0', label: 'Endlos' }],
        bestLabel: 'Rekord',
        extra: el('div', { class: 'b-stack tight' }, [
          el('div', {}, [el('div', { class: 'b-between', style: { marginBottom: '6px' } }, [cnt, el('button', { class: 'b-btn sm ghost', text: '🎲 Zufällig', onclick: () => { chosen = api.shuffle(CAT_ALL).slice(0, 6); api.store.set('cats', chosen); api.sound('flip'); rC(); } })]), cChips]),
          el('div', {}, [el('span', { class: 'b-label', text: 'Zeit pro Runde' }), tChips])
        ]),
        onStart: (l, mode, players) => play(+mode, players)
      });
    };
    function play(rounds, players){
      const scores = zeroScores(players);
      let round = 0;
      const used = [];
      const cats = chosen.slice();
      const end = () => endScreen(root, api, { ctx, scores, xp: 22, lines: [['Runden', round], ['Buchstaben', used.join(' ') || '–']], onAgain: () => play(rounds, players), onMenu: menu });
      function roll(){
        if(rounds && round >= rounds) return end();
        const pool = CAT_LETTERS.filter(x => !used.includes(x));
        const letter = api.pick(pool.length ? pool : CAT_LETTERS);
        used.push(letter);
        const big = el('div', { class: 'pt-letter spin', text: '?' });
        const startBtn = el('button', { class: 'b-btn block pt-huge', text: '⏱ Timer starten', disabled: true, onclick: () => { api.sound('good'); write(letter); } });
        screen(root, [
          topBar(api, 'Runde ' + (round + 1) + (rounds ? '/' + rounds : ''), () => showScores(api, scores), end),
          el('div', { class: 'pt-card', style: { minHeight: '260px' } }, [el('div', { class: 'b-kicker', text: 'Euer Buchstabe' }), big]),
          el('div', { class: 'pt-chipline' }, cats.map(c => el('span', { text: c }))),
          startBtn
        ]);
        let n = 0;
        const spin = ctx.iv(() => {
          big.textContent = api.pick(CAT_LETTERS); api.sound('tick'); n++;
          if(n > 18){
            ctx.stop(spin); big.textContent = letter; big.className = 'pt-letter land';
            api.sound('check'); api.vibrate(60); startBtn.disabled = false;
          }
        }, 80);
      }
      function write(letter){
        const t = timer(ctx, api, secs, () => { api.toast('⏰ Stifte weg!'); score(letter); }, { warn: 15 });
        screen(root, [
          el('div', { class: 'b-between' }, [el('span', { class: 'b-pill cyan', text: 'Runde ' + (round + 1) }), el('span', { class: 'b-kicker', text: 'Schreibt!' })]),
          el('div', { class: 'pt-letter', style: { fontSize: '110px' }, text: letter }),
          t.node,
          el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: 'Kategorien' }),
            el('div', { class: 'b-stack tight' }, cats.map(c => el('div', { class: 'b-h', style: { fontSize: '19px', textTransform: 'none' }, text: '▸ ' + c + ' mit ' + letter })))]),
          el('button', { class: 'b-btn danger block pt-big', text: '✋ STOPP!', onclick: () => { t.stop(); api.sound('bad'); api.vibrate(200); score(letter); } })
        ]);
      }
      function score(letter){
        ctx.clear();
        const add = {}; players.forEach(p => add[p] = 0);
        const rows = el('div', { class: 'b-stack tight' });
        const render = () => {
          rows.innerHTML = '';
          players.forEach(p => {
            const val = el('b', { text: String(add[p]) });
            const mk = (lbl, d) => el('button', { class: 'b-btn sm ' + (d < 0 ? 'ghost' : ''), text: lbl, onclick: () => { add[p] = clamp(add[p] + d, 0, 999); api.sound(d < 0 ? 'click' : 'pop'); val.textContent = String(add[p]); } });
            rows.append(el('div', { class: 'b-card', style: { padding: '10px 12px' } }, [
              el('div', { class: 'b-between' }, [el('b', { style: { fontFamily: 'var(--head)', fontSize: '19px' }, text: p }), el('div', { class: 'pt-cnt' }, [el('small', { class: 'b-hint', text: 'Runde:' }), val])]),
              el('div', { class: 'b-row', style: { gap: '6px', marginTop: '6px' } }, [mk('+5', 5), mk('+10', 10), mk('+20', 20), mk('−5', -5)])
            ]));
          });
        };
        render();
        screen(root, [
          el('div', { class: 'b-between' }, [el('span', { class: 'b-pill cyan', text: 'Buchstabe ' + letter }), el('span', { class: 'b-kicker', text: 'Punkte vergeben' })]),
          el('p', { class: 'b-hint', text: 'Vergleicht eure Wörter Kategorie für Kategorie: einzigartig +10 · doppelt +5 · nur du hast eins +20.' }),
          rows,
          el('button', { class: 'b-btn block pt-big', text: 'Runde speichern ✓', onclick: () => {
            players.forEach(p => scores[p] += add[p]); round++; api.sound('good');
            screen(root, [
              topBar(api, 'Nach Runde ' + round, null, null),
              el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: 'Gesamtstand' }), rankList(scores)]),
              el('button', { class: 'b-btn block pt-big', text: rounds && round >= rounds ? 'Zum Ergebnis →' : '🎲 Nächster Buchstabe', onclick: () => { api.sound('click'); roll(); } }),
              rounds && round >= rounds ? null : el('button', { class: 'b-btn ghost block', text: 'Spiel beenden', onclick: end })
            ]);
          } })
        ]);
      }
      roll();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   7) SCHÄTZDUELL
   ===================================================================== */
// [Frage, Antwort (Zahl), Einheit, Erklärung]
const EST = [
  ['Wie viele Knochen hat ein erwachsener Mensch?', 206, 'Knochen', 'Ein Erwachsener hat 206 Knochen. Babys haben bei der Geburt deutlich mehr Knochenteile – viele wachsen später zusammen.'],
  ['Wie hoch ist der Großglockner, Österreichs höchster Berg?', 3798, 'm', 'Der Großglockner in den Hohen Tauern ist 3.798 m hoch (genauer: rund 3.797,7 m).'],
  ['Wie hoch ist der Mount Everest?', 8849, 'm', 'Nach der gemeinsamen Vermessung von China und Nepal 2020 ist der Everest 8.848,86 m hoch.'],
  ['Wie hoch ist die Zugspitze, Deutschlands höchster Berg?', 2962, 'm', 'Die Zugspitze an der Grenze zu Tirol ist 2.962 m hoch.'],
  ['Wie viele Tasten hat ein normales Klavier?', 88, 'Tasten', 'Ein Standardklavier hat 88 Tasten: 52 weiße und 36 schwarze.'],
  ['Wie viele Länder sind Mitglied der EU (Stand 2026)?', 27, 'Länder', 'Seit dem Austritt Großbritanniens 2020 hat die EU 27 Mitgliedstaaten.'],
  ['Wie viele chemische Elemente gibt es im Periodensystem (offiziell benannt)?', 118, 'Elemente', 'Mit Oganesson (Nr. 118) sind 118 Elemente offiziell anerkannt und benannt.'],
  ['Wie viele Mitgliedstaaten haben die Vereinten Nationen (UNO)?', 193, 'Staaten', 'Seit dem Beitritt des Südsudan 2011 hat die UNO 193 Mitgliedstaaten.'],
  ['Wie viele Chromosomen hat eine menschliche Körperzelle normalerweise?', 46, 'Chromosomen', '46 Chromosomen – also 23 Paare, je eines von Mutter und Vater.'],
  ['Wie viele Zähne hat ein vollständiges Erwachsenengebiss (mit Weisheitszähnen)?', 32, 'Zähne', 'Ein komplettes bleibendes Gebiss hat 32 Zähne, inklusive der 4 Weisheitszähne.'],
  ['Wie viele Milchzähne hat ein Kind?', 20, 'Zähne', 'Das Milchgebiss besteht aus 20 Zähnen.'],
  ['Wie viele Herzen hat ein Oktopus?', 3, 'Herzen', 'Oktopusse haben 3 Herzen: zwei pumpen Blut durch die Kiemen, eines durch den Körper.'],
  ['Wie viele Augen hat eine Honigbiene?', 5, 'Augen', 'Bienen haben 2 große Facettenaugen und 3 kleine Punktaugen auf dem Kopf – also 5.'],
  ['Wie viele Beine hat ein Hummer?', 10, 'Beine', 'Hummer gehören zu den Zehnfußkrebsen – sie haben 10 Beine, die vorderen tragen die Scheren.'],
  ['Wie viele Felder hat ein Schachbrett?', 64, 'Felder', '8 × 8 = 64 Felder.'],
  ['Wie viele Felder hat ein Sudoku?', 81, 'Felder', '9 × 9 = 81 Felder.'],
  ['Wie viele Felder hat ein klassisches Monopoly-Spielbrett rundherum?', 40, 'Felder', 'Das Monopoly-Brett hat 40 Felder inklusive Los, Gefängnis, Frei Parken und „Gehe ins Gefängnis“.'],
  ['Wie viele Steine hat ein normales Domino-Spiel (Doppel-Sechs)?', 28, 'Steine', 'Ein Doppel-Sechs-Domino hat 28 Steine – jede Kombination von 0 bis 6 genau einmal.'],
  ['Wie viele Karten hat ein Poker- bzw. Rommé-Blatt ohne Joker?', 52, 'Karten', '4 Farben × 13 Werte = 52 Karten.'],
  ['Wie viele Augen hat ein normaler Spielwürfel insgesamt?', 21, 'Augen', '1 + 2 + 3 + 4 + 5 + 6 = 21.'],
  ['Wie viele farbige Felder (Sticker) hat ein klassischer Zauberwürfel?', 54, 'Felder', '6 Seiten × 9 Felder = 54.'],
  ['Wie viele Pokémon gab es in der allerersten Generation?', 151, 'Pokémon', 'Pokémon Rot und Grün starteten mit 151 Pokémon – von Bisasam bis Mew.'],
  ['Wie viele Sinfonien hat Beethoven vollendet?', 9, 'Sinfonien', 'Beethoven schrieb 9 Sinfonien – die 9. enthält die „Ode an die Freude“, heute die Europahymne.'],
  ['Wie lang ist ein Marathon – in Metern?', 42195, 'm', 'Ein Marathon ist genau 42,195 km lang.'],
  ['Wie hoch hängt ein Basketballkorb – in Zentimetern?', 305, 'cm', 'Der Ring hängt 10 Fuß hoch, das sind 3,05 m.'],
  ['Wie breit ist ein Fußballtor – in Zentimetern?', 732, 'cm', 'Ein Fußballtor ist 7,32 m breit (8 Yards) und 2,44 m hoch (8 Fuß).'],
  ['Wie viele Meter legt der Schall pro Sekunde in Luft zurück (bei 20 °C)?', 343, 'm/s', 'Bei 20 °C breitet sich Schall in Luft mit etwa 343 m pro Sekunde aus.'],
  ['Wie viele Kilometer legt Licht pro Sekunde zurück (im Vakuum)?', 299792, 'km/s', 'Die Lichtgeschwindigkeit beträgt 299.792,458 km pro Sekunde.'],
  ['Wie weit ist der Mond im Durchschnitt von der Erde entfernt – in km?', 384400, 'km', 'Die mittlere Entfernung Erde–Mond beträgt rund 384.400 km.'],
  ['Wie lang ist der Erdumfang am Äquator – in km?', 40075, 'km', 'Der Äquator ist rund 40.075 km lang.'],
  ['Wie viele Minuten braucht das Sonnenlicht ungefähr bis zur Erde?', 8, 'Minuten', 'Rund 8 Minuten und 20 Sekunden – die Sonne ist ca. 150 Millionen km entfernt.'],
  ['Wie viele Planeten hat unser Sonnensystem?', 8, 'Planeten', 'Seit 2006 zählt Pluto als Zwergplanet – es bleiben 8 Planeten.'],
  ['Wie viele Monde hat der Mars?', 2, 'Monde', 'Der Mars hat 2 kleine Monde: Phobos und Deimos.'],
  ['Wie hoch ist der Burj Khalifa in Dubai?', 828, 'm', 'Der Burj Khalifa ist 828 m hoch und seit 2010 das höchste Gebäude der Welt.'],
  ['Wie viele Minuten hat ein Tag?', 1440, 'Minuten', '24 × 60 = 1.440 Minuten.'],
  ['Wie viele Stunden hat eine Woche?', 168, 'Stunden', '7 × 24 = 168 Stunden.'],
  ['Wie viele Sekunden hat ein Tag?', 86400, 'Sekunden', '24 × 60 × 60 = 86.400 Sekunden.'],
  ['An wie viele Staaten grenzt Österreich?', 8, 'Staaten', 'Deutschland, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Schweiz und Liechtenstein.'],
  ['Wie viele Bundesländer hat Deutschland?', 16, 'Bundesländer', 'Deutschland hat 16 Bundesländer, Österreich 9.'],
  ['Wie viele Kantone hat die Schweiz?', 26, 'Kantone', 'Die Schweiz besteht aus 26 Kantonen.'],
  ['Wie viele Bundesstaaten haben die USA?', 50, 'Staaten', 'Die USA haben 50 Bundesstaaten – Hawaii kam 1959 als letzter dazu.'],
  ['Wie viele Buchstaben hat das Wort „Donaudampfschifffahrt“?', 21, 'Buchstaben', 'Donau (5) + dampf (5) + schiff (6) + fahrt (5) = 21 Buchstaben.'],
  ['In welchem Jahr landeten zum ersten Mal Menschen auf dem Mond?', 1969, '', 'Am 20. Juli 1969 landete Apollo 11 – Neil Armstrong betrat als Erster den Mond.'],
  ['In welchem Jahr fiel die Berliner Mauer?', 1989, '', 'Die Mauer fiel am 9. November 1989.'],
  ['In welchem Jahr sank die Titanic?', 1912, '', 'Die Titanic sank in der Nacht zum 15. April 1912 auf ihrer Jungfernfahrt.'],
  ['In welchem Jahr wurde das erste iPhone vorgestellt?', 2007, '', 'Steve Jobs präsentierte das erste iPhone im Jänner 2007.'],
  ['In welchem Jahr erschien die Vollversion 1.0 von Minecraft?', 2011, '', 'Minecraft 1.0 erschien im November 2011 – Testversionen gab es schon ab 2009.'],
  ['In welchem Jahr wurde Wolfgang Amadeus Mozart geboren?', 1756, '', 'Mozart wurde am 27. Jänner 1756 in Salzburg geboren.'],
  ['In welchem Jahr trat Österreich der EU bei?', 1995, '', 'Österreich ist seit 1. Jänner 1995 Mitglied der Europäischen Union.'],
  ['In welchem Jahr kamen die Euro-Münzen und -Scheine in Umlauf?', 2002, '', 'Am 1. Jänner 2002 wurde das Euro-Bargeld eingeführt – auch der Schilling wurde abgelöst.'],
  ['In welchem Jahr wurde Tetris erfunden?', 1984, '', 'Alexei Paschitnow programmierte Tetris 1984 in Moskau.'],
  ['In welchem Jahr erschien „Super Mario Bros.“ für das NES?', 1985, '', 'Super Mario Bros. erschien 1985 in Japan und wurde zum Mega-Hit.'],
  ['In welchem Jahr erschienen die ersten Pokémon-Spiele (in Japan)?', 1996, '', 'Pokémon Rot und Grün erschienen 1996 in Japan für den Game Boy.'],
  ['In welchem Jahr wurde YouTube gegründet?', 2005, '', 'YouTube wurde 2005 gegründet – das erste Video „Me at the zoo“ ging im April 2005 online.'],
  ['In welchem Jahr wurde Google gegründet?', 1998, '', 'Larry Page und Sergey Brin gründeten Google 1998.'],
  ['In welchem Jahr ging Roblox offiziell online?', 2006, '', 'Roblox wurde 2006 offiziell veröffentlicht.'],
  ['In welchem Jahr erschien die Nintendo Switch?', 2017, '', 'Die Switch kam am 3. März 2017 auf den Markt.'],
  ['In welchem Jahr erschien die erste PlayStation (in Japan)?', 1994, '', 'Die erste PlayStation erschien im Dezember 1994 in Japan.'],
  ['In welchem Jahr erschien der erste Harry-Potter-Band?', 1997, '', '„Harry Potter und der Stein der Weisen“ erschien 1997 in Großbritannien.'],
  ['In welchem Jahr kam der erste „Star Wars“-Film ins Kino?', 1977, '', '„Krieg der Sterne“ (heute Episode IV) startete 1977.'],
  ['In welchem Jahr kam „Toy Story“ ins Kino – der erste komplett computeranimierte Kinofilm?', 1995, '', 'Pixars „Toy Story“ erschien 1995.'],
  ['In welchem Jahr wurde der Zauberwürfel erfunden?', 1974, '', 'Der Ungar Ernő Rubik erfand den Würfel 1974.'],
  ['In welchem Jahr fand die erste Fußball-WM statt?', 1930, '', 'Die erste WM fand 1930 in Uruguay statt – Uruguay wurde auch Weltmeister.'],
  ['In welchem Jahr fanden die ersten Olympischen Spiele der Neuzeit statt?', 1896, '', 'Die ersten modernen Olympischen Spiele fanden 1896 in Athen statt.'],
  ['In welchem Jahr wurde die Republik Österreich ausgerufen?', 1918, '', 'Am 12. November 1918 wurde die Republik Deutschösterreich ausgerufen.'],
  ['In welchem Jahr erreichte Kolumbus Amerika?', 1492, '', 'Christoph Kolumbus landete am 12. Oktober 1492 auf einer Insel der Bahamas.'],
  ['In welchem Jahr wurde der Eiffelturm fertig?', 1889, '', 'Der Eiffelturm wurde 1889 zur Weltausstellung in Paris eröffnet.'],
  ['In welchem Jahr endete der Zweite Weltkrieg?', 1945, '', 'Der Zweite Weltkrieg endete 1945 – in Europa im Mai, in Asien im September.'],
  ['In welchem Jahr wurde Apple gegründet?', 1976, '', 'Steve Jobs, Steve Wozniak und Ronald Wayne gründeten Apple 1976.'],
  ['In welchem Jahr wurde Microsoft gegründet?', 1975, '', 'Bill Gates und Paul Allen gründeten Microsoft 1975.'],
  ['In welchem Jahr startete Instagram?', 2010, '', 'Instagram ging im Oktober 2010 an den Start.'],
  ['In welchem Jahr startete WhatsApp?', 2009, '', 'WhatsApp wurde 2009 gegründet.'],
  ['Wie oft wurde Brasilien Fußball-Weltmeister?', 5, 'Titel', 'Brasilien gewann 1958, 1962, 1970, 1994 und 2002 – Rekord.'],
  ['Wie oft wurde Deutschland Fußball-Weltmeister (Männer)?', 4, 'Titel', '1954, 1974, 1990 und 2014.'],
  ['Wie viele Ringe hat das olympische Symbol?', 5, 'Ringe', 'Die 5 Ringe stehen für die 5 Kontinente.'],
  ['Aus wie vielen Hohlräumen (Vorhöfe + Kammern) besteht das menschliche Herz?', 4, 'Hohlräume', 'Zwei Vorhöfe und zwei Herzkammern – zusammen 4.'],
  ['Wie hoch ist der Südturm des Wiener Stephansdoms?', 136, 'm', 'Der Südturm („Steffl“) ist rund 136 m hoch.'],
  ['Wie viele Tage hat ein Schaltjahr?', 366, 'Tage', 'Ein Schaltjahr hat 366 Tage – der 29. Februar kommt dazu.']
];

BORED.registerGame({
  id: 'estimate', name: 'Schätzduell', icon: '🎯', cat: 'party', players: '2-10',
  desc: 'Echte Fakten, wilde Schätzungen: Wer am nächsten dran ist, holt den Punkt.',
  rules: [
    'Eine Frage erscheint – jede Person tippt reihum geheim ihre Schätzung ein.',
    'Danach wird aufgelöst: die richtige Antwort plus kurze Erklärung.',
    'Wer am nächsten dran ist, bekommt 1 Punkt (bei Gleichstand alle). Exakt richtig = 2 Punkte!'
  ],
  tags: ['freunde', 'drinnen', 'kurz'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    let yearQ = false;
    const nf = n => Number(n).toLocaleString('de-AT', { maximumFractionDigits: 3, useGrouping: !yearQ });
    const menu = () => partyStart(root, api, {
      modes: [{ id: '5', label: '5 Fragen' }, { id: '10', label: '10 Fragen' }, { id: '15', label: '15 Fragen' }],
      bestLabel: 'Rekord',
      onStart: (l, mode, players) => play(+mode, players)
    });
    function play(rounds, players){
      const scores = zeroScores(players), d = deck(api, 'est', EST);
      let round = 0;
      const end = () => endScreen(root, api, { ctx, scores, xp: 20, lines: [['Fragen', round]], onAgain: () => play(rounds, players), onMenu: menu });
      function ask(){
        if(round >= rounds) return end();
        const [q, ans, unit, ex] = d.next();
        yearQ = unit === '';
        const guesses = {};
        let i = 0;
        const qCard = () => el('div', { class: 'pt-card', style: { minHeight: '150px' } }, [el('div', { class: 'b-kicker', text: 'Frage ' + (round + 1) + '/' + rounds }), el('div', { class: 'pt-q sm', text: q })]);
        const enter = () => {
          if(i >= players.length) return reveal();
          const p = players[i];
          passScreen(root, api, p, 'Geheim schätzen (' + (i + 1) + '/' + players.length + ')', () => {
            const inp = el('input', { class: 'b-input pt-num', type: 'text', inputmode: 'decimal', placeholder: 'Deine Schätzung', 'aria-label': 'Schätzung', autocomplete: 'off' });
            const ok = el('button', { class: 'b-btn block pt-big', text: 'Schätzung abgeben 🔒' });
            const submit = () => {
              const raw = inp.value.trim().replace(/\s|\./g, '').replace(',', '.');
              const v = parseFloat(raw);
              if(!raw || !isFinite(v)){ api.toast('Bitte eine Zahl eingeben'); api.sound('bad'); inp.classList.add('b-shake'); ctx.to(() => inp.classList.remove('b-shake'), 400); return; }
              guesses[p] = v; api.sound('pop'); i++; enter();
            };
            ok.onclick = submit;
            inp.addEventListener('keydown', e => { if(e.key === 'Enter') submit(); });
            screen(root, [
              topBar(api, p, () => showScores(api, scores), end),
              qCard(),
              el('div', { class: 'b-row' }, [el('div', { class: 'grow' }, [inp]), unit ? el('span', { class: 'b-h', text: unit }) : null]),
              el('p', { class: 'b-hint', text: 'Tausenderpunkte und Leerzeichen sind egal. Nach dem Abgeben ist die Zahl versteckt.' }),
              ok
            ]);
            ctx.to(() => inp.focus(), 80);
          });
        };
        const reveal = () => {
          round++;
          const diffs = players.map(p => [p, Math.abs(guesses[p] - ans)]);
          const best = Math.min(...diffs.map(x => x[1]));
          const winners = diffs.filter(x => x[1] === best).map(x => x[0]);
          winners.forEach(p => scores[p] += best === 0 ? 2 : 1);
          api.sound(best === 0 ? 'win' : 'good');
          const list = el('div', { class: 'b-stack tight' }, diffs.slice().sort((a, b) => a[1] - b[1]).map(([p, df]) => el('div', { class: 'b-item', style: winners.includes(p) ? { borderColor: 'var(--good)' } : {} }, [
            el('div', { class: 'ic', text: winners.includes(p) ? (best === 0 ? '🎯' : '🏅') : '·' }),
            el('div', { class: 'tx' }, [el('b', { text: p }), el('small', { text: 'Daneben um ' + nf(df) })]),
            el('span', { class: 'pt-pts', style: { fontSize: '18px' }, text: nf(guesses[p]) })
          ])));
          screen(root, [
            topBar(api, 'Auflösung ' + round + '/' + rounds, () => showScores(api, scores), end),
            el('div', { class: 'pt-card cyan' }, [
              el('p', { class: 'b-hint', text: q }),
              el('div', { class: 'pt-word', style: { color: 'var(--cyan)' }, text: nf(ans) + (unit ? ' ' + unit : '') }),
              el('p', { class: 'pt-fact', text: 'ℹ️ ' + ex })
            ]),
            el('p', { class: 'b-h b-center', text: (best === 0 ? '🎯 Volltreffer: ' : '🏅 Am nächsten: ') + winners.join(' & ') + (best === 0 ? ' (+2)' : ' (+1)') }),
            list,
            el('button', { class: 'b-btn block pt-big', text: round >= rounds ? 'Zum Ergebnis →' : 'Nächste Frage →', onclick: () => { api.sound('click'); ask(); } })
          ]);
        };
        screen(root, [
          topBar(api, 'Frage ' + (round + 1) + '/' + rounds, () => showScores(api, scores), end),
          qCard(),
          el('p', { class: 'b-hint b-center', text: 'Laut vorlesen – dann tippt jede Person geheim ihre Schätzung ein.' }),
          el('button', { class: 'b-btn block pt-huge', text: 'Schätzen starten →', onclick: () => { api.sound('click'); enter(); } })
        ]);
      }
      ask();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   8) ZWEI WAHRHEITEN, EINE LÜGE
   ===================================================================== */
BORED.registerGame({
  id: 'two-truths', name: 'Zwei Wahrheiten, eine Lüge', icon: '🤥', cat: 'party', players: '2-10',
  desc: 'Erzähl drei Dinge über dich – eins davon ist gelogen. Wer durchschaut dich?',
  rules: [
    'Wer dran ist, überlegt sich 2 wahre Aussagen und 1 Lüge über sich selbst.',
    'Die drei Aussagen werden als Nr. 1, 2 und 3 erzählt. Danach dürfen die anderen kurz nachfragen.',
    'Nach dem Countdown zeigen alle gleichzeitig mit den Fingern 1, 2 oder 3 – die Tipps werden eingetragen.',
    'Richtig geraten = +1. Für jede Person, die du reinlegst, bekommst du +1.'
  ],
  tags: ['freunde', 'drinnen', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const menu = () => partyStart(root, api, {
      modes: [{ id: '1', label: '1 Durchgang' }, { id: '2', label: '2 Durchgänge' }],
      bestLabel: 'Rekord',
      onStart: (l, mode, players) => play(+mode, players)
    });
    const IDEAS = ['Ein Ort, an dem du schon warst', 'Ein Essen, das du nicht magst', 'Etwas, das dir als Kind passiert ist', 'Ein verstecktes Talent',
      'Ein Promi, den du getroffen hast', 'Ein Rekord, den du hältst', 'Ein Haustier, das du hattest', 'Ein Unfall oder Missgeschick', 'Etwas, das du sammelst', 'Ein Spiel, in dem du richtig gut bist'];
    function play(laps, players){
      const scores = zeroScores(players);
      let turn = 0, fooledTotal = 0;
      const total = laps * players.length;
      const end = () => endScreen(root, api, { ctx, scores, xp: 18, lines: [['Runden', turn], ['Reingelegt', fooledTotal + '×']], onAgain: () => play(laps, players), onMenu: menu });
      function prep(){
        if(turn >= total) return end();
        const p = players[turn % players.length];
        const ideas = api.shuffle(IDEAS).slice(0, 3);
        const holder = el('div');
        const goTell = () => tell(p);
        const t = timer(ctx, api, 60, () => goTell());
        holder.append(t.node);
        screen(root, [
          topBar(api, 'Runde ' + (turn + 1) + '/' + total, () => showScores(api, scores), end),
          el('div', { class: 'pt-card' }, [el('div', { class: 'b-kicker', text: 'Schritt 1 · Ausdenken' }), el('div', { class: 'pt-name', text: p }),
            el('p', { class: 'b-hint', text: 'Überleg dir 2 Wahrheiten und 1 Lüge über dich. Die Lüge sollte glaubwürdig sein!' })]),
          holder,
          el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: '💡 Ideen' }), el('div', { class: 'b-stack tight' }, ideas.map(x => el('p', { style: { fontSize: '15px' }, text: '• ' + x })))]),
          el('button', { class: 'b-btn block pt-big', text: 'Bin bereit ✓', onclick: () => { t.stop(); api.sound('click'); goTell(); } })
        ]);
      }
      function tell(p){
        ctx.clear();
        const t = timer(ctx, api, 90, () => guess(p), { warn: 15 });
        screen(root, [
          topBar(api, 'Runde ' + (turn + 1) + '/' + total, () => showScores(api, scores), end),
          el('div', { class: 'pt-card cyan' }, [el('div', { class: 'b-kicker', text: 'Schritt 2 · Erzählen & Nachfragen' }), el('div', { class: 'pt-name', text: p }),
            el('p', { class: 'b-h', text: 'Aussage 1 … 2 … 3' }),
            el('p', { class: 'b-hint', text: 'Erzähl deine drei Aussagen deutlich nummeriert. Die anderen dürfen danach Fragen stellen – du darfst flunkern!' })]),
          t.node,
          el('div', { class: 'b-grid2' }, [
            el('button', { class: 'b-btn ghost', text: '+30 s', onclick: () => { t.add(30); api.sound('click'); } }),
            el('button', { class: 'b-btn', text: 'Tippen →', onclick: () => { t.stop(); api.sound('click'); guess(p); } })
          ])
        ]);
      }
      function guess(p){
        ctx.clear();
        const holder = screen(root, []);
        countdown(ctx, api, holder, 'Zeigt 1, 2 oder 3 Finger!', () => enter(p));
      }
      function enter(p){
        const others = players.filter(x => x !== p);
        const tips = {};
        const go = el('button', { class: 'b-btn block pt-big', text: 'Weiter zur Auflösung →', disabled: true });
        const rows = el('div', { class: 'b-stack tight' });
        const render = () => {
          rows.innerHTML = '';
          others.forEach(o => {
            rows.append(el('div', { class: 'b-card', style: { padding: '10px 12px' } }, [
              el('b', { style: { fontFamily: 'var(--head)', fontSize: '18px', display: 'block', marginBottom: '6px' }, text: o + ' tippt auf Lüge Nr.' }),
              el('div', { class: 'pt-row3' }, [1, 2, 3].map(n => el('button', { 'aria-pressed': String(tips[o] === n), text: String(n), onclick: () => { tips[o] = n; api.sound('pop'); render(); } })))
            ]));
          });
          go.disabled = others.some(o => !tips[o]);
        };
        render();
        go.onclick = () => { api.sound('click'); reveal(p, tips, others); };
        screen(root, [
          el('div', { class: 'b-center' }, [el('div', { class: 'b-kicker', text: 'Tipps eintragen' }), el('p', { class: 'b-hint', text: 'Welche Aussage von ' + p + ' war gelogen?' })]),
          rows, go
        ]);
      }
      function reveal(p, tips, others){
        passScreen(root, api, p, 'Nur ' + p + ' tippt: Welche Aussage war die Lüge?', () => {
          screen(root, [
            el('div', { class: 'b-center' }, [el('div', { class: 'b-kicker', text: p + ', deine Lüge war …' })]),
            el('div', { class: 'pt-stmt' }, [1, 2, 3].map(n => el('button', { text: 'Aussage ' + n, onclick: () => resolve(p, tips, others, n) })))
          ]);
        }, 'Ich bin ' + p + ' – auflösen');
      }
      function resolve(p, tips, others, lie){
        const right = others.filter(o => tips[o] === lie), wrong = others.filter(o => tips[o] !== lie);
        right.forEach(o => scores[o]++); scores[p] += wrong.length; fooledTotal += wrong.length;
        turn++;
        api.sound(wrong.length > right.length ? 'lose' : 'win');
        screen(root, [
          el('div', { class: 'pt-card pink' }, [
            el('div', { style: { fontSize: '54px' }, text: '🤥' }),
            el('div', { class: 'pt-name', text: 'Lüge: Nr. ' + lie }),
            el('p', { class: 'b-h', text: p + ' hat ' + wrong.length + (wrong.length === 1 ? ' Person' : ' Personen') + ' reingelegt (+' + wrong.length + ')' })
          ]),
          el('div', { class: 'b-card' }, [
            el('span', { class: 'b-label', text: '✓ Durchschaut (+1)' }), el('p', { text: right.length ? right.join(', ') : 'niemand' }),
            el('span', { class: 'b-label', style: { marginTop: '10px' }, text: '✗ Reingefallen' }), el('p', { text: wrong.length ? wrong.join(', ') : 'niemand' })
          ]),
          el('button', { class: 'b-btn block pt-big', text: turn >= total ? 'Zum Ergebnis →' : 'Nächste Person →', onclick: () => { api.sound('click'); prep(); } })
        ]);
      }
      prep();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   9) EMOJI-QUIZ
   ===================================================================== */
// [Emojis, Lösung, Kategorie, Hinweis, ...alternative Lösungen]
const EMO = [
  ['🦁👑', 'Der König der Löwen', 'Film', 'Disney-Klassiker mit „Hakuna Matata“', 'König der Löwen', 'The Lion King', 'Lion King'],
  ['🚢🧊💔', 'Titanic', 'Film', 'Liebesgeschichte auf einem sinkenden Schiff'],
  ['🕷️🧑', 'Spider-Man', 'Film', 'Freundliche Spinne aus der Nachbarschaft', 'Spiderman'],
  ['🦇🧑🌃', 'Batman', 'Film', 'Held aus Gotham City'],
  ['🧙‍♂️⚡👓', 'Harry Potter', 'Film', 'Zauberschüler mit Narbe'],
  ['💍🌋🧝', 'Der Herr der Ringe', 'Film', 'Ein Ring, sie zu knechten', 'Herr der Ringe', 'Lord of the Rings'],
  ['🦖🏝️🚙', 'Jurassic Park', 'Film', 'Dinosaurier-Freizeitpark'],
  ['🐠🔍🌊', 'Findet Nemo', 'Film', 'Ein Clownfisch-Papa sucht seinen Sohn', 'Nemo', 'Finding Nemo'],
  ['❄️👸⛄', 'Die Eiskönigin', 'Film', 'Lass jetzt los!', 'Eiskönigin', 'Frozen'],
  ['🧸🤠🚀', 'Toy Story', 'Film', 'Spielzeuge werden lebendig'],
  ['🐼🥋', 'Kung Fu Panda', 'Film', 'Drachenkrieger mit Bauch'],
  ['🚗⚡🏁', 'Cars', 'Film', 'Lightning McQueen'],
  ['🚫👻', 'Ghostbusters', 'Film', 'Who you gonna call?'],
  ['🏠🎈👴', 'Oben', 'Film', 'Fliegendes Haus von Pixar', 'Up'],
  ['🐀👨‍🍳🇫🇷', 'Ratatouille', 'Film', 'Eine Ratte kocht in Paris'],
  ['🤖🌱🗑️', 'WALL·E', 'Film', 'Müllroboter von Pixar', 'Wall-E', 'Walle'],
  ['👽📞🏠', 'E.T.', 'Film', 'Nach Hause telefonieren', 'ET', 'E.T. der Außerirdische'],
  ['🦍🏙️', 'King Kong', 'Film', 'Riesenaffe auf einem Wolkenkratzer'],
  ['🍫🏭🎩', 'Charlie und die Schokoladenfabrik', 'Film', 'Willy Wonka', 'Charlie und die Schokoladenfabrik', 'Schokoladenfabrik'],
  ['🧜‍♀️🌊🦀', 'Arielle, die Meerjungfrau', 'Film', 'Unter dem Meer …', 'Arielle', 'Arielle die kleine Meerjungfrau', 'Die kleine Meerjungfrau', 'Little Mermaid'],
  ['🐉🧑🛩️', 'Drachenzähmen leicht gemacht', 'Film', 'Hicks und Ohnezahn', 'How to Train Your Dragon'],
  ['👸🍎🪞', 'Schneewittchen', 'Film', 'Spieglein, Spieglein an der Wand'],
  ['🌹👸👹', 'Die Schöne und das Biest', 'Film', 'Verzauberte Rose', 'Schöne und das Biest', 'Beauty and the Beast'],
  ['⭐⚔️🌌', 'Star Wars', 'Film', 'Möge die Macht mit dir sein', 'Krieg der Sterne'],
  ['🧊🐘🐿️', 'Ice Age', 'Film', 'Ein Eichhörnchen jagt eine Nuss'],
  ['🍌👓💛', 'Minions', 'Film', 'Kleine gelbe Helfer', 'Ich – Einfach unverbesserlich', 'Despicable Me'],
  ['🐻🍯🎈', 'Winnie Puuh', 'Film', 'Bär mit Honig-Problem', 'Winnie Pooh', 'Winnie the Pooh', 'Pu der Bär'],
  ['🏴‍☠️🚢🦜', 'Fluch der Karibik', 'Film', 'Captain Jack Sparrow', 'Pirates of the Caribbean'],
  ['🍝🐶❤️', 'Susi und Strolch', 'Film', 'Zwei Hunde, ein Teller Spaghetti', 'Lady and the Tramp'],
  ['🧞‍♂️🪔🐒', 'Aladdin', 'Film', 'Drei Wünsche frei'],
  ['🐒👦🐻🐍', 'Das Dschungelbuch', 'Film', 'Mogli und Balu', 'Dschungelbuch', 'Jungle Book'],
  ['🦸‍♂️🛡️🔨💚', 'Avengers', 'Film', 'Marvel-Helden im Team', 'The Avengers'],
  ['🟢👹🧅', 'Shrek', 'Film', 'Oger mit Schichten wie eine Zwiebel'],
  ['🔦🚲👾', 'Stranger Things', 'Serie', 'Kinder in Hawkins und eine Schattenwelt'],
  ['🟡👨‍👩‍👧‍👦🍩', 'Die Simpsons', 'Serie', 'Gelbe Familie aus Springfield', 'Simpsons', 'The Simpsons'],
  ['🧽🍍🌊', 'SpongeBob', 'Serie', 'Wohnt in einer Ananas', 'SpongeBob Schwammkopf', 'Spongebob Squarepants'],
  ['🏴‍☠️👒🍖', 'One Piece', 'Serie', 'Gummi-Pirat Ruffy'],
  ['🍥🦊🥷', 'Naruto', 'Serie', 'Ninja mit Fuchsgeist'],
  ['☕🛋️👫', 'Friends', 'Serie', 'Sechs Freunde in New York'],
  ['🐷☔👢', 'Peppa Wutz', 'Serie', 'Springt gern in Matschpfützen', 'Peppa Pig', 'Peppa'],
  ['🐶🚒🚓', 'Paw Patrol', 'Serie', 'Hunde-Rettungsteam'],
  ['⚔️👹🌸', 'Demon Slayer', 'Serie', 'Tanjiro und seine Schwester', 'Kimetsu no Yaiba'],
  ['🖤🎻🖐️', 'Wednesday', 'Serie', 'Addams-Tochter an der Nevermore Academy', 'Wednesday Addams'],
  ['🐱🐭💥', 'Tom und Jerry', 'Serie', 'Katz-und-Maus-Klassiker', 'Tom & Jerry', 'Tom and Jerry'],
  ['🐝🌼🍯', 'Biene Maja', 'Serie', 'Kleine freche Biene mit Willi', 'Die Biene Maja'],
  ['🌅🐦🪱', 'Der frühe Vogel fängt den Wurm', 'Sprichwort', 'Wer früh aufsteht …', 'früher Vogel fängt den Wurm', 'frühe Vogel'],
  ['🍎⬇️🌳', 'Der Apfel fällt nicht weit vom Stamm', 'Sprichwort', 'Kinder sind wie ihre Eltern', 'Apfel fällt nicht weit vom Stamm'],
  ['⏰=💰', 'Zeit ist Geld', 'Sprichwort', 'Trödel nicht!'],
  ['🗣️🥈🤐🥇', 'Reden ist Silber, Schweigen ist Gold', 'Sprichwort', 'Manchmal besser nichts sagen', 'Reden ist Silber Schweigen ist Gold'],
  ['🏛️❌1️⃣📅', 'Rom wurde nicht an einem Tag erbaut', 'Sprichwort', 'Große Dinge brauchen Zeit', 'Rom wurde nicht an einem Tag gebaut'],
  ['🐱🚪🐭💃', 'Wenn die Katze aus dem Haus ist, tanzen die Mäuse', 'Sprichwort', 'Chef weg = Party', 'Ist die Katze aus dem Haus tanzen die Mäuse', 'Wenn die Katze aus dem Haus ist tanzen die Mäuse auf dem Tisch'],
  ['🔁🏋️👑', 'Übung macht den Meister', 'Sprichwort', 'Dranbleiben lohnt sich'],
  ['👨‍🍳👨‍🍳👨‍🍳🥣🤢', 'Viele Köche verderben den Brei', 'Sprichwort', 'Zu viele mischen mit'],
  ['🎁🐴🚫👄', 'Einem geschenkten Gaul schaut man nicht ins Maul', 'Sprichwort', 'Geschenke nicht kritisieren', 'Einem geschenkten Gaul schaut man nicht ins Maul'],
  ['🌧️➡️☀️', 'Nach Regen kommt Sonnenschein', 'Sprichwort', 'Nach schlechten Zeiten wird es besser', 'Auf Regen folgt Sonnenschein'],
  ['🧠📚=💪', 'Wissen ist Macht', 'Sprichwort', 'Lernen lohnt sich'],
  ['🤥🦵📏', 'Lügen haben kurze Beine', 'Sprichwort', 'Die Wahrheit kommt raus'],
  ['🐘🏺🏪', 'Wie ein Elefant im Porzellanladen', 'Sprichwort', 'Total ungeschickt', 'Elefant im Porzellanladen'],
  ['🤫💧⬇️', 'Stille Wasser sind tief', 'Sprichwort', 'Ruhige Leute überraschen'],
  ['🦉➡️🏛️', 'Eulen nach Athen tragen', 'Sprichwort', 'Etwas Überflüssiges tun'],
  ['⛏️🧱🟩', 'Minecraft', 'Spiel', 'Blöcke abbauen und bauen'],
  ['🍄👨‍🔧🏰', 'Super Mario', 'Spiel', 'Klempner rettet Prinzessin', 'Mario', 'Super Mario Bros'],
  ['🔴⚪⚡🐭', 'Pokémon', 'Spiel', 'Schnapp sie dir alle!', 'Pokemon'],
  ['🟦🟨🟥⬇️', 'Tetris', 'Spiel', 'Fallende Blöcke, volle Reihen'],
  ['🟡👻🍒', 'Pac-Man', 'Spiel', 'Punkte fressen, Geistern ausweichen', 'Pacman'],
  ['🗡️🛡️🧝🔺', 'Zelda', 'Spiel', 'Link rettet Hyrule', 'The Legend of Zelda', 'Legend of Zelda'],
  ['🚀⚽🚗', 'Rocket League', 'Spiel', 'Fußball mit Autos'],
  ['🧑‍🚀🔪🚨', 'Among Us', 'Spiel', 'Wer ist der Impostor?'],
  ['🏝️🐾🏡', 'Animal Crossing', 'Spiel', 'Inselleben mit Tom Nook'],
  ['🍄🏎️🍌', 'Mario Kart', 'Spiel', 'Bananenschalen auf der Rennstrecke'],
  ['🪂🏗️🕺', 'Fortnite', 'Spiel', 'Battle Bus und Tänze'],
  ['🐦😡🐷', 'Angry Birds', 'Spiel', 'Vögel gegen Schweine'],
  ['🍬🍭💥', 'Candy Crush', 'Spiel', 'Drei gleiche Süßigkeiten in eine Reihe', 'Candy Crush Saga'],
  ['🏃‍♂️🚂🪙', 'Subway Surfers', 'Spiel', 'Weglaufen auf Gleisen'],
  ['♟️👑🏰', 'Schach', 'Spiel', 'Schachmatt!', 'Chess'],
  ['🃏🔴🔵🟢', 'Uno', 'Spiel', 'Am Ende laut rufen!'],
  ['🎩💵🏠', 'Monopoly', 'Spiel', 'Schlossallee kaufen'],
  ['🦔💨💍', 'Sonic', 'Spiel', 'Blauer, schneller Igel', 'Sonic the Hedgehog'],
  ['🐍🍎📱', 'Snake', 'Spiel', 'Klassiker vom alten Nokia-Handy'],
  ['🌾🐄🚜', 'Landwirtschafts-Simulator', 'Spiel', 'Traktor fahren am PC', 'Farming Simulator', 'Landwirtschaftssimulator', 'LS'],
  ['👨‍🚒🔥🚒', 'Feuerwehrmann', 'Beruf', 'Löscht Brände', 'Feuerwehrfrau', 'Feuerwehr', 'Feuerwehrler'],
  ['👩‍⚕️💉🏥', 'Ärztin', 'Beruf', 'Arbeitet im Spital', 'Arzt', 'Doktor', 'Ärztin'],
  ['👨‍🍳🍲🔪', 'Koch', 'Beruf', 'Arbeitet in der Restaurantküche', 'Köchin'],
  ['✂️💇', 'Friseur', 'Beruf', 'Haare schneiden', 'Friseurin', 'Frisör', 'Frisörin'],
  ['🦷🪥😬', 'Zahnarzt', 'Beruf', 'Bohrt Löcher – aber nur in Zähne', 'Zahnärztin'],
  ['✈️👨‍✈️☁️', 'Pilot', 'Beruf', 'Sitzt im Cockpit', 'Pilotin'],
  ['👮🚓🚨', 'Polizist', 'Beruf', 'Blaulicht und Uniform', 'Polizistin', 'Polizei'],
  ['🧑‍🏫📚🏫', 'Lehrer', 'Beruf', 'Steht vor der Tafel', 'Lehrerin'],
  ['🍞🥐🌅', 'Bäcker', 'Beruf', 'Steht sehr früh auf', 'Bäckerin'],
  ['⚡🔌🧑‍🔧', 'Elektriker', 'Beruf', 'Kabel, Steckdosen, Sicherungen', 'Elektrikerin', 'Elektrotechniker', 'Elektrotechnikerin'],
  ['🧑‍🌾🚜🐄', 'Bauer', 'Beruf', 'Arbeitet am Hof und am Feld', 'Bäuerin', 'Landwirt', 'Landwirtin'],
  ['🐶🐱🩺', 'Tierarzt', 'Beruf', 'Hilft kranken Haustieren', 'Tierärztin'],
  ['🧑‍🚀🌕🚀', 'Astronaut', 'Beruf', 'Arbeitsplatz: Weltall', 'Astronautin'],
  ['🪚🪵🪑', 'Tischler', 'Beruf', 'Baut Möbel aus Holz', 'Tischlerin', 'Schreiner', 'Schreinerin'],
  ['📬✉️🚲', 'Briefträger', 'Beruf', 'Bringt die Post', 'Briefträgerin', 'Postbote', 'Postbotin', 'Postler'],
  ['🔧🚗🛞', 'Mechaniker', 'Beruf', 'Repariert Autos', 'Mechanikerin', 'Kfz-Mechaniker', 'Kfz-Techniker'],
  ['👷🧱🏗️', 'Maurer', 'Beruf', 'Zieht Wände hoch', 'Maurerin', 'Bauarbeiter', 'Bauarbeiterin'],
  ['🧑‍💻⌨️🐞', 'Programmierer', 'Beruf', 'Jagt Bugs im Code', 'Programmiererin', 'Entwickler', 'Softwareentwickler', 'Informatiker'],
  ['🕵️🔍👣', 'Detektiv', 'Beruf', 'Löst Fälle', 'Detektivin', 'Ermittler'],
  ['🧑‍🔬🧪🔬', 'Wissenschaftler', 'Beruf', 'Forscht im Labor', 'Wissenschaftlerin', 'Forscher', 'Forscherin', 'Chemiker'],
  ['🎨🖌️🖼️', 'Maler', 'Beruf', 'Arbeitet mit Pinsel und Farbe', 'Malerin', 'Künstler', 'Künstlerin']
];

function normAns(s){
  return String(s).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[éèê]/g, 'e').replace(/[áàâ]/g, 'a')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/).filter(w => w && !['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'the', 'a', 'and', 'und'].includes(w)).join('');
}
function lev(a, b){
  if(a === b) return 0;
  const m = a.length, n = b.length; if(!m) return n; if(!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for(let i = 1; i <= m; i++){
    const cur = [i];
    for(let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function matchAns(input, item){
  const g = normAns(input); if(!g) return false;
  const sols = [item[1]].concat(item.slice(4)).map(normAns);
  return sols.some(s => { const tol = s.length >= 12 ? 3 : s.length >= 8 ? 2 : s.length >= 5 ? 1 : 0; return lev(g, s) <= tol; });
}

BORED.registerGame({
  id: 'emoji-quiz', name: 'Emoji-Quiz', icon: '🤔', cat: 'party', players: '2-10',
  desc: 'Filme, Serien, Sprichwörter, Spiele und Berufe – nur in Emojis. Solo oder reihum.',
  rules: [
    'Errate, wofür die Emojis stehen. Kategorie steht dabei.',
    'Eintippen: Groß-/Kleinschreibung, Umlaute (ae/ä) und Artikel sind egal, kleine Tippfehler auch.',
    'Oder spiel im Auswahl-Modus mit 4 Antworten.',
    'Ohne Hinweis 3 Punkte, mit 1 Hinweis 2, mit 2 Hinweisen 1. Aufgeben = 0.',
    'Solo: Rekord jagen. Gruppe: reihum, jede Person bekommt eigene Rätsel.'
  ],
  tags: ['alleine', 'freunde', 'drinnen', 'kurz'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    let who = api.store.get('who', 'solo');
    const menu = () => {
      const wChips = el('div', { class: 'b-chips' });
      const rW = () => { wChips.innerHTML = ''; [['solo', '🙋 Solo'], ['group', '👥 Gruppe (reihum)']].forEach(([v, l]) => wChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(who === v), text: l, onclick: () => { who = v; api.store.set('who', v); api.sound('click'); rW(); } }))); };
      rW();
      partyStart(root, api, {
        min: 1,
        modes: [{ id: 'type', label: '⌨️ Eintippen' }, { id: 'pick', label: '🔘 Auswahl' }],
        bestLabel: 'Rekord',
        bestKey: (l, m) => m === 'pick' ? '1' : '0',
        extra: el('div', {}, [el('span', { class: 'b-label', text: 'Wer spielt?' }), wChips, el('p', { class: 'b-hint', style: { marginTop: '6px' }, text: 'Solo: 10 Rätsel. Gruppe: 5 Rätsel pro Person.' })]),
        onStart: (l, mode, players) => {
          if(who === 'group' && players.length < 2){ api.toast('Für die Gruppe braucht ihr mind. 2 Spieler'); editPlayers(api, menu); return; }
          const solo = who === 'solo';
          play(mode, solo ? [api.profile && api.profile.name ? String(api.profile.name).slice(0, 16) : 'Du'] : players, solo);
        }
      });
    };
    function play(mode, players, solo){
      const scores = zeroScores(players), d = deck(api, 'emo', EMO);
      const per = solo ? 10 : 5, total = per * players.length;
      let n = 0, solved = 0;
      const end = () => {
        ctx.clear();
        if(solo){
          const sc = scores[players[0]], r = api.reportScore(sc, mode === 'pick' ? '1' : '0');
          api.finish({ win: null, score: sc, xp: 15 + Math.round(sc / 3) });
          BORED.ui.result(root, api, { win: null, emoji: sc >= 24 ? '🧠' : '🤔', title: sc + ' Punkte', sub: solved + ' von ' + n + ' Rätseln gelöst' + (r.isBest ? ' – neuer Rekord!' : ''),
            lines: [['Punkte', sc], ['Rekord', r.best]], onAgain: () => play(mode, players, solo), onMenu: menu });
          if(r.isBest) api.confetti();
        } else endScreen(root, api, { ctx, scores, bestKey: false, xp: 20, lines: [['Rätsel', n], ['Gelöst', solved]], onAgain: () => play(mode, players, solo), onMenu: menu });
      };
      const quiz = () => {
        if(n >= total) return end();
        const p = players[n % players.length];
        if(!solo) passScreen(root, api, p, 'Rätsel ' + (Math.floor(n / players.length) + 1) + '/' + per, () => show(p));
        else show(p);
      };
      const show = (p) => {
        const item = d.next();
        let hints = 0, done = false;
        const hintBox = el('div', { class: 'b-stack tight' });
        const msg = el('p', { class: 'b-hint b-center', text: '' });
        const pattern = item[1].replace(/[A-Za-zÄÖÜäöüß]/g, (c, i) => (i === 0 || /[\s\-,]/.test(item[1][i - 1])) ? c : '_');
        const hintBtn = el('button', { class: 'b-btn ghost', text: '💡 Hinweis' });
        const giveUp = el('button', { class: 'b-btn ghost', text: '🏳️ Aufgeben' });
        const after = (ok) => {
          done = true;
          const pts = ok ? 3 - hints : 0;
          scores[p] += pts; if(ok) solved++; n++;
          api.sound(ok ? 'good' : 'bad'); api.vibrate(ok ? 30 : 150);
          screen(root, [
            topBar(api, (solo ? '' : p + ' · ') + n + '/' + total, solo ? null : () => showScores(api, scores), null),
            el('div', { class: 'pt-card ' + (ok ? 'cyan' : 'pink') }, [
              el('div', { class: 'pt-emo', text: item[0] }),
              el('div', { class: 'pt-word', style: { fontSize: '28px' }, text: item[1] }),
              el('p', { class: 'b-h', text: ok ? '✓ Richtig! +' + pts : '✗ Leider nicht' })
            ]),
            el('button', { class: 'b-btn block pt-big', text: n >= total ? 'Zum Ergebnis →' : 'Weiter →', onclick: () => { api.sound('click'); quiz(); } })
          ]);
        };
        hintBtn.onclick = () => {
          if(hints >= 2 || done) return;
          hints++; api.sound('flip');
          hintBox.append(el('p', { class: 'b-pill warn', style: { fontSize: '14px', textTransform: 'none', justifyContent: 'center' }, text: hints === 1 ? '💡 ' + item[3] : '🔤 ' + pattern }));
          if(hints >= 2) hintBtn.disabled = true;
        };
        giveUp.onclick = () => { if(!done) after(false); };
        let answerArea;
        if(mode === 'pick'){
          const same = EMO.filter(x => x[2] === item[2] && x[1] !== item[1]);
          const opts = api.shuffle([item].concat(api.shuffle(same).slice(0, 3)));
          answerArea = el('div', { class: 'pt-opts' });
          opts.forEach(o => {
            const b = el('button', { text: o[1], onclick: () => {
              if(done) return;
              done = true;
              [...answerArea.children].forEach(c => { c.disabled = true; });
              if(o === item){ b.classList.add('ok'); ctx.to(() => after(true), 650); }
              else { b.classList.add('no'); [...answerArea.children].forEach(c => { if(c.textContent === item[1]) c.classList.add('ok'); }); api.sound('bad'); ctx.to(() => after(false), 1100); }
            } });
            answerArea.append(b);
          });
        }else{
          const inp = el('input', { class: 'b-input', placeholder: 'Deine Lösung …', 'aria-label': 'Lösung', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', style: { fontSize: '19px' } });
          const check = () => {
            if(done) return;
            if(!inp.value.trim()) return;
            if(matchAns(inp.value, item)) after(true);
            else { api.sound('bad'); api.vibrate(60); inp.classList.remove('b-shake'); void inp.offsetWidth; inp.classList.add('b-shake'); msg.textContent = '„' + inp.value.trim().slice(0, 40) + '“ ist es nicht – nochmal!'; }
          };
          inp.addEventListener('keydown', e => { if(e.key === 'Enter') check(); });
          answerArea = el('div', { class: 'b-stack tight' }, [inp, el('button', { class: 'b-btn block', text: 'Prüfen ✓', onclick: check })]);
          ctx.to(() => inp.focus(), 100);
        }
        screen(root, [
          topBar(api, (solo ? 'Rätsel ' : p + ' · ') + (n + 1) + '/' + total, solo ? null : () => showScores(api, scores), async () => end()),
          el('div', { class: 'pt-card', style: { minHeight: '180px' } }, [el('span', { class: 'b-pill pink', text: item[2] }), el('div', { class: 'pt-emo', text: item[0] })]),
          hintBox, answerArea, msg,
          el('div', { class: 'b-grid2' }, [hintBtn, giveUp])
        ]);
      };
      quiz();
    }
    menu();
    return () => ctx.kill();
  }
});

/* =====================================================================
   10) BEGRIFFE ERRATEN (Stirn / Pantomime / Erklären)
   ===================================================================== */
const CH = {
  '🐾 Tiere': ['Elefant', 'Giraffe', 'Pinguin', 'Känguru', 'Affe', 'Schlange', 'Krokodil', 'Frosch', 'Eichhörnchen', 'Delfin', 'Hai', 'Huhn', 'Kuh', 'Pferd', 'Hase', 'Katze', 'Hund', 'Löwe', 'Bär', 'Eule', 'Schmetterling', 'Spinne', 'Biene', 'Schildkröte', 'Krake', 'Flamingo', 'Igel'],
  '👷 Berufe': ['Feuerwehrmann', 'Pilot', 'Koch', 'Zahnarzt', 'Friseur', 'Polizist', 'Lehrer', 'Bäcker', 'Elektriker', 'Astronaut', 'Tierarzt', 'Fotograf', 'DJ', 'Zauberer', 'Gärtner', 'Kellner', 'Bauarbeiter', 'Rettungsschwimmer', 'Briefträger', 'Detektiv', 'Schiedsrichter', 'Maler', 'Mechaniker', 'Clown', 'Dirigent'],
  '⚽ Sport': ['Fußball', 'Tennis', 'Skifahren', 'Schwimmen', 'Boxen', 'Basketball', 'Bowling', 'Golf', 'Eishockey', 'Surfen', 'Klettern', 'Yoga', 'Gewichtheben', 'Tischtennis', 'Volleyball', 'Reiten', 'Eiskunstlauf', 'Skateboarden', 'Rudern', 'Fechten', 'Bogenschießen', 'Sprinten', 'Hochsprung', 'Snowboarden', 'Karate'],
  '🍕 Essen': ['Pizza', 'Spaghetti', 'Schnitzel', 'Banane', 'Eis', 'Popcorn', 'Döner', 'Burger', 'Pommes', 'Sushi', 'Suppe', 'Kaiserschmarrn', 'Zitrone', 'Wassermelone', 'Brezel', 'Kaugummi', 'Zuckerwatte', 'Palatschinken', 'Hot Dog', 'Salat', 'Torte', 'Spiegelei', 'Knödel', 'Apfelstrudel', 'Maiskolben'],
  '🧰 Gegenstände': ['Regenschirm', 'Zahnbürste', 'Staubsauger', 'Föhn', 'Kamera', 'Schere', 'Gitarre', 'Handy', 'Kopfhörer', 'Taschenlampe', 'Brille', 'Wecker', 'Fernbedienung', 'Leiter', 'Hammer', 'Bügeleisen', 'Rucksack', 'Schlüssel', 'Kerze', 'Luftballon', 'Spiegel', 'Koffer', 'Toaster', 'Mikrofon', 'Besen'],
  '🏃 Aktivitäten': ['Zähne putzen', 'Schlafen', 'Kochen', 'Duschen', 'Tanzen', 'Zocken', 'Selfie machen', 'Auto fahren', 'Einkaufen', 'Staubsaugen', 'Angeln', 'Zelt aufbauen', 'Schneemann bauen', 'Geschenk auspacken', 'Fahrrad fahren', 'Gassi gehen', 'Kuchen backen', 'Fenster putzen', 'Bügeln', 'Wäsche aufhängen', 'Telefonieren', 'Lesen', 'Malen', 'Blumen gießen', 'Jonglieren'],
  '🎮 Gaming & Internet': ['Minecraft', 'Fortnite', 'Pac-Man', 'Tetris', 'Mario Kart', 'Pokémon', 'Among Us', 'Controller', 'Livestream', 'YouTuber', 'Meme', 'Emoji', 'WLAN', 'Passwort', 'Hashtag', 'Level-Up', 'Game Over', 'Respawn', 'Lag', 'Speedrun', 'Tutorial', 'Abonnieren', 'Akku leer', 'Update', 'VR-Brille'],
  '🦸 Figuren': ['Harry Potter', 'Spider-Man', 'Batman', 'Shrek', 'Pinocchio', 'Rotkäppchen', 'Superman', 'Dracula', 'Frankenstein', 'Pippi Langstrumpf', 'Hulk', 'Yoda', 'Darth Vader', 'Minion', 'Elsa', 'Nemo', 'SpongeBob', 'Pikachu', 'Godzilla', 'King Kong', 'Zombie', 'Pirat', 'Ritter', 'Meerjungfrau', 'Weihnachtsmann'],
  '🇦🇹 Österreich': ['Riesenrad', 'Mozart', 'Sachertorte', 'Lipizzaner', 'Skilift', 'Almhütte', 'Jodeln', 'Stephansdom', 'Kaffeehaus', 'Schuhplattler', 'Krampus', 'Sängerknaben', 'Gondel', 'Wiener Walzer', 'Lederhose', 'Dirndl', 'Kuhglocke', 'Gipfelkreuz', 'Skispringen', 'Bergsteigen', 'Würstelstand', 'Bim', 'Opernball', 'Murmeltier', 'Ziehharmonika']
};

BORED.registerGame({
  id: 'charades', name: 'Begriffe erraten', icon: '🙆', cat: 'party', players: '2-10',
  desc: 'Handy an die Stirn, Pantomime oder Erklären: Die anderen helfen dir, den Begriff zu erraten.',
  rules: [
    'Wählt Modus und Kategorien. Pro Zug habt ihr 60 Sekunden.',
    'Stirn-Modus: Handy mit dem Bildschirm nach außen an die Stirn halten. Die anderen erklären oder spielen vor, du rätst.',
    'Pantomime / Erklären: Du siehst den Begriff und stellst ihn dar oder erklärst ihn – die anderen raten.',
    'RICHTIG = +1 Punkt, WEITER = überspringen. Wer am Ende die meisten Begriffe hat, gewinnt.'
  ],
  tags: ['freunde', 'drinnen', 'einfach'],
  mount(root, api){
    injectStyle(); const ctx = mkCtx();
    const keys = Object.keys(CH);
    let sel = api.store.get('cats', keys.slice());
    if(!Array.isArray(sel)) sel = keys.slice();
    sel = sel.filter(k => keys.includes(k)); if(!sel.length) sel = keys.slice();
    let overlay = null;
    const killOverlay = () => { if(overlay){ overlay.remove(); overlay = null; } };
    ctx.onClear(killOverlay);
    const MODES = { stirn: 'Stirn', panto: 'Pantomime', erkl: 'Erklären' };
    const menu = () => {
      const cChips = el('div', { class: 'b-chips' });
      const rC = () => {
        cChips.innerHTML = '';
        keys.forEach(k => cChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(sel.includes(k)), text: k + ' (' + CH[k].length + ')', onclick: () => {
          const i = sel.indexOf(k);
          if(i >= 0){ if(sel.length <= 1){ api.toast('Mindestens 1 Kategorie'); return; } sel.splice(i, 1); } else sel.push(k);
          api.store.set('cats', sel); api.sound('click'); rC();
        } })));
      };
      rC();
      partyStart(root, api, {
        modes: [{ id: 'stirn', label: '🙆 Handy an die Stirn' }, { id: 'panto', label: '🤸 Pantomime' }, { id: 'erkl', label: '🗣️ Erklären' }],
        bestLabel: 'Rekord',
        extra: el('div', {}, [el('span', { class: 'b-label', text: 'Kategorien' }), cChips]),
        onStart: (l, mode, players) => play(mode, players, 1)
      });
    };
    function play(mode, players, laps){
      const scores = zeroScores(players);
      const pool = [];
      sel.forEach(k => CH[k].forEach(w => pool.push(w)));
      const d = deck(api, 'ch.' + sel.slice().sort().join(','), pool);
      let turn = 0, hitsAll = 0;
      const total = () => laps * players.length;
      const end = () => { killOverlay(); endScreen(root, api, { ctx, scores, unit: 'Begriffe', xp: 20, lines: [['Modus', MODES[mode]], ['Erraten', hitsAll]], onAgain: () => play(mode, players, laps), onMenu: menu }); };
      function ready(){
        if(turn >= total()){
          // nach jeder vollen Runde: weiterspielen oder beenden
          screen(root, [
            el('div', { class: 'b-card' }, [el('span', { class: 'b-label', text: 'Zwischenstand' }), rankList(scores, 'Begriffe')]),
            el('button', { class: 'b-btn block pt-big', text: '🔁 Noch eine Runde', onclick: () => { laps++; api.sound('click'); ready(); } }),
            el('button', { class: 'b-btn ghost block', text: 'Zum Ergebnis', onclick: end })
          ]);
          return;
        }
        const p = players[turn % players.length];
        const how = mode === 'stirn' ? 'Halte das Handy gleich mit dem Bildschirm nach außen an deine Stirn. Die anderen erklären, du rätst!'
          : mode === 'panto' ? 'Du siehst den Begriff und stellst ihn ohne Worte dar. Die anderen raten.'
          : 'Du siehst den Begriff und erklärst ihn, ohne das Wort selbst zu sagen.';
        screen(root, [
          topBar(api, 'Zug ' + (turn + 1) + '/' + total() + ' · ' + MODES[mode], () => showScores(api, scores, 'Punktestand', 'Begriffe'), end),
          el('div', { class: 'pt-card cyan', style: { minHeight: '260px' } }, [
            el('div', { style: { fontSize: '56px' }, text: mode === 'stirn' ? '🙆' : mode === 'panto' ? '🤸' : '🗣️' }),
            el('div', { class: 'b-kicker', text: 'Du bist dran' }), el('div', { class: 'pt-name', text: p }),
            el('p', { class: 'b-hint', text: how })
          ]),
          el('button', { class: 'b-btn block pt-huge', text: '▶ Start (60 s)', onclick: () => {
            const holder = screen(root, []);
            countdown(ctx, api, holder, mode === 'stirn' ? 'Handy an die Stirn!' : 'Mach dich bereit!', () => run(p));
          } })
        ]);
      }
      function run(p){
        killOverlay();
        let hits = 0, skips = 0, busy = false;
        const words = [];
        const term = el('div', { class: 'term' });
        const tb = el('b', { class: 'b-num', style: { fontSize: '26px', color: 'var(--cyan)' } });
        const cnt = el('span', { class: 'b-pill good', style: { fontSize: '16px' }, text: '✓ 0' });
        overlay = el('div', { class: 'pt-fh', role: 'dialog', 'aria-label': 'Begriff' }, [
          el('div', { class: 'bar' }, [el('span', { class: 'b-pill cyan', text: p }), tb, el('div', { class: 'b-row', style: { gap: '8px' } }, [cnt, el('button', { class: 'b-icon-btn', 'aria-label': 'Zug beenden', text: '✕', onclick: () => { ctx.stop(iv); stop(); } })])]),
          term,
          el('div', { class: 'btns' }, [
            el('button', { class: 'skip', text: '⏭ WEITER', onpointerdown: e => { e.preventDefault(); act(false); } }),
            el('button', { class: 'hit', text: '✓ RICHTIG', onpointerdown: e => { e.preventDefault(); act(true); } })
          ])
        ]);
        document.body.append(overlay);
        let cur = '';
        const nextWord = () => { cur = d.next(); term.textContent = cur; term.classList.remove('b-pop'); void term.offsetWidth; term.classList.add('b-pop'); };
        const act = (ok) => {
          if(busy || !overlay) return;
          busy = true;
          words.push([cur, ok]);
          if(ok){ hits++; api.sound('good'); api.vibrate(40); overlay.classList.add('okflash'); }
          else { skips++; api.sound('flip'); api.vibrate(15); overlay.classList.add('skflash'); }
          cnt.textContent = '✓ ' + hits;
          ctx.to(() => { if(!overlay) return; overlay.classList.remove('okflash', 'skflash'); nextWord(); busy = false; }, 280);
        };
        let left = 60, iv = null;
        tb.textContent = left;
        iv = ctx.iv(() => {
          left--; tb.textContent = left;
          if(left <= 5 && left > 0){ api.sound('tick'); api.vibrate(20); }
          if(left <= 0){ ctx.stop(iv); stop(); }
        }, 1000);
        const stop = () => {
          killOverlay(); api.sound('lose'); api.vibrate(300);
          scores[p] += hits; hitsAll += hits; turn++;
          screen(root, [
            el('div', { class: 'pt-card pink' }, [el('div', { style: { fontSize: '50px' }, text: '⏰' }), el('div', { class: 'pt-name', text: p + ': ' + hits }), el('p', { class: 'b-hint', text: hits + ' erraten · ' + skips + ' übersprungen' })]),
            words.length ? el('div', { class: 'pt-chipline' }, words.map(([w, ok]) => el('span', { style: { color: ok ? 'var(--good)' : 'var(--mute)', borderColor: ok ? 'var(--good)' : '' }, text: (ok ? '✓ ' : '✗ ') + w }))) : null,
            el('button', { class: 'b-btn block pt-big', text: 'Weiter →', onclick: () => { api.sound('click'); ready(); } })
          ]);
        };
        nextWord();
      }
      ready();
    }
    menu();
    return () => ctx.kill();
  }
});

})();
