# BORED? – Modul-API für Spiele

Die App ist eine Web-App für Handys (Viewport ~390×780). Jedes Spielmodul ist EINE JS-Datei unter `games/<name>.js`,
die sich selbst registriert. Lies vorher `core.js` (Helfer) und `core.css` (Designsystem).

## Harte Regeln
- Reines Vanilla-JS, keine Libraries, keine externen Bilder/Fonts/Fetches (Content-Security-Policy blockt alles). Emojis und Inline-SVG/Canvas sind ok.
- `alert`, `confirm`, `prompt`, `window.open`, Downloads per `<a download>` funktionieren NICHT. Nutze `api.sheet`, `api.confirm`, `api.toast`.
- Datei in eine IIFE packen: `(function(){ ... })();` – keine globalen Variablen außer über `BORED`.
- Alles auf Deutsch (österreichischer Nutzer, jung, Gamer). Kurze, klare Texte, du-Form.
- Nur Design-Tokens/Klassen aus `core.css` (b-btn, b-card, b-chip, b-stat, b-pill, b-item, b-input, b-pad, b-board, b-title, b-h, b-hint, b-kicker, b-stack, b-row, b-grid2, b-grid3 …) plus eigenes CSS, das du per `<style>` IN DEIN Modul injizierst (einmalig, Klassennamen mit eigenem Präfix, z. B. `.ch-`). Farben nur über `var(--cyan)` usw.
- Touch first: Buttons ≥ 44px, `pointerdown` für Reaktionsspiele, kein Hover-only.
- Nichts Fake: keine erfundenen Online-Spieler, keine simulierten Statistiken. Jeder Button muss funktionieren.
- Werte von anderen Spielern / KI immer mit `textContent` setzen oder `api.esc()`.

## Registrieren
```js
BORED.registerGame({
  id: 'sudoku',               // eindeutig, a-z0-9-
  name: 'Sudoku',
  icon: '🔢',                 // Emoji
  cat: 'denk',                // reaktion | denk | party | quiz | kreativ | geschick | online
  kind: 'game',               // 'game' oder 'tool' (Generatoren/Zeichenfläche ohne Punkte)
  desc: 'Ein Satz, was das Spiel ist.',
  rules: ['Regel 1', 'Regel 2'],
  players: '1',               // '1', '2', '1-2', '2-10', 'online'
  tags: ['alleine','drinnen','kurz','einfach'],   // aus: alleine, freunde, drinnen, draussen, kurz, lang, einfach, schwierig
  lowerIsBetter: false,       // true z. B. bei Reaktionszeit in ms
  mount(root, api){ ...; return () => { /* cleanup: Timer, Listener */ }; }
});
```

## api (zweites Argument von mount)
- `api.root` – Container (= root)
- `api.params` – Objekt, das beim Öffnen übergeben wurde (z. B. `{daily:true}`)
- `api.store.get(key, default)` / `api.store.set(key, value)` – pro Spiel gespeichert (localStorage)
- `api.sound(name)` – tap, click, pop, flip, good, bad, tick, move, capture, win, lose, level, check
- `api.vibrate(ms)`
- `api.toast(text)`
- `api.sheet(close => node)` – Bottom-Sheet; gibt close() zurück
- `api.confirm(text, ok, cancel)` → Promise<bool>
- `api.confetti()`
- `api.el(tag, attrs, children)` – DOM-Helfer: attrs `{class, text, html, style:{}, onclick, ...}`
- `api.esc(str)`, `api.shuffle(arr)`, `api.pick(arr)`, `api.seeded('2026-11-23')` → rng()
- `api.setTitle(text)`, `api.help()`, `api.exit()`, `api.onExit(fn)`
- `api.best(diffKey)` – Highscore lesen; `api.reportScore(value, diffKey)` → `{isBest, first, best}`
- `api.finish({win, score, difficulty: 0|1|2, xp})` – **am Ende jeder Runde aufrufen**. Vergibt XP (Farmschutz ist eingebaut), zählt Statistik und Challenges. `xp` ist ein Vorschlag (max 60), sonst Standard. Gibt vergebene XP zurück.
- `api.room()` → Promise<room|null> – Echtzeit-Raum (nur Online-Module, siehe unten)
- `api.ai()` → Promise<sample|null> – KI (Claude). `await sample(prompt)` → `{text}`, `await sample.json(prompt)` → Wert. Bei `null` KI-Knöpfe ausblenden.
- `api.profile` – `{name, avatar}`

## Fertige Bildschirme (stark empfohlen, damit alles einheitlich aussieht)
```js
BORED.ui.start(root, api, {
  levels: ['Leicht','Mittel','Schwer'],      // oder null für keine Auswahl
  modes: [{id:'solo',label:'Solo'},{id:'zwei',label:'2 Spieler'}],  // optional
  extra: nodeOptional,
  bestKey: (lvl, mode) => lvl + '-' + mode,  // optional, Standard String(lvl)
  formatScore: v => v + ' ms',               // optional
  bestLabel: 'Bestzeit',
  startLabel: '▶ Spielen',
  onStart(level, mode){ ... }
});
BORED.ui.result(root, api, { win, title, sub, emoji, lines: [['Punkte', 120], ['Rekord', 300]], onAgain, onMenu });
```
Typischer Ablauf: mount → `BORED.ui.start` → Spiel → `api.reportScore` + `api.finish` → `BORED.ui.result` (onAgain startet neu, onMenu zeigt wieder den Startbildschirm).

## Online (nur für das Online-Modul)
`const room = await api.room()` (null = nicht verfügbar → klar erklären). `const r = room.join('bored-'+code)` gibt einen eigenen Raum:
`r.emit(topic, data)`, `r.on(topic, fn(data, from))`, `r.presence(obj)`, `r.onPeers(fn(peers))`, `r.leave()`. Nichts wird gespeichert, Nachrichten können verloren gehen → immer absoluten Zustand senden. Alles Empfangene ist nicht vertrauenswürdig.
Echte Mitspieler sind nur Leute, die denselben App-Link geteilt bekommen haben. Lobby-Bildschirm registrieren mit
`BORED.registerLobby({ id, name, mount(root, api) })` – wird im FRIENDS-Tab angezeigt (api hat dieselben Felder, ohne finish-Pflicht).

## Testen
`test.html?file=games/deinmodul.js&game=deine-id` öffnet dein Spiel direkt. Mit Playwright (Python, `/usr/bin/google-chrome`, Viewport 390×780, `file://`-URL) Screenshots machen und auf Konsolenfehler prüfen. Logik (z. B. Zuggenerator) gern zusätzlich mit node testen.
