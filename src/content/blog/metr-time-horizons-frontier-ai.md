---
title: "METR Time Horizons: Wie weit Frontier-Modelle wirklich autonom arbeiten"
description: "METR zeigt mit Time Horizons, wie lange Aufgaben Frontier-Modelle mit 50 % oder 80 % Zuverlässigkeit lösen. Der Trend ist stark exponentiell, aber die Aussagekraft hängt von Domäne, Kontext und Messmethodik ab."
category: fundamentals
icon: BrainCircuit
readTime: 10 Min
tags: ["metr", "ai-evaluation", "time-horizons", "frontier-models", "autonomy-risk"]
keyPoints:
  - "Time Horizon misst nicht Laufzeit der KI, sondern Aufgabenschwierigkeit über menschliche Bearbeitungsdauer und modellierte Erfolgswahrscheinlichkeit."
  - "Die von METR berichteten 50 %- und 80 %-Horizonte wachsen über Modellgenerationen weiterhin exponentiell."
  - "Die Werte sind wichtig, aber eng begrenzt: Fokus auf Software/ML/Cybersecurity, wenig Kontext, keine direkte Aussage über Vollautomatisierung von Jobs."
sourceURL: "https://metr.org/time-horizons/"
sourceType: docs
author: "METR"
sourceDate: "2026-02-20"
addedDate: "2026-02-25"
---

![Header](/images/blog/metr-time-horizons-frontier-ai/header.png)

METR veröffentlicht mit der Seite zu den **Task-Completion Time Horizons** eine der aktuell klarsten Metriken für agentische Leistungsfähigkeit von Frontier-Modellen. Statt nur Benchmarkscores zu vergleichen, fragt der Ansatz: **Für wie lange Aufgaben ist ein Modell mit einer bestimmten Zuverlässigkeit brauchbar?**

Die Seite wurde zuletzt am **20. Februar 2026** aktualisiert und enthält die laufend ergänzten Messwerte (aktuell „Time Horizon 1.1“) sowie eine ausführliche FAQ zur korrekten Interpretation.

## Was „Time Horizon“ konkret bedeutet

Die zentrale Definition ist einfach, aber wichtig: Eine Time Horizon ist die Aufgabendauer (gemessen als menschliche Expertenzeit), bei der ein Agent mit einer Zielwahrscheinlichkeit erfolgreich ist.

- **50 %-Horizon**: Dauer, bei der der Agent im Mittel in etwa der Hälfte der Fälle erfolgreich ist
- **80 %-Horizon**: Dauer, bei der der Agent in etwa 80 % der Fälle erfolgreich ist

> Time Horizon ist primär ein Maß für Aufgabenschwierigkeit, nicht für die reale Wandzeit, die das Modell für die Bearbeitung benötigt.

Das ist ein entscheidender Punkt, weil viele die Kennzahl sofort als „Agent kann X Stunden autonom arbeiten“ lesen. Genau das sagt METR ausdrücklich nicht.

## Methodik in Kurzform: Logistic Fit statt Bauchgefühl

METR nutzt pro Modell einen statistischen Fit über viele Aufgaben und deren Erfolgsraten. Vereinfacht:

1. Für jede Aufgabe wird geschätzt, wie lange ein menschlicher Experte dafür braucht.
2. Für das Modell werden mehrere Läufe pro Aufgabe ausgewertet (Erfolg/Misserfolg).
3. Daraus wird eine **logistische Kurve** fitten, die Erfolgswahrscheinlichkeit als Funktion der Aufgabendauer beschreibt.
4. Die Schnittpunkte der Kurve bei 50 % bzw. 80 % ergeben die Horizon-Werte.

Die Datenbasis umfasst laut Seite über hundert vielfältige Softwareaufgaben, u. a. aus **RE-Bench**, **HCAST** und zusätzlichen kurzen Aufgaben.

## Warum die Metrik stark ist

Im Vergleich zu vielen klassischen Benchmarks hat der Ansatz drei große Stärken:

- **Outcome-nah**: Es geht um abgeschlossene Tasks, nicht nur Einzelfragen.
- **Vergleichbarkeit über Modellgenerationen**: Man kann die Kurven über die Zeit verfolgen.
- **Zuverlässigkeit explizit modelliert**: 50 % und 80 % machen die Risikoebene sichtbar.

METR zeigt außerdem, dass der beobachtete Verlauf bislang deutlich besser zu einem **exponentiellen Trend** passt als zu linearen oder hyperbolischen Alternativen.

## Warum man die Metrik leicht falsch liest

Die FAQ auf der Seite ist deshalb fast so wichtig wie die Charts selbst. Sie grenzt ab, was die Zahlen gerade **nicht** bedeuten.

### 1. Kein direkter Beweis für „voll autonome Arbeitszeit“

