'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Zap, Code2, Terminal, Sparkles, Lightbulb, Target, Layers } from 'lucide-react';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';

const superpowers = [
  {
    id: 'chain-of-thought',
    title: 'Chain of Thought',
    description: 'Lass die AI Schritt für Schritt denken.',
    icon: Layers,
    category: 'Reasoning',
    prompt: `Denke Schritt für Schritt durch dieses Problem:

1. Was sind die Anforderungen?
2. Welche Einschränkungen gibt es?
3. Welche Lösungsansätze sind möglich?
4. Welcher Ansatz ist optimal und warum?

Problem: [DEIN PROBLEM]`,
  },
  {
    id: 'role-playing',
    title: 'Rollenspiel',
    description: 'Die AI nimmt eine spezifische Expertenrolle ein.',
    icon: Target,
    category: 'Persona',
    prompt: `Du bist ein erfahrener [ROLLE, z.B. Senior React Entwickler] mit 10+ Jahren Erfahrung.

Dein Fokus liegt auf:
- Clean Code und Best Practices
- Performance-Optimierung
- Wartbarkeit und Lesbarkeit

Beantworte die folgende Frage aus dieser Perspektive:
[DEINE FRAGE]`,
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Learning',
    description: 'Gib Beispiele für das gewünschte Output-Format.',
    icon: Sparkles,
    category: 'Examples',
    prompt: `Hier sind Beispiele für das gewünschte Format:

Eingabe: "Hallo Welt"
Ausgabe: { text: "Hallo Welt", wordCount: 2, charCount: 10 }

Eingabe: "React ist toll"
Ausgabe: { text: "React ist toll", wordCount: 3, charCount: 14 }

Jetzt verarbeite diese Eingabe im gleichen Format:
Eingabe: [DEINE EINGABE]`,
  },
  {
    id: 'constraint-setting',
    title: 'Einschränkungen setzen',
    description: 'Definiere klare Grenzen für die Antwort.',
    icon: Target,
    category: 'Structure',
    prompt: `Beantworte die Frage unter diesen Einschränkungen:

- Maximal 100 Wörter
- Nutze nur einfache Begriffe
- Keine externen Dependencies
- Fokus auf Vanilla JavaScript/TypeScript
- Inkludiere ein kurzes Code-Beispiel

Frage: [DEINE FRAGE]`,
  },
  {
    id: 'socratic-method',
    title: 'Sokratische Methode',
    description: 'Lass dir Fragen stellen statt direkte Antworten.',
    icon: Lightbulb,
    category: 'Learning',
    prompt: `Anstatt mir die Lösung direkt zu geben, stelle mir gezielte Fragen, die mich zur Lösung führen.

Mein aktuelles Problem/Verständnis:
[BESCHREIBE DEIN PROBLEM]

Stelle mir 3-5 Fragen, die mir helfen, das Problem selbst zu lösen.`,
  },
  {
    id: 'rubber-duck',
    title: 'Rubber Duck Debugging',
    description: 'Erkläre dein Problem und finde die Lösung.',
    icon: Code2,
    category: 'Debugging',
    prompt: `Ich werde dir mein Problem erklären. Unterbrich mich nur, wenn du eine Unstimmigkeit in meiner Logik erkennst.

Mein Code macht folgendes:
[ERKLÄRE WAS DER CODE TUN SOLL]

Der aktuelle Zustand:
[BESCHREIBE DAS VERHALTEN]

Was ich erwarte:
[ERWARTETES VERHALTEN]

Was ich schon versucht habe:
[BISHERIGE LÖSUNGSVERSUCHE]`,
  },
  {
    id: 'tree-of-thoughts',
    title: 'Tree of Thoughts',
    description: 'Erkunde mehrere Lösungswege parallel.',
    icon: Layers,
    category: 'Reasoning',
    prompt: `Generiere 3 verschiedene Lösungsansätze für dieses Problem:

Problem: [DEIN PROBLEM]

Für jeden Ansatz:
1. Beschreibe den Ansatz kurz
2. Liste Vor- und Nachteile
3. Bewerte die Komplexität (1-5)
4. Schätze den Zeitaufwand

Am Ende: Empfehle den besten Ansatz mit Begründung.`,
  },
  {
    id: 'meta-prompt',
    title: 'Meta-Prompt',
    description: 'Lass die AI den optimalen Prompt generieren.',
    icon: Sparkles,
    category: 'Advanced',
    prompt: `Ich möchte einen Prompt erstellen für folgende Aufgabe:
[BESCHREIBE DEINE AUFGABE]

Generiere einen optimalen Prompt, der:
- Klare Anweisungen gibt
- Das Output-Format definiert
- Relevanten Kontext liefert
- Edge Cases berücksichtigt

Erkläre auch, warum du bestimmte Elemente eingefügt hast.`,
  },
];

const categories = ['Alle', 'Reasoning', 'Persona', 'Examples', 'Structure', 'Learning', 'Debugging', 'Advanced'];

export default function SuperpowersPage() {
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedCategory === 'Alle'
    ? superpowers
    : superpowers.filter(s => s.category === selectedCategory);

  const handleCopy = async (prompt: string, title: string) => {
    const success = await copyToClipboard(prompt);
    if (success) {
      toast.success(`${title} kopiert`);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          Superpowers
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Erweiterte Prompting-Techniken für Power-User.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Superpowers Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((power, index) => (
          <motion.div
            key={power.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpandedId(expandedId === power.id ? null : power.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <power.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{power.title}</h3>
                    <p className="text-sm text-muted-foreground">{power.description}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium">
                  {power.category}
                </span>
              </div>
            </div>

            {expandedId === power.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border/50"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Prompt Template</span>
                    <button
                      onClick={() => handleCopy(power.prompt, power.title)}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Kopieren
                    </button>
                  </div>
                  <pre className="rounded-xl bg-secondary/50 p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                    {power.prompt}
                  </pre>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
