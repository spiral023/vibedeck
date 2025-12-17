---
id: react-component-generator
title: "React Komponenten Generator"
category: Build
complexity: intermediate
tags: ["React","TypeScript","Komponenten"]
related_prompts: ["typescript-interface-builder"]
dependencies: ["react","typescript"]
agent_role: "Senior React Entwickler"
shortExcerpt: "Generiert typsichere React-Komponenten mit Best Practices und Accessibility-Support."
updatedDate: "2024-12-17"
variables:
  - name: componentName
    label: Komponentenname
    default: "MyComponent"
  - name: props
    label: Props Definition
    default: null
changelog:
  - date: "2024-12-15"
    note: "Initiale Version erstellt"
  - date: "2024-12-17"
    note: "TypeScript strict mode Unterstützung hinzugefügt"
pre_prompt: |
  Du bist ein erfahrener React-Entwickler mit Fokus auf Clean Code und Best Practices. 
  Du erstellst Komponenten, die:
  - TypeScript strict mode kompatibel sind
  - Accessible (WCAG 2.1 AA) sind
  - Performance-optimiert sind
variants:
  default: |
    Erstelle eine React-Komponente namens {{componentName}} mit folgenden Props: {{props}}
    
    Anforderungen:
    - Verwende TypeScript mit strikten Typen
    - Implementiere React.memo wenn sinnvoll
    - Füge JSDoc Kommentare hinzu
    - Exportiere Props Interface separat
  beginner: |
    Erstelle eine einfache React-Komponente namens {{componentName}}.
    Erkläre jeden Teil des Codes mit Kommentaren.
  expert: |
    Erstelle eine hochoptimierte React-Komponente {{componentName}} mit:
    - Generics für flexible Typisierung
    - Compound Component Pattern
    - Custom Hooks für Logik-Abstraktion
    - Render Props API

---

## Zusätzliche Hinweise

Diese Prompt-Vorlage eignet sich besonders für:
- Wiederverwendbare UI-Komponenten
- Form-Elemente
- Layout-Komponenten

### Beispiel Output

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = memo(({ variant, children }) => {
  return <button className={styles[variant]}>{children}</button>;
});
```
