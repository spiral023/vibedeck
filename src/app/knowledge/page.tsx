'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap } from 'lucide-react';
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