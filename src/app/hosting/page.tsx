'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Server, Check, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const hostingProviders = [
  {
    name: 'Vercel',
    description: 'Optimiert für Next.js und Frontend-Frameworks',
    url: 'https://vercel.com',
    logo: '▲',
    recommended: true,
    pricing: 'Kostenlos bis $20/Monat',
    pros: ['Beste DX', 'Automatische Previews', 'Edge Functions', 'Analytics'],
    cons: ['Teurer bei hohem Traffic', 'Vendor Lock-in'],
    features: {
      ssl: true,
      cdn: true,
      ci: true,
      domains: true,
      functions: true,
      database: false,
    },
  },
  {
    name: 'Netlify',
    description: 'Einfaches Deployment mit starkem Build-System',
    url: 'https://netlify.com',
    logo: '◆',
    recommended: true,
    pricing: 'Kostenlos bis $19/Monat',
    pros: ['Einfache Einrichtung', 'Forms & Identity', 'Split Testing', 'CMS Integration'],
    cons: ['Functions limitiert', 'Build-Zeit-Limits'],
    features: {
      ssl: true,
      cdn: true,
      ci: true,
      domains: true,
      functions: true,
      database: false,
    },
  },
  {
    name: 'Cloudflare Pages',
    description: 'Schnellstes CDN mit Workers-Integration',
    url: 'https://pages.cloudflare.com',
    logo: '☁',
    recommended: false,
    pricing: 'Großzügiger Free Tier',
    pros: ['Extrem schnell', 'Workers KV', 'Unbegrenzte Bandbreite', 'D1 Datenbank'],
    cons: ['Lernkurve', 'Weniger Integrationen'],
    features: {
      ssl: true,
      cdn: true,
      ci: true,
      domains: true,
      functions: true,
      database: true,
    },
  },
  {
    name: 'Railway',
    description: 'Full-Stack Deployment mit Datenbanken',
    url: 'https://railway.app',
    logo: '🚂',
    recommended: false,
    pricing: 'Pay-as-you-go ab $5/Monat',
    pros: ['PostgreSQL inklusive', 'Docker Support', 'Einfache Skalierung', 'Team-Features'],
    cons: ['Kann teurer werden', 'Weniger CDN-Optimierung'],
    features: {
      ssl: true,
      cdn: false,
      ci: true,
      domains: true,
      functions: true,
      database: true,
    },
  },
  {
    name: 'Render',
    description: 'Heroku-Alternative mit modernem Stack',
    url: 'https://render.com',
    logo: '◉',
    recommended: false,
    pricing: 'Kostenlos bis $7/Monat',
    pros: ['PostgreSQL kostenlos', 'Background Workers', 'Auto-Scaling', 'Einfache Config'],
    cons: ['Cold Starts im Free Tier', 'Weniger Edge-Locations'],
    features: {
      ssl: true,
      cdn: true,
      ci: true,
      domains: true,
      functions: true,
      database: true,
    },
  },
  {
    name: 'Supabase',
    description: 'Backend-as-a-Service mit PostgreSQL',
    url: 'https://supabase.com',
    logo: '⚡',
    recommended: true,
    pricing: 'Kostenlos bis $25/Monat',
    pros: ['Auth inklusive', 'Realtime', 'Edge Functions', 'Storage'],
    cons: ['Nur Backend', 'Row-Limits im Free Tier'],
    features: {
      ssl: true,
      cdn: false,
      ci: false,
      domains: false,
      functions: true,
      database: true,
    },
  },
];

const featureLabels: Record<string, string> = {
  ssl: 'SSL',
  cdn: 'CDN',
  ci: 'CI/CD',
  domains: 'Domains',
  functions: 'Functions',
  database: 'Datenbank',
};

export default function HostingPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Server className="h-8 w-8 text-primary" />
          Hosting
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vergleiche und Empfehlungen für Hosting-Plattformen.
        </p>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
      >
        <h2 className="font-semibold flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-primary" />
          Empfehlung für Lovable-Projekte
        </h2>
        <p className="text-sm text-muted-foreground">
          <strong>Frontend:</strong> Vercel oder Netlify für optimale DX und Performance.{' '}
          <strong>Backend:</strong> Supabase (integriert in Lovable) oder Railway für Full-Stack.
        </p>
      </motion.div>

      {/* Provider Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {hostingProviders.map((provider, index) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'rounded-2xl border bg-card/50 p-6',
              provider.recommended ? 'border-primary/30' : 'border-border/50'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{provider.logo}</span>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {provider.name}
                    {provider.recommended && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        Empfohlen
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              </div>
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <p className="text-sm font-medium mb-4">{provider.pricing}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(provider.features).map(([key, value]) => (
                <span
                  key={key}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs',
                    value
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {value ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {featureLabels[key]}
                </span>
              ))}
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-400 mb-1">Vorteile</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {provider.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-1">
                      <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-green-400" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-400 mb-1">Nachteile</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {provider.cons.map((con) => (
                    <li key={con} className="flex items-start gap-1">
                      <X className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