Eine 2-Stunden-Horizon heißt nicht, dass ein Modell universell 2 Stunden „wie ein Mensch im Job“ arbeitet. Die Tasks sind bewusst selbstenthalten und stark spezifiziert.

In realen Teams ist Arbeit häufig kontextreich, sozial eingebettet und schwer algorithmisch bewertbar.

### 2. Keine Aussage über alle Domänen

Der Schwerpunkt liegt auf Software Engineering, Machine Learning und Cybersecurity. METR verweist selbst darauf, dass Horizons in anderen Domänen anders ausfallen können.

### 3. Keine Gleichsetzung mit Job-Automatisierung

Selbst eine hohe Horizon ersetzt nicht automatisch ganze Berufe. Viele Tätigkeiten bestehen aus Kommunikation, Ambiguität und nicht sauber scorbaren Zwischenzielen.

> Hohe Time Horizons sind ein Signal für steigende Capability in klaren, testbaren Aufgabenumgebungen, nicht automatisch ein „Alle Jobs sind jetzt automatisierbar“-Signal.

## Praktische Details, die oft übersehen werden

Die Seite gibt auch Einblick in den operativen Aufwand solcher Evaluierungen:

- Modellzugang herstellen und Verhalten verstehen
- Scaffold/Agent-Setup auswählen (z. B. ReAct, Codex-ähnliche Setups)
- Elicitation auf Dev-Tasks
- Skalierung auf Testset mit mehreren unabhängigen Runs je Task
- Prüfung auf Reward Hacking, Token-Budget-Probleme und Re-Scoring

Laut METR dauert der gesamte Prozess typischerweise **mindestens 1–2 Wochen**. Das erklärt, warum nicht jede neue Modellversion sofort einen veröffentlichten Horizon-Wert hat.

## 50 %, 80 % und warum nicht 99 %

Ein häufiger Wunsch ist ein 99 %-Horizon als „produktionsnähere“ Kennzahl. METR argumentiert, dass das deutlich schwerer robust zu messen ist:

- deutlich mehr Tasks nötig
- dafür tendenziell sehr kurze Tasks nötig
- höhere Empfindlichkeit gegenüber methodischen Details und fehlerhaften Tasks

Solange 50 % und 80 % ähnliche Trendformen zeigen, ist es plausibel, dass höhere Zuverlässigkeitsniveaus trendseitig ähnlich verlaufen, aber mit größerer Unsicherheit.

## Was das für Builder, Teams und Entscheider bedeutet

Für den praktischen Einsatz taugt die Metrik weniger als Marketingzahl und mehr als **Planungsinstrument**:

1. **Task-Portfolios in Dauerklassen aufteilen**  
   Welche Aufgaben in deinem Produkt liegen heute im Bereich einer hohen Erfolgswahrscheinlichkeit?

2. **Reliability zuerst definieren**  
   Für interne Tools reichen oft niedrigere Schwellen als für kundenkritische Automationen.

3. **Scaffolding ist Teil der Leistung**  
   Modell + Agent-Loop + Tooling + Guardrails bestimmen das Ergebnis, nicht nur das Basismodell.

4. **Domänenübertragungen vorsichtig behandeln**  
   Gute Werte in Coding-nahen Aufgaben sind kein Freifahrtschein für andere Arbeitsfelder.

5. **Release-Bewertung zeitversetzt einplanen**  
   Wenn du auf Drittmessungen wartest, rechne mit Verzögerung zwischen Modellrelease und belastbarer Horizon-Schätzung.

## Einordnung der aktuellen Updates

Auf der Seite ist dokumentiert, dass regelmäßig neue Modellstände ergänzt werden (zuletzt u. a. neuere Codex- und Claude-Varianten). Für Marktbeobachtung heißt das:

- nicht auf Einzelpunkte fixieren
- eher auf **Steigung und Stabilität des Trends** achten
- gleichzeitig die Grenzen der Messumgebung im Blick behalten

Gerade diese Kombination aus Trendstärke und methodischer Nüchternheit macht den METR-Ansatz wertvoll: Er ist ambitioniert, aber nicht naiv.

## Fazit

Die Time-Horizons-Seite von METR ist aktuell eine der brauchbarsten Brücken zwischen abstrakten Modellfähigkeiten und realen agentischen Einsatzfragen. Sie macht Fortschritt messbar, ohne die Unsicherheit zu verschweigen.

Wenn du Agentensysteme baust, solltest du die Metrik so lesen: **nicht als absolute Automationsgarantie**, sondern als strukturierte Evidenz dafür, welche Aufgabendauern und Zuverlässigkeitsniveaus für Frontier-Modelle heute realistisch sind — und wie schnell sich dieser Korridor verschiebt.
