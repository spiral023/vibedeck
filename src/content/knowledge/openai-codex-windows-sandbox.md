---
title: "Wie OpenAI die Windows-Sandbox für Codex gebaut hat"
description: "Ein Source Note zum OpenAI-Engineering-Post über die Windows-Sandbox für Codex: warum bestehende Windows-Primitiven nicht reichten, wie der erste unelevated Prototype funktionierte und warum OpenAI am Ende bei einer elevated Architektur mit eigenen Sandbox-Usern, Firewall-Regeln und einem separaten Command Runner landete."
type: source
status: seed
category: security
icon: Layers
readTime: 9
tags:
  - security/codex
  - security/sandboxing
  - tooling/windows
  - fundamentals/os-isolation
  - architecture/agent-runtime
aliases:
  - "Building a safe, effective sandbox to enable Codex on Windows"
  - "Codex Windows Sandbox"
topics:
  - "[[Codex]]"
  - "[[Sandbox]]"
  - "[[Windows Security]]"
  - "[[ACLs]]"
  - "[[Restricted Tokens]]"
  - "[[Windows Firewall]]"
  - "[[Agent Runtime]]"
up: "[[Codex]]"
sourceURL: "https://openai.com/index/building-codex-windows-sandbox/"
sourceType: blog
author: "David Wiesen"
sourceDate: "2026-05-13"
addedDate: "2026-05-25"
level: advanced
---

OpenAI beschreibt in diesem Engineering-Post ein Problem, das auf Windows deutlich härter ist als auf macOS oder Linux: Codex braucht eine Sandbox, die echte Entwickler-Workflows zulässt, aber trotzdem lokal wirksame Grenzen für Writes und Network Access durchsetzt.

Der Ausgangspunkt war unattraktiv. Ohne Sandbox mussten Windows-Nutzer entweder fast jede Aktion bestätigen oder Full Access aktivieren. Beides verfehlt das Ziel eines Coding Agents, der ohne ständige Rückfragen sinnvoll arbeiten soll.

> Die Kernfrage des Artikels ist nicht nur "Wie sperren wir etwas ein?", sondern "Wie sperren wir es so ein, dass ein echter Entwickler-Workflow trotzdem noch funktioniert?"

## Warum die naheliegenden Windows-Lösungen nicht reichten

OpenAI prüfte drei vorhandene Windows-Mechanismen und verwarf alle.

### AppContainer war zu eng für offene Agent-Workflows

AppContainer ist die native Windows-Sandbox, aber für Anwendungen gedacht, die ihren Zugriff im Voraus genau kennen. Genau das passt nicht zu Codex.

Codex muss Shells, Git, Python, Package Manager, Build Tools und beliebige andere Binaries ansteuern können. Das ist kein statisch definierter App-Container, sondern ein offener Arbeitskontext.

### Windows Sandbox war zu getrennt vom echten Entwickler-Setup

Windows Sandbox bietet zwar eine starke VM-Grenze, aber genau das ist hier auch das Problem. Codex soll auf dem realen Checkout, den realen Tools und der realen Umgebung des Nutzers arbeiten.

Eine separate Desktop-VM mit Host/Guest-Bridging hätte das Produkt komplizierter und weniger direkt gemacht. Dazu kommt ein Produktproblem: Windows Sandbox ist nicht auf allen Windows-Editionen verfügbar.

### Mandatory Integrity Control war semantisch zu breit

Die Idee war elegant: Codex auf niedriger Integrity laufen lassen und nur die gewünschten Writable Roots passend labeln. OpenAI verwarf das, weil damit nicht nur Codex, sondern Low-Integrity-Prozesse allgemein auf diese Bereiche schreiben dürften.

Das würde den echten Workspace des Entwicklers semantisch in einen Low-Integrity-Sink verwandeln. Für einen produktiven Checkout ist das eine sehr weite und schwer kontrollierbare Änderung.

## Der erste Prototype: die "unelevated sandbox"

Der erste funktionierende Ansatz sollte ohne Admin-Prompt auskommen. OpenAI wollte zwei Dinge kontrollieren:

1. wohin Codex schreiben darf
2. ob Codex ins Netz darf

### Write-Zugriffe über SIDs und write-restricted tokens

Für File Writes kombinierte OpenAI zwei Windows-Primitiven:

- synthetische SIDs als Sandbox-Identität
- write-restricted process tokens

Die Logik war:

1. Eine synthetische SID `sandbox-write` wird erzeugt.
2. Diese SID bekommt Write-, Execute- und Delete-Rechte auf:
   - das aktuelle Working Directory
   - zusätzliche `writable_roots` aus `config.toml`
3. Gleichzeitig wird dieselbe SID explizit von sensiblen Bereichen innerhalb dieser Roots ausgeschlossen, z. B.:
   - `<cwd>/.git`
   - `<cwd>/.codex`
   - `<cwd>/.agents`
4. Codex startet Kommandos unter einem write-restricted token, dessen restricted SID list `Everyone`, die aktuelle Logon-Session und die synthetische `sandbox-write` SID enthält.

Der wichtige Mechanismus dabei: Ein Write gelingt nur, wenn sowohl der normale User-Kontext als auch mindestens eine passende restricted SID Zugriff haben. Dadurch lassen sich Writes mit hoher Granularität über ACLs steuern.

### Das Problem war am Ende nicht das Filesystem, sondern das Netzwerk

Laut OpenAI war die unelevated Variante für File Writes vielversprechend. Das eigentliche Problem blieb die Network Suppression.

Der erste Netzwerkansatz war nur advisory. Er konnte von Programmen umgangen werden, die Proxy-Umgebungsvariablen ignorieren oder ihren eigenen Socket-Stack verwenden. Damit war die Netzsperre zu schwach, sowohl gegen feindlichen als auch gegen gutwilligen, aber nicht kooperativen Code.

> Genau an diesem Punkt kippt der Artikel von "cleverer Prototype" zu "wir brauchen eine andere Architektur".

## Warum Windows Firewall die Architektur veränderte

OpenAI wollte für Network Access auf Windows Firewall setzen. Das Problem: Firewall-Regeln ließen sich nicht passend an die Restricted-Token-Identität hängen.

Die Hindernisse waren konkret:

- Firewall-Regeln konnten nicht an die non-principal identity einer restricted SID gebunden werden
- Binary-basierte Regeln hätten nur `codex.exe`, nicht aber Kindprozesse wie `python.exe` oder `git.exe` erfasst
- User-scoped Regeln hätten weiterhin den echten Windows-User getroffen, nicht nur den sandboxed Process Tree

Damit war klar: Wenn man Outbound Traffic sauber pro Sandbox-Prozessbaum steuern will, muss dieser Baum unter einem **anderen Principal** laufen.

## Das Redesign: die "elevated sandbox"

Der aktuelle OpenAI-Ansatz braucht deshalb einmalig Admin-Rechte beim Setup. Der Kernwechsel:

- Der restricted token bleibt
- Aber sein Principal ist nicht mehr der echte Windows-User
- Sondern einer von zwei eigens angelegten lokalen Nutzern

Diese zwei Nutzer sind:

- `CodexSandboxOffline`
- `CodexSandboxOnline`

Der erste wird gezielt von Firewall-Regeln getroffen, der zweite nicht.

Das klingt klein, verändert aber die ganze Runtime-Architektur.

## Was das Setup jetzt alles tun muss

Mit der elevated Architektur kommt ein echter First-Class-Setup-Schritt dazu.

OpenAI nennt dafür diese Aufgaben:

1. synthetische SID anlegen, falls sie noch nicht existiert
2. die beiden Sandbox-User anlegen
3. deren Credentials lokal speichern und mit DPAPI verschlüsseln
4. Firewall-Regeln für `CodexSandboxOffline` anlegen oder validieren

Dazu kommt ein weiteres praktisches Problem: Der Sandbox-User soll möglichst ähnliche Read-Rechte haben wie der echte Nutzer. Das ist auf Windows nicht automatisch gegeben, weil User standardmäßig nicht einfach in die Profilverzeichnisse anderer User lesen dürfen.

