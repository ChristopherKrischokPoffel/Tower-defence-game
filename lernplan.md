# Tower-Defense-Spiel: Lernplan

Das Spiel ist in 7 Stufen und 32 Tagesprobleme zerlegt. Jedes Problem ist so klein, dass du es an einem Tag lösen kannst, und nach jeder Stufe läuft etwas Sichtbares im Browser.

Abhaken: `- [ ]` zu `- [x]` ändern. Formatierte Ansicht in VS Code: Rechtsklick auf die Datei, "Vorschau öffnen" (oder Strg+Umschalt+V).

## So nutzt du den Plan

1. Nimm das nächste offene Problem, immer nur eins pro Tag.
2. Versuch es 20 bis 30 Minuten allein, bevor du nachschlägst oder nach einem Tipp fragst.
3. Prüfe die Bedingung hinter "Fertig, wenn" im Browser und hake das Problem ab.
4. Schreib einen Satz auf, was du dabei gelernt hast.

Wenn ein Problem an einem Tag nicht aufgeht, ist es zu groß. Teile es dann in zwei kleinere und mach am nächsten Tag weiter.

## Stufe 0: Vorbereitung

Am Ende hast du ein leeres Projekt, das im Browser läuft, und kennst die JavaScript-Grundlagen, die sich von Java unterscheiden.

- [x] **Tag 1: Werkzeug einrichten.** VS Code mit der Erweiterung Live Server, dazu ein Projektordner mit `index.html`, `style.css` und `game.js`. Fertig, wenn deine Seite eine Überschrift im Browser zeigt.
- [x] **Tag 2: JavaScript einbinden.** Fertig, wenn eine eigene Nachricht aus `game.js` in der Browser-Konsole (F12) erscheint.
- [x] **Tag 3: Grundlagen im Vergleich zu Java.** Variablen mit `let` und `const`, Funktionen, `if`, Schleifen. Fertig, wenn eine Funktion die Zahlen 1 bis 10 ausgibt und die geraden markiert.
- [x] **Tag 4: Objekte und Arrays.** Fertig, wenn ein Array mit drei Bauern (jeweils Name, x, y) per Schleife alle Namen in die Konsole schreibt.

## Stufe 1: Welt und Burg

Am Ende steht die Burg in der Mitte der Karte und das Spiel zeichnet sich ständig neu.

- [x] **Tag 5: Canvas anlegen.** Fertig, wenn eine farbige Fläche von 800 × 600 Pixeln auf der Seite sichtbar ist.
- [x] **Tag 6: Formen zeichnen.** Fertig, wenn ein Rechteck und ein Kreis an Positionen stehen, die du vorher festgelegt hast.
- [x] **Tag 7: Burg in die Mitte.** Die Position wird aus Breite und Höhe des Canvas berechnet. Fertig, wenn die Burg mittig bleibt, auch nachdem du die Canvas-Größe geändert hast.
- [x] **Tag 8: Game Loop.** Eine Schleife mit `requestAnimationFrame`, getrennt in Berechnen und Zeichnen. Fertig, wenn ein Kreis von selbst über die Karte wandert.

## Stufe 2: Bauer auswählen und bewegen

Am Ende klickst du den Bauern an und schickst ihn per Klick über die Karte. Hier kommen Klassen dazu, wie in Java.

- [x] **Tag 9: Klasse Bauer.** Mit Konstruktor und einer Methode zum Zeichnen. Fertig, wenn ein Bauer neben der Burg erscheint, der aus der Klasse erzeugt wurde.
- [x] **Tag 10: Mausklick lesen.** Fertig, wenn bei jedem Klick die Position in Canvas-Koordinaten in der Konsole steht.
- [x] **Tag 11: Treffer prüfen.** Abstand zwischen Klick und Bauer berechnen. Fertig, wenn die Konsole nur dann "getroffen" meldet, wenn du wirklich auf den Bauern klickst.
- [x] **Tag 12: Auswahl anzeigen.** Fertig, wenn der gewählte Bauer einen Rahmen bekommt und ein Klick ins Leere die Auswahl aufhebt.
- [x] **Tag 13: Zum Ziel laufen.** Der Bauer bewegt sich mit fester Geschwindigkeit zum Klickpunkt. Fertig, wenn er in jede Richtung gleich schnell läuft und am Ziel ruhig stehen bleibt.

