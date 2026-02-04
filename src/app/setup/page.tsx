'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetupItem {
  title: string;
  url: string;
  summary: string;
  labels: string[];
}

const setupItems: SetupItem[] = [
  {
    title: "Claude Code: Installation",
    url: "https://code.claude.com/docs/en/setup#installation",
    summary: "Installieren, authentifizieren und starten Sie Claude Code auf Ihrer Entwicklungsmaschine. Umfasst native Installation (macOS, Linux, WSL, Windows), Authentifizierungsmethoden und Updates.",
    labels: ["Claude Code", "Installation", "Administration"],
  },
  {
    title: "Claude Code: Enterprise network configuration",
    url: "https://code.claude.com/docs/en/network-config",
    summary: "Konfigurieren Sie Claude Code für Unternehmensumgebungen mithilfe von Umgebungsvariablen zur Unterstützung von Proxyservern, benutzerdefinierten Zertifizierungsstellen (CA) und gegenseitiger TLS-Authentifizierung (mTLS) für eine sichere Netzwerkkommunikation.",
    labels: ["Claude Code", "Networking", "Security", "Configuration"],
  },
  {
    title: "Claude Code on Microsoft Foundry",
    url: "https://code.claude.com/docs/en/microsoft-foundry",
    summary: "Konfigurieren Sie Claude Code für Microsoft Foundry, einschließlich der Bereitstellung von Ressourcen, der Einrichtung von Azure-Anmeldeinformationen und der Fehlerbehebung.",
    labels: ["Claude Code", "Deployment", "Authentication", "Azure"],
  },
  {
    title: "Claude Code: Einrichtung von Single Sign-On (SSO)",
    url: "https://support.claude.com/de/articles/13132885-einrichtung-von-single-sign-on-sso",
    summary: "Schritt-für-Schritt-Anleitung zur Einrichtung von SSO für Team- und Enterprise-Pläne sowie Claude Console-Organisationen, einschließlich Domain-Verifizierung und IdP-Konfiguration.",
    labels: ["Claude Code", "Authentication", "SSO", "Security", "Administration"],
  },
  {
    title: "Claude Code: Sandboxing",
    url: "https://code.claude.com/docs/en/sandboxing",
    summary: "Konfigurieren Sie die Sandboxing-Umgebung von Claude Code für eine sicherere und autonomere Agentenausführung durch Dateisystem- und Netzwerkisolierung.",
    labels: ["Claude Code", "Security", "Configuration", "Docker"],
  },
  {
    title: "Claude Code: Troubleshooting",
    url: "https://code.claude.com/docs/en/troubleshooting",
    summary: "Lösungen für häufige Probleme bei der Installation, Authentifizierung und Nutzung von Claude Code, einschließlich Fehlerbehebung bei Berechtigungen und Netzwerkkonfiguration.",
    labels: ["Claude Code", "Troubleshooting", "Support", "Configuration"],
  },
  {
    title: "Claude Code: Settings Reference",
    url: "https://code.claude.com/docs/en/settings",
    summary: "Detaillierte Referenz zu Claude Code Einstellungen, Scopes (Managed, User, Project, Local) und deren Priorisierung. Behandelt Berechtigungen, Sandboxing, Hooks sowie die Konfiguration über settings.json für Einzelpersonen und Teams.",
    labels: ["Claude Code", "Configuration", "Administration", "Security"],
  },
  {
    title: "Claude Code: Configure Permissions",
    url: "https://code.claude.com/docs/en/permissions",
    summary: "Verwalten Sie detaillierte Berechtigungsregeln für Tools (Bash, Read, Edit, WebFetch). Erfahren Sie mehr über Berechtigungsmodi, Regelsyntax mit Wildcards und die Durchsetzung von Richtlinien über verwaltete Einstellungen.",
    labels: ["Claude Code", "Security", "Administration", "Configuration"],
  },
  {
    title: "Claude Code: Monitoring and Observability",
    url: "https://code.claude.com/docs/en/monitoring-usage",
    summary: "Aktivieren und konfigurieren Sie OpenTelemetry für Claude Code, um Metriken und Ereignisse zu überwachen. Erfahren Sie mehr über Exporter (OTLP, Prometheus), Kardinalitätskontrolle und Multi-Team-Unterstützung.",
    labels: ["Claude Code", "Monitoring", "Administration", "Networking"],
  },
  {
    title: "Codex: Security and Management",
    url: "https://developers.openai.com/codex/security?utm_source=chatgpt.com",
    summary: "Erfahren Sie, wie Sie Codex-Agenten sicher betreiben. Der Guide behandelt Sandbox-Modi, Genehmigungsrichtlinien, Netzwerkzugriffskontrollen und die zentrale Verwaltung über Anforderungen und verwaltete Konfigurationen für Unternehmen.",
    labels: ["Codex", "Security", "Administration", "Networking"],
  },
  {
    title: "Codex: Azure OpenAI Integration Guide",
    url: "https://devblogs.microsoft.com/all-things-azure/codex-azure-openai-integration-fast-secure-code-development/",
    summary: "Der Guide beschreibt die Integration von Codex in die Azure OpenAI-Infrastruktur für sichere, unternehmensgerechte Code-Entwicklung. Er umfasst Deployment-Schritte in Azure AI Foundry, CLI-Konfiguration, VS Code-Integration und die Nutzung von AGENTS.md für projektspezifischen Kontext.",
    labels: ["Codex", "Azure", "Security", "Deployment", "Administration"],
  },
  {
    title: "Codex with Azure OpenAI in Microsoft Foundry",
    url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/codex?view=foundry-classic&tabs=npm",
    summary: "Diese Anleitung von Microsoft Learn erklärt die Einrichtung von Codex in Azure AI Foundry. Sie umfasst die Modell-Bereitstellung, CLI-Installation, Konfiguration der config.toml für Azure OpenAI sowie die Integration in VS Code und GitHub Actions.",
    labels: ["Codex", "Azure", "Deployment", "Administration", "GitHub Actions"],
  },
  {
    title: "Codex: Configuration Reference",
    url: "https://developers.openai.com/codex/config-reference",
    summary: "Vollständige Referenz für die Konfigurationsdateien von Codex (config.toml und requirements.toml). Enthält Details zu Genehmigungsrichtlinien, Sandbox-Modi, MCP-Server-Einstellungen und administrativen Einschränkungen.",
    labels: ["Codex", "Configuration", "Administration"],
  },
  {
    title: "Codex: Advanced Configuration",
    url: "https://developers.openai.com/codex/config-advanced",
    summary: "Fortgeschrittene Konfiguration für Codex: Profile, CLI-Overrides, projektspezifische Einstellungen und Unterstützung für eigene Modell-Provider oder OSS-Modelle (Ollama). Behandelt Shell-Umgebungsrichtlinien, Telemetrie über OpenTelemetry sowie persistente Historie und TUI-Anpassungen.",
    labels: ["Codex", "Configuration", "Advanced", "Administration"],
  },
  {
    title: "Codex: Changelog",
    url: "https://developers.openai.com/codex/changelog",
    summary: "Bleiben Sie über die neuesten Updates für Codex auf dem Laufenden. Der Changelog dokumentiert neue Funktionen wie die Codex-App für macOS, CLI-Releases, Team-Konfigurationen, Agent Skills und die Einführung neuer GPT-5-basierter Modelle.",
    labels: ["Codex", "Releases", "Administration"],
  },
  {
    title: "Lovable: Single Sign-On (SSO) Setup",
    url: "https://docs.lovable.dev/features/business/sso",
    summary: "Konfigurieren Sie OIDC oder SAML 2.0 basierte Authentifizierung für Ihren Lovable Business- oder Enterprise-Workspace. Die Anleitung umfasst die Domain-Verifizierung sowie Konfigurationsdetails für gängige Identity Provider wie Okta, Auth0 und Entra ID.",
    labels: ["Lovable", "Authentication", "SSO", "Security"],
  },
  {
    title: "Lovable: Changelog",
    url: "https://docs.lovable.dev/changelog",
    summary: "Bleiben Sie über die neuesten Updates für Lovable auf dem Laufenden. Der Changelog dokumentiert neue Funktionen wie die Unterstützung für GPT-5.2 und Gemini 3 Flash, Zwei-Faktor-Authentifizierung (2FA), Build-Credit-Top-ups und verbesserte Dashboard-Organisation.",
    labels: ["Lovable", "Releases", "Administration"],
  },
  {
    title: "Gemini CLI: Changelog",
    url: "https://geminicli.com/docs/changelogs/",
    summary: "Bleiben Sie über die neuesten Updates für das Gemini CLI informiert. Der Changelog dokumentiert neue Versionen, Agent Skills, Erweiterungen und Sicherheitsverbesserungen wie den Policy Engine.",
    labels: ["Gemini CLI", "Releases", "Administration"],
  },
  {
    title: "Claude Code: Changelog",
    url: "https://claudelog.com/claude-code-changelog/",
    summary: "Verfolgen Sie die Entwicklung von Claude Code. Der Changelog enthält Details zu neuen CLI-Funktionen, MCP-Tool-Berechtigungen, Bugfixes und Verbesserungen der Agenten-Autonomie.",
    labels: ["Claude Code", "Releases", "Administration"],
  }
];

export default function SetupPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Extract unique labels
  const allLabels = Array.from(new Set(setupItems.flatMap(item => item.labels))).sort();
  const filterLabels = ['all', ...allLabels];

  const toggleLabel = (label: string) => {
    if (label === 'all') {
      setSelectedLabels([]);
      return;
    }
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const filteredItems = setupItems.filter((item) => {
    const matchesLabel = selectedLabels.length === 0 || item.labels.some(l => selectedLabels.includes(l));
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Settings2 className="h-8 w-8 text-primary" />
          Setup
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tutorials, Guides und Informationen zur professionellen Einrichtung von Agentic Coding Tools in Unternehmen.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Setup Guides durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {filterLabels.map((label) => (
          <button
            key={label}
            onClick={() => toggleLabel(label)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors capitalize',
              (label === 'all' ? selectedLabels.length === 0 : selectedLabels.includes(label))
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {label === 'all' ? 'Alle' : label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filteredItems.map((item, index) => (
          <motion.a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="block group"
          >
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