Deshalb vergibt OpenAI zusätzliche Read-ACLs auf häufig benötigte Pfade wie:

- `C:\Users\<real-user>`
- `C:\Windows\`
- `C:\Program Files\`
- `C:\Program Files (x86)\`
- `C:\ProgramData\`

Diese ACL-Arbeit ist teuer und läuft deshalb teilweise asynchron, damit der blocking Setup-Schritt für den Nutzer nicht unnötig langsam wird.

## Warum es ein eigenes Setup-Binary gibt

OpenAI kapselte die Setup-Logik in `codex-windows-sandbox-setup.exe`.

Das geschah nicht nur wegen UAC, sondern auch aus Architekturgründen:

- `codex.exe` bleibt selbst unelevated
- Windows-spezifische Setup-Logik bläht die Hauptbinary anderer Plattformen nicht auf
- länger laufende Setup-Arbeit wird vom Lebenszyklus des Hauptprozesses entkoppelt
- unterschiedliche Setup-Pfade landen an einer klaren Stelle

Das ist ein gutes Beispiel für eine Architekturentscheidung, die nicht nur Security, sondern auch Wartbarkeit adressiert.

## Warum zusätzlich noch ein Command Runner nötig wurde

Mit einem separaten Sandbox-User konnte OpenAI nicht mehr einfach vom echten User-Kontext aus einen restricted token bauen und den finalen Child-Prozess damit sauber starten.

Der Grund war eine Privileggrenze rund um `CreateProcessAsUserW(...)`.

Die Lösung wurde `codex-command-runner.exe`, dessen einziger Zweck darin besteht, als Sandbox-User zu laufen, lokal einen restricted token zu erzeugen und damit den echten Child-Prozess zu starten.

Der Flow wurde aufgeteilt:

### Teil 1

`codex.exe` startet per `CreateProcessWithLogonW(...)` den `codex-command-runner.exe` als Sandbox-User.

### Teil 2

Innerhalb des Runners passiert dann der Rest:

- eigenes Token oeffnen
- per `GetTokenInformation(...)` die passende Logon-SID holen
- `CreateRestrictedToken(...)` auf dieser Basis bauen
- mit `CreateProcessAsUserW(...)` den finalen Child starten

Dadurch wird der heikle Teil der Spawn-Kette auf die Sandbox-Seite der User-Grenze verschoben.

## Die finale Architektur in vier Schichten

Am Ende besteht das System laut OpenAI aus vier Ebenen:

1. `codex.exe`
2. `codex-windows-sandbox-setup.exe`
3. `codex-command-runner.exe`
4. dem eigentlichen Child-Prozess

Das System ist damit deutlich komplexer als die Sandboxes auf macOS oder Linux. OpenAI argumentiert aber, dass jede zusätzliche Komponente aus einem konkreten Zwang entstanden ist und nicht aus Architektur-Spielerei.

## Was man aus dem Artikel mitnehmen sollte

Der wichtigste technische Punkt ist: Windows bot OpenAI kein einzelnes Primitive, das direkt auf "sicherer autonomer Coding Agent" passte. Die Sandbox musste aus mehreren Mechanismen zusammengesetzt werden:

- ACLs
- restricted tokens
- synthetische SIDs
- eigene lokale User
- Firewall-Regeln
- DPAPI
- separate Hilfsbinaries

Der wichtigste Produktpunkt ist: Eine starke Sandbox bringt nichts, wenn sie echte Entwicklerarbeit unbrauchbar macht. Genau diese Spannung zwischen **harte Durchsetzung** und **realistischem Agent-Workflow** treibt fast jede Entscheidung im Artikel.

> Die Sandbox ist hier nicht nur ein Security-Feature, sondern Teil des eigentlichen Agent Runtime Design.

## Verbindungen
- [[Codex]]
- [[Sandbox]]
- [[Windows Security]]
- [[ACLs]]
- [[Restricted Tokens]]
- [[Windows Firewall]]
- [[Agent Runtime]]
- [[OS Isolation]]
- [[Developer Tooling]]
- [[Security Tradeoffs]]
