# VibeDeck - Gemini Context & Guidelines

## Projekt-Übersicht

VibeDeck ist eine Next.js-Anwendung mit einer Wissensdatenbank (Knowledge Base), die Markdown-basiert arbeitet.

- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons.
- **Content**: Markdown-Dateien in `src/content/knowledge/`.
- **Assets**: Bilder werden in `public/images/knowledge/` gespeichert.

## System & Shell

- **PowerShell 7**: Nutze ausschließlich `pwsh` für Shell-Befehle.
- **Keine Unix-Tools**: Nutze **KEIN** `grep`, `find`, `ls`, `rm` oder `cp`. Diese sind auf Windows oft nicht verfügbar oder verhalten sich anders.
- **PowerShell-Äquivalente**:
  - `grep` -> `Select-String`
  - `find` -> `Get-ChildItem -Recurse`
  - `ls` -> `Get-ChildItem`
  - `rm` -> `Remove-Item`
  - `cp` -> `Copy-Item`
- **Verkettung**: Nutze `;` statt `&&` (z.B. `pwsh -Command "cmd1; cmd2"`). Das ist robuster und vermeidet Parsing-Fehler.
- **Beispiel Suche**: `pwsh -Command "Get-ChildItem -Path src -Filter *.md -Recurse | Select-String -Pattern 'Suche'"`

## Workflow: Tweets in Wissensartikel umwandeln

Dieser Workflow beschreibt, wie du effektiv Tweets (z.B. Tutorials, Threads) in strukturierte Wissensartikel überführst.

### 1. Inhalt abrufen

Da direktes Scraping oft blockiert wird, nutze die `chrome-devtools` Skill:

1.  Öffne den Tweet: `new_page(url="https://x.com/...")`
2.  Warte auf Content: `wait_for(text="Ein markantes Wort im Tweet")` (oder direkt Snapshot)
3.  Erstelle einen Snapshot: `take_snapshot(filePath="tweet_content.md")`
4.  Lese den Snapshot: `read_file("tweet_content.md")`

### 2. Bilder sichern

Tweets enthalten oft wertvolle Diagramme oder Screenshots.

1.  Identifiziere die Bild-URLs aus dem Snapshot (suche nach `pbs.twimg.com`).
2.  Erstelle einen Ordner für den Artikel:
    ```bash
    mkdir -p public/images/knowledge/<artikel-slug>
    ```
3.  Lade die Bilder herunter (nutze `curl`):
    ```bash
    curl -o "public/images/knowledge/<artikel-slug>/header.jpg" "https://pbs.twimg.com/..."
    ```

### 3. Markdown-Artikel erstellen

Erstelle eine neue Datei in `src/content/knowledge/<artikel-slug>.md`.

**Frontmatter-Format:**

```yaml
---
title: "Der Titel des Artikels"
description: "Kurze Zusammenfassung."
category: fundamentals # oder: patterns, security, performance
icon: Rocket # Wähle passendes Lucide Icon (Code2, Layers, Zap, etc.)
readTime: 10 Min
---
```

**Content-Richtlinien:**

- **Quelle nennen**: Füge am Anfang einen Hinweis und Link zum Original-Tweet hinzu.
- **Bilder einbinden**: `![Beschreibung](/images/knowledge/<artikel-slug>/bildname.jpg)`
- **Strukturieren**: Nutze H2 (`##`) und H3 (`###`) für Abschnitte.
- **Sprache**: Übersetze die Struktur und erklärenden Text ins Deutsche, aber behalte technische Begriffe oder Prompts (wenn relevant) im Original (Englisch), da diese oft präziser sind. Fasse nichts zusammen sondern behalte den Umfang bei.
- **Formatierung**: Nutze Blockquotes (`>`) für wichtige Merksätze oder Regeln.

### 4. Cleanup

Lösche temporäre Snapshot-Dateien nach erfolgreicher Erstellung:

```powershell
Remove-Item -Path tweet_content.md
```

## Deployment (Cloudflare Pages)

Das Projekt wird als statischer Export (`output: 'export'` in `next.config.mjs`) auf Cloudflare Pages deployed.

### Prozess

1.  **Build**: Erzeugt den statischen `out`-Ordner.
    ```powershell
    npm run build
    ```
2.  **Deploy**: Lädt den `out`-Ordner hoch.
    ```powershell
    npx wrangler pages deploy out
    ```