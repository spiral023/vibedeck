---
title: "Das .env-Setup, das Claude Code von deinen Secrets fernhaelt"
description: "Ein Source Note zu Deny-Regeln, Dummy-Test-Umgebungen, Pre-Commit-Checks und Container-Isolation, damit Claude Code keine API-Keys, Datenbank-Passwörter oder Credential-Dateien in den Kontext zieht."
type: source
status: seed
category: security
icon: Shield
readTime: 8
tags:
  - security/claude-code
  - security/secrets-management
  - tooling/permissions
  - workflows/pre-commit
  - security/container-isolation
aliases:
  - "The .env Setup That Keeps Claude Code From Leaking Your Secrets"
  - "Claude Code .env Security"
topics:
  - "[[Claude Code]]"
  - "[[Secrets Management]]"
  - "[[Deny Rules]]"
  - "[[.env Files]]"
  - "[[Pre-commit Hooks]]"
  - "[[Container Isolation]]"
up: "[[Claude Code]]"
sourceURL: "https://x.com/zodchiii/status/2049779422291460576"
sourceType: tweet
author: "darkzodchi (@zodchiii)"
sourceDate: "2026-04-30"
addedDate: "2026-05-25"
level: intermediate
---

![Claude Code Env Security Header](/images/knowledge/claude-code-env-security/header.jpg)

Der Kernpunkt dieses Posts ist einfach und wichtig: Wenn Claude Code Zugriff auf dein Projekt hat, dann sind `.env`-Dateien und andere Secret-Container ohne echte Zugriffssperren kein "weiches Risiko", sondern ein direkter Leckpfad.

darkzodchi argumentiert sehr klar gegen eine weit verbreitete Scheinsicherheit:

> Ein Hinweis in `CLAUDE.md` wie "lies niemals .env" ist nur Advisory. Eine Deny-Regel in `settings.json` ist erzwungene Zugriffskontrolle.

Genau diese Trennung zwischen **Instruktion** und **technischer Durchsetzung** ist der eigentliche Wert des Artikels.

## Warum `CLAUDE.md` allein nicht reicht

Viele Teams schreiben Sicherheitsregeln in `CLAUDE.md` und gehen davon aus, dass das Problem damit gelöst ist. Der Post stellt sich explizit gegen diese Annahme.

Die Begründung ist pragmatisch:

- `CLAUDE.md` ist Teil des Kontextes, kein Sandbox-Mechanismus
- bei komplexen oder mehrdeutigen Tasks kann Advisory-Verhalten versagen
- echte Sicherheit beginnt erst dort, wo ein Zugriff vor dem Modell blockiert wird

Damit wird aus "bitte nicht lesen" ein härterer Standard:

- nicht **sollte nicht**
- sondern **kann technisch nicht**

## Die drei Leckpfade für Secrets

Besonders gut am Artikel ist, dass er nicht nur auf den offensichtlichen Fall schaut.

### 1. Direkter File-Read

Claude oeffnet `.env`, `.pem`, `.key` oder andere Secret-Dateien direkt. Das ist der offensichtlichste Fall und der einfachste, den man mit Deny-Regeln abfangen kann.

### 2. Runtime-Output-Capture

Der häufig unterschätzte Fall: Claude startet Tests, die App oder ein Script, und im Output landen Auth-Header, Connection Strings oder echte API-Keys.

Das Problem hier ist nicht der Dateizugriff, sondern der **Befehls-Output**, der in den Conversation-Kontext gezogen wird.

### 3. Search- und Grep-Treffer

Auch Suchwerkzeuge können Secrets sichtbar machen, wenn sie Config-Dateien, Credential-Files oder sensible Trefferzeilen zurückgeben.

Der wichtige Punkt: Viele Nutzer schuetzen nur Pfad 1. Der Artikel macht zu Recht darauf aufmerksam, dass Pfad 2 und 3 oft die eigentlichen Leaks produzieren.

## Der wichtigste Fix: globale Deny-Regeln

Der technische Mindeststandard aus dem Post ist eine globale Deny-Liste in `~/.claude/settings.json`.

Beispiel:

```json
{
  "permissions": {
    "deny": [
      "Read(**/.env*)",
      "Read(**/.dev.vars*)",
      "Read(**/*.pem)",
      "Read(**/*.key)",
      "Read(**/secrets/**)",
      "Read(**/credentials/**)",
      "Read(**/.aws/**)",
      "Read(**/.ssh/**)",
      "Read(**/config/database.yml)",
      "Read(**/config/credentials.json)",
      "Read(**/.npmrc)",
      "Read(**/.pypirc)",
      "Write(**/.env*)",
      "Write(**/secrets/**)",
      "Write(**/.ssh/**)"
    ]
  }
}
```

Das ist die tragende Schutzschicht des ganzen Artikels. Sie blockiert Datei-Zugriffe auf Systemebene, bevor Claude die Inhalte überhaupt sehen kann.

