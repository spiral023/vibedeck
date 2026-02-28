---
title: Software-Testing von A bis "läuft wirklich"
description: Ein praxisnaher Überblick über Testebenen, Ziele und typische Fallstricke.
type: source
status: seed
category: fundamentals
icon: Code2
readTime: 4
tags:
  - patterns/testing
  - patterns/best-practices
  - workflows/general
aliases:
  - Software-Testing von A bis "läuft wirklich"
topics:
  - "[[Testing]]"
  - "[[Prompt Engineering]]"
  - "[[Workflow Design]]"
up: "[[Testing]]"
sourceType: blog
addedDate: "2026-02-01"
level: intermediate
---

## Warum Testen?

Software-Testing ist im Kern eine Risiko-Reduktionsmaschine: Du willst früh entdecken, was später teuer wird. Sinnvoll wird's, wenn du Tests als Schichten verstehst - von klein (eine Funktion) bis groß (das echte System im echten Betrieb).

## Testebenen im Überblick

### 1) Unit Testing

Unit Tests prüfen die kleinsten Bausteine: Funktionen, Klassen, Methoden - isoliert, schnell, deterministisch.

- Ziel: Logikfehler früh abfangen, Refactoring angstfrei machen
- Merke: Wenn ein Unit Test langsam ist, ist er vermutlich kein Unit Test mehr
- Gute Unit Tests sind unabhängig von Datenbank, Netzwerk und Dateisystem (Mocks/Stubs)

### 2) Integration Testing

Integrationstests prüfen, ob Komponenten zusammenarbeiten: z. B. Service <-> Datenbank, API <-> Message Queue, Auth <-> Frontend.

- Typische Funde: Konfiguration, Datenformate, Timeouts, Berechtigungen
- Weniger Tests als Unit, aber realistischer (und meist langsamer)
- Wichtig: kontrollierte Testumgebung und reproduzierbare Testdaten

### 3) Smoke Testing

Smoke Tests sind die minimalen "Atmet das System?"-Checks nach Build/Deploy.

- Beispiele: startet der Service, antwortet die API, Login ok, Startseite lädt, Basis-DB-Verbindung ok
- Ziel: schnell feststellen, ob es sich lohnt, tiefer zu testen
- Idealerweise automatisch nach jedem Deployment, blockiert Folge-Tests bei Fehlschlag

### 4) Regression Testing

Regressionstests verhindern den Klassiker: "Fix A hat Bug B wieder kaputt gemacht".

- Keine eigene Testtechnik, sondern eine kuratierte Auswahl bestehender Tests
- Kann aus Unit-, Integration- und UI-Tests bestehen
- Praxis: Suite versionieren, Flaky Tests aussortieren, nach Risiko priorisieren

### 5) System Testing

Systemtests prüfen das Gesamtsystem end-to-end gegen Anforderungen: Workflows, Rollenrechte, Fehlerfälle, Datenhaltung, Reporting.

- Hier testest du "das Produkt" statt einzelner Bauteile
- Nutzerprobleme werden oft erst auf Systemebene sichtbar (z. B. Statusübergänge, Nebenwirkungen)

### 6) User Acceptance Testing (UAT)

UAT ist der Realitätscheck durch Fachbereich/Stakeholder: Erfüllt die Lösung den Zweck im Alltag?

- Fokus: korrekte Ergebnisse und Bedienbarkeit/Prozessfit
- Klare Abnahmekriterien (Definition of Done)
- Echte Use-Cases, möglichst produktionsnahe Daten (datenschutzkonform)

### 7) Performance / Load Testing

Performance- und Lasttests prüfen Antwortzeiten, Durchsatz, Ressourcenverbrauch und Stabilität unter realistischen Bedingungen.

- Load Testing simuliert erwartete Last, Stress Testing sucht die Bruchkante
- Wichtige Metriken: p95/p99-Latenz, Fehlerraten, CPU/RAM, DB-Queries, Queue-Längen
- Ergebnis sollte konkrete Bottlenecks plus Maßnahmen liefern

### 8) Security Testing

Security Testing ist mehr als ein einmaliger Pen-Test.

- Bausteine: Dependency Scans, SAST, DAST, Secrets-Scanning
- Prüfe Rechte/Rollen, Input-Validierung, Auth/Session-Handling
- Ziel: typische Schwachstellen (Injection, XSS, CSRF, Broken Access Control, Misconfiguration) früh finden und Fixes verifizieren

### 9) Post-Go-Live Validation

Nach dem Go-Live ist "grün im CI" nicht genug. Post-Go-Live Validation bedeutet: Produktion verhält sich korrekt.

- Smoke Checks in Prod, Monitoring/Alerting, Log-Review
- Business-KPIs (z. B. Bestellrate), Datenintegrität, Backups/Restore-Tests
- Ein kurzer, definierter Validierungsplan für die ersten Stunden/Tage
- Rollback-/Hotfix-Pfad, der wirklich funktioniert

## Praktischer Startpunkt

Wenn du klein starten musst, priorisiere in dieser Reihenfolge:

1. Unit Tests für kritische Logik
2. Integrationstests für Datenflüsse
3. Smoke Tests nach Deployments
4. Eine schlanke Regression-Suite

## Merksatz

Unit Tests sparen Zeit, Integrationstests sparen Nerven, System/UAT sparen Ruf, Performance/Security sparen Katastrophen - und Post-Go-Live Validation verhindert, dass "Deploy" mit "Fertig" verwechselt wird.

## Verbindungen
- [[Testing]]
- [[Prompt Engineering]]
- [[Workflow Design]]
- [[TDD]]
- [[Regression Testing]]
- [[Integration Testing]]
- [[Debugging]]
- [[Quality Gates]]
