---
title: 'Prompting Debugging: Systematische Fehlerbehebung'
description: >-
  Strategien und Best Practices zum Debuggen von Prompts und zur Behebung
  komplexer Probleme in Lovable.
category: fundamentals
icon: Bug
readTime: 6 Min
tags: ["lovable", "prompt-engineering", "testing", "docs"]
sourceURL: "https://docs.lovable.dev/prompting/prompting-debugging"
sourceType: "docs"
author: "Lovable Docs"
level: intermediate
---

Die Entwicklung mit KI ist schnell und effizient, aber Fehler oder unerwartetes Verhalten sind Teil des Prozesses. Dieser Leitfaden hilft Ihnen, systematische Debugging-Workflows in Lovable zu etablieren.

## 1. Erweiterte Debugging-Prompts

Manchmal benötigen Sie einen "Heavy-Duty"-Prompt, um ein Problem tiefgreifend zu untersuchen. Nutzen Sie den **Plan-Modus**, um eine Analyse ohne sofortige Codeänderungen zu erhalten.

### Codebase Audit (Vollständige Systemüberprüfung)
Wenn Ihr Projekt wächst, hilft ein Audit-Prompt, strukturelle Probleme oder falsch platzierten Code zu identifizieren.

**Beispiel-Prompt:**
```
Perform a comprehensive **audit of the entire codebase** to check if the architecture is clean, modular, and optimized:
- Identify any files, components, or logic that are in the wrong place or could be better organized.
- Evaluate if we have a clear separation of concerns (e.g., data handling vs UI vs state management).
- Highlight any areas of the code that are overly complex or not following best practices.
- Provide a report with specific recommendations, **without making any code changes yet**.
```

### Fragile Updates (Sicherer Ansatz)
Für kritische Bereiche (Authentifizierung, Payment), weisen Sie die KI explizit auf Vorsicht hin.

**Beispiel-Prompt:**
```
The next change is in a **critical part of the app**, so proceed with **utmost caution**.
- Carefully examine all related code and dependencies *before* making changes.
- **Avoid any modifications** to unrelated components or files.
- If there's any uncertainty, pause and explain your thought process before continuing.
**Task:** Update the user authentication logic...
```

### Performance-Audit
Wenn die App "sluggish" wirkt, lassen Sie die KI Engpässe analysieren.

**Beispiel-Prompt:**
```
Our app is functional but seems **sluggish**. Please **analyze the project for performance bottlenecks**:
- Check for unnecessary database or network calls (N+1 query patterns).
- Identify components that might be re-rendering too often.
- Look at assets (images, scripts) for optimization potential.
- Suggest improvements (caching, React memo, lazy loading).
```

## 2. Strategien bei hartnäckigen Fehlern

Wenn ein Fehler trotz "Try to Fix" bestehen bleibt:

- **Verlauf hinterfragen**: `What solutions have we tried so far for this error?` (Vermeidet Wiederholungen).
- **Erklärung anfordern**: `Explain in simple terms why this error occurs.` (Deckt Missverständnisse auf).
- **Alternativen suchen**: `Given this error keeps happening, can we try a different approach?`.
- **Isolation**: Erstellen Sie eine minimale Version der Komponente, um zu sehen, ob sie isoliert funktioniert.

## 3. Beispiel-Debugging-Flows

### Szenario: "Stuck in error loop"
1. Wechsel in den **Plan-Modus**.
2. Fragen: `What is the root cause of this build error?`.
3. Details prüfen: `Show me the relevant code and the expected types.`.
4. Präzise Korrektur prompten: `Adjust the code to pass just the numeric ID, not the object.`.

### Szenario: "Feature not working right" (Keine Fehlermeldung)
1. Chat nutzen: `The email notification isn't working – I expected an email but got nothing. How can we debug this?`.
2. Logs prüfen (z.B. Supabase): Kopieren Sie Fehlermeldungen aus den Logs direkt in den Chat.
3. Ursache beheben: Oft sind fehlende API-Keys oder Berechtigungen die Ursache.

### Szenario: "UI element disappeared"
1. Prompt: `The project list section is no longer showing up. It was working before the last edit.`.
2. Die KI prüft `return`-Statements, Daten-Fetching oder ob die Komponente noch im JSX gemountet ist.

## 4. Prinzipien der Fehlerbehebung

### Root Cause vs. Symptom
Fragen Sie immer nach dem "Warum":
> "I see you fixed the null pointer error by adding a check, but **why was it null in the first place?** Can we address that cause?"

### Rollback & Inkrementelle Schritte
- Nutzen Sie die **Versionshistorie** von Lovable, wenn der Code zu "verstrickt" ist.
- Bauen Sie komplexe Features in kleinen, testbaren Schritten (**Progressive Enhancement**).
- Fügen Sie `console.log` oder Test-Cases hinzu, um Datenflüsse zu verifizieren.

## 5. Community Debugging Handbuch (Best Practices)

- **Chirurgischer Ansatz**: Ändern Sie nur das Notwendige. Bewahren Sie bestehende Muster und Variablennamen.
- **Datenbank-Check**: Untersuchen Sie das Schema gründlich, bevor Sie neue Tabellen vorschlagen.
- **Tote Code-Eliminierung**: Identifizieren und entfernen Sie ungenutzten Code aktiv.
- **UI-Konsistenz**: Halten Sie sich strikt an das etablierte Designsystem und die Farbpalette.
- **Type Safety**: Analysieren Sie Typdefinitionen gründlich und halten Sie eine strenge Typüberprüfung ein.

---
**Tipp:** Nutzen Sie Dev-Tools! Kopieren Sie Konsolenfehler direkt in Lovable:
`My app screen is blank. Here's the console error: [Error Text]. Can you fix this?`
