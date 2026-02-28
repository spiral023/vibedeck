---
title: Test-Driven Development (TDD) für Agentic Coding
description: Wie TDD Struktur in den Flow bringt und Agentic Coding die Umsetzung komplexer Logik beschleunigt.
type: source
status: seed
category: patterns
icon: CheckSquare
readTime: 9
tags:
  - patterns/tdd
  - patterns/testing
  - workflows/agentic-coding
  - patterns/general
aliases:
  - Test-Driven Development (TDD) für Agentic Coding
topics:
  - "[[Testing]]"
  - "[[TDD]]"
  - "[[Agentic Coding]]"
up: "[[Testing]]"
sourceURL: https://tweag.github.io/agentic-coding-handbook/WORKFLOW_TDD/
sourceType: docs
author: Tweag
addedDate: "2026-02-04"
level: intermediate
---

Test-Driven Development (TDD) und Agentic Coding mögen wie Gegensätze erscheinen — das eine ist strukturiert und diszipliniert, das andere fluid und intuitiv. Aber kombiniert erzeugen sie eine mächtige Feedback-Schleife: TDD gibt deinem Flow Struktur, und Agentic Coding verleiht deiner Struktur Geschwindigkeit.

Diese Kombination glänzt besonders bei komplexen Logikdateien, wie z. B. Pricing-Engines, regelbasierten Validatoren oder Workflows mit vielen Bedingungen. Anstatt die KI anzuweisen, alles auf einmal zu generieren, beschreibst du jedes Verhalten einzeln durch Tests — und lässt die KI die Logik inkrementell, sicher und sauber aufbauen.

## Warum TDD Agentic Coding besser macht

*   **Tests fungieren als Prompts:** In einem KI-gestützten Workflow wird ein Test zu einer Spezifikation in natürlicher Sprache, die die KI exakt zu dem von dir erwarteten Verhalten führt. Anstatt zu sagen „generiere eine Funktion, die gültige E-Mails filtert“, schreibst du `it('should return only valid emails from a mixed list')` und die KI schreibt den Code, um diesen Test zu bestehen.
*   **Reduzierung von Halluzinationen:** Je präziser der Prompt (in diesem Fall der Test), desto genauer die Generierung. TDD hält das LLM fokussiert auf kleine, testbare Ziele statt auf aufgeblähte Implementierungen.
*   **Aufbau von Vertrauen:** Wenn jeder Schritt der Codegenerierung durch einen Test validiert wird, weißt du, dass er funktioniert. Das ist entscheidend, wenn du KI als Pair-Partner nutzt.
*   **Im Flow bleiben:** Tests bieten Checkpoints. Anstatt anzuhalten, um eine vage Ausgabe zu debuggen, schreibst du einfach den nächsten Test und lässt die KI aufschließen.
*   **Förderung von sauberen, verhlatensorientierten Denken:** TDD zwingt dich dazu, zu beschreiben, *was* der Code tun soll, nicht *wie* er geschrieben werden soll. Genau so sollten wir LLMs prompten.

## TDD-Tipps für Agentic Coders

1.  Beginne mit dem **wichtigsten Verhalten** (High-Value Behavior), nicht mit Grenzfällen (Edge Cases).
2.  Nutze **beschreibende Testnamen** — je klarer der Test, desto besser das KI-Ergebnis.
3.  Halte den **Scope der Tests eng**: Ein Verhalten pro Prompt.
4.  Lass die KI **refactoren** — bitte sie, „die Logik aufzuräumen, während alle Tests grün bleiben“.
5.  Nutze **Pre-Commit-Hooks**, um Tests auszuführen und zu verhindern, dass fehlerhafter Code gemergt wird.

## Beispiel: TDD-Plan generieren

### Prompt: Generate TDD Plan from Business Logic

