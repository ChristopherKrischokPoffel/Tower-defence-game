# Browser Tower Defence

Ein kleines Tower-Defense-Spiel im Browser, geschrieben in reinem JavaScript mit dem HTML-Canvas, ohne Frameworks. Entstanden als Selbststudium-Projekt.

## Spielprinzip

- In der Mitte steht deine Burg. Alle 30 Sekunden kommt ein Goblin vom Kartenrand und läuft auf sie zu.
- Dein Bauer sammelt Holz: Linksklick wählt ihn aus, Rechtsklick auf einen Baum schickt ihn zum Arbeiten. Er bringt das Holz selbstständig zur Burg.
- Mit dem Holz baust du Türme: Turm-Button in der Sidebar anklicken, dann aufs Spielfeld klicken.
- Türme schießen auf das nächste Monster in ihrer Reichweite.
- Hat die Burg keine Lebenspunkte mehr, ist das Spiel vorbei. Mit der Leertaste startest du neu.

## Starten

Das Spiel benutzt ES-Module (`type="module"`), deshalb muss es über einen lokalen Server laufen und nicht per Doppelklick auf die HTML-Datei. Am einfachsten geht das in VS Code mit der Erweiterung **Live Server**: Rechtsklick auf `index.html` und dann "Open with Live Server".

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seite mit den beiden Canvas (Spielfeld und Sidebar) |
| `style.css` | Layout und Farben |
| `game.js` | Game Loop, Eingaben, Bauen, Spawnen, Neustart |
| `classes.js` | Klassen: Bauer, Baum, Burg, Goblin, Turm, Button |
| `assets/` | Pixel-Sprites |
| `lernplan.md` | Der Lernplan, nach dem das Spiel entstanden ist |
