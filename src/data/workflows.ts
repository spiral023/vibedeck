import type { Workflow } from '@/types/prompt';

export const workflows: Workflow[] = [
  {
    id: 'new-feature-workflow',
    title: 'Neues Feature entwickeln',
    description: 'Ein strukturierter Workflow für die Entwicklung neuer Features von der Planung bis zum Deployment.',
    category: 'Build',
    tags: ['Feature', 'Entwicklung', 'Workflow'],
    steps: [
      {
        order: 1,
        title: 'Anforderungen definieren',
        description: 'Sammle und dokumentiere alle Anforderungen für das neue Feature.',
      },
      {
        order: 2,
        title: 'Technisches Design',
        description: 'Erstelle ein technisches Design-Dokument mit Architekturentscheidungen.',
      },
      {
        order: 3,
        title: 'Komponenten implementieren',
        promptRef: 'react-component-generator',
        description: 'Implementiere die benötigten UI-Komponenten.',
      },
      {
        order: 4,
        title: 'API Endpoints erstellen',
        promptRef: 'api-endpoint-designer',
        description: 'Designe und implementiere die Backend-APIs.',
      },
      {
        order: 5,
        title: 'Code Review',
        promptRef: 'code-reviewer',
        description: 'Führe ein gründliches Code Review durch.',
      },
      {
        order: 6,
        title: 'Deployment vorbereiten',
        promptRef: 'deployment-checklist',
        description: 'Erstelle und befolge die Deployment-Checkliste.',
      },
    ],
    changelog: [
      { date: '2024-12-10', note: 'Workflow erstellt' },
      { date: '2024-12-15', note: 'Code Review Schritt hinzugefügt' },
    ],
    body: `## Workflow Beschreibung

Dieser Workflow führt dich durch den gesamten Prozess der Feature-Entwicklung.

### Tipps für den Erfolg

- Dokumentiere Entscheidungen
- Arbeite in kleinen, testbaren Schritten
- Hole früh Feedback ein`,
    updatedDate: '2024-12-15',
  },
  {
    id: 'bug-fix-workflow',
    title: 'Bug beheben',
    description: 'Systematischer Workflow zur Identifikation und Behebung von Bugs.',
    category: 'Ship',
    tags: ['Debugging', 'Bugfix', 'Qualität'],
    steps: [
      {
        order: 1,
        title: 'Bug reproduzieren',
        description: 'Stelle sicher, dass der Bug konsistent reproduzierbar ist.',
      },
      {
        order: 2,
        title: 'Ursache analysieren',
        promptRef: 'code-reviewer',
        description: 'Analysiere den Code, um die Ursache zu finden.',
      },
      {
        order: 3,
        title: 'Fix implementieren',
        description: 'Implementiere die Lösung mit minimalen Änderungen.',
      },
      {
        order: 4,
        title: 'Testen',
        description: 'Teste den Fix gründlich inkl. Regression.',
      },
      {
        order: 5,
        title: 'Git Workflow',
        promptRef: 'git-workflow-helper',
        description: 'Committe und pushe die Änderungen korrekt.',
      },
    ],
    changelog: [
      { date: '2024-12-12', note: 'Workflow erstellt' },
    ],
    body: `## Bug-Fix Best Practices

- Schreibe erst einen fehlschlagenden Test
- Fixe nur den Bug, keine anderen Änderungen
- Dokumentiere die Ursache`,
    updatedDate: '2024-12-12',
  },
  {
    id: 'learning-workflow',
    title: 'Neues Konzept lernen',
    description: 'Strukturierter Ansatz zum Erlernen neuer technischer Konzepte.',
    category: 'Learn',
    tags: ['Lernen', 'Konzepte', 'Bildung'],
    steps: [
      {
        order: 1,
        title: 'Konzept verstehen',
        promptRef: 'concept-explainer',
        description: 'Lass dir das Konzept auf deinem Level erklären.',
      },
      {
        order: 2,
        title: 'Praktisch anwenden',
        description: 'Baue ein kleines Beispielprojekt.',
      },
      {
        order: 3,
        title: 'Vertiefen',
        description: 'Erkunde fortgeschrittene Aspekte und Edge Cases.',
      },
      {
        order: 4,
        title: 'Dokumentieren',
        description: 'Erstelle eigene Notizen und Cheatsheets.',
      },
    ],
    changelog: [
      { date: '2024-12-08', note: 'Workflow erstellt' },
    ],
    body: `## Lernmethodik

Dieser Workflow basiert auf der Feynman-Technik und aktivem Lernen.`,
    updatedDate: '2024-12-08',
  },
];

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find(w => w.id === id);
}

export function getWorkflowIndex(): Workflow[] {
  return [...workflows].sort((a, b) => a.title.localeCompare(b.title));
}
