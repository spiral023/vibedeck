'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Box, Cloud, Brain, Type, Image, Code2, Cog, Bot, Server, FileText, Plug, Container } from 'lucide-react';

const repos = [
  {
    name: 'awesome-shadcn-ui',
    description: 'Kuratierte Liste von fantastischen shadcn/ui Ressourcen, Bibliotheken und Tools.',
    url: 'https://github.com/birobirobiro/awesome-shadcn-ui',
    category: 'UI',
    icon: Box,
    author: 'birobirobiro',
  },
  {
    name: 'awesome-aws',
    description: 'Umfassende Liste von AWS-Bibliotheken, Open Source Repos, Guides und Blogs.',
    url: 'https://github.com/donnemartin/awesome-aws',
    category: 'Cloud',
    icon: Cloud,
    author: 'donnemartin',
  },
  {
    name: 'awesome-llm-apps',
    description: 'Sammlung von LLM-Apps mit RAG, AI Agents und mehr, gebaut mit OpenAI, Anthropic, Gemini.',
    url: 'https://github.com/Shubhamsaboo/awesome-llm-apps',
    category: 'AI/LLM',
    icon: Brain,
    author: 'Shubhamsaboo',
  },
  {
    name: 'awesome-fonts',
    description: 'Kuratierte Liste von Fonts und Typografie-Ressourcen.',
    url: 'https://github.com/brabadu/awesome-fonts',
    category: 'Design',
    icon: Type,
    author: 'brabadu',
  },
  {
    name: 'awesome-icons',
    description: 'Kuratierte Liste von Icon-Bibliotheken und Icon-Ressourcen.',
    url: 'https://github.com/vkarampinis/awesome-icons',
    category: 'Icons',
    icon: Image,
    author: 'vkarampinis',
  },
  {
    name: 'awesome-regex',
    description: 'Kuratierte Sammlung von Regex-Bibliotheken, Tools, Frameworks und Software.',
    url: 'https://github.com/slevithan/awesome-regex',
    category: 'Development',
    icon: Code2,
    author: 'slevithan',
  },
  {
    name: 'Awesome-LLMOps',
    description: 'Kuratierte Liste von LLMOps-Tools für Entwickler.',
    url: 'https://github.com/tensorchord/Awesome-LLMOps',
    category: 'MLOps',
    icon: Cog,
    author: 'tensorchord',
  },
  {
    name: 'awesome-ai-agents',
    description: 'Liste von AI Agents, die verschiedene Aufgaben automatisieren.',
    url: 'https://github.com/e2b-dev/awesome-ai-agents',
    category: 'AI Agents',
    icon: Bot,
    author: 'e2b-dev',
  },
  {
    name: 'awesome-selfhosted',
    description: 'Liste von Self-Hosting Software für lokale Server oder eigene Infrastruktur.',
    url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
    category: 'Self-Hosting',
    icon: Server,
    author: 'awesome-selfhosted',
  },
  {
    name: 'Markdown-Cheatsheet',
    description: 'Interaktiver Markdown-Spickzettel mit allen wichtigen Syntax-Elementen.',
    url: 'https://github.com/lifeparticle/Markdown-Cheatsheet',
    category: 'Docs',
    icon: FileText,
    author: 'lifeparticle',
  },
  {
    name: 'awesome-mcp-servers',
    description: 'Kuratierte Liste von MCP Servern für Claude und andere AI-Assistenten.',
    url: 'https://github.com/punkpeye/awesome-mcp-servers',
    category: 'MCP',
    icon: Plug,
    author: 'punkpeye',
  },
  {
    name: 'Compose-Examples',
    description: 'Verschiedene Docker Compose Beispiele fuer Self-Hosted Apps.',
    url: 'https://github.com/Haxxnet/Compose-Examples',
    category: 'Docker',
    icon: Container,
    author: 'Haxxnet',
  },
];

export default function GithubPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Github className="h-8 w-8 text-primary" />
          GitHub Repos
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte Sammlung hilfreicher Awesome-Listen und GitHub Repositories.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group block"
          >
            <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl bg-primary/10 p-3">
                  <repo.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {repo.category}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                {repo.name}
              </h3>

              <p className="mb-3 text-sm text-muted-foreground">
                {repo.description}
              </p>

              <p className="mb-4 text-xs text-muted-foreground/70">
                von <span className="font-medium text-muted-foreground">{repo.author}</span>
              </p>

              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                Auf GitHub ansehen
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
