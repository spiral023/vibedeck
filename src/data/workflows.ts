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
];

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find(w => w.id === id);
}

export function getWorkflowIndex(): Workflow[] {
  return [...workflows].sort((a, b) => a.title.localeCompare(b.title));
}
