import { motion } from 'framer-motion';
import { ExternalLink, Compass, Code2, Database, Cloud, Palette, Terminal } from 'lucide-react';

const tools = [
  {
    name: 'Lovable',
    description: 'AI-gestützte Full-Stack Entwicklungsplattform.',
    url: 'https://lovable.dev',
    category: 'Plattform',
    icon: Code2,
  },
  {
    name: 'Supabase',
    description: 'Open Source Firebase Alternative mit PostgreSQL.',
    url: 'https://supabase.com',
    category: 'Backend',
    icon: Database,
  },
  {
    name: 'Vercel',
    description: 'Hosting-Plattform für Frontend-Frameworks.',
    url: 'https://vercel.com',
    category: 'Hosting',
    icon: Cloud,
  },
  {
    name: 'Figma',
    description: 'Kollaboratives Design-Tool für UI/UX.',
    url: 'https://figma.com',
    category: 'Design',
    icon: Palette,
  },
  {
    name: 'Cursor',
    description: 'AI-first Code Editor basierend auf VS Code.',
    url: 'https://cursor.sh',
    category: 'Editor',
    icon: Terminal,
  },
  {
    name: 'v0.dev',
    description: 'AI UI Generator von Vercel.',
    url: 'https://v0.dev',
    category: 'AI Tools',
    icon: Code2,
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <motion.a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group block"
          >
            <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <tool.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {tool.category}
                </span>
              </div>

              <h3 className="mb-1 font-semibold group-hover:text-primary transition-colors">
                {tool.name}
              </h3>

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
    </div>
  );
}