## Stufe 3: Ressourcen sammeln

Am Ende sammelt der Bauer selbstständig Holz und bringt es zur Burg. Der Kern ist eine Zustandsfolge, ähnlich einer Schrittkette in der SPS.

- [x] **Tag 14: Ressourcen auf der Karte.** Eine Klasse für Bäume, mehrere davon in einem Array. Fertig, wenn fünf Bäume verteilt auf der Karte stehen.
- [x] **Tag 15: Bauer zum Baum schicken.** Fertig, wenn ein Klick auf einen Baum den gewählten Bauern dorthin laufen lässt.
- [x] **Tag 16: Zustände.** Der Bauer kennt: wartet, läuft hin, sammelt, läuft zurück. Fertig, wenn der aktuelle Zustand als Text über dem Bauern steht und richtig wechselt.
- [x] **Tag 17: Sammeln mit Timer.** Fertig, wenn der Bauer 3 Sekunden am Baum bleibt, zur Burg läuft und danach von allein wieder zum Baum geht.
- [x] **Tag 18: Holz-Zähler.** Fertig, wenn bei jeder Abgabe an der Burg die Anzeige oben am Bildschirm hochzählt.

## Stufe 4: Monster

Am Ende greifen Monster die Burg an und du kannst verlieren.

- [x] **Tag 19: Klasse Monster.** Fertig, wenn bei jedem Neuladen ein Monster an einer zufälligen Stelle am Kartenrand erscheint.
- [x] **Tag 20: Zur Burg laufen.** Nutze die Bewegung von Tag 13 wieder. Fertig, wenn das Monster zur Burg läuft und Bauer und Monster dieselbe Bewegungsfunktion verwenden.
- [x] **Tag 21: Lebenspunkte der Burg.** Fertig, wenn ein ankommendes Monster Schaden macht, verschwindet und ein Lebensbalken das zeigt.
- [x] **Tag 22: Spawn-Timer.** Fertig, wenn das erste Monster nach 30 Sekunden kommt und danach regelmäßig weitere, alle in einem Array verwaltet.
- [x] **Tag 23: Game Over.** Fertig, wenn das Spiel bei 0 Leben stoppt, einen Text zeigt und per Taste neu startet.

## Stufe 5: Türme

Am Ende ist das Spiel spielbar: sammeln, bauen, verteidigen.

- [x] **Tag 24: Turm platzieren.** Fertig, wenn du per Button in einen Bau-Modus wechselst und ein Klick einen Turm auf die Karte setzt.
- [x] **Tag 25: Baukosten.** Fertig, wenn ein Turm Holz kostet und sich ohne genug Holz nicht bauen lässt.
- [x] **Tag 26: Ziel suchen.** Fertig, wenn jeder Turm eine Linie zum nächsten Monster in seiner Reichweite zeichnet und zu keinem außerhalb.
- [x] **Tag 27: Schießen.** Monster bekommen Lebenspunkte, Türme eine Pause zwischen zwei Schüssen. Fertig, wenn ein Monster nach mehreren Treffern 0 Leben hat.
- [x] **Tag 28: Monster entfernen und testen.** Fertig, wenn tote Monster verschwinden und du 5 Minuten ohne Fehlermeldung in der Konsole spielen kannst.

## Stufe 6: Ausbau

Ab hier ist die Reihenfolge frei, nimm zuerst, was dich am meisten reizt.

- [ ] **Tag 29: Wellen.** Fertig, wenn Monster in Wellen kommen und jede Welle größer oder stärker ist als die davor.
- [ ] **Tag 30: Soldaten.** Fertig, wenn du an der Burg für Holz einen Soldaten ausbildest, der Monster in seiner Nähe angreift.
- [x] **Tag 31: Grafiken.** Fertig, wenn Burg, Bauer und Monster als Bilder statt als Formen erscheinen.
- [ ] **Tag 32: Online stellen.** Fertig, wenn das Spiel über GitHub Pages unter einem Link erreichbar ist.

Weitere Ideen für danach:
- Spielfeld an die Bildschirmgröße anpassen (intern feste Größe, Darstellung skaliert), damit es auf Laptop und 2K-Monitor gleich spielt.
- Mehrere Bauern, Stein als zweite Ressource, Sound, eine Highscore-Liste mit einem Java-Backend.
