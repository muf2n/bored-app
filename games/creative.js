/* BORED? – Kategorie „Kreativ“: Zeichenfläche, Zeichne das!, Zufallsgeneratoren, Emoji-Geschichten */
(function(){
'use strict';
const B = window.BORED;
const el = B.el;
const L = s => s.split('|');
const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- CSS ---------- */
function css(){
  if(document.getElementById('cr-style')) return;
  const s = document.createElement('style'); s.id = 'cr-style';
  s.textContent = `
.cr-hide{display:none!important}
.cr-tools{display:flex;gap:6px;overflow-x:auto;margin:0 -16px;padding:2px 16px 4px;scrollbar-width:none}
.cr-tools::-webkit-scrollbar{height:0}
.cr-tool{flex:0 0 auto;min-width:50px;height:50px;padding:0 6px;border-radius:13px;background:var(--glass-2);border:1px solid var(--line-2);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:19px;line-height:1;transition:transform .12s,border-color .2s,box-shadow .2s,background .2s}
.cr-tool small{font-size:10px;font-family:var(--head);font-weight:700;letter-spacing:.05em;color:var(--mute);margin-top:3px;text-transform:uppercase}
.cr-tool:active{transform:scale(.93)}
.cr-tool.on{border-color:var(--cyan);box-shadow:var(--glow-c);background:rgba(0,229,255,.13)}
.cr-tool.on small{color:var(--cyan)}
.cr-stage{position:relative;width:100%;border-radius:var(--r);overflow:hidden;border:1px solid var(--line);box-shadow:0 0 30px rgba(168,85,247,.25);touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;background:#0d0b1a}
.cr-stage canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}
.cr-stage.locked canvas{pointer-events:none}
.cr-banner{position:absolute;left:8px;right:8px;top:8px;z-index:3;background:rgba(8,8,18,.82);border:1px solid var(--line);border-radius:14px;padding:8px 10px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;flex-direction:column;gap:6px;animation:popIn .3s cubic-bezier(.3,1.5,.5,1)}
.cr-banner .cr-bt{display:flex;align-items:center;gap:8px;font-family:var(--head);font-weight:700;font-size:15px;letter-spacing:.02em}
.cr-banner .cr-bt span{flex:1;min-width:0}
.cr-banner .cr-time{font-family:var(--display);font-size:18px;color:var(--cyan);text-shadow:var(--glow-c);font-variant-numeric:tabular-nums}
.cr-banner .cr-time.hot{color:var(--bad);text-shadow:0 0 14px rgba(255,84,112,.8)}
.cr-banner .cr-x{width:36px;height:36px;border-radius:10px;background:var(--glass-2);border:1px solid var(--line-2)}
.cr-over{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center;background:rgba(8,8,18,.6);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:fade .25s}
.cr-colors{display:flex;gap:7px;overflow-x:auto;align-items:center;margin:0 -16px;padding:4px 16px;scrollbar-width:none}
.cr-colors::-webkit-scrollbar{height:0}
.cr-sw{flex:0 0 36px;width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,255,255,.18);transition:transform .15s,box-shadow .2s}
.cr-sw.on{border-color:#fff;box-shadow:0 0 0 2px var(--cyan),var(--glow-c);transform:scale(1.1)}
.cr-pick{flex:0 0 40px;width:40px;height:40px;border-radius:50%;position:relative;overflow:hidden;border:2px dashed rgba(255,255,255,.45);background:conic-gradient(red,#ff0,lime,cyan,blue,#f0f,red)}
.cr-pick input{position:absolute;inset:-8px;width:60px;height:60px;opacity:0;cursor:pointer}
.cr-sl{display:flex;align-items:center;gap:10px;min-height:40px}
.cr-sl label{flex:0 0 74px;font-family:var(--head);font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.cr-sl input[type=range]{flex:1;accent-color:var(--cyan);height:32px}
.cr-sl output{flex:0 0 44px;text-align:right;font-family:var(--display);font-size:13px;color:var(--cyan)}
.cr-dot{flex:0 0 34px;height:34px;display:flex;align-items:center;justify-content:center}
.cr-dot i{display:block;border-radius:50%;background:var(--cyan)}
.cr-acts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.cr-act{min-height:52px;border-radius:13px;background:var(--glass-2);border:1px solid var(--line-2);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:19px;gap:3px;transition:transform .12s,opacity .2s}
.cr-act small{font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.cr-act:active{transform:scale(.94)}
.cr-act:disabled{opacity:.35}
.cr-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.cr-gal figure{display:flex;flex-direction:column;gap:6px}
.cr-gal img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:12px;border:1px solid var(--line);background:#000}
.cr-gal .b-row{gap:6px;justify-content:center}
.cr-big{width:100%;border-radius:14px;border:1px solid var(--line);box-shadow:0 0 30px rgba(168,85,247,.3);display:block;-webkit-touch-callout:default;user-select:auto;-webkit-user-select:auto}
.cr-bgs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.cr-bgs button{min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;font-family:var(--head);color:var(--mute)}
.cr-bgs canvas{width:100%;aspect-ratio:1;border-radius:12px;border:2px solid var(--line-2)}
.cr-bgs button.on canvas{border-color:var(--cyan);box-shadow:var(--glow-c)}
.cr-prompt{font-family:var(--head);font-weight:700;font-size:24px;line-height:1.2;letter-spacing:.02em}
.cr-reels{display:flex;flex-direction:column;gap:8px}
.cr-reel{padding:9px 12px;border-radius:12px;background:rgba(8,8,18,.5);border:1px solid var(--line-2);overflow:hidden;transition:border-color .3s,box-shadow .3s}
.cr-reel small{display:block;font-family:var(--head);font-weight:700;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.cr-reel b{display:block;font-family:var(--head);font-weight:700;font-size:19px;line-height:1.25;letter-spacing:.01em;min-height:24px}
.cr-reel.spin b{animation:crSpin .1s linear infinite;color:var(--cyan);filter:blur(.6px)}
.cr-reel.stop{border-color:var(--line);box-shadow:inset 0 0 18px rgba(168,85,247,.15)}
.cr-reel.stop b{animation:crStop .4s cubic-bezier(.3,1.7,.5,1)}
@keyframes crSpin{0%{transform:translateY(-35%);opacity:.35}50%{opacity:1}100%{transform:translateY(35%);opacity:.35}}
@keyframes crStop{from{transform:translateY(-45%);opacity:.4}to{transform:none;opacity:1}}
.cr-gchips{display:flex;gap:8px;overflow-x:auto;margin:0 -16px;padding:2px 16px 6px;scrollbar-width:none}
.cr-gchips::-webkit-scrollbar{height:0}
.cr-gchips .b-chip{flex:0 0 auto;min-height:40px;white-space:nowrap}
.cr-sub{display:flex;gap:6px;flex-wrap:wrap}
.cr-sub .b-chip{min-height:36px;padding:6px 11px;font-size:13px}
.cr-pal{display:flex;gap:6px;height:210px}
.cr-swc{flex:1;border-radius:14px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px;padding:8px 2px;transition:background-color .35s,flex .3s;position:relative;box-shadow:0 6px 18px rgba(0,0,0,.35)}
.cr-swc .hx{font-family:var(--mono);font-size:11px;font-weight:700;padding:4px 5px;border-radius:8px;background:rgba(0,0,0,.35);color:#fff;min-height:30px;display:flex;align-items:center}
.cr-swc .lk{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.35);font-size:16px}
.cr-swc.locked{outline:2px solid #fff;outline-offset:2px}
.cr-swc .tap{position:absolute;inset:0 0 86px 0;border-radius:14px}
.cr-wheelbox{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px}
.cr-wheel{width:min(270px,74vw);aspect-ratio:1;display:block}
.cr-res{font-family:var(--display);font-size:22px;font-weight:800;text-align:center;min-height:30px}
.cr-opts{display:flex;flex-wrap:wrap;gap:6px}
.cr-opt{display:inline-flex;align-items:center;gap:4px;padding:4px 4px 4px 11px;border-radius:99px;background:var(--glass-2);border:1px solid var(--line-2);font-size:14px;max-width:100%}
.cr-opt span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cr-opt button{width:30px;height:30px;border-radius:50%;color:var(--mute)}
.cr-dice{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;min-height:120px;align-items:center;perspective:600px}
.cr-die{width:84px;height:84px;border-radius:18px;background:linear-gradient(145deg,#f5f5ff,#c9c3ee);display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);padding:12px;box-shadow:0 0 22px rgba(168,85,247,.55),inset 0 -4px 0 rgba(0,0,0,.15)}
.cr-die i{width:15px;height:15px;border-radius:50%;background:#1a1030;place-self:center;visibility:hidden}
.cr-die i.v{visibility:visible}
.cr-poly{width:96px;height:96px;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:30px;color:#fff;background:linear-gradient(135deg,var(--violet),var(--pink));clip-path:polygon(50% 0,95% 25%,95% 75%,50% 100%,5% 75%,5% 25%);text-shadow:0 2px 6px rgba(0,0,0,.4)}
.cr-roll{animation:crRoll .7s cubic-bezier(.2,.8,.3,1)}
@keyframes crRoll{0%{transform:translateY(-30px) rotate(-200deg) scale(.7)}60%{transform:translateY(6px) rotate(20deg) scale(1.05)}100%{transform:none}}
.cr-coinw{width:130px;height:130px;perspective:800px}
.cr-coinw.toss{animation:crToss 1.3s cubic-bezier(.3,.7,.4,1)}
@keyframes crToss{0%{transform:none}45%{transform:translateY(-70px) scale(1.15)}100%{transform:none}}
.cr-coin{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 1.3s cubic-bezier(.2,.7,.25,1)}
.cr-coin div{position:absolute;inset:0;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;backface-visibility:hidden;-webkit-backface-visibility:hidden;font-family:var(--display);font-weight:800;font-size:17px;color:#2b1d00;background:radial-gradient(circle at 35% 30%,#fff5c2,#ffc93c 55%,#b8860b);box-shadow:0 0 24px rgba(255,201,60,.55),inset 0 0 0 6px rgba(0,0,0,.12)}
.cr-coin div b{font-size:40px;line-height:1}
.cr-coin .back{transform:rotateY(180deg)}
.cr-vs{display:flex;flex-direction:column;gap:10px;align-items:stretch}
.cr-vs button{min-height:86px;padding:14px;border-radius:16px;font-family:var(--head);font-weight:700;font-size:19px;line-height:1.25;border:1px solid var(--line-2);transition:transform .15s,box-shadow .25s,border-color .25s,opacity .25s}
.cr-vs .a{background:linear-gradient(135deg,rgba(0,229,255,.2),rgba(0,229,255,.05))}
.cr-vs .b{background:linear-gradient(135deg,rgba(255,54,184,.2),rgba(255,54,184,.05))}
.cr-vs .or{text-align:center;font-family:var(--display);font-weight:800;color:var(--violet);text-shadow:var(--glow-v);font-size:16px}
.cr-vs button.pick{border-color:var(--cyan);box-shadow:var(--glow-c);transform:scale(1.02)}
.cr-vs button.no{opacity:.4}
.cr-emos{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.cr-emo{aspect-ratio:1;border-radius:16px;background:var(--glass-2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:38px;transition:transform .2s,box-shadow .2s}
.cr-emo.spin{animation:crShake .12s linear infinite}
.cr-emo.land{animation:popIn .35s cubic-bezier(.3,1.6,.5,1)}
.cr-emo.focus{border-color:var(--cyan);box-shadow:var(--glow-c);transform:scale(1.08)}
@keyframes crShake{0%{transform:translateY(-4px) rotate(-6deg)}50%{transform:translateY(4px) rotate(6deg)}100%{transform:translateY(-4px) rotate(-6deg)}}
.cr-story{white-space:pre-wrap;font-size:16px;line-height:1.55}
.cr-story p{margin-bottom:6px}
.cr-story p small{color:var(--cyan);font-family:var(--head);font-weight:700;letter-spacing:.06em;margin-right:6px}
.cr-stars{display:flex;justify-content:center;gap:6px}
.cr-stars button{font-size:36px;width:52px;height:52px;filter:grayscale(1) brightness(.6);transition:transform .15s,filter .2s}
.cr-stars button.on{filter:none;transform:scale(1.12)}
.cr-ans{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cr-ans button{min-height:58px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line);font-family:var(--head);font-weight:700;font-size:17px;padding:8px;transition:background .25s,border-color .25s,transform .15s}
.cr-ans button.ok{background:rgba(61,245,160,.22);border-color:var(--good);box-shadow:0 0 18px rgba(61,245,160,.5)}
.cr-ans button.bad{background:rgba(255,84,112,.2);border-color:var(--bad)}
.cr-big-word{font-family:var(--display);font-weight:800;font-size:30px;letter-spacing:.03em;line-height:1.15}
.cr-fav{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line-2)}
.cr-fav .tx{flex:1;min-width:0;white-space:pre-wrap;font-size:14px}
.cr-fav .tx small{display:block;color:var(--cyan);font-family:var(--head);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:11px}
.cr-ai{white-space:pre-wrap;line-height:1.5;animation:popIn .3s}
.cr-timer{font-family:var(--display);font-size:22px;color:var(--cyan);text-shadow:var(--glow-c);font-variant-numeric:tabular-nums}
.cr-timer.hot{color:var(--bad);text-shadow:0 0 14px rgba(255,84,112,.8)}
`;
  document.head.append(s);
}

/* ---------- kleine Helfer ---------- */
function copyText(api, text){
  const done = () => { api.sound('pop'); api.toast('📋 Kopiert!'); };
  const fallback = () => {
    try{
      const t = el('textarea', { style: { position: 'fixed', top: '-200px', opacity: 0 } }); t.value = text;
      document.body.append(t); t.select(); const ok = document.execCommand('copy'); t.remove();
      ok ? done() : api.toast('Kopieren ging nicht – markier den Text selbst.');
    }catch(e){ api.toast('Kopieren ging nicht – markier den Text selbst.'); }
  };
  try{
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }catch(e){ fallback(); }
}
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const wordsOf = t => (t.trim().match(/\S+/g) || []).length;

/* Galerie (geteilt zwischen Zeichenfläche und „Zeichne das!“) */
const GAL_KEY = 'g.draw.gallery', GAL_MAX = 12;
function galGet(){ const g = B.store.get(GAL_KEY, []); return Array.isArray(g) ? g : []; }
function galAdd(api, src){
  const g = galGet(); let dropped = false;
  while(g.length >= GAL_MAX){ g.shift(); dropped = true; }
  g.push({ id: Date.now() + '' + Math.floor(Math.random() * 1000), t: Date.now(), src });
  B.store.set(GAL_KEY, g);
  api.sound('good'); api.toast(dropped ? '💾 Gespeichert – ältestes Bild wurde ersetzt' : '💾 In der Galerie gespeichert (' + g.length + '/' + GAL_MAX + ')');
}
function galDel(id){ B.store.set(GAL_KEY, galGet().filter(x => x.id !== id)); }

/* ---------- Wortlisten ---------- */
const W = {
  motiv: L('Pinguin|Drache|Katze|Hund|Roboter|Astronaut|Hai|Einhorn|Dinosaurier|Eule|Fuchs|Oktopus|Zauberer|Ritter|Ninja|Pirat|Alien|Geist|Vampir|Mumie|Schneemann|Kaktus|Pilz|Baum|Leuchtturm|Burg|Rakete|U-Boot|Skateboard|Gitarre|Kopfhörer|Gaming-PC|Handy|Pizza|Burger|Donut|Eisbecher|Taco|Banane|Erdbeere|Kaffeetasse|Teekanne|Sofa|Turnschuh|Rucksack|Regenschirm|Heißluftballon|Zug|Motorrad|Traktor|Faultier|Waschbär|Frosch|Schildkröte|Biene|Schmetterling|Qualle|Wal|Igel|Lama|Kuh|Glühbirne|Wecker|Toaster|Vulkan'),
  eig: L('wütend|verschlafen|riesig|winzig|glitzernd|gruselig|uralt|futuristisch|verliebt|nervös|durchsichtig|aus Lava|aus Eis|aus Süßigkeiten|mechanisch|super haarig|mit Flügeln|mit drei Augen|mit Krone|mit Sonnenbrille|in Ritterrüstung|im Anzug|im Pyjama|mit Superhelden-Umhang|neonleuchtend|pixelig|verzaubert|als Zombie|aufgeblasen wie ein Ballon|gestreift|gepunktet|aus Wolken|aus Kristall|mit Tentakeln|als Baby|muskelbepackt|elegant|total chaotisch|schüchtern|stolz|mit Riesen-Schnurrbart|mit Hasenohren'),
  akt: L('fährt Skateboard|kocht Spaghetti|spielt Gitarre|macht ein Selfie|surft auf einer Riesenwelle|kämpft gegen einen Staubsauger|liest ein Buch|tanzt im Regen|fliegt durchs All|angelt im Weltraum|macht Hausaufgaben|zockt am PC|isst eine Riesenpizza|flieht vor einer Gurke|fährt Achterbahn|gießt Blumen|repariert eine Steckdose|malt ein Bild|macht Yoga|jongliert mit Planeten|schläft in einer Hängematte|baut einen Schneemann|fährt Taxi|singt Karaoke|trainiert im Fitnessstudio|rettet eine Katze vom Baum|versteckt sich im Schrank|verkauft Eis|spielt Schach|putzt Zähne|zündet ein Feuerwerk|reitet auf einem Hai|gewinnt einen Pokal|telefoniert|wartet auf den Bus|macht ein Picknick|taucht nach einem Schatz|streamt live|backt einen Kuchen|fährt Ski'),
  stil: L('Pixel-Art|Comic|Anime|nur aus Kreisen|nur gerade Linien|in einer einzigen Linie|nur 3 Farben|Neon-Glow|wie eine Kinderzeichnung|mit der falschen Hand|als Strichmännchen|als Schatten-Silhouette|Retro 80er|gruselig|Kawaii (supersüß)|so realistisch wie möglich|Graffiti|minimalistisch|als Mosaik|als Bauplan|nur Schwarz-Weiß|riesig über die ganze Fläche|ganz klein in der Ecke|symmetrisch|nur aus Punkten|wie ein Logo|als Videospiel-Boss|kubistisch|Steampunk|wie ein Emoji'),
  // Geschichten
  wer: L('Eine Hackerin aus Graz|Ein schüchterner Drache|Ein Lehrling im ersten Jahr|Eine Oma mit Jetpack|Ein Roboter ohne Akku|Ein Pizzabote|Eine Zeitreisende|Ein sprechender Hund|Ein Streamer mit 3 Followern|Eine Geisterjägerin|Ein Alien im Austauschjahr|Ein Ritter mit Höhenangst|Ein Hausmeister|Eine Profi-Gamerin|Ein Vampir, der kein Blut mag|Ein Bäcker|Eine Astronautin|Ein Zauberlehrling|Ein Detektiv mit Gedächtnislücken|Eine Hexe mit Allergie gegen Katzen|Ein Elektriker|Ein Influencer-Pinguin|Eine KI im Kühlschrank|Ein Busfahrer|Eine Prinzessin, die Rennen fährt|Ein Pirat ohne Schiff|Ein Superheld in Rente|Eine Archäologin|Ein Waschbär-Dieb|Ein Schulsprecher|Ein Koch aus der Zukunft|Eine Bergsteigerin|Ein Ninja mit Schluckauf|Ein Postbote|Ein Zwillingspaar|Ein Schneemann im Sommer|Eine Erfinderin|Ein Fußballtorwart|Ein Monster unterm Bett|Eine Bibliothekarin'),
  wo: L('in einem verlassenen Freizeitpark|auf einer Raumstation|im Internat|in einem Einkaufszentrum um Mitternacht|auf einer schwebenden Insel|in einem Minecraft-ähnlichen Würfelreich|im Wiener U-Bahn-Tunnel|auf einem Geisterschiff|in einem Dorf in den Alpen|in einer Unterwasserstadt|in einer Stadt aus Glas|im Inneren eines Videospiels|in einem Krankenhaus voller Anomalien|auf dem Mond|in einer Zukunft ohne Strom|in einem riesigen Labyrinth|im Keller der Schule|auf einem Festival|in einer Wüste mit zwei Sonnen|in einem Zug, der nie anhält|in einem Wald, in dem es nie Tag wird|auf einem Dach in Tokio|in einer Burgruine|in einem Kraftwerk|in einem Traum|in einer Bibliothek ohne Ende|auf einer Insel voller Dinosaurier|in einem Aufzug|im Jahr 3000|im Mittelalter|in einem Schneesturm|in einer Neon-Stadt|auf einem Bauernhof|in einem leeren Stadion|in einer Spielhalle|in einer Höhle aus Kristall|in einem Paralleluniversum|im Backstage-Bereich eines Konzerts|auf einem Kreuzfahrtschiff|in einer Tiefgarage'),
  was: L('findet einen Brief vom zukünftigen Ich|verliert die Fähigkeit zu lügen|wacht im falschen Körper auf|entdeckt eine geheime Tür|bekommt eine Nachricht von einer unbekannten Nummer|muss in 24 Stunden die Welt retten|gewinnt im Lotto, aber das Geld ist verflucht|wird plötzlich berühmt|kann Gedanken lesen, aber nur von Tieren|findet ein Handy, das in die Zukunft schaut|verliert jeden Tag eine Erinnerung|muss ein Rätsel lösen, um rauszukommen|bekommt einen Drachen als Haustier|wird von einem Schatten verfolgt|steckt in einer Zeitschleife fest|muss ein Turnier gewinnen|entdeckt, dass alle anderen Roboter sind|wird zum König gewählt – aus Versehen|findet eine Karte zu einem Schatz|verwechselt einen Zaubertrank mit Energydrink|muss einen Stromausfall reparieren|trifft das eigene Spiegelbild in echt|bekommt eine unmögliche Hausaufgabe|kann plötzlich fliegen, aber nur rückwärts|muss ein Monster zum Freund machen|erbt ein Spukhaus|wird in ein Videospiel gesaugt|findet heraus, dass die Schule ein Raumschiff ist|muss jemanden verstecken|hört eine Stimme aus dem Radio, die alles weiß|verliert den Schatten|bekommt eine Einladung zu einem geheimen Fest|hat 1 Minute, um eine Bombe zu entschärfen|kann die Zeit für 10 Sekunden anhalten|wird von Tauben verfolgt|baut aus Versehen eine KI|muss ein Haustier vor dem Chef verstecken|findet eine Tür ins Jahr 1900|darf ab jetzt nur noch singen|wird über Nacht unsichtbar'),
  twist: L('Alles war ein Test|Der beste Freund ist der Bösewicht|Es passiert alles rückwärts|Die Hauptfigur ist eigentlich ein Geist|Das Haustier kann sprechen|Die Zeit läuft doppelt so schnell|Es war nur ein Spiel – oder doch nicht?|Der Erzähler lügt|Alle haben dasselbe geträumt|Es gibt einen Doppelgänger|Das Ende ist der Anfang|Der Bösewicht wollte nur helfen|Niemand darf ein Wort sagen|Die Welt ist eine Schneekugel|Es gibt kein Zurück|Es passiert alles an einem einzigen Tag|Die Lösung war die ganze Zeit sichtbar|Die Eltern sind Geheimagenten|Die Stadt bewegt sich|Ein Tier hat alles geplant|Alles wird live gestreamt|Es ist eigentlich das Jahr 1999|Die Hauptfigur hat Superkräfte und weiß es nicht|Die Uhr ist der Schlüssel|Es regnet nach oben|Jeder Satz muss ein Geheimnis enthalten|Die Hauptfigur ist zwei Zentimeter groß|Das Monster hat Angst vor der Hauptfigur|Es war alles in einer Kiste|Am Ende gewinnt der Verlierer'),
  // Charakter
  vor: L('Kira|Ryo|Lena|Finn|Aiko|Max|Yuna|Elias|Mira|Kai|Nova|Jonas|Sora|Lia|Theo|Akira|Zoe|Leon|Hana|Milo|Ayla|Noah|Rin|Felix|Ivy|Lukas|Emi|Raven|Jaro|Nika|Taro|Selin|Vito|Luna|Haru|Mara|Dario|Kyra|Ben|Sky'),
  nach: L('Schattenfels|Nightfall|Blitzstein|Kurogane|Eisenherz|Sturmwind|Silberklinge|Vantor|Glutmoor|Hayashi|Dornenrot|Starfield|Rabenstein|Nebelgrund|Kirschblüte|Frostberg|Morgenroth|Voltara|Wolfsherz|Graufeld|Sternstaub|Ashborne|Tannhauser|Kagami|Donnerhall|Mondschein|Blackwood|Feuerbach|Steelheart|Ravenwood|Lichtenfels|Grimm|Wintermoor|Aokiri|Drachenfels|Neonfeld|Kristallsee|Eisenwald|Nachtigall|Sonnfeld'),
  klasse: L('Schwertkämpfer|Magierin|Bogenschütze|Assassine|Heilerin|Paladin|Nekromant|Barde|Mechaniker|Hackerin|Kopfgeldjäger|Runenschmied|Druidin|Samurai|Pilot|Alchemist|Geisterbeschwörerin|Ninja|Berserker|Sturmrufer|Elektromagier|Scharfschützin|Gestaltwandler|Monsterjäger|Zeitreisender|Diebin|Drachenreiter|Söldner|Spionin|Seher|Kampfmönch|Technomant|Schattenläufer|Bestienbändiger|Erfinderin|Gladiator|Hexenjägerin|Sternenwächter|Puppenspieler|Glücksritter'),
  faeh: L('kann Blitze werfen|kann durch Wände gehen|spricht mit Maschinen|heilt mit Musik|kann 5 Sekunden in die Zukunft sehen|wird bei Wut doppelt so stark|kann sich teleportieren|kontrolliert Schatten|kann jedes Schloss knacken|kann Gedanken lesen|ruft Geister herbei|baut Gadgets aus Schrott|kann sich unsichtbar machen|kontrolliert Eis|kann fliegen|kann Tiere zähmen|verwandelt sich in einen Wolf|lässt Pflanzen wachsen|kann Zeit verlangsamen|ist unglaublich schnell|kann Feuer atmen|kopiert die Fähigkeit des Gegners|kann Illusionen erschaffen|hackt jedes System|kann Erdbeben auslösen|hat ein perfektes Gedächtnis|kann Schwerkraft umkehren|steuert Drohnen mit Gedanken|kann Wunden anderer übernehmen|wirft Schwerter mit Gedankenkraft|spürt jede Lüge|kann Wasser formen|erschafft Schutzschilde|kann Gegner einschläfern|redet jeden um den Finger|kann mit Toten sprechen|ist immun gegen Gift|kann sich selbst klonen|lädt sich mit Strom auf|findet immer den Weg'),
  schw: L('hat Höhenangst|kann nicht schwimmen|ist extrem tollpatschig|vertraut niemandem|verliert ständig Dinge|hat Angst vor Spinnen|kann nicht lügen|schläft bei Langeweile sofort ein|ist allergisch gegen Magie|wird bei Vollmond schwach|ist viel zu neugierig|redet zu viel|kann keine Karten lesen|hat ein schwaches Herz|ist süchtig nach Süßem|vergisst Namen sofort|wird im Dunkeln panisch|ist zu stolz, um Hilfe zu holen|hat einen Fluch|verträgt kein Sonnenlicht|braucht 12 Stunden Schlaf|kann nicht Nein sagen|ist farbenblind|hat Angst vor Wasser|ist schrecklich ungeduldig|ist zu gutgläubig|verliert die Kraft, wenn jemand lacht|ist eifersüchtig|spielt immer auf Risiko|ist schlecht im Zielen|hat eine laute Stimme|hustet bei Staub|kann nicht still sitzen|hat Lampenfieber|wird schnell seekrank|liebt Gold zu sehr|hat Angst vor Hühnern|ist abergläubisch|ist eitel|denkt zu lange nach'),
  geh: L('ist eigentlich adelig|hat früher für den Bösewicht gearbeitet|ist ein Roboter und weiß es nicht|hat einen Zwilling|ist 300 Jahre alt|hat den König bestohlen|kommt aus der Zukunft|ist unsterblich, aber nur dienstags|hat ein verbotenes Buch|schreibt heimlich Gedichte|ist in den Erzfeind verliebt|hat einen Drachen versteckt|ist der gesuchte Meisterdieb|kann nicht lesen|hat Angst vor der eigenen Kraft|wurde von Wölfen großgezogen|ist eigentlich ein Geist|hat ein Haustier-Monster|trägt einen gestohlenen Namen|kennt das Ende der Welt|ist pleite|war mal ein berühmter Popstar|sammelt heimlich Plüschtiere|hat eine Schuld bei einer Hexe|ist ein Spion|hat den Mentor verraten|besitzt einen Schlüssel zu einer anderen Welt|hat einen Zauber vergessen, der die Welt rettet|ist nur eine Illusion|hört eine Stimme im Kopf|ist der Sohn des Drachenkönigs|lebt doppelt|hat einen Vertrag mit einem Dämon|kann gar nicht kämpfen|verliert langsam die Erinnerung|war früher ein Tier|hat ein Tattoo, das leuchtet|weiß, wo der Schatz liegt|ist in Wahrheit ein Kind|hat eine Narbe, die spricht'),
  look: L('silberne Haare und rote Augen|eine Maske aus Porzellan|eine leuchtende Narbe|einen viel zu großen Mantel|Kopfhörer, die nie abgenommen werden|eine Roboterhand|Sommersprossen und ein freches Grinsen|lange schwarze Zöpfe|eine Augenklappe|Neon-Tattoos|einen Hut mit Feder|eine zerbrochene Brille|leuchtend blaue Haare|eine goldene Rüstung|Flügel aus Rauch|einen Fuchsschwanz|immer schmutzige Stiefel|Kristalle auf der Haut|eine Kapuze und eine Laterne|heterochrome Augen|ein Kimono mit Kirschblüten|eine Bomberjacke voller Patches|Hörner aus Obsidian|einen Schal, der im Wind weht|eine mechanische Brille|ein Lächeln, das nie die Augen erreicht|lila Haare mit Undercut|einen riesigen Rucksack|Ketten am Gürtel|einen weißen Laborkittel|eine Gasmaske|Katzenohren|eine Halskette mit Zahn|einen Gehstock mit Klinge|Elfenohren|einen Iro|Schuppen am Hals|eine Krone aus Ästen|glühende Handschuhe|einen Hoodie mit Tierohren'),
  // Orte
  ort: L('Schwebende Bibliothek|Unterwasser-Arcade|Verlassenes Kraftwerk|Kristallhöhle|Neon-Nachtmarkt|Kirschblüten-Tempel|Geisterbahnhof|Wolkenstadt|Vulkan-Schmiede|Eisschloss|Roboterfriedhof|Pilzwald|Pixel-Dorf|Zeitturm|Sternwarte am Ende der Welt|Labyrinth aus Spiegeln|Wüstenoase|Sumpf der Echos|Gestrandetes Raumschiff|Floating Market|Mondbasis|Untergrund-Arena|Hexenhaus aus Lebkuchen|Glasbrücke über dem Nichts|Riesenbaum-Stadt|Drachenhort|Versunkene Stadt|Uhrwerk-Fabrik|Schneefestung|Gaming-Café im Jahr 3000|Mitternachts-Zirkus|Leuchtturm im Nebel|Krater mit See|Verbotene Schule|Dschungelruine|Endlose Rolltreppe|Teehaus in den Bergen|Schrottplatz-Königreich|Regenbogen-Wasserfall|Stadt der Anomalien'),
  lage: L('über den Wolken|tief unter der Erde|mitten im Ozean|auf dem Rücken einer Riesenschildkröte|in einem Vulkankrater|am Rand eines schwarzen Lochs|in den Alpen|zwischen zwei Dimensionen|unter einer Großstadt|auf einem fliegenden Felsen|in einem Eisberg|im Inneren eines Baumes|auf einem anderen Planeten|im Nebel versteckt|hinter einem Wasserfall|in einer Wüste aus Glas|auf einem fahrenden Zug|in der Mitte eines Sees|auf dem Mond|in einem Schneesturm|am Grund einer Schlucht|in einer Seifenblase|auf einer Insel, die wandert|im Schatten eines Riesen|zwischen Hochhäusern|in einem alten Bergwerk|in einem Traum|auf einer Wolke|am Ende einer Sackgasse|unter dem Meeresboden|in einer Spieluhr|im Herzen eines Sturms|in einem Kirschblütental|in einer Parallelwelt|auf einem Dach|unter einer Brücke|hinter einem Spiegel|in einer Kiste|am Nordpol|in einem Riesenkürbis'),
  bes: L('Die Schwerkraft ist umgekehrt|Es ist immer Mitternacht|Alles flüstert|Die Wände verschieben sich jede Stunde|Es regnet Glitzer|Man kann nur flüsternd reden|Die Zeit läuft rückwärts|Alles ist aus Süßigkeiten|Es gibt keine Farben|Jeder Schritt macht Musik|Die Pflanzen leuchten|Man vergisst hier seinen Namen|Es schneit nach oben|Die Türen führen zufällig wohin|Das Wasser ist warm wie Tee|Alles ist doppelt so groß|Es gibt keinen Schatten|Die Sterne sind zum Greifen nah|Man hört Gedanken laut|Jeder Raum hat ein eigenes Wetter|Alle Uhren zeigen 13:13|Das Gras ist blau|Hier gibt es WLAN aus Magie|Statuen bewegen sich, wenn keiner schaut|Die Luft schmeckt nach Erdbeere|Es gibt eine Bibliothek aller Geheimnisse|Lichter folgen dir|Man kann auf Wasser gehen|Jeder Wunsch kostet eine Erinnerung|Hier spricht der Wind'),
  gef: L('ein schlafender Drache|Fallen im Boden|ein Fluch|giftiger Nebel|Wächter-Roboter|Treibsand|ein Monster, das Geräusche jagt|einstürzende Brücken|ein eifersüchtiger Geist|eine Zeitschleife|Piraten|wilde Wölfe|eine böse KI|Stromschläge|Schatten mit Augen|Lawinen|Diebe|ein Labyrinth ohne Ausgang|Schwarze Löcher|Spiegel, die stehlen|Kälte, die alles einfriert|eine Riesen-Spinne|ein Turnier auf Leben und Tod|ein Vulkanausbruch|vergiftetes Essen|Händler, die betrügen|ein Sturm, der nie aufhört|lebende Puppen|Monster im Wasser|Anomalien, die alles verändern'),
  bew: L('freundliche Golems|sprechende Katzen|vergessliche Geister|Roboter-Mönche|Pilzleute|Nomaden aus Glas|Drachenkinder|Händler aus der Zukunft|Schatten-Füchse|Ninjas im Ruhestand|Eisriesen|winzige Feen mit Attitüde|Zombies, die Vegetarier sind|Piraten-Pinguine|Hexenlehrlinge|singende Wale|Elektrogeister|Schrottsammler|Steampunk-Erfinder|eine einzige alte Frau|Wächter ohne Gesicht|Waschbär-Diebe|Sternenkinder|Cyborg-Bauern|Gamer, die nie schlafen|Mondhasen|Schneemänner|lebende Bücher|vergessene Götter|niemand – oder doch?'),
  // Spielideen
  genre: L('Roguelike|Horror|Rhythmusspiel|Open World|Puzzle|Plattformer|Battle Royale|Kartenspiel|Survival|Rennspiel|Stealth|Tower Defense|Visual Novel|Kochspiel|Sportspiel|Metroidvania|Bullet Hell|Aufbauspiel|Party-Spiel|Detektivspiel|Idle-Game|Soulslike|Simulation|Escape Room|Shooter|Farming-Spiel|Monster-Sammelspiel|Dating-Sim|Fighting Game|Sandbox|Rätsel-Plattformer|Strategie|Endless Runner|Mystery|Koop-Abenteuer|Lernspiel|Walking Simulator|Physik-Spiel|Tamagotchi-Spiel|MMO'),
  setting: L('in einem Krankenhaus voller Anomalien|in einer Neon-Großstadt|in einem japanischen Bergdorf|unter Wasser|in einem Kühlschrank|auf einem Schulhof|im Weltraum|in einem Krater mit Kirschblüten|im Mittelalter|in einer Pixel-Welt|in einem Traum|im Körper eines Menschen|in einem Spukhaus|in einem Supermarkt|auf einem Piratenschiff|in einem Ameisenhaufen|in einer Zukunft voller Roboter|in den Alpen|in einer Wüste|in einem Kraftwerk|im Internet|in einer Spielzeugkiste|auf einem Planeten aus Eis|in einer Drachenwelt|in einem Labor|in einem Zug|auf einem Festival|in einem Schachbrett|in einem Zauberbuch|in einer Bibliothek|in einem Aquarium|in einem Fast-Food-Laden|in einem Dschungel|in einer Wolkenstadt|in einer Tiefgarage|in einem Freizeitpark|in einem Gefängnis|in einer Schneekugel|in einem Bienenstock|in einem Stromkreis'),
  gtwist: L('du bist der Bösewicht|die Zeit läuft nur, wenn du dich bewegst|du kannst nicht springen|jeder Tod verändert die Welt|du spielst als Geist|das Level dreht sich ständig|du hast nur 10 Sekunden pro Level|der Boss ist dein Freund|du steuerst zwei Figuren gleichzeitig|das Licht geht immer wieder aus|alles ist rückwärts|die Musik bestimmt die Welt|du bist winzig klein|die Gegner sind unsichtbar|du kannst nur schleichen|du musst Gegner beschützen|deine Waffe ist ein Kochlöffel|jede Runde wird eine Regel geändert|das Spiel lügt dich an|du bist ein Haustier|die Karte ist zufällig jedes Mal|die Welt ist ein Würfel|du darfst nie stehen bleiben|du kannst die Schwerkraft drehen|alle NPCs sind echte Spieler|deine Kraft ist gleichzeitig deine Schwäche|du sammelst Erinnerungen statt Münzen|der Bildschirm wird immer kleiner|du bist der Endboss eines anderen Spiels|nur Geräusche zeigen dir den Weg|du kannst mit Gegenständen reden|es gibt kein HUD|jeder Schritt kostet Strom|du spielst rückwärts durch die Story|die Gegner lernen von dir|du hast einen Begleiter, der lügt|Tag und Nacht wechseln jede Minute|du baust das Level selbst|du verlierst jedes Level eine Fähigkeit|alles, was du anfasst, wird zu Gold'),
  mech: L('Deckbau|Zeitlupe|Grappling-Hook|Wand-Laufen|Crafting|Teleportation|Gravitationswechsel|Klonen|Tarnung|Wetter steuern|Rückspulen|Rhythmus-Kampf|Physik-Puzzles|Bauen mit Blöcken|Fallen stellen|Gedankenkontrolle|Portale|Schatten-Sprung|Licht und Schatten|Magnetismus|Verwandlung|Drohnen steuern|Kochen und Brauen|Würfeln für Aktionen|Stimmen aufnehmen|Fotos machen|Dominoeffekte|Farben mischen|Stealth-Kills|Stromkreise legen|Pflanzen wachsen lassen|Größe ändern|Musik spielen|Wiederbeleben|Handel und Feilschen|Tiere zähmen|Zeitreisen|Doppelsprung mit Twist|Waffen kombinieren|Karten zeichnen'),
  // Entweder-oder
  eo: L('nie wieder Musik hören|nie wieder zocken|immer 10 Minuten zu spät kommen|immer 2 Stunden zu früh sein|fliegen können|unsichtbar sein können|in der Vergangenheit leben|in der Zukunft leben|nur noch Pizza essen|nie wieder Pizza essen|einen Drachen als Haustier haben|einen Roboter-Butler haben|ein Jahr ohne Handy|ein Jahr ohne Freunde treffen|jede Sprache sprechen|mit Tieren reden können|berühmt sein|reich, aber unbekannt sein|im Weltraum wohnen|unter Wasser wohnen|immer die Wahrheit sagen müssen|immer lügen müssen|alles vorher wissen|alles vergessen können|in einem Horrorfilm mitspielen|in einem Liebesfilm mitspielen|nie wieder schlafen müssen|nie wieder essen müssen|deine Gedanken laut hören lassen|nie wieder reden dürfen|der beste Gamer der Welt sein|der beste Fußballer der Welt sein|nur mit Socken herumlaufen|nur mit Flip-Flops herumlaufen|mit einem Bären kämpfen|mit 50 Hühnern kämpfen|eine Zeitmaschine haben|eine Teleportations-Tür haben|nur noch flüstern können|nur noch schreien können|im Minecraft-Universum leben|im Pokémon-Universum leben|10 Jahre jünger sein|10 Jahre älter sein|Winter für immer|Sommer für immer|alle Filme schon kennen|keine Filme mehr schauen dürfen|ein eigenes Spiel entwickeln|ein eigenes Album rausbringen|mit Superkräften Probleme machen|ohne Kräfte die Welt retten|ein Jahr in Japan leben|ein Jahr in Amerika leben|Gedanken lesen können|Zeit anhalten können|nie wieder Süßes essen|nie wieder Salziges essen|in einer Burg wohnen|in einem Baumhaus wohnen'),
  // Fragen
  frage: L('Was war der lustigste Moment in deinem Leben?|Welches Spiel würdest du jemandem zeigen, der noch nie gezockt hat?|Was ist deine unpopulärste Meinung?|Welchen Song könntest du in Dauerschleife hören?|Was würdest du mit einer Million Euro machen?|Welche Superkraft wäre im Alltag am nervigsten?|Was ist dein Lieblingsgeruch?|Was ist das Peinlichste, das dir in der Schule passiert ist?|Wenn du ein Tier wärst, welches und warum?|Welcher Film ist komplett überbewertet?|Was ist dein perfekter Sonntag?|Welche Fähigkeit würdest du sofort lernen wollen?|Was ist das beste Essen um 3 Uhr nachts?|Welche App würdest du als letzte löschen?|Wer ist dein Lieblings-Videospielcharakter?|Was war dein erstes Handy?|Welcher Ort auf der Welt muss es unbedingt sein?|Was würdest du erfinden, wenn du könntest?|Was ist dein seltsamstes Talent?|Was war dein größter Fail beim Zocken?|Welche Regel würdest du sofort abschaffen?|Was hast du zuletzt zum ersten Mal gemacht?|Was ist dein Lieblingswort?|Welches Emoji benutzt du am meisten?|Wen würdest du gern einen Tag lang sein?|Was würdest du tun, wenn das Internet einen Tag ausfällt?|Welche Pizza-Sorte ist die beste?|Was ist der beste Rat, den du je bekommen hast?|Was machst du, wenn dir langweilig ist?|Welches Spiel hat dich am meisten aufgeregt?|Was ist dein Traumjob, wenn Geld egal wäre?|Welche Serie würdest du gern löschen und neu schauen?|Was war das beste Geschenk, das du je bekommen hast?|Welches Tier ist heimlich gruselig?|Was ist dein Lieblingsfeiertag und warum?|Welchen Rekord würdest du gern halten?|Was würdest du in deinem Zimmer sofort ändern?|Welche Zeitepoche ist die coolste?|Was ist dein Guilty Pleasure?|Welche Frage stellst du dir oft?'),
  wenn: L('Tiere sprechen könnten|es keine Schule gäbe|du einen Tag unsichtbar wärst|Handys nie erfunden worden wären|du in einem Videospiel leben würdest|Menschen fliegen könnten|es jeden Tag schneien würde|du die Zeit zurückdrehen könntest|alle Gedanken lesen könnten|es keine Nacht mehr gäbe|du einen Klon hättest|Geld abgeschafft würde|du König von Österreich wärst|Dinosaurier noch leben würden|du nie schlafen müsstest|alle Menschen gleich aussehen würden|Musik verboten wäre|du 100 Jahre in die Zukunft reisen könntest|du nur noch ein Essen essen dürftest|dein Haustier plötzlich reden könnte|Strom für einen Monat ausfällt|du eine Superkraft wählen dürftest|du morgen berühmt aufwachst|Roboter die Schule übernehmen|du in deinem Lieblingsspiel aufwachst|alle nur noch singen dürften|es keine Farben mehr gäbe|du jede Sprache sprechen könntest|der Mond verschwinden würde|du ein Jahr allein auf einer Insel leben müsstest|du einen Drachen hättest|alle Lügen sichtbar wären|du die Gesetze machen dürftest|Zombies wirklich kommen würden|du einen Tag ein Lehrer wärst|es kein Internet gäbe|du Gedanken senden könntest|du nie mehr frieren würdest|Aliens morgen landen würden|du einen Tag lang 5 cm groß wärst'),
  // Schreibaufgaben
  form: L('Schreib ein Gedicht|Schreib eine Kurzgeschichte|Schreib einen Brief|Schreib einen Tagebucheintrag|Schreib einen Songtext|Schreib einen Dialog|Schreib eine Nachricht an dein zukünftiges Ich|Schreib eine Produktwerbung|Schreib einen Zeitungsartikel|Schreib ein Rap-Verse|Schreib ein Haiku|Schreib eine Rezension|Schreib eine Anleitung|Schreib eine Rede|Schreib ein Märchen|Schreib einen Chatverlauf|Schreib einen Horror-Kurztext|Schreib einen Witz|Schreib ein Rezept|Schreib eine Speisekarte|Schreib eine Quest-Beschreibung|Schreib einen Wetterbericht|Schreib eine Liebeserklärung|Schreib einen Beschwerdebrief|Schreib einen Steckbrief|Schreib ein Interview|Schreib eine Sage|Schreib einen Patch-Log|Schreib eine Schlagzeile mit Artikel|Schreib einen inneren Monolog'),
  thema: L('über deinen Wecker|über den letzten Tag der Erde|über einen verlorenen Socken|über eine Stadt im Nebel|über deinen Lieblingssnack|über ein kaputtes Handy|über das Internat um Mitternacht|über einen Drachen mit Liebeskummer|über den ersten Schnee|über einen Bug im Spiel|über einen Roboter, der träumt|über einen Stromausfall|über eine geheime Tür|über deinen größten Fail|über den Montag|über einen Hund im Weltraum|über eine Zeitreise|über einen Freund, der lügt|über das Meer|über eine leere Stadt|über das letzte Level|über deinen Schatten|über einen Zaubertrank|über die Nacht vor einer Prüfung|über ein Gewitter|über einen Geist, der Angst hat|über das perfekte Sandwich|über eine Kirschblüte|über Langeweile|über das Jahr 2099|über einen Superhelden, der krank ist|über einen Bus, der nie kommt|über eine Katze als Bürgermeisterin|über Heimweh|über einen geheimen Club|über eine Steckdose mit Gefühlen|über die Farbe Blau|über einen Wettkampf|über das erste Mal Zocken|über einen Stein, der reden kann'),
  regel: L('ohne den Buchstaben E|in genau 50 Wörtern|jeder Satz beginnt mit dem nächsten Buchstaben im ABC|nur in Fragen|mit genau 3 Sätzen|mit einem Reim pro Zeile|aus Sicht eines Gegenstands|in der Du-Form|mit mindestens 5 Emojis|ohne Adjektive|mit einem überraschenden Ende|in 2 Minuten|mit dem Wort „Banane“ in jedem Satz|nur mit Wörtern unter 6 Buchstaben|rückwärts erzählt|mit einer Lüge drin|als ob es 1850 wäre|im Dialekt|mit einem Zitat am Anfang|so dramatisch wie möglich|so langweilig wie möglich|mit genau 7 Zeilen|ohne das Wort „und“|alle Wörter mit S anfangen lassen (so gut es geht)|aus Sicht eines Bösewichts|in Großbuchstaben|mit einer Zahl in jedem Satz|als Werbung für etwas Unnötiges|mit einem Cliffhanger|mit 3 erfundenen Wörtern|als Geheimbotschaft|mit Wettervergleichen|nur im Präsens|aus Sicht eines Tieres|im Stil eines Sportkommentators|mit Fußnoten|in einem einzigen langen Satz|mit einer Farbe in jedem Satz|ohne Satzzeichen|mit genau einem Wort pro Zeile'),
  // Foto
  fmot: L('etwas Rundes|deinen Schatten|etwas Blaues|ein Gesicht in einem Gegenstand|etwas Altes|dein Lieblingsessen|Licht durchs Fenster|etwas, das leuchtet|eine Spiegelung|eine Textur|etwas Winziges|ein Muster|deine Schuhe|Wolken|eine Pflanze|etwas Kaputtes|ein Schild mit lustigem Text|ein Kabel|deinen Arbeitsplatz|etwas in deiner Lieblingsfarbe|eine Uhr|Wasser|etwas Symmetrisches|einen Schatten, der aussieht wie etwas anderes|ein Tier|eine Treppe|eine Tür|deine Hand mit etwas|etwas Weiches|etwas Elektrisches|Sonnenuntergang|Regentropfen|ein Fahrzeug|einen Buchstaben, den du findest|etwas, das nicht dazugehört|Stille|Bewegung|Chaos|Ordnung|etwas Geheimnisvolles'),
  fbed: L('aus der Froschperspektive|von ganz oben|ganz nah (Makro)|durch etwas hindurch|im Dunkeln mit Taschenlampe|in Schwarz-Weiß|mit Gegenlicht|verwackelt mit Absicht|in einer Spiegelung|durch ein Glas Wasser|mit nur einer Farbe im Bild|schräg gehalten|in 10 Sekunden|ohne hinzuschauen|mit der Frontkamera|durch eine Sonnenbrille|im Panorama-Modus|in der linken Bildhälfte|mit viel leerem Raum|mit einem Gegenstand im Vordergrund|im Spiegel|in Bewegung|nur Schatten|vom Boden aus|mit Zoom|im Hochformat zentriert|aus einem Versteck|mit Taschenlampen-Licht von unten|mit Blitz|bei Nacht|im Gegenlicht als Silhouette|mit führenden Linien|im Goldenen Schnitt|mit Rahmen im Bild|unscharf im Hintergrund|unscharf im Vordergrund|von hinten|mit einer Hand im Bild|durch ein Loch|so, dass niemand erkennt, was es ist'),
  fbon: L('in 5 Minuten|ohne den Raum zu verlassen|mit einem Lächeln im Bild|mit einem Emoji-Filter|als Serie aus 3 Fotos|mit einem Titel wie ein Kinofilm|als Rätsel für Freunde|nur draußen|nur drinnen|mit einem Spielzeug|mit einem Haustier|mit einem Getränk|mit einem Buchstaben|mit dem Wort „BORED“|wie ein Albumcover|wie ein Gruselfilm|wie ein Werbefoto|in 3 Farben|mit Spiegelung|mit Kopfhörern im Bild|mit einem Kabel|mit Licht vom Handy deines Freundes|als Vorher/Nachher|in einer Minute|ohne zu zoomen|mit einer Zahl|mit etwas Gelbem|mit einem Gesicht|mit einem Fenster|im Teamwork mit jemandem'),
  // Namen
  fa1: L('Ael|Bra|Cal|Dor|Ely|Fae|Gal|Hal|Ith|Jor|Kae|Lor|Mor|Nym|Ora|Pel|Quel|Ryn|Syl|Tha|Ul|Val|Wy|Xan|Yra|Zel|Ar|Bel|Cor|Dra|Eld|Fen|Gwen|Il|Kor|Mae|Ner|Ro|Sae|Tor'),
  fa2: L('a|e|i|o|u|ae|ar|el|en|is|or|an|ia|ri|th|la|ma|ny|ve||||ir|ul|ea|on|ra|li|so|da'),
  fa3: L('dor|wyn|riel|thas|mir|ion|ra|lis|nor|var|dris|eth|las|wen|rin|gar|mon|thir|anis|ys|ael|oth|uin|ara|ric|vyn|zar|ia|eon|or|ath|elle|ius|ka|thor|wald|ren|ys|indra|on'),
  faEp: L('vom Nebelhain|aus dem Silbertal|der Flammenherz|von den Sternfällen|aus dem Dornenwald|der Wanderer|von Eisenhall|der Schattenruferin|aus Kristallmoor|vom Drachenberg|der Letzte|von den Aschefeldern|aus Mondlicht|der Ungebrochene|vom Rabenturm|aus dem Ostreich|der Sturmgeborene|von der Glutküste|aus Weißwasser|der Stille|vom Kirschblütenhain|aus den Tiefen|der Klingentänzerin|von Thalor|aus dem Grauen Wald|der Funkenschmied|von Elderhain|aus dem Wolkenreich|der Runenleser|vom Frostgipfel'),
  sf1: L('Zor|Vex|Kael|Nyx|Tal|Orion|Rax|Xen|Juno|Cyra|Dex|Vor|Lyra|Sol|Kova|Ion|Zeta|Nero|Axi|Qor|Vela|Tyr|Echo|Rho|Kyto|Mira|Sato|Nova|Hex|Arc'),
  sf2: L('ax|ion|ara|on|is|ex|ul|ia|os|ix|en|ar|eth|yn|ova|us|ek|ira|an|or|ux|elle|ith|ade|ok|yra|ent|ius|al|ys'),
  sfD: L('-7|-X|-42|Prime|-9|der Dritte|-Alpha|-Omega|-13|Unit 5|-Zero|-88|von Kepler-22|aus Sektor 9|-Nexus|-Delta|-101|-Sigma|vom Mars|-V2|-Kappa|-0|-Theta|-Neon|-3000|-Echo|-Ion|-Gamma|von Station 4|-Beta'),
  gAdj: L('Silent|Toxic|Lazy|Neon|Shadow|Crazy|Frozen|Hyper|Salty|Sneaky|Mighty|Turbo|Cosmic|Dark|Sleepy|Angry|Lucky|Pixel|Glitch|Savage|Chill|Wild|Epic|Iron|Ghost|Rapid|Lost|Mega|Cyber|Spicy|Fluffy|Royal|Night|Atomic|Electric|Golden|Silver|Rusty|Sus|Bored'),
  gNoun: L('Ninja|Kartoffel|Wolf|Panda|Sniper|Dragon|Knödel|Gamer|Phantom|Raven|Toaster|Knight|Goblin|Fox|Viper|Schnitzel|Pinguin|Wizard|Titan|Hunter|Bot|Lama|Potato|Shark|Samurai|Kebab|Rocket|Storm|Cookie|Demon|Blaze|Pickle|Reaper|Unicorn|Hamster|Ace|Volt|Waffle|Yeti|Creeper'),
  tAdj: L('wilden|verrückten|glorreichen|schläfrigen|unbesiegbaren|leuchtenden|chaotischen|eiskalten|flinken|furchtlosen|legendären|hungrigen|verlorenen|goldenen|stillen|lauten|glitzernden|explodierenden|elektrischen|geheimen|fliegenden|hüpfenden|tanzenden|gefährlichen|müden|stolzen|kosmischen|wütenden|kuscheligen|unsichtbaren|rostigen|turbo-schnellen|mysteriösen|grantigen|knusprigen|nervösen|heldenhaften|frostigen|feurigen|digitalen'),
  tNoun: L('Waschbären|Knödel|Ninjas|Drachen|Pinguine|Raketen|Kartoffeln|Wölfe|Roboter|Piraten|Gurken|Füchse|Titanen|Blitze|Faultiere|Krieger|Eulen|Zombies|Wikinger|Haie|Lamas|Gespenster|Kobolde|Schnitzel|Falken|Toaster|Samurai|Bären|Kometen|Hamster|Panther|Mammuts|Goblins|Steckdosen|Kirschblüten|Elektriker|Leuchttürme|Stürme|Igel|Yetis')
};
// Emojis (mit Leerzeichen getrennt, damit ZWJ-Emojis ganz bleiben)
W.emoji = (function(){
  const src = '🐉 🦄 🐱 🐶 🐧 🦊 🐸 🐙 🦈 🐢 🦉 🐝 🦋 🐼 🦖 👻 👽 🤖 🎃 💀 🧙 🧛 🧟 🥷 🦸 🚀 🛸 🌋 🏰 🌙 ⭐ ☄️ 🌈 ⚡ 🔥 ❄️ 🌊 🌪️ 🍕 🍔 🍩 🍦 🌮 🍌 🍓 ☕ 🎂 🍿 🎮 🕹️ 🎧 🎸 🎤 📱 💻 🔌 💡 🔦 🔑 🗝️ 💎 👑 🗡️ 🛡️ 🏹 🧪 🔮 📜 🗺️ ⏰ ⌛ 📦 🎁 🎈 🎉 🧸 🪄 🎲 🧩 🚗 🚂 🚲 🛹 ⛵ 🚁 🏎️ 🏆 ⚽ 🏀 🎯 🎨 📷 📚 ✉️ 🧲 🪐 🌍 🌳 🌵 🍄 🌸 🌻 🐚 🦴 👓 🎩 🧢 👟 🧦 🧤 🧣 💍 🪙 💰 🧠 👀 👂 🦷 💤 💩 🫠 😱 🤯 😴 🥶 🤠 😎 🤡 🥳 😈 🫣 🧊 🪨 🛏️ 🚪 🪞 🧻 🛒 🎻 🥁 🎺 📺 📡 🛰️ 🔭 🧬 🦠 🍀 🌶️ 🥔 🥨 🧀 🍫 🐌 🦀 🦕 🐲 🏴‍☠️ 🧑‍🚀 🧑‍🍳';
  return src.split(' ');
})();

/* Motive für „Zeichne das!“ – 3 Stufen */
const MOT = [
  L('Haus|Sonne|Baum|Katze|Hund|Auto|Fisch|Blume|Apfel|Banane|Pizza|Eis|Herz|Stern|Mond|Wolke|Regenschirm|Brille|Schuh|Ball|Buch|Tasse|Uhr|Schlüssel|Handy|Kerze|Pilz|Schneemann|Rakete|Fahrrad|Boot|Zug|Vogel|Schlange|Schildkröte|Maus|Spinne|Biene|Tisch|Stuhl|Lampe|Glühbirne|Gitarre|Krone|Geist|Kuchen|Burger|Donut|Kaktus|Berg|Regenbogen|Blitz|Ei|Karotte|Erdbeere|Hut|Socke|Zahnbürste|Schere|Tür'),
  L('Leuchtturm|Drache|Roboter|Vulkan|Pirat|Einhorn|Dinosaurier|Burg|Ritter|Zauberer|Astronaut|Oktopus|Pinguin|Krokodil|Giraffe|Elefant|Kopfhörer|Gaming-Controller|Skateboard|Hubschrauber|Traktor|Feuerwehrauto|Heißluftballon|Zelt|Lagerfeuer|Insel|Wasserfall|Brücke|Kirche|Riesenrad|Achterbahn|Schatzkiste|Zauberstab|Kristall|Steckdose|Toaster|Waschmaschine|Mikrofon|Kamera|Teleskop|Ufo|Mumie|Vampir|Zombie|Ninja|Schwert|Schild|Fußballtor|Pokal|Kirschbaum'),
  L('Stromausfall|Lagerfeuer im Regen|Hai im Planschbecken|Katze auf dem Mond|Zeitreise|Albtraum|Langeweile|Ohrwurm|Gewitter über der Stadt|Elektriker auf der Leiter|Roboter verliebt sich|Pinguin im Urlaub|Drache beim Zahnarzt|Ritter verliert Schwert|Alien im Supermarkt|Geburtstagsparty|Schneeballschlacht|Wackelpudding|Kurzschluss|Schlafwandler|Lehrer schläft ein|Rage Quit|Lag im Spiel|Montagmorgen|Hausaufgaben vergessen|Weltraum-Picknick|Kirschblüten im Wind|Monster unterm Bett|Hackerangriff|Piratenschiff im Sturm|Fahrstuhl steckt fest|Wettrennen|Gespenst hat Angst|Dinosaurier fährt Auto|Baum mit Gesicht|Geheimversteck|Verbrannter Toast|Selfie mit Bär|Gaming-Marathon|Zauberer verzaubert sich selbst')
];

/* Farben */
const COLORS = ['#F5F5FF', '#A7A3C9', '#1a1030', '#000000', '#00E5FF', '#A855F7', '#FF36B8', '#3DF5A0', '#FFC93C', '#FF5470', '#FF8A3D', '#4D7CFF', '#7CFF4D', '#8B5A2B', '#FFD1DC', '#2EC4B6'];
const hexRgb = h => { h = h.replace('#', ''); if(h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mixWhite = (h, t) => { const [r, g, b] = hexRgb(h); return 'rgb(' + [r, g, b].map(v => Math.round(v + (255 - v) * t)).join(',') + ')'; };
function hslHex(h, s, l){
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/* ---------- Hintergründe ---------- */
const BGS = [
  { id: 'dark', name: 'Nacht' }, { id: 'white', name: 'Weiß' }, { id: 'paper', name: 'Papier' }, { id: 'black', name: 'Schwarz' },
  { id: 'neon', name: 'Neon' }, { id: 'grid', name: 'Karo' }, { id: 'dots', name: 'Punkte' }, { id: 'sky', name: 'Abendrot' }
];
function paintBg(x, w, h, id){
  x.save(); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.shadowBlur = 0;
  const solid = { dark: '#0d0b1a', white: '#ffffff', paper: '#f3ead7', black: '#000000' };
  if(solid[id]){ x.fillStyle = solid[id]; x.fillRect(0, 0, w, h); }
  else if(id === 'neon'){
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#1b0b3a'); g.addColorStop(.55, '#0b1030'); g.addColorStop(1, '#2a0a2c');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const r = x.createRadialGradient(w * .8, h * .15, 0, w * .8, h * .15, w * .8); r.addColorStop(0, 'rgba(0,229,255,.25)'); r.addColorStop(1, 'rgba(0,229,255,0)');
    x.fillStyle = r; x.fillRect(0, 0, w, h);
  }else if(id === 'grid'){
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(70,120,220,.28)'; x.lineWidth = 1;
    const st = Math.max(14, Math.round(w / 22));
    x.beginPath(); for(let i = st; i < w; i += st){ x.moveTo(i + .5, 0); x.lineTo(i + .5, h); } for(let j = st; j < h; j += st){ x.moveTo(0, j + .5); x.lineTo(w, j + .5); } x.stroke();
  }else if(id === 'dots'){
    x.fillStyle = '#fbfaff'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(90,80,140,.35)';
    const st = Math.max(14, Math.round(w / 20));
    for(let i = st / 2; i < w; i += st) for(let j = st / 2; j < h; j += st){ x.beginPath(); x.arc(i, j, Math.max(1, w / 300), 0, 6.283); x.fill(); }
  }else if(id === 'sky'){
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2b1055'); g.addColorStop(.55, '#d53369'); g.addColorStop(1, '#ffb347');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }
  x.restore();
}

/* ---------- Zeichen-Engine ---------- */
function Painter(api, stage, w, h){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const CW = Math.round(w * dpr), CH = Math.round(h * dpr);
  const mk = () => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; return c; };
  const bgC = mk(), lay = mk(), stk = mk(), base = mk();
  stage.style.aspectRatio = w + ' / ' + h;
  stage.append(bgC, lay, stk);
  const bx = bgC.getContext('2d'), lx = lay.getContext('2d', { willReadFrequently: true }), sx = stk.getContext('2d'), basex = base.getContext('2d');
  [bx, lx, sx, basex].forEach(c => c.setTransform(dpr, 0, 0, dpr, 0, 0));
  const P = { tool: 'pen', color: '#00E5FF', size: 6, alpha: 1, bg: 'dark', locked: false, onchange: null, onstroke: null };
  const MAX = 32, undo = [], redo = [];
  let cur = null, raf = 0, dirty = 0;
  const notify = () => P.onchange && P.onchange();
  const drawBg = () => { bx.setTransform(dpr, 0, 0, dpr, 0, 0); bx.clearRect(0, 0, w, h); paintBg(bx, w, h, P.bg); };
  drawBg();
  const clearC = x => { x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, CW, CH); x.restore(); };
  const snap = () => ({ d: lx.getImageData(0, 0, CW, CH), bg: P.bg });
  const pushUndo = () => { undo.push(snap()); if(undo.length > MAX) undo.shift(); redo.length = 0; dirty++; notify(); };
  const restore = s => { lx.putImageData(s.d, 0, 0); if(s.bg !== P.bg){ P.bg = s.bg; drawBg(); } };

  const pos = e => { const r = stk.getBoundingClientRect(); return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height, t: e.timeStamp || performance.now(), p: e.pressure, pt: e.pointerType }; };
  const free = () => ['pen', 'brush', 'neon', 'eraser'].includes(P.tool);

  function lw(pt){
    const b = P.tool === 'eraser' ? P.size * 2 : P.size;
    if(pt.pt === 'pen' && pt.p > 0) return b * (0.25 + pt.p * 1.25);
    if(P.tool === 'pen' || P.tool === 'eraser' || P.tool === 'neon') return b;
    const d = Math.hypot(pt.x - cur.last.x, pt.y - cur.last.y), dt = Math.max(1, pt.t - cur.last.t);
    const target = clamp(1.35 - (d / dt) * 0.45, 0.4, 1.35);
    cur.pr += (target - cur.pr) * 0.25; return b * cur.pr;
  }
  function seg(a, c, b, width){
    sx.lineCap = 'round'; sx.lineJoin = 'round'; sx.strokeStyle = P.tool === 'eraser' ? '#fff' : P.color; sx.lineWidth = width;
    sx.beginPath(); sx.moveTo(a.x, a.y); sx.quadraticCurveTo(c.x, c.y, b.x, b.y); sx.stroke();
  }
  function neonPath(){
    const p = cur.pts; sx.beginPath(); sx.moveTo(p[0].x, p[0].y);
    if(p.length < 3){ const q = p[p.length - 1]; sx.lineTo(q.x + .01, q.y + .01); }
    else{ for(let i = 1; i < p.length - 1; i++){ const m = { x: (p[i].x + p[i + 1].x) / 2, y: (p[i].y + p[i + 1].y) / 2 }; sx.quadraticCurveTo(p[i].x, p[i].y, m.x, m.y); } const q = p[p.length - 1]; sx.lineTo(q.x, q.y); }
  }
  function drawNeon(){
    clearC(sx); sx.lineCap = 'round'; sx.lineJoin = 'round';
    neonPath(); sx.shadowColor = P.color; sx.shadowBlur = P.size * 2.2 + 8; sx.strokeStyle = P.color; sx.lineWidth = P.size; sx.stroke(); sx.stroke();
    sx.shadowBlur = 0; neonPath(); sx.strokeStyle = mixWhite(P.color, .75); sx.lineWidth = Math.max(1, P.size * .38); sx.stroke();
  }
  function applyErase(){
    lx.save(); lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, CW, CH); lx.drawImage(base, 0, 0);
    lx.globalCompositeOperation = 'destination-out'; lx.globalAlpha = P.alpha; lx.drawImage(stk, 0, 0); lx.restore();
  }
  function frame(){ raf = 0; if(!cur) return; if(P.tool === 'neon') drawNeon(); else if(P.tool === 'eraser') applyErase(); else if(cur.shape) drawShape(); }
  const req = () => { if(!raf) raf = requestAnimationFrame(frame); };
  function drawShape(){
    clearC(sx); const a = cur.start, b = cur.end || cur.start;
    sx.lineCap = 'round'; sx.lineJoin = 'round'; sx.strokeStyle = P.color; sx.lineWidth = P.size; sx.beginPath();
    if(P.tool === 'line'){ sx.moveTo(a.x, a.y); sx.lineTo(b.x, b.y); }
    else if(P.tool === 'rect'){ sx.rect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); }
    else{ sx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2 + .01, Math.abs(b.y - a.y) / 2 + .01, 0, 0, 6.2832); }
    sx.stroke();
  }
  function addPt(pt){
    if(P.tool === 'neon'){ const l = cur.pts[cur.pts.length - 1]; if(Math.hypot(pt.x - l.x, pt.y - l.y) > 1.2) cur.pts.push(pt); req(); return; }
    const m = { x: (cur.last.x + pt.x) / 2, y: (cur.last.y + pt.y) / 2 };
    const width = lw(pt);
    seg(cur.mid, cur.last, m, (cur.w + width) / 2); cur.w = width;
    cur.mid = m; cur.last = pt;
    if(P.tool === 'eraser') req();
  }
  function down(e){
    if(P.locked || !e.isPrimary || cur) return;
    if(e.button > 0) return;
    e.preventDefault();
    try{ stk.setPointerCapture(e.pointerId); }catch(_){}
    const pt = pos(e);
    if(P.tool === 'fill'){ pushUndo(); flood(pt.x, pt.y); api.sound('pop'); P.onstroke && P.onstroke(); return; }
    pushUndo();
    cur = { id: e.pointerId, last: pt, mid: pt, pts: [pt], pr: 1, w: P.size, start: pt, shape: !free() };
    clearC(sx);
    stk.style.opacity = P.tool === 'eraser' ? 0 : P.alpha;
    if(P.tool === 'eraser'){ clearC(basex); basex.save(); basex.setTransform(1, 0, 0, 1, 0, 0); basex.drawImage(lay, 0, 0); basex.restore(); }
    if(free() && P.tool !== 'neon'){
      const r = lw(pt) / 2; sx.fillStyle = P.tool === 'eraser' ? '#fff' : P.color; sx.beginPath(); sx.arc(pt.x, pt.y, r, 0, 6.2832); sx.fill(); cur.w = r * 2;
      if(P.tool === 'eraser') req();
    }else req();
  }
  function move(e){
    if(!cur || e.pointerId !== cur.id) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    (evs.length ? evs : [e]).forEach(ev => { const pt = pos(ev); if(cur.shape){ cur.end = pt; req(); } else addPt(pt); });
  }
  function up(e){
    if(!cur || e.pointerId !== cur.id) return;
    if(free() && P.tool !== 'neon' && !cur.shape){ seg(cur.mid, cur.last, cur.last, cur.w); }
    if(raf){ cancelAnimationFrame(raf); raf = 0; }
    frame();
    if(P.tool === 'eraser'){ applyErase(); }
    else{ lx.save(); lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalAlpha = P.alpha; lx.drawImage(stk, 0, 0); lx.restore(); }
    clearC(sx); stk.style.opacity = 1; cur = null;
    P.onstroke && P.onstroke();
  }
  stk.addEventListener('pointerdown', down);
  stk.addEventListener('pointermove', move);
  stk.addEventListener('pointerup', up);
  stk.addEventListener('pointercancel', up);
  stk.addEventListener('contextmenu', e => e.preventDefault());
  const stopTouch = e => { if(e.cancelable) e.preventDefault(); };
  stk.addEventListener('touchstart', stopTouch, { passive: false });
  stk.addEventListener('touchmove', stopTouch, { passive: false });

  function flood(px, py){
    const X = Math.floor(px * dpr), Y = Math.floor(py * dpr);
    if(X < 0 || Y < 0 || X >= CW || Y >= CH) return;
    const tmp = mk(), tx = tmp.getContext('2d', { willReadFrequently: true });
    tx.drawImage(bgC, 0, 0); tx.drawImage(lay, 0, 0);
    const c = tx.getImageData(0, 0, CW, CH).data;
    const k0 = (Y * CW + X) * 4, r0 = c[k0], g0 = c[k0 + 1], b0 = c[k0 + 2];
    const match = i => { const k = i * 4; return Math.abs(c[k] - r0) + Math.abs(c[k + 1] - g0) + Math.abs(c[k + 2] - b0) <= 96; };
    const mask = new Uint8Array(CW * CH), st = [X, Y];
    while(st.length){
      const y = st.pop(); let x = st.pop(); let i = y * CW + x;
      while(x >= 0 && !mask[i] && match(i)){ x--; i--; }
      x++; i++; let upF = false, dnF = false;
      while(x < CW && !mask[i] && match(i)){
        mask[i] = 1;
        if(y > 0){ const j = i - CW; if(!mask[j] && match(j)){ if(!upF){ st.push(x, y - 1); upF = true; } } else upF = false; }
        if(y < CH - 1){ const j = i + CW; if(!mask[j] && match(j)){ if(!dnF){ st.push(x, y + 1); dnF = true; } } else dnF = false; }
        x++; i++;
      }
    }
    // 1 px ausweiten, damit keine hellen Ränder an Linien bleiben
    for(let pass = 0; pass < 2; pass++){
      const v = pass + 1;
      for(let y = 0; y < CH; y++) for(let x = 0; x < CW; x++){
        const i = y * CW + x; if(mask[i]) continue;
        if((x > 0 && mask[i - 1] === v) || (x < CW - 1 && mask[i + 1] === v) || (y > 0 && mask[i - CW] === v) || (y < CH - 1 && mask[i + CW] === v)) mask[i] = v + 1;
      }
    }
    const id = lx.getImageData(0, 0, CW, CH), d = id.data;
    const [fr, fg, fb] = hexRgb(P.color), fa = P.alpha;
    for(let i = 0; i < mask.length; i++){
      if(!mask[i]) continue;
      const k = i * 4, da = d[k + 3] / 255, oa = fa + da * (1 - fa);
      if(oa <= 0) continue;
      d[k] = (fr * fa + d[k] * da * (1 - fa)) / oa; d[k + 1] = (fg * fa + d[k + 1] * da * (1 - fa)) / oa; d[k + 2] = (fb * fa + d[k + 2] * da * (1 - fa)) / oa; d[k + 3] = oa * 255;
    }
    lx.putImageData(id, 0, 0);
  }

  function composite(maxSide){
    let cw = CW, ch = CH;
    if(maxSide && Math.max(cw, ch) > maxSide){ const f = maxSide / Math.max(cw, ch); cw = Math.round(cw * f); ch = Math.round(ch * f); }
    const c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d');
    x.drawImage(bgC, 0, 0, cw, ch); x.drawImage(lay, 0, 0, cw, ch); return c;
  }
  return {
    P, w, h,
    undo(){ if(!undo.length) return false; redo.push(snap()); restore(undo.pop()); notify(); return true; },
    redo(){ if(!redo.length) return false; undo.push(snap()); restore(redo.pop()); notify(); return true; },
    canUndo: () => undo.length > 0, canRedo: () => redo.length > 0, touched: () => dirty > 0,
    clear(){ pushUndo(); clearC(lx); notify(); },
    initBg(id){ P.bg = id; drawBg(); },
    setBg(id){ if(id === P.bg) return; pushUndo(); P.bg = id; drawBg(); notify(); },
    png: () => composite().toDataURL('image/png'),
    jpeg: (max = 640, q = .78) => composite(max).toDataURL('image/jpeg', q),
    load(src){
      return new Promise(res => {
        const img = new Image();
        img.onload = () => { pushUndo(); clearC(lx); const f = Math.max(w / img.width, h / img.height), iw = img.width * f, ih = img.height * f; lx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih); notify(); res(true); };
        img.onerror = () => res(false); img.src = src;
      });
    },
    destroy(){ if(raf) cancelAnimationFrame(raf); undo.length = 0; redo.length = 0; }
  };
}

