'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Alle' },
  { id: 'fundamentals', label: 'Grundlagen' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'security', label: 'Sicherheit' },
  { id: 'performance', label: 'Performance' },
];

const articles = [
  {
    id: 'prompt-engineering-basics',
    title: 'Prompt Engineering Grundlagen',
    description: 'Lerne die Basis-Techniken für effektive AI-Prompts.',
    category: 'fundamentals',
    icon: BookOpen,
    readTime: '8 Min',
    content: `
## Was ist Prompt Engineering?

Prompt Engineering ist die Kunst, Anweisungen so zu formulieren, dass AI-Modelle optimale Ergebnisse liefern.

### Grundprinzipien

1. **Sei spezifisch**: Je genauer deine Anweisungen, desto besser das Ergebnis
2. **Gib Kontext**: Erkläre den Hintergrund und Zweck
3. **Definiere das Format**: Beschreibe das gewünschte Output-Format
4. **Iteriere**: Verfeinere Prompts basierend auf Ergebnissen

### Beispiel

\`\`\`
❌ Schlecht: "Schreib Code für eine Todo-App"

✅ Gut: "Erstelle eine React-Komponente für eine Todo-Liste mit:
- TypeScript für Typsicherheit
- useState für lokalen State
- Möglichkeit, Todos hinzuzufügen und zu löschen
- Tailwind CSS für Styling"
\`\`\`
    `,
  },
  {
    id: 'react-patterns',
    title: 'React Patterns für AI-Projekte',
    description: 'Bewährte Architektur-Patterns für React-Anwendungen.',
    category: 'patterns',
    icon: Layers,
    readTime: '12 Min',
    content: `
## Bewährte React Patterns

### 1. Compound Components

Ermöglicht flexible, wiederverwendbare Komponenten-APIs.

### 2. Render Props

Teile Logik zwischen Komponenten über eine Render-Funktion.

### 3. Custom Hooks

Extrahiere wiederverwendbare Logik in eigene Hooks.

### 4. Container/Presenter Pattern

Trenne Logik (Container) von Darstellung (Presenter).

### Empfehlung für AI-Projekte

- Nutze kleine, fokussierte Komponenten
- Halte State so lokal wie möglich
- Verwende TypeScript für bessere AI-Vorschläge
    `,
  },
  {
    id: 'api-security',
    title: 'API-Sicherheit Best Practices',
    description: 'Sichere deine APIs vor häufigen Angriffsvektoren.',
    category: 'security',
    icon: Lock,
    readTime: '10 Min',
    content: `
## API Sicherheit

### Authentifizierung

- Verwende JWT oder Session-basierte Auth
- Implementiere Token-Refresh-Mechanismen
- Speichere Secrets niemals im Frontend

### Input Validierung

- Validiere alle Eingaben serverseitig
- Nutze Zod oder ähnliche Bibliotheken
- Sanitize User-Input gegen XSS

### Rate Limiting

- Implementiere Request-Limits pro User/IP
- Nutze exponential backoff bei Fehlern
- Logge verdächtige Aktivitäten

### CORS

- Konfiguriere strenge CORS-Policies
- Erlaube nur notwendige Origins
- Vermeide Wildcards in Produktion
    `,
  },
  {
    id: 'typescript-best-practices',
    title: 'TypeScript für AI-Entwicklung',
    description: 'Nutze TypeScript optimal für bessere AI-Vorschläge.',
    category: 'fundamentals',
    icon: FileCode,
    readTime: '6 Min',
    content: `
## TypeScript Best Practices

### Warum TypeScript?

AI-Tools wie Cursor, Copilot und Lovable arbeiten besser mit TypeScript:

- Bessere Typ-Inferenz für Vorschläge
- Weniger Fehler durch strikte Typisierung
- Dokumentation durch Typen

### Empfehlungen

\`\`\`typescript
// Definiere klare Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Nutze Zod für Runtime-Validierung
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});
    \`\`\`
    `,
  },
  {
    id: 'software-testing-guide',
    title: 'Software-Testing von A bis "läuft wirklich"',
    description: 'Ein praxisnaher Überblick über Testebenen, Ziele und typische Fallstricke.',
    category: 'fundamentals',
    icon: Code2,
    readTime: '14 Min',
    content: `
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
    `,
  },
  {
    id: 'database-patterns',
    title: 'Datenbank-Patterns',
    description: 'Effiziente Datenmodellierung und Abfragen.',
    category: 'patterns',
    icon: Database,
    readTime: '15 Min',
    content: `
## Datenbank Best Practices

### Schema Design

- Normalisiere wo sinnvoll
- Denormalisiere für Leseleistung
- Nutze konsistente Namenskonventionen

### Queries optimieren

- Erstelle Indizes für häufige Abfragen
- Vermeide N+1 Query-Probleme
- Nutze Pagination für große Datensätze

### Supabase-spezifisch

- Nutze Row Level Security (RLS)
- Verwende Realtime für Live-Updates
- Implementiere Edge Functions für komplexe Logik
    `,
  },
  {
    id: 'performance-optimization',
    title: 'Performance-Optimierung',
    description: 'Mache deine App schneller mit bewährten Techniken.',
    category: 'performance',
    icon: Zap,
    readTime: '14 Min',
    content: `
## Performance Best Practices

### React Performance

- Nutze React.memo für teure Komponenten
- Verwende useMemo/useCallback gezielt
- Implementiere Code-Splitting mit lazy()

### Bundle Size

- Analysiere mit Bundle-Analyzern
- Tree-shake nicht genutzte Exports
- Lazy-load große Dependencies

### Netzwerk

- Implementiere Caching-Strategien
- Nutze CDNs für statische Assets
- Komprimiere Bilder automatisch

### Messen

- Nutze Lighthouse für Audits
- Implementiere Real User Monitoring
- Setze Performance-Budgets
    `,
  },
  {
    id: 'vibe-coding-rules',
    title: '10 Regeln für effektives „Vibe Coding“',
    description: 'Strategien von Startups und FAANG-Unternehmen für KI-gestützte Entwicklung.',
    category: 'fundamentals',
    icon: Rocket,
    readTime: '10 Min',
    content: `
10 Regeln für effektives „Vibe Coding“, basierend auf den Strategien von Startups und FAANG-Unternehmen:

### 1. Starte mit einem klaren Plan (PRD)
Bevor du die erste Zeile Code generierst, erstelle ein kurzes **Product Requirements Document (PRD)** oder ein Technical Design Document (TDDoc). Kläre darin präzise, was du bauen willst, welche Funktionen nötig sind und wer die Zielgruppe ist. Ein guter Plan hilft der KI, den Kontext zu verstehen und verhindert, dass sie Funktionen erfindet, die du gar nicht brauchst.

### 2. Wähle einen Mainstream-Tech-Stack
Nutze bewährte und populäre Frameworks wie **Next.js oder Supabase**, da die KI für diese Stacks die meisten Trainingsdaten besitzt und Muster korrekter trifft. Experimentelle oder sehr neue Sprachen führen oft dazu, dass die KI halluziniert, da weniger Beispiele für die „korrekte“ Anwendung existieren.

### 3. Zerlege die Arbeit in kleine Salami-Scheiben
Gib der KI niemals den Auftrag, „die ganze App“ auf einmal zu bauen. Zerlege das Projekt in **diskrete, testbare Schritte** (z. B. erst das UI-Layout, dann die Datenanbindung, dann die Logik) und arbeite diese nacheinander ab. Jedes Teilstück sollte stabil laufen, bevor du den nächsten Schritt angehst.

### 4. Nutze Versionskontrolle (Git) als Sicherheitsnetz
Git ist dein „Rückwärtsgang“, wenn die KI den Code kaputtmacht. **Committe regelmäßig**, sobald ein Feature sauber funktioniert, und nutze Befehle wie \`git reset --hard\`, um KI-Umwege oder fehlerhafte „Schichtkuchen-Bugs“ sofort abzuschneiden.

### 5. Kontext-Fütterung durch Knowledge-Files
Füttere die KI mit spezifischen Informationen über dein Projekt durch **Knowledge-Files oder Instruction-Files** (wie \`cursor.rules\` oder \`claude.md\`). Je mehr die KI über deine Design-Systeme, Rollenverteilungen (z. B. Admin vs. User) und API-Dokumentationen weiß, desto weniger wird sie halluzinieren.

### 6. Tests als Leitplanken setzen
Nutze **Test Driven Development (TDD)**: Lass die KI zuerst Tests für ein Feature schreiben und danach die Implementierung bauen, bis die Tests „grün“ sind. Besonders High-Level- oder End-to-End-Tests sind wichtig, um sicherzustellen, dass die KI bei neuen Änderungen nicht unbemerkt bestehende Funktionen zerstört.

### 7. Erst Minimalbeispiel, dann Skalierung
Verlass dich nicht darauf, dass die KI komplexe APIs nur aus der Dokumentation heraus perfekt beherrscht. Baue zuerst ein **kleines, funktionierendes Minimal-Script** (Standalone-Prototyp) für eine Funktion. Wenn dieses läuft, speichere es und nutze es als Referenz-Beispiel in deinen weiteren Prompts.

### 8. Den „Bug-Sumpf“ durch frische Chats vermeiden
Wenn du in einer Endlosschleife aus Fehlermeldungen feststeckst, flicke nicht weiter an kaputtem Code herum. Starte stattdessen einen **neuen, sauberen Chat** und liefere nur die harten Fakten: Was ist kaputt, was hast du probiert und die relevanten Logs. Je länger ein Chatverlauf ist, desto „matschiger“ wird oft die Aufmerksamkeit der KI.

### 9. Präzises Prompting mit „Product Surface“
Gute Prompts sollten drei Elemente enthalten: die exakte **Produktoberfläche** (welche Felder, welche Daten), den **Kontext** (wer nutzt es warum) und **Constraints** (Designvorgaben, mobile-first, Barrierefreiheit). Spezifische Anweisungen wie „Editiere Datei X, aber lass Layout Y unberührt“ verhindern ungewollte Nebeneffekte.

### 10. Behalte die Engineering-Disziplin bei
KI ersetzt keine Disziplin, sie verstärkt sie. Achte auf **modularen Code** statt riesiger Monolithen und lass dir Code regelmäßig erklären oder refactoren. Führe Code-Reviews durch – auch wenn die KI den Code geschrieben hat, bleibt die letzte Verantwortung bei dir als menschlichem „Piloten“.

***

**Analogie zur Veranschaulichung:**
Vibe Coding ist wie das Fliegen eines modernen Jets mit **Autopiloten**: Die KI kann die meiste Flugzeit (den Code-Boilerplate) übernehmen und ist dabei extrem schnell. Aber ohne einen **Flugplan** (PRD), ständige Überprüfung der **Instrumente** (Tests) und die Bereitschaft des Piloten, bei Turbulenzen das **Steuer selbst zu übernehmen** (Debugging/Refactoring), wird der Flug im Chaos enden. Der Autopilot macht dich schneller, aber du bestimmst das Ziel und die Sicherheit.
    `,
  },
  {
    id: 'writing-agents-md',
    title: 'Eine gute AGENTS.md schreiben',
    description: 'Best Practices für CLAUDE.md, GEMINI.md und das Onboarding von AI-Agents.',
    category: 'fundamentals',
    icon: FileCode,
    readTime: '12 Min',
    content: `
# Eine gute AGENTS.md schreiben

Hinweis: Dieser Beitrag gilt auch für **CLAUDE.md** und **GEMINI.md**

## Prinzip: LLMs sind (meistens) zustandslos

LLMs sind zustandslose Funktionen. Ihre Gewichte sind zum Zeitpunkt der Inferenz „eingefroren“, sie lernen also nicht über die Zeit hinweg. Das Einzige, was das Modell über deine Codebasis weiß, sind die Tokens, die du hineinsteckst.

Ähnlich ist es bei Coding-Agent-Harnesses wie Claude Code: Dort musst du das „Gedächtnis“ des Agents meist explizit verwalten. **CLAUDE.md (oder AGENTS.md)** ist die einzige Datei, die standardmäßig in *jede einzelne* Unterhaltung mit dem Agent eingeht.

Das hat drei wichtige Konsequenzen:

* Coding-Agents wissen zu Beginn jeder Session absolut nichts über deine Codebasis.
* Der Agent muss bei jedem Start einer Session alles Wichtige über deine Codebasis erneut gesagt bekommen.
* **CLAUDE.md** ist der bevorzugte Weg, das zu tun.

## CLAUDE.md onboardet Claude in deine Codebasis

Da Claude zu Beginn jeder Session nichts über deine Codebasis weiß, solltest du **CLAUDE.md** nutzen, um Claude in dein Projekt „einzuarbeiten“. Auf hoher Ebene bedeutet das, dass die Datei Folgendes abdecken sollte:

* **WAS (WHAT):** Erkläre Claude die Technologie, deinen Stack, die Projektstruktur. Gib Claude eine Karte der Codebasis. Das ist besonders wichtig in Monorepos! Sag Claude, welche Apps es gibt, welche Shared Packages, und wofür alles da ist, damit es weiß, wo es nach Dingen suchen soll.
* **WARUM (WHY):** Erkläre den Zweck des Projekts und was im Repository passiert. Was ist Zweck und Funktion der unterschiedlichen Teile?
* **WIE (HOW):** Sag Claude, wie es am Projekt arbeiten soll. Nutzt ihr z. B. bun statt node? Gib alle Infos, die Claude braucht, um wirklich sinnvolle Arbeit zu leisten. Wie kann Claude Änderungen verifizieren? Wie führt es Tests, Typechecks und Build-/Compile-Schritte aus?

Aber *wie* du das machst, ist wichtig: Versuche nicht, in CLAUDE.md jeden Befehl unterzubringen, den Claude jemals brauchen könnte – das liefert suboptimale Ergebnisse.

## Claude ignoriert CLAUDE.md oft

Unabhängig vom Modell kannst du beobachten, dass Claude den Inhalt deiner CLAUDE.md häufig ignoriert.

Du kannst das selbst untersuchen, indem du einen Logging-Proxy zwischen claude-code-CLI und der Anthropic-API setzt, z. B. über **ANTHROPIC_BASE_URL**. Claude Code injiziert zusammen mit deiner CLAUDE.md folgende System-Erinnerung in die User-Message an den Agent:

\`\`\`xml
<system-reminder>
      IMPORTANT: this context may or may not be relevant to your tasks. 
      You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
\`\`\`

Dadurch ignoriert Claude den Inhalt deiner CLAUDE.md, wenn es entscheidet, dass er für die aktuelle Aufgabe nicht relevant ist. Je mehr Informationen in der Datei stehen, die nicht universell auf die Aufgaben passen, desto wahrscheinlicher ist es, dass Claude deine Anweisungen aus der Datei ignoriert.

Warum hat Anthropic das eingebaut? Sicher kann man das nicht sagen, aber man kann spekulieren: Viele CLAUDE.md-Dateien enthalten einen Haufen Anweisungen, die nicht allgemein gelten. Viele Nutzer behandeln die Datei wie eine Sammlung von „Hotfixes“ für unerwünschtes Verhalten und hängen immer mehr Regeln dran, die nicht unbedingt breit anwendbar sind.

Vermutlich hat das Claude-Code-Team festgestellt, dass das Harness bessere Ergebnisse liefert, wenn Claude explizit ermutigt wird, schlechte oder irrelevante Instruktionen zu ignorieren.

## Eine gute CLAUDE.md erstellen

Der folgende Abschnitt gibt Empfehlungen, wie du eine gute CLAUDE.md nach Best Practices des Context Engineering schreibst.

Ergebnisse können variieren. Nicht alle Regeln sind für jedes Setup optimal. Wie bei allem gilt: Regeln darf man brechen – aber erst, wenn …

* du verstehst, wann & warum es okay ist, sie zu brechen
* du einen guten Grund dafür hast

### Weniger (Instruktionen) ist mehr

Es ist verlockend, jeden einzelnen Befehl, den Claude jemals brauchen könnte, plus Code-Standards und Style-Guidelines in CLAUDE.md zu stopfen. Davon raten wir ab.

Auch wenn das nicht extrem streng erforscht ist, deuten einige Untersuchungen auf Folgendes hin:

* Frontier-„Thinking“-LLMs können ungefähr **150–200** Instruktionen mit brauchbarer Konsistenz befolgen. Kleinere Modelle können weniger Instruktionen „im Blick“ behalten als größere, und Non-Thinking-Modelle weniger als Thinking-Modelle.
* Kleinere Modelle werden **viel schneller viel schlechter**: Sie zeigen oft einen **exponentiellen** Abfall in der Befolgung von Instruktionen, je mehr Instruktionen dazukommen; große Frontier-Thinking-Modelle zeigen eher einen **linearen** Abfall (siehe unten). Darum empfehlen wir kleinere Modelle nicht für Multi-Step-Tasks oder komplizierte Implementierungspläne.
* LLMs haben einen Bias zu Instruktionen an den „Rändern“ des Prompts: ganz am Anfang (System Message + CLAUDE.md) und ganz am Ende (die neuesten User-Messages).
* Mit steigender Instruktionsanzahl sinkt die Qualität der Instruktionsbefolgung **gleichmäßig**. Das heißt: Wenn du mehr Instruktionen gibst, ignoriert das Modell nicht nur die neueren („weiter unten in der Datei“), sondern beginnt, **alle** Instruktionen gleichmäßig schlechter zu befolgen.

**Instruction following**

Unsere Analyse des Claude-Code-Harnesses deutet darauf hin, dass der System-Prompt von Claude Code ungefähr **50 einzelne Instruktionen** enthält. Je nach Modell ist das bereits fast ein Drittel der Instruktionen, die dein Agent zuverlässig befolgen kann – und das noch bevor Regeln, Plugins, Skills oder User-Messages dazukommen.

Das impliziert: Deine CLAUDE.md sollte **so wenige Instruktionen wie möglich** enthalten – idealerweise nur solche, die universell für deine Aufgaben gelten.

### Länge & Anwendbarkeit der CLAUDE.md

Wenn sonst alles gleich ist, performt ein LLM besser, wenn sein Context Window mit fokussiertem, relevantem Kontext (Beispiele, verwandte Dateien, Tool Calls, Tool Results) gefüllt ist, statt mit viel irrelevanter Information.

Da CLAUDE.md in jede Session geht, sollte ihr Inhalt so universell anwendbar wie möglich sein.

Vermeide z. B. Anweisungen darüber, wie man ein neues Datenbankschema strukturiert – das ist oft irrelevant und lenkt das Modell ab, wenn du an etwas völlig anderem arbeitest.

Auch bei der Länge gilt „weniger ist mehr“. Anthropic hat keine offizielle Empfehlung, aber der allgemeine Konsens ist: **< 300 Zeilen** ist am besten – und kürzer ist noch besser.

Bei HumanLayer ist die root CLAUDE.md weniger als sechzig Zeilen lang.

### Progressive Disclosure

Eine knappe CLAUDE.md zu schreiben, die trotzdem alles Wichtige enthält, kann gerade in großen Projekten schwierig sein.

Hier hilft das Prinzip **Progressive Disclosure**: Claude soll nur dann task- oder projektspezifische Instruktionen sehen, wenn es sie wirklich braucht.

Statt alle Instruktionen zum Bauen, Testen, Code-Conventions oder sonstigen Kontext in CLAUDE.md zu packen, empfiehlt es sich, taskspezifische Anweisungen in separate Markdown-Dateien mit selbsterklärenden Namen irgendwo im Projekt zu legen.

Zum Beispiel:

\`\`\`text
agent_docs/
  |- building_the_project.md
  |- running_tests.md
  |- code_conventions.md
  |- service_architecture.md
  |- database_schema.md
  |- service_communication_patterns.md
\`\`\`

Dann kannst du in CLAUDE.md eine Liste dieser Dateien mit kurzer Beschreibung aufnehmen und Claude anweisen, zu entscheiden, welche (falls überhaupt) relevant sind, und sie zu lesen, bevor es loslegt. Oder du lässt Claude erst die Dateien nennen, die es lesen will, und holst dir dafür eine Freigabe, bevor es sie liest.

Bevorzuge **Verweise statt Kopien**. Wenn möglich, keine Code-Snippets in diese Dateien aufnehmen – die veralten schnell. Stattdessen: **file:line-Referenzen**, die Claude zum maßgeblichen Kontext führen.

Konzeptionell ist das ähnlich zu „Claude Skills“, nur dass Skills mehr auf Tool-Nutzung als auf Instruktionen abzielen.

### Claude ist (nicht) ein teurer Linter

Eines der häufigsten Dinge, die wir in CLAUDE.md sehen, sind Code-Style-Guidelines. Schick niemals ein LLM los, um die Arbeit eines Linters zu machen. LLMs sind im Vergleich zu klassischen Lintern/Formattern teuer und langsam. Deterministische Tools solltest du immer nutzen, wenn es geht.

Code-Style-Guidelines packen zwangsläufig viele Instruktionen und meist irrelevante Snippets in dein Context Window, verschlechtern die Performance und fressen Kontext.

LLMs lernen „in-context“: Wenn dein Code ohnehin einem Stil folgt, wird dein Agent mit ein paar Suchen in der Codebasis (oder einem guten Research-Dokument) vorhandene Muster und Konventionen meist übernehmen, ohne dass du es explizit anweisen musst.

Wenn du da sehr streng bist, könntest du sogar einen **Claude Code Stop Hook** einrichten, der Formatter & Linter laufen lässt und Fehler an Claude zurückgibt, damit es sie behebt. Lass Claude nicht selbst nach Formatierungsproblemen suchen.

Bonus: Nutze einen Linter, der automatisch fixen kann (wir mögen **Biome**) und tune Regeln sorgfältig, welche Fixes sicher auto-anwendbar sind, um maximale (sichere) Abdeckung zu erreichen.

Alternativ: Erstelle einen **Slash Command**, der deine Code-Guidelines enthält und Claude auf die Änderungen in der Versionskontrolle oder deinen \`git status\` verweist. So trennst du Implementierung und Formatierung. Das ergibt oft bessere Resultate bei beidem.

### Nicht /init nutzen oder CLAUDE.md auto-generieren

Sowohl Claude Code als auch andere Harnesses wie OpenCode haben Möglichkeiten, deine CLAUDE.md (oder AGENTS.md) automatisch zu generieren.

Weil CLAUDE.md in jede Session geht, ist sie einer der Hebelpunkte mit dem größten Einfluss – im Guten wie im Schlechten.

Eine schlechte Codezeile ist eine schlechte Codezeile. Eine schlechte Zeile in einem Implementierungsplan kann viele schlechte Codezeilen erzeugen. Schlechte Research, die das System missversteht, kann zu einem schlechten Plan führen – und dadurch zu noch mehr schlechtem Code.

Aber die CLAUDE.md beeinflusst *jede Phase* deines Workflows und *jedes* Artefakt. Darum solltest du jede einzelne Zeile, die hineinwandert, sehr bewusst überlegen:

**Leverage**

## Fazit

* CLAUDE.md dient dazu, Claude in deine Codebasis einzuarbeiten. Sie sollte **WARUM, WAS und WIE** deines Projekts definieren.
* Weniger (Instruktionen) ist mehr: Lass nichts Notwendiges weg, aber pack so wenig wie möglich hinein.
* Halte den Inhalt knapp und universell anwendbar.
* Nutze Progressive Disclosure: Sag Claude nicht alles, sondern zeig ihm, wie es wichtige Informationen findet – und zwar nur dann, wenn es sie braucht, damit Context Window und Instruktionsbudget nicht aufblähen.
* Claude ist kein Linter: Nutze Linter und Formatter, und ergänze bei Bedarf Hooks und Slash Commands.
* CLAUDE.md ist ein High-Leverage-Punkt des Harnesses: Vermeide Auto-Generierung und gestalte den Inhalt sorgfältig für die besten Ergebnisse.
    `,
  },
  {
    id: 'gemini-image-generation',
    title: 'Gemini Image Generation Guide',
    description: 'Master image generation and editing with Gemini 2.5 Flash and Gemini 3 Pro.',
    category: 'fundamentals',
    icon: Image,
    readTime: '20 Min',
    content: `
# Gemini Image Generation Guide

Gemini can generate and process images conversationally. You can prompt either the [fast Gemini 2.5 Flash (aka Nano Banana) or the advanced Gemini 3 Pro Preview (aka Nano Banana Pro)](https://ai.google.dev/gemini-api/docs/image-generation#model-selection) image models with text, images, or a combination of both, allowing you to create, edit, and iterate on visuals with unprecedented control.

## Core Capabilities

- **Text, Image, and Multi-Image to Image:** Generate high-quality images from text descriptions, use text prompts to edit and adjust a given image, or use multiple input images to compose new scenes and transfer styles.
- **Iterative refinement:** Conversationally refine your image over multiple turns, making small adjustments until it's perfect.
- **High-Fidelity text rendering:** Accurately generate images that contain legible and well-placed text, ideal for logos, diagrams, and posters.

All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Image generation (text-to-image)

### Python Example

\`\`\`python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("generated_image.png")
\`\`\`

### JavaScript Example

\`\`\`javascript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});
  const prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
    }
  }
}
main();
\`\`\`

## Image editing (text-and-image-to-image)

Provide an image and use text prompts to add, remove, or modify elements, change the style, or adjust the color grading.

### Python Example

\`\`\`python
from google import genai
from PIL import Image

client = genai.Client()
prompt = "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"
image = Image.open("/path/to/cat_image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, image],
)
\`\`\`

## New with Gemini 3 Pro Image

Gemini 3 Pro Image (\`gemini-3-pro-image-preview\`) is optimized for professional asset production.

- **High-resolution output**: Built-in generation capabilities for 1K, 2K, and 4K visuals.
- **Advanced text rendering**: Capable of generating legible, stylized text.
- **Grounding with Google Search**: Use Google Search as a tool to verify facts and generate imagery based on real-time data.
- **Thinking mode**: Utilizes a "thinking" process to reason through complex prompts.
- **Up to 14 reference images**: Mix up to 14 reference images to produce the final image.

### Using Reference Images (Python)

\`\`\`python
from google import genai
from google.genai import types
from PIL import Image

prompt = "An office group photo of these people, they are making funny faces."
aspect_ratio = "5:4"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        prompt,
        Image.open('person1.png'),
        Image.open('person2.png'),
        Image.open('person3.png'),
        Image.open('person4.png'),
        Image.open('person5.png'),
    ],
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
            image_size="2K"
        ),
    )
)
\`\`\`

## Prompting guide and strategies

> **Describe the scene, don't just list keywords.** A narrative, descriptive paragraph will almost always produce a better, more coherent image.

### Strategies

1.  **Photorealistic scenes**: Use photography terms (camera angles, lighting, lens types).
2.  **Stylized illustrations**: Be explicit about style (e.g., "kawaii sticker", "transparent background").
3.  **Accurate text**: Specify the text, font style, and placement clearly.
4.  **Product mockups**: Describe lighting setup, camera angle, and background surface.
5.  **Character consistency**: Use reference images or describe features in detail across prompts.

### Example Prompt Template

> A photorealistic [shot type] of [subject], [action or expression], set in [environment]. The scene is illuminated by [lighting description], creating a [mood] atmosphere. Captured with a [camera/lens details], emphasizing [key textures and details].

## Technical Details

**Gemini 2.5 Flash Image** supports various aspect ratios (1:1, 16:9, 4:3, etc.) at roughly 1MP resolution.

**Gemini 3 Pro Image Preview** supports 1K, 2K, and 4K resolutions with token costs scaling accordingly (approx 1120 tokens for 1K/2K, 2000 tokens for 4K).

***

**Originalbeitrag:** [Gemini API Documentation - Image Generation](https://ai.google.dev/gemini-api/docs/image-generation?hl=de)
    `,
  },
];

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filtered = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentArticle = selectedArticle ? articles.find(a => a.id === selectedArticle) : null;

  if (currentArticle) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zur Übersicht
        </button>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-neutral dark:prose-invert max-w-none"
        >
          <div className="not-prose mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <currentArticle.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentArticle.title}</h1>
                <p className="text-muted-foreground">{currentArticle.readTime} Lesezeit</p>
              </div>
            </div>
          </div>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
          </div>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Wissensbasis
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dokumentation und Best Practices für AI-gestützte Entwicklung.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Artikel durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, index) => (
          <motion.button
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedArticle(article.id)}
            className="text-left group"
          >
            <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <article.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {article.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
