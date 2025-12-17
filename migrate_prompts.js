const fs = require('fs');
const path = require('path');

const prompts = [
  {
    id: 'react-component-generator',
    title: 'React Komponenten Generator',
    category: 'Build',
    tags: ['React', 'TypeScript', 'Komponenten'],
    related_prompts: ['typescript-interface-builder'],
    dependencies: ['react', 'typescript'],
    complexity: 'intermediate',
    agent_role: 'Senior React Entwickler',
    variables: [
      { name: 'componentName', label: 'Komponentenname', default: 'MyComponent' },
      { name: 'props', label: 'Props Definition' },
    ],
    changelog: [
      { date: '2024-12-15', note: 'Initiale Version erstellt' },
      { date: '2024-12-17', note: 'TypeScript strict mode Unterstützung hinzugefügt' },
    ],
    pre_prompt: `Du bist ein erfahrener React-Entwickler mit Fokus auf Clean Code und Best Practices. 
Du erstellst Komponenten, die:
- TypeScript strict mode kompatibel sind
- Accessible (WCAG 2.1 AA) sind
- Performance-optimiert sind`,
    variants: {
      default: `Erstelle eine React-Komponente namens {{componentName}} mit folgenden Props: {{props}}

Anforderungen:
- Verwende TypeScript mit strikten Typen
- Implementiere React.memo wenn sinnvoll
- Füge JSDoc Kommentare hinzu
- Exportiere Props Interface separat`,
      beginner: `Erstelle eine einfache React-Komponente namens {{componentName}}.
Erkläre jeden Teil des Codes mit Kommentaren.`,
      expert: `Erstelle eine hochoptimierte React-Komponente {{componentName}} mit:
- Generics für flexible Typisierung
- Compound Component Pattern
- Custom Hooks für Logik-Abstraktion
- Render Props API`,
    },
    body: `## Zusätzliche Hinweise

Diese Prompt-Vorlage eignet sich besonders für:
- Wiederverwendbare UI-Komponenten
- Form-Elemente
- Layout-Komponenten

### Beispiel Output

\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = memo(({ variant, children }) => {
  return <button className={styles[variant]}>{children}</button>;
});
\`\`\``,
    shortExcerpt: 'Generiert typsichere React-Komponenten mit Best Practices und Accessibility-Support.',
    updatedDate: '2024-12-17',
  },
  {
    id: 'api-endpoint-designer',
    title: 'REST API Endpoint Designer',
    category: 'Build',
    tags: ['API', 'REST', 'Backend', 'OpenAPI'],
    related_prompts: ['typescript-interface-builder'],
    dependencies: ['express', 'zod'],
    complexity: 'intermediate',
    agent_role: 'Backend Architekt',
    variables: [
      { name: 'resource', label: 'Ressourcenname', default: 'users' },
      { name: 'operations', label: 'CRUD Operationen', default: 'create, read, update, delete' },
    ],
    changelog: [
      { date: '2024-12-10', note: 'Initiale Version' },
      { date: '2024-12-14', note: 'OpenAPI Spec hinzugefügt' },
    ],
    pre_prompt: `Du bist ein erfahrener Backend-Architekt, der RESTful APIs nach Best Practices designed.
Deine APIs sind:
- Konsistent und vorhersehbar
- Gut dokumentiert (OpenAPI 3.0)
- Sicher (Input Validierung, Rate Limiting)`,
    variants: {
      default: `Designe REST API Endpoints für die Ressource "{{resource}}" mit folgenden Operationen: {{operations}}

Liefere:
1. Endpoint-Definitionen (Method, Path, Request/Response)
2. OpenAPI 3.0 Spezifikation
3. Zod Validierungsschemas
4. Error Responses`,
    },
    body: `## Best Practices

- Verwende plurale Nomen für Ressourcen
- Nutze HTTP Status Codes korrekt
- Implementiere HATEOAS für Discoverability`,
    shortExcerpt: 'Erstellt vollständige REST API Spezifikationen mit OpenAPI und Validierung.',
    updatedDate: '2024-12-14',
  },
  {
    id: 'code-reviewer',
    title: 'Code Review Assistent',
    category: 'Browse',
    tags: ['Code Review', 'Qualität', 'Best Practices'],
    related_prompts: [],
    dependencies: [],
    complexity: 'beginner',
    agent_role: 'Senior Code Reviewer',
    variables: [
      { name: 'language', label: 'Programmiersprache', default: 'TypeScript' },
      { name: 'code', label: 'Code zum Reviewen' },
    ],
    changelog: [
      { date: '2024-12-08', note: 'Erste Version' },
    ],
    pre_prompt: `Du bist ein geduldiger und konstruktiver Code Reviewer.
Du gibst Feedback das:
- Spezifisch und umsetzbar ist
- Begründungen enthält
- Alternative Lösungen vorschlägt`,
    variants: {
      default: `Führe ein Code Review für folgenden {{language}} Code durch:

\`\`\`
{{code}}
\`\`\`

Analysiere:
1. Code-Qualität und Lesbarkeit
2. Potenzielle Bugs oder Edge Cases
3. Performance-Überlegungen
4. Sicherheitsaspekte
5. Verbesserungsvorschläge`,
      beginner: `Erkläre diesen Code Schritt für Schritt und gib einfache Verbesserungstipps:
\`\`\`
{{code}}
\`\`\``,
    },
    body: `## Review Checkliste

- [ ] Benennung klar und konsistent
- [ ] Keine Code-Duplizierung
- [ ] Fehlerbehandlung vorhanden
- [ ] Tests vorhanden/möglich`,
    shortExcerpt: 'Führt strukturierte Code Reviews mit konstruktivem Feedback durch.',
    updatedDate: '2024-12-08',
  },
  {
    id: 'deployment-checklist',
    title: 'Deployment Checkliste Generator',
    category: 'Ship',
    tags: ['DevOps', 'Deployment', 'CI/CD', 'Checkliste'],
    related_prompts: [],
    dependencies: [],
    complexity: 'intermediate',
    agent_role: 'DevOps Engineer',
    variables: [
      { name: 'projectType', label: 'Projekttyp', default: 'Web Application' },
      { name: 'environment', label: 'Zielumgebung', default: 'Production' },
    ],
    changelog: [
      { date: '2024-12-12', note: 'Initiale Checkliste' },
      { date: '2024-12-16', note: 'Rollback-Strategien ergänzt' },
    ],
    pre_prompt: `Du bist ein DevOps-Experte mit Fokus auf sichere und zuverlässige Deployments.
Du erstellst Checklisten die:
- Alle kritischen Schritte abdecken
- Rollback-Pläne enthalten
- Monitoring einbeziehen`,
    variants: {
      default: `Erstelle eine vollständige Deployment-Checkliste für:
- Projekttyp: {{projectType}}
- Umgebung: {{environment}}

Inkludiere:
1. Pre-Deployment Checks
2. Deployment-Schritte
3. Post-Deployment Validierung
4. Rollback-Prozedur
5. Monitoring & Alerts`,
    },
    body: `## Wichtige Aspekte

- Zero-Downtime Deployments
- Feature Flags für schrittweises Rollout
- Automatisierte Smoke Tests`,
    shortExcerpt: 'Generiert umfassende Deployment-Checklisten mit Rollback-Strategien.',
    updatedDate: '2024-12-16',
  },
  {
    id: 'concept-explainer',
    title: 'Technisches Konzept Erklärer',
    category: 'Learn',
    tags: ['Lernen', 'Konzepte', 'Erklärung'],
    related_prompts: [],
    dependencies: [],
    complexity: 'beginner',
    agent_role: 'Technischer Mentor',
    variables: [
      { name: 'concept', label: 'Zu erklärendes Konzept' },
      { name: 'level', label: 'Erfahrungslevel', default: 'Einsteiger' },
    ],
    changelog: [
      { date: '2024-12-05', note: 'Erstellt' },
    ],
    pre_prompt: `Du bist ein geduldiger technischer Mentor, der komplexe Konzepte verständlich erklären kann.
Deine Erklärungen:
- Nutzen Analogien aus dem Alltag
- Bauen schrittweise auf
- Enthalten praktische Beispiele`,
    variants: {
      default: `Erkläre das Konzept "{{concept}}" für jemanden auf {{level}}-Level.

Struktur:
1. Was ist es? (1-2 Sätze)
2. Warum ist es wichtig?
3. Alltagsanalogie
4. Einfaches Code-Beispiel
5. Häufige Missverständnisse
6. Weiterführende Ressourcen`,
    },
    body: `## Lernmethodik

Feynman-Technik: Wenn du es nicht einfach erklären kannst, verstehst du es nicht gut genug.`,
    shortExcerpt: 'Erklärt technische Konzepte verständlich mit Analogien und Beispielen.',
    updatedDate: '2024-12-05',
  },
  {
    id: 'git-workflow-helper',
    title: 'Git Workflow Helfer',
    category: 'Ship',
    tags: ['Git', 'Versionierung', 'Workflow'],
    related_prompts: ['deployment-checklist'],
    dependencies: ['git'],
    complexity: 'beginner',
    agent_role: 'Git-Experte',
    variables: [
      { name: 'scenario', label: 'Szenario/Problem' },
    ],
    changelog: [
      { date: '2024-12-11', note: 'Erste Version' },
      { date: '2024-12-15', note: 'Rebase vs Merge Szenarien' },
    ],
    pre_prompt: `Du bist ein Git-Experte der hilft, komplexe Git-Situationen zu lösen.
Du erklärst:
- Den aktuellen Zustand
- Die sicherste Lösung
- Was die Befehle bewirken`,
    variants: {
      default: `Hilf mir bei folgendem Git-Szenario:

{{scenario}}

Gib mir:
1. Analyse der Situation
2. Schritt-für-Schritt Lösung
3. Erklärung jedes Befehls
4. Präventionsmaßnahmen für die Zukunft`,
      beginner: `Ich bin Git-Anfänger und habe folgendes Problem:
{{scenario}}

Erkläre mir wie ein Lehrer, was passiert ist und wie ich es lösen kann.`,
    },
    body: `## Häufige Szenarien

- Falscher Commit auf main
- Merge-Konflikte auflösen
- Commit History aufräumen
- Lost commits wiederherstellen`,
    shortExcerpt: 'Löst Git-Probleme mit klaren Erklärungen und sicheren Befehlen.',
    updatedDate: '2024-12-15',
  },
];

function generateMarkdown(prompt) {
  // Extract body and remove it from frontmatter data
  const { body, ...frontmatterData } = prompt;
  
  // Format variables array to YAML string
  const variablesYaml = frontmatterData.variables.map(v => {
    return `  - name: ${v.name}
    label: ${v.label}
    default: ${v.default ? `"${v.default}"