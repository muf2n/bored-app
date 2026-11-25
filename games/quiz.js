/* BORED? – Quiz: 450 Fragen in 10 Themen, 5 Spielmodi, eigene Quiz, KI-Quiz. */
(function(){
'use strict';
const B = window.BORED;
if(!B) return;

/* ---------- Fragenbank ----------
   Format je Zeile: Schwierigkeit|Frage|RICHTIG|Falsch|Falsch|Falsch|Erklärung
   Themenkopf: @id|Name|Icon. Die richtige Antwort steht in den Daten immer zuerst und wird beim Spielen gemischt. */
const RAW = `@allg|Allgemeinwissen|🌍
1|Wie viele Tage hat ein Schaltjahr?|366|365|364|367|Im Schaltjahr kommt der 29. Februar dazu.
1|Wie viele Minuten hat eine Stunde?|60|100|50|90|Eine Stunde hat 60 Minuten, eine Minute 60 Sekunden.
1|Welche Farbe entsteht, wenn man blaue und gelbe Malfarbe mischt?|Grün|Lila|Orange|Braun|Beim Mischen von Malfarben ergeben Blau und Gelb Grün.
1|Wie viele Beine hat eine Spinne?|8|6|10|12|Spinnen sind Spinnentiere mit acht Beinen – Insekten haben sechs.
1|Wie viele Seiten hat ein Sechseck?|6|5|7|8|Ein Sechseck (Hexagon) hat sechs Seiten und sechs Ecken.
1|Welches ist das größte heute lebende Tier?|Blauwal|Afrikanischer Elefant|Pottwal|Walhai|Der Blauwal ist das größte bekannte Tier, das je gelebt hat.
1|Wie heißt der Abend des 24. Dezember?|Heiliger Abend|Silvester|Gründonnerstag|Pfingstabend|Am 24. Dezember wird der Heilige Abend gefeiert.
2|Wie viele Monate im Jahr haben 31 Tage?|7|6|5|8|Jänner, März, Mai, Juli, August, Oktober und Dezember.
1|Welcher Monat ist der kürzeste?|Februar|April|Juni|November|Der Februar hat 28 Tage, im Schaltjahr 29.
1|Wie viele Felder hat ein Schachbrett?|64|81|100|48|Ein Schachbrett hat 8 × 8 = 64 Felder.
2|Welche Form hat ein Stoppschild?|Achteck|Sechseck|Kreis|Dreieck|Das Stoppschild ist ein rotes Achteck, damit man es auch von hinten erkennt.
2|Wie viele Zähne hat ein erwachsener Mensch mit allen Weisheitszähnen?|32|28|30|36|Mit allen vier Weisheitszähnen sind es 32 Zähne.
3|Wie viele Knochen hat ein erwachsener Mensch in der Regel?|206|150|300|412|Ein Erwachsener hat in der Regel 206 Knochen – ein Baby noch deutlich mehr.
1|Aus wie vielen Karten besteht ein Poker-Kartenspiel ohne Joker?|52|32|54|48|4 Farben × 13 Werte = 52 Karten.
1|Welche Zahl liegt beim normalen Spielwürfel der 1 gegenüber?|6|2|5|3|Gegenüberliegende Seiten ergeben zusammen immer 7.
3|Wie viele farbige Felder hat ein 3×3-Zauberwürfel insgesamt?|54|27|36|48|6 Seiten × 9 Felder = 54.
2|Wie nennt man ein Känguru-Baby?|Joey|Kitz|Welpe|Fohlen|Junge Kängurus heißen auf Englisch und Deutsch Joey.
1|Welches ist das schnellste Landtier?|Gepard|Löwe|Zebra|Pferd|Geparden erreichen auf kurzen Strecken rund 100 km/h.
2|Wie viele Sekunden hat eine Stunde?|3600|360|6000|600|60 Minuten × 60 Sekunden = 3600 Sekunden.
1|Welches Zeichen steht für den Euro?|€|$|£|¥|€ ist das Euro-Zeichen, $ Dollar, £ Pfund, ¥ Yen.
1|Wie viele Nullen hat eine Million?|6|5|7|9|Eine Million schreibt man 1.000.000.
2|Wie viele Nullen hat eine Milliarde?|9|6|12|8|1.000.000.000 – auf Englisch heißt das „billion“.
3|Was ist im Deutschen eine Billion?|Eine Million Millionen|Tausend Millionen|Hundert Millionen|Zehn Milliarden|Die deutsche Billion hat 12 Nullen – auf Englisch „trillion“.
1|Welche Farbe hat ein Smaragd?|Grün|Rot|Blau|Gelb|Der Smaragd ist ein grüner Edelstein.
1|Welches Organ pumpt das Blut durch den Körper?|Herz|Lunge|Leber|Niere|Das Herz ist ein Muskel, der Blut durch die Adern pumpt.
2|Welches ist das größte Organ des Menschen?|Haut|Leber|Lunge|Darm|Die Haut ist flächenmäßig das größte Organ.
1|Welche Ampelfarbe bedeutet „Stopp“?|Rot|Grün|Gelb|Blau|Bei Rot heißt es stehen bleiben.
1|Wofür steht die Abkürzung „z. B.“?|zum Beispiel|zur Bestätigung|zuletzt bearbeitet|zum Besuch|„z. B.“ ist die Abkürzung für „zum Beispiel“.
2|Was ist ein Palindrom?|Ein Wort, das vorwärts und rückwärts gleich ist|Ein Wort nur aus Vokalen|Ein besonders langes Wort|Ein Wort aus dem Lateinischen|Beispiele: „Anna“, „Otto“, „Rentner“.
2|Wie viele Ecken hat ein Würfel?|8|6|12|4|Ein Würfel hat 8 Ecken, 12 Kanten und 6 Flächen.
1|Welches Tier gilt als „König der Tiere“?|Löwe|Tiger|Adler|Bär|Der Löwe wird traditionell „König der Tiere“ genannt.
2|Wie viele Herzen hat ein Oktopus?|3|1|2|4|Zwei Kiemenherzen und ein Körperherz.
3|Welche Farbe hat das Blut eines Oktopus?|Blau|Grün|Rot|Gelb|Der kupferhaltige Blutfarbstoff Hämocyanin färbt es bläulich.
2|Wie nennt man die Angst vor Spinnen?|Arachnophobie|Klaustrophobie|Akrophobie|Agoraphobie|Arachne ist griechisch für Spinne.
2|Wie nennt man das Jubiläum nach 25 Ehejahren?|Silberne Hochzeit|Goldene Hochzeit|Diamantene Hochzeit|Eiserne Hochzeit|25 Jahre = Silber, 50 = Gold, 60 = Diamant.
1|Welches dieser Tiere ist ein Säugetier?|Delfin|Hai|Forelle|Thunfisch|Delfine atmen Luft und säugen ihre Jungen.
2|Welcher Vogel kann sogar rückwärts fliegen?|Kolibri|Spatz|Adler|Taube|Kolibris können in der Luft stehen und rückwärts fliegen.
2|Wie viele Flügel hat eine Honigbiene?|4|2|6|8|Bienen haben zwei Flügelpaare, also vier Flügel.
1|Wohin zeigt die Nadel eines Kompasses?|Nach Norden|Nach Süden|Zur Sonne|Nach unten|Die Magnetnadel richtet sich am Erdmagnetfeld nach Norden aus.
3|Wie heißt die Wissenschaft von den Pilzen?|Mykologie|Botanik|Ornithologie|Entomologie|Mykologie kommt vom griechischen „mykes“ = Pilz.
3|Was erforscht ein Ornithologe?|Vögel|Insekten|Fische|Gesteine|Ornithologie ist die Vogelkunde.
2|Welches Säugetier legt Eier?|Schnabeltier|Fledermaus|Koala|Delfin|Das Schnabeltier gehört zu den eierlegenden Kloakentieren.
3|Wie nennt man die Angst vor engen Räumen?|Klaustrophobie|Akrophobie|Hydrophobie|Xenophobie|Vom lateinischen „claustrum“ = geschlossener Raum.
@geo|Geografie|🗺️
1|Was ist die Hauptstadt von Österreich?|Wien|Graz|Salzburg|Linz|Wien ist Hauptstadt und größte Stadt Österreichs.
1|Was ist die Landeshauptstadt der Steiermark?|Graz|Leoben|Klagenfurt|Voitsberg|Graz ist die zweitgrößte Stadt Österreichs.
1|Was ist die Hauptstadt von Frankreich?|Paris|Lyon|Marseille|Nizza|Paris liegt an der Seine.
1|Was ist die Hauptstadt von Italien?|Rom|Mailand|Neapel|Venedig|Rom wird auch die „Ewige Stadt“ genannt.
2|Was ist die Hauptstadt von Australien?|Canberra|Sydney|Melbourne|Perth|Canberra wurde extra als Hauptstadt geplant.
2|Was ist die Hauptstadt von Kanada?|Ottawa|Toronto|Montreal|Vancouver|Ottawa liegt in der Provinz Ontario.
1|Auf welchem Kontinent liegt Ägypten zum größten Teil?|Afrika|Australien|Europa|Südamerika|Ägypten liegt im Nordosten Afrikas, nur die Sinai-Halbinsel gehört zu Asien.
1|Welcher ist der größte Ozean der Erde?|Pazifik|Atlantik|Indischer Ozean|Arktischer Ozean|Der Pazifik ist größer als alle Landflächen zusammen.
1|Welcher ist der höchste Berg der Erde über dem Meeresspiegel?|Mount Everest|K2|Kilimandscharo|Mont Blanc|Der Mount Everest im Himalaya ist knapp 8850 m hoch.
2|Welcher ist der höchste Berg Österreichs?|Großglockner|Wildspitze|Dachstein|Zugspitze|Der Großglockner ist 3798 m hoch.
1|Welcher Fluss fließt durch Wien?|Donau|Rhein|Mur|Inn|Die Donau fließt durch vier europäische Hauptstädte.
2|Welcher Fluss fließt durch Graz?|Mur|Donau|Drau|Enns|Die Mur teilt Graz in zwei Hälften.
1|Wie viele Bundesländer hat Österreich?|9|8|10|16|Wien, NÖ, OÖ, Salzburg, Tirol, Vorarlberg, Kärnten, Steiermark, Burgenland.
2|Wie viele Bundesländer hat Deutschland?|16|9|12|26|Deutschland ist in 16 Bundesländer gegliedert.
3|Wie viele Kantone hat die Schweiz?|26|16|9|20|Die Schweiz besteht aus 26 Kantonen.
1|Welches Land hat die Form eines Stiefels?|Italien|Spanien|Griechenland|Portugal|Die italienische Halbinsel sieht aus wie ein Stiefel.
1|Wie heißt die größte Wüste Afrikas?|Sahara|Kalahari|Namib|Gobi|Die Sahara ist die größte Trockenwüste mit Hitze. Die Gobi liegt in Asien.
1|Welches ist das flächenmäßig größte Land der Erde?|Russland|Kanada|China|USA|Russland erstreckt sich über Europa und Asien.
1|In welcher Stadt steht die Freiheitsstatue?|New York|Washington|Boston|Chicago|Sie steht auf Liberty Island im Hafen von New York.
1|In welcher Stadt steht der berühmte Schiefe Turm?|Pisa|Rom|Florenz|Mailand|Der Glockenturm in Pisa neigt sich seit seinem Bau.
2|Welche Hauptstadt liegt an der Themse?|London|Dublin|Paris|Amsterdam|Die Themse fließt mitten durch London.
1|Was ist die Hauptstadt von Spanien?|Madrid|Barcelona|Sevilla|Valencia|Madrid liegt im Zentrum Spaniens.
1|Was ist die Hauptstadt von Japan?|Tokio|Osaka|Kyoto|Hiroshima|Tokio ist Hauptstadt Japans – Kyoto war es früher.
2|Was ist die Hauptstadt der Türkei?|Ankara|Istanbul|Izmir|Antalya|Ankara ist seit 1923 Hauptstadt – Istanbul ist die größte Stadt.
2|Was ist die Hauptstadt von Brasilien?|Brasília|Rio de Janeiro|São Paulo|Salvador|Brasília wurde in den 1950ern als neue Hauptstadt gebaut.
3|Was ist die Hauptstadt von Neuseeland?|Wellington|Auckland|Christchurch|Queenstown|Wellington liegt an der Südspitze der Nordinsel.
3|Was ist die Hauptstadt von Marokko?|Rabat|Casablanca|Marrakesch|Fès|Rabat ist Hauptstadt – Casablanca ist größer.
2|Welches Land grenzt NICHT an Österreich?|Polen|Slowenien|Ungarn|Liechtenstein|Österreichs Nachbarn: DE, CZ, SK, HU, SI, IT, CH und LI.
3|Wie viele Nachbarländer hat Österreich?|8|7|9|6|Deutschland, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Schweiz, Liechtenstein.
1|Welches Meer liegt zwischen Europa und Afrika?|Mittelmeer|Nordsee|Ostsee|Schwarzes Meer|Die Straße von Gibraltar verbindet das Mittelmeer mit dem Atlantik.
2|Welcher ist der längste Fluss Europas?|Wolga|Donau|Rhein|Elbe|Die Wolga fließt durch Russland ins Kaspische Meer.
3|Durch wie viele Hauptstädte fließt die Donau?|4|2|3|5|Wien, Bratislava, Budapest und Belgrad.
1|Auf welchem Kontinent liegt Peru?|Südamerika|Afrika|Asien|Nordamerika|Peru liegt an der Westküste Südamerikas.
1|Welches dieser Länder ist ein Inselstaat?|Island|Schweiz|Österreich|Ungarn|Island liegt im Nordatlantik.
2|Was ist die größte Insel der Erde (ohne Australien)?|Grönland|Madagaskar|Borneo|Neuguinea|Grönland ist etwa 2,2 Millionen km² groß.
3|Zu welchem Königreich gehört Grönland?|Dänemark|Norwegen|Schweden|Island|Grönland ist ein autonomer Teil des Königreichs Dänemark.
1|Welche Linie teilt die Erde in Nord- und Südhalbkugel?|Äquator|Nullmeridian|Wendekreis|Datumsgrenze|Der Äquator liegt bei 0° Breite.
2|Nach welchem Ort ist der Nullmeridian benannt?|Greenwich|Paris|Rom|Kairo|Der Greenwich-Meridian verläuft durch die Sternwarte in London-Greenwich.
3|In welchem Land liegt Timbuktu?|Mali|Niger|Tschad|Senegal|Timbuktu ist eine historische Handelsstadt am Rand der Sahara.
1|Welches Land hat ein Ahornblatt auf der Flagge?|Kanada|USA|Schweden|Norwegen|Das rote Ahornblatt ist Kanadas Symbol.
1|Welche Farben hat die Flagge Österreichs?|Rot-Weiß-Rot|Schwarz-Rot-Gold|Rot-Weiß-Blau|Grün-Weiß-Rot|Rot-Weiß-Rot gehört zu den ältesten Flaggen der Welt.
1|Welcher Kontinent ist der flächenmäßig größte?|Asien|Afrika|Nordamerika|Europa|Asien bedeckt etwa ein Drittel der Landfläche der Erde.
3|Welcher ist der tiefste See der Welt?|Baikalsee|Kaspisches Meer|Victoriasee|Tanganjikasee|Der Baikalsee in Sibirien ist über 1600 m tief.
3|In welchem Land liegt der Kilimandscharo?|Tansania|Kenia|Uganda|Äthiopien|Der Kilimandscharo ist der höchste Berg Afrikas.
2|Welche Stadt hat den Spitznamen „Big Apple“?|New York|Los Angeles|Chicago|San Francisco|„The Big Apple“ ist der bekannteste Spitzname von New York City.
@gesch|Geschichte|🏛️
1|In welchem Jahr endete der Zweite Weltkrieg?|1945|1918|1939|1950|In Europa endete er im Mai, in Asien im September 1945.
1|In welchem Jahr begann der Zweite Weltkrieg?|1939|1914|1945|1933|Am 1. September 1939 überfiel Deutschland Polen.
1|In welchem Jahr begann der Erste Weltkrieg?|1914|1918|1939|1905|Der Erste Weltkrieg dauerte von 1914 bis 1918.
2|In welchem Jahr fiel die Berliner Mauer?|1989|1961|1990|1975|Am 9. November 1989 wurde die Grenze geöffnet.
3|In welchem Jahr wurde die Berliner Mauer gebaut?|1961|1949|1945|1971|Der Mauerbau begann am 13. August 1961.
2|In welchem Jahr landeten erstmals Menschen auf dem Mond?|1969|1959|1972|1965|Apollo 11 landete im Juli 1969 auf dem Mond.
1|Wer betrat als erster Mensch den Mond?|Neil Armstrong|Buzz Aldrin|Juri Gagarin|Michael Collins|Armstrong stieg zuerst aus, Aldrin folgte kurz danach.
2|Wer war der erste Mensch im Weltall?|Juri Gagarin|Neil Armstrong|Alan Shepard|John Glenn|Der Russe Juri Gagarin flog 1961 ins All.
2|In welchem Jahr erreichte Kolumbus erstmals Amerika?|1492|1517|1453|1607|Kolumbus landete 1492 auf einer Karibikinsel.
3|In welchem Jahr veröffentlichte Martin Luther seine 95 Thesen?|1517|1492|1618|1555|Damit begann die Reformation.
1|Wer war der erste Präsident der USA?|George Washington|Abraham Lincoln|Thomas Jefferson|John Adams|Washington war ab 1789 Präsident.
2|Welches der sieben antiken Weltwunder steht noch heute?|Pyramiden von Gizeh|Koloss von Rhodos|Leuchtturm von Alexandria|Hängende Gärten|Nur die Pyramiden von Gizeh sind erhalten.
2|Welche römische Stadt wurde 79 n. Chr. vom Vesuv verschüttet?|Pompeji|Rom|Ostia|Karthago|Die Asche konservierte die Stadt bis heute.
2|Wer gilt als erster römischer Kaiser?|Augustus|Julius Caesar|Nero|Konstantin|Caesar war Diktator – sein Großneffe Augustus wurde erster Kaiser.
1|Welches Passagierschiff sank auf seiner Jungfernfahrt nach der Kollision mit einem Eisberg?|Titanic|Lusitania|Bismarck|Queen Mary|Die Titanic galt als „unsinkbar“.
2|In welchem Jahr sank die Titanic?|1912|1905|1921|1898|Die Titanic sank im April 1912 im Nordatlantik.
1|Wie hieß die Kaiserin von Österreich mit dem Spitznamen „Sisi“?|Elisabeth|Maria Theresia|Zita|Marie Louise|Elisabeth war die Frau von Kaiser Franz Joseph I.
2|In welchem Jahr wurde der Österreichische Staatsvertrag unterzeichnet?|1955|1945|1938|1966|Am 15. Mai 1955 wurde Österreich wieder ein freier Staat.
2|Wann ist der österreichische Nationalfeiertag?|26. Oktober|1. Mai|3. Oktober|15. August|Am 26.10.1955 wurde das Neutralitätsgesetz beschlossen.
2|Welches Ereignis löste den Ersten Weltkrieg aus?|Attentat von Sarajevo|Sturm auf die Bastille|Fall der Berliner Mauer|Überfall auf Polen|Das Attentat auf den Thronfolger 1914 führte zur Kriegserklärung.
3|Wer wurde 1914 in Sarajevo ermordet?|Erzherzog Franz Ferdinand|Kaiser Franz Joseph I.|Kaiser Wilhelm II.|Kaiser Karl I.|Der österreichische Thronfolger und seine Frau wurden erschossen.
2|In welchem Jahr begann die Französische Revolution?|1789|1776|1815|1848|Am 14. Juli 1789 wurde die Bastille gestürmt.
2|In welchem Jahr erklärten die USA ihre Unabhängigkeit?|1776|1789|1492|1812|Die Unabhängigkeitserklärung wurde am 4. Juli 1776 verabschiedet.
2|Wo wurde Napoleon 1815 endgültig besiegt?|Waterloo|Austerlitz|Leipzig|Trafalgar|Nach Waterloo wurde er nach St. Helena verbannt.
1|Wer erfand den Buchdruck mit beweglichen Lettern in Europa?|Johannes Gutenberg|Martin Luther|Leonardo da Vinci|Galileo Galilei|Gutenberg druckte um 1450 in Mainz.
1|Welche Herrscherfamilie regierte Österreich über Jahrhunderte?|Habsburger|Bourbonen|Romanows|Tudors|Die Habsburger regierten bis 1918.
3|In welchem Jahr wurde in Österreich die Erste Republik ausgerufen?|1918|1914|1938|1945|Am 12. November 1918, nach dem Ende der Monarchie.
2|Welche Kultur erbaute Machu Picchu?|Inka|Maya|Azteken|Olmeken|Die Inka bauten die Stadt im 15. Jahrhundert in den Anden.
3|Wie hieß die Hauptstadt des Aztekenreichs?|Tenochtitlan|Cusco|Chichén Itzá|Teotihuacán|Auf ihren Ruinen steht heute Mexiko-Stadt.
2|Welcher Pharao wurde durch sein 1922 entdecktes Grab berühmt?|Tutanchamun|Ramses II.|Cheops|Echnaton|Howard Carter fand das fast unberührte Grab.
2|Welches Land schenkte den USA die Freiheitsstatue?|Frankreich|Großbritannien|Spanien|Italien|Sie war ein Geschenk zum 100. Jahrestag der Unabhängigkeit.
2|Welches Militärbündnis wurde 1949 gegründet?|NATO|Warschauer Pakt|UNO|EU|Die NATO wurde 1949 in Washington gegründet.
2|In welchem Jahr trat Österreich der EU bei?|1995|1989|2002|1973|Österreich trat am 1. Jänner 1995 bei.
2|In welchem Jahr wurde der Euro als Bargeld eingeführt?|2002|1999|1995|2008|Als Buchgeld gab es ihn schon ab 1999.
3|Wer schrieb mit Friedrich Engels das „Kommunistische Manifest“?|Karl Marx|Lenin|Stalin|Rosa Luxemburg|Es erschien 1848.
1|Wie nennt man die skandinavischen Seefahrer der Zeit um 800–1050?|Wikinger|Kelten|Goten|Hunnen|Die Wikinger fuhren bis nach Nordamerika.
2|Wer war Kleopatra VII.?|Die letzte Herrscherin des Ptolemäerreichs|Eine römische Kaiserin|Eine griechische Göttin|Eine persische Prinzessin|Nach ihrem Tod 30 v. Chr. wurde Ägypten römisch.
2|Welcher Kaiser regierte Österreich von 1848 bis 1916?|Franz Joseph I.|Karl I.|Ferdinand I.|Leopold II.|Er regierte 68 Jahre lang.
3|Welche Herrscherin war die Mutter von Marie Antoinette?|Maria Theresia|Kaiserin Elisabeth|Katharina die Große|Königin Victoria|Marie Antoinette wurde in Wien geboren.
2|Welches Bauwerk wurde zur Weltausstellung 1889 in Paris eröffnet?|Eiffelturm|Louvre|Notre-Dame|Arc de Triomphe|Der Eiffelturm sollte ursprünglich wieder abgerissen werden.
1|Wofür ist Mahatma Gandhi bekannt?|Gewaltfreier Kampf für Indiens Unabhängigkeit|Erster Kaiser Chinas|Britischer König|Entdecker Afrikas|Gandhi setzte auf gewaltlosen Widerstand.
2|Welcher Krieg dauerte von 1618 bis 1648?|Dreißigjähriger Krieg|Hundertjähriger Krieg|Siebenjähriger Krieg|Rosenkriege|Er endete mit dem Westfälischen Frieden.
3|Wer war der erste Kaiser Chinas?|Qin Shi Huang|Kublai Khan|Dschingis Khan|Mao Zedong|Bekannt ist auch seine Terrakotta-Armee.
2|Welches Reich gründete Dschingis Khan?|Mongolisches Reich|Osmanisches Reich|Perserreich|Römisches Reich|Es wurde zum größten zusammenhängenden Landreich der Geschichte.
3|In welchem Jahr eroberten die Osmanen Konstantinopel?|1453|1492|1204|1529|Damit endete das Byzantinische Reich.
3|In welchem Jahr belagerten die Osmanen Wien zum ersten Mal?|1529|1683|1453|1618|Die zweite Belagerung folgte 1683.
@wiss|Wissenschaft|🔬
1|Welcher Planet wird „Roter Planet“ genannt?|Mars|Venus|Jupiter|Merkur|Eisenoxid (Rost) färbt den Marsboden rot.
1|Welcher ist der größte Planet im Sonnensystem?|Jupiter|Saturn|Neptun|Erde|In Jupiter würde die Erde über 1000-mal hineinpassen.
1|Welcher Planet ist der Sonne am nächsten?|Merkur|Venus|Mars|Erde|Merkur ist auch der kleinste Planet.
1|Wie viele Planeten hat unser Sonnensystem?|8|9|7|10|Seit 2006 zählt Pluto als Zwergplanet.
1|Was ist die chemische Formel von Wasser?|H₂O|CO₂|O₂|NaCl|Zwei Wasserstoffatome und ein Sauerstoffatom.
1|Welches Gas nehmen Pflanzen bei der Fotosynthese auf?|Kohlenstoffdioxid|Sauerstoff|Stickstoff|Helium|Sie nehmen CO₂ auf und geben Sauerstoff ab.
2|Welches Gas macht den größten Teil der Luft aus?|Stickstoff|Sauerstoff|Kohlenstoffdioxid|Argon|Luft besteht zu etwa 78 % aus Stickstoff.
1|Bei wie viel Grad Celsius siedet Wasser auf Meereshöhe?|100|90|80|120|Auf Bergen siedet es wegen des geringeren Luftdrucks früher.
1|Bei wie viel Grad Celsius gefriert Wasser bei Normaldruck?|0|-10|4|32|0 °C ist der Gefrierpunkt von Wasser.
2|Für welches Element steht das Symbol „Au“?|Gold|Silber|Aluminium|Argon|Vom lateinischen „aurum“ = Gold.
2|Für welches Element steht das Symbol „Fe“?|Eisen|Blei|Kupfer|Zinn|Vom lateinischen „ferrum“ = Eisen.
2|Für welches Element steht das Symbol „Na“?|Natrium|Stickstoff|Neon|Nickel|Von „Natrium“ – Stickstoff ist N, Neon Ne, Nickel Ni.
3|Für welches Element steht das Symbol „Pb“?|Blei|Platin|Phosphor|Palladium|Vom lateinischen „plumbum“ = Blei.
3|Welches Organ produziert Insulin?|Bauchspeicheldrüse|Leber|Niere|Magen|Insulin senkt den Blutzucker.
2|Was ist die kleinste Einheit des Lebens?|Zelle|Atom|Molekül|Organ|Alle Lebewesen bestehen aus Zellen.
1|Wie heißt der Vorgang, bei dem Pflanzen mit Licht Zucker herstellen?|Fotosynthese|Osmose|Gärung|Verdunstung|Dabei entsteht auch Sauerstoff.
3|Welche Blutgruppe gilt als Universalspender für rote Blutkörperchen?|0 negativ|AB positiv|A positiv|B negativ|0 negativ hat keine A-, B- oder Rhesus-Merkmale.
2|Was misst man in Hertz?|Frequenz|Kraft|Temperatur|Druck|1 Hertz = 1 Schwingung pro Sekunde.
2|Was misst man in Newton?|Kraft|Energie|Leistung|Stromstärke|Benannt nach Isaac Newton.
2|Wie lange braucht Sonnenlicht ungefähr bis zur Erde?|Etwa 8 Minuten|Etwa 8 Sekunden|Etwa 8 Stunden|Etwa 1 Sekunde|Rund 150 Millionen km legt es in gut 8 Minuten zurück.
2|Wie schnell ist Licht im Vakuum ungefähr?|300.000 km/s|30.000 km/s|3.000 km/s|3 Millionen km/s|Genau sind es 299.792,458 km/s.
1|Wer entwickelte die Relativitätstheorie?|Albert Einstein|Isaac Newton|Nikola Tesla|Stephen Hawking|Berühmt ist die Formel E = mc².
2|Wer formulierte das Gravitationsgesetz?|Isaac Newton|Galileo Galilei|Albert Einstein|Johannes Kepler|Newton veröffentlichte es 1687.
2|Welche Teilchen im Atom sind negativ geladen?|Elektronen|Protonen|Neutronen|Photonen|Protonen sind positiv, Neutronen neutral.
3|Wie viele Chromosomen hat eine menschliche Körperzelle normalerweise?|46|23|48|44|Also 23 Chromosomenpaare.
1|Welcher Planet ist für seine auffälligen Ringe bekannt?|Saturn|Jupiter|Mars|Merkur|Die Ringe bestehen vor allem aus Eis und Gestein.
2|Welches ist das härteste natürliche Mineral?|Diamant|Quarz|Topas|Korund|Diamant hat auf der Mohs-Skala die Härte 10.
2|Welches Element hat die Ordnungszahl 1?|Wasserstoff|Helium|Sauerstoff|Kohlenstoff|Wasserstoff ist das leichteste Element.
1|Mit welchem Edelgas füllt man meist schwebende Luftballons?|Helium|Neon|Argon|Krypton|Helium ist leichter als Luft und nicht brennbar.
3|Welche Säure befindet sich im Magen?|Salzsäure|Schwefelsäure|Zitronensäure|Essigsäure|Die Magensäure hilft beim Verdauen und tötet Keime.
3|Welchen pH-Wert hat reines Wasser bei 25 °C?|7|0|14|5|pH 7 ist neutral.
1|Wie nennt man Tiere, die nur Pflanzen fressen?|Pflanzenfresser|Fleischfresser|Allesfresser|Aasfresser|Fachbegriff: Herbivoren.
2|Welche Schicht schützt die Erde vor einem Großteil der UV-Strahlung?|Ozonschicht|Erdkruste|Erdmantel|Erdkern|Die Ozonschicht liegt in der Stratosphäre.
3|Welcher Planet ist so stark geneigt, dass er fast „auf der Seite liegt“?|Uranus|Neptun|Venus|Saturn|Seine Achse ist um etwa 98° geneigt.
1|Wie heißt unsere Galaxie?|Milchstraße|Andromeda|Sombrero|Großer Wagen|Der Große Wagen ist nur ein Sternbild.
2|Was ist ein Lichtjahr?|Eine Entfernung|Eine Zeitspanne|Eine Helligkeit|Eine Geschwindigkeit|Die Strecke, die Licht in einem Jahr zurücklegt.
1|Welches Organ filtert das Blut und bildet Urin?|Niere|Leber|Milz|Lunge|Die meisten Menschen haben zwei Nieren.
2|Was transportieren rote Blutkörperchen hauptsächlich?|Sauerstoff|Zucker|Hormone|Antikörper|Der rote Blutfarbstoff Hämoglobin bindet Sauerstoff.
2|Wer entdeckte das Penicillin?|Alexander Fleming|Louis Pasteur|Robert Koch|Marie Curie|Fleming entdeckte es 1928 eher zufällig.
3|Wer erhielt als erste Person zwei Nobelpreise?|Marie Curie|Lise Meitner|Rosalind Franklin|Ada Lovelace|Physik 1903 und Chemie 1911.
3|Welcher Planet ist der heißeste im Sonnensystem?|Venus|Merkur|Mars|Jupiter|Die dichte CO₂-Atmosphäre der Venus hält die Hitze fest.
1|Wie nennt man den Übergang von flüssig zu gasförmig?|Verdampfen|Kondensieren|Gefrieren|Schmelzen|Kondensieren ist der umgekehrte Weg.
3|Wie nennt man den direkten Übergang von fest zu gasförmig?|Sublimation|Kondensation|Verdunstung|Schmelzen|Beispiel: Trockeneis.
3|Welches ist das häufigste Element im Universum?|Wasserstoff|Helium|Sauerstoff|Kohlenstoff|Etwa drei Viertel der normalen Materie ist Wasserstoff.
2|Welches dieser Tiere ist ein Amphib?|Frosch|Eidechse|Schlange|Schildkröte|Frösche leben an Land und im Wasser – die anderen sind Reptilien.
@gaming|Gaming|🎮
1|Wie heißt Nintendos Klempner mit der roten Mütze?|Mario|Luigi|Wario|Toad|Mario ist das Maskottchen von Nintendo.
1|Welche Farbe hat Luigis Mütze?|Grün|Rot|Blau|Gelb|Luigi ist Marios jüngerer Zwillingsbruder.
1|Welche Prinzessin muss Mario am häufigsten retten?|Peach|Zelda|Daisy|Rosalina|Prinzessin Peach regiert das Pilz-Königreich.
1|Wie heißt der Held in „The Legend of Zelda“?|Link|Zelda|Ganon|Epona|Viele denken, der Held heißt Zelda – das ist aber die Prinzessin.
1|Welche Farbe hat Sonic?|Blau|Rot|Grün|Gelb|Sonic ist ein blauer Igel.
2|Von welcher Firma stammt Sonic?|Sega|Nintendo|Sony|Capcom|Sonic erschien 1991 für den Sega Mega Drive.
1|Welches Pokémon ist das Maskottchen der Reihe?|Pikachu|Glumanda|Evoli|Mew|Pikachu ist das bekannteste Pokémon.
1|Welchen Typ hat Pikachu?|Elektro|Feuer|Wasser|Normal|Pikachu ist ein Elektro-Pokémon.
1|Wie heißen die grünen Monster in Minecraft, die explodieren?|Creeper|Enderman|Zombie|Skelett|Creeper schleichen sich an und explodieren.
2|Welchen Block braucht man für ein Netherportal in Minecraft?|Obsidian|Bruchstein|Netherrack|Diamantblock|Der Rahmen besteht aus Obsidian.
3|Woraus stellt man in Minecraft ein Enderauge her?|Enderperle und Lohenstaub|Enderperle und Redstone|Diamant und Gold|Schleimball und Lohenstaub|Lohenstaub stammt von Lohenruten aus dem Nether.
1|Welchen Boss besiegt man am Ende von Minecraft im End?|Enderdrache|Wither|Wächter|Warden|Nach dem Sieg über den Enderdrachen laufen die Credits.
1|Wie heißt das Genre, in dem viele Spieler kämpfen, bis nur einer übrig ist?|Battle Royale|MOBA|MMORPG|Roguelike|Der Name stammt von einem japanischen Film.
1|In welchem Spiel heißt der Sieg „Victory Royale“?|Fortnite|PUBG|Apex Legends|Call of Duty: Warzone|In PUBG gibt's dafür das „Chicken Dinner“.
1|Wofür steht „NPC“?|Non-Player Character|New Player Content|Network Play Control|Next Power Cycle|Figuren, die nicht von Spielern gesteuert werden.
1|Wofür steht „FPS“ als Spiele-Genre?|First-Person Shooter|Fast Player Speed|Free Play Season|Final Power Strike|Man sieht das Geschehen aus der Ich-Perspektive. (FPS heißt auch „Frames per Second“.)
1|Was bedeutet „GG“ im Gaming?|Good Game|Get Going|Great Goal|Go Go|Wird nach einem Match als faire Geste geschrieben.
1|Welches Spiel von 1980 hat einen gelben Kreis, der Punkte frisst?|Pac-Man|Space Invaders|Tetris|Donkey Kong|Pac-Man ist einer der größten Arcade-Klassiker.
2|Aus welchem Land stammt Tetris?|Sowjetunion|Japan|USA|Deutschland|Alexei Paschitnow entwickelte Tetris 1984 in Moskau.
3|Welcher dieser Namen gehört zu einem Geist aus Pac-Man?|Blinky|Sparky|Bonzo|Wobbly|Die Geister heißen Blinky, Pinky, Inky und Clyde.
1|Welche Firma stellt die PlayStation her?|Sony|Microsoft|Nintendo|Sega|Die erste PlayStation erschien 1994 in Japan.
1|Welche Firma stellt die Xbox her?|Microsoft|Sony|Nintendo|Valve|Die erste Xbox kam 2001 auf den Markt.
2|Wie heißt die Spieleplattform von Valve?|Steam|Origin|Uplay|Battle.net|Steam ist eine der größten PC-Spieleplattformen.
2|In welcher Spielereihe ist Los Santos ein Schauplatz?|Grand Theft Auto|Saints Row|Watch Dogs|Mafia|Los Santos ist an Los Angeles angelehnt.
3|Wie hieß Mario im ersten „Donkey Kong“ (1981)?|Jumpman|Mr. Video|Plumber|Mike|Erst später bekam er den Namen Mario.
2|In welchem Spiel muss man den gegnerischen „Nexus“ zerstören?|League of Legends|Dota 2|Overwatch|Rocket League|In Dota 2 heißt das Ziel „Ancient“.
2|Wie lautet der Untertitel von „The Elder Scrolls V“?|Skyrim|Oblivion|Morrowind|Daggerfall|Skyrim erschien 2011.
2|Wie heißt der Hauptcharakter von „God of War“?|Kratos|Atreus|Zeus|Ares|Atreus ist sein Sohn.
2|Wie heißt die Hauptfigur der „Halo“-Reihe?|Master Chief|Marcus Fenix|Doomguy|Commander Shepard|Sein Name ist John-117.
2|Was gibt dir in Super Mario ein Extraleben?|Grüner 1-Up-Pilz|Feuerblume|Stern|Roter Pilz|Der rote Pilz macht Mario groß.
2|Was bewirkt der Stern in Super Mario?|Kurzzeitige Unverwundbarkeit|Fliegen|Feuerbälle werfen|Größer werden|Mit dem Stern besiegt man Gegner durch Berührung.
1|Wie heißt Marios grüner Dino-Freund?|Yoshi|Toad|Boo|Koopa|Yoshi kann Gegner mit der Zunge verschlucken.
1|Wie heißt Marios großer Schildkröten-Erzfeind?|Bowser|Wario|Ganondorf|Kamek|Bowser ist König der Koopas.
1|Welche Nintendo-Konsole kann man unterwegs und am Fernseher spielen?|Nintendo Switch|Wii|GameCube|Nintendo 64|Die Switch steckt man dafür einfach ins Dock.
1|Wie heißen in „Among Us“ die Spieler, die heimlich sabotieren?|Impostor|Crewmates|Ghosts|Sheriffs|Die Crewmates müssen sie entlarven.
1|In welchem Spiel ist „Steve“ der Standard-Charakter?|Minecraft|Terraria|Roblox|Fortnite|Neben Steve gibt es auch Alex.
1|Wie heißt die Währung in Roblox?|Robux|V-Bucks|Coins|Gems|Mit Robux kauft man Items und Game-Pässe.
1|Wie heißt die Währung in Fortnite?|V-Bucks|Robux|Credits|Gems|V-Bucks gibt es für Skins und den Battle Pass.
1|Was ist ein „Speedrun“?|Ein Spiel so schnell wie möglich durchspielen|Ein Rennspiel|Ein Spiel ohne Pause|Ein Lauf-Minispiel|Speedrunner nutzen oft Tricks und Glitches.
2|Zu welchem Genre gehört „Dark Souls“?|Action-Rollenspiel|Rennspiel|Sportspiel|Puzzle|Die Reihe ist berühmt für ihren hohen Schwierigkeitsgrad.
3|Welches Studio entwickelte „The Witcher 3“?|CD Projekt Red|Ubisoft|Bethesda|BioWare|CD Projekt Red sitzt in Polen.
2|Wie heißt der Hexer in „The Witcher“?|Geralt von Riva|Rittersporn|Ciri|Vesemir|Ciri ist seine Ziehtochter.
3|In welchem Spiel gibt es die berühmte „Gravity Gun“?|Half-Life 2|Portal|Doom|Quake|Damit hebt man Gegenstände an und schleudert sie.
2|Was erzeugt man in „Portal“ mit der Portal-Kanone?|Zwei verbundene Portale|Schwarze Löcher|Eiswände|Feuerbälle|Was in ein Portal geht, kommt aus dem anderen heraus.
2|Welches Tier ist Crash Bandicoot?|Nasenbeutler|Fuchs|Igel|Waschbär|Ein Bandicoot ist ein Beuteltier aus Australien.
2|Welche zwei Teams treten in Counter-Strike an?|Terroristen und Counter-Terroristen|Rebellen und Imperium|Allianz und Horde|Blau und Rot|Das Bomben-Szenario ist der bekannteste Modus.
2|Welche zwei Fraktionen gibt es in „World of Warcraft“?|Allianz und Horde|Licht und Schatten|Rot und Blau|Terroristen und Counter-Terroristen|„Für die Horde!“ ist ein berühmter Schlachtruf.
@film|Filme & Serien|🎬
1|Wie heißt der Zauberschüler mit der Blitznarbe?|Harry Potter|Ron Weasley|Frodo Beutlin|Percy Jackson|Die Narbe stammt von Voldemorts Fluch.
1|In welches Haus kommt Harry Potter?|Gryffindor|Slytherin|Hufflepuff|Ravenclaw|Der Sprechende Hut schickt ihn nach Gryffindor.
1|Welcher Hobbit trägt den Ring nach Mordor?|Frodo|Bilbo|Pippin|Merry|Begleitet wird er von seinem Freund Sam.
1|Wer ist Luke Skywalkers Vater?|Darth Vader|Obi-Wan Kenobi|Han Solo|Yoda|„Ich bin dein Vater“ – eine der berühmtesten Film-Enthüllungen.
2|Welche Farbe hat Yodas Lichtschwert?|Grün|Blau|Rot|Lila|Lila ist das Lichtschwert von Mace Windu.
1|Wie heißt der Schneemann in „Die Eiskönigin“?|Olaf|Sven|Kristoff|Hans|Olaf liebt warme Umarmungen.
1|Welcher Superheld ist Peter Parker?|Spider-Man|Batman|Superman|Iron Man|Ein radioaktiver Spinnenbiss gab ihm seine Kräfte.
1|Welcher Superheld ist Bruce Wayne?|Batman|Superman|Spider-Man|Green Arrow|Batman beschützt Gotham City.
1|Welcher Held ist Tony Stark?|Iron Man|Captain America|Thor|Hulk|Tony Stark baut seine Rüstung selbst.
2|Wie heißt Thors Hammer?|Mjölnir|Excalibur|Gungnir|Durandal|Nur wer würdig ist, kann ihn heben.
1|Wie heißt Simbas Vater in „Der König der Löwen“?|Mufasa|Scar|Rafiki|Timon|Scar ist Mufasas Bruder.
1|Was für ein Fisch ist Nemo?|Clownfisch|Doktorfisch|Goldfisch|Kugelfisch|Clownfische leben in Seeanemonen.
1|Wie heißt der Vater bei den Simpsons?|Homer|Bart|Ned|Moe|Sein berühmter Ausruf: „D'oh!“
2|In welcher Stadt leben die Simpsons?|Springfield|Shelbyville|Quahog|South Park|Quahog ist die Stadt aus „Family Guy“.
1|Wer wohnt in einer Ananas ganz tief im Meer?|SpongeBob|Patrick|Thaddäus|Mr. Krabs|SpongeBob arbeitet in der Krossen Krabbe.
1|Wie heißt SpongeBobs bester Freund, ein Seestern?|Patrick Star|Thaddäus|Plankton|Gary|Gary ist SpongeBobs Schnecke.
2|In welcher Serie gibt es die „andere Seite“ (Upside Down)?|Stranger Things|Dark|The Witcher|Wednesday|Dort lebt auch der Demogorgon.
3|In welcher fiktiven Stadt spielt „Stranger Things“?|Hawkins|Derry|Riverdale|Springfield|Hawkins liegt im US-Bundesstaat Indiana.
2|Welcher Chemielehrer wird in „Breaking Bad“ zum Drogenboss?|Walter White|Jesse Pinkman|Saul Goodman|Gus Fring|Sein Deckname ist „Heisenberg“.
2|Auf welchem Kontinent steht in „Game of Thrones“ der Eiserne Thron?|Westeros|Essos|Mittelerde|Narnia|Die Hauptstadt ist Königsmund.
1|Wie heißt der graue Zauberer in „Der Herr der Ringe“?|Gandalf|Saruman|Dumbledore|Merlin|Später kehrt er als Gandalf der Weiße zurück.
2|Wie heißt Jack Sparrows Schiff in „Fluch der Karibik“?|Black Pearl|Flying Dutchman|Queen Anne's Revenge|Interceptor|Die Black Pearl hat schwarze Segel.
2|Wer führte Regie bei „Jurassic Park“ (1993)?|Steven Spielberg|James Cameron|George Lucas|Ridley Scott|Spielberg drehte auch „Der weiße Hai“ und „E.T.“
2|Wer führte Regie bei „Titanic“ (1997)?|James Cameron|Steven Spielberg|Christopher Nolan|Peter Jackson|Cameron drehte auch „Avatar“.
2|Wer erfand die „Star Wars“-Saga?|George Lucas|Steven Spielberg|J. J. Abrams|James Cameron|Der erste Film erschien 1977.
2|Wer spielt Jack Sparrow?|Johnny Depp|Orlando Bloom|Brad Pitt|Leonardo DiCaprio|Orlando Bloom spielt Will Turner.
1|Welche Nummer hat der Geheimagent James Bond?|007|001|008|700|„Die Doppelnull“ bedeutet die Lizenz zum Töten.
2|Wie heißt Scooby-Doos bester Freund?|Shaggy|Fred|Velma|Daphne|Shaggy und Scooby lieben Scooby-Snacks.
2|Wie heißt der vergessliche blaue Fisch in „Findet Nemo“?|Dorie|Marlin|Bruce|Crush|Marlin ist Nemos Vater.
1|Wie heißt der Cowboy in „Toy Story“?|Woody|Buzz|Rex|Slinky|Woody gehört dem Jungen Andy.
1|Wie heißt die Weltraum-Actionfigur in „Toy Story“?|Buzz Lightyear|Woody|Zurg|Jessie|„Bis zur Unendlichkeit und noch viel weiter!“
1|Welche Farbe haben die meisten Minions?|Gelb|Grün|Blau|Rot|Sie tragen außerdem blaue Latzhosen.
2|In welcher Serie trifft sich eine Clique im Café „Central Perk“?|Friends|How I Met Your Mother|Seinfeld|The Big Bang Theory|Friends lief von 1994 bis 2004.
1|In welcher Serie ist Sheldon Cooper Physiker?|The Big Bang Theory|How I Met Your Mother|Two and a Half Men|Brooklyn Nine-Nine|Sheldon hat „seinen“ Platz auf der Couch.
1|Welche Figur sagt immer „Ich bin Groot“?|Groot|Rocket|Drax|Star-Lord|Groot ist ein baumartiges Wesen.
1|Welcher Marvel-Held kämpft mit einem runden Schild?|Captain America|Iron Man|Black Panther|Hawkeye|Sein Schild besteht aus Vibranium.
2|Aus welchem Land kommt Black Panther?|Wakanda|Sokovia|Asgard|Latveria|Wakanda ist reich an Vibranium.
1|Welcher Bösewicht sammelt in „Avengers: Infinity War“ die Infinity-Steine?|Thanos|Loki|Ultron|Red Skull|Mit einem Fingerschnippen löscht er das halbe Leben aus.
2|Wie viele Infinity-Steine gibt es im Marvel-Filmuniversum?|6|5|7|4|Raum, Gedanken, Realität, Macht, Zeit und Seele.
1|Wie heißt die Zauberschule in „Harry Potter“?|Hogwarts|Durmstrang|Beauxbatons|Ilvermorny|Durmstrang und Beauxbatons nehmen am Trimagischen Turnier teil.
2|Wie heißt der Hauself, den Harry befreit?|Dobby|Kreacher|Winky|Hedwig|Dobby wird durch eine Socke frei.
1|Wie heißt der Zauberer, dessen Name „nicht genannt werden darf“?|Voldemort|Grindelwald|Draco|Snape|Sein echter Name ist Tom Riddle.
2|Wie heißt die Tochter der Addams Family, die eine eigene Netflix-Serie bekam?|Wednesday|Morticia|Enid|Lurch|Morticia ist ihre Mutter.
1|Wie heißt der grüne Oger, dessen bester Freund ein Esel ist?|Shrek|Grinch|Hulk|Gru|Shrek lebt in einem Sumpf.
1|Welcher Bösewicht hat die Minions als Helfer?|Gru|Vector|Dr. Nefario|El Macho|Aus „Ich – Einfach unverbesserlich“.
2|Wie heißt Keanu Reeves’ Figur in „Matrix“?|Neo|Morpheus|Trinity|Agent Smith|Sein echter Name im Film ist Thomas Anderson.
2|Welche Pille schluckt Neo in „Matrix“?|Die rote|Die blaue|Die grüne|Die gelbe|Die rote Pille zeigt ihm die Wahrheit.
@musik|Musik|🎵
1|Wie viele Saiten hat eine normale Gitarre?|6|4|5|8|Standard-Stimmung: E A D G H E.
2|Wie viele Saiten hat ein E-Bass üblicherweise?|4|6|3|8|Es gibt auch 5- und 6-saitige Bässe, Standard sind aber 4.
2|Wie viele Tasten hat ein Standard-Klavier?|88|76|61|100|52 weiße und 36 schwarze Tasten.
1|In welcher Stadt wurde Wolfgang Amadeus Mozart geboren?|Salzburg|Wien|Linz|Innsbruck|Mozart wurde 1756 in Salzburg geboren.
2|Welcher Komponist wurde taub und komponierte trotzdem weiter?|Ludwig van Beethoven|Wolfgang Amadeus Mozart|Johann Sebastian Bach|Joseph Haydn|Seine 9. Sinfonie schrieb er fast völlig taub.
3|Wie viele Sinfonien hat Beethoven vollendet?|9|5|7|12|Die 9. enthält die „Ode an die Freude“.
2|Wer komponierte „Die Zauberflöte“?|Mozart|Beethoven|Wagner|Verdi|Die Oper wurde 1791 in Wien uraufgeführt.
2|Wer komponierte den Walzer „An der schönen blauen Donau“?|Johann Strauss (Sohn)|Joseph Haydn|Franz Schubert|Gustav Mahler|Er wird jedes Jahr beim Neujahrskonzert gespielt.
3|Wer komponierte die Melodie des „Deutschlandlieds“?|Joseph Haydn|Mozart|Beethoven|Richard Wagner|Ursprünglich war es Haydns „Kaiserhymne“ für Österreich.
1|Aus wie vielen Linien besteht ein Notensystem?|5|4|6|7|Die fünf Linien heißen Notenlinien.
1|Welche Band bestand aus John, Paul, George und Ringo?|The Beatles|The Rolling Stones|Queen|The Who|Lennon, McCartney, Harrison und Starr.
2|Aus welcher Stadt stammen die Beatles?|Liverpool|London|Manchester|Birmingham|Bekannt wurden sie im Cavern Club in Liverpool.
1|Wer war der Sänger von Queen?|Freddie Mercury|Brian May|Mick Jagger|David Bowie|Brian May war der Gitarrist.
1|Wer wird „King of Pop“ genannt?|Michael Jackson|Elvis Presley|Prince|Justin Timberlake|Berühmt ist auch sein Moonwalk.
1|Wer wird „King of Rock 'n' Roll“ genannt?|Elvis Presley|Michael Jackson|Chuck Berry|Johnny Cash|Oft einfach „The King“.
1|Zu welcher Instrumentengruppe gehört die Trompete?|Blechblasinstrumente|Holzblasinstrumente|Streichinstrumente|Schlaginstrumente|Der Ton entsteht durch die Lippen am Mundstück.
3|Zu welcher Gruppe zählt das Saxophon, obwohl es aus Metall ist?|Holzblasinstrumente|Blechblasinstrumente|Streichinstrumente|Tasteninstrumente|Der Ton entsteht durch ein Holzblatt, wie bei der Klarinette.
2|Welches ist das tiefste Streichinstrument im Orchester?|Kontrabass|Cello|Bratsche|Geige|Der Kontrabass wird im Stehen gespielt.
1|Wie viele Musiker spielen in einem Quartett?|4|3|5|8|Trio = 3, Quartett = 4, Quintett = 5.
2|Was bedeutet „forte“ in der Musik?|Laut|Leise|Schnell|Langsam|Abkürzung: f. „Fortissimo“ = sehr laut.
2|Was bedeutet „piano“ als Spielanweisung?|Leise|Laut|Schnell|Gebunden|Abkürzung: p. Das Klavier hieß ursprünglich „Pianoforte“.
3|Wie heißt der deutsche Ton „H“ auf Englisch?|B|A|C|G|Das deutsche „B“ ist im Englischen „B flat“.
3|Wie viele Halbtonschritte hat eine Oktave?|12|8|7|10|Zähl auf dem Klavier alle weißen und schwarzen Tasten einer Oktave.
2|Welcher Musikstil stammt aus Jamaika?|Reggae|Samba|Flamenco|Polka|Bob Marley machte Reggae weltberühmt.
2|Aus welchem Land stammt der Tango?|Argentinien|Spanien|Brasilien|Mexiko|Er entstand am Río de la Plata in Buenos Aires und Montevideo.
1|Welche Band sang „Bohemian Rhapsody“?|Queen|The Beatles|ABBA|Pink Floyd|Der Song erschien 1975.
1|Aus welchem Land kommt ABBA?|Schweden|Norwegen|Dänemark|Finnland|ABBA gewann 1974 den Song Contest mit „Waterloo“.
1|Wer sang „Thriller“?|Michael Jackson|Prince|Madonna|Whitney Houston|„Thriller“ gilt als eines der meistverkauften Alben aller Zeiten.
2|Welcher Rapper heißt mit bürgerlichem Namen Marshall Mathers?|Eminem|50 Cent|Dr. Dre|Snoop Dogg|Sein Alter Ego heißt „Slim Shady“.
2|Welche Sängerin veröffentlichte das Album „1989“?|Taylor Swift|Adele|Katy Perry|Rihanna|Benannt nach ihrem Geburtsjahr.
2|Wer sang „Rolling in the Deep“?|Adele|Amy Winehouse|Lady Gaga|Beyoncé|Der Song stammt vom Album „21“.
2|Wie beginnt die österreichische Bundeshymne?|Land der Berge, Land am Strome|Einigkeit und Recht und Freiheit|Trittst im Morgenrot daher|Gott erhalte, Gott beschütze|„Einigkeit und Recht und Freiheit“ ist die deutsche Hymne.
2|Wer komponierte „Die vier Jahreszeiten“?|Antonio Vivaldi|Johann Sebastian Bach|Georg Friedrich Händel|Mozart|Vivaldi war ein italienischer Barockkomponist.
3|Welche Band veröffentlichte „The Dark Side of the Moon“?|Pink Floyd|Led Zeppelin|The Doors|Genesis|Das Album mit dem Prisma-Cover erschien 1973.
3|Wer sang „Purple Rain“?|Prince|David Bowie|Stevie Wonder|Lionel Richie|Auch ein Film mit Prince heißt so.
2|Welche Band sang „Smells Like Teen Spirit“?|Nirvana|Pearl Jam|Green Day|Metallica|Sänger war Kurt Cobain.
2|Wer ist der Sänger der Rolling Stones?|Mick Jagger|Keith Richards|Paul McCartney|Roger Daltrey|Keith Richards ist Gitarrist der Band.
2|Welcher österreichische Musiker sang „Rock Me Amadeus“?|Falco|Udo Jürgens|Rainhard Fendrich|DJ Ötzi|Der Song war 1986 Nummer 1 in den USA.
3|Mit welchem Lied gewann Conchita Wurst 2014 den Song Contest?|Rise Like a Phoenix|Waterloo|Euphoria|Arcade|Es war Österreichs zweiter Sieg nach 1966.
1|Welches Instrument spielt man mit einem Bogen?|Geige|Gitarre|Trompete|Harfe|Auch Bratsche, Cello und Kontrabass streicht man mit Bogen.
2|Wie viele Schläge hat ein Takt im 3/4-Takt?|3|4|2|6|Der Walzer ist der bekannteste Tanz im 3/4-Takt.
2|Welche ist die höchste Frauenstimmlage?|Sopran|Alt|Tenor|Bass|Tenor und Bass sind Männerstimmen.
3|Welche ist die übliche höchste Männerstimmlage?|Tenor|Bariton|Bass|Alt|Von hoch nach tief: Tenor, Bariton, Bass.
2|Welches Tasteninstrument erzeugt Töne mit Luft in Pfeifen?|Orgel|Klavier|Cembalo|Synthesizer|Große Kirchenorgeln haben Tausende Pfeifen.
@tech|Technik|💡
1|Wofür steht „WWW“?|World Wide Web|World Wireless Web|Wide World Window|Web World Wide|Erfunden 1989 von Tim Berners-Lee am CERN.
1|Wofür steht „CPU“?|Central Processing Unit|Computer Power Unit|Central Program Utility|Core Processing User|Die CPU ist der Hauptprozessor.
2|Wofür steht „RAM“?|Random Access Memory|Read And Modify|Rapid Action Memory|Run All Memory|Arbeitsspeicher, der beim Ausschalten gelöscht wird.
1|Wofür steht „GPU“?|Graphics Processing Unit|General Power Unit|Game Processing Utility|Graphic Program User|Die Grafikkarte berechnet Bilder.
1|Wie viele Bit hat ein Byte?|8|4|10|16|Mit 8 Bit kann man 256 Werte darstellen.
3|Wie viele Byte hat ein Kibibyte (KiB)?|1024|1000|512|2048|1 KiB = 2¹⁰ Byte, 1 kB = 1000 Byte.
1|In welcher Einheit misst man elektrische Spannung?|Volt|Ampere|Ohm|Watt|Formelzeichen: U.
1|In welcher Einheit misst man elektrische Stromstärke?|Ampere|Volt|Watt|Ohm|Formelzeichen: I.
2|In welcher Einheit misst man den elektrischen Widerstand?|Ohm|Volt|Farad|Henry|Formelzeichen: R, Einheitenzeichen: Ω.
2|In welcher Einheit misst man elektrische Leistung?|Watt|Joule|Ampere|Volt|P = U · I, also Volt mal Ampere.
2|Wie lautet das Ohmsche Gesetz?|U = R · I|U = R / I|I = U · R|R = U · I|Daraus folgt auch I = U / R und R = U / I.
2|Welche Spannung hat eine normale Steckdose in Österreich?|230 V|110 V|400 V|12 V|In den USA sind es etwa 120 V.
2|Welche Frequenz hat das Stromnetz in Europa?|50 Hz|60 Hz|100 Hz|230 Hz|In Nordamerika sind es 60 Hz.
2|Welche Farbe hat der Schutzleiter (PE)?|Grün-Gelb|Blau|Braun|Schwarz|Grün-Gelb ist ausschließlich für den Schutzleiter reserviert.
2|Welche Farbe hat der Neutralleiter (N)?|Blau|Grün-Gelb|Braun|Schwarz|Außenleiter sind meist braun, schwarz oder grau.
3|Welche Spannung liegt im österreichischen Niederspannungsnetz zwischen zwei Außenleitern?|400 V|230 V|690 V|110 V|230 V × √3 ≈ 400 V beim Drehstrom.
2|Welches Bauteil lässt Strom nur in eine Richtung durch?|Diode|Kondensator|Widerstand|Spule|Die Richtung erkennt man am Ring auf dem Gehäuse (Kathode).
2|Was speichert ein Kondensator?|Elektrische Ladung|Wärme|Licht|Schall|Seine Kapazität misst man in Farad.
2|Wofür steht „LED“?|Light Emitting Diode|Low Energy Device|Light Electric Display|Laser Emitting Diode|Eine LED ist eine Diode, die Licht abgibt.
1|Mit welchem Zahlensystem rechnen Computer intern?|Binärsystem|Dezimalsystem|Römische Zahlen|Zwölfersystem|Nur mit 0 und 1.
3|Welcher Dezimalzahl entspricht 1010 im Binärsystem?|10|8|12|5|8 + 0 + 2 + 0 = 10.
2|Wofür steht „USB“?|Universal Serial Bus|United System Board|Universal Speed Bridge|Ultra Serial Base|USB gibt es seit Mitte der 1990er.
1|Wer gründete Microsoft zusammen mit Paul Allen?|Bill Gates|Steve Jobs|Mark Zuckerberg|Elon Musk|Microsoft wurde 1975 gegründet.
1|Wer gründete Apple unter anderem mit Steve Wozniak?|Steve Jobs|Bill Gates|Larry Page|Jeff Bezos|Apple wurde 1976 gegründet.
2|Wofür steht „HTML“?|HyperText Markup Language|High Tech Modern Language|HyperTool Multi Language|Home Text Making Language|Damit baut man Webseiten.
1|Welches Smartphone-Betriebssystem stammt von Google?|Android|iOS|Windows|Symbian|iOS ist von Apple.
1|Was ist ein „Bug“ in einer Software?|Ein Programmfehler|Ein Virus|Ein Update|Ein Kabel|„Bug“ heißt wörtlich Käfer.
2|Wofür steht „PDF“?|Portable Document Format|Print Data File|Public Document File|Personal Data Format|Entwickelt von Adobe.
2|Wofür steht „IP“ in IP-Adresse?|Internet Protocol|Internal Port|Internet Provider|Intelligent Path|Jedes Gerät im Netz braucht eine IP-Adresse.
1|Mit welchem Messgerät misst man elektrische Spannung?|Voltmeter|Thermometer|Barometer|Tachometer|Ein Multimeter kann es auch.
3|Wie schließt man ein Amperemeter an?|In Reihe zum Verbraucher|Parallel zum Verbraucher|Nur am Schutzleiter|Gar nicht, es misst per Funk|Der Strom muss durch das Messgerät fließen.
3|Wie schließt man ein Voltmeter an?|Parallel zum Verbraucher|In Reihe zum Verbraucher|Nur am Schutzleiter|Zwischen zwei Sicherungen|Spannung ist ein Unterschied zwischen zwei Punkten.
3|Was gilt für den Gesamtwiderstand in einer Reihenschaltung?|Die Einzelwiderstände addieren sich|Er ist kleiner als der kleinste|Er ist gleich dem größten|Er ist immer null|R = R1 + R2 + …
3|Wofür steht „FI“ beim FI-Schutzschalter?|Fehlerstrom|Frequenz-Impuls|Feuer-Indikator|Funk-Interface|Er schaltet ab, wenn Strom über einen falschen Weg abfließt.
1|Welches Metall wird am häufigsten für Stromkabel verwendet?|Kupfer|Eisen|Gold|Blei|Kupfer leitet sehr gut und ist gut biegbar.
3|Nach welchem Erfinder ist die Einheit der magnetischen Flussdichte benannt?|Nikola Tesla|Thomas Edison|Alessandro Volta|James Watt|Die Einheit heißt Tesla (T).
2|Nach wem ist die Einheit Volt benannt?|Alessandro Volta|André-Marie Ampère|Georg Simon Ohm|James Watt|Volta baute um 1800 die erste Batterie.
2|Was ist ein Transistor?|Ein Halbleiter-Bauteil zum Schalten und Verstärken|Eine Batterie|Ein Lautsprecher|Eine Schmelzsicherung|Moderne Chips enthalten Milliarden davon.
1|Wofür steht „KI“?|Künstliche Intelligenz|Kabel-Interface|Kontrollierte Information|Komplexe Installation|Englisch: AI = Artificial Intelligence.
3|Welche Programmiersprache ist nach einer Comedy-Truppe benannt?|Python|Java|Ruby|C++|Benannt nach Monty Python, nicht nach der Schlange.
2|Was bedeutet „Open Source“?|Der Quellcode ist öffentlich|Das Programm ist immer online|Es gibt kein Passwort|Es läuft nur im Browser|Jeder darf den Code ansehen und oft auch verändern.
1|Mit welcher Tastenkombination kopiert man unter Windows?|Strg + C|Strg + V|Strg + X|Strg + Z|Strg + V fügt ein, Strg + X schneidet aus, Strg + Z macht rückgängig.
2|Wofür steht „SSD“?|Solid State Drive|Super Speed Disk|System Storage Device|Silicon Smart Drive|SSDs haben keine beweglichen Teile.
2|Welche Farbe hat ein Außenleiter (L) in der Hausinstallation meistens?|Braun|Blau|Grün-Gelb|Weiß|Auch Schwarz und Grau sind für Außenleiter üblich.
@sport|Sport|⚽
1|Wie viele Spieler einer Fußballmannschaft stehen auf dem Feld?|11|10|9|12|10 Feldspieler und ein Torhüter.
1|Wie lange dauert ein reguläres Fußballspiel?|90 Minuten|60 Minuten|80 Minuten|100 Minuten|Zwei Halbzeiten zu je 45 Minuten plus Nachspielzeit.
1|Wie viele Spieler pro Team stehen beim Basketball auf dem Feld?|5|6|7|4|Dazu kommen Auswechselspieler auf der Bank.
2|Wie viele Spieler pro Team stehen beim Hallenvolleyball auf dem Feld?|6|5|7|4|Beim Beachvolleyball sind es nur 2.
1|Wie viele Ringe hat das olympische Symbol?|5|4|6|7|Die Ringe stehen für die Kontinente.
1|Alle wie viele Jahre finden Olympische Sommerspiele normalerweise statt?|4|2|3|5|Winter- und Sommerspiele wechseln sich im 2-Jahres-Abstand ab.
1|Bei welcher Sportart spielt man mit einem Puck?|Eishockey|Curling|Rugby|Handball|Der Puck ist eine Hartgummischeibe.
2|Wie viele Punkte bringt ein Touchdown im American Football?|6|3|7|2|Danach gibt es noch einen Extrapunkt-Versuch.
1|Wie viele Punkte zählt ein Wurf von hinter der Dreierlinie?|3|2|4|1|Normale Würfe zählen 2, Freiwürfe 1 Punkt.
2|Wie heißt der Spielstand 40:40 im Tennis?|Einstand|Vorteil|Love|Tiebreak|Englisch „Deuce“. Man braucht dann zwei Punkte in Folge.
2|Was bedeutet „Love“ im Tennis?|Null Punkte|Ein Punkt|Satzball|Einstand|„15 – Love“ heißt 15:0.
2|Wie viele Löcher hat eine normale Golfrunde?|18|9|12|20|Viele Plätze haben auch kürzere 9-Loch-Runden.
2|Wie lang ist ein Marathon?|42,195 km|40 km|21,1 km|50 km|21,1 km ist der Halbmarathon.
1|Wie viele Pins stehen beim Bowling?|10|9|12|8|Beim klassischen Kegeln sind es dagegen 9.
1|Welche Karte bedeutet im Fußball einen Platzverweis?|Rote Karte|Gelbe Karte|Grüne Karte|Blaue Karte|Zwei Gelbe Karten ergeben ebenfalls Gelb-Rot.
2|Wie viele Spieler pro Team stehen beim Handball auf dem Feld?|7|6|11|5|6 Feldspieler und ein Torwart.
2|Wie viele Spieler pro Team stehen beim Eishockey auf dem Eis?|6|5|7|11|5 Feldspieler und ein Goalie.
1|In welcher Sportart gibt es den „Slam Dunk“?|Basketball|Volleyball|Tennis|Baseball|Dabei wird der Ball von oben in den Korb gestopft.
1|In welcher Sportart gibt es den „Home Run“?|Baseball|Cricket|Rugby|Golf|Der Schlagmann umrundet alle Bases.
2|In welcher Sportart gibt es „Strike“ und „Spare“?|Bowling|Darts|Billard|Golf|Strike: alle 10 Pins mit dem ersten Wurf.
2|Was ist beim Darts die höchste Punktzahl mit drei Pfeilen?|180|150|160|200|Dreimal Triple 20 = 180.
3|Wie viele Punkte bringt das Bullseye (Mitte) beim Darts?|50|25|100|60|Der äußere grüne Ring („Single Bull“) bringt 25.
3|Wie viele Punkte hat ein perfektes Spiel beim Bowling?|300|200|250|400|12 Strikes in Folge.
3|Wie viele Sätze muss man im Hallenvolleyball gewinnen?|3|2|4|5|Gespielt wird auf drei Gewinnsätze.
1|Welche Sportart wird beim Turnier in Wimbledon gespielt?|Tennis|Golf|Cricket|Polo|Gespielt wird dort auf Rasen.
3|In welchem Land fand die erste Fußball-WM 1930 statt?|Uruguay|Brasilien|Italien|England|Uruguay wurde auch erster Weltmeister.
2|Wie lange dauert ein Drittel im Eishockey?|20 Minuten|15 Minuten|25 Minuten|30 Minuten|Drei Drittel à 20 Minuten effektive Spielzeit.
2|In wie viele Viertel ist ein Basketballspiel eingeteilt?|4|2|3|6|Bei Gleichstand folgt eine Verlängerung.
3|Wie lange dauert ein Viertel im FIBA-Basketball?|10 Minuten|12 Minuten|15 Minuten|8 Minuten|In der NBA sind es 12 Minuten.
1|Was ist ein „Hattrick“ im Fußball?|Drei Tore eines Spielers in einem Spiel|Drei Gelbe Karten|Ein Tor per Fallrückzieher|Drei Eckbälle in Folge|Beim „lupenreinen“ Hattrick fallen die Tore direkt nacheinander.
2|Welche Wintersportart kombiniert Langlauf und Schießen?|Biathlon|Nordische Kombination|Skispringen|Super-G|Bei jedem Fehlschuss gibt's eine Strafrunde oder Strafzeit.
3|Welche Disziplinen vereint die Nordische Kombination?|Skispringen und Langlauf|Langlauf und Schießen|Abfahrt und Slalom|Eisschnelllauf und Langlauf|Langlauf mit Schießen ist Biathlon.
1|Welche Disziplinen gehören zum Triathlon?|Schwimmen, Radfahren, Laufen|Laufen, Springen, Werfen|Schwimmen, Rudern, Laufen|Radfahren, Schießen, Laufen|Immer in dieser Reihenfolge.
2|Wie lang ist eine Runde auf einer Standard-Laufbahn (Innenbahn)?|400 m|200 m|500 m|1000 m|In der Halle sind es meist 200 m.
3|Wie viele Spieler stehen bei Rugby Union pro Team auf dem Feld?|15|11|13|9|Bei Rugby League sind es 13.
3|Welche japanische Kampfsportart bedeutet „sanfter Weg“?|Judo|Karate|Sumo|Kendo|„Ju“ = sanft, „Do“ = Weg.
2|Aus welchem Land stammt Taekwondo?|Korea|Japan|China|Thailand|Taekwondo ist Nationalsport in Südkorea.
1|Mit wie vielen Figuren beginnt jeder Spieler beim Schach?|16|12|20|8|8 Bauern, 2 Türme, 2 Springer, 2 Läufer, Dame und König.
2|In welcher Sportart gibt es „Birdie“ und „Eagle“?|Golf|Tennis|Badminton|Cricket|Birdie = 1 Schlag unter Par, Eagle = 2 unter Par.
1|Womit spielt man Badminton?|Federball|Filzball|Puck|Gummiring|Der Federball heißt auch Shuttlecock.
2|Welche alpine Ski-Disziplin hat die engsten Kurven?|Slalom|Abfahrt|Super-G|Riesenslalom|Die Abfahrt ist am schnellsten und hat die wenigsten Tore.
2|Welche Farbe hat das Trikot des Gesamtführenden der Tour de France?|Gelb|Grün|Rosa|Weiß|Rosa trägt der Führende beim Giro d'Italia.
1|Wie viele Punkte gibt es in Fußball-Ligen üblicherweise für einen Sieg?|3|2|1|4|Ein Unentschieden bringt 1 Punkt.
3|Wie viele Spieler pro Team sind beim Wasserball im Wasser?|7|6|5|8|6 Feldspieler und ein Torwart.
@logik|Logik|🧩
1|Welche Zahl kommt als nächstes: 2, 4, 6, 8, …?|10|12|9|14|Es wird immer 2 addiert.
1|Welche Zahl folgt: 1, 2, 4, 8, 16, …?|32|24|20|64|Jede Zahl wird verdoppelt.
2|Welche Zahl folgt: 1, 1, 2, 3, 5, 8, …?|13|11|12|16|Fibonacci: Jede Zahl ist die Summe der zwei vorigen (5 + 8).
2|Welche Zahl folgt: 1, 4, 9, 16, 25, …?|36|30|35|49|Quadratzahlen: 6 × 6 = 36.
1|Welche Zahl folgt: 3, 6, 12, 24, …?|48|36|30|42|Jede Zahl wird verdoppelt.
2|Welche Zahl folgt: 2, 3, 5, 7, 11, …?|13|12|15|17|Das sind die Primzahlen.
3|Welche Zahl folgt: 100, 90, 81, 73, …?|66|65|64|67|Es wird 10, 9, 8 und dann 7 abgezogen.
1|Was ist 7 × 8?|56|54|48|64|7 × 8 = 56.
2|Wie viel sind 15 % von 200?|30|15|20|35|10 % sind 20, 5 % sind 10 – zusammen 30.
2|3 Katzen fangen 3 Mäuse in 3 Minuten. Wie lange brauchen 100 Katzen für 100 Mäuse?|3 Minuten|100 Minuten|33 Minuten|1 Minute|Jede Katze braucht 3 Minuten für eine Maus.
3|Schläger und Ball kosten zusammen 1,10 €. Der Schläger kostet 1 € mehr als der Ball. Was kostet der Ball?|5 Cent|10 Cent|1 Cent|15 Cent|Ball 0,05 € + Schläger 1,05 € = 1,10 €.
2|Wie viele Monate haben 28 Tage?|Alle 12|1|2|6|Jeder Monat hat mindestens 28 Tage.
2|Du überholst im Rennen den Zweiten. Auf welchem Platz bist du jetzt?|Zweiter|Erster|Dritter|Letzter|Du nimmst seinen Platz ein – der Erste ist immer noch vorne.
2|Marias Vater hat fünf Töchter: Lala, Lele, Lili und Lolo. Wie heißt die fünfte?|Maria|Lulu|Lilo|Lyly|Steht schon in der Frage: Maria!
1|Was ist schwerer: 1 kg Federn oder 1 kg Eisen?|Beide gleich|Eisen|Federn|Kommt aufs Wetter an|1 kg ist 1 kg.
3|Seerosen verdoppeln täglich ihre Fläche. Nach 48 Tagen ist der Teich voll. Wann war er halb voll?|Nach 47 Tagen|Nach 24 Tagen|Nach 46 Tagen|Nach 12 Tagen|Einen Tag vor voll war er halb voll.
2|Heute ist Montag. Welcher Wochentag ist in 10 Tagen?|Donnerstag|Mittwoch|Freitag|Dienstag|In 7 Tagen ist wieder Montag, plus 3 Tage = Donnerstag.
1|Was ist die Hälfte von einem Viertel?|Ein Achtel|Ein Sechstel|Ein Halb|Ein Zwölftel|1/4 : 2 = 1/8.
2|Wie viel ist 2 hoch 10?|1024|1000|512|2048|2¹⁰ = 1024.
1|Was passt nicht: Apfel, Birne, Karotte, Kirsche?|Karotte|Apfel|Birne|Kirsche|Die Karotte ist Gemüse, der Rest Obst.
1|Was passt nicht: Hund, Katze, Adler, Pferd?|Adler|Hund|Katze|Pferd|Der Adler ist ein Vogel, die anderen sind Säugetiere.
2|Was passt nicht: 2, 3, 5, 9, 11?|9|2|3|11|9 = 3 × 3 ist keine Primzahl.
2|Was passt nicht: Quadrat, Dreieck, Würfel, Kreis?|Würfel|Quadrat|Dreieck|Kreis|Der Würfel ist ein Körper, die anderen sind flache Formen.
2|Ein Zug fährt 60 km/h. Wie weit kommt er in 2,5 Stunden?|150 km|120 km|160 km|125 km|60 × 2,5 = 150.
1|Wie viele Minuten sind 2,5 Stunden?|150|130|250|120|2 × 60 + 30 = 150.
3|Ein Vater ist 30 Jahre älter als sein Sohn. In 5 Jahren ist er dreimal so alt. Wie alt ist der Sohn jetzt?|10|5|15|20|In 5 Jahren: Sohn 15, Vater 45 – genau dreimal so alt.
3|5 Personen geben sich alle gegenseitig einmal die Hand. Wie viele Handschläge sind das?|10|20|25|15|5 × 4 : 2 = 10.
1|Was ist größer: 0,5 oder 0,45?|0,5|0,45|Beide gleich|Kann man nicht sagen|0,5 = 0,50 und das ist mehr als 0,45.
2|Wie viel ist 1/2 + 1/3?|5/6|2/5|1/6|2/3|3/6 + 2/6 = 5/6.
2|Ein T-Shirt kostet 20 € und wird um 25 % reduziert. Was kostet es dann?|15 €|5 €|16 €|18 €|25 % von 20 € sind 5 €.
3|Ein Preis steigt um 10 % und sinkt danach um 10 %. Wie ist er im Vergleich zum Anfang?|1 % niedriger|Gleich|1 % höher|10 % niedriger|1,1 × 0,9 = 0,99.
2|Alle Blips sind Blops, alle Blops sind Blups. Sind dann alle Blips Blups?|Ja|Nein|Nur manche|Nur am Wochenende|Wenn A ⊂ B und B ⊂ C, dann A ⊂ C.
3|Wenn es regnet, ist die Straße nass. Die Straße ist nass. Muss es also regnen?|Nein|Ja|Nur tagsüber|Nur im Winter|Die Straße kann auch aus anderen Gründen nass sein.
3|Welcher Buchstabe folgt: Z, X, V, T, …?|R|S|Q|U|Rückwärts durchs Alphabet, immer einen überspringen.
1|Welcher Buchstabe folgt: A, C, E, G, …?|I|H|J|K|Immer einen Buchstaben überspringen.
2|Was ist die kleinste Primzahl?|2|1|3|0|1 ist keine Primzahl – 2 ist die einzige gerade Primzahl.
3|Wie viele Sekunden hat ein Tag?|86.400|36.000|864.000|8.640|24 × 60 × 60 = 86.400.
2|Welchen Winkel bilden die Uhrzeiger um genau 3:00 Uhr?|90°|180°|45°|60°|Ein Viertel des Kreises.
1|Wie groß ist die Winkelsumme in einem Dreieck?|180°|360°|90°|270°|Im Viereck sind es 360°.
1|Wie viel ist 12 × 12?|144|124|132|156|Ein „Gros“ sind 144 Stück.
2|Welche Zahl folgt: 1, 3, 6, 10, 15, …?|21|20|25|18|Es wird +2, +3, +4, +5 und dann +6 gerechnet.
2|Ein Bauer hat 17 Schafe. Alle bis auf 9 laufen weg. Wie viele bleiben?|9|8|17|0|„Alle bis auf 9“ heißt: 9 bleiben.
2|Wie groß ist die Quersumme von 2026?|10|8|12|26|2 + 0 + 2 + 6 = 10.
2|4 Arbeiter brauchen 8 Stunden für eine Mauer. Wie lange brauchen 8 gleich schnelle Arbeiter?|4 Stunden|16 Stunden|8 Stunden|2 Stunden|Doppelt so viele Arbeiter – halbe Zeit.
2|Welche dieser Zahlen ist durch 3 teilbar?|111|100|202|302|Quersumme 3 ist durch 3 teilbar: 111 = 3 × 37.`;

const TOPICS = [];
const BANK = [];
(function parse(){
  let T = null, n = 0;
  RAW.split('\n').forEach(line => {
    line = line.trim(); if(!line) return;
    if(line[0] === '@'){ const p = line.slice(1).split('|'); T = { id: p[0], name: p[1], icon: p[2] }; TOPICS.push(T); n = 0; return; }
    const p = line.split('|').map(s => s.trim());
    if(!T || p.length !== 7) return;
    BANK.push({ id: T.id + '-' + (n++), t: T.id, d: Math.min(3, Math.max(1, +p[0] || 1)), q: p[1], a: [p[2], p[3], p[4], p[5]], c: 0, e: p[6] });
  });
})();
const TOPIC = {}; TOPICS.forEach(t => TOPIC[t.id] = t);
const DIFFS = ['Leicht', 'Mittel', 'Schwer', 'Mix'];
const LETTERS = ['A', 'B', 'C', 'D'];

/* ---------- Helfer ---------- */
const sshuffle = (arr, rng) => { const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = n => Math.round(n).toLocaleString('de-AT');
const b64e = s => { const by = new TextEncoder().encode(s); let bin = ''; for(let i = 0; i < by.length; i++) bin += String.fromCharCode(by[i]); return btoa(bin); };
const b64d = s => { const bin = atob(s); const by = new Uint8Array(bin.length); for(let i = 0; i < bin.length; i++) by[i] = bin.charCodeAt(i); return new TextDecoder().decode(by); };

/* Frage prüfen/säubern (für KI, Import und Editor). Gibt {q,a,c,e} oder null zurück. */
function cleanQ(o){
  if(!o || typeof o !== 'object') return null;
  const q = String(o.q == null ? '' : o.q).trim().slice(0, 240);
  const a = Array.isArray(o.a) ? o.a.map(x => String(x == null ? '' : x).trim().slice(0, 120)) : [];
  const c = Number(o.c);
  if(q.length < 2 || a.length !== 4 || a.some(x => !x)) return null;
  if(new Set(a.map(x => x.toLowerCase())).size !== 4) return null;
  if(!Number.isInteger(c) || c < 0 || c > 3) return null;
  return { q, a, c, e: String(o.e == null ? '' : o.e).trim().slice(0, 300) };
}
const TIME_OPTS = [10, 15, 20, 30, 45, 60];
const PTS_OPTS = [50, 100, 200, 500, 1000];
function cleanQuiz(o){
  if(!o || typeof o !== 'object') return null;
  const title = String(o.title == null ? '' : o.title).trim().slice(0, 60);
  const qs = (Array.isArray(o.qs) ? o.qs : []).slice(0, 50).map(cleanQ).filter(Boolean);
  if(!title || !qs.length) return null;
  let time = Math.round(Number(o.time)); if(!(time >= 5 && time <= 120)) time = 20;
  let pts = Math.round(Number(o.pts)); if(!(pts >= 10 && pts <= 1000)) pts = 100;
  return { title, qs, time, pts };
}

/* ---------- CSS ---------- */
const CSS = `
.qz-wrap{display:flex;flex-direction:column;gap:14px}
.qz-hero{padding:22px 16px}
.qz-hero-ic{font-size:58px;line-height:1;filter:drop-shadow(0 0 18px rgba(0,229,255,.6))}
.qz-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.qz-tile{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:100px;padding:13px;border-radius:var(--r);
  background:var(--glass);border:1px solid var(--line-2);text-align:left;transition:transform .15s,border-color .2s,box-shadow .2s;position:relative;overflow:hidden}
.qz-tile:active{transform:scale(.96)}
.qz-tile::after{content:"";position:absolute;right:-30px;top:-30px;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.25),transparent 70%);pointer-events:none}
.qz-tile .ic{font-size:28px;line-height:1.1}
.qz-tile b{font-family:var(--head);font-size:18px;letter-spacing:.04em;text-transform:uppercase;line-height:1.1}
.qz-tile small{color:var(--mute);font-size:13px;line-height:1.3}
.qz-tile.ai{border-color:var(--cyan);box-shadow:var(--glow-c)}
.qz-daily{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px}
.qz-daily .ic{font-size:36px;line-height:1}
.qz-daily .tx{flex:1;min-width:0}
.qz-daily .tx b{display:block;font-family:var(--head);font-size:19px;letter-spacing:.04em;text-transform:uppercase}
.qz-daily .tx small{display:block;color:var(--mute);font-size:13px}
.qz-sec{display:flex;flex-direction:column;gap:8px}
.qz-trow{display:grid;grid-template-columns:26px 1fr 52px;gap:10px;align-items:center;font-size:14px}
.qz-trow .ic{font-size:18px;text-align:center}
.qz-trow .nm{display:flex;flex-direction:column;gap:4px;min-width:0}
.qz-trow .nm span{display:flex;justify-content:space-between;gap:6px;font-family:var(--head);font-weight:600;letter-spacing:.03em}
.qz-trow .nm span small{color:var(--mute);font-weight:500}
.qz-trow .pc{font-family:var(--display);font-size:14px;text-align:right;color:var(--cyan)}
.qz-hud{display:flex;align-items:center;gap:8px;justify-content:space-between;min-height:42px}
.qz-hud .l{display:flex;align-items:center;gap:8px;min-width:0}
.qz-score{font-family:var(--display);font-size:21px;color:var(--cyan);text-shadow:var(--glow-c);font-variant-numeric:tabular-nums}
.qz-lives{font-size:20px;letter-spacing:2px}
.qz-lives .lost{filter:grayscale(1);opacity:.3}
.qz-x{width:40px;height:40px;border-radius:12px;background:var(--glass-2);border:1px solid var(--line-2);font-size:16px;color:var(--mute);flex:0 0 40px}
.qz-qcard{display:flex;flex-direction:column;gap:12px;padding:16px;animation:qzIn .35s}
.qz-qtop{display:flex;align-items:center;gap:10px;justify-content:space-between}
.qz-qtop .pills{display:flex;flex-wrap:wrap;gap:6px;min-width:0}
.qz-q{font-family:var(--head);font-weight:700;font-size:22px;line-height:1.25;letter-spacing:.01em;text-wrap:balance;overflow-wrap:anywhere}
.qz-ring{position:relative;width:58px;height:58px;flex:0 0 58px}
.qz-ring svg{width:100%;height:100%;transform:rotate(-90deg);overflow:visible}
.qz-ring circle{fill:none;stroke-width:5}
.qz-ring .bg{stroke:rgba(255,255,255,.1)}
.qz-ring .fg{stroke:var(--cyan);stroke-linecap:round;filter:drop-shadow(0 0 4px var(--cyan));transition:stroke .3s}
.qz-ring.warn .fg{stroke:var(--warn);filter:drop-shadow(0 0 4px var(--warn))}
.qz-ring.crit .fg{stroke:var(--bad);filter:drop-shadow(0 0 5px var(--bad))}
.qz-ring.crit{animation:qzPulse .5s infinite alternate}
.qz-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:18px;font-variant-numeric:tabular-nums}
.qz-answers{display:flex;flex-direction:column;gap:10px}
.qz-ans{display:flex;align-items:center;gap:12px;min-height:56px;padding:10px 14px;border-radius:14px;background:var(--glass-2);
  border:1px solid var(--line);text-align:left;font-size:17px;font-weight:600;line-height:1.25;overflow-wrap:anywhere;
  transition:transform .12s,background .25s,border-color .25s,opacity .25s,box-shadow .25s;animation:qzIn .35s backwards}
.qz-ans:nth-child(2){animation-delay:.05s}.qz-ans:nth-child(3){animation-delay:.1s}.qz-ans:nth-child(4){animation-delay:.15s}
.qz-ans i{font-style:normal;width:32px;height:32px;flex:0 0 32px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:14px;background:rgba(168,85,247,.25);color:#d8b4fe;transition:background .25s,color .25s}
.qz-ans:active:not(:disabled){transform:scale(.97)}
.qz-ans:disabled{cursor:default;color:var(--ink)}
.qz-ans.ok{background:rgba(61,245,160,.18);border-color:var(--good);box-shadow:0 0 20px rgba(61,245,160,.45);animation:qzOk .5s}
.qz-ans.ok i{background:var(--good);color:#04140c}
.qz-ans.no{background:rgba(255,84,112,.18);border-color:var(--bad);box-shadow:0 0 18px rgba(255,84,112,.4);animation:shake .35s}
.qz-ans.no i{background:var(--bad);color:#fff}
.qz-ans.dim{opacity:.4}
.qz-fb{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:var(--r);border:1px solid var(--line-2);background:var(--glass);animation:qzIn .3s}
.qz-fb.good{border-color:rgba(61,245,160,.5)}
.qz-fb.bad{border-color:rgba(255,84,112,.5)}
.qz-fb .hd{font-family:var(--head);font-weight:700;font-size:19px;letter-spacing:.04em;text-transform:uppercase}
.qz-fb.good .hd{color:var(--good)}
.qz-fb.bad .hd{color:var(--bad)}
.qz-fb p{color:var(--mute);font-size:15px}
.qz-float{position:absolute;right:16px;top:8px;font-family:var(--display);font-weight:800;font-size:22px;color:var(--good);
  text-shadow:0 0 12px rgba(61,245,160,.8);animation:qzFloat 1.2s forwards;pointer-events:none;z-index:2}
.qz-combo{animation:qzPop .4s}
.qz-hand{padding:34px 18px;gap:14px}
.qz-hand .big{font-size:64px;line-height:1}
.qz-p1c{color:var(--cyan);text-shadow:var(--glow-c)}
.qz-p2c{color:var(--pink);text-shadow:var(--glow-p)}
.qz-vs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.qz-review{display:flex;flex-direction:column;gap:8px}
.qz-rv{padding:11px 12px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line-2);display:flex;flex-direction:column;gap:3px}
.qz-rv b{font-family:var(--head);font-size:16px;letter-spacing:.02em;line-height:1.25}
.qz-rv .r{color:var(--good);font-size:14px;font-weight:600}
.qz-rv .w{color:var(--bad);font-size:14px}
.qz-rv small{color:var(--mute);font-size:13px}
.qz-split{position:fixed;top:0;bottom:0;left:0;right:0;z-index:60;background:var(--bg);display:flex;flex-direction:column;max-width:620px;margin:0 auto;
  user-select:none;-webkit-user-select:none;touch-action:manipulation}
.qz-half{flex:1 1 0;display:flex;flex-direction:column;gap:10px;padding:12px 14px;min-height:0;justify-content:center;position:relative;transition:background .3s}
.qz-half.p1{background:linear-gradient(0deg,rgba(0,229,255,.08),transparent)}
.qz-half.p2{background:linear-gradient(0deg,rgba(255,54,184,.08),transparent);transform:rotate(180deg)}
.qz-half.win{background:rgba(61,245,160,.14)}
.qz-half .who{display:flex;justify-content:space-between;align-items:center;font-family:var(--head);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:15px}
.qz-half .who b{font-family:var(--display);font-size:24px}
.qz-half .qz-q{font-size:19px;text-align:center;min-height:48px;display:flex;align-items:center;justify-content:center}
.qz-bgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.qz-bans{min-height:60px;padding:8px 10px;border-radius:14px;background:var(--glass-2);border:1px solid var(--line);font-weight:700;font-size:15px;line-height:1.2;
  overflow-wrap:anywhere;transition:background .2s,border-color .2s,opacity .2s}
.qz-bans.ok{background:rgba(61,245,160,.22);border-color:var(--good);box-shadow:0 0 16px rgba(61,245,160,.45)}
.qz-bans.no{background:rgba(255,84,112,.2);border-color:var(--bad)}
.qz-half.locked .qz-bans:not(.no):not(.ok){opacity:.35}
.qz-half .st{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-family:var(--head);font-weight:700;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);pointer-events:none}
.qz-mid{display:flex;align-items:center;gap:10px;padding:6px 12px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(8,8,18,.92)}
.qz-mid .b-bar{flex:1}
.qz-mid .n{font-family:var(--display);font-size:14px;color:var(--mute);min-width:44px;text-align:center}
.qz-edq{display:flex;flex-direction:column;gap:8px}
.qz-edq .hd{display:flex;justify-content:space-between;align-items:center}
.qz-opt{display:flex;gap:8px;align-items:center}
.qz-opt .b-input{padding:10px 12px}
.qz-mark{width:44px;height:44px;flex:0 0 44px;border-radius:12px;border:1px solid var(--line);background:rgba(8,8,18,.6);font-size:18px;color:var(--mute);
  display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s}
.qz-mark.on{background:rgba(61,245,160,.2);border-color:var(--good);color:var(--good);box-shadow:0 0 12px rgba(61,245,160,.4)}
.qz-err{border-color:var(--bad)!important;box-shadow:0 0 12px rgba(255,84,112,.35)!important}
.qz-code{font-family:var(--mono);font-size:12px;word-break:break-all;min-height:120px}
.qz-acts{display:flex;gap:6px;flex-wrap:wrap}
.qz-spin{display:inline-block;width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:qzSpin .8s linear infinite}
@keyframes qzIn{from{opacity:0;transform:translateY(10px)}}
@keyframes qzOk{40%{transform:scale(1.04)}}
@keyframes qzPop{0%{transform:scale(.6)}60%{transform:scale(1.15)}}
@keyframes qzPulse{to{transform:scale(1.08)}}
@keyframes qzSpin{to{transform:rotate(360deg)}}
@keyframes qzFloat{0%{opacity:0;transform:translateY(12px)}15%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}
`;
function injectCSS(){ if(document.getElementById('qz-style')) return; const s = document.createElement('style'); s.id = 'qz-style'; s.textContent = CSS; document.head.append(s); }

/* ---------- Registrieren ---------- */
B.registerGame({
  id: 'quiz', name: 'Quiz', icon: '❓', cat: 'quiz', kind: 'game',
  desc: BANK.length + ' Fragen in 10 Themen – klassisch, auf Zeit, Survival, Tagesquiz, Duell und deine eigenen Quiz.',
  rules: [
    'Tippe die richtige von vier Antworten an, bevor der Ring abläuft.',
    'Je schneller du antwortest, desto mehr Punkte. Richtige Serien geben Combo-Bonus (bis +50 %).',
    'Klassisch: 10 Fragen, Thema und Schwierigkeit frei wählbar. Zeitmodus: 60 Sekunden, so viele wie möglich. Survival: 3 Leben, es wird immer schwerer.',
    'Tagesquiz: Jeden Tag 10 neue Fragen (eine pro Thema) – Punkte gibt es nur beim ersten Versuch.',
    'Duell: Abwechselnd am selben Handy oder als Buzzer-Duell mit geteiltem Bildschirm – wer zuerst richtig tippt, punktet. Falsch getippt = für diese Frage gesperrt.',
    'Eigene Quiz: Erstelle Fragen, speichere sie und teile sie als Code mit Freunden.',
    'Ab 60 % richtig gilt eine Runde als gewonnen.'
  ],
  players: '1-2',
  tags: ['alleine', 'freunde', 'drinnen', 'kurz', 'einfach'],
  _bank: BANK, _topics: TOPICS,
  mount(root, api){
    injectCSS();
    const el = api.el;
    let alive = true, timers = [], iv = null, giv = null, split = null;
    const later = (fn, ms) => { const t = setTimeout(() => { timers = timers.filter(x => x !== t); if(alive) fn(); }, ms); timers.push(t); return t; };
    const stop = () => { timers.forEach(clearTimeout); timers = []; if(iv){ clearInterval(iv); iv = null; } if(giv){ clearInterval(giv); giv = null; } if(split){ split.remove(); split = null; } };
    const render = (...nodes) => { root.innerHTML = ''; root.scrollTop = 0; nodes.forEach(n => n && root.append(n)); };
    const screen = (...nodes) => { stop(); render(...nodes); };

    /* Speicher */
    const tstats = () => api.store.get('tstats', {});
    const addTStat = (t, ok) => { const s = tstats(); const r = s[t] = s[t] || { r: 0, n: 0 }; r.n++; if(ok) r.r++; api.store.set('tstats', s); };
    const seenList = () => api.store.get('seen', []);
    const markSeen = id => { const s = seenList().filter(x => x !== id); s.push(id); api.store.set('seen', s.slice(-220)); };
    const customs = () => api.store.get('custom', []);
    const saveCustoms = l => api.store.set('custom', l);
    const dailyInfo = () => { const d = api.store.get('daily', null); return d && d.day === B.today() ? d : null; };

    /* KI-Verfügbarkeit */
    let ai = null, aiState = 'pending'; const aiHooks = [];
    api.ai().then(s => { ai = s || null; aiState = ai ? 'yes' : 'no'; aiHooks.forEach(f => f()); }).catch(() => { aiState = 'no'; });

    /* Fragenauswahl */
    const fresh = list => { const seen = new Set(seenList()); const sh = api.shuffle(list); return sh.filter(q => !seen.has(q.id)).concat(sh.filter(q => seen.has(q.id))); };
    const poolOf = (topics, diff) => BANK.filter(q => (!topics.length || topics.includes(q.t)) && (diff === 3 || q.d === diff + 1));
    function pickN(topics, diff, n){
      const exact = poolOf(topics, diff);
      let out = fresh(exact).slice(0, n);
      if(out.length < n){ const rest = poolOf(topics, 3).filter(q => !out.includes(q)); out = out.concat(fresh(rest).slice(0, n - out.length)); }
      if(out.length < n){ const rest = BANK.filter(q => !out.includes(q)); out = out.concat(fresh(rest).slice(0, n - out.length)); }
      return api.shuffle(out);
    }
    function streamOf(list){ let q = []; return () => { if(!q.length) q = fresh(list); return q.shift(); }; }
    function survivalStream(topics){
      const by = [1, 2, 3].map(d => streamOf(poolOf(topics, d - 1).length ? poolOf(topics, d - 1) : poolOf(topics, 3)));
      return i => by[i < 5 ? 0 : i < 12 ? 1 : 2]();
    }
    const prep = (q, rng) => { const order = rng ? sshuffle([0, 1, 2, 3], rng) : api.shuffle([0, 1, 2, 3]); return Object.assign({}, q, { a: order.map(i => q.a[i]), c: order.indexOf(q.c) }); };

    /* UI-Bausteine */
    function ring(){
      const w = el('div', { class: 'qz-ring', role: 'timer' });
      w.innerHTML = '<svg viewBox="0 0 60 60"><circle class="bg" cx="30" cy="30" r="26"/><circle class="fg" cx="30" cy="30" r="26"/></svg><b></b>';
      const fg = w.querySelector('.fg'), num = w.querySelector('b'), C = 2 * Math.PI * 26;
      fg.style.strokeDasharray = C.toFixed(2);
      return { node: w, set(frac, label){ frac = Math.max(0, Math.min(1, frac)); fg.style.strokeDashoffset = (C * (1 - frac)).toFixed(2); num.textContent = label; w.classList.toggle('warn', frac < .4 && frac >= .2); w.classList.toggle('crit', frac < .2); } };
    }
    const backRow = (label, fn) => el('div', { class: 'b-between' }, [
      el('button', { class: 'b-btn ghost sm', text: '← Zurück', onclick: () => { api.sound('click'); fn(); } }),
      label ? el('span', { class: 'b-kicker', text: label }) : null
    ]);
    const chip = (text, on, fn) => el('button', { class: 'b-chip', 'aria-pressed': String(!!on), text, onclick: () => { api.sound('click'); fn(); } });
    /* Eigener Bestätigungsdialog (api.confirm löst in core.js immer mit false auf) */
    const ask = (text, okLabel, cancelLabel) => new Promise(res => {
      let done = false; const fin = v => { if(!done){ done = true; res(v); } };
      api.sheet(close => el('div', { class: 'b-stack' }, [
        el('p', { class: 'b-h', text }),
        el('div', { class: 'b-grid2' }, [
          el('button', { class: 'b-btn ghost', text: cancelLabel || 'Abbrechen', onclick: () => { fin(false); close(); } }),
          el('button', { class: 'b-btn', text: okLabel || 'OK', onclick: () => { fin(true); close(); } })
        ])
      ]), { onClose: () => fin(false) });
    });

    /* ================= MENÜ ================= */
    function menu(){
      api.setTitle('Quiz');
      const di = dailyInfo();
      const daily = el('button', { class: 'b-card glow tap b-rgb qz-daily', onclick: () => { api.sound('good'); startDaily(); } }, [
        el('div', { class: 'ic', text: di ? '✅' : '📅' }),
        el('div', { class: 'tx' }, [
          el('b', { text: 'Tagesquiz' }),
          el('small', { text: di ? 'Heute erledigt: ' + fmt(di.score) + ' Punkte · ' + di.ok + '/10 richtig. Nochmal spielen (ohne Punkte)' : '10 Fragen, eine pro Thema – für alle gleich. Punkte gibt’s 1× pro Tag!' })
        ]),
        el('span', { class: 'b-pill ' + (di ? 'good' : 'pink'), text: di ? 'Fertig' : 'Neu' })
      ]);
      const tile = (ic, name, sub, fn, cls) => el('button', { class: 'qz-tile ' + (cls || ''), onclick: () => { api.sound('click'); fn(); } }, [el('span', { class: 'ic', text: ic }), el('b', { text: name }), el('small', { text: sub })]);
      const aiTile = tile('🤖', 'KI-Quiz', 'Quiz zu deinem Wunschthema', aiSheet, 'ai');
      const tiles = el('div', { class: 'qz-tiles' }, [
        tile('🎯', 'Klassisch', '10 Fragen · Thema & Level wählen', () => setup('klassisch')),
        tile('⏱️', 'Zeitmodus', '60 Sekunden – so viele wie möglich', () => setup('zeit')),
        tile('❤️', 'Survival', '3 Leben · wird immer schwerer', () => setup('survival')),
        tile('⚔️', 'Duell', '2 Spieler · ein Handy', () => setup('duell')),
        tile('✏️', 'Eigene Quiz', 'Erstellen, spielen, teilen', customList),
        aiTile
      ]);
      const syncAi = () => { aiTile.style.display = aiState === 'yes' ? '' : 'none'; };
      syncAi(); aiHooks.push(syncAi);

      const bests = [['klassisch', '🎯 Klassisch'], ['zeit', '⏱️ Zeitmodus'], ['survival', '❤️ Survival'], ['taeglich', '📅 Tagesquiz']];
      const hs = el('div', { class: 'b-grid2' }, bests.map(([k, n]) => { const v = api.best(k); return el('div', { class: 'b-stat' }, [el('small', { text: n }), el('b', { text: v == null ? '–' : fmt(v) })]); }));

      const ts = tstats();
      const rows = TOPICS.map(t => {
        const s = ts[t.id] || { r: 0, n: 0 }; const pc = s.n ? Math.round(s.r / s.n * 100) : null;
        const bar = el('div', { class: 'b-bar' }, el('i', { style: { width: (pc || 0) + '%' } }));
        return el('div', { class: 'qz-trow' }, [
          el('span', { class: 'ic', text: t.icon }),
          el('div', { class: 'nm' }, [el('span', {}, [t.name, el('small', { text: s.n ? s.r + '/' + s.n : 'noch nicht gespielt' })]), bar]),
          el('span', { class: 'pc', text: pc == null ? '–' : pc + ' %' })
        ]);
      });
      const bg = B.stats.byGame.quiz || { plays: 0, wins: 0 };
      screen(el('div', { class: 'qz-wrap' }, [
        el('div', { class: 'b-card glow b-center qz-hero' }, [
          el('div', { class: 'qz-hero-ic', text: '❓' }),
          el('h3', { class: 'b-title b-grad', text: 'QUIZ ARENA' }),
          el('p', { class: 'b-hint', text: BANK.length + ' Fragen · ' + TOPICS.length + ' Themen · ' + bg.plays + ' Runden gespielt' })
        ]),
        daily, tiles,
        el('div', { class: 'qz-sec' }, [el('span', { class: 'b-label', text: 'Highscores' }), hs]),
        el('div', { class: 'b-card qz-sec' }, [el('span', { class: 'b-label', text: 'Trefferquote pro Thema' })].concat(rows)),
        el('button', { class: 'b-btn ghost block', text: 'Anleitung', onclick: () => api.help() })
      ]));
    }

    /* ================= SETUP ================= */
    function setup(mode){
      const conf = Object.assign({ topics: [], diff: 3, duel: 'alt' }, api.store.get('setup', {}));
      conf.topics = (conf.topics || []).filter(t => TOPIC[t]);
      const names = { klassisch: '🎯 Klassisch', zeit: '⏱️ Zeitmodus', survival: '❤️ Survival', duell: '⚔️ Duell' };
      const info = {
        klassisch: '10 Fragen, 20 Sekunden pro Frage. Schnelle Antworten und Serien bringen extra Punkte.',
        zeit: '60 Sekunden Gesamtzeit. Beantworte so viele Fragen wie möglich – falsche kosten nur deine Combo.',
        survival: 'Du hast 3 Leben und 15 Sekunden pro Frage. Ab Frage 6 wird’s mittel, ab Frage 13 schwer.',
        duell: ''
      };
      const box = el('div', { class: 'qz-wrap' });
      const save = () => api.store.set('setup', conf);
      const draw = () => {
        const tChips = el('div', { class: 'b-chips' }, [chip('🎲 Alle (Mix)', !conf.topics.length, () => { conf.topics = []; save(); draw(); })].concat(
          TOPICS.map(t => chip(t.icon + ' ' + t.name, conf.topics.includes(t.id), () => {
            const i = conf.topics.indexOf(t.id); if(i >= 0) conf.topics.splice(i, 1); else conf.topics.push(t.id);
            if(conf.topics.length === TOPICS.length) conf.topics = [];
            save(); draw();
          }))));
        const dChips = el('div', { class: 'b-chips' }, DIFFS.map((d, i) => chip(d, conf.diff === i, () => { conf.diff = i; save(); draw(); })));
        const avail = mode === 'survival' ? poolOf(conf.topics, 3).length : poolOf(conf.topics, conf.diff).length;
        const duelChips = el('div', { class: 'b-chips' }, [
          chip('🔁 Abwechselnd', conf.duel === 'alt', () => { conf.duel = 'alt'; save(); draw(); }),
          chip('🔔 Buzzer (geteilter Screen)', conf.duel === 'buzz', () => { conf.duel = 'buzz'; save(); draw(); })
        ]);
        const duelInfo = conf.duel === 'alt'
          ? 'Ihr spielt abwechselnd je 5 Fragen und gebt das Handy weiter. Schnelligkeit zählt!'
          : 'Legt das Handy flach zwischen euch. Spieler 2 sitzt oben (Bildschirm gedreht). Wer zuerst richtig tippt, bekommt den Punkt – wer falsch tippt, ist für die Frage gesperrt.';
        const best = mode !== 'duell' ? api.best(mode) : null;
        box.innerHTML = '';
        box.append(
          backRow(names[mode], menu),
          el('p', { class: 'b-hint', text: mode === 'duell' ? duelInfo : info[mode] }),
          mode === 'duell' ? el('div', {}, [el('span', { class: 'b-label', text: 'Duell-Art' }), duelChips]) : null,
          el('div', {}, [el('span', { class: 'b-label', text: 'Themen' }), tChips]),
          mode === 'survival' ? null : el('div', {}, [el('span', { class: 'b-label', text: 'Schwierigkeit' }), dChips]),
          el('div', { class: 'b-grid2' }, [
            el('div', { class: 'b-stat' }, [el('small', { text: 'Passende Fragen' }), el('b', { text: avail })]),
            el('div', { class: 'b-stat' }, [el('small', { text: 'Rekord' }), el('b', { text: mode === 'duell' ? '–' : best == null ? '–' : fmt(best) })])
          ]),
          el('button', { class: 'b-btn block', style: { fontSize: '20px', minHeight: '56px' }, text: '▶ Los geht’s', onclick: () => { api.sound('good'); go(); } })
        );
      };
      const go = () => {
        const tps = conf.topics.slice(), df = conf.diff;
        const topicLabel = tps.length ? (tps.length === 1 ? TOPIC[tps[0]].name : tps.length + ' Themen') : 'Mix';
        if(mode === 'klassisch') play({ mode, title: 'Klassisch', sub: topicLabel + ' · ' + DIFFS[df], list: pickN(tps, df, 10).map(q => prep(q)), perQ: 20, base: 100, bestKey: 'klassisch', track: true, again: () => setup(mode) });
        else if(mode === 'zeit'){ const next = streamOf(poolOf(tps, df).length ? poolOf(tps, df) : poolOf(tps, 3)); play({ mode, title: 'Zeitmodus', sub: topicLabel, next: () => prep(next()), global: 60, base: 100, bestKey: 'zeit', track: true, again: () => setup(mode) }); }
        else if(mode === 'survival'){ const next = survivalStream(tps); play({ mode, title: 'Survival', sub: topicLabel, next: i => prep(next(i)), perQ: 15, lives: 3, base: 100, bestKey: 'survival', track: true, again: () => setup(mode) }); }
        else if(mode === 'duell'){
          const qs = pickN(tps, df, 10).map(q => prep(q));
          if(conf.duel === 'buzz') buzzer(qs, () => setup(mode));
          else play({ mode: 'duell', title: 'Duell', sub: topicLabel, list: qs, perQ: 15, base: 100, duel: true, again: () => setup(mode) });
        }
      };
      draw();
      screen(box);
    }

    /* ================= TAGESQUIZ ================= */
    function startDaily(){
      const rng = api.seeded(B.today());
      const list = sshuffle(TOPICS, rng).map(t => { const p = BANK.filter(q => q.t === t.id); return prep(p[Math.floor(rng() * p.length)], rng); });
      const done = !!dailyInfo();
      play({ mode: 'daily', title: 'Tagesquiz', sub: B.today().split('-').reverse().join('.') + (done ? ' · Übungsrunde' : ''), list, perQ: 20, base: 100, bestKey: done ? null : 'taeglich', track: !done, daily: true, practice: done, again: startDaily });
    }

    /* ================= SPIEL-ENGINE ================= */
    function play(cfg){
      stop();
      api.setTitle(cfg.title);
      const st = { i: 0, score: 0, combo: 0, maxCombo: 0, ok: 0, bad: 0, times: [], byT: {}, lives: cfg.lives || 0, log: [], over: false, ds: [],
        p: [{ score: 0, ok: 0, combo: 0, times: [] }, { score: 0, ok: 0, combo: 0, times: [] }] };
      const total = cfg.list ? cfg.list.length : 0;
      let gEnd = 0, gRing = null, gLeft = cfg.global || 0;

      const quit = () => ask('Runde abbrechen? Dein Fortschritt geht verloren.', 'Beenden', 'Weiterspielen').then(ok => { if(ok && alive){ stop(); menu(); } });

      function nextQ(){
        if(st.over) return;
        if(cfg.list && st.i >= total) return end();
        if(cfg.lives && st.lives <= 0) return end();
        const q = cfg.list ? cfg.list[st.i] : cfg.next(st.i);
        if(!q) return end();
        if(cfg.duel) handover(q); else showQ(q);
      }

      function handover(q){
        const p = st.i % 2;
        render(el('div', { class: 'qz-wrap' }, [
          el('div', { class: 'b-card glow b-center qz-hand b-pop' }, [
            el('div', { class: 'big', text: '📱' }),
            el('div', { class: 'b-kicker', text: 'Frage ' + (Math.floor(st.i / 2) + 1) + ' von ' + total / 2 }),
            el('h3', { class: 'b-title ' + (p ? 'qz-p2c' : 'qz-p1c'), text: 'Spieler ' + (p + 1) + ' ist dran' }),
            el('p', { class: 'b-hint', text: st.i === 0 ? 'Spieler 1 beginnt. Spieler 2 schaut weg!' : 'Gib das Handy weiter – nicht spicken!' })
          ]),
          el('div', { class: 'qz-vs' }, [0, 1].map(k => el('div', { class: 'b-stat' }, [el('small', { class: k ? 'qz-p2c' : 'qz-p1c', text: 'Spieler ' + (k + 1) }), el('b', { text: fmt(st.p[k].score) })]))),
          el('button', { class: 'b-btn block' + (p ? '' : ' cyan'), style: { minHeight: '60px', fontSize: '20px' }, text: 'Bereit!', onclick: () => { api.sound('pop'); showQ(q); } }),
          el('button', { class: 'b-btn ghost block', text: 'Duell abbrechen', onclick: quit })
        ]));
      }

      function hud(){
        const left = el('div', { class: 'l' }, [el('button', { class: 'qz-x', 'aria-label': 'Runde abbrechen', text: '✕', onclick: quit })]);
        if(cfg.duel){ const p = st.i % 2; left.append(el('span', { class: 'b-pill ' + (p ? 'pink' : 'cyan'), text: 'Spieler ' + (p + 1) + ' · ' + (Math.floor(st.i / 2) + 1) + '/' + total / 2 })); }
        else if(cfg.lives){ const lv = el('span', { class: 'qz-lives', 'aria-label': st.lives + ' Leben' }); for(let k = 0; k < cfg.lives; k++) lv.append(el('span', { class: k < st.lives ? '' : 'lost', text: '❤️' })); st.lvEl = lv; left.append(lv, el('span', { class: 'b-pill', text: 'Frage ' + (st.i + 1) })); }
        else if(cfg.global) left.append(el('span', { class: 'b-pill cyan', text: st.ok + ' richtig' }));
        else left.append(el('span', { class: 'b-pill', text: 'Frage ' + (st.i + 1) + '/' + total }));
        const sc = cfg.duel ? st.p[st.i % 2].score : st.score;
        const combo = cfg.duel ? st.p[st.i % 2].combo : st.combo;
        return el('div', { class: 'qz-hud' }, [left, el('div', { class: 'b-row', style: { gap: '8px', flexWrap: 'nowrap' } }, [
          combo >= 2 ? el('span', { class: 'b-pill warn qz-combo', text: '🔥 x' + combo }) : null,
          st.scEl = el('span', { class: 'qz-score', text: fmt(sc) })
        ])]);
      }

      function showQ(q){
        if(iv){ clearInterval(iv); iv = null; }
        if(q.id) markSeen(q.id);
        const limit = cfg.perQ || 0;
        const rg = ring();
        if(cfg.global) gRing = rg;
        const T = q.t ? TOPIC[q.t] : null;
        const pills = el('div', { class: 'pills' }, [
          el('span', { class: 'b-pill cyan', text: T ? T.icon + ' ' + T.name : (cfg.sub || cfg.title) }),
          q.d ? el('span', { class: 'b-pill', text: '★'.repeat(q.d) + '☆'.repeat(3 - q.d) }) : null
        ]);
        const card = el('div', { class: 'b-card glow qz-qcard' }, [
          el('div', { class: 'qz-qtop' }, [pills, rg.node]),
          el('div', { class: 'qz-q', text: q.q })
        ]);
        const prog = cfg.list ? el('div', { class: 'b-bar' }, el('i', { style: { width: (st.i / total * 100) + '%' } })) : cfg.global ? el('div', { class: 'b-bar' }, el('i', { style: { width: (gLeft / cfg.global * 100) + '%' } })) : null;
        const btns = q.a.map((a, k) => el('button', { class: 'qz-ans', onclick: () => answer(k) }, [el('i', { text: LETTERS[k] }), el('span', { text: a })]));
        const fbBox = el('div');
        render(el('div', { class: 'qz-wrap' }, [hud(), prog, card, el('div', { class: 'qz-answers' }, btns), fbBox]));
        const progI = prog && prog.firstChild;
        const t0 = performance.now();
        let done = false, lastSec = limit + 1;
        if(limit){
          rg.set(1, limit);
          iv = setInterval(() => {
            const left = limit - (performance.now() - t0) / 1000;
            if(left <= 0){ clearInterval(iv); iv = null; answer(-1); return; }
            const s = Math.ceil(left); rg.set(left / limit, s);
            if(s < lastSec){ lastSec = s; if(s <= 3) api.sound('tick'); }
          }, 100);
        } else if(cfg.global){
          rg.set(gLeft / cfg.global, Math.ceil(gLeft));
          if(progI) gRing.bar = progI;
        }

        function answer(k){
          if(done || st.over) return; done = true;
          if(iv){ clearInterval(iv); iv = null; }
          const dt = (performance.now() - t0) / 1000;
          const right = k === q.c;
          btns.forEach((b, j) => { b.disabled = true; if(j === q.c) b.classList.add('ok'); else if(j === k) b.classList.add('no'); else b.classList.add('dim'); });
          const P = cfg.duel ? st.p[st.i % 2] : null;
          let pts = 0, combo;
          if(right){
            combo = P ? ++P.combo : ++st.combo;
            const frac = limit ? Math.max(0, 1 - dt / limit) : Math.max(0, 1 - dt / 8);
            const mult = 1 + Math.min(combo - 1, 5) * 0.1;
            pts = Math.round((cfg.base || 100) * (0.5 + 0.5 * frac) * mult);
            st.ok++; st.score += pts; if(P){ P.ok++; P.score += pts; }
            st.maxCombo = Math.max(st.maxCombo, combo);
            api.sound(combo >= 3 && combo % 3 === 0 ? 'level' : 'good'); api.vibrate(12);
            card.append(el('div', { class: 'qz-float', text: '+' + pts }));
            if(st.scEl){ st.scEl.textContent = fmt(P ? P.score : st.score); st.scEl.classList.remove('qz-combo'); void st.scEl.offsetWidth; st.scEl.classList.add('qz-combo'); }
          } else {
            if(P) P.combo = 0; else st.combo = 0;
            st.bad++;
            if(cfg.lives){ st.lives--; if(st.lvEl) Array.from(st.lvEl.children).forEach((h, j) => { h.className = j < st.lives ? '' : 'lost qz-combo'; }); }
            api.sound('bad'); api.vibrate(60);
            card.classList.add('b-shake');
          }
          if(k >= 0 || limit){ st.times.push(Math.min(dt, limit || 99)); if(P) P.times.push(Math.min(dt, limit || 99)); }
          if(q.d) st.ds.push(q.d);
          if(q.t){ const b = st.byT[q.t] = st.byT[q.t] || { r: 0, n: 0 }; b.n++; if(right) b.r++; if(cfg.track) addTStat(q.t, right); }
          if(!right) st.log.push({ q: q.q, right: q.a[q.c], mine: k >= 0 ? q.a[k] : null, e: q.e });
          if(progI && cfg.list) progI.style.width = ((st.i + 1) / total * 100) + '%';
          st.i++;
          if(cfg.global){ later(nextQ, right ? 420 : 900); return; }
          const comboTxt = right && combo >= 2 ? ' · 🔥 ' + combo + 'er-Serie +' + Math.min(combo - 1, 5) * 10 + ' %' : '';
          const last = (cfg.list && st.i >= total) || (cfg.lives && st.lives <= 0);
          fbBox.append(el('div', { class: 'qz-fb ' + (right ? 'good' : 'bad') }, [
            el('div', { class: 'hd', text: right ? '✓ Richtig! +' + pts + comboTxt : k < 0 ? '⏰ Zeit abgelaufen!' : '✗ Leider falsch' + (cfg.lives ? ' · −1 ❤️' : '') }),
            !right ? el('p', { text: 'Richtig ist: ' + q.a[q.c] }) : null,
            q.e ? el('p', { text: q.e }) : null,
            el('button', { class: 'b-btn block', text: last ? 'Ergebnis ansehen' : 'Weiter →', onclick: () => { api.sound('click'); nextQ(); } })
          ]));
          later(() => { const b = fbBox.querySelector('button'); if(b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60);
        }
      }

      function end(){
        if(st.over) return; st.over = true;
        stop(); api.setTitle(cfg.title);
        const answered = st.ok + st.bad;
        const rate = answered ? st.ok / answered : 0;
        const pct = Math.round(rate * 100);
        const win = rate >= 0.6;
        const avgD = st.ds.length ? st.ds.reduce((a, b) => a + b, 0) / st.ds.length : 2;
        const difficulty = Math.max(0, Math.min(2, Math.round(avgD - 1)));
        const avgT = list => list.length ? (list.reduce((a, b) => a + b, 0) / list.length).toFixed(1).replace('.', ',') + ' s' : '–';
        let bestCat = '–', bc = null;
        Object.keys(st.byT).forEach(t => { const b = st.byT[t]; const r = b.r / b.n; if(b.r && (!bc || r > bc.r || (r === bc.r && b.r > bc.n))) bc = { t, r, n: b.r }; });
        if(bc) bestCat = TOPIC[bc.t].icon + ' ' + TOPIC[bc.t].name;

        if(cfg.duel){
          const [a, b] = st.p;
          const w = a.score === b.score ? -1 : a.score > b.score ? 0 : 1;
          api.finish({ win, score: Math.max(a.score, b.score), difficulty });
          api.sound(w < 0 ? 'check' : 'win');
          B.ui.result(root, api, {
            win: w >= 0 ? true : null, emoji: w < 0 ? '🤝' : '🏆',
            title: w < 0 ? 'Unentschieden!' : 'Spieler ' + (w + 1) + ' gewinnt!',
            sub: 'Zusammen ' + st.ok + ' von ' + answered + ' richtig',
            lines: [['Spieler 1', fmt(a.score)], ['Spieler 2', fmt(b.score)], ['S1 richtig', a.ok + '/' + total / 2], ['S2 richtig', b.ok + '/' + total / 2], ['S1 Ø-Zeit', avgT(a.times)], ['S2 Ø-Zeit', avgT(b.times)]],
            againLabel: 'Revanche', onAgain: cfg.again, onMenu: menu
          });
          if(w >= 0) B.confetti();
          addReview(); return;
        }

        let rec = null;
        if(cfg.bestKey) rec = api.reportScore(st.score, cfg.bestKey);
        if(cfg.daily && !cfg.practice) api.store.set('daily', { day: B.today(), score: st.score, ok: st.ok });
        const fin = { win, score: st.score, difficulty };
        if(cfg.practice) fin.xp = 0;
        api.finish(fin);
        api.sound(win ? 'win' : 'lose');
        if(rec && rec.isBest) later(() => api.toast('🏆 Neuer Rekord: ' + fmt(st.score) + ' Punkte!'), 500);

        const lines = [['Punkte', fmt(st.score)], ['Rekord', cfg.bestKey ? fmt(rec.best) : (cfg.practice ? 'Übungsrunde' : '–')],
          ['Richtig', st.ok], ['Falsch', st.bad], ['Ø-Zeit', avgT(st.times)], ['Max. Combo', st.maxCombo ? 'x' + st.maxCombo : '–']];
        if(Object.keys(st.byT).length) lines.push(['Beste Kategorie', bestCat], ['Trefferquote', pct + ' %']);
        else lines.push(['Trefferquote', pct + ' %']);
        const title = pct >= 90 ? 'Quiz-Genie!' : pct >= 60 ? 'Stark gemacht!' : pct >= 30 ? 'Gar nicht schlecht!' : 'Weiter üben!';
        const emoji = pct >= 90 ? '🧠' : pct >= 60 ? '🏆' : pct >= 30 ? '👍' : '📚';
        let sub = st.ok + ' von ' + answered + ' richtig (' + pct + ' %)';
        if(cfg.daily) sub += cfg.practice ? ' · Übungsrunde ohne Punkte' : ' · Morgen gibt’s neue Fragen!';
        if(cfg.mode === 'survival') sub += ' · ' + st.i + ' Fragen überlebt';
        B.ui.result(root, api, { win, title, emoji, sub, lines, onAgain: cfg.again, onMenu: menu });
        root.querySelectorAll('.b-stat b').forEach(b => { if(String(b.textContent).length > 9) b.style.fontSize = '15px'; });
        addReview();
      }

      function addReview(){
        if(!st.log.length) return;
        const box = root.firstChild; if(!box) return;
        box.append(el('div', { class: 'b-card qz-sec' }, [el('span', { class: 'b-label', text: 'Das merkst du dir jetzt (' + st.log.length + ')' }), el('div', { class: 'qz-review' }, st.log.map(l => el('div', { class: 'qz-rv' }, [
          el('b', { text: l.q }),
          el('span', { class: 'r', text: '✓ ' + l.right }),
          l.mine ? el('span', { class: 'w', text: '✗ Deine Antwort: ' + l.mine }) : el('span', { class: 'w', text: '⏰ Keine Antwort' }),
          l.e ? el('small', { text: l.e }) : null
        ])))]));
      }

      if(cfg.global){
        gEnd = performance.now() + cfg.global * 1000;
        let lastS = cfg.global + 1;
        giv = setInterval(() => {
          gLeft = Math.max(0, (gEnd - performance.now()) / 1000);
          const s = Math.ceil(gLeft);
          if(gRing){ gRing.set(gLeft / cfg.global, s); if(gRing.bar) gRing.bar.style.width = (gLeft / cfg.global * 100) + '%'; }
          if(s < lastS){ lastS = s; if(s <= 5 && s > 0) api.sound('tick'); }
          if(gLeft <= 0){ clearInterval(giv); giv = null; end(); }
        }, 100);
      }
      nextQ();
    }

    /* ================= BUZZER-DUELL (geteilter Bildschirm) ================= */
    function buzzer(qs, again){
      stop();
      api.setTitle('Buzzer-Duell');
      const LIMIT = 15;
      const sc = [0, 0];
      let qi = 0, q = null, locked = [false, false], resolved = false, t0 = 0, none = 0;
      const ov = el('div', { class: 'qz-split' });
      const halves = [0, 1].map(p => {
        const score = el('b', { text: '0' });
        const qt = el('div', { class: 'qz-q' });
        const btns = [0, 1, 2, 3].map(k => {
          const b = el('button', { class: 'qz-bans' });
          b.addEventListener('pointerdown', e => { e.preventDefault(); tap(p, k); });
          return b;
        });
        const status = el('div', { class: 'st' });
        const node = el('div', { class: 'qz-half ' + (p ? 'p2' : 'p1') }, [
          el('div', { class: 'who' }, [el('span', { class: p ? 'qz-p2c' : 'qz-p1c', text: 'Spieler ' + (p + 1) }), score]),
          qt, el('div', { class: 'qz-bgrid' }, btns), status
        ]);
        return { node, score, qt, btns, status };
      });
      const barI = el('i', { style: { width: '100%', transition: 'none' } });
      const num = el('span', { class: 'n' });
      const quitB = el('button', { class: 'qz-x', 'aria-label': 'Duell beenden', text: '✕' });
      quitB.addEventListener('click', () => ask('Buzzer-Duell beenden?', 'Beenden', 'Weiter').then(ok => { if(ok && alive){ stop(); menu(); } }));
      ov.append(halves[1].node, el('div', { class: 'qz-mid' }, [num, el('div', { class: 'b-bar' }, barI), quitB]), halves[0].node);
      document.body.append(ov); split = ov;
      render(el('p', { class: 'b-hint b-center', text: 'Buzzer-Duell läuft …' }));

      function show(){
        if(!alive || split !== ov) return;
        if(qi >= qs.length) return finishB();
        q = qs[qi]; locked = [false, false]; resolved = false;
        num.textContent = (qi + 1) + '/' + qs.length;
        halves.forEach(h => {
          h.node.classList.remove('locked', 'win'); h.qt.textContent = q.q; h.status.textContent = '';
          h.btns.forEach((b, k) => { b.className = 'qz-bans'; b.textContent = q.a[k]; });
        });
        api.sound('pop');
        t0 = performance.now();
        if(iv) clearInterval(iv);
        iv = setInterval(() => {
          const left = LIMIT - (performance.now() - t0) / 1000;
          barI.style.width = Math.max(0, left / LIMIT * 100) + '%';
          if(left <= 0){ clearInterval(iv); iv = null; resolve(-1); }
        }, 100);
      }
      function tap(p, k){
        if(resolved || locked[p] || !q) return;
        if(k === q.c){
          sc[p]++; halves[p].score.textContent = sc[p];
          halves[p].btns[k].classList.add('ok'); halves[p].node.classList.add('win');
          halves[p].status.textContent = '✓ Punkt für dich!'; halves[1 - p].status.textContent = 'Spieler ' + (p + 1) + ' war schneller';
          api.sound('good'); api.vibrate(20);
          resolve(p);
        } else {
          locked[p] = true; halves[p].btns[k].classList.add('no'); halves[p].node.classList.add('locked');
          halves[p].status.textContent = '✗ Gesperrt für diese Frage';
          api.sound('bad'); api.vibrate(60);
          if(locked[0] && locked[1]) resolve(-1);
        }
      }
      function resolve(winner){
        if(resolved) return; resolved = true;
        if(iv){ clearInterval(iv); iv = null; }
        if(winner < 0){ none++; halves.forEach(h => { h.btns[q.c].classList.add('ok'); if(!h.status.textContent || locked[0] && locked[1]) h.status.textContent = 'Richtig wäre: ' + q.a[q.c]; }); }
        else halves[1 - winner].btns[q.c].classList.add('ok');
        qi++;
        later(show, 1700);
      }
      function finishB(){
        stop();
        const solved = qs.length - none, w = sc[0] === sc[1] ? -1 : sc[0] > sc[1] ? 0 : 1;
        const avgD = qs.reduce((a, x) => a + (x.d || 2), 0) / qs.length;
        api.finish({ win: solved / qs.length >= 0.6, score: Math.max(sc[0], sc[1]), difficulty: Math.max(0, Math.min(2, Math.round(avgD - 1))) });
        api.sound(w < 0 ? 'check' : 'win');
        api.setTitle('Buzzer-Duell');
        B.ui.result(root, api, {
          win: w >= 0 ? true : null, emoji: w < 0 ? '🤝' : '🔔',
          title: w < 0 ? 'Unentschieden!' : 'Spieler ' + (w + 1) + ' gewinnt!',
          sub: sc[0] + ' : ' + sc[1] + ' nach ' + qs.length + ' Fragen',
          lines: [['Spieler 1', sc[0]], ['Spieler 2', sc[1]], ['Gelöst', solved + '/' + qs.length], ['Keiner richtig', none]],
          againLabel: 'Revanche', onAgain: again, onMenu: menu
        });
        if(w >= 0) B.confetti();
      }
      later(show, 400);
    }

    /* ================= EIGENE QUIZ ================= */
    function customList(){
      api.setTitle('Eigene Quiz');
      const list = customs();
      const items = list.map(cq => el('div', { class: 'b-card qz-sec' }, [
        el('div', { class: 'b-between' }, [
          el('div', { style: { minWidth: 0 } }, [el('div', { class: 'b-h', style: { fontSize: '18px', overflowWrap: 'anywhere' }, text: cq.title }),
            el('small', { class: 'b-hint', text: cq.qs.length + ' Fragen · ' + cq.time + ' s · ' + cq.pts + ' Pkt' + (api.best('c-' + cq.id) != null ? ' · Rekord ' + fmt(api.best('c-' + cq.id)) : '') })]),
          el('button', { class: 'b-btn sm', text: '▶', 'aria-label': 'Spielen', onclick: () => { api.sound('good'); playCustom(cq); } })
        ]),
        el('div', { class: 'qz-acts' }, [
          el('button', { class: 'b-btn ghost sm', text: '✏️ Bearbeiten', onclick: () => { api.sound('click'); editor(cq); } }),
          el('button', { class: 'b-btn ghost sm', text: '🔗 Teilen', onclick: () => { api.sound('click'); shareSheet(cq); } }),
          el('button', { class: 'b-btn ghost sm', text: '🗑️', 'aria-label': 'Löschen', onclick: () => ask('„' + cq.title + '“ wirklich löschen?', 'Löschen').then(ok => { if(ok){ saveCustoms(customs().filter(x => x.id !== cq.id)); api.toast('Quiz gelöscht'); customList(); } }) })
        ])
      ]));
      screen(el('div', { class: 'qz-wrap' }, [
        backRow('✏️ Eigene Quiz', menu),
        el('div', { class: 'b-grid2' }, [
          el('button', { class: 'b-btn', text: '＋ Neues Quiz', onclick: () => { api.sound('click'); editor(null); } }),
          el('button', { class: 'b-btn cyan', text: '📥 Code', onclick: () => { api.sound('click'); importSheet(); } })
        ]),
        list.length ? null : el('div', { class: 'b-card b-center', style: { padding: '26px 16px' } }, [
          el('div', { style: { fontSize: '44px' }, text: '📝' }),
          el('p', { class: 'b-hint', text: 'Noch keine eigenen Quiz. Erstell eins für deine Klasse oder Freunde – oder füg einen Code ein, den du bekommen hast.' })
        ])
      ].concat(items)));
    }

    function playCustom(cq){
      play({ mode: 'custom', title: cq.title, sub: cq.title, list: api.shuffle(cq.qs).map(q => prep(q)), perQ: cq.time, base: cq.pts, bestKey: 'c-' + cq.id, again: () => playCustom(cq) });
    }

    function editor(orig){
      api.setTitle(orig ? 'Quiz bearbeiten' : 'Neues Quiz');
      const draft = orig ? JSON.parse(JSON.stringify(orig)) : { id: '', title: '', time: 20, pts: 100, qs: [{ q: '', a: ['', '', '', ''], c: 0, e: '' }] };
      const box = el('div', { class: 'qz-wrap' });
      const draw = () => {
        box.innerHTML = '';
        const title = el('input', { class: 'b-input', maxlength: '60', placeholder: 'z. B. Klassen-Quiz Elektrotechnik', value: draft.title });
        title.addEventListener('input', () => { draft.title = title.value; title.classList.remove('qz-err'); });
        const times = el('div', { class: 'b-chips' }, TIME_OPTS.map(t => chip(t + ' s', draft.time === t, () => { draft.time = t; draw(); })));
        const pts = el('div', { class: 'b-chips' }, PTS_OPTS.map(p => chip(p + ' Pkt', draft.pts === p, () => { draft.pts = p; draw(); })));
        const qCards = draft.qs.map((dq, qi) => {
          const qIn = el('textarea', { class: 'b-input', rows: '2', maxlength: '240', placeholder: 'Deine Frage …', style: { minHeight: '64px' } }); qIn.value = dq.q;
          qIn.addEventListener('input', () => { dq.q = qIn.value; qIn.classList.remove('qz-err'); });
          const opts = dq.a.map((a, k) => {
            const inp = el('input', { class: 'b-input', maxlength: '120', placeholder: 'Antwort ' + LETTERS[k], value: a });
            inp.addEventListener('input', () => { dq.a[k] = inp.value; inp.classList.remove('qz-err'); });
            const mark = el('button', { class: 'qz-mark' + (dq.c === k ? ' on' : ''), 'aria-label': 'Als richtig markieren', 'aria-pressed': String(dq.c === k), text: dq.c === k ? '✓' : LETTERS[k] });
            mark.addEventListener('click', () => { dq.c = k; api.sound('click'); draw(); });
            return el('div', { class: 'qz-opt' }, [mark, inp]);
          });
          const ex = el('input', { class: 'b-input', maxlength: '300', placeholder: 'Erklärung (optional)', value: dq.e || '' });
          ex.addEventListener('input', () => { dq.e = ex.value; });
          return el('div', { class: 'b-card qz-edq', 'data-qi': qi }, [
            el('div', { class: 'hd' }, [el('span', { class: 'b-kicker', text: 'Frage ' + (qi + 1) }),
              draft.qs.length > 1 ? el('button', { class: 'b-btn ghost sm', text: '🗑️ Entfernen', onclick: () => { draft.qs.splice(qi, 1); api.sound('click'); draw(); } }) : null]),
            qIn, el('small', { class: 'b-hint', text: 'Tippe links auf den Buchstaben, um die richtige Antwort zu markieren.' })
          ].concat(opts, [ex]));
        });
        box.append(
          backRow(orig ? 'Bearbeiten' : 'Neues Quiz', () => ask('Editor verlassen? Nicht gespeicherte Änderungen gehen verloren.', 'Verlassen', 'Bleiben').then(ok => { if(ok) customList(); })),
          el('div', {}, [el('span', { class: 'b-label', text: 'Titel' }), title]),
          el('div', {}, [el('span', { class: 'b-label', text: 'Zeitlimit pro Frage' }), times]),
          el('div', {}, [el('span', { class: 'b-label', text: 'Punkte pro Frage (max.)' }), pts]),
          ...qCards,
          draft.qs.length < 50 ? el('button', { class: 'b-btn ghost block', text: '＋ Frage hinzufügen', onclick: () => { draft.qs.push({ q: '', a: ['', '', '', ''], c: 0, e: '' }); api.sound('pop'); draw(); later(() => { const c = box.querySelector('[data-qi="' + (draft.qs.length - 1) + '"] textarea'); if(c){ c.focus(); c.scrollIntoView({ block: 'center' }); } }, 50); } }) : el('p', { class: 'b-hint', text: 'Maximal 50 Fragen.' }),
          el('button', { class: 'b-btn block', style: { minHeight: '56px' }, text: '💾 Speichern', onclick: saveDraft })
        );
      };
      function saveDraft(){
        box.querySelectorAll('.qz-err').forEach(n => n.classList.remove('qz-err'));
        const t = draft.title.trim();
        if(!t){ const n = box.querySelector('input'); n.classList.add('qz-err'); n.focus(); api.sound('bad'); return api.toast('Gib deinem Quiz einen Titel'); }
        for(let i = 0; i < draft.qs.length; i++){
          const dq = draft.qs[i], card = box.querySelector('[data-qi="' + i + '"]');
          const fail = (msg, node) => { if(node){ node.classList.add('qz-err'); node.scrollIntoView({ block: 'center' }); } api.sound('bad'); api.toast('Frage ' + (i + 1) + ': ' + msg); };
          if(!dq.q.trim()) return fail('Text fehlt', card.querySelector('textarea'));
          const ins = card.querySelectorAll('.qz-opt input');
          const empty = dq.a.findIndex(a => !a.trim()); if(empty >= 0) return fail('Antwort ' + LETTERS[empty] + ' fehlt', ins[empty]);
          const low = dq.a.map(a => a.trim().toLowerCase()); const dup = low.findIndex((a, j) => low.indexOf(a) !== j);
          if(dup >= 0) return fail('Zwei Antworten sind gleich', ins[dup]);
        }
        const clean = cleanQuiz({ title: t, time: draft.time, pts: draft.pts, qs: draft.qs });
        if(!clean || clean.qs.length !== draft.qs.length){ api.sound('bad'); return api.toast('Da stimmt noch was nicht'); }
        const list = customs();
        const id = draft.id || ('q' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36));
        const obj = Object.assign({ id, created: draft.created || Date.now() }, clean);
        const i = list.findIndex(x => x.id === id);
        if(i >= 0) list[i] = obj; else list.unshift(obj);
        saveCustoms(list.slice(0, 60));
        api.sound('check'); api.toast('Gespeichert ✓');
        customList();
      }
      draw();
      screen(box);
    }

    function shareSheet(cq){
      const code = 'BQ1:' + b64e(JSON.stringify({ v: 1, title: cq.title, time: cq.time, pts: cq.pts, qs: cq.qs }));
      api.sheet(close => {
        const ta = el('textarea', { class: 'b-input qz-code', readonly: true, rows: '6' }); ta.value = code;
        const copy = el('button', { class: 'b-btn block', text: '📋 Code kopieren' });
        copy.addEventListener('click', () => {
          const ok = () => { api.sound('check'); api.toast('Code kopiert – schick ihn deinen Freunden!'); copy.textContent = '✓ Kopiert'; };
          const fallback = () => { ta.focus(); ta.select(); try{ if(document.execCommand && document.execCommand('copy')) return ok(); }catch(e){} api.toast('Code ist markiert – kopier ihn manuell'); };
          try{ if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, fallback); else fallback(); }catch(e){ fallback(); }
        });
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Quiz teilen' }),
          el('h3', { class: 'b-title', style: { overflowWrap: 'anywhere' }, text: cq.title }),
          el('p', { class: 'b-hint', text: 'Kopier den Code und schick ihn z. B. per WhatsApp. Deine Freunde fügen ihn unter „Eigene Quiz → Code“ ein.' }),
          ta, copy,
          el('button', { class: 'b-btn ghost block', text: 'Schließen', onclick: close })
        ]);
      });
    }

    function importSheet(){
      api.sheet(close => {
        const ta = el('textarea', { class: 'b-input qz-code', rows: '6', placeholder: 'BQ1:…' });
        const msg = el('p', { class: 'b-hint' });
        const go = () => {
          let raw = ta.value.replace(/\s+/g, '');
          if(!raw){ msg.textContent = 'Füg zuerst einen Code ein.'; return; }
          raw = raw.replace(/^BQ1:/i, '');
          let obj = null;
          try{ obj = cleanQuiz(JSON.parse(b64d(raw))); }catch(e){ obj = null; }
          if(!obj){ api.sound('bad'); msg.textContent = '❌ Der Code ist ungültig oder unvollständig. Prüf, ob du alles kopiert hast.'; msg.style.color = 'var(--bad)'; return; }
          const list = customs();
          list.unshift(Object.assign({ id: 'q' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), created: Date.now() }, obj));
          saveCustoms(list.slice(0, 60));
          api.sound('check'); api.toast('„' + obj.title + '“ importiert (' + obj.qs.length + ' Fragen)');
          close(); customList();
        };
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'Quiz importieren' }),
          el('p', { class: 'b-hint', text: 'Füge hier den Quiz-Code ein, den du bekommen hast.' }),
          ta, msg,
          el('button', { class: 'b-btn block', text: '📥 Importieren', onclick: go }),
          el('button', { class: 'b-btn ghost block', text: 'Abbrechen', onclick: close })
        ]);
      });
    }

    /* ================= KI-QUIZ ================= */
    function aiSheet(){
      if(!ai){ api.toast('KI ist gerade nicht verfügbar'); return; }
      let lvl = 1, busy = false;
      api.sheet(close => {
        const inp = el('input', { class: 'b-input', maxlength: '60', placeholder: 'z. B. Dinosaurier, Formel 1, Anime …', value: api.store.get('aiTopic', '') });
        const lv = el('div', { class: 'b-chips' });
        const drawL = () => { lv.innerHTML = ''; ['Leicht', 'Mittel', 'Schwer'].forEach((d, i) => lv.append(chip(d, lvl === i, () => { lvl = i; drawL(); }))); };
        drawL();
        const msg = el('p', { class: 'b-hint' });
        const btn = el('button', { class: 'b-btn cyan block', text: '🤖 Quiz erstellen' });
        btn.addEventListener('click', async () => {
          if(busy) return;
          const topic = inp.value.trim().replace(/[\u0000-\u001f"`]/g, '').slice(0, 60);
          if(topic.length < 2){ msg.textContent = 'Gib ein Thema ein (mind. 2 Zeichen).'; return; }
          api.store.set('aiTopic', topic);
          busy = true; btn.disabled = true; btn.innerHTML = ''; btn.append(el('span', { class: 'qz-spin' }), ' Fragen werden erstellt …');
          msg.style.color = ''; msg.textContent = 'Das kann ein paar Sekunden dauern.';
          const prompt = 'Erstelle genau 8 Multiple-Choice-Quizfragen auf Deutsch (du-Form) zum Thema "' + topic + '". Schwierigkeit: ' + ['leicht', 'mittel', 'schwer'][lvl] + '. ' +
            'Verwende nur gesicherte, überprüfbare Fakten und nichts Zeitabhängiges (keine aktuellen Rekorde, Amtsinhaber oder Ranglisten). ' +
            'Jede Frage hat genau 4 verschiedene, kurze Antworten, von denen genau eine richtig ist. Verteile die richtige Antwort zufällig auf die Positionen. ' +
            'Antworte AUSSCHLIESSLICH mit JSON in genau diesem Format, ohne weiteren Text: ' +
            '{"questions":[{"q":"Fragetext?","a":["Antwort 1","Antwort 2","Antwort 3","Antwort 4"],"c":0,"e":"Kurze Erklärung in einem Satz."}]} ' +
            '– dabei ist "c" der Index (0 bis 3) der richtigen Antwort in "a".';
          let res = null;
          try{ res = await ai.json(prompt); }catch(e){ res = null; }
          if(!alive) return;
          let arr = res && (Array.isArray(res) ? res : Array.isArray(res.questions) ? res.questions : null);
          const qs = arr ? arr.slice(0, 12).map(cleanQ).filter(Boolean).slice(0, 8) : [];
          busy = false; btn.disabled = false; btn.textContent = '🤖 Nochmal versuchen';
          if(qs.length < 4){
            api.sound('bad'); msg.style.color = 'var(--warn)';
            msg.textContent = 'Hoppla – die KI hat diesmal keine brauchbaren Fragen geliefert. Versuch es nochmal oder mit einem anderen Thema.';
            return;
          }
          close();
          play({ mode: 'ai', title: 'KI-Quiz', sub: '🤖 ' + topic, list: qs.map(q => Object.assign(prep(q), { d: lvl + 1 })), perQ: 20, base: 100, bestKey: null, again: () => aiSheet() });
        });
        return el('div', { class: 'b-stack' }, [
          el('div', { class: 'b-kicker', text: 'KI-Quiz' }),
          el('h3', { class: 'b-title', text: '🤖 Dein Wunschthema' }),
          el('p', { class: 'b-hint', text: 'Die KI erstellt dir 8 Fragen zu einem Thema deiner Wahl. KI kann sich irren – sieh die Antworten nicht als Lexikon.' }),
          el('div', {}, [el('span', { class: 'b-label', text: 'Thema' }), inp]),
          el('div', {}, [el('span', { class: 'b-label', text: 'Schwierigkeit' }), lv]),
          msg, btn,
          el('button', { class: 'b-btn ghost block', text: 'Abbrechen', onclick: close })
        ]);
      });
    }

    /* Start */
    if(api.params && api.params.daily) startDaily(); else menu();
    return () => { alive = false; stop(); };
  }
});
})();