/* gemeinsame UI-Bausteine */
function colorRow(api, painter, list, onPick){
  const row = el('div', { class: 'cr-colors' });
  const sws = list.map(c => el('button', { class: 'cr-sw', 'aria-label': 'Farbe ' + c, style: { background: c }, onclick: () => set(c) }));
  const inp = el('input', { type: 'color', value: '#00e5ff', 'aria-label': 'Eigene Farbe' });
  const pk = el('label', { class: 'cr-pick', title: 'Eigene Farbe' }, [inp]);
  inp.addEventListener('input', () => set(inp.value, true));
  function set(c, custom){
    painter.P.color = c; sws.forEach((s, i) => s.classList.toggle('on', !custom && list[i].toLowerCase() === c.toLowerCase()));
    pk.style.boxShadow = custom ? '0 0 0 2px var(--cyan),var(--glow-c)' : '';
    if(custom) pk.style.background = c; else api.sound('tap');
    if(painter.P.tool === 'eraser' && onPick) onPick();
  }
  row.append(...sws, pk); set(painter.P.color);
  return row;
}
function slider(label, min, max, val, fmt, onInput){
  const out = el('output', { text: fmt(val) });
  const r = el('input', { type: 'range', min, max, value: val, 'aria-label': label });
  r.addEventListener('input', () => { out.textContent = fmt(+r.value); onInput(+r.value); });
  return { node: el('div', { class: 'cr-sl' }, [el('label', { text: label }), r, out]), input: r };
}
function stageSize(root, reserve, minH, maxH){
  const cs = getComputedStyle(root), inner = (root.clientWidth || innerWidth) - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
  const wpx = Math.max(240, Math.min(588, inner));
  const hpx = clamp(Math.round(innerHeight - reserve), minH, Math.min(maxH, Math.round(wpx * 1.45)));
  return [Math.round(wpx), hpx];
}
function drawPrompt(){ return pick(W.motiv) + ' – ' + pick(W.eig) + ' – ' + pick(W.akt); }

