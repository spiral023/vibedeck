'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Box,
  Compass,
  Factory,
  FileText,
  FolderKanban,
  Github,
  History,
  Lightbulb,
  Library,
  Layers,
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
  { label: 'Prompt Composer', href: '/prompt-composer', icon: Layers },
  { label: 'Prompt Factory', href: '/prompt-factory', icon: Factory },
  { label: 'Prompt Bibliothek', href: '/prompt-library', icon: Library, badge: 'Neu' },
  { label: 'Workflows', href: '/workflows', icon: FolderKanban },
  { label: 'Help Bibliothek', href: '/help-library', icon: FileText },
  { label: 'UI Bibliotheken', href: '/ui-libraries', icon: Box },
  { label: 'Tool Directory', href: '/tool-directory', icon: Compass },
  { label: 'GitHub Repos', href: '/github', icon: Github },
  { label: 'Wissensbasis', href: '/knowledge', icon: BookOpen },
  { label: 'Hosting', href: '/hosting', icon: Server },
  { label: 'Superpowers', href: '/superpowers', icon: Zap },
  { label: 'Ideen Lab', href: '/idea-lab', icon: Lightbulb },
  { label: 'Rules Generator', href: '/rules-generator', icon: Sparkles },
  { label: 'Verlauf', href: '/history', icon: History },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <>
      {/* Mobile menu button - larger touch target */}
      {!isLargeScreen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-3 top-3 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg lg:hidden focus-ring active:scale-95 transition-transform"
          aria-label="Menü öffnen"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen w-[280px] border-r border-border/50 bg-sidebar flex-shrink-0 will-change-transform',
          isLargeScreen
            ? 'sticky top-0'
            : 'fixed left-0 top-0 z-50 transition-transform duration-300 ease-out shadow-2xl',
          !isLargeScreen && !isOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5">
            <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
                  <Rocket className="h-4.5 w-4.5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-lg font-semibold tracking-tight">VibeDeck</span>
            </Link>
            {!isLargeScreen && (
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent focus-ring active:scale-95 transition-transform"
                aria-label="Menü schließen"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-thin">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                        'hover:bg-accent/80 focus-ring active:scale-[0.98]',
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive && 'text-primary')} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  'hover:bg-accent focus-ring active:scale-[0.98]',
                  pathname === '/settings'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Einstellungen</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
