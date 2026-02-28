---
title: "The Complete Guide: Prompting Lovable for Design"
description: "Wie man Lovable wie ein Designer promptet: Der Guide zu Design-Systemen, Komponenten und effektiven Prompts von Damien Ghader."
type: source
status: seed
category: fundamentals
icon: Rocket
readTime: 7
tags:
  - tooling/lovable
  - patterns/ui-design
  - patterns/prompting
  - workflows/general
aliases:
  - "The Complete Guide: Prompting Lovable for Design"
topics:
  - "[[Lovable]]"
  - "[[UI Design]]"
  - "[[Prompt Engineering]]"
up: "[[Lovable]]"
sourceURL: https://x.com/damienghader/status/2012547182130336033
sourceType: tweet
author: Damien Ghader
sourceDate: "2026-01-17"
addedDate: "2026-02-01"
level: intermediate
hot: true
---

![The Complete Guide: Prompting Lovable for Design](/images/knowledge/prompting-lovable-design/header.jpg)

Der beste und effizienteste Weg, benutzerdefinierte UI in Lovable zu gestalten, ist die Erstellung von Design-Systemen. Echte Design-Systeme sind **Component-First**, nicht Page-First, und genau so funktioniert auch Lovable.

Bei Creme Digital bauen wir vollständige Systeme für jedes unserer Projekte, um Skalierbarkeit und Konsistenz über alle UIs hinweg zu gewährleisten.

Hier ist, wie du Lovable wie ein echter Designer promptest.

## 1. Was ist ein Design-System?

Ein Design-System ist **kein** UI-Kit. Es ist **keine** Figma-Datei. Und es ist definitiv keine Sammlung zufälliger Komponenten.

Ein Design-System ist ein **Satz von Regeln**, die bestimmen, wie dein Produkt gebaut wird.

Es definiert:
*   Wie Komponenten aussehen
*   Wie sie sich verhalten
*   Wie sie skalieren
*   Wie sie über die Zeit konsistent bleiben

Einfach gesagt: **Ein Design-System verwandelt Design-Entscheidungen in wiederverwendbare Logik.**

### Die 3 Ebenen eines echten Design-Systems

Die meisten Leute denken nur an die oberste Ebene. Lovable funktioniert am besten, wenn alle drei klar sind.

#### A. Foundations (Die Regeln)

Das sind deine unverhandelbaren Grundlagen.

Beispiele:
*   Color Tokens (Primary, Neutral, Semantische Zustände)
*   Spacing Scale (4, 8, 12, 16…)
*   Border Radius Regeln
*   Schriftgrößen und -stärken
*   Schattentiefe

**Beispielregel:**
> "Primary actions use bg-neutral-900, rounded-full, text-sm font-medium."

In Lovable sollten diese Regeln **überall** auftauchen, nicht nur einmal.

#### B. Komponenten (Die Bausteine)

Komponenten sind der **Ausdruck der Regeln**.

Beispiele:
*   Buttons
*   Cards
*   Inputs
*   Modals
*   Tables
*   Filters

Ein Button ist nicht einfach nur "ein Button". Er besteht aus:
*   Padding-Logik
*   Hover- und Active-Verhalten
*   Disabled States
*   Icon Spacing
*   Text-Hierarchie

In Lovable werden Komponenten zum Gedächtnis: Einmal definiert, können sie wiederverwendet, referenziert und weiterentwickelt werden.

#### C. Komposition (Wie Dinge zusammenkommen)

Hier scheitern die meisten Apps. Komposition definiert:

*   Wie Komponenten gestapelt werden
*   Wie dicht sich eine Seite anfühlt
*   Wie Informationen fließen
*   Was zuerst Aufmerksamkeit bekommt

Beispiele:
*   Dashboard-Layouts
*   Formular-Gruppierungen
*   Abstände zwischen Sektionen
*   Empty States

Deshalb scheitert das Prompten von ganzen Seiten zu früh: Komposition funktioniert erst, wenn die Komponenten stabil sind.

## 2. Warum Design-Systeme bei KI wichtiger sind

**Ohne Design-System:**
*   AI erfindet Styles
*   Komponenten driften auseinander
*   UI wird schnell inkonsistent

**Mit Design-System:**
*   AI verstärkt Muster
*   Wiederverwendet Logik
*   Verbessert Konsistenz über die Zeit

Lovable generiert nicht nur UI, es **lernt Muster**. Wenn du klare Regeln und Komponenten fütterst, wird jeder Output besser.

## 3. Komponenten prompten

