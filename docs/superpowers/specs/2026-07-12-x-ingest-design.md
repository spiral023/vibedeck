# X-Ingest für Knowledge-Artikel — Design

**Datum:** 2026-07-12
**Status:** Approved (Design)
**Autor:** Philipp Asanger + Claude

## Problem

Knowledge-Artikel werden häufig aus X-Posts (Tweets, Threads, native X-Artikel) erstellt. Der bisherige Weg über `WebFetch` gegen x.com scheitert (HTTP 402/403), und der fxtwitter-Workaround ist unzuverlässig und liefert bei nativen X-Artikeln nur Metadaten. Es gibt eine dedizierte X-App (`vibedeck-ingest`) mit API-Zugang (Pay-per-use). Ziel: X-Inhalte zuverlässig und requestsparsam abrufen und daraus Knowledge-Artikel erzeugen.

## Constraints

- **Statische Site ohne Backend.** Secrets dürfen nie ins App-Bundle oder ins Repo gelangen. X-API darf nur aus lokalen Build-/Dev-Scripts heraus aufgerufen werden.
- **Pay-per-use API.** Jeder Request kostet. Das Script muss Requests minimieren (ein Call pro Tweet, lokaler Cache, Thread-Auflösung nur auf explizite Anforderung).
- **Nur Lesezugriff auf öffentliche Posts.** App-only-Auth per Bearer Token genügt. Consumer Key/Secret (OAuth-User-Context) werden nicht benötigt und nicht gespeichert.
- **Bestehende Muster.** Neue Scripts folgen dem Stil von `scripts/generate-search-index.mjs` (natives Node, ESM `.mjs`).

## Architektur

### Komponenten

| Komponente | Ort | Zweck |
| --- | --- | --- |
| Dependency `twitter-api-v2` | `package.json` (`devDependencies`) | Typisierter X-API-Client, Auth/Rate-Limits/Paginierung; nur in Scripts genutzt, nie im Bundle |
| Ingest-Script | `scripts/ingest-x.mjs` | Holt Tweet/Thread, schreibt Cache + lesbaren Dump |
| npm-Script | `package.json` → `"ingest:x"` | `node scripts/ingest-x.mjs` |
| Secret | `.env.local` → `X_BEARER_TOKEN` | Bearer Token (gitignored) |
| Doku | `.env.example` | Dokumentiert erwartete Variable, committed |
| Cache/Output | `scripts/.ingest/` | Roh-JSON + Markdown-Dump; gitignored |
| Workflow-Doku | `CLAUDE.md` | Abschnitt „Knowledge-Artikel aus X-Posts" |

### Aufruf

```bash
npm run ingest:x -- <tweet-url-oder-id> [--thread] [--force]
```

- `<tweet-url-oder-id>`: Voll-URL (`x.com/...`, `twitter.com/...`) oder nackte Tweet-ID.
- `--thread`: Löst zusätzlich den Thread über `conversation_id` auf (zweiter Request).
- `--force`: Ignoriert den Cache und fetcht erneut.

## Datenfluss

1. **ID parsen** aus URL oder direktem ID-Argument. Ungültige Eingabe → verständlicher Fehler.
2. **Env laden** via `process.loadEnvFile('.env.local')` (nativ ab Node 20.6+, kein dotenv). Fehlt `X_BEARER_TOKEN` → Setup-Hinweis, Exit.
3. **Cache-Check**: Existiert `scripts/.ingest/<id>.json` und kein `--force` → Cache nutzen, kein API-Call.
4. **Ein API-Call**: `GET /2/tweets/:id` mit maximalen Feldern in einem Request:
   - `tweet.fields`: `note_tweet` (lange Posts >280 Zeichen), `article` (native X-Artikel), `created_at`, `public_metrics`, `entities`, `author_id`, `conversation_id`, `attachments`
   - `expansions`: `author_id`, `attachments.media_keys`
   - `user.fields`: `name`, `username`, `verified`
   - `media.fields`: `type`, `alt_text`, `url`, `preview_image_url`
