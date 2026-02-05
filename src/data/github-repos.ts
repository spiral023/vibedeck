import type { ElementType } from 'react';
import { Box, Cloud, Brain, Type, Image, Code2, Cog, Bot, Server, FileText, Plug, Container, Zap } from 'lucide-react';

export interface GithubRepo {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: ElementType;
  author: string;
}

export const githubRepos: GithubRepo[] = [
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
  {
    name: 'everything-claude-code',
    description: 'Umfassende Sammlung von Claude Code Konfigurationen, Agents, Skills, Hooks und MCP-Configs.',
    url: 'https://github.com/affaan-m/everything-claude-code',
    category: 'Claude',
    icon: Code2,
    author: 'affaan-m',
  },
  {
    name: 'awesome-claude-skills',
    description: 'Eine kuratierte Liste von fantastischen Skills für Claude Code, unterteilt in Kategorien wie Entwicklung, Datenanalyse und Sicherheit.',
    url: 'https://github.com/BehiSecc/awesome-claude-skills',
    category: 'Claude',
    icon: Bot,
    author: 'BehiSecc',
  },
  {
    name: 'Claude Skills',
    description: 'Offizielle Sammlung von Anthropic für Claude Skills, inklusive Tools für Dokumente, Entwicklung und Automatisierung.',
    url: 'https://github.com/anthropics/skills',
    category: 'Claude',
    icon: Bot,
    author: 'anthropics',
  },
  {
    name: 'Full Stack FastAPI',
    description: 'Ein modernes Full-stack Projekt-Template mit FastAPI, React, SQLModel, PostgreSQL, Docker und automatischer CI/CD.',
    url: 'https://github.com/fastapi/full-stack-fastapi-template',
    category: 'Template',
    icon: Zap,
    author: 'fastapi',
  },
];
