---
title: 'Git HELP.md'
domain: 'Versionierung'
tags: ['Git', 'Version Control', 'Workflow']
variables:
  - name: 'main_branch'
    label: 'Hauptbranch'
    default: 'main'
    placeholder: 'main oder master'
  - name: 'feature_prefix'
    label: 'Feature Branch Prefix'
    default: 'feature/'
    placeholder: 'z.B. feat/'
  - name: 'commit_style'
    label: 'Commit Style'
    default: 'Conventional Commits'
    placeholder: 'z.B. Angular'
notes: 'Diese Konventionen helfen bei der Zusammenarbeit im Team. Passe sie an eure Workflows an.'
updatedDate: '2024-12-14'
---

# Git Workflow Guide

## Branch-Strategie

- **{{main_branch}}**: Produktionscode, immer stabil
- **develop**: Integration von Features
- **{{feature_prefix}}***: Neue Features

## Neues Feature starten

```bash
git checkout {{main_branch}}
git pull origin {{main_branch}}
git checkout -b {{feature_prefix}}mein-feature
```

## Commit Convention ({{commit_style}})

```
<type>(<scope>): <beschreibung>

[optionaler body]

[optionaler footer]
```

### Types:
- **feat**: Neues Feature
- **fix**: Bugfix
- **docs**: Dokumentation
- **style**: Formatierung
- **refactor**: Code-Refactoring
- **test**: Tests hinzufügen/ändern
- **chore**: Wartungsarbeiten

## Feature mergen

```bash
git checkout {{main_branch}}
git merge --no-ff {{feature_prefix}}mein-feature
git push origin {{main_branch}}
git branch -d {{feature_prefix}}mein-feature
```

## Häufige Probleme

### Merge-Konflikte auflösen
```bash
git status                    # Konflikte anzeigen
# Dateien manuell bearbeiten
git add <datei>
git commit
```

### Letzten Commit korrigieren
```bash
git commit --amend
```

### Änderungen temporär speichern
```bash
git stash
git stash pop
```