> I’m implementing a new feature based on the following business rules from a Jira ticket.
> Please help me break it down into a clear **Test-Driven Development flow**, where each step represents a test to be written and the logic to be implemented to pass it.
> Output the result as a **markdown checklist** (`tdd-plan.md`) using `[ ]` for each step.
> The structure should guide me to:
>
> * Write one test at a time
> * Implement just enough code to pass it
> * Add more rules incrementally
> * Include edge cases and input validation
> * Refactor at the end if needed
>
> Here are the business rules:
>
> ```markdown
> Feature: calculate_invoice_total(items, customer_location)
>
> Business rules:
>
> 1. Each item has:
>    - price (number)
>    - quantity (integer)
>    - taxable (boolean)
>
> 2. Tax rules:
>    - For customers in NY: apply 8.875% tax on taxable items
>    - For customers in CA: apply 7.25% tax on taxable items
>    - For all other locations: apply 5% tax on taxable items
>    - Non-taxable items do not receive any tax
>
> 3. Discounts:
>    - If subtotal (before tax) is greater than $1,000, apply a 5% discount on the subtotal
>    - If the total quantity of all items is 10 or more, subtract a $15 shipping discount from the total
>
> 4. Final total = subtotal - discounts + tax
>
> 5. Edge cases:
>    - If item list is empty, return total = 0
>    - If location is missing or unknown, default to 5% tax
>    - Negative prices or quantities are invalid and should raise an error
> ```
>
> Format the result like this:
>
> ```markdown
> # TDD Plan: [Feature Name]
>
> [ ] Write test for [simple behavior]
> [ ] Implement logic to pass test
> [ ] Write test for [next rule]
> [ ] Update implementation to pass
> [ ] Add test for edge case [X]
> [ ] Refactor logic for clarity
> ```

### Output: TDD Plan für "Calculate Invoice Total"

# TDD Plan: Calculate Invoice Total

## Setup

- [ ] Create the basic function structure `calculate_invoice_total(items, customer_location)`
- [ ] Set up testing framework

## Basic Functionality

- [ ] Write test for empty items list returning 0
- [ ] Implement logic to return 0 for empty items list
- [ ] Write test for calculating subtotal with a single non-taxable item
- [ ] Implement logic to calculate basic subtotal (price * quantity)
- [ ] Write test for calculating subtotal with multiple non-taxable items
- [ ] Update implementation to handle multiple items

## Tax Rules

- [ ] Write test for default tax rate (5%) with a taxable item
- [ ] Implement logic to apply default tax rate
- [ ] Write test for NY tax rate (8.875%) with taxable item
- [ ] Update implementation to handle NY tax rate
- [ ] Write test for CA tax rate (7.25%) with taxable item
- [ ] Update implementation to handle CA tax rate
- [ ] Write test for mixing taxable and non-taxable items
- [ ] Update implementation to only apply tax to taxable items

## Discount Rules

- [ ] Write test for 5% discount on subtotal > $1,000
- [ ] Implement logic for subtotal discount
- [ ] Write test for $15 shipping discount when total quantity ≥ 10
- [ ] Implement logic for shipping discount
- [ ] Write test for both discounts applying simultaneously
- [ ] Update implementation to handle both discount types

## Edge Cases and Validation

- [ ] Write test for missing location defaulting to 5% tax rate
- [ ] Update implementation to handle missing location
- [ ] Write test for unknown location defaulting to 5% tax rate
- [ ] Update implementation to handle unknown locations
- [ ] Write test for negative price validation
- [ ] Implement error handling for negative prices
- [ ] Write test for negative quantity validation
- [ ] Implement error handling for negative quantities

## Final Calculations

- [ ] Write test for final total calculation (subtotal - discounts + tax)
- [ ] Verify implementation correctly calculates final total
- [ ] Write test for complex scenario with all rules applied
- [ ] Ensure implementation handles all business rules correctly

## Refactoring (if needed)

- [ ] Refactor tax calculation into separate method for clarity
- [ ] Refactor discount calculation into separate method
- [ ] Ensure all tests still pass after refactoring

## Verbindungen
- [[Testing]]
- [[TDD]]
- [[Agentic Coding]]
- [[Regression Testing]]
- [[Integration Testing]]
- [[Debugging]]
- [[Quality Gates]]
- [[Test Strategy]]