/* ---------- 1. Zeichenfläche ---------- */
const TOOLS = [['pen', '✏️', 'Stift'], ['brush', '🖌️', 'Pinsel'], ['neon', '✨', 'Neon'], ['eraser', '🧽', 'Radierer'], ['fill', '🪣', 'Füllen'], ['line', '📏', 'Linie'], ['circle', '⭕', 'Kreis'], ['rect', '⬛', 'Rechteck']];
B.registerGame({
  id: 'draw', name: 'Zeichenfläche', icon: '🎨', cat: 'kreativ', kind: 'tool',
  desc: 'Zeichne mit Stift, Pinsel und Neon-Glow – speichern, teilen, Challenge starten.',
  rules: ['Wähle oben ein Werkzeug und unten Farbe, Größe und Deckkraft.', 'Mit dem Finger direkt auf der Fläche zeichnen – nichts scrollt weg.', 'Füllen färbt eine zusammenhängende Fläche ein.', '↶/↷ macht bis zu 30 Schritte rückgängig.', 'Galerie speichert bis zu 12 Bilder. Ist sie voll, fliegt das älteste raus.', 'Export zeigt dein Bild groß – lange drücken zum Speichern.', '„Idee“ gibt dir ein Motiv und optional 60 Sekunden Zeit.'],
  players: '1', tags: ['alleine', 'drinnen', 'einfach'],
  mount(root, api){
    css(); root.innerHTML = '';
    const timers = [];
    const [sw, sh] = stageSize(root, 430, 260, 560);
    const stage = el('div', { class: 'cr-stage' });
    const toolRow = el('div', { class: 'cr-tools', role: 'toolbar', 'aria-label': 'Werkzeuge' });
    const wrapTop = el('div', { class: 'b-stack tight' }, [toolRow, stage]);
    root.append(wrapTop);
    const pt = Painter(api, stage, sw, sh);
    const st = api.store.get('prefs', {});
    Object.assign(pt.P, { tool: st.tool || 'brush', color: st.color || '#00E5FF', size: st.size || 8, alpha: st.alpha || 1 });
    if(st.bg && BGS.some(b => b.id === st.bg)) pt.initBg(st.bg);
    const savePrefs = () => api.store.set('prefs', { tool: pt.P.tool, color: pt.P.color, size: pt.P.size, alpha: pt.P.alpha, bg: pt.P.bg });

    const tbtns = TOOLS.map(([id, ic, nm]) => el('button', { class: 'cr-tool', 'aria-label': nm, onclick: () => { pt.P.tool = id; api.sound('click'); syncTools(); savePrefs(); } }, [ic, el('small', { text: nm })]));
    toolRow.append(...tbtns);
    const syncTools = () => tbtns.forEach((b, i) => { b.classList.toggle('on', TOOLS[i][0] === pt.P.tool); b.setAttribute('aria-pressed', String(TOOLS[i][0] === pt.P.tool)); });
    syncTools();

    const colors = colorRow(api, pt, COLORS, () => { pt.P.tool = 'brush'; syncTools(); });
    colors.addEventListener('click', () => setTimeout(() => { dotUpd(); savePrefs(); }, 0));
    colors.addEventListener('input', () => { dotUpd(); savePrefs(); });
    const dot = el('i');
    const dotUpd = () => { const s = clamp(pt.P.size, 2, 32); dot.style.width = dot.style.height = s + 'px'; dot.style.background = pt.P.color; dot.style.opacity = pt.P.alpha; dot.style.boxShadow = pt.P.tool === 'neon' ? '0 0 10px ' + pt.P.color : ''; };
    const sz = slider('Größe', 1, 60, pt.P.size, v => v + ' px', v => { pt.P.size = v; dotUpd(); savePrefs(); });
    const op = slider('Deckkraft', 5, 100, Math.round(pt.P.alpha * 100), v => v + ' %', v => { pt.P.alpha = v / 100; dotUpd(); savePrefs(); });
    sz.node.append(el('div', { class: 'cr-dot' }, [dot])); dotUpd();
    tbtns.forEach(b => b.addEventListener('click', dotUpd));

    const act = (ic, nm, fn) => el('button', { class: 'cr-act', 'aria-label': nm, onclick: fn }, [ic, el('small', { text: nm })]);
    const bU = act('↶', 'Zurück', () => { if(pt.undo()) api.sound('flip'); });
    const bR = act('↷', 'Vor', () => { if(pt.redo()) api.sound('flip'); });
    const bC = act('🗑️', 'Leeren', async () => { if(await api.confirm('Alles löschen? (Mit ↶ kannst du es zurückholen.)', 'Leeren', 'Abbrechen')){ pt.clear(); api.sound('capture'); } });
    const bB = act('🖼️', 'Papier', () => bgSheet());
    const bI = act('💡', 'Idee', () => ideaSheet());
    const bS = act('💾', 'Speichern', () => galAdd(api, pt.jpeg()));
    const bG = act('📁', 'Galerie', () => gallery());
    const bE = act('📤', 'Export', () => exportSheet());
    root.append(el('div', { class: 'b-stack tight', style: { marginTop: '10px' } }, [colors, sz.node, op.node, el('div', { class: 'cr-acts' }, [bU, bR, bC, bB, bI, bS, bG, bE])]));
    pt.P.onchange = () => { bU.disabled = !pt.canUndo(); bR.disabled = !pt.canRedo(); savePrefs(); };
    pt.P.onchange();

    function bgSheet(){
      api.sheet(close => {
        const grid = el('div', { class: 'cr-bgs' });
        BGS.forEach(b => {
          const c = el('canvas', { width: 120, height: 120 }); paintBg(c.getContext('2d'), 120, 120, b.id);
          grid.append(el('button', { class: b.id === pt.P.bg ? 'on' : '', onclick: () => { pt.setBg(b.id); api.sound('pop'); savePrefs(); close(); } }, [c, b.name]));
        });
        return el('div', { class: 'b-stack' }, [el('div', { class: 'b-kicker', text: 'Hintergrund' }), el('p', { class: 'b-hint', text: 'Deine Zeichnung bleibt erhalten – der Radierer legt den Hintergrund frei.' }), grid]);
      });
    }
    function exportSheet(){
      const src = pt.png();
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-kicker', text: 'Export' }),
        el('img', { class: 'cr-big', src, alt: 'Deine Zeichnung' }),
        el('p', { class: 'b-hint b-center', text: '👆 Lange auf das Bild drücken → „Bild sichern“ / „In Fotos speichern“.' }),
        el('div', { class: 'b-grid2' }, [
          el('button', { class: 'b-btn ghost', text: 'Schließen', onclick: close }),
          el('button', { class: 'b-btn', text: '💾 Galerie', onclick: () => { galAdd(api, pt.jpeg()); close(); } })
        ])
      ]));
    }
    function gallery(){
      api.sheet(close => {
        const box = el('div', { class: 'b-stack' });
        const render = () => {
          const g = galGet().slice().reverse();
          box.innerHTML = '';
          box.append(el('div', { class: 'b-between' }, [el('div', { class: 'b-kicker', text: 'Galerie · ' + g.length + '/' + GAL_MAX }), el('button', { class: 'b-btn sm', text: '💾 Aktuelles speichern', onclick: () => { galAdd(api, pt.jpeg()); render(); } })]));
          if(!g.length){ box.append(el('p', { class: 'b-hint b-center', style: { padding: '24px 0' }, text: 'Noch leer. Zeichne was und tipp auf „Speichern“!' })); return; }
          box.append(el('div', { class: 'cr-gal' }, g.map(it => el('figure', {}, [
            el('img', { src: it.src, alt: 'Gespeichertes Bild', onclick: () => viewImg(it.src) }),
            el('div', { class: 'b-row' }, [
              el('button', { class: 'b-btn sm ghost', 'aria-label': 'Öffnen', text: '📂', onclick: async () => { if(pt.touched() && !(await api.confirm('Bild öffnen? Die aktuelle Zeichnung wird ersetzt (↶ holt sie zurück).', 'Öffnen'))) return; await pt.load(it.src); api.sound('pop'); api.toast('📂 Geöffnet'); close(); } }),
              el('button', { class: 'b-btn sm ghost', 'aria-label': 'Löschen', text: '🗑️', onclick: async () => { if(await api.confirm('Dieses Bild löschen?', 'Löschen')){ galDel(it.id); api.sound('capture'); gallery(); } } })
            ])
          ]))));
          box.append(el('p', { class: 'b-hint', text: 'Bild antippen = groß ansehen (zum Speichern lange drücken).' }));
        };
        render();
        return box;
      });
    }
    function viewImg(src){
      api.sheet(close => el('div', { class: 'b-stack' }, [el('img', { class: 'cr-big', src, alt: 'Bild' }), el('p', { class: 'b-hint b-center', text: '👆 Lange drücken zum Speichern' }), el('button', { class: 'b-btn ghost block', text: 'Schließen', onclick: close })]));
    }
    function ideaSheet(){
      let idea = drawPrompt();
      api.sheet(close => {
        const t = el('div', { class: 'cr-prompt b-grad b-pop', text: idea });
        return el('div', { class: 'b-stack b-center' }, [
          el('div', { class: 'b-kicker', text: 'Was soll ich zeichnen?' }), t,
          el('button', { class: 'b-btn ghost block', text: '🎲 Andere Idee', onclick: () => { idea = drawPrompt(); t.textContent = idea; t.classList.remove('b-pop'); void t.offsetWidth; t.classList.add('b-pop'); api.sound('flip'); } }),
          el('button', { class: 'b-btn block', text: '⏱️ 60-Sekunden-Challenge', onclick: () => { close(); challenge(idea); } }),
          el('button', { class: 'b-btn ghost block', text: 'Ohne Timer zeichnen', onclick: () => { close(); banner(idea); } })
        ]);
      });
    }
    let bannerEl = null, tick = null, overEl = null;
    function stopChallenge(){ if(tick){ clearInterval(tick); tick = null; } if(bannerEl){ bannerEl.remove(); bannerEl = null; } if(overEl){ overEl.remove(); overEl = null; } pt.P.locked = false; stage.classList.remove('locked'); }
    function banner(text, withTime){
      stopChallenge();
      const time = el('b', { class: 'cr-time', text: withTime ? '1:00' : '' });
      const bar = el('div', { class: 'b-bar' }, [el('i', { style: { width: '100%', transition: 'width .25s linear' } })]);
      bannerEl = el('div', { class: 'cr-banner' }, [
        el('div', { class: 'cr-bt' }, [el('span', { text: '🎯 ' + text }), withTime ? time : null, el('button', { class: 'cr-x', 'aria-label': 'Schließen', text: '✕', onclick: () => { api.sound('click'); stopChallenge(); } })]),
        withTime ? bar : null
      ]);
      stage.append(bannerEl);
      return { time, bar: bar.firstChild };
    }
    function challenge(text){
      const ui = banner(text, true); const t0 = Date.now(), dur = 60000; let lastS = 60;
      api.sound('good');
      tick = setInterval(() => {
        const left = dur - (Date.now() - t0), s = Math.ceil(left / 1000);
        ui.time.textContent = fmtTime(left / 1000); ui.bar.style.width = clamp(left / dur * 100, 0, 100) + '%';
        if(s !== lastS){ lastS = s; if(s <= 10 && s > 0){ api.sound('tick'); ui.time.classList.add('hot'); } }
        if(left <= 0){
          clearInterval(tick); tick = null; pt.P.locked = true; stage.classList.add('locked');
          api.sound('win'); api.vibrate(80);
          overEl = el('div', { class: 'cr-over' }, [
            el('div', { style: { fontSize: '50px' }, text: '⏰' }), el('div', { class: 'b-title b-grad', text: 'Zeit um!' }), el('p', { class: 'b-hint', text: text }),
            el('div', { class: 'b-grid2', style: { width: '100%' } }, [el('button', { class: 'b-btn', text: '💾 Speichern', onclick: () => galAdd(api, pt.jpeg()) }), el('button', { class: 'b-btn cyan', text: '📤 Export', onclick: exportSheet })]),
            el('button', { class: 'b-btn ghost block', text: 'Weiterzeichnen', onclick: () => { api.sound('click'); stopChallenge(); } })
          ]);
          stage.append(overEl);
        }
      }, 200);
      timers.push(() => tick && clearInterval(tick));
    }
    return () => { stopChallenge(); pt.destroy(); timers.forEach(f => f()); };
  }
});

