# TODO

## X-Ingest: Live-Fetch verifiziert ✅ (2026-07-12)

X-Zugang steht (HTTP 200). Live gegen die echte API geprüft:

- [x] Einzel-Tweet: `npm run ingest:x -- https://x.com/trq212/status/2073100352921215386 --force`
      → Dump mit Autor, Datum, Live-Metriken; Artikel-Warnung korrekt (nativer X-Artikel, Volltext nicht via Tweet-API)
- [x] Cache-Hit: derselbe Befehl **ohne** `--force` → "● Cache-Treffer", kein API-Call
- [x] Thread-Cascade (`--thread`) → recent-search lief; bei diesem Inhalt 1 Post (kein Reply-Thread, sondern Einzel-Tweet mit Artikel-Link)

**Optional / noch nicht praktisch erprobt:**
- [ ] Rückwärts-Walk an einem echten mehrteiligen Reply-Thread: URL des **letzten** Tweets mit `--thread` → Methode "backward-walk", Posts chronologisch (Codepfad vorhanden + logikgetestet, aber noch nicht live gegen einen echten Thread gelaufen)

**Schnell-Diagnose des Zugangs (roher HTTP-Code, ohne Token-Ausgabe):**
```bash
source <(grep '^X_BEARER_TOKEN=' .env.local | sed 's/^/export /')
curl -s -o /dev/null -w "HTTP %{http_code}\n" -H "Authorization: Bearer $X_BEARER_TOKEN" "https://api.x.com/2/tweets/20"
```
`HTTP 200` = Zugang steht. `HTTP 402` = Credits leer. `HTTP 503` = Provisionierung X-seitig nicht aktiv.
