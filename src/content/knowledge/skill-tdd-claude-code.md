---
title: "TDD mit Claude Code: Mit Tracer Bullets zu besserem Code"
description: "Wie man Claude Code durch gezielte TDD-Skills dazu zwingt, sauberen und testbaren Code in vertikalen Slices zu schreiben."
category: workflows
icon: Code2
readTime: 6 Min
tags: ["tdd", "claude-code", "testing", "ai-workflow"]
sourceURL: "https://www.aihero.dev/skill-test-driven-development-claude-code"
sourceType: "blog"
author: "Matt Pocock"
sourceDate: "2026-02-14"
addedDate: "2026-02-15"
level: advanced
---

![TDD Skill Header](/images/knowledge/skill-tdd-claude-code/header.jpg)

Test-Driven Development (TDD) ist eine der effektivsten Methoden, um sicherzustellen, dass Code genau das tut, was er soll. Matt Pocock hat einen speziellen Skill für Claude Code entwickelt, der das Modell dazu zwingt, nach strengen TDD-Prinzipien zu arbeiten.

## Das Problem: Warum LLMs bei Tests oft scheitern

Wenn man ein LLM bittet, ein "Feature zu schreiben", arbeitet es meist in **horizontalen Schichten** (Horizontal Slicing). Es schreibt erst das gesamte Feature und danach die Tests.

### Die Gefahren von "Horizontal Slicing":
*   **Mocks statt Realität:** Tests verifizieren oft nur Mocks statt echter Codepfade.
*   **Wunschdenken:** Tests testen das imaginäre Verhalten, nicht das tatsächlich beobachtete.
*   **Context-Verlust:** Wenn der Kontext knapp wird, neigen LLMs dazu, Tests so umzuschreiben, dass sie bestehen, anstatt die Implementierung zu korrigieren.

> "Tests, die in großen Mengen geschrieben werden, testen das vorgestellte Verhalten, nicht das beobachtete Verhalten."

## Die Lösung: Red-Green-Refactor in vertikalen Slices

Der TDD-Skill zwingt Claude dazu, in **vertikalen Slices** mittels "Tracer Bullets" zu arbeiten:

**ONE test → ONE implementation → repeat**

Jeder Zyklus reagiert auf das, was im vorherigen Schritt gelernt wurde. Da der Code gerade erst geschrieben wurde, weiß Claude genau, welches Verhalten relevant ist.

### Die drei Phasen
1.  **RED:** Schreibe genau EINEN Test, der fehlschlägt.
2.  **GREEN:** Schreibe den minimal notwendigen Code, damit dieser eine Test besteht. Nichts Spekulatives.
3.  **REFACTOR:** Wenn alle Tests bestehen, räume Duplikate auf und vereinfache den Code.

Diese Einschränkung verhindert "Mogeln". Wenn ein Test zuerst fehlschlägt, kann das LLM das Ergebnis nicht fälschen – es muss eine echte Implementierung schreiben.

## Gute vs. Schlechte Tests

Ein entscheidender Teil des Skills ist die Definition dessen, was einen guten Test ausmacht.

### Gute Tests
Gute Tests prüfen echte Codepfade über **öffentliche Schnittstellen** (Public Interfaces), nicht Implementierungsdetails. Sie beschreiben, **WAS** das System tut, nicht wie.

```typescript
// GUT: Testet beobachtbares Verhalten über das Interface
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

### Schlechte Tests
Schlechte Tests sind eng an die **Implementierung gekoppelt**. Sie mocken interne Komponenten oder verifizieren Ergebnisse über externe Wege (z.B. direkte DB-Abfragen), statt das Interface zu nutzen.

```typescript
// SCHLECHT: Kopplung an Implementierungsdetails
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

| Gute Tests | Schlechte Tests |
| :--- | :--- |
| Nutzen öffentliche Schnittstellen | Mocken interne Komponenten |
| Beschreiben das WAS | Testen das WIE |
| Überstehen Refactorings | Brechen bei Refactorings |
| Lesen sich wie Spezifikationen | Testen Datenstrukturen |

## Die Planungsphase

Bevor überhaupt Code geschrieben wird, stellt der Skill kritische Fragen, um die Codequalität zu erhöhen:
*   **Welche Interface-Änderungen sind nötig?** (APIs, Methoden, Funktionen)
*   **Welche Verhaltensweisen sind am wichtigsten?** (Fokus auf kritische Pfade)
*   **Können wir "Deep Modules" entwerfen?** (Kleine Schnittstelle, komplexe Logik intern)
*   **Ist das Design testbar?** (Abhängigkeiten injizieren statt erzeugen)

## Fazit für Claude Code Nutzer

Es geht nicht um perfekte Tests, sondern um **ehrliche Tests durch erzwungene Constraints**. Durch den TDD-Skill wird verhindert, dass Claude spekulativen Code schreibt oder Tests fälscht. 

Wenn man den Tests vertrauen kann, kann man auch dem Code vertrauen. Dies ermöglicht es, größere Teile der Arbeit – nicht nur Code-Reviews, sondern echte Feature-Entwicklung – sicher an Claude zu delegieren.

---
*Quelle: [AIHero.dev - Skill TDD Claude Code](https://www.aihero.dev/skill-test-driven-development-claude-code)*