/* ---------- 2. Zeichne das! ---------- */
const DC_TIME = [90, 60, 40];
B.registerGame({
  id: 'draw-challenge', name: 'Zeichne das!', icon: '✏️', cat: 'kreativ', kind: 'game',
  desc: 'Zufälliges Motiv, tickende Uhr – dann bewertest du selbst oder deine Freunde raten.',
  rules: ['Du bekommst ein zufälliges Motiv und ein Zeitlimit (Leicht 90 s, Mittel 60 s, Schwer 40 s).', 'Solo: Danach bewertest du dein Bild ehrlich mit 1–5 Sternen.', 'Freunde: Nur du siehst das Motiv. Danach gibst du das Handy weiter und die anderen tippen eine von 4 Antworten.', 'Schneller fertig = mehr Bonuspunkte.'],
  players: '1-2', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    css();
    let tick = null, pt = null, done = false;
    const stop = () => { if(tick){ clearInterval(tick); tick = null; } if(pt){ pt.destroy(); pt = null; } };
    const menu = () => { stop(); BORED.ui.start(root, api, {
      levels: ['Leicht · 90 s', 'Mittel · 60 s', 'Schwer · 40 s'],
      modes: [{ id: 'solo', label: '🙋 Solo' }, { id: 'freunde', label: '👥 Freunde raten' }],
      bestKey: (l, m) => l + '-' + m, bestLabel: 'Rekord', startLabel: '▶ Motiv ziehen',
      onStart: (l, m) => begin(l, m)
    }); };
    function nextWord(lvl){
      const recent = api.store.get('recent', []);
      const pool = MOT[lvl].filter(x => !recent.includes(x));
      const w = pick(pool.length ? pool : MOT[lvl]);
      api.store.set('recent', [w].concat(recent).slice(0, 25));
      return w;
    }
    function begin(lvl, mode){
      stop(); const word = nextWord(lvl);
      if(mode === 'freunde'){
        root.innerHTML = '';
        const hid = el('div', { class: 'cr-big-word b-grad', text: '• • • • •' });
        let shown = false;
        const go = el('button', { class: 'b-btn block', text: '👁️ Motiv aufdecken', onclick: () => {
          if(!shown){ shown = true; hid.textContent = word; hid.classList.add('b-pop'); api.sound('flip'); go.textContent = '▶ Los, zeichnen!'; return; }
          api.sound('good'); draw(lvl, mode, word);
        } });
        root.append(el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-card glow b-rgb b-center', style: { padding: '28px 16px' } }, [el('div', { style: { fontSize: '52px' }, text: '🤫' }), el('div', { class: 'b-kicker', text: 'Nur der Zeichner schaut!' }), hid, el('p', { class: 'b-hint', text: 'Die anderen schauen weg. Du hast ' + DC_TIME[lvl] + ' Sekunden.' })]),
          go, el('button', { class: 'b-btn ghost block', text: 'Zurück', onclick: menu })
        ]));
      }else draw(lvl, mode, word);
    }
    function draw(lvl, mode, word){
      stop(); root.innerHTML = ''; done = false;
      const dur = DC_TIME[lvl] * 1000;
      const time = el('div', { class: 'cr-timer', text: fmtTime(DC_TIME[lvl]) });
      const bar = el('i', { style: { width: '100%', transition: 'width .25s linear' } });
      const head = el('div', { class: 'b-card', style: { padding: '10px 12px' } }, [
        el('div', { class: 'b-between' }, [el('div', {}, [el('div', { class: 'b-kicker', text: 'Zeichne:' }), el('div', { class: 'b-h', text: word })]), time]),
        el('div', { class: 'b-bar', style: { marginTop: '8px' } }, [bar])
      ]);
      const tools = el('div', { class: 'cr-tools' });
      const stage = el('div', { class: 'cr-stage' });
      root.append(el('div', { class: 'b-stack tight' }, [head, tools, stage]));
      const [sw, sh] = stageSize(root, 410, 240, 520);
      pt = Painter(api, stage, sw, sh); pt.P.tool = 'brush'; pt.P.size = 7; pt.initBg('white');
      const TL = [['pen', '✏️', 'Stift'], ['brush', '🖌️', 'Pinsel'], ['eraser', '🧽', 'Radierer'], ['fill', '🪣', 'Füllen']];
      const tb = TL.map(([id, ic, nm]) => el('button', { class: 'cr-tool', 'aria-label': nm, onclick: () => { pt.P.tool = id; api.sound('click'); sync(); } }, [ic, el('small', { text: nm })]));
      const undoB = el('button', { class: 'cr-tool', 'aria-label': 'Rückgängig', onclick: () => { if(pt.undo()) api.sound('flip'); } }, ['↶', el('small', { text: 'Zurück' })]);
      const sync = () => tb.forEach((b, i) => b.classList.toggle('on', TL[i][0] === pt.P.tool));
      tools.append(...tb, undoB); sync();
      pt.P.color = '#1a1030';
      const cols = colorRow(api, pt, ['#1a1030', '#FF5470', '#FF8A3D', '#FFC93C', '#3DF5A0', '#2EC4B6', '#00E5FF', '#4D7CFF', '#A855F7', '#FF36B8', '#8B5A2B', '#A7A3C9'], () => { pt.P.tool = 'brush'; sync(); });
      const sz = slider('Größe', 2, 40, 7, v => v + ' px', v => { pt.P.size = v; });
      const fin = el('button', { class: 'b-btn block', text: '✅ Fertig', onclick: () => { if(!pt.canUndo()){ api.toast('Zeichne zuerst etwas! ✏️'); api.sound('bad'); return; } end(); } });
      root.append(el('div', { class: 'b-stack tight', style: { marginTop: '8px' } }, [cols, sz.node, fin]));
      const t0 = Date.now(); let lastS = -1;
      tick = setInterval(() => {
        const left = dur - (Date.now() - t0), s = Math.ceil(left / 1000);
        time.textContent = fmtTime(left / 1000); bar.style.width = clamp(left / dur * 100, 0, 100) + '%';
        if(s !== lastS){ lastS = s; if(s <= 10 && s > 0){ api.sound('tick'); time.classList.add('hot'); } }
        if(left <= 0){ api.sound('lose'); api.vibrate(90); api.toast('⏰ Zeit um!'); end(); }
      }, 200);
      function end(){
        if(done) return; done = true;
        const left = Math.max(0, (dur - (Date.now() - t0)) / 1000);
        clearInterval(tick); tick = null; pt.P.locked = true; stage.classList.add('locked');
        const img = pt.png(), small = pt.jpeg(600, .8);
        pt.destroy(); pt = null;
        setTimeout(() => mode === 'freunde' ? pass(lvl, word, img, small, left) : rate(lvl, word, img, small, left), 450);
      }
    }
    function rate(lvl, word, img, small, left){
      root.innerHTML = '';
      const stars = el('div', { class: 'cr-stars', role: 'group', 'aria-label': 'Bewertung' });
      let n = 0;
      const btns = [1, 2, 3, 4, 5].map(i => el('button', { 'aria-label': i + ' Sterne', text: '⭐', onclick: () => { n = i; btns.forEach((b, j) => b.classList.toggle('on', j < i)); api.sound(i >= 3 ? 'pop' : 'tap'); ok.disabled = false; } }));
      stars.append(...btns);
      const ok = el('button', { class: 'b-btn block', text: 'Bewertung abgeben', disabled: true, onclick: () => {
        const score = n * 20 + Math.round(left) + lvl * 10;
        finishRound({ lvl, mode: 'solo', win: n >= 3, score, xp: 8 + n * 5, small, title: ['', 'Naja …', 'Ausbaufähig', 'Passt!', 'Richtig gut!', 'Meisterwerk!'][n], sub: 'Motiv: ' + word + ' · ' + n + '/5 Sterne', lines: [['Sterne', '⭐'.repeat(n)], ['Zeit übrig', Math.round(left) + ' s']] });
      } });
      root.append(el('div', { class: 'b-stack b-pop' }, [
        el('div', { class: 'b-center' }, [el('div', { class: 'b-kicker', text: 'Motiv' }), el('div', { class: 'cr-big-word b-grad', text: word })]),
        el('img', { class: 'cr-big', src: img, alt: 'Deine Zeichnung' }),
        el('p', { class: 'b-h b-center', text: 'Wie gut ist es geworden?' }), stars, ok
      ]));
    }
    function pass(lvl, word, img, small, left){
      root.innerHTML = '';
      root.append(el('div', { class: 'b-stack b-pop' }, [
        el('div', { class: 'b-card glow b-rgb b-center', style: { padding: '34px 16px' } }, [el('div', { style: { fontSize: '60px' }, text: '📱➡️👥' }), el('div', { class: 'b-title b-grad', text: 'Handy weitergeben!' }), el('p', { class: 'b-hint', text: 'Gib das Handy jetzt den Ratenden. Nicht verraten, was es ist!' })]),
        el('button', { class: 'b-btn block', style: { minHeight: '56px' }, text: '🤔 Wir sind bereit zum Raten', onclick: () => { api.sound('good'); guess(lvl, word, img, small, left); } })
      ]));
    }
    function guess(lvl, word, img, small, left){
      root.innerHTML = '';
      const opts = api.shuffle([word].concat(api.shuffle(MOT[lvl].filter(x => x !== word)).slice(0, 3)));
      let locked = false;
      const ans = el('div', { class: 'cr-ans' });
      const bs = opts.map(o => el('button', { text: o, onclick: () => {
        if(locked) return; locked = true; const right = o === word;
        bs.forEach(b => { if(b.textContent === word) b.classList.add('ok'); });
        if(!right) { const me = bs[opts.indexOf(o)]; me.classList.add('bad', 'b-shake'); }
        api.sound(right ? 'good' : 'bad'); api.vibrate(right ? 30 : 120);
        setTimeout(() => finishRound({ lvl, mode: 'freunde', win: right, score: right ? 60 + Math.round(left * 2) + lvl * 25 : 0, xp: right ? 22 : 10, small, title: right ? 'Erraten! 🎉' : 'Daneben!', sub: 'Es war: ' + word + (right ? '' : ' · Getippt: ' + o), lines: [['Ergebnis', right ? '✅ Richtig' : '❌ Falsch'], ['Zeit übrig', Math.round(left) + ' s']] }), 1300);
      } }));
      ans.append(...bs);
      root.append(el('div', { class: 'b-stack b-pop' }, [el('div', { class: 'b-kicker b-center', text: 'Was wurde hier gezeichnet?' }), el('img', { class: 'cr-big', src: img, alt: 'Zeichnung zum Raten' }), ans]));
    }
    function finishRound(o){
      const key = o.lvl + '-' + o.mode;
      const rep = api.reportScore(o.score, key);
      api.finish({ win: o.win, score: o.score, difficulty: o.lvl, xp: o.xp });
      if(o.win) api.sound('win'); else api.sound('lose');
      BORED.ui.result(root, api, { win: o.win, title: o.title, sub: o.sub, emoji: o.win ? '🎨' : '🙈', lines: o.lines.concat([['Punkte', o.score], ['Rekord', rep.best]]), onAgain: () => begin(o.lvl, o.mode), onMenu: menu, againLabel: 'Nächstes Motiv' });
      const stack = root.querySelector('.b-stack');
      if(stack){ const sv = el('button', { class: 'b-btn ghost block', text: '💾 In Galerie speichern', onclick: () => { galAdd(api, o.small); sv.disabled = true; } }); stack.insertBefore(sv, stack.children[2] || null); }
    }
    menu();
    return stop;
  }
});

