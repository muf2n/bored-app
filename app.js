/* BORED? Shell – Home, Games, Discover, Friends, Profil, Challenges, Erfolge, BORED AI */
(function(){
'use strict';
const B = window.BORED, el = B.el, store = B.store;
const view = document.getElementById('view');
const S = B.stats, P = B.profile;

/* =========================================================
   AKTIVITÄTEN für „Ich langweile mich!“ (Offline + Spiele)
   tags: alleine, freunde, drinnen, draussen, kurz, lang, einfach, schwierig
   ========================================================= */
const ACTS = [
  ['🏃','Lauf 2 km und stopp die Zeit','alleine draussen kurz einfach'],
  ['📸','Mach 10 Fotos nur von Dingen, die rund sind','alleine draussen kurz einfach'],
  ['🧱','Bau aus Zeug am Schreibtisch den höchsten Turm','alleine drinnen kurz einfach'],
  ['✍️','Schreib eine Kurzgeschichte mit genau 50 Wörtern','alleine drinnen kurz schwierig'],
  ['🎸','Lern die Grundgriffe von einem Song auf YouTube','alleine drinnen lang schwierig'],
  ['🍳','Koch etwas, das du noch nie gemacht hast','alleine drinnen lang schwierig'],
  ['🧹','Räum genau eine Lade komplett auf','alleine drinnen kurz einfach'],
  ['🗺️','Geh spazieren und bieg abwechselnd links und rechts ab','alleine draussen lang einfach'],
  ['💪','100 Wiederholungen: Liegestütz, Kniebeugen, Sit-ups gemischt','alleine drinnen kurz schwierig'],
  ['🧠','Lern die Hauptstädte von 10 Ländern auswendig','alleine drinnen kurz schwierig'],
  ['🎨','Zeichne deinen Lieblingsgegenstand im Comic-Stil','alleine drinnen kurz einfach'],
  ['📝','Schreib 10 Dinge auf, die du heuer noch machen willst','alleine drinnen kurz einfach'],
  ['🤹','Lern mit 3 Socken jonglieren','alleine drinnen lang schwierig'],
  ['🃏','Lern einen Kartentrick, bis er zweimal klappt','alleine drinnen lang schwierig'],
  ['🌌','Leg dich raus und such 3 Sternbilder','alleine draussen kurz einfach'],
  ['🎧','Hör ein komplettes Album in einem Genre, das du nie hörst','alleine drinnen lang einfach'],
  ['🧩','Bau in Minecraft dein eigenes Zimmer im Maßstab nach','alleine drinnen lang schwierig'],
  ['🔧','Nimm ein kaputtes Gerät auseinander und schau, wie es funktioniert','alleine drinnen lang schwierig'],
  ['💡','Bau eine einfache Schaltung: LED, Widerstand, Batterie','alleine drinnen kurz schwierig'],
  ['📦','Sortier deine Kabelkiste und beschrifte alles','alleine drinnen kurz einfach'],
  ['🎮','Spiel ein altes Spiel mit einer absurden Regel (z. B. ohne Springen)','alleine drinnen lang einfach'],
  ['💻','Programmier einen Würfel, der in der Konsole würfelt','alleine drinnen kurz schwierig'],
  ['🗒️','Erfinde einen Bossgegner: Name, Aussehen, drei Attacken','alleine drinnen kurz einfach'],
  ['🌳','Kletter auf den höchsten erlaubten Punkt in der Nähe und mach ein Foto','alleine draussen lang schwierig'],
  ['🚴','Fahr mit dem Rad eine Strecke, die du noch nie gefahren bist','alleine draussen lang einfach'],
  ['📚','Lies 30 Seiten in einem Buch','alleine drinnen kurz einfach'],
  ['🎤','Nimm einen 60-Sekunden-Podcast über dein Lieblingsthema auf','alleine drinnen kurz schwierig'],
  ['🧊','Mach eine Kalt-Dusche-Challenge: 30 Sekunden','alleine drinnen kurz schwierig'],
  ['🪴','Gieß alle Pflanzen und gib jeder einen Namen','alleine drinnen kurz einfach'],
  ['✉️','Schreib jemandem eine echte Nachricht, mit dem du lang nicht geredet hast','alleine drinnen kurz einfach'],
  ['🏀','Mach 50 Würfe auf einen Korb (oder Mistkübel) und zähl die Treffer','alleine draussen kurz einfach'],
  ['🧘','Sitz 5 Minuten still und zähl nur deine Atemzüge','alleine drinnen kurz einfach'],
  ['🕹️','Speedrun: Schaff das erste Level eines Spiels so schnell es geht, 3 Versuche','alleine drinnen kurz schwierig'],
  ['🃏','Spielt Karten: Schnapsen oder Uno','freunde drinnen lang einfach'],
  ['⚽','Elfmeterschießen, jeder 5 Schüsse','freunde draussen kurz einfach'],
  ['🎬','Dreht einen 1-Minuten-Actionfilm mit dem Handy','freunde draussen lang schwierig'],
  ['🍕','Kocht gemeinsam Pizza, jeder belegt ein Viertel','freunde drinnen lang einfach'],
  ['🏆','Macht ein Turnier im Lieblingsspiel mit Turnierbaum','freunde drinnen lang schwierig'],
  ['🗣️','Jeder erzählt seine peinlichste Schulgeschichte','freunde drinnen kurz einfach'],
  ['🧭','Schnitzeljagd: Einer versteckt 5 Dinge, die anderen suchen','freunde draussen lang schwierig'],
  ['🎯','Papierflieger-Weitwurf, 3 Versuche pro Person','freunde drinnen kurz einfach'],
  ['🎲','Erfindet ein eigenes Brettspiel mit Papier und Würfel','freunde drinnen lang schwierig'],
  ['🏐','Volleyball oder Fußball-Hochhalten, wer schafft die meisten','freunde draussen kurz einfach'],
  ['🎤','Karaoke-Battle mit Punkterichtern','freunde drinnen lang einfach'],
  ['📷','Fotowettbewerb: Thema „Schatten“, 20 Minuten, dann abstimmen','freunde draussen kurz einfach'],
  ['🧱','LEGO- oder Bau-Battle: Wer baut das beste Fahrzeug in 15 Minuten','freunde drinnen kurz schwierig'],
  ['🥏','Frisbee- oder Ball-Weitwurf im Park','freunde draussen kurz einfach'],
  ['🏃','Staffellauf mit Hindernissen','freunde draussen kurz schwierig'],
  ['🧠','Quiz-Abend: Jeder schreibt 5 Fragen über sich selbst','freunde drinnen kurz einfach'],
  ['🎭','Improtheater: Zieht Rolle + Ort + Problem und spielt die Szene','freunde drinnen kurz schwierig']
];
// Spiele mit Tags kommen automatisch dazu (aus BORED.games)

/* =========================================================
   CHALLENGES
   ========================================================= */
const CH_POOL = {
  daily: [
    { k: 'plays', n: 3, t: 'Warm gespielt', d: 'Spiele 3 Runden in beliebigen Spielen', xp: 40, diff: 'Leicht' },
    { k: 'wins', n: 2, t: 'Doppelsieg', d: 'Gewinne 2 Runden', xp: 60, diff: 'Mittel' },
    { k: 'cat:reaktion', n: 2, t: 'Schnelle Finger', d: 'Spiele 2 Reaktionsspiele', xp: 40, diff: 'Leicht' },
    { k: 'cat:denk', n: 2, t: 'Kopfarbeit', d: 'Spiele 2 Denkspiele', xp: 45, diff: 'Mittel' },
    { k: 'cat:quiz', n: 1, t: 'Klugscheißer', d: 'Spiele eine Quizrunde', xp: 35, diff: 'Leicht' },
    { k: 'game:chess', n: 1, t: 'Schachzug', d: 'Spiele eine Partie Schach', xp: 50, diff: 'Mittel' },
    { k: 'game:sudoku', n: 1, t: 'Neun mal neun', d: 'Spiele ein Sudoku', xp: 50, diff: 'Mittel' },
    { k: 'game:wortel', n: 1, t: 'Wortjäger', d: 'Spiele eine Runde Wortel', xp: 35, diff: 'Leicht' },
    { k: 'cat:kreativ', n: 1, t: 'Künstler', d: 'Mach eine Kreativ-Challenge', xp: 40, diff: 'Leicht' },
    { k: 'distinct', n: 3, t: 'Abwechslung', d: 'Spiele 3 verschiedene Spiele', xp: 50, diff: 'Mittel' },
    { k: 'xp', n: 100, t: 'XP-Jäger', d: 'Sammle heute 100 XP', xp: 40, diff: 'Mittel' },
    { k: 'act', n: 1, t: 'Raus aus dem Handy', d: 'Erledige eine Aktivität aus „Ich langweile mich!“', xp: 50, diff: 'Leicht' }
  ],
  weekly: [
    { k: 'plays', n: 25, t: 'Dauerbrenner', d: 'Spiele 25 Runden diese Woche', xp: 150, diff: 'Mittel' },
    { k: 'wins', n: 12, t: 'Siegesserie', d: 'Gewinne 12 Runden diese Woche', xp: 180, diff: 'Schwer' },
    { k: 'distinct', n: 8, t: 'Entdecker', d: 'Spiele 8 verschiedene Spiele', xp: 160, diff: 'Mittel' },
    { k: 'cat:party', n: 2, t: 'Partylöwe', d: 'Spiele 2 Partyspiele mit Freunden', xp: 150, diff: 'Mittel' },
    { k: 'game:chess', n: 5, t: 'Großmeister in spe', d: 'Spiele 5 Partien Schach', xp: 200, diff: 'Schwer' },
    { k: 'act', n: 3, t: 'Echtes Leben', d: 'Erledige 3 Offline-Aktivitäten', xp: 150, diff: 'Mittel' },
    { k: 'cat:online', n: 1, t: 'Online-Duell', d: 'Spiele eine Online-Runde mit Freunden', xp: 200, diff: 'Mittel' }
  ]
};
function challengeSet(kind){
  const key = kind === 'daily' ? B.today() : B.weekKey();
  let st = store.get('ch.' + kind, null);
  if(!st || st.key !== key){
    const rng = B.seeded(kind + key + (P.created || ''));
    const pool = CH_POOL[kind].slice(), pick = [];
    while(pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    st = { key, list: pick.map(c => Object.assign({}, c, { p: 0, claimed: false, seen: [] })) };
    store.set('ch.' + kind, st);
  }
  return st;
}
function progressChallenges(ev){
  ['daily', 'weekly'].forEach(kind => {
    const st = challengeSet(kind); let changed = false;
    st.list.forEach(c => {
      if(c.claimed || c.p >= c.n) return;
      let inc = 0;
      if(ev.type === 'finish'){
        if(c.k === 'plays') inc = 1;
        else if(c.k === 'wins' && ev.win) inc = 1;
        else if(c.k === 'cat:' + ev.cat) inc = 1;
        else if(c.k === 'game:' + ev.id) inc = 1;
        else if(c.k === 'distinct' && !c.seen.includes(ev.id)){ c.seen.push(ev.id); inc = 1; }
      } else if(ev.type === 'xp' && c.k === 'xp') inc = ev.amount;
      else if(ev.type === 'act' && c.k === 'act') inc = 1;
      if(inc){ c.p = Math.min(c.n, c.p + inc); changed = true; if(c.p >= c.n){ B.toast('Challenge geschafft: ' + c.t + ' – hol dir die XP!', 'xp'); B.sound('good'); } }
    });
    if(changed) store.set('ch.' + kind, st);
  });
}
function claimChallenge(kind, i){
  const st = challengeSet(kind), c = st.list[i];
  if(!c || c.claimed || c.p < c.n) return;
  c.claimed = true; store.set('ch.' + kind, st);
  B.addXP(c.xp, 'Challenge', 'challenge');
  const n = store.get('chDone', 0) + 1; store.set('chDone', n);
  checkAchievements(); render();
}

/* =========================================================
   ERFOLGE
   ========================================================= */
const ACH = [
  ['first', '🎮', 'Erstes Spiel', 'Spiele deine erste Runde', () => S.plays >= 1],
  ['p25', '🕹️', 'Gamer', '25 Runden gespielt', () => S.plays >= 25],
  ['p100', '💯', 'Süchtig', '100 Runden gespielt', () => S.plays >= 100],
  ['w1', '🥇', 'Erster Sieg', 'Gewinne eine Runde', () => S.wins >= 1],
  ['w25', '🏆', 'Champion', '25 Siege', () => S.wins >= 25],
  ['w100', '👑', 'Unbesiegbar', '100 Siege', () => S.wins >= 100],
  ['l5', '⭐', 'Level 5', 'Erreiche Level 5', () => B.levelInfo().level >= 5],
  ['l10', '🌟', 'Level 10', 'Erreiche Level 10', () => B.levelInfo().level >= 10],
  ['l20', '💫', 'Level 20', 'Erreiche Level 20', () => B.levelInfo().level >= 20],
  ['streak3', '🔥', 'Am Ball', '3 Tage in Folge gespielt', () => S.streak >= 3],
  ['streak7', '☄️', 'Wochen-Serie', '7 Tage in Folge gespielt', () => S.streak >= 7],
  ['div5', '🧭', 'Entdecker', '5 verschiedene Spiele gespielt', () => Object.keys(S.byGame).length >= 5],
  ['div15', '🗺️', 'Weltenbummler', '15 verschiedene Spiele gespielt', () => Object.keys(S.byGame).length >= 15],
  ['chess1', '♞', 'Schachmatt', 'Gewinne eine Partie Schach', () => (S.byGame.chess || {}).wins >= 1],
  ['quiz5', '🧠', 'Quizmaster', '5 Quizrunden gewonnen', () => (S.byGame.quiz || {}).wins >= 5],
  ['ch1', '✅', 'Herausgefordert', 'Schließe eine Challenge ab', () => store.get('chDone', 0) >= 1],
  ['ch20', '🎯', 'Challenge-Profi', '20 Challenges abgeschlossen', () => store.get('chDone', 0) >= 20],
  ['act1', '🌳', 'Offline-Held', 'Erledige eine echte Aktivität', () => store.get('actDone', 0) >= 1],
  ['act10', '🏔️', 'Abenteurer', '10 echte Aktivitäten erledigt', () => store.get('actDone', 0) >= 10],
  ['box7', '🎁', 'Schatzsucher', '7 Überraschungsboxen geöffnet', () => store.get('boxCount', 0) >= 7],
  ['party', '🎉', 'Partykanone', 'Spiele 5 Partyspiele', () => Object.entries(S.byGame).filter(([id]) => (B.getGame(id) || {}).cat === 'party').reduce((a, [, v]) => a + v.plays, 0) >= 5],
  ['online', '🌐', 'Vernetzt', 'Spiele eine Online-Runde', () => Object.entries(S.byGame).some(([id, v]) => /^online/.test(id) && v.plays > 0) || store.get('onlinePlays', 0) > 0],
  ['ai', '🤖', 'KI-Kumpel', 'Frag BORED AI um Rat', () => store.get('aiUsed', 0) >= 1],
  ['fav', '❤️', 'Sammler', 'Markiere 3 Favoriten', () => P.favs.length >= 3]
];
function checkAchievements(){
  const got = store.get('ach', {}); let neu = false;
  ACH.forEach(([id, e, name, , test]) => {
    if(got[id]) return;
    let ok = false; try{ ok = test(); }catch(err){}
    if(ok){ got[id] = Date.now(); neu = true; setTimeout(() => { B.toast(e + ' Erfolg: ' + name, 'xp'); B.sound('level'); }, 900); B.addXP(25, 'Erfolg', 'ach'); }
  });
  if(neu) store.set('ach', got);
}
const FRAMES = [['none', 'Ohne', 1], ['neon', 'Neon', 3], ['violet', 'Violett', 6], ['pink', 'Pink', 10], ['gold', 'Gold', 15], ['rgb', 'RGB', 20]];
const AVATARS = ['😎','🤖','👾','🦊','🐉','🐺','🦁','🐸','🐼','🦄','👻','💀','🥷','🧙','🧛','👽','🐙','🦖','🐧','🐯','🦅','🔥','⚡','🌙','🎮','🍕','🚀','💎','🌈','🎧'];

/* Ereignisse aus dem Core */
B.on('finish', ev => { progressChallenges(Object.assign({ type: 'finish' }, ev)); checkAchievements(); if(ev.cat === 'online') store.set('onlinePlays', store.get('onlinePlays', 0) + 1); });
B.on('xp', amount => progressChallenges({ type: 'xp', amount }));
B.on('levelup', () => checkAchievements());
B.on('closegame', () => render());
B.on('nav', tab => go(tab));

/* =========================================================
   NAVIGATION
   ========================================================= */
let tab = 'home', lobbyCleanup = null;
const tabs = { home: renderHome, games: renderGames, discover: renderDiscover, friends: renderFriends, profile: renderProfile };
document.querySelectorAll('#nav button').forEach(b => b.addEventListener('click', () => { B.sound('click'); go(b.dataset.tab); }));
function go(t){
  if(!tabs[t]) t = 'home';
  tab = t;
  document.querySelectorAll('#nav button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  if(location.hash !== '#' + t && t !== 'home') try{ history.replaceState(null, '', '#' + t); }catch(e){ location.hash = t; }
  if(t === 'home' && location.hash) try{ history.replaceState(null, '', location.pathname + location.search); }catch(e){}
  view.scrollTop = 0; render();
}
function render(){
  if(lobbyCleanup){ try{ lobbyCleanup(); }catch(e){} lobbyCleanup = null; }
  view.innerHTML = '';
  const page = el('div', { class: 'b-stack ap-enter' });
  view.append(page);
  tabs[tab](page);
}
window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if(tabs[t] && t !== tab) go(t); });

/* Kleine Bausteine */
const sec = (title, action, kids) => el('section', { class: 'ap-sec' }, [
  el('div', { class: 'ap-sec-h' }, [el('h2', { class: 'b-h', text: title }), action ? el('button', { text: action[0], onclick: action[1] }) : null]),
  ...[].concat(kids)
]);
const gameCard = g => el('button', { class: 'ap-gcard b-card tap', onclick: () => { B.sound('click'); B.openGame(g.id); } }, [
  el('span', { class: 'em', text: g.icon }), el('b', { text: g.name }),
  el('small', { text: (B.CATS[g.cat] || {}).name + ' · ' + (g.players === '1' ? 'Solo' : g.players === 'online' ? 'Online' : g.players + ' Spieler') })
]);
const avatar = (big) => { const li = B.levelInfo(); return el('div', { class: 'ap-ava ' + (big ? 'big ' : '') + 'fr-' + (P.frame || 'none') }, [el('span', { text: P.avatar }), el('span', { class: 'lv', text: 'LV ' + li.level })]); };
const xpBar = () => { const li = B.levelInfo(); const bar = el('div', { class: 'b-bar' }, el('i')); requestAnimationFrame(() => bar.firstChild.style.width = li.pct + '%'); return bar; };
const playable = () => B.games.filter(g => g.id !== 'online-info');

/* =========================================================
   HOME
   ========================================================= */
function greeting(){ const h = new Date().getHours(); return h < 5 ? 'Noch wach' : h < 11 ? 'Guten Morgen' : h < 14 ? 'Mahlzeit' : h < 18 ? 'Servus' : 'Guten Abend'; }
function renderHome(page){
  const li = B.levelInfo();
  page.append(el('div', { class: 'ap-hero' }, [
    avatar(),
    el('div', { class: 'grow', style: { flex: 1, minWidth: 0 } }, [
      el('div', { class: 'b-kicker', text: greeting() + (P.name ? ',' : '') }),
      el('div', { class: 'b-title', text: P.name || 'Spieler' }),
      el('div', { class: 'b-hint', text: B.rank() + ' · ' + li.into + ' / ' + li.need + ' XP' })
    ]),
    el('div', { class: 'b-center', style: { gap: '0' } }, [el('span', { style: { fontSize: '22px' }, text: '🔥' }), el('b', { class: 'b-num', text: S.streak || 0 }), el('small', { class: 'b-hint', style: { fontSize: '11px' }, text: 'Tage' })])
  ]), xpBar());

  page.append(el('button', { class: 'ap-bored', onclick: () => { B.sound('pop'); boredRoulette(); } }, [el('b', { text: 'ICH LANGWEILE MICH!' }), el('small', { text: 'Tippen und ich such dir was aus' })]));

  // Tagesstatistik
  const d = S.days[B.today()] || { xp: 0, plays: 0, wins: 0 };
  page.append(el('div', { class: 'b-grid3' }, [
    el('div', { class: 'b-stat' }, [el('small', { text: 'XP heute' }), el('b', { text: d.xp })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Runden' }), el('b', { text: d.plays })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Siege' }), el('b', { text: d.wins })])
  ]));

  // Überraschungsbox + Tagesquiz
  const boxOpen = store.get('boxDay', '') === B.today();
  page.append(el('div', { class: 'b-grid2' }, [
    el('button', { class: 'b-card tap glow b-center', style: { minHeight: '128px' }, onclick: openBox }, [
      el('span', { class: 'ap-box' + (boxOpen ? '' : ' shake'), style: { fontSize: '40px' }, text: boxOpen ? '📭' : '🎁' }),
      el('b', { class: 'b-h', style: { fontSize: '16px' }, text: boxOpen ? 'Morgen wieder' : 'Tagesbox' }),
      el('small', { class: 'b-hint', text: boxOpen ? 'Schon geöffnet' : 'Gratis-Überraschung' })
    ]),
    el('button', { class: 'b-card tap glow b-center', style: { minHeight: '128px' }, onclick: () => B.getGame('quiz') ? B.openGame('quiz', { daily: true }) : B.toast('Quiz lädt noch') }, [
      el('span', { style: { fontSize: '40px' }, text: '🧠' }),
      el('b', { class: 'b-h', style: { fontSize: '16px' }, text: 'Tagesquiz' }),
      el('small', { class: 'b-hint', text: '10 Fragen, für alle gleich' })
    ])
  ]));

  // Tages-Challenges
  const dc = challengeSet('daily');
  page.append(sec('Tages-Challenges', ['Alle', () => go('discover')], dc.list.slice(0, 3).map((c, i) => chCard(c, 'daily', i))));

  // Weiterspielen
  const recent = store.get('recent', []).map(B.getGame).filter(Boolean);
  if(recent.length) page.append(sec('Weiterspielen', null, el('div', { class: 'b-scrollx' }, recent.map(gameCard))));

  // Wochen-Event (persönlich)
  const ev = weeklyEvent();
  if(ev.game){
    const es = eventState();
    page.append(sec('Event der Woche', null, el('button', { class: 'b-card tap glow b-rgb', onclick: () => B.openGame(ev.game.id) }, [
      el('div', { class: 'b-between' }, [el('span', { class: 'b-pill pink', text: '⏳ bis Sonntag' }), el('span', { class: 'b-pill cyan', text: es.claimed ? '✓ Belohnung kassiert' : '+150 XP Belohnung' })]),
      el('div', { class: 'ap-hero', style: { marginTop: '10px' } }, [
        el('span', { style: { fontSize: '44px' }, text: ev.game.icon }),
        el('div', { style: { flex: 1, minWidth: 0 } }, [el('b', { class: 'b-title', style: { fontSize: '19px' }, text: ev.name }), el('div', { class: 'b-hint', text: 'Spiel diese Woche 5 Runden ' + ev.game.name + '.' })])
      ]),
      el('div', { class: 'b-bar', style: { marginTop: '10px' } }, el('i', { style: { width: Math.min(100, es.n / 5 * 100) + '%' } })),
      el('small', { class: 'b-hint', text: Math.min(es.n, 5) + ' / 5 Runden' })
    ])));
  }

  // Beliebt (bei dir) / Empfohlen
  const mostPlayed = Object.entries(S.byGame).sort((a, b) => b[1].plays - a[1].plays).map(([id]) => B.getGame(id)).filter(Boolean).slice(0, 6);
  const picks = recommended(6);
  if(mostPlayed.length >= 2) page.append(sec('Deine Lieblinge', null, el('div', { class: 'b-scrollx' }, mostPlayed.map(gameCard))));
  page.append(sec('Empfohlen für dich', ['Alle Spiele', () => go('games')], el('div', { class: 'b-scrollx' }, picks.map(gameCard))));

  // Freunde online (echt, über Lobby)
  const fo = el('div', { class: 'b-hint', text: 'Verbinde dich in FRIENDS mit Freunden, die denselben Link haben.' });
  page.append(sec('Freunde', ['Öffnen', () => go('friends')], el('button', { class: 'b-card tap', onclick: () => go('friends') }, [el('div', { class: 'b-between' }, [el('b', { class: 'b-h', style: { fontSize: '17px' }, text: '🌐 Online spielen' }), el('span', { class: 'b-pill cyan', text: 'Raum-Codes' })]), fo])));

  // Neue Spiele
  page.append(sec('Alle Kategorien', null, el('div', { class: 'b-chips' }, Object.entries(B.CATS).map(([k, c]) => el('button', { class: 'b-chip', text: c.icon + ' ' + c.name, onclick: () => { gamesFilter = k; go('games'); } })))));
}
function chCard(c, kind, i){
  const done = c.p >= c.n;
  const bar = el('div', { class: 'b-bar' }, el('i', { style: { width: Math.round(c.p / c.n * 100) + '%' } }));
  const bonus = 1;
  return el('div', { class: 'b-card ap-ch' + (done ? ' done' : '') }, [
    el('div', { class: 'top' }, [
      el('div', { class: 'tx' }, [el('b', { text: c.t }), el('div', { class: 'b-hint', text: c.d })]),
      el('span', { class: 'b-pill ' + (c.diff === 'Leicht' ? 'good' : c.diff === 'Mittel' ? 'warn' : 'bad'), text: c.diff })
    ]),
    bar,
    el('div', { class: 'b-between' }, [
      el('small', { class: 'b-hint', text: (c.k === 'xp' ? c.p + ' / ' + c.n + ' XP' : c.p + ' / ' + c.n) + ' · ' + (kind === 'daily' ? 'bis Mitternacht' : 'bis Sonntag') }),
      c.claimed ? el('span', { class: 'b-pill good', text: '✓ Erledigt' })
        : done ? el('button', { class: 'b-btn sm cyan', text: '+' + c.xp * bonus + ' XP holen', onclick: () => claimChallenge(kind, i) })
        : el('span', { class: 'b-pill', text: '+' + c.xp * bonus + ' XP' })
    ])
  ]);
}
function weeklyEvent(){
  const rng = B.seeded('event' + B.weekKey());
  const pool = playable().filter(g => g.kind !== 'tool' && g.cat !== 'online' && g.cat !== 'party');
  const names = ['Neon-Nächte', 'Turbo-Woche', 'Hirnfrost', 'Pixelsturm', 'Glitch-Week', 'Night Shift', 'Overdrive'];
  const game = pool.length ? pool[Math.floor(rng() * pool.length)] : null;
  return { game, name: names[Math.floor(rng() * names.length)], ch: Math.floor(rng() * 3) };
}
function eventState(){
  let es = store.get('event', null);
  if(!es || es.week !== B.weekKey()){ es = { week: B.weekKey(), n: 0, claimed: false }; store.set('event', es); }
  return es;
}
B.on('finish', ev => {
  const we = weeklyEvent(); if(!we.game || ev.id !== we.game.id) return;
  const es = eventState(); if(es.claimed) return;
  es.n++; if(es.n >= 5){ es.claimed = true; setTimeout(() => { B.addXP(150, 'Event der Woche', 'event'); B.confetti(); }, 900); }
  store.set('event', es);
});
function recommended(n){
  const played = S.byGame;
  const favCats = {};
  Object.entries(played).forEach(([id, v]) => { const g = B.getGame(id); if(g) favCats[g.cat] = (favCats[g.cat] || 0) + v.plays; });
  const rng = B.seeded('rec' + B.today());
  return playable().filter(g => g.cat !== 'online').map(g => ({ g, s: (played[g.id] ? 0 : 2) + (favCats[g.cat] || 0) * .3 + rng() * 2 + (P.favs.includes(g.id) ? 1 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, n).map(x => x.g);
}

/* Tagesbox */
function openBox(){
  if(store.get('boxDay', '') === B.today()){ B.toast('Die nächste Box gibt es morgen 🎁'); return; }
  const rng = B.seeded('box' + B.today() + (P.created || ''));
  const r = rng();
  const prize = r < .55 ? { t: 'xp', v: 20 + Math.floor(rng() * 4) * 10 } : r < .8 ? { t: 'mystery' } : { t: 'big', v: 100 };
  B.sheet(close => {
    const box = el('span', { class: 'ap-box shake', text: '🎁' });
    const res = el('div', { class: 'b-stack b-center' });
    const btn = el('button', { class: 'b-btn block', text: 'Öffnen!', onclick: () => {
      btn.disabled = true; B.sound('tick');
      setTimeout(() => {
        box.classList.remove('shake'); box.textContent = prize.t === 'mystery' ? '🔮' : prize.t === 'big' ? '💎' : '✨'; B.sound('win'); B.confetti();
        store.set('boxDay', B.today()); store.set('boxCount', store.get('boxCount', 0) + 1);
        if(prize.t === 'mystery'){
          const g = B.pick(playable().filter(x => x.kind !== 'tool' && x.cat !== 'online'));
          res.append(el('b', { class: 'b-title b-grad', text: 'Mystery Challenge!' }), el('p', { class: 'b-hint', text: 'Spiel jetzt eine Runde ' + g.name + ' und kassier 60 Bonus-XP.' }));
          store.set('mystery', { day: B.today(), id: g.id });
          btn.replaceWith(el('button', { class: 'b-btn cyan block', text: 'Los: ' + g.name, onclick: () => { close(); B.openGame(g.id); } }));
        } else {
          B.addXP(prize.v, 'Tagesbox', 'box');
          res.append(el('b', { class: 'b-title b-grad', text: prize.v + ' XP!' }), el('p', { class: 'b-hint', text: prize.t === 'big' ? 'Jackpot! Selten, aber heute gehört er dir.' : 'Morgen wartet die nächste Box.' }));
          btn.replaceWith(el('button', { class: 'b-btn ghost block', text: 'Nice', onclick: close }));
        }
        checkAchievements();
      }, 1100);
    } });
    return el('div', { class: 'b-stack b-center' }, [el('div', { class: 'b-kicker', text: 'Tägliche Überraschung' }), box, res, btn]);
  }, { onClose: render });
}
B.on('finish', ev => { const m = store.get('mystery', null); if(m && m.day === B.today() && m.id === ev.id){ store.set('mystery', null); setTimeout(() => B.addXP(60, 'Mystery Challenge', 'mystery'), 700); } });

/* „Ich langweile mich!“ – Zufallsgenerator mit Filtern */
const FILTERS = [['alleine', 'Alleine'], ['freunde', 'Mit Freunden'], ['drinnen', 'Drinnen'], ['draussen', 'Draußen'], ['kurz', 'Kurz'], ['lang', 'Lang'], ['einfach', 'Einfach'], ['schwierig', 'Schwierig']];
function candidates(filters, what){
  const out = [];
  if(what !== 'games') ACTS.forEach(([e, t, tags]) => out.push({ type: 'act', e, t, tags: tags.split(' ') }));
  if(what !== 'acts') playable().forEach(g => {
    const tags = g.tags.length ? g.tags.slice() : [];
    if(!tags.includes('drinnen')) tags.push('drinnen');
    if(g.players === '1' && !tags.includes('alleine')) tags.push('alleine');
    if(/2|online/.test(g.players) && !tags.includes('freunde')) tags.push('freunde');
    out.push({ type: 'game', e: g.icon, t: g.name, id: g.id, tags });
  });
  const groups = [['alleine', 'freunde'], ['drinnen', 'draussen'], ['kurz', 'lang'], ['einfach', 'schwierig']];
  return out.filter(c => groups.every(gr => { const sel = gr.filter(f => filters.includes(f)); return !sel.length || sel.some(f => c.tags.includes(f)); }));
}
function boredRoulette(){
  let filters = store.get('boredFilters', []), what = 'all';
  B.sheet(close => {
    const wrap = el('div', { class: 'b-stack' });
    const chips = el('div', { class: 'b-chips' });
    const whatChips = el('div', { class: 'b-chips' });
    const reel = el('div', { class: 'reel' });
    const slot = el('div', { class: 'ap-slot' }, reel);
    const info = el('div', { class: 'b-hint', style: { textAlign: 'center' } });
    const actions = el('div', { class: 'b-grid2' });
    let current = null;
    const drawChips = () => {
      chips.innerHTML = ''; FILTERS.forEach(([k, l]) => chips.append(el('button', { class: 'b-chip', 'aria-pressed': String(filters.includes(k)), text: l, onclick: () => { filters = filters.includes(k) ? filters.filter(x => x !== k) : filters.concat(k); store.set('boredFilters', filters); B.sound('click'); drawChips(); count(); } })));
      whatChips.innerHTML = ''; [['all', 'Alles'], ['acts', 'Aktivitäten'], ['games', 'Spiele']].forEach(([k, l]) => whatChips.append(el('button', { class: 'b-chip', 'aria-pressed': String(what === k), text: l, onclick: () => { what = k; B.sound('click'); drawChips(); count(); } })));
    };
    const count = () => { info.textContent = candidates(filters, what).length + ' passende Vorschläge'; };
    const item = c => el('div', { class: 'it' }, [el('span', { class: 'e', text: c.e }), el('b', { text: c.t })]);
    reel.append(el('div', { class: 'it' }, [el('span', { class: 'e', text: '🎰' }), el('b', { text: 'Filter wählen und drehen!' })]));
    const spin = () => {
      const list = candidates(filters, what);
      if(!list.length){ info.textContent = 'Nichts passt zu allen Filtern. Nimm einen raus.'; slot.classList.add('b-shake'); setTimeout(() => slot.classList.remove('b-shake'), 400); return; }
      const seq = Array.from({ length: 18 }, () => B.pick(list)); current = seq[seq.length - 1];
      reel.style.transition = 'none'; reel.style.transform = 'translateY(0)'; reel.innerHTML = '';
      reel.append(reel.firstChild || item(seq[0])); seq.forEach(c => reel.append(item(c)));
      reel.offsetHeight;
      const dur = B.settings.anim ? 1600 : 0;
      reel.style.transition = 'transform ' + dur + 'ms cubic-bezier(.15,.85,.25,1)';
      reel.style.transform = 'translateY(-' + (seq.length * 120) + 'px)';
      let ticks = 0; const tk = setInterval(() => { B.sound('tick'); if(++ticks > 10) clearInterval(tk); }, 120);
      setTimeout(() => { B.sound('good'); B.vibrate(30); showActions(); }, dur + 50);
    };
    const showActions = () => {
      actions.innerHTML = '';
      if(current.type === 'game') actions.append(el('button', { class: 'b-btn ghost', text: 'Nochmal', onclick: spin }), el('button', { class: 'b-btn cyan', text: '▶ Spielen', onclick: () => { close(); B.openGame(current.id); } }));
      else actions.append(el('button', { class: 'b-btn ghost', text: 'Nochmal', onclick: spin }), el('button', { class: 'b-btn cyan', text: '✓ Erledigt', onclick: () => {
        const day = store.get('actDay', { d: '', n: 0 }); if(day.d !== B.today()){ day.d = B.today(); day.n = 0; }
        if(day.n >= 3){ B.toast('Heute schon 3 Aktivitäten erledigt – stark!'); close(); return; }
        day.n++; store.set('actDay', day); store.set('actDone', store.get('actDone', 0) + 1);
        B.addXP(30, 'Aktivität', 'act'); progressChallenges({ type: 'act' }); checkAchievements(); close(); render();
      } }));
    };
    drawChips(); count();
    actions.append(el('button', { class: 'b-btn block', style: { gridColumn: '1 / -1' }, text: '🎰 Drehen', onclick: spin }));
    wrap.append(el('div', { class: 'b-kicker', text: 'Zufallsgenerator' }), el('h3', { class: 'b-title b-grad', text: 'Was mach ich jetzt?' }), whatChips, chips, slot, info, actions,
      el('p', { class: 'b-hint', style: { fontSize: '12px' }, text: 'Erledigte Aktivitäten geben 30 XP (max. 3 pro Tag). Sei ehrlich – es geht um dich.' }));
    return wrap;
  });
}

/* =========================================================
   GAMES
   ========================================================= */
let gamesFilter = 'alle', gamesQuery = '';
function renderGames(page){
  page.append(el('div', {}, [el('div', { class: 'b-kicker', text: playable().length + ' Spiele & Tools' }), el('h1', { class: 'b-title', text: 'Spielesammlung' })]));
  const search = el('input', { class: 'b-input', type: 'search', placeholder: 'Spiel suchen …', value: gamesQuery, 'aria-label': 'Spiel suchen' });
  const chips = el('div', { class: 'b-chips' });
  const grid = el('div', { class: 'ap-ggrid' });
  const draw = () => {
    chips.innerHTML = '';
    [['alle', '✨ Alle'], ['favs', '❤️ Favoriten'], ...Object.entries(B.CATS).map(([k, c]) => [k, c.icon + ' ' + c.name])].forEach(([k, l]) =>
      chips.append(el('button', { class: 'b-chip', 'aria-pressed': String(gamesFilter === k), text: l, onclick: () => { gamesFilter = k; B.sound('click'); draw(); } })));
    grid.innerHTML = '';
    const q = gamesQuery.trim().toLowerCase();
    const list = playable().concat(B.getGame('online-info') ? [B.getGame('online-info')] : []).filter(g =>
      (gamesFilter === 'alle' || (gamesFilter === 'favs' ? P.favs.includes(g.id) : g.cat === gamesFilter)) &&
      (!q || (g.name + ' ' + (g.desc || '')).toLowerCase().includes(q)));
    if(!list.length) grid.append(el('p', { class: 'b-hint', style: { gridColumn: '1/-1' }, text: gamesFilter === 'favs' ? 'Noch keine Favoriten. Tippe im Spiel auf das Herz.' : 'Nichts gefunden.' }));
    list.forEach(g => {
      const c = gameCard(g); const best = (S.byGame[g.id] || {}).plays;
      if(best) c.append(el('span', { class: 'b-pill cyan', style: { alignSelf: 'flex-start' }, text: best + '× gespielt' }));
      grid.append(c);
    });
  };
  search.addEventListener('input', () => { gamesQuery = search.value; draw(); });
  draw();
  page.append(search, chips, grid);
}

/* =========================================================
   DISCOVER – Challenges, Generatoren, BORED AI
   ========================================================= */
function renderDiscover(page){
  page.append(el('div', {}, [el('div', { class: 'b-kicker', text: 'Entdecken' }), el('h1', { class: 'b-title', text: 'Discover' })]));
  // BORED AI
  page.append(el('button', { class: 'b-card tap glow b-rgb', onclick: openAI }, [
    el('div', { class: 'ap-hero' }, [
      el('div', { class: 'ap-ava', style: { fontSize: '30px' }, text: '🤖' }),
      el('div', {}, [el('b', { class: 'b-title', style: { fontSize: '20px' }, text: 'BORED AI' }), el('div', { class: 'b-hint', text: 'Sag mir, wie du drauf bist – ich find was für dich, erfinde Rätsel, Challenges und Spielideen.' })])
    ])
  ]));
  // Tools
  const tools = ['creator', 'generators', 'draw', 'draw-challenge', 'story'].map(B.getGame).filter(Boolean);
  if(tools.length) page.append(sec('Kreativ & Generatoren', null, el('div', { class: 'ap-ggrid' }, tools.map(gameCard))));
  page.append(el('button', { class: 'ap-bored', style: { padding: '16px' }, onclick: boredRoulette }, [el('b', { style: { fontSize: '20px' }, text: '🎰 WAS SOLL ICH MACHEN?' }), el('small', { text: 'Aktivitäten & Spiele mit Filtern' })]));
  // Challenges
  const dc = challengeSet('daily'), wc = challengeSet('weekly');
  page.append(sec('Tages-Challenges', null, dc.list.map((c, i) => chCard(c, 'daily', i))));
  page.append(sec('Wochen-Challenges', null, wc.list.map((c, i) => chCard(c, 'weekly', i))));
  // Aktivitäten-Ideen
  const rng = B.seeded('acts' + B.today());
  const ideas = ACTS.slice().sort(() => rng() - .5).slice(0, 5);
  page.append(sec('Heute mal offline', ['Mehr', boredRoulette], el('div', { class: 'b-list' }, ideas.map(([e, t, tags]) => el('div', { class: 'b-item' }, [el('span', { class: 'ic', text: e }), el('div', { class: 'tx' }, [el('b', { style: { fontSize: '15px', whiteSpace: 'normal' }, text: t }), el('small', { text: tags.split(' ').join(' · ') })])])))));
}

/* BORED AI */
let aiHistory = store.get('aiHistory', []);
function openAI(){
  B.sheet(close => {
    const wrap = el('div', { class: 'b-stack' });
    const log = el('div', { class: 'ap-chat' });
    const input = el('input', { class: 'b-input', placeholder: 'Mir ist langweilig und …', 'aria-label': 'Nachricht an BORED AI', maxlength: 300 });
    const send = el('button', { class: 'b-btn', text: 'Senden' });
    const moods = el('div', { class: 'b-chips' }, [
      ['😴 Müde', 'Ich bin müde und mir ist langweilig.'], ['⚡ Voll Energie', 'Ich hab voll Energie und mir ist langweilig.'], ['👥 Mit Freunden', 'Ich bin mit Freunden und uns ist langweilig.'],
      ['🧩 Rätsel', 'Erfinde mir ein knackiges Rätsel mit Lösung (Lösung erst am Ende).'], ['🎯 Challenge', 'Erfinde mir eine kreative Challenge für die nächsten 30 Minuten.'], ['🎮 Spielidee', 'Erfinde mir eine Idee für ein eigenes kleines Spiel, das ich programmieren könnte.']
    ].map(([l, t]) => el('button', { class: 'b-chip', text: l, onclick: () => ask(t) })));
    const status = el('div', { class: 'b-hint' });
    const bubble = (who, text) => { const m = el('div', { class: 'ap-msg ' + who, text }); log.append(m); setTimeout(() => m.scrollIntoView({ block: 'end', behavior: 'smooth' }), 30); return m; };
    aiHistory.slice(-8).forEach(m => bubble(m.role === 'user' ? 'me' : 'ai', m.content));
    if(!aiHistory.length) bubble('ai', 'Hey' + (P.name ? ' ' + P.name : '') + '! Ich bin BORED AI. Sag mir, wie du drauf bist, ob du allein bist oder mit Freunden – ich such dir was Passendes aus der App oder aus dem echten Leben aus.');
    let busy = false, sample;
    B.cap('sample').then(s => { sample = s; if(!s){ status.textContent = 'BORED AI ist in dieser Ansicht nicht verfügbar. Öffne die App über ihren claude.ai-Link, um mit der KI zu chatten.'; send.disabled = true; input.disabled = true; } });
    async function ask(text){
      text = (text || input.value).trim(); if(!text || busy) return;
      if(!sample){ status.textContent = 'KI nicht verfügbar.'; return; }
      busy = true; send.disabled = true; input.value = '';
      bubble('me', text); aiHistory.push({ role: 'user', content: text });
      const out = bubble('ai', '…');
      const catalog = playable().map(g => g.id + ' = ' + g.name + ' (' + ((B.CATS[g.cat] || {}).name || g.cat) + ', ' + (g.players === '1' ? 'solo' : g.players + ' Spieler') + ')').join('\n');
      const sys = 'Du bist BORED AI, der freche, freundliche Assistent der Anti-Langeweile-App „BORED?“. Antworte auf Deutsch, locker, kurz (max. 120 Wörter), du-Form, jugendfrei. ' +
        'Nutzer: ' + (P.name || 'unbekannt') + ', Level ' + B.levelInfo().level + '. Hilf gegen Langeweile: schlage passende Spiele aus der App und echte Aktivitäten vor, erfinde Rätsel, Quizfragen, Challenges, Geschichten und Spielideen. ' +
        'Spiele in der App (id = Name):\n' + catalog + '\n' +
        'Wenn du Spiele aus der App empfiehlst, schreibe ganz am Ende eine eigene Zeile genau so: SPIELE: id1, id2 (max. 3, nur ids aus der Liste). Sonst keine solche Zeile.';
      const msgs = [{ role: 'user', content: sys + '\n\n---\nUnterhaltung beginnt.' }, { role: 'assistant', content: 'Alles klar!' }].concat(aiHistory.slice(-10));
      try{
        const r = await sample(msgs, { cache: false, onText: ({ text }) => { out.textContent = text.replace(/\n?SPIELE:.*$/s, ''); } });
        let txt = r.text || '';
        const m = txt.match(/SPIELE:\s*(.+)\s*$/);
        txt = txt.replace(/\n?SPIELE:.*$/s, '').trim();
        out.textContent = txt;
        aiHistory.push({ role: 'assistant', content: txt }); aiHistory = aiHistory.slice(-20); store.set('aiHistory', aiHistory);
        store.set('aiUsed', store.get('aiUsed', 0) + 1); checkAchievements();
        if(m){
          const ids = m[1].split(/[,\s]+/).map(s => s.trim()).filter(id => B.getGame(id)).slice(0, 3);
          if(ids.length) log.append(el('div', { class: 'b-row' }, ids.map(id => { const g = B.getGame(id); return el('button', { class: 'b-btn sm cyan', text: g.icon + ' ' + g.name, onclick: () => { close(); B.openGame(id); } }); })));
        }
      }catch(e){
        out.textContent = e && e.code === 'rate_limited' ? 'Kurz durchatmen – zu viele Anfragen. Probier es gleich nochmal.' : e && e.code === 'not_granted' ? 'Die KI wurde nicht freigegeben.' : 'Da ist was schiefgelaufen. Probier es nochmal.';
        aiHistory.pop();
      }
      busy = false; send.disabled = false;
    }
    send.onclick = () => ask(); input.addEventListener('keydown', e => { if(e.key === 'Enter') ask(); });
    wrap.append(
      el('div', { class: 'b-between' }, [el('div', {}, [el('div', { class: 'b-kicker', text: 'KI-Assistent' }), el('h3', { class: 'b-title b-grad', text: 'BORED AI' })]),
        el('button', { class: 'b-btn sm ghost', text: 'Neu', onclick: () => { aiHistory = []; store.set('aiHistory', []); log.innerHTML = ''; bubble('ai', 'Neuer Chat. Was geht?'); } })]),
      moods, log, status, el('div', { class: 'b-row' }, [el('div', { class: 'grow' }, input), send]));
    return wrap;
  });
}

/* =========================================================
   FRIENDS
   ========================================================= */
function renderFriends(page){
  page.append(el('div', {}, [el('div', { class: 'b-kicker', text: 'Zusammen spielen' }), el('h1', { class: 'b-title', text: 'Friends' })]));
  if(!P.name) page.append(el('div', { class: 'b-card glow' }, [el('b', { class: 'b-h', text: 'Wie heißt du?' }), el('p', { class: 'b-hint', text: 'Freunde sehen deinen Namen im Raum.' }), el('button', { class: 'b-btn block', style: { marginTop: '10px' }, text: 'Profil einrichten', onclick: () => onboarding(true) })]));
  const lobbyHost = el('div', { class: 'b-stack' });
  page.append(lobbyHost);
  const lobby = B.lobbies[0];
  if(lobby){
    const api = { root: lobbyHost, store: { get: (k, d) => store.get('lobby.' + k, d), set: (k, v) => store.set('lobby.' + k, v) }, sound: B.sound, vibrate: B.vibrate, toast: B.toast, el, esc: B.esc, shuffle: B.shuffle, pick: B.pick, seeded: B.seeded, sheet: B.sheet, confirm: B.confirm, confetti: B.confetti, profile: P, room: () => B.cap('room'), ai: () => B.cap('sample'),
      finish: (r = {}) => { S.plays++; if(r.win) S.wins++; const bg = S.byGame['online'] = S.byGame['online'] || { plays: 0, wins: 0, last: 0 }; bg.plays++; if(r.win) bg.wins++; bg.last = Date.now(); store.set('stats', S); const xp = B.addXP(r.xp || (r.win ? 30 : 15), 'Online', 'game:online'); B.emit('finish', { id: 'online', cat: 'online', win: !!r.win, xp }); return xp; } };
    try{ lobbyCleanup = lobby.mount(lobbyHost, api); }catch(e){ console.error(e); lobbyHost.append(el('p', { class: 'b-hint', text: 'Lobby konnte nicht laden.' })); }
  } else lobbyHost.append(el('p', { class: 'b-hint', text: 'Online-Lobby lädt nicht.' }));
  const local = playable().filter(g => g.cat === 'party' || /1-2|2/.test(g.players)).slice(0, 12);
  page.append(sec('Am selben Handy', null, [el('p', { class: 'b-hint', text: 'Handy weitergeben und loslegen – kein Internet nötig.' }), el('div', { class: 'ap-ggrid' }, local.map(gameCard))]));
}

/* =========================================================
   PROFIL & EINSTELLUNGEN
   ========================================================= */
function renderProfile(page){
  const li = B.levelInfo();
  page.append(el('div', { class: 'b-card glow b-rgb b-center', style: { padding: '24px 16px' } }, [
    avatar(true),
    el('div', { class: 'b-title', style: { marginTop: '6px' }, text: P.name || 'Spieler' }),
    el('div', { class: 'b-row', style: { justifyContent: 'center' } }, [el('span', { class: 'b-pill cyan', text: B.rank() }), el('span', { class: 'b-pill', text: 'Level ' + li.level }), el('span', { class: 'b-pill pink', text: P.xp + ' XP gesamt' })]),
    el('div', { style: { width: '100%' } }, [xpBar(), el('div', { class: 'b-hint', style: { marginTop: '4px' }, text: 'Noch ' + (li.need - li.into) + ' XP bis Level ' + (li.level + 1) })]),
    el('button', { class: 'b-btn sm ghost', text: 'Profil bearbeiten', onclick: () => onboarding(true) })
  ]));
  page.append(el('div', { class: 'b-grid3' }, [
    el('div', { class: 'b-stat' }, [el('small', { text: 'Runden' }), el('b', { text: S.plays })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Siege' }), el('b', { text: S.wins })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Siegquote' }), el('b', { text: S.plays ? Math.round(S.wins / S.plays * 100) + '%' : '–' })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Serie' }), el('b', { text: (S.streak || 0) + ' 🔥' })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Challenges' }), el('b', { text: store.get('chDone', 0) })]),
    el('div', { class: 'b-stat' }, [el('small', { text: 'Spiele' }), el('b', { text: Object.keys(S.byGame).length })])
  ]));
  // XP der letzten 7 Tage
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() - (6 - i) * 86400000); const k = d.toISOString().slice(0, 10); return [['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()], (S.days[k] || {}).xp || 0]; });
  const mx = Math.max(10, ...days.map(d => d[1]));
  page.append(sec('XP der letzten 7 Tage', null, el('div', { class: 'b-card' }, el('div', { class: 'ap-chart' }, days.map(([l, v]) => el('div', {}, [el('small', { text: v || '' }), el('i', { style: { height: Math.round(v / mx * 70) + 'px' } }), el('small', { text: l })]))))));
  // Erfolge
  const got = store.get('ach', {});
  page.append(sec('Erfolge · ' + Object.keys(got).length + '/' + ACH.length, null, el('div', { class: 'ap-badges' }, ACH.map(([id, e, name, d]) => el('button', { class: 'ap-badge ' + (got[id] ? 'on' : 'locked'), onclick: () => B.toast(e + ' ' + name + ': ' + d + (got[id] ? ' ✓' : '')) }, [el('span', { class: 'e', text: e }), el('small', { text: name })])))));
  // Lieblingsspiele
  const top = Object.entries(S.byGame).sort((a, b) => b[1].plays - a[1].plays).slice(0, 5);
  if(top.length) page.append(sec('Meistgespielt', null, el('div', { class: 'b-list' }, top.map(([id, v]) => { const g = B.getGame(id) || { icon: '🌐', name: id === 'online' ? 'Online-Spiele' : id }; return el('div', { class: 'b-item' }, [el('span', { class: 'ic', text: g.icon }), el('div', { class: 'tx' }, [el('b', { text: g.name }), el('small', { text: v.plays + ' Runden · ' + v.wins + ' Siege' })])]); }))));
  // Verlauf
  if(S.history.length) page.append(sec('Spielverlauf', null, el('div', { class: 'b-list' }, S.history.slice(0, 8).map(h => { const g = B.getGame(h.id) || { icon: '🌐', name: 'Online' }; return el('div', { class: 'b-item' }, [el('span', { class: 'ic', text: g.icon }), el('div', { class: 'tx' }, [el('b', { text: g.name }), el('small', { text: new Date(h.t).toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + (h.score != null ? ' · ' + h.score : '') })]), h.win == null ? null : el('span', { class: 'b-pill ' + (h.win ? 'good' : 'bad'), text: h.win ? 'Sieg' : 'Niederlage' })]); }))));
  // Einstellungen
  const sw = (key, label, hint) => { const b = el('button', { class: 'ap-switch', role: 'switch', 'aria-checked': String(!!B.settings[key]), 'aria-label': label, onclick: () => { B.settings[key] = !B.settings[key]; B.saveSettings(); b.setAttribute('aria-checked', String(B.settings[key])); B.sound('click'); if(key === 'particles' || key === 'anim') startBg(); } }); return el('div', { class: 'b-item' }, [el('div', { class: 'tx' }, [el('b', { text: label }), el('small', { text: hint })]), b]); };
  page.append(sec('Einstellungen', null, el('div', { class: 'b-list' }, [
    sw('sound', 'Soundeffekte', 'Klicks, Siege, Treffer'),
    sw('anim', 'Animationen', 'Übergänge und Effekte'),
    sw('particles', 'Partikel & Konfetti', 'Hintergrund-Partikel, Konfetti bei Siegen'),
    sw('haptics', 'Vibration', 'Kurzes Feedback bei Tipps')
  ])));
  page.append(sec('App am Handy installieren', null, el('div', { class: 'b-card' }, [
    el('p', { class: 'b-hint', text: 'Android (Chrome): Menü ⋮ → „Zum Startbildschirm hinzufügen“. iPhone (Safari): Teilen → „Zum Home-Bildschirm“. Dann startet BORED? wie eine App – ohne Play Store.' })
  ])));
  page.append(sec('Daten', null, el('div', { class: 'b-grid2' }, [
    el('button', { class: 'b-btn ghost', text: 'Spielstand sichern', onclick: exportSave }),
    el('button', { class: 'b-btn ghost', text: 'Spielstand laden', onclick: importSave }),
    el('button', { class: 'b-btn danger', style: { gridColumn: '1/-1' }, text: 'Alles zurücksetzen', onclick: async () => { if(await B.confirm('Wirklich ALLES löschen? Level, XP, Rekorde und Erfolge sind dann weg.', 'Löschen')){ try{ Object.keys(localStorage).filter(k => k.startsWith('bored.')).forEach(k => localStorage.removeItem(k)); }catch(e){} location.reload(); } } })
  ])));
  page.append(el('p', { class: 'b-hint', style: { textAlign: 'center', fontSize: '12px' }, text: 'BORED? · Never Be Bored Again · Deine Daten bleiben auf diesem Gerät.' }));
}
function exportSave(){
  const data = {}; try{ Object.keys(localStorage).filter(k => k.startsWith('bored.') && !k.includes('gallery')).forEach(k => data[k] = localStorage.getItem(k)); }catch(e){}
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  B.sheet(close => { const ta = el('textarea', { class: 'b-input', readonly: true, style: { minHeight: '120px', fontFamily: 'var(--mono)', fontSize: '11px' } }); ta.value = code;
    return el('div', { class: 'b-stack' }, [el('h3', { class: 'b-title', text: 'Spielstand-Code' }), el('p', { class: 'b-hint', text: 'Kopier den Code und heb ihn auf (z. B. in Notizen). Auf einem anderen Handy unter „Spielstand laden“ einfügen.' }), ta,
      el('button', { class: 'b-btn block', text: 'Kopieren', onclick: () => { navigator.clipboard.writeText(code).then(() => B.toast('Kopiert!'), () => { ta.select(); B.toast('Markiert – jetzt kopieren'); }); } })]); });
}
function importSave(){
  B.sheet(close => { const ta = el('textarea', { class: 'b-input', placeholder: 'Code hier einfügen' });
    return el('div', { class: 'b-stack' }, [el('h3', { class: 'b-title', text: 'Spielstand laden' }), el('p', { class: 'b-hint', text: 'Achtung: Überschreibt den aktuellen Spielstand.' }), ta,
      el('button', { class: 'b-btn block', text: 'Laden', onclick: () => { try{ const data = JSON.parse(decodeURIComponent(escape(atob(ta.value.trim())))); Object.entries(data).forEach(([k, v]) => { if(k.startsWith('bored.')) localStorage.setItem(k, v); }); location.reload(); }catch(e){ B.toast('Ungültiger Code'); } } })]); });
}

/* Onboarding / Profil bearbeiten */
function onboarding(edit){
  let ava = P.avatar, frame = P.frame || 'none';
  B.sheet(close => {
    const name = el('input', { class: 'b-input', maxlength: 16, placeholder: 'Dein Spielername', value: P.name, 'aria-label': 'Spielername' });
    const grid = el('div', { class: 'ap-emoji-grid' });
    const frames = el('div', { class: 'b-chips' });
    const lvl = B.levelInfo().level;
    const draw = () => {
      grid.innerHTML = ''; AVATARS.forEach(a => grid.append(el('button', { 'aria-pressed': String(a === ava), text: a, onclick: () => { ava = a; B.sound('pop'); draw(); } })));
      frames.innerHTML = ''; FRAMES.forEach(([id, l, need]) => frames.append(el('button', { class: 'b-chip', 'aria-pressed': String(id === frame), disabled: lvl < need, style: lvl < need ? { opacity: .45 } : null, text: lvl < need ? '🔒 ' + l + ' (Lv ' + need + ')' : l, onclick: () => { if(lvl >= need){ frame = id; B.sound('click'); draw(); } } })));
    };
    draw();
    return el('div', { class: 'b-stack' }, [
      el('div', { class: 'b-center' }, [el('div', { class: 'b-title b-grad', style: { fontSize: '30px' }, text: edit ? 'Profil' : 'BORED?' }), edit ? null : el('p', { class: 'b-hint', text: 'Never Be Bored Again. Wie sollen wir dich nennen?' })]),
      el('div', {}, [el('label', { class: 'b-label', text: 'Name' }), name]),
      el('div', {}, [el('span', { class: 'b-label', text: 'Avatar' }), grid]),
      el('div', {}, [el('span', { class: 'b-label', text: 'Profilrahmen (ab Level frei)' }), frames]),
      el('button', { class: 'b-btn block', text: edit ? 'Speichern' : 'Los geht\'s!', onclick: () => {
        P.name = name.value.trim().slice(0, 16); P.avatar = ava; P.frame = frame; B.saveProfile(); store.set('onboarded', true); B.sound('win'); close(); checkAchievements(); render();
      } })
    ]);
  }, { locked: !edit });
}

/* =========================================================
   ANIMIERTER HINTERGRUND
   ========================================================= */
let bgRaf;
function startBg(){
  const c = document.getElementById('bg'), x = c.getContext('2d');
  cancelAnimationFrame(bgRaf);
  const dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px'; };
  size(); window.onresize = size;
  const ps = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, v: Math.random() * .00025 + .00008, h: B.pick([186, 271, 322]) }));
  let t = 0;
  const frame = () => {
    t += .004;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    const w = c.width, h = c.height;
    const g1 = x.createRadialGradient(w * (.2 + Math.sin(t) * .1), h * .15, 0, w * .2, h * .15, w * .9);
    g1.addColorStop(0, 'rgba(168,85,247,.20)'); g1.addColorStop(1, 'rgba(168,85,247,0)');
    x.fillStyle = g1; x.fillRect(0, 0, w, h);
    const g2 = x.createRadialGradient(w * (.85 + Math.cos(t * .8) * .08), h * .75, 0, w * .85, h * .75, w * .8);
    g2.addColorStop(0, 'rgba(0,229,255,.12)'); g2.addColorStop(1, 'rgba(0,229,255,0)');
    x.fillStyle = g2; x.fillRect(0, 0, w, h);
    // Gitter-Horizont
    x.strokeStyle = 'rgba(168,85,247,.07)'; x.lineWidth = dpr;
    for(let i = 0; i < 12; i++){ const yy = h * .62 + Math.pow(i / 12, 2) * h * .4 + ((t * 40 * dpr) % (h * .04)); x.beginPath(); x.moveTo(0, yy); x.lineTo(w, yy); x.stroke(); }
    if(B.settings.particles){
      ps.forEach(p => { p.y -= p.v * (B.settings.anim ? 1 : 0); if(p.y < -.02){ p.y = 1.02; p.x = Math.random(); }
        x.beginPath(); x.fillStyle = 'hsla(' + p.h + ',100%,70%,.55)'; x.shadowColor = 'hsla(' + p.h + ',100%,60%,1)'; x.shadowBlur = 8 * dpr; x.arc(p.x * w, p.y * h, p.r * dpr, 0, 7); x.fill(); });
      x.shadowBlur = 0;
    }
    if(B.settings.anim && !document.hidden) bgRaf = requestAnimationFrame(frame);
  };
  frame();
}
document.addEventListener('visibilitychange', () => { if(!document.hidden && B.settings.anim) startBg(); });

/* Start */
B.CATS.party.name = 'Party';
startBg();
const startTab = location.hash.slice(1);
go(tabs[startTab] ? startTab : 'home');
if(!store.get('onboarded', false)) setTimeout(() => onboarding(false), 300);
checkAchievements();
})();