Seiten sind nur Ansammlungen von Komponenten. Wenn du Seiten promptest, muss Lovable folgendes erfinden:
*   Layout
*   Hierarchie
*   Spacing
*   Wiederverwendbarkeit

Stattdessen: Definiere die Bausteine. Starte mit Buttons, Cards, Inputs, Modals, Badges.

**Schlechtes Prompt-Beispiel:**
> "Design a modern dashboard page."

**Gute Prompt-Beispiele:**
> "Create a primary button component with hover, active, and disabled states."

> "Create a stat card component with a title, value, and sub-label."

**Tipp:** Hänge Screenshots von einzelnen Komponenten an, nicht von ganzen Screens.

![Finance Dashboard Wallet Component](/images/knowledge/prompting-lovable-design/finance-wallet.jpg)

## 4. Prompting in Tailwind-Terminologie

"Sauber", "modern" und "minimal" sind vage Begriffe. Lovable reagiert am besten auf **Layout-Logik**. Nutze Tailwind-Style Sprache, auch wenn du keinen Code schreibst.

**Beispiele:**
> "Create a flex-row container with gap-4 justify-between items-center."

> "Use rounded-xl, border-neutral-200, bg-white, and subtle shadow-sm."

**Button Beispiel:**
> "Create a pill-style button with flex justify-center gap-2 rounded-full bg-neutral-800 text-white text-sm font-medium."

**Card Beispiel:**
> "Create a card with p-6 rounded-2xl bg-neutral-900 border border-neutral-800."

Je expliziter die Struktur, desto besser der Output.

## 5. Existierende Komponenten namentlich wiederverwenden

Lovable hat ein Gedächtnis. Sobald eine Komponente existiert, referenziere sie direkt.

**Beispiele:**
> "Create a revenue chart using the same layout as TotalAmountCard.tsx."

> "Use the same header structure as StatsHeader.tsx but with smaller text."

Das bewirkt drei Dinge:
1.  Bewahrt Spacing-Regeln
2.  Bewahrt Proportionen
3.  Bewahrt visuellen Rhythmus

So erhältst du **System-Level Konsistenz**, keine Einzeldesigns.

![Graph Components](/images/knowledge/prompting-lovable-design/graph-components.jpg)

## 6. Styling-Logik kopieren statt neu designen

Deine App enthält bereits gute Entscheidungen. Nutze sie wieder. Finde eine Komponente, die dir gefällt, und sag Lovable, es soll sie spiegeln.

**Beispiele:**
> "Update this filter component to match the filters on /dashboard — same padding, border radius, and font weight."

> "Make this table header match the typography used in the analytics page."

Du sagst nicht **was** designt werden soll – du sagst **woher kopiert** werden soll. Das reduziert Fehler drastisch.

![Custom Toggles and Buttons](/images/knowledge/prompting-lovable-design/custom-toggles.jpg)

## 7. Globale Komponenten vor einzigartigen Seiten

Lovable lernt durch Wiederholung, was universell ist. Wenn deine globalen Elemente unordentlich sind, leidet alles nachfolgende.

Repariere geteilte Elemente zuerst: Navbar, Sidebar, Modals, Buttons, Inputs.

**Beispiel:**
> "Update all navbar paddings to match /dashboard."

Sobald Globals sauber sind, sieht jede neue Seite besser aus und jede Komponente richtet sich automatisch aus. Das ist der Hebel.

## 8. Nutze Vorher/Nachher Screenshots

Das verbessert Ergebnisse **und** Inhaltsqualität.

Zeige:
1.  Alte Komponente
2.  Neue Komponente

Dann benenne die Unterschiede:
*   "Padding increased from p-4 → p-6"
*   "Border radius from rounded-lg → rounded-2xl"
*   "Font weight from font-normal → font-medium"

**Beispiel Prompt:**
> "Update this filter to match the after version — increased padding, rounded-2xl, lighter border, tighter spacing."

Lovable versteht Deltas (Unterschiede) extrem gut.

---

**Fazit:**
Lovable ist das perfekte Werkzeug, um als **Design-System-Engine** zu fungieren. Wenn du kleine Komponenten, klare Strukturen, explizite Layout-Regeln und existierende Referenzen promptest, erhältst du sauberere UI, schnellere Iteration und echte Design-Konsistenz.

## Verbindungen
- [[Lovable]]
- [[UI Design]]
- [[Prompt Engineering]]
- [[Rapid Prototyping]]
- [[Design Systems]]
- [[Workflow Design]]
- [[Product Discovery]]
