<div align="center">

# 🎨 VibeDeck

### AI Prompt Engineering Studio

Eine zentrale Plattform für Prompt-Management, Workflows und KI-Ressourcen

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Verwendung](#-verwendung) • [Dokumentation](#-dokumentation) • [Mitwirken](#-mitwirken)

</div>

---

## 📋 Über VibeDeck

VibeDeck ist ein modernes **AI Prompt Engineering Studio**, das dir hilft:

- 🎯 **Prompt-Bibliothek**: Durchsuchbare Sammlung vorgefertigter KI-Prompts
- ⚙️ **Prompt-Builder**: Individuelle Prompts mit Variablen erstellen
- 🏭 **Prompt-Factory**: Prompts nach bewährten Patterns generieren
- 🔄 **Workflows**: Mehrstufige KI-Workflows für komplexe Aufgaben
- 📚 **Ressourcen**: Tool-Verzeichnis, UI-Bibliotheken und Wissensdatenbank
- 💾 **Verlauf**: Alle Prompt-Aktionen werden lokal gespeichert
- 🌓 **Dark Mode**: Vollständiger Dark/Light Theme Support

---

## ✨ Features

### 🎯 Prompt-Verwaltung

- **Kategorisierung**: Build, Browse, Ship, Learn
- **Schwierigkeitsgrade**: Beginner, Intermediate, Expert
- **Variablen-System**: Dynamische Platzhalter wie `{{componentName}}`
- **Globale Variablen**: Stack, Projektname, Sprache projekt-übergreifend
- **Favoriten & Erledigt**: Prompts markieren und filtern
- **Token-Zähler**: GPT-Token-Schätzung für jeden Prompt

### 🔍 Leistungsstarke Suche

- **Fuzzy Search**: Intelligente Suche mit Fuse.js
- **Filter**: Nach Kategorie, Tags, Komplexität, Status
- **URL-Persistence**: Filter-Status wird in URL gespeichert
- **Echtzeit-Updates**: Sofortige Ergebnisse beim Filtern

### 🛠️ Entwickler-Features

- **Command Palette**: Schnellzugriff mit `Cmd+K` / `Ctrl+K`
- **Copy-Formate**: Markdown, JSON, Raw Text
- **Export-Funktionen**: Prompts und Einstellungen exportieren
- **Rules Generator**: Projektregeln für Cursor/Windsurf generieren
- **Syntax Highlighting**: Code-Blöcke mit Shiki

### 💾 Daten & Speicherung

- **Client-Side Only**: Keine Backend-Abhängigkeiten
- **localStorage**: Alle Einstellungen lokal gespeichert
- **Markdown-basiert**: Prompts als `.md` Dateien
- **TypeScript Strict**: Volle Typsicherheit mit Zod

---

## 🚀 Installation

### Voraussetzungen

- Node.js 18+ und npm
- (Optional) [nvm](https://github.com/nvm-sh/nvm) für Node.js-Versionsverwaltung

### Schnellstart

```bash
# Repository klonen
git clone <YOUR_GIT_URL>
cd vibedeck

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) verfügbar.

### Build für Produktion

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

---

## 💻 Verwendung

### Prompts durchsuchen

1. Navigiere zur **Prompt-Bibliothek**
2. Nutze Filter für Kategorie, Tags oder Komplexität
3. Suche mit der Suchleiste (Fuzzy Search)
4. Klicke auf einen Prompt für Details

### Prompt verwenden

1. Öffne Prompt-Details
2. Fülle Variablen aus (z.B. `{{componentName}}`)
3. Wähle Komplexitäts-Variante (Beginner/Default/Expert)
4. Kopiere mit gewünschtem Format (Markdown/Raw/JSON)
5. Nutze in deinem KI-Tool (ChatGPT, Claude, etc.)

### Eigene Prompts erstellen

Erstelle eine neue `.md` Datei in `src/content/prompts/`:

```yaml
---
id: mein-prompt
title: "Mein Custom Prompt"
category: Build
complexity: intermediate
tags: ["Custom", "TypeScript"]
agent_role: "Senior Developer"
variables:
  - name: variableName
    label: Variable Label
    default: "Standardwert"
pre_prompt: |
  Du bist ein Experte für...
variants:
  default: |
    Erstelle {{variableName}} mit folgenden Anforderungen...
---

## Zusätzliche Dokumentation

Hier können weitere Erklärungen stehen.
```

Kein Code-Change nötig - Prompt wird automatisch erkannt!

### Globale Variablen setzen

1. Gehe zu **Einstellungen**
2. Definiere globale Variablen:
   - `global_stack`: Dein Tech-Stack
   - `global_project_name`: Projektname
   - `global_language`: Bevorzugte Sprache
3. Nutze in Prompts mit `{{global_stack}}`

---

## 📖 Dokumentation

### Architektur

VibeDeck nutzt Next.js 16 App Router mit klarer Server/Client Trennung:

```
Server Components (page.tsx)
├── Laden Markdown-Prompts
└── Übergeben Daten an Client Components

Client Components (client.tsx)
├── User Interaktionen
├── Zustand mit Zustand
└── localStorage Persistence
```

### Wichtige Verzeichnisse

```
src/
├── app/              # Next.js Routes (18 Seiten)
├── components/       # React Components
│   ├── layout/      # Sidebar, Navigation
│   ├── prompts/     # Prompt-spezifische Components
│   └── ui/          # shadcn/ui Components
├── content/
│   └── prompts/     # Markdown Prompt-Dateien
├── stores/          # Zustand State Management
├── lib/             # Utilities (copy, token, search)
├── types/           # TypeScript Definitionen
└── data/            # Statische Daten (Workflows)
```

### State Management

Vier Zustand Stores mit localStorage:

- **settings-store**: Theme, Sprache, globale Variablen
- **theme-store**: Dark/Light Mode
- **history-store**: Aktionsverlauf (max. 100 Einträge)
- **prompt-status-store**: Favoriten, Erledigt-Status

Detaillierte Architektur-Dokumentation in [`CLAUDE.md`](CLAUDE.md).

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><b>Framework</b></td>
<td>Next.js 16 (App Router), React 18</td>
</tr>
<tr>
<td align="center"><b>Sprache</b></td>
<td>TypeScript 5.8 (Strict Mode)</td>
</tr>
<tr>
<td align="center"><b>Styling</b></td>
<td>Tailwind CSS 3.4, shadcn/ui (Radix UI)</td>
</tr>
<tr>
<td align="center"><b>State</b></td>
<td>Zustand 5.0 mit localStorage</td>
</tr>
<tr>
<td align="center"><b>Forms</b></td>
<td>React Hook Form + Zod Validation</td>
</tr>
<tr>
<td align="center"><b>Animation</b></td>
<td>Framer Motion 12</td>
</tr>
<tr>
<td align="center"><b>Search</b></td>
<td>Fuse.js (Fuzzy Search)</td>
</tr>
<tr>
<td align="center"><b>Data</b></td>
<td>Gray Matter (YAML), GPT Tokenizer</td>
</tr>
<tr>
<td align="center"><b>Code Highlight</b></td>
<td>Shiki 3.20</td>
</tr>
</table>

---

## 🤝 Mitwirken

Beiträge sind willkommen! Hier ist wie:

### Neue Prompts hinzufügen

1. Fork das Repository
2. Erstelle `.md` Datei in `src/content/prompts/`
3. Folge dem Schema (siehe [Verwendung](#eigene-prompts-erstellen))
4. Teste lokal mit `npm run dev`
5. Erstelle Pull Request

### Code-Beiträge

1. Fork das Repository
2. Erstelle Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Befolge TypeScript Strict Mode
4. Teste alle Änderungen
5. Commit (`git commit -m 'Add AmazingFeature'`)
6. Push (`git push origin feature/AmazingFeature`)
7. Öffne Pull Request

### Richtlinien

- **TypeScript**: Strict Mode, keine `any` types
- **Components**: Server/Client Trennung beachten
- **Styling**: Nur Tailwind CSS, keine custom CSS
- **State**: Zustand für globalen State, React State für lokalen
- **Prompts**: YAML Schema strikt einhalten

---

## 📝 Scripts

```bash
npm run dev      # Development Server (Port 3000)
npm run build    # Production Build
npm start        # Production Server
npm run lint     # ESLint prüfen
```

---

## 🔒 Datenschutz

VibeDeck speichert **alle Daten lokal** in deinem Browser:

- ✅ Keine Backend-Server
- ✅ Keine Datenübertragung
- ✅ Keine Cookies von Drittanbietern
- ✅ Volle Datenkontrolle

Alle Einstellungen, Favoriten und Historie sind in localStorage gespeichert.

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe LICENSE Datei für Details.

---

## 🙏 Danksagungen

Gebaut mit:

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Radix UI](https://www.radix-ui.com/) - Accessible Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS
- [Zustand](https://github.com/pmndrs/zustand) - State Management
- [Framer Motion](https://www.framer.com/motion/) - Animationen
- [Lucide Icons](https://lucide.dev/) - Icon Set

---

<div align="center">

**[⬆ Nach oben](#-vibedeck)**

Erstellt mit ❤️ für die AI Community

</div>
