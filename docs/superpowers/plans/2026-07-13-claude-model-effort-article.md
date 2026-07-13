# Claude Model and Effort Knowledge Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine validierte deutschsprachige Source Note zum offiziellen ClaudeDevs-Post und dem verlinkten Anthropic-Artikel erstellen, einschließlich rechtlich zulässiger Originalgrafiken.

**Architecture:** Der X-Post ist die kanonische Primärquelle im Frontmatter; der offizielle Anthropic-Blogbeitrag liefert die ausführliche Fachevidenz und erscheint als Zusatzquelle. Artikel und zulässige Rasterbilder liegen in den bestehenden Knowledge- beziehungsweise Public-Asset-Verzeichnissen und werden mit dem gebündelten Knowledge-Curator-Validator sowie dem Projekt-Build geprüft.

**Tech Stack:** Markdown mit YAML-Frontmatter, Astro/Vite-Projekt, Node.js Knowledge-Curator-Validator, PowerShell für Datei- und Signaturprüfungen.

---

## Dateistruktur

- Create: `src/content/knowledge/claude-code-model-und-effort.md` — deutsche Source Note mit Metadaten, Synthese, Quellen und Wikilinks.
- Create when licensed: `public/images/knowledge/claude-code-model-und-effort/<descriptive-name>.<png|jpg|webp>` — geprüfte offizielle Originalgrafiken.
- Modify: `docs/superpowers/plans/2026-07-13-claude-model-effort-article.md` — Checkboxen während der Ausführung aktualisieren.

### Task 1: Evidenz, Bildrechte und Medien inventarisieren

- [ ] **Step 1: Primär- und Zusatzquelle vollständig erfassen**

Prüfe den X-Post `https://x.com/ClaudeDevs/status/2074900291062034618` auf Autor, Zeitstempel, Post-Typ, eingebettete Medien und Linkziel. Erfasse den vollständigen Hauptinhalt von `https://claude.com/blog/claude-model-and-effort-level-in-claude-code` einschließlich Bildpositionen, Bild-URLs, Captions und Aussagen zu Modellwahl, Effort, Kontext, Kosten und Diagnoseheuristik.

- [ ] **Step 2: Bildrechte aus offiziellen Bedingungen belegen**

Prüfe offizielle Anthropic-/Claude-Nutzungsbedingungen, Brand- oder Copyright-Hinweise auf eine Erlaubnis zur lokalen redaktionellen Wiederverwendung. Notiere pro Bild Urheber, Original-URL, Lizenz beziehungsweise Erlaubnis, Lizenz-URL und erforderliche Attribution. Wenn die Erlaubnis nicht eindeutig ist, lade das Bild nicht herunter und erzeuge keine lokale Bildreferenz.

- [ ] **Step 3: Zulässige Bilder herunterladen und technisch prüfen**

Lege nur bei geklärten Rechten `public/images/knowledge/claude-code-model-und-effort/` an. Verwende beschreibende Namen, ermittle den echten MIME-Typ, gleiche ihn mit Dateiendung und Dateisignatur ab und prüfe die Lesbarkeit. SVG-Dateien werden nicht gespeichert; ein SVG darf nur mit geklärten Rechten in ein geprüftes Rasterformat konvertiert werden.

- [ ] **Step 4: Medieninventar gegen Artikelstruktur prüfen**

Ordne jedes zulässige Bild genau dem Abschnitt zu, dessen Aussage es erklärt. Verwerfe Logos, dekorative Elemente und Bilder ohne fachlichen Mehrwert. Halte erforderliche Attribution für `## Quellen` oder eine unmittelbare Bildunterschrift fest.

### Task 2: Source Note schreiben

- [ ] **Step 1: Frontmatter mit Projektschema anlegen**

Erstelle `src/content/knowledge/claude-code-model-und-effort.md` mit `type: source`, `status: seed`, einer vorhandenen passenden Kategorie, einem unterstützten Lucide-Icon, Integer-`readTime`, nichtleeren Tags, Aliases und gequoteten Topics. Verwende den X-Post als `sourceURL`, `sourceType: tweet`, `author: "Claude Developers (@ClaudeDevs)"`, `sourceDate: "2026-07-08"` und `addedDate: "2026-07-13"`.