/* ---------- 3. Zufallsgeneratoren ---------- */
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const F = (label, pool) => ({ label, gen: () => pick(pool) });
const leet = s => s.replace(/[aeiost]/gi, c => ({ a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' }[c.toLowerCase()] || c));
const NG = {
  fantasy: () => { const n = pick(W.fa1) + pick(W.fa2) + pick(W.fa3); return Math.random() < .4 ? n + ' ' + pick(W.faEp) : n; },
  scifi: () => { const n = pick(W.sf1) + pick(W.sf2), d = pick(W.sfD); return Math.random() < .25 ? n + ' ' + cap(pick(W.sf1).toLowerCase() + pick(W.sf2)) : (d[0] === '-' ? n + d : n + ' ' + d); },
  gamer: () => {
    const a = pick(W.gAdj), n = pick(W.gNoun), num = Math.floor(Math.random() * 99) + 1, r = Math.random();
    if(r < .22) return a + n + num;
    if(r < .36) return 'xX_' + a + n + '_Xx';
    if(r < .5) return a + '_' + n;
    if(r < .62) return 'Not' + a + n;
    if(r < .74) return leet(a + n);
    if(r < .86) return n + pick(['TTV', 'YT', 'HD', 'Pro', 'GG', 'OP', 'Main']);
    return 'The' + a + n + pick(['', '', '69', '420', '007', '2k', 'XD']);
  },
  team: () => {
    const r = Math.random();
    if(r < .6) return 'Die ' + cap(pick(W.tAdj)) + ' ' + pick(W.tNoun);
    if(r < .75) return 'FC ' + pick(W.gAdj) + ' ' + pick(W.gNoun) + 's';
    if(r < .9) return 'Team ' + pick(W.gNoun) + pick(['', ' United', ' Esports', ' Squad', ' Gang', ' Crew']);
    return pick(W.gAdj) + ' ' + pick(W.gNoun) + ' Clan';
  }
};
const NSUB = [['fantasy', '🧝 Fantasy'], ['scifi', '🚀 Sci-Fi'], ['gamer', '🎮 Gamer-Tags'], ['team', '🏆 Teamnamen']];
const NAI = { fantasy: 'Erfinde 5 klangvolle Fantasy-Namen mit je einem kurzen Beinamen.', scifi: 'Erfinde 5 coole Sci-Fi-Namen für Figuren oder Raumschiffe.', gamer: 'Erfinde 5 witzige, originelle Gamer-Tags (ohne Leerzeichen).', team: 'Erfinde 5 lustige Teamnamen für eine Freundesgruppe.' };
const qGen = () => { const r = Math.random(); if(r < .45) return pick(W.frage); if(r < .75) return 'Was wäre, wenn ' + pick(W.wenn) + '?'; return 'Was würdest du als Erstes tun, wenn ' + pick(W.wenn) + '?'; };

const GENS = [
  { id: 'zeichnen', name: 'Was zeichnen?', icon: '🎨', fields: () => [F('Motiv', W.motiv), F('Eigenschaft', W.eig), F('Macht gerade', W.akt), F('Stil', W.stil)], ai: 'Gib mir eine originelle, lustige Zeichenidee: Motiv, Eigenschaft, Situation und Stil in 1–2 Sätzen.' },
  { id: 'story', name: 'Geschichten-Starter', icon: '📖', fields: () => [F('Wer', W.wer), F('Wo', W.wo), F('Was passiert', W.was), F('Twist', W.twist)], ai: 'Schreib den Anfang einer spannenden Kurzgeschichte in 3 Sätzen, der sofort neugierig macht.' },
  { id: 'char', name: 'Charakter', icon: '🧙', fields: () => [{ label: 'Name', gen: () => pick(W.vor) + ' ' + pick(W.nach) }, F('Klasse', W.klasse), F('Fähigkeit', W.faeh), F('Schwäche', W.schw), F('Geheimnis', W.geh), F('Aussehen', W.look)], ai: 'Erfinde einen originellen Spiel-Charakter mit Name, Klasse, Fähigkeit, Schwäche, Geheimnis und Aussehen (je eine kurze Zeile).' },
  { id: 'names', name: 'Namen', icon: '🏷️', subs: NSUB, fields: sub => [1, 2, 3, 4, 5].map(i => ({ label: NSUB.find(s => s[0] === sub)[1].replace(/^\S+\s/, '') + ' #' + i, gen: NG[sub] })), ai: sub => NAI[sub] },
  { id: 'orte', name: 'Orte', icon: '🗺️', fields: () => [F('Ort', W.ort), F('Lage', W.lage), F('Besonderheit', W.bes), F('Gefahr', W.gef), F('Bewohner', W.bew)], ai: 'Erfinde einen magischen oder futuristischen Ort für ein Spiel oder eine Geschichte: Name, Lage, Besonderheit, Gefahr.' },
  { id: 'spiel', name: 'Spielideen', icon: '🎮', fields: () => [F('Genre', W.genre), F('Setting', W.setting), F('Twist', W.gtwist), F('Mechanik', W.mech)], ai: 'Erfinde eine originelle Videospiel-Idee mit Genre, Setting, Twist und Kernmechanik – als kurzer Pitch.' },
  { id: 'farben', name: 'Farbpalette', icon: '🌈', special: 'palette' },
  { id: 'rad', name: 'Entscheidungs-Rad', icon: '🎡', special: 'wheel' },
  { id: 'eo', name: 'Entweder-oder', icon: '⚖️', special: 'either' },
  { id: 'fragen', name: 'Zufallsfragen', icon: '💬', fields: () => [{ label: 'Gesprächsstarter', gen: qGen }], ai: 'Stell mir eine überraschende, lustige Frage als Gesprächsstarter für Jugendliche.' },
  { id: 'schreib', name: 'Schreibaufgabe', icon: '✍️', fields: () => [F('Aufgabe', W.form), F('Thema', W.thema), F('Regel', W.regel)], ai: 'Gib mir eine kreative Schreibaufgabe mit Thema und einer witzigen Einschränkung.' },
  { id: 'foto', name: 'Foto-Challenge', icon: '📸', fields: () => [F('Fotografiere', W.fmot), F('Wie', W.fbed), F('Bonus', W.fbon)], ai: 'Gib mir eine kreative Handy-Foto-Challenge, die man sofort zu Hause oder draußen machen kann.' },
  { id: 'wuerfel', name: 'Würfel & Münze', icon: '🎲', special: 'dice' }
];

/* Farbpalette */
const HARM = {
  'Analog': h => [[h - 40, 70, 32], [h - 20, 75, 45], [h, 80, 55], [h + 20, 75, 66], [h + 40, 65, 78]],
  'Komplementär': h => [[h, 75, 28], [h, 80, 48], [h, 55, 80], [h + 180, 80, 55], [h + 180, 70, 34]],
  'Triadisch': h => [[h, 80, 50], [h + 120, 72, 50], [h + 240, 72, 52], [h, 55, 82], [h + 120, 60, 24]],
  'Split-Komplementär': h => [[h, 80, 48], [h + 150, 75, 52], [h + 210, 75, 52], [h, 50, 84], [h, 70, 24]],
  'Monochrom': h => [[h, 70, 16], [h, 72, 30], [h, 75, 46], [h, 70, 63], [h, 65, 82]],
  'Tetradisch': h => [[h, 78, 50], [h + 90, 70, 52], [h + 180, 78, 50], [h + 270, 70, 52], [h, 35, 88]],
  'Neon-Pop': h => [[h, 100, 56], [h + 60, 100, 55], [h + 180, 100, 50], [h + 240, 100, 62], [h + 200, 60, 9]]
};
function palInst(out, api){
  let st = api.store.get('pal', null);
  let cols = Array.isArray(st && st.cols) && st.cols.length === 5 ? st.cols : [[275, 80, 30], [290, 85, 48], [320, 90, 60], [190, 95, 50], [200, 60, 12]].map(([h, s, l]) => ({ h, s, l, lock: false }));
  let mode = (st && st.mode) || 'Neon-Pop';
  const modeEl = el('div', { class: 'b-pill cyan', text: mode });
  const pal = el('div', { class: 'cr-pal' });
  const hex = c => hslHex(c.h, c.s, c.l);
  const items = cols.map((c, i) => {
    const hx = el('button', { class: 'hx', 'aria-label': 'Hex kopieren', onclick: () => copyText(api, hex(cols[i])) });
    const tap = el('button', { class: 'tap', 'aria-label': 'Farbe kopieren', onclick: () => copyText(api, hex(cols[i])) });
    const lk = el('button', { class: 'lk', 'aria-label': 'Farbe sperren', onclick: () => { cols[i].lock = !cols[i].lock; api.sound(cols[i].lock ? 'check' : 'tap'); paint(); save(); } });
    const sw = el('div', { class: 'cr-swc' }, [tap, hx, lk]);
    pal.append(sw); return { sw, hx, lk };
  });
  const paint = () => items.forEach((it, i) => { const c = cols[i], hc = hex(c); it.sw.style.backgroundColor = hc; it.hx.textContent = hc; it.lk.textContent = c.lock ? '🔒' : '🔓'; it.sw.classList.toggle('locked', !!c.lock); });
  const save = () => api.store.set('pal', { cols, mode });
  out.append(el('div', { class: 'b-stack tight' }, [el('div', { class: 'b-between' }, [el('span', { class: 'b-label', style: { margin: 0 }, text: 'Harmonie' }), modeEl]), pal, el('p', { class: 'b-hint', text: 'Farbe antippen = Hex-Wert kopieren · 🔒 = Farbe bleibt beim nächsten Wurf.' })]));
  paint();
  return {
    generate(done, h){
      mode = pick(Object.keys(HARM));
      const lockI = cols.findIndex(c => c.lock);
      const base = lockI >= 0 ? cols[lockI].h : Math.random() * 360;
      const tgt = HARM[mode](base).map(([hh, s, l]) => ({ h: Math.round(((hh % 360) + 360) % 360), s: clamp(Math.round(s + rnd(-6, 6)), 20, 100), l: clamp(Math.round(l + rnd(-5, 5)), 6, 94), lock: false }));
      const iv = h.iv(() => { items.forEach((it, i) => { if(!cols[i].lock) it.sw.style.backgroundColor = hslHex(Math.random() * 360, 80, 55); }); api.sound('tick'); }, 80);
      h.later(() => {
        h.clear(iv);
        cols = cols.map((c, i) => c.lock ? c : tgt[i]);
        modeEl.textContent = mode; paint(); save(); api.sound('pop'); done();
      }, 600);
    },
    text: () => 'Farbpalette (' + mode + '): ' + cols.map(hex).join(' '),
    aiPrompt: () => 'Gib dieser Farbpalette einen kreativen Namen und beschreib in 2 Sätzen, wofür sie gut passt (Spiel, Poster, Zimmer …): ' + cols.map(hex).join(', ') + '.'
  };
}

/* Entscheidungs-Rad */
const WCOL = ['#A855F7', '#00E5FF', '#FF36B8', '#3DF5A0', '#FFC93C', '#4D7CFF', '#FF8A3D', '#2EC4B6'];
function wheelInst(out, api, h){
  let opts = api.store.get('wheel', null);
  if(!Array.isArray(opts) || opts.length < 2) opts = ['Pizza', 'Döner', 'Burger', 'Sushi', 'Nudeln', 'Kebab-Box'];
  const S = 300, dpr = Math.min(2, window.devicePixelRatio || 1);
  const cv = el('canvas', { class: 'cr-wheel', width: S * dpr, height: S * dpr, 'aria-label': 'Glücksrad' });
  const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  let rot = 0, spinning = false, flick = 0, result = '';
  const res = el('div', { class: 'cr-res', text: 'Dreh das Rad! 🎡' });
  const inp = el('input', { class: 'b-input', placeholder: 'Neue Option eingeben …', maxlength: 28, 'aria-label': 'Neue Option' });
  const list = el('div', { class: 'cr-opts' });
  const addB = el('button', { class: 'b-btn sm', text: '＋', 'aria-label': 'Option hinzufügen', style: { minWidth: '48px', minHeight: '46px' } });
  const add = () => {
    const v = inp.value.trim(); if(!v) return;
    if(opts.length >= 16){ api.toast('Max. 16 Optionen'); return; }
    opts.push(v); inp.value = ''; api.sound('pop'); save(); renderList(); draw();
  };
  addB.onclick = add; inp.addEventListener('keydown', e => { if(e.key === 'Enter') add(); });
  const save = () => api.store.set('wheel', opts);
  function renderList(){
    list.innerHTML = '';
    opts.forEach((o, i) => list.append(el('span', { class: 'cr-opt' }, [el('span', { text: o }), el('button', { 'aria-label': o + ' entfernen', text: '✕', onclick: () => { if(spinning) return; if(opts.length <= 2){ api.toast('Mindestens 2 Optionen'); return; } opts.splice(i, 1); api.sound('tap'); save(); renderList(); draw(); } })])));
  }
  const idxAt = r => { const n = opts.length, seg = Math.PI * 2 / n; const a = (((-Math.PI / 2 - r) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); return Math.floor(a / seg) % n; };
  function draw(){
    const n = opts.length, seg = Math.PI * 2 / n, c = S / 2, R = c - 12;
    x.clearRect(0, 0, S, S);
    x.save(); x.shadowColor = 'rgba(168,85,247,.8)'; x.shadowBlur = 18; x.beginPath(); x.arc(c, c, R + 4, 0, 6.2832); x.fillStyle = '#17102B'; x.fill(); x.restore();
    const hi = spinning ? -1 : idxAt(rot);
    for(let i = 0; i < n; i++){
      const a0 = rot + i * seg, col = WCOL[i % WCOL.length];
      x.beginPath(); x.moveTo(c, c); x.arc(c, c, R, a0, a0 + seg); x.closePath();
      x.fillStyle = col; x.globalAlpha = hi === -1 || hi === i || !result ? 1 : .55; x.fill(); x.globalAlpha = 1;
      x.strokeStyle = 'rgba(8,8,18,.55)'; x.lineWidth = 2; x.stroke();
      x.save(); x.translate(c, c); x.rotate(a0 + seg / 2);
      x.fillStyle = ['#00E5FF', '#3DF5A0', '#FFC93C', '#2EC4B6'].includes(col) ? '#0b0b16' : '#ffffff';
      x.font = '700 ' + (n > 10 ? 12 : 15) + 'px ' + getComputedStyle(document.body).fontFamily;
      x.textBaseline = 'middle';
      let t = opts[i]; const maxW = R - 38;
      while(x.measureText(t).width > maxW && t.length > 2) t = t.slice(0, -2) + '…';
      const mid = (((a0 + seg / 2) % 6.2832) + 6.2832) % 6.2832;
      if(mid > Math.PI / 2 && mid < Math.PI * 1.5){ x.rotate(Math.PI); x.textAlign = 'left'; x.fillText(t, -(R - 12), 0); }
      else{ x.textAlign = 'right'; x.fillText(t, R - 12, 0); }
      x.restore();
    }
    x.beginPath(); x.arc(c, c, R, 0, 6.2832); x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 3; x.stroke();
    const g = x.createRadialGradient(c - 6, c - 6, 2, c, c, 26); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#A855F7');
    x.beginPath(); x.arc(c, c, 24, 0, 6.2832); x.fillStyle = g; x.fill(); x.strokeStyle = '#17102B'; x.lineWidth = 3; x.stroke();
    // Zeiger oben
    x.save(); x.translate(c, 6); x.rotate(-flick * .45);
    x.shadowColor = 'rgba(0,229,255,.9)'; x.shadowBlur = 12;
    x.beginPath(); x.moveTo(-13, 0); x.lineTo(13, 0); x.lineTo(0, 30); x.closePath(); x.fillStyle = '#F5F5FF'; x.fill();
    x.restore();
  }
  out.append(el('div', { class: 'cr-wheelbox' }, [cv, res]), el('div', { class: 'b-stack tight', style: { marginTop: '10px' } }, [el('div', { class: 'b-row' }, [el('div', { class: 'grow' }, [inp]), addB]), list]));
  renderList(); draw();
  return {
    auto: false,
    generate(done){
      if(opts.length < 2){ api.toast('Mindestens 2 Optionen'); done(); return; }
      spinning = true; result = ''; res.textContent = '…'; inp.disabled = true;
      const start = rot, total = Math.PI * 2 * rnd(5, 7.5) + rnd(0, Math.PI * 2), dur = rnd(4300, 5600), t0 = performance.now();
      let last = idxAt(rot);
      const step = now => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        rot = start + total * e;
        const i = idxAt(rot);
        if(i !== last){ last = i; flick = 1; api.sound('tick'); }
        flick *= .82; draw();
        if(p < 1){ h.raf(step); return; }
        spinning = false; inp.disabled = false; rot = rot % (Math.PI * 2); flick = 0;
        result = opts[idxAt(rot)]; draw();
        res.textContent = '🎉 ' + result; res.classList.remove('b-pop'); void res.offsetWidth; res.classList.add('b-pop');
        api.sound('win'); api.vibrate(40); done();
      };
      h.raf(step);
    },
    text: () => result ? 'Das Rad hat entschieden: ' + result + ' (aus: ' + opts.join(', ') + ')' : '',
    aiPrompt: () => 'Schlag 6 neue, kurze Optionen (je max. 3 Wörter) für ein Entscheidungs-Glücksrad vor, passend zu: ' + opts.join(', ') + '. Eine Option pro Zeile, ohne Nummern, ohne weitere Worte.',
    onAi(text){
      const items = text.split(/\n|,/).map(s => s.replace(/^[\s\-*•\d.)]+/, '').trim()).filter(s => s && s.length <= 28).slice(0, 10);
      if(items.length < 2) return null;
      return el('button', { class: 'b-btn sm block', style: { marginTop: '10px' }, text: '🎡 Aufs Rad übernehmen', onclick: e => { if(spinning) return; opts = items; save(); renderList(); result = ''; draw(); res.textContent = 'Neue Optionen – dreh!'; api.sound('pop'); e.currentTarget.disabled = true; } });
    }
  };
}

/* Entweder-oder */
function eitherInst(out, api, h){
  let a = '', b = '', chosen = '';
  const verdict = el('p', { class: 'b-hint b-center', text: 'Tippe auf „Generieren“.' });
  const choose = (me, other, txt) => { if(!a) return; chosen = txt; me.classList.add('pick'); me.classList.remove('no'); other.classList.add('no'); other.classList.remove('pick'); api.sound('pop'); verdict.textContent = 'Du würdest lieber ' + txt + '.'; };
  const A = el('button', { class: 'a', onclick: () => choose(A, Bt, a) });
  const Bt = el('button', { class: 'b', onclick: () => choose(Bt, A, b) });
  out.append(el('div', { class: 'b-kicker b-center', style: { marginBottom: '10px' }, text: 'Würdest du lieber …' }), el('div', { class: 'cr-vs' }, [A, el('div', { class: 'or', text: '– ODER –' }), Bt]), el('div', { style: { marginTop: '10px' } }, [verdict]));
  return {
    generate(done){
      chosen = ''; [A, Bt].forEach(x => x.classList.remove('pick', 'no'));
      const p = api.shuffle(W.eo); const na = p[0], nb = p[1];
      const iv = h.iv(() => { A.textContent = pick(W.eo); Bt.textContent = pick(W.eo); api.sound('tick'); }, 75);
      h.later(() => { h.clear(iv); a = na; A.textContent = a; A.classList.add('b-pop'); api.sound('pop'); }, 450);
      h.later(() => { b = nb; Bt.textContent = b; Bt.classList.add('b-pop'); api.sound('pop'); verdict.textContent = 'Tippe auf deine Wahl.'; setTimeout(() => [A, Bt].forEach(x => x.classList.remove('b-pop')), 400); done(); }, 700);
      // zweite Hälfte dreht noch etwas länger
      const iv2 = h.iv(() => { if(!b || Bt.textContent !== b) Bt.textContent = pick(W.eo); }, 75);
      h.later(() => h.clear(iv2), 690);
      b = '';
    },
    text: () => a && b ? 'Würdest du lieber ' + a + ' oder ' + b + '?' + (chosen ? ' → ' + chosen : '') : '',
    aiPrompt: () => 'Erfinde eine lustige, knifflige „Würdest du lieber …?“-Frage mit genau zwei Optionen.'
  };
}

/* Würfel & Münze */
const DSUB = [['coin', '🪙 Münze'], ['d6x1', '🎲 1 W6'], ['d6x2', '🎲 2 W6'], ['d6x3', '🎲 3 W6'], ['d4', 'W4'], ['d8', 'W8'], ['d10', 'W10'], ['d12', 'W12'], ['d20', 'W20'], ['d100', 'W100']];
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function diceInst(out, api, h){
  let sub = api.store.get('dsub', 'd6x1'); if(!DSUB.some(d => d[0] === sub)) sub = 'd6x1';
  let coinDeg = 0, last = '', hist = [];
  const chips = el('div', { class: 'cr-sub' });
  const stage = el('div', { class: 'cr-dice' });
  const res = el('div', { class: 'cr-res', text: '' });
  const histEl = el('p', { class: 'b-hint b-center' });
  let coin = null, coinW = null, dice = [];
  const face = (d, v) => d.querySelectorAll('i').forEach((p, i) => p.classList.toggle('v', PIPS[v].includes(i)));
  function renderChips(){ chips.innerHTML = ''; DSUB.forEach(([id, lb]) => chips.append(el('button', { class: 'b-chip', 'aria-pressed': String(id === sub), text: lb, onclick: () => { sub = id; api.store.set('dsub', id); api.sound('click'); renderChips(); build(); } }))); }
  function build(){
    stage.innerHTML = ''; dice = []; res.textContent = 'Tippe auf „Generieren“'; last = '';
    if(sub === 'coin'){
      coin = el('div', { class: 'cr-coin', style: { transform: 'rotateY(' + coinDeg + 'deg)' } }, [el('div', {}, [el('b', { text: '👑' }), 'KOPF']), el('div', { class: 'back' }, [el('b', { text: '1' }), 'ZAHL'])]);
      coinW = el('div', { class: 'cr-coinw' }, [coin]); stage.append(coinW);
    }else if(sub.startsWith('d6x')){
      const n = +sub.slice(3);
      for(let k = 0; k < n; k++){ const d = el('div', { class: 'cr-die' }, Array.from({ length: 9 }, () => el('i'))); face(d, k + 1); dice.push(d); stage.append(d); }
    }else{ const d = el('div', { class: 'cr-poly', text: sub.slice(1) }); dice.push(d); stage.append(d); }
  }
  out.append(el('div', { class: 'b-stack' }, [chips, stage, res, histEl]));
  renderChips(); build();
  const pushHist = r => { hist.unshift(r); hist = hist.slice(0, 10); histEl.textContent = 'Verlauf: ' + hist.join(' · '); };
  return {
    generate(done){
      if(sub === 'coin'){
        const r = Math.random() < .5 ? 'Kopf' : 'Zahl', want = r === 'Kopf' ? 0 : 180, curA = ((coinDeg % 360) + 360) % 360;
        coinDeg += 1800 + ((want - curA + 360) % 360);
        coinW.classList.remove('toss'); void coinW.offsetWidth; coinW.classList.add('toss');
        coin.style.transform = 'rotateY(' + coinDeg + 'deg)'; res.textContent = '…';
        [0, 250, 500, 750, 1000].forEach(t => h.later(() => api.sound('flip'), t));
        h.later(() => { last = r; res.textContent = r === 'Kopf' ? '👑 Kopf!' : '1️⃣ Zahl!'; res.classList.remove('b-pop'); void res.offsetWidth; res.classList.add('b-pop'); api.sound('good'); api.vibrate(30); pushHist(r); done(); }, 1350);
        return;
      }
      const sides = sub.startsWith('d6x') ? 6 : +sub.slice(1);
      const vals = dice.map(() => 1 + Math.floor(Math.random() * sides));
      dice.forEach(d => { d.classList.remove('cr-roll'); void d.offsetWidth; d.classList.add('cr-roll'); });
      res.textContent = '…';
      const iv = h.iv(() => { dice.forEach(d => sides === 6 && d.classList.contains('cr-die') ? face(d, 1 + Math.floor(Math.random() * 6)) : (d.textContent = 1 + Math.floor(Math.random() * sides))); api.sound('tick'); }, 70);
      h.later(() => {
        h.clear(iv);
        dice.forEach((d, i) => d.classList.contains('cr-die') ? face(d, vals[i]) : (d.textContent = vals[i]));
        const sum = vals.reduce((a, b) => a + b, 0);
        last = vals.length > 1 ? vals.join(' + ') + ' = ' + sum : String(sum);
        res.textContent = (vals.length > 1 ? '' : '🎲 ') + last;
        if(sides === 20 && sum === 20) { res.textContent += ' 💥 KRIT!'; api.confetti(); }
        res.classList.remove('b-pop'); void res.offsetWidth; res.classList.add('b-pop');
        api.sound('capture'); api.vibrate(25); pushHist(vals.length > 1 ? String(sum) : last); done();
      }, 720);
    },
    text: () => last ? (sub === 'coin' ? 'Münzwurf: ' + last : DSUB.find(d => d[0] === sub)[1].replace(/^\S+\s/, '') + ': ' + last) : '',
    aiPrompt: () => 'Erfinde ein kurzes, lustiges Würfelspiel für 2–4 Leute, das man nur mit 1–2 Würfeln spielen kann. Regeln in 3 Sätzen.'
  };
}
const SPECIAL = { palette: palInst, wheel: wheelInst, either: eitherInst, dice: diceInst };

B.registerGame({
  id: 'generators', name: 'Zufallsgeneratoren', icon: '🎲', cat: 'kreativ', kind: 'tool',
  desc: 'Ideen auf Knopfdruck: Zeichnen, Storys, Charaktere, Namen, Farben, Glücksrad, Würfel und mehr.',
  rules: ['Oben einen Generator wählen, dann „Generieren“ drücken.', '⭐ speichert das Ergebnis in deinen Favoriten, 📋 kopiert es.', 'Farbpalette: Farbe antippen kopiert den Hex-Wert, 🔒 sperrt eine Farbe.', 'Entscheidungs-Rad: eigene Optionen eintragen und drehen lassen.', 'Wenn KI verfügbar ist, gibt es pro Generator „Mit KI generieren“.'],
  players: '1', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api0){
    css(); root.innerHTML = '';
    // Beim ersten automatischen Würfeln (ohne Fingertipp) stumm bleiben
    let muted = true;
    const api = Object.assign({}, api0, { sound: n => { if(!muted) api0.sound(n); } });
    root.addEventListener('pointerdown', () => { muted = false; }, { capture: true });
    const ivs = new Set(), tos = new Set(); let rafId = 0, alive = true;
    const H = {
      iv(fn, ms){ const i = setInterval(fn, ms); ivs.add(i); return i; },
      clear(i){ clearInterval(i); ivs.delete(i); },
      later(fn, ms){ const t = setTimeout(() => { tos.delete(t); if(alive) fn(); }, ms); tos.add(t); return t; },
      raf(fn){ rafId = requestAnimationFrame(t => { if(alive) fn(t); }); }
    };
    const stopAll = () => { ivs.forEach(i => clearInterval(i)); ivs.clear(); tos.forEach(t => clearTimeout(t)); tos.clear(); cancelAnimationFrame(rafId); };
    let cur = api.store.get('last', 'zeichnen'); if(!GENS.some(g => g.id === cur)) cur = 'zeichnen';
    let inst = null, busy = false, sample = null, curText = '';
    const chips = el('div', { class: 'cr-gchips', role: 'tablist', 'aria-label': 'Generatoren' });
    const title = el('div', { class: 'b-h' });
    const subBox = el('div', { class: 'cr-sub' });
    const out = el('div', {});
    const card = el('div', { class: 'b-card glow' }, [el('div', { class: 'b-stack tight' }, [title, subBox, out])]);
    const genBtn = el('button', { class: 'b-btn grow', style: { minHeight: '56px', fontSize: '19px' }, text: '🎰 Generieren' });
    const favBtn = el('button', { class: 'b-btn ghost', style: { minWidth: '56px', minHeight: '56px' }, 'aria-label': 'Zu Favoriten', text: '⭐' });
    const cpBtn = el('button', { class: 'b-btn ghost', style: { minWidth: '56px', minHeight: '56px' }, 'aria-label': 'Kopieren', text: '📋' });
    const aiBtn = el('button', { class: 'b-btn cyan block cr-hide', text: '✨ Mit KI generieren' });
    const aiOut = el('div', { class: 'cr-ai' });
    const aiExtra = el('div', {});
    const aiCard = el('div', { class: 'b-card cr-hide' }, [el('div', { class: 'b-kicker', style: { marginBottom: '6px' }, text: '✨ KI-Idee' }), aiOut, aiExtra]);
    const favList = el('button', { class: 'b-btn ghost block' });
    root.append(el('div', { class: 'b-stack' }, [chips, card, el('div', { class: 'b-row' }, [genBtn, favBtn, cpBtn]), aiBtn, aiCard, favList]));

    const favs = () => api.store.get('favs', []);
    const updFav = () => { favList.textContent = '⭐ Favoriten (' + favs().length + ')'; };
    updFav();
    GENS.forEach(g => chips.append(el('button', { class: 'b-chip', role: 'tab', 'data-g': g.id, text: g.icon + ' ' + g.name, onclick: () => { if(cur !== g.id){ api.sound('click'); select(g.id, true); } } })));

    function select(id, auto){
      stopAll(); busy = false; genBtn.disabled = false;
      cur = id; api.store.set('last', id);
      const g = GENS.find(x => x.id === id);
      chips.querySelectorAll('.b-chip').forEach(c => { const on = c.dataset.g === id; c.setAttribute('aria-pressed', String(on)); c.setAttribute('aria-selected', String(on)); if(on && c.scrollIntoView) try{ c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }catch(e){} });
      title.textContent = g.icon + ' ' + g.name;
      aiCard.classList.add('cr-hide'); curText = '';
      genBtn.textContent = g.special === 'wheel' ? '🎡 Drehen!' : g.special === 'dice' ? '🎲 Werfen!' : '🎰 Generieren';
      subBox.innerHTML = ''; subBox.classList.toggle('cr-hide', !g.subs);
      let sub = null;
      if(g.subs){
        sub = api.store.get('sub.' + id, g.subs[0][0]);
        if(!g.subs.some(s => s[0] === sub)) sub = g.subs[0][0];
        g.subs.forEach(([sid, lb]) => subBox.append(el('button', { class: 'b-chip', 'aria-pressed': String(sid === sub), text: lb, onclick: () => { api.store.set('sub.' + id, sid); api.sound('click'); select(id, true); } })));
      }
      out.innerHTML = ''; out.className = '';
      inst = g.special ? SPECIAL[g.special](out, api, H) : stdInst(g, sub);
      inst.ai = inst.aiPrompt || (() => typeof g.ai === 'function' ? g.ai(sub) : g.ai);
      if(auto && g.special !== 'wheel' && g.special !== 'dice') run(true);
    }
    function stdInst(g, sub){
      const fields = g.fields(sub);
      const reels = fields.map(f => { const b = el('b', { text: '—' }); const r = el('div', { class: 'cr-reel' }, [el('small', { text: f.label }), b]); out.append(r); return { r, b, f }; });
      out.className = 'cr-reels';
      let vals = [];
      return {
        generate(done){
          const finals = fields.map(f => f.gen());
          const tk = H.iv(() => api.sound('tick'), 110);
          reels.forEach(({ r, b, f }, i) => {
            r.classList.remove('stop'); r.classList.add('spin');
            const iv = H.iv(() => { b.textContent = f.gen(); }, 65);
            H.later(() => {
              H.clear(iv); b.textContent = finals[i]; r.classList.remove('spin'); void r.offsetWidth; r.classList.add('stop'); api.sound('pop');
              if(i === reels.length - 1){ H.clear(tk); vals = finals; done(); }
            }, 380 + i * 230);
          });
        },
        text: () => vals.length ? g.icon + ' ' + g.name + '\n' + fields.map((f, i) => f.label + ': ' + vals[i]).join('\n') : ''
      };
    }
    function run(quiet){
      if(busy || !inst) return;
      busy = true; genBtn.disabled = true; aiCard.classList.add('cr-hide');
      if(!quiet) api.sound('click');
      inst.generate(() => { busy = false; genBtn.disabled = false; curText = inst.text(); }, H);
    }
    genBtn.onclick = () => run(false);
    cpBtn.onclick = () => { const t = curText || (inst && inst.text()); if(!t){ api.toast('Erst generieren!'); return; } copyText(api, t); };
    favBtn.onclick = () => {
      const t = curText || (inst && inst.text()); if(!t){ api.toast('Erst generieren!'); return; }
      const f = favs(); if(f.some(x => x.text === t)){ api.toast('Ist schon in deinen Favoriten ⭐'); return; }
      const g = GENS.find(x => x.id === cur);
      f.unshift({ g: g.icon + ' ' + g.name, text: t, t: Date.now() }); api.store.set('favs', f.slice(0, 100));
      api.sound('good'); api.toast('⭐ Zu Favoriten hinzugefügt'); favBtn.classList.remove('b-pop'); void favBtn.offsetWidth; favBtn.classList.add('b-pop'); updFav();
    };
    favList.onclick = () => {
      api.sheet(close => {
        const box = el('div', { class: 'b-stack' });
        const render = () => {
          const f = favs(); box.innerHTML = '';
          box.append(el('div', { class: 'b-kicker', text: '⭐ Favoriten · ' + f.length }));
          if(!f.length){ box.append(el('p', { class: 'b-hint b-center', style: { padding: '20px 0' }, text: 'Noch nichts gespeichert. Tipp nach dem Generieren auf ⭐.' })); }
          f.forEach(it => box.append(el('div', { class: 'cr-fav' }, [
            el('div', { class: 'tx' }, [el('small', { text: it.g }), it.text]),
            el('button', { class: 'b-icon-btn', 'aria-label': 'Kopieren', text: '📋', onclick: () => copyText(api, it.text) }),
            el('button', { class: 'b-icon-btn', 'aria-label': 'Löschen', text: '🗑️', onclick: () => { api.store.set('favs', favs().filter(x => x.t !== it.t || x.text !== it.text)); api.sound('capture'); updFav(); render(); } })
          ])));
          box.append(el('button', { class: 'b-btn ghost block', text: 'Schließen', onclick: close }));
        };
        render(); return box;
      });
    };
    aiBtn.onclick = async () => {
      if(!sample || busy) return;
      const g = GENS.find(x => x.id === cur), myGen = cur;
      busy = true; genBtn.disabled = true; aiBtn.disabled = true; aiBtn.textContent = '✨ KI denkt nach …'; api.sound('click');
      try{
        const r = await sample(inst.ai() + ' Antworte auf Deutsch, in du-Form, kurz (max. 70 Wörter), ohne Einleitung und ohne Markdown.');
        if(!alive || cur !== myGen) return;
        const text = String((r && r.text) || '').trim();
        if(!text) throw new Error('leer');
        aiOut.textContent = text; aiExtra.innerHTML = '';
        const extra = inst.onAi ? inst.onAi(text) : null; if(extra) aiExtra.append(extra);
        aiCard.classList.remove('cr-hide'); aiCard.classList.remove('b-pop'); void aiCard.offsetWidth; aiCard.classList.add('b-pop');
        curText = g.icon + ' ' + g.name + ' (KI)\n' + text; api.sound('good');
      }catch(e){ if(alive) api.toast('KI gerade nicht erreichbar – probier es später nochmal.'); }
      finally{ if(alive){ busy = false; genBtn.disabled = false; aiBtn.disabled = false; aiBtn.textContent = '✨ Mit KI generieren'; } }
    };
    Promise.resolve(api.ai()).then(s => { if(!alive) return; sample = typeof s === 'function' ? s : null; aiBtn.classList.toggle('cr-hide', !sample); }).catch(() => {});
    select(cur, true);
    return () => { alive = false; stopAll(); };
  }
});

/* ---------- 4. Emoji-Geschichten ---------- */
B.registerGame({
  id: 'story', name: 'Emoji-Geschichten', icon: '📖', cat: 'kreativ', kind: 'game',
  desc: 'Würfle 5 Emojis und schreib eine Geschichte dazu – allein oder reihum mit Freunden.',
  rules: ['Würfle 5 zufällige Emojis (2× neu würfeln erlaubt).', 'Solo: Schreib eine Geschichte, in der alle 5 vorkommen. Mit Timer hast du 3 Minuten.', 'Freunde: Das Handy geht reihum – jeder schreibt einen Satz. Das leuchtende Emoji ist dein Tipp für den Satz.', 'Jede fertige Geschichte landet in deiner Sammlung.'],
  players: '1-8', tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  mount(root, api){
    css();
    const ivs = new Set(), tos = new Set();
    const iv = (f, ms) => { const i = setInterval(f, ms); ivs.add(i); return i; };
    const clr = i => { clearInterval(i); ivs.delete(i); };
    const later = (f, ms) => { const t = setTimeout(() => { tos.delete(t); f(); }, ms); tos.add(t); return t; };
    const stopAll = () => { ivs.forEach(clearInterval); ivs.clear(); tos.forEach(clearTimeout); tos.clear(); };
    const col = () => api.store.get('stories', []);
    let timerOn = api.store.get('timer', false);

    function menu(){
      stopAll();
      const tchips = el('div', { class: 'b-chips' });
      const rt = () => { tchips.innerHTML = ''; [[false, '⏸️ Ohne Timer'], [true, '⏱️ Mit Timer']].forEach(([v, lb]) => tchips.append(el('button', { class: 'b-chip', 'aria-pressed': String(v === timerOn), text: lb, onclick: () => { timerOn = v; api.store.set('timer', v); api.sound('click'); rt(); } }))); };
      rt();
      const extra = el('div', { class: 'b-stack tight' }, [
        el('div', {}, [el('span', { class: 'b-label', text: 'Timer (Solo 3 Min · Freunde 45 s pro Satz)' }), tchips]),
        el('button', { class: 'b-btn ghost block', text: '📚 Meine Sammlung (' + col().length + ')', onclick: collection })
      ]);
      BORED.ui.start(root, api, { levels: null, modes: [{ id: 'solo', label: '✍️ Solo' }, { id: 'freunde', label: '👥 Reihum mit Freunden' }], extra, bestKey: (l, m) => m, bestLabel: 'Meiste Wörter', formatScore: v => v + ' W.', startLabel: '🎲 Emojis würfeln', onStart: (l, m) => m === 'freunde' ? setup() : solo() });
    }

    /* Emoji-Reihe mit Würfel-Animation */
    function emojiRow(){
      let cur = api.shuffle(W.emoji).slice(0, 5);
      const tiles = cur.map(e => el('div', { class: 'cr-emo', text: e }));
      const row = el('div', { class: 'cr-emos' }, tiles);
      const roll = (cb) => {
        const fin = api.shuffle(W.emoji).slice(0, 5);
        tiles.forEach(t => { t.classList.remove('land'); t.classList.add('spin'); });
        const i1 = iv(() => { tiles.forEach(t => { if(t.classList.contains('spin')) t.textContent = pick(W.emoji); }); api.sound('tick'); }, 70);
        tiles.forEach((t, i) => later(() => { t.classList.remove('spin'); t.textContent = fin[i]; void t.offsetWidth; t.classList.add('land'); api.sound('pop'); if(i === 4){ clr(i1); cur = fin; cb && cb(fin); } }, 350 + i * 180));
      };
      return { row, tiles, roll, get: () => cur, focus: i => tiles.forEach((t, j) => t.classList.toggle('focus', j === i)) };
    }

    function solo(){
      stopAll(); root.innerHTML = '';
      const er = emojiRow(); let rerolls = 2, rolling = true, t0 = 0, tmr = null, over = false;
      const rr = el('button', { class: 'b-btn ghost sm', text: '🎲 Neu würfeln (2)', disabled: true, onclick: () => { if(rolling || rerolls <= 0) return; rerolls--; rolling = true; rr.disabled = true; api.sound('click'); er.roll(() => { rolling = false; rr.textContent = '🎲 Neu würfeln (' + rerolls + ')'; rr.disabled = rerolls <= 0; }); } });
      const time = el('div', { class: 'cr-timer' + (timerOn ? '' : ' cr-hide'), text: '3:00' });
      const ta = el('textarea', { class: 'b-input', rows: 8, placeholder: 'Es war einmal … (bau alle 5 Emojis ein)', 'aria-label': 'Deine Geschichte', maxlength: 3000, style: { minHeight: '190px' } });
      const wc = el('span', { class: 'b-hint', text: '0 Wörter' });
      ta.addEventListener('input', () => { const n = wordsOf(ta.value); wc.textContent = n + (n === 1 ? ' Wort' : ' Wörter'); if(timerOn && !t0 && n > 0) startTimer(); });
      const save = el('button', { class: 'b-btn block', text: '💾 Speichern & fertig', onclick: () => finishSolo() });
      root.append(el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-between' }, [el('div', { class: 'b-kicker', text: 'Deine 5 Emojis' }), time]),
        er.row, el('div', { class: 'b-between' }, [rr, el('button', { class: 'b-btn ghost sm', text: 'Menü', onclick: menu })]),
        ta, el('div', { class: 'b-between' }, [wc, el('span', { class: 'b-hint', text: timerOn ? 'Timer startet beim ersten Wort' : '' })]), save
      ]));
      er.roll(() => { rolling = false; rr.disabled = false; });
      function startTimer(){
        t0 = Date.now(); const dur = 180000; let lastS = -1;
        tmr = iv(() => {
          const left = dur - (Date.now() - t0), s = Math.ceil(left / 1000);
          time.textContent = fmtTime(left / 1000);
          if(s !== lastS){ lastS = s; if(s <= 10 && s > 0){ api.sound('tick'); time.classList.add('hot'); } }
          if(left <= 0){ clr(tmr); over = true; ta.disabled = true; api.sound('lose'); api.vibrate(80); api.toast('⏰ Zeit um! Jetzt speichern.'); rr.disabled = true; save.classList.add('b-pop'); }
        }, 250);
      }
      function finishSolo(){
        const text = ta.value.trim(), n = wordsOf(text);
        if(n < 5){ api.toast('Schreib mindestens 5 Wörter ✍️'); api.sound('bad'); ta.focus(); return; }
        if(tmr) clr(tmr);
        storeStory({ emojis: er.get(), text, mode: 'solo' });
        const rep = api.reportScore(n, 'solo');
        api.finish({ win: true, score: n, xp: clamp(10 + Math.round(n / 4), 10, 45) });
        api.sound('win');
        BORED.ui.result(root, api, { win: true, emoji: '📖', title: 'Geschichte gespeichert!', sub: over ? 'Gerade noch rechtzeitig ⏰' : 'Ab in die Sammlung 📚', lines: [['Wörter', n], ['Rekord', rep.best + ' W.'], ['Sammlung', col().length], ['Emojis', er.get().join('')]], onAgain: solo, onMenu: menu, againLabel: 'Neue Geschichte' });
      }
    }

    function storeStory(s){
      const c = col(); c.unshift(Object.assign({ id: Date.now() + '' + Math.floor(Math.random() * 999), t: Date.now() }, s));
      api.store.set('stories', c.slice(0, 50));
    }

    /* Freunde-Modus */
    function setup(){
      stopAll(); root.innerHTML = '';
      let names = api.store.get('names', ['Spieler 1', 'Spieler 2', 'Spieler 3']);
      let rounds = api.store.get('rounds', 2);
      const list = el('div', { class: 'b-stack tight' });
      const render = () => {
        list.innerHTML = '';
        names.forEach((n, i) => list.append(el('div', { class: 'b-row' }, [
          el('div', { class: 'grow' }, [(() => { const inp = el('input', { class: 'b-input', value: n, maxlength: 16, 'aria-label': 'Name ' + (i + 1) }); inp.addEventListener('input', () => { names[i] = inp.value; }); return inp; })()]),
          el('button', { class: 'b-icon-btn', 'aria-label': 'Entfernen', text: '✕', onclick: () => { if(names.length <= 2){ api.toast('Mindestens 2 Leute'); return; } names.splice(i, 1); api.sound('tap'); render(); } })
        ])));
        if(names.length < 8) list.append(el('button', { class: 'b-btn ghost sm', text: '＋ Mitspieler', onclick: () => { names.push('Spieler ' + (names.length + 1)); api.sound('pop'); render(); } }));
      };
      render();
      const rch = el('div', { class: 'b-chips' });
      const rr = () => { rch.innerHTML = ''; [1, 2, 3].forEach(r => rch.append(el('button', { class: 'b-chip', 'aria-pressed': String(r === rounds), text: r + (r === 1 ? ' Runde' : ' Runden'), onclick: () => { rounds = r; api.sound('click'); rr(); } }))); };
      rr();
      root.append(el('div', { class: 'b-stack' }, [
        el('div', { class: 'b-card glow b-center' }, [el('div', { style: { fontSize: '44px' }, text: '👥📖' }), el('div', { class: 'b-h', text: 'Reihum-Geschichte' }), el('p', { class: 'b-hint', text: 'Jeder schreibt pro Runde einen Satz. Das Handy wandert weiter.' })]),
        el('div', {}, [el('span', { class: 'b-label', text: 'Wer spielt mit?' }), list]),
        el('div', {}, [el('span', { class: 'b-label', text: 'Runden' }), rch]),
        el('button', { class: 'b-btn block', text: '🎲 Emojis würfeln & los', onclick: () => {
          names = names.map((n, i) => n.trim() || 'Spieler ' + (i + 1));
          api.store.set('names', names); api.store.set('rounds', rounds); api.sound('good');
          group(names, rounds);
        } }),
        el('button', { class: 'b-btn ghost block', text: 'Zurück', onclick: menu })
      ]));
    }
    function group(names, rounds){
      stopAll(); root.innerHTML = '';
      const er = emojiRow(); const total = names.length * rounds; const lines = [];
      const box = el('div', { class: 'b-stack' });
      root.append(el('div', { class: 'b-stack' }, [el('div', { class: 'b-kicker', text: 'Eure 5 Emojis' }), er.row, box]));
      er.roll(() => turn());
      function turn(){
        stopAll(); box.innerHTML = '';
        const k = lines.length;
        if(k >= total) return end();
        const who = names[k % names.length];
        er.focus(-1);
        box.append(el('div', { class: 'b-card glow b-center b-pop', style: { padding: '24px 16px' } }, [
          el('div', { style: { fontSize: '44px' }, text: '📱' }), el('div', { class: 'b-kicker', text: 'Satz ' + (k + 1) + ' von ' + total }),
          el('div', { class: 'b-title b-grad', text: who + ' ist dran' }), el('p', { class: 'b-hint', text: 'Gib das Handy an ' + who + ' weiter.' }),
          el('button', { class: 'b-btn block', text: '✋ Ich bin bereit', onclick: () => { api.sound('click'); write(who, k); } })
        ]));
      }
      function write(who, k){
        box.innerHTML = ''; er.focus(k % 5);
        const story = el('div', { class: 'b-card cr-story' });
        if(lines.length){ story.append(...lines.map(l => el('p', {}, [el('small', { text: l.who }), l.text]))); }
        else story.append(el('p', { class: 'b-hint', text: 'Du beginnst die Geschichte! Tipp: Bau das leuchtende Emoji ein.' }));
        const inp = el('textarea', { class: 'b-input', rows: 3, maxlength: 280, placeholder: 'Dein Satz …', 'aria-label': 'Dein Satz', style: { minHeight: '84px' } });
        const time = el('div', { class: 'cr-timer' + (timerOn ? '' : ' cr-hide'), text: '0:45' });
        const send = () => {
          const t = inp.value.trim();
          if(!t && !(timerOn && left() <= 0)){ api.toast('Schreib einen Satz ✍️'); api.sound('bad'); return; }
          stopAll();
          lines.push({ who, text: t || '… (' + who + ' fiel nichts ein 😅)' }); api.sound('pop');
          turn();
        };
        box.append(el('div', { class: 'b-between' }, [el('div', { class: 'b-h', text: '✍️ ' + who }), time]), story, inp, el('button', { class: 'b-btn block', text: lines.length + 1 >= total ? '🏁 Letzter Satz – fertig!' : '➡️ Satz abgeben', onclick: send }));
        setTimeout(() => { try{ inp.focus({ preventScroll: true }); }catch(e){} }, 50);
        const t0 = Date.now(), dur = 45000; let lastS = -1;
        const left = () => dur - (Date.now() - t0);
        if(timerOn) iv(() => {
          const l = left(), s = Math.ceil(l / 1000); time.textContent = fmtTime(l / 1000);
          if(s !== lastS){ lastS = s; if(s <= 5 && s > 0){ api.sound('tick'); time.classList.add('hot'); } }
          if(l <= 0){ api.sound('bad'); api.toast('⏰ Zeit um!'); send(); }
        }, 250);
      }
      function end(){
        stopAll(); er.focus(-1);
        const text = lines.map(l => l.text).join(' ');
        storeStory({ emojis: er.get(), text, mode: 'freunde', lines });
        const n = wordsOf(text); const rep = api.reportScore(n, 'freunde');
        api.finish({ win: true, score: n, xp: clamp(12 + lines.length * 2, 12, 40) });
        api.sound('win');
        box.innerHTML = '';
        box.append(
          el('div', { class: 'b-title b-grad b-center', text: '🏁 Eure Geschichte' }),
          el('div', { class: 'b-card glow cr-story b-pop' }, lines.map(l => el('p', {}, [el('small', { text: l.who }), l.text]))),
          el('div', { class: 'b-grid2' }, [el('div', { class: 'b-stat' }, [el('small', { text: 'Wörter' }), el('b', { text: n })]), el('div', { class: 'b-stat' }, [el('small', { text: 'Rekord' }), el('b', { text: rep.best })])]),
          el('button', { class: 'b-btn ghost block', text: '📋 Geschichte kopieren', onclick: () => copyText(api, er.get().join('') + '\n\n' + lines.map(l => l.who + ': ' + l.text).join('\n')) }),
          el('button', { class: 'b-btn block', text: 'Nochmal', onclick: () => group(names, rounds) }),
          el('button', { class: 'b-btn ghost block', text: 'Zum Menü', onclick: menu })
        );
      }
    }

    function collection(){
      api.sheet(close => {
        const box = el('div', { class: 'b-stack' });
        const render = () => {
          const c = col(); box.innerHTML = '';
          box.append(el('div', { class: 'b-kicker', text: '📚 Sammlung · ' + c.length }));
          if(!c.length) box.append(el('p', { class: 'b-hint b-center', style: { padding: '20px 0' }, text: 'Noch keine Geschichten. Würfle los!' }));
          c.forEach(s => box.append(el('div', { class: 'cr-fav' }, [
            el('div', { class: 'tx', onclick: () => view(s) }, [el('small', { text: s.emojis.join('') + ' · ' + new Date(s.t).toLocaleDateString('de-AT') + (s.mode === 'freunde' ? ' · 👥' : '') }), s.text.length > 140 ? s.text.slice(0, 140) + '…' : s.text]),
            el('button', { class: 'b-icon-btn', 'aria-label': 'Kopieren', text: '📋', onclick: () => copyText(api, s.emojis.join('') + '\n\n' + s.text) }),
            el('button', { class: 'b-icon-btn', 'aria-label': 'Löschen', text: '🗑️', onclick: async () => { close(); if(await api.confirm('Diese Geschichte löschen?', 'Löschen')){ api.store.set('stories', col().filter(x => x.id !== s.id)); api.sound('capture'); } collection(); } })
          ])));
          box.append(el('button', { class: 'b-btn ghost block', text: 'Schließen', onclick: close }));
        };
        render(); return box;
      }, { onClose: () => { if(root.querySelector('.b-card.b-rgb')) menu(); } });
    }
    function view(s){
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('div', { style: { fontSize: '34px', textAlign: 'center', letterSpacing: '4px' }, text: s.emojis.join('') }),
        el('div', { class: 'b-card cr-story' }, s.lines ? s.lines.map(l => el('p', {}, [el('small', { text: l.who }), l.text])) : [s.text]),
        el('button', { class: 'b-btn ghost block', text: '📋 Kopieren', onclick: () => copyText(api, s.emojis.join('') + '\n\n' + s.text) }),
        el('button', { class: 'b-btn block', text: 'Schließen', onclick: close })
      ]));
    }

    menu();
    return stopAll;
  }
});

})();
