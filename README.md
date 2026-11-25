# BORED? – Never Be Bored Again

Eine Anti-Langeweile-App fürs Handy, die im Browser läuft – ohne Google Play.

## Was drin ist
- **Schach** mit Computergegner (6 Stärken), 26 Matt-Puzzles, Uhr und 2-Spieler-Modus
- **Reaktion & Geschick:** Reaktionstest, Speed Tap, Color Reflex, Quick Memory, Pattern, Number Rush, Timing, Neon Dodge, Neon Stack
- **Denkspiele:** Sudoku, Wortel (deutsches Wordle), Memory, Mastermind, 2048, Logikrätsel, Escape Room
- **Quiz:** 450 Fragen in 10 Themen, Tagesquiz, Duell, eigene Quiz
- **Party:** Wahrheit oder Pflicht, Wer würde eher, Entweder oder, Impostor, Tabu, Kategorien, Schätzduell, Zwei Wahrheiten, Emoji-Quiz, Begriffe erraten
- **Kreativ:** Zeichenfläche, Zeichne das!, 13 Zufallsgeneratoren, Emoji-Geschichten, Game Creator
- **Online:** Räume mit Code (nur in der claude.ai-Version)
- XP, Level, Challenges, Erfolge, Tagesbox, BORED AI (nur in der claude.ai-Version)

## Starten
Ordner auf einen Webserver legen oder **GitHub Pages** aktivieren
(Settings → Pages → Branch `main`, Ordner `/`). Dann die Seite am Handy öffnen und
„Zum Startbildschirm hinzufügen“ wählen.

Lokal testen: `python3 -m http.server` im Ordner und `http://localhost:8000` öffnen.

## Aufbau
- `index.html` – Einstieg
- `core.js` / `core.css` – Designsystem, XP, Sound, Spielrahmen
- `app.js` / `app.css` – Home, Games, Discover, Friends, Profil
- `games/*.js` – Spielmodule (siehe `API.md`)

Online-Räume, Community-Bibliothek und BORED AI nutzen Funktionen von claude.ai
und sind außerhalb davon automatisch ausgeblendet.
