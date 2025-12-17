import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ScaffoldPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export function ScaffoldPage({ title, description, icon: Icon, children }: ScaffoldPageProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </motion.div>

      {children || (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/50 py-20"
        >
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Demnächst verfügbar</h3>
          <p className="mt-2 text-center text-muted-foreground max-w-md">
            Diese Funktion wird in einer zukünftigen Version implementiert.
          </p>
        </motion.div>
      )}
    </div>
  );
}