## Dummy-Werte für Tests statt echte Secrets

Deny-Regeln lösen nur direkte Dateioperationen. Sie lösen nicht das Problem, dass Laufzeit-Logs sensible Daten enthalten können.

Deshalb empfiehlt der Artikel ein separates `.env.test` mit garantiert harmlosen Werten:

```dotenv
STRIPE_SECRET_KEY=sk_test_not_a_real_key
DATABASE_URL=postgres://test:test@localhost:5432/testdb
OPENAI_API_KEY=sk-test-dummy-key-for-mocking
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Das ist ein starkes Pattern, weil es die Sicherheitsfrage an die richtige Stelle verschiebt: Nicht nur "wer darf lesen?", sondern auch "was ist überhaupt lesbar, wenn Output auftaucht?".

## Pre-Commit-Hooks als letzte Barriere

Der nächste Baustein ist ein Git-Hook, der Commits mit typischen Secret-Patterns stoppt.

Der Post nennt dafür Signaturen wie:

- `sk-ant-`
- `sk-live-`
- `ghp_`
- `AKIA`
- `xox[bpors]-`
- `BEGIN.*PRIVATE KEY`

Das ist keine perfekte Data-Loss-Prevention, aber ein sinnvoller letzter Check vor dem Repo.

Die Grundidee:

```bash
#!/bin/bash
# .git/hooks/pre-commit

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached --diff-filter=ACM | grep -qE "$pattern"; then
    echo "BLOCKED: Found potential secret"
    exit 1
  fi
done
```

Wichtig ist hier weniger der exakte Regex-Satz als der operative Standard: **Kein Commit ohne Secret-Scan**.

## Container-Isolation für harte Umgebungen

Für besonders sensible Projekte schlägt der Artikel eine konsequentere Variante vor: Claude Code in einem Container laufen lassen, in dem produktive `.env`-Dateien gar nicht vorhanden sind.

Beispiel:

```bash
docker run -v /dev/null:/app/.env:ro your-dev-container
```

Das ist für viele Projekte zu aufwendig. Für Client-Arbeit, produktive Credentials oder regulierte Umgebungen ist der Gedanke aber korrekt: Was nicht im Dateisystem liegt, kann auch nicht versehentlich in den Kontext geraten.

## Vollständige Security-Konfiguration statt Einzelregel

Der Artikel kombiniert die Secret-Deny-Regeln am Ende mit einer umfassenderen `settings.json`, die zugleich:

- häufige Read-/Edit-/Test-Workflows erlaubt
- Secret-Dateien und Credential-Pfade sperrt
- gefährliche Writes blockiert
- riskante Shell-Kommandos wie `rm -rf`, `sudo`, `git push`, `npm publish` oder Pipe-to-shell verbietet

Gerade diese Kombination ist stark, weil sie Security nicht als separate Policy behandelt, sondern als **Teil des täglichen Agent-Workflows**.

## Die 6-Punkte-Checkliste vor der nächsten Session

Zum Schluss formuliert der Post eine praktische Checkliste:

1. Gibt es Deny-Regeln für `.env` und ähnliche Dateien?
2. Nutzen Tests eine sichere `.env.test`?
3. Scannt ein Pre-Commit-Hook nach Secret-Patterns?
4. Liegen produktive Credentials in einem Vault statt in Plaintext-Files?
5. Ist `.env` im `.gitignore`?
6. Liegen `.env`-Dateien idealerweise außerhalb des Projektverzeichnisses?

Das ist ein nützlicher Abschluss, weil damit aus einer Security-Idee eine konkrete Betriebsroutine wird.

## Was aus dem Artikel hängen bleibt

Die beste Einsicht ist nicht "schütz `.env`". Das weiß jeder. Die stärkere Einsicht ist:

> Advisory-Regeln sind kein Sicherheitsmechanismus. Deny-Regeln, Dummy-Runtime-Daten und harte Isolationsgrenzen sind es.

Daraus lassen sich drei robuste Prinzipien ableiten:

1. Secrets müssen vor dem Modell blockiert werden, nicht nur im Kontext verboten.
2. Laufzeit-Output ist genauso gefährlich wie direkte Datei-Reads.
3. Gute Claude-Code-Security ist eine Kombination aus Permissions, Dummy-Testdaten, Git-Checks und optionaler Container-Isolation.

Wenn Du Claude Code in echten Projekten mit produktiven Keys, Datenbanken oder Client-Zugängen einsetzt, ist dieser Artikel ein guter Minimalstandard für den Umgang mit Secrets.

## Verbindungen
- [[Claude Code]]
- [[Secrets Management]]
- [[Deny Rules]]
- [[.env Files]]
- [[Pre-commit Hooks]]
- [[Container Isolation]]
- [[Runtime Output Capture]]
- [[Permission Model]]
- [[Credential Hygiene]]
- [[Security Guardrails]]
