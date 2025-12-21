'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Compass, Code2, Database, Cloud, Palette, Terminal, Boxes, Rocket, Zap, Brain } from 'lucide-react';

const toolCategories = [
  {
    name: 'Development Platforms',
    tools: [
      { name: 'Lovable', description: 'AI-gestützte Full-Stack Entwicklungsplattform.', url: 'https://lovable.dev', icon: Rocket },
      { name: 'Cursor', description: 'AI-first Code Editor basierend auf VS Code.', url: 'https://cursor.sh', icon: Terminal },
      { name: 'v0.dev', description: 'AI UI Generator von Vercel.', url: 'https://v0.dev', icon: Zap },
      { name: 'Bolt.new', description: 'Schnelle Full-Stack App Entwicklung.', url: 'https://bolt.new', icon: Code2 },
      { name: 'Gitingest', description: 'Ersetzt \'hub\' durch \'ingest\' in GitHub-URLs fuer prompt-freundlichen Text.', url: 'https://gitingest.com/', icon: Terminal },
      { name: 'Devin', description: 'AI coding agent fuer Softwareentwicklung in Teams.', url: 'https://devin.ai/', icon: Rocket },
      { name: 'Gemini CLI Extensions', description: 'Erweiterungen fuer die Gemini CLI.', url: 'https://geminicli.com/extensions/', icon: Terminal },
      { name: 'Windsurf', description: 'AI Coding Assistant und AI-native IDE fuer Entwickler und Teams.', url: 'https://windsurf.com/', icon: Rocket },
      { name: 'Google Antigravity', description: 'Google Antigravity - Build the new way.', url: 'https://antigravity.google/', icon: Rocket },
      { name: 'AI Tmpl', description: 'Templates und Konfigurationen fuer Claude Code.', url: 'https://www.aitmpl.com/', icon: Terminal },
      { name: 'OpenHands', description: 'Open-source Plattform fuer Cloud Coding Agents, model-agnostisch.', url: 'https://openhands.dev/', icon: Rocket },
      { name: 'GitHub Copilot', description: 'AI Pair Programmer im Editor mit Vorschlaegen fuer Codezeilen und Funktionen.', url: 'https://github.com/features/copilot', icon: Terminal },
      { name: 'OpenCode', description: 'Open-source Coding Agent.', url: 'https://opencode.ai/', icon: Terminal },
    ],
  },
  {
    name: 'Backend & Database',
    tools: [
      { name: 'Supabase', description: 'Open Source Firebase Alternative mit PostgreSQL.', url: 'https://supabase.com', icon: Database },
      { name: 'Resend', description: 'Email API fuer transaktionale und Marketing-Emails mit hoher Zustellbarkeit.', url: 'https://resend.com/', icon: Cloud },
      { name: 'FastAPI', description: 'Python Webframework fuer schnelle APIs, produktionsreif und leicht zu lernen.', url: 'https://fastapi.tiangolo.com/', icon: Code2 },
      { name: 'Better Auth', description: 'Umfassendes Auth-Framework fuer TypeScript.', url: 'https://www.better-auth.com/', icon: Code2 },
    ],
  },
  {
    name: 'Hosting & Deployment',
    tools: [
      { name: 'Vercel', description: 'Hosting-Plattform für Frontend-Frameworks.', url: 'https://vercel.com', icon: Cloud },
      { name: 'Netlify', description: 'Plattform für moderne Webanwendungen.', url: 'https://netlify.com', icon: Cloud },
      { name: 'Railway', description: 'Einfaches Deployment für Apps.', url: 'https://railway.app', icon: Cloud },
      { name: 'Coolify', description: 'Self-hosted Plattform zum Deployen von Apps, Datenbanken und Services.', url: 'https://coolify.io/', icon: Cloud },
    ],
  },
  {
    name: 'Design & Prototyping',
    tools: [
      { name: 'Figma', description: 'Kollaboratives Design-Tool für UI/UX.', url: 'https://figma.com', icon: Palette },
      { name: 'Framer', description: 'Design und publish interaktive Websites.', url: 'https://framer.com', icon: Palette },
      { name: 'RealFaviconGenerator', description: 'Favicon Generator fuer alle Plattformen und Browser.', url: 'https://realfavicongenerator.net/', icon: Palette },
      { name: 'assistant-ui', description: 'TypeScript/React UI Library fuer AI Chat Interfaces.', url: 'https://www.assistant-ui.com/', icon: Boxes },
      { name: 'Tool UI', description: 'UI Komponenten fuer AI Tool Calls.', url: 'https://www.tool-ui.com/', icon: Boxes },
      { name: 'dnd kit', description: 'React Toolkit fuer Drag-and-Drop Interfaces.', url: 'https://next.dndkit.com/overview', icon: Code2 },
    ],
  },
  {
    name: 'AI & APIs',
    tools: [
      { name: 'OpenAI', description: 'GPT Modelle und mehr.', url: 'https://platform.openai.com/api-keys', icon: Brain },
      { name: 'Replicate', description: 'Open Source AI Modelle hosten.', url: 'https://replicate.com', icon: Brain },
      { name: 'OpenRouter', description: 'Router fuer LLMs und andere AI-Modelle.', url: 'https://openrouter.ai/', icon: Brain },
      { name: 'ElevenLabs', description: 'KI-Voice Generator und Voice Agents mit APIs, SDKs und vielen Stimmen.', url: 'https://elevenlabs.io/', icon: Brain },
      { name: 'NotebookLM', description: 'KI-Recherchetool, das eigene Quellen analysiert und zusammenfasst.', url: 'https://notebooklm.google.com/', icon: Brain },
      { name: 'Google AI Studio', description: 'Schneller Weg von Prompt zu Produktion mit Gemini.', url: 'https://aistudio.google.com/', icon: Brain },
      { name: 'LM Arena (WebDev)', description: 'Leaderboard zum Vergleich von WebDev-Modellen in der Code Arena.', url: 'https://lmarena.ai/de/leaderboard/webdev', icon: Brain },
      { name: 'CodeWiki', description: 'Gemini-generierte Repo-Dokumentation, stets aktuell.', url: 'https://codewiki.google/', icon: Code2 },
      { name: 'DeepWiki', description: 'Talk-to-docs fuer jedes Repo, AI-Dokumentation auf Abruf.', url: 'https://deepwiki.com/', icon: Brain },
      { name: 'Anthropic Console', description: 'Console fuer API Keys und Settings von Anthropic.', url: 'https://console.anthropic.com/settings/keys', icon: Terminal },
      { name: 'DeepSeek API', description: 'API Plattform fuer DeepSeek Modelle und Entwicklerressourcen.', url: 'https://platform.deepseek.com/api_keys', icon: Brain },
      { name: 'Brave Search API', description: 'Web Search API mit eigenem Index und Echtzeit-Updates.', url: 'https://api-dashboard.search.brave.com/app/dashboard', icon: Brain },
      { name: 'SerpApi', description: 'Google Search API mit Proxy-Handling, Captcha-Loesung und Parsing.', url: 'https://serpapi.com/', icon: Brain },
      { name: 'LangChain', description: 'Engineering-Plattform und Open-Source-Frameworks fuer AI Agents.', url: 'https://www.langchain.com/', icon: Brain },
    ],
  },
  {
    name: 'Chatbots',
    tools: [
      { name: 'Gemini', description: 'Google Gemini App fuer KI-Chat und Aufgaben.', url: 'https://gemini.google.com/app', icon: Brain },
      { name: 'ChatGPT', description: 'OpenAI Chatbot fuer KI-gestuetzte Konversationen.', url: 'https://chatgpt.com', icon: Brain },
      { name: 'Claude', description: 'Anthropic Chatbot fuer KI-gestuetzte Assistenz.', url: 'https://claude.ai/', icon: Brain },
      { name: 'Grok', description: 'xAI Chatbot fuer KI-gestuetzte Konversationen.', url: 'https://grok.com', icon: Brain },
    ],
  },
];

export default function ToolDirectoryPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" />
          Tool Directory
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Essenzielle Tools für moderne Webentwicklung.
        </p>
      </motion.div>

      {toolCategories.map((category, catIndex) => (
        <motion.section
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.tools.map((tool, index) => (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 + index * 0.03 }}
                className="group block"
              >
                <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                  <div className="mb-3 flex items-center gap-3">
                    <tool.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Öffnen
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
