import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Box,
  Compass,
  Factory,
  FolderKanban,
  History,
  Home,
  Lightbulb,
  Library,
  Menu,
  Rocket,
  Server,
  Settings,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Prompt Builder', href: '/prompt-builder', icon: Wrench },
  { label: 'Prompt Factory', href: '/prompt-factory', icon: Factory },
  { label: 'Prompt Bibliothek', href: '/prompt-library', icon: Library, badge: 'Neu' },
  { label: 'Workflows', href: '/workflows', icon: FolderKanban },
  { label: 'UI Bibliotheken', href: '/ui-libraries', icon: Box },
  { label: 'Tool Directory', href: '/tool-directory', icon: Compass },
  { label: 'Wissensbasis', href: '/knowledge', icon: BookOpen },
  { label: 'Hosting', href: '/hosting', icon: Server },
  { label: 'Superpowers', href: '/superpowers', icon: Zap },
  { label: 'Ideen Lab', href: '/idea-lab', icon: Lightbulb },
  { label: 'Rules Generator', href: '/rules-generator', icon: Sparkles },
  { label: 'Verlauf', href: '/history', icon: History },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-card/80 p-2.5 backdrop-blur-xl border border-border/50 shadow-md lg:hidden focus-ring"
        aria-label="Menü öffnen"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 border-r border-border/50 bg-sidebar backdrop-blur-xl',
          'lg:translate-x-0 lg:static lg:z-auto'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <Rocket className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight">VibeDeck</span>
            </NavLink>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-accent lg:hidden focus-ring"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        'hover:bg-accent focus-ring',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center justify-between">
              <NavLink
                to="/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-ring"
              >
                <Settings className="h-4 w-4" />
                <span>Einstellungen</span>
              </NavLink>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
