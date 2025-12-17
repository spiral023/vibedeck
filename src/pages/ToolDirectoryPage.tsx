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
    ],
  },
  {
    name: 'Backend & Database',
    tools: [
      { name: 'Supabase', description: 'Open Source Firebase Alternative mit PostgreSQL.', url: 'https://supabase.com', icon: Database },
      { name: 'PlanetScale', description: 'Serverless MySQL Plattform.', url: 'https://planetscale.com', icon: Database },
      { name: 'Neon', description: 'Serverless Postgres mit Branching.', url: 'https://neon.tech', icon: Database },
      { name: 'Convex', description: 'Backend-as-a-Service mit Reaktivität.', url: 'https://convex.dev', icon: Boxes },
    ],
  },
  {
    name: 'Hosting & Deployment',
    tools: [
      { name: 'Vercel', description: 'Hosting-Plattform für Frontend-Frameworks.', url: 'https://vercel.com', icon: Cloud },
      { name: 'Netlify', description: 'Plattform für moderne Webanwendungen.', url: 'https://netlify.com', icon: Cloud },
      { name: 'Railway', description: 'Einfaches Deployment für Apps.', url: 'https://railway.app', icon: Cloud },
      { name: 'Fly.io', description: 'Apps näher an Usern deployen.', url: 'https://fly.io', icon: Cloud },
    ],
  },
  {
    name: 'Design & Prototyping',
    tools: [
      { name: 'Figma', description: 'Kollaboratives Design-Tool für UI/UX.', url: 'https://figma.com', icon: Palette },
      { name: 'Framer', description: 'Design und publish interaktive Websites.', url: 'https://framer.com', icon: Palette },
    ],
  },
  {
    name: 'AI & APIs',
    tools: [
      { name: 'OpenAI', description: 'GPT Modelle und mehr.', url: 'https://openai.com', icon: Brain },
      { name: 'Anthropic', description: 'Claude AI Modelle.', url: 'https://anthropic.com', icon: Brain },
      { name: 'Replicate', description: 'Open Source AI Modelle hosten.', url: 'https://replicate.com', icon: Brain },
    ],
  },
];

export function ToolDirectoryPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Tool Directory</h1>
            <p className="text-muted-foreground">
              Essenzielle Tools für moderne Webentwicklung.
            </p>
          </div>
        </div>
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