5. **Optional Thread** (`--thread`): Recent Search `conversation_id:<id> from:<author>` → sammelt Folge-Posts. Recent Search deckt nur ~7 Tage ab; bei älteren Threads klare Meldung statt Fehler, Einzel-Tweet wird trotzdem verarbeitet.
6. **Output schreiben** nach `scripts/.ingest/`:
   - `<id>.json`: rohe API-Response (Cache + Referenz für spätere Läufe)
   - `<id>.md`: lesbarer Dump — Autor + Handle, Datum, `public_metrics`, vollständiger Text (aus `note_tweet.text` falls vorhanden, sonst `text`), extrahierte Links (aus `entities.urls`, expandiert), Media-Beschreibungen (Typ + Alt-Text), bei `--thread` die nummerierten Folge-Posts.
7. **Konsolenausgabe**: Pfad zum Dump + kurze Zusammenfassung (Autor, Zeichenzahl, ob Volltext/Thread vorhanden).

## Fehlerbehandlung

| Situation | Verhalten |
| --- | --- |
| Fehlender Token | Klartext-Meldung mit Setup-Anleitung (`.env.local` anlegen, `X_BEARER_TOKEN=` setzen), Exit 1 |
| 401 / 403 | Hinweis auf Token-Gültigkeit / App-Berechtigung |
| 404 | Post gelöscht, privat oder ID falsch |
| 429 (Rate/Budget) | Rate-Limit-Meldung inkl. Reset-Zeit aus Header, kein Retry-Loop (Pay-per-use — nicht blind wiederholen) |
| Native X-Artikel ohne Volltext | Dump vermerkt explizit „nur Metadaten verfügbar"; Claude weicht dann auf Sekundärquellen aus |
| `--thread` außerhalb 7-Tage-Fenster | Meldung „Thread-Auflösung nicht möglich (älter als 7 Tage)", Einzel-Tweet wird dennoch verarbeitet |

## Claude-Workflow (CLAUDE.md)

Neuer Abschnitt „Knowledge-Artikel aus X-Posts":

> Wenn der User einen Knowledge-Artikel aus einer X-URL anlegen will:
> 1. `npm run ingest:x -- <url>` ausführen (bei Threads `--thread` ergänzen).
> 2. Dump aus `scripts/.ingest/<id>.md` lesen.
> 3. Artikel nach Frontmatter-Schema (`src/types/knowledge.ts`) in `src/content/knowledge/` schreiben; `sourceURL`, `author`, `sourceDate` aus dem Dump übernehmen.
> 4. `npm run content:generate-search-index` ausführen.

Ersetzt den fxtwitter-Workaround.

## Sicherheit

- Nur `X_BEARER_TOKEN` wird gespeichert (App-only-Auth, reiner Lesezugriff). Consumer Key/Secret werden nicht abgelegt — kleinere Angriffsfläche.
- `.env.local` und `scripts/.ingest/` sind gitignored (`.env.local` bereits; `.ingest/` wird ergänzt).
- `.env.example` committet nur den Variablennamen, keinen Wert.

## Verifikation

Kein Test-Framework konfiguriert. Verifikation durch einen echten Lauf:

- `npm run ingest:x -- https://x.com/trq212/status/2073100352921215386` (der Tweet aus der vorigen Session).
- Prüfen: `scripts/.ingest/2073100352921215386.json` und `.md` entstehen, Dump enthält Autor „Thariq", Datum, Volltext/Metadaten.
- Zweiter Lauf ohne `--force`: kein neuer API-Call (Cache-Hit), Ausgabe bestätigt Cache-Nutzung.

## YAGNI / bewusst ausgeschlossen

- Kein MCP-Server (CLI-Script genügt).
- Keine automatische Artikel-Generierung im Script — das bleibt bei Claude (redaktioneller Feinschliff, Deutsch, Frontmatter).
- Kein OAuth-User-Context (kein Posten/DMs).
- Keine Media-Downloads (nur Beschreibungen/URLs im Dump).
