---
title: "Sicherheit in Lovable: Fallstricke vermeiden"
description: "Ein Leitfaden zur Vermeidung gängiger Sicherheitsfehler in Lovable-Apps – von Frontend-Geheimnissen bis hin zu Row Level Security (RLS)."
category: security
icon: Lock
readTime: 10 Min
---

> **Original-Quelle:** [Lovable Documentation](https://docs.lovable.dev/tips-tricks/avoiding-security-pitfalls)

Obwohl Lovable und Tools wie der Security Checker viele Probleme automatisch finden, liegt die Verantwortung für den Schutz von Kundendaten letztlich beim Builder. Dieser Guide erklärt die Architektur von Lovable-Apps und wie man typische Sicherheitsfehler vermeidet.

## Die Architektur verstehen

Standardmäßig generiert Lovable Apps mit folgendem Aufbau:
*   **Frontend:** TypeScript/React App.
*   **Backend:** Supabase Edge Functions (serverlos).
*   **Datenbank:** Supabase (PostgreSQL).

Diese Trennung ist die Basis für Sicherheit. Jede Schicht hat eigene Anforderungen.

## Frontend-Sicherheit: Vertraue niemals dem Client

**Die goldene Regel:** Alles im Frontend (React-Code) ist öffentlich einsehbar. Nutzer können Code im Browser inspizieren, modifizieren oder umgehen.

*   **Keine Geheimnisse im Frontend:** Speichere niemals API-Keys, Passwörter oder sensible Konfigurationen direkt im Code.
*   **Keine Validierung nur im Frontend:** Client-seitige Prüfungen können umgangen werden. Validierung muss immer im Backend erfolgen.
*   **Frontend-Daten sind unsicher:** Verarbeite Daten aus dem Frontend im Backend immer als "unvertrauenswürdig".

### Falsch vs. Richtig
```typescript
// ❌ FALSCH - NIEMALS MACHEN
const API_KEY = "sk-1234567890abcdef"; // Öffentlich einsehbar!

// ✅ RICHTIG
// Bitte Lovable, einen Secret Key hinzuzufügen. 
// Er wird sicher im Lovable-Backend gespeichert und nicht im Frontend-Code exponiert.
```

## Backend-Sicherheit: Business-Logik in Edge Functions

Nutzen Sie Supabase Edge Functions als Ihre API-Schicht. Hier sollten sensible Operationen stattfinden:
*   Authentifizierung und Autorisierung.
*   Datenvalidierung und Bereinigung (Sanitization).
*   Integration externer Dienste (z. B. Stripe, E-Mail-Provider).
*   Verarbeitung sensibler Daten (Verschlüsselung, Logging).

## Datenbank-Sicherheit: Row Level Security (RLS)

RLS bestimmt, wer welche Daten sehen oder ändern darf.

*   **Frühzeitige Prüfung:** Es ist einfacher, RLS-Policies zu Beginn festzulegen als bei einer produktiven Datenbank.
*   **Einfachheit gewinnt:** Halten Sie Policies simpel. Lovables Standard-Policies sind meist ein guter Startpunkt.
*   **Checkliste:**
    *   Haben alle sensiblen Tabellen RLS aktiviert?
    *   Können Nutzer nur auf ihre eigenen Profildaten zugreifen?
    *   Haben Team-Daten korrekte Zugriffskontrollen?
    *   Sind neue Tabellen automatisch geschützt?

## Authentifizierung: Server-seitig prüfen

Alle Entscheidungen über Authentifizierung und Rollen müssen auf dem Server fallen.

```typescript
// ✅ KORREKT: Prüfung in der Edge Function
const { user } = await supabase.auth.getUser();
if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

## Workspace-Schutz für interne Apps

Für interne Tools, die nicht öffentlich sein sollen:
*   Stellen Sie die **Visibility** in den Projekteinstellungen auf **"Workspace"**.
*   Stellen Sie sicher, dass die App nicht veröffentlicht ("published") wurde.

## Security Checker nutzen

Lovable verfügt über einen eingebauten **Security Checker**. Nutzen Sie ihn vor jeder Veröffentlichung:
1.  Führen Sie den Checker im Dashboard aus.
2.  Prüfen Sie alle Empfehlungen sorgfältig.
3.  Implementieren Sie die Fixes sofort.
4.  Lassen Sie den Checker erneut laufen.

Sicherheit ist kein einmaliger Task, sondern ein fortlaufender Prozess.