- [ ] **Step 2: Deutsche adaptive Synthese schreiben**

Strukturiere den Body nach dieser Lernlogik:

1. Modell und Effort sind zwei unterschiedliche Stellschrauben.
2. Modellwahl bestimmt den Fähigkeitsraum und die festen Modellgewichte.
3. Effort bestimmt Gründlichkeit, Tool-Nutzung, gelesene Dateien, Verifikation und Arbeitstiefe.
4. Vor dem Drehen an Reglern zuerst Kontext, Tools, Skills und Aufgabenabgrenzung prüfen.
5. Diagnose: „Wusste Claude nicht genug?“ führt zu einem stärkeren Modell; „Hat Claude nicht gründlich genug gearbeitet?“ führt zu höherem Effort.
6. Routinearbeit, komplexe Aufgaben und Kosten-/Tokenabwägung praxisnah einordnen.
7. Defaults als Ausgangspunkt empfehlen und die Heuristik als Orientierung statt starre Regel kennzeichnen.

Paraphrasiere auf natürlichem Deutsch, erfinde keine Tatsachen und kennzeichne illustrative Diagramme des Originals als solche.

- [ ] **Step 3: Bilder, Quellen und Verbindungen einfügen**

Referenziere ausschließlich erfolgreich geprüfte Rasterbilder mit absoluten Pfaden unter `/images/knowledge/claude-code-model-und-effort/`. Füge bei erforderlicher Attribution Urheber, Original-Asset-URL, Lizenzname, Lizenzlink und Änderungsstatus hinzu. Nenne den Anthropic-Blogbeitrag unter `## Quellen` als zusätzliche Quelle und führe unter `## Verbindungen` mindestens `[[Claude Code]]`, `[[Effort Level]]`, `[[Context Engineering]]` und `[[AI Models]]` auf.

- [ ] **Step 4: Read Time berechnen**

Berechne `readTime` nach `max(1, ceil(Wörter im Markdown-Body / 140))` und aktualisiere den Integer im Frontmatter.

### Task 3: Artikel validieren und Projekt prüfen

- [ ] **Step 1: Knowledge-Curator-Validator ausführen**

Run:

```powershell
node C:\Users\asi\.codex\skills\knowledge-curator\scripts\validate-knowledge-article.mjs src/content/knowledge/claude-code-model-und-effort.md --project-root C:\Users\asi\Documents\GitHub\vibedeck --additional-source-count 1
```

Expected: Exitcode `0` und eine erfolgreiche Validierung ohne Frontmatter-, Dubletten-, Quellen-, Asset-, Verbindungs- oder `readTime`-Fehler.

- [ ] **Step 2: Validatorfehler gezielt beheben und erneut prüfen**

Ändere ausschließlich den neuen Artikel oder seine neuen Assets. Wiederhole exakt den Validatorbefehl aus Step 1, bis er mit Exitcode `0` endet.

- [ ] **Step 3: Relevanten Projekt-Build ausführen**

Ermittle das Build-Skript aus `package.json` und führe es aus, standardmäßig:

```powershell
npm run build
```

Expected: Exitcode `0`. Bei vorbestehenden oder sachfremden Fehlern Befehl und Ausgabe dokumentieren, ohne fremden Code zu ändern.

- [ ] **Step 4: Arbeitsbaum und Assets abschließend prüfen**

Run:

```powershell
git status --short
Get-ChildItem public/images/knowledge/claude-code-model-und-effort -File -ErrorAction SilentlyContinue
rg -n "2074900291062034618|claude-model-and-effort-level" src/content/knowledge/claude-code-model-und-effort.md
```

Expected: Nur geplante Dateien sind neu oder geändert, jedes gelistete Asset wird im Artikel referenziert, und beide Quellen sind nachvollziehbar enthalten.

- [ ] **Step 5: Artikeländerungen committen**

```powershell
git add -- src/content/knowledge/claude-code-model-und-effort.md public/images/knowledge/claude-code-model-und-effort docs/superpowers/plans/2026-07-13-claude-model-effort-article.md
git commit -m "feat(knowledge): add Claude model and effort guide"
```

Expected: Ein Commit mit Artikel, zulässigen Bildern und abgehaktem Plan; nicht vorhandene Asset-Pfade werden vor `git add` ausgelassen.
