import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themes = [
  { value: 'light' as const, label: 'Hell', icon: Sun },
  { value: 'dark' as const, label: 'Dunkel', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();

  const CurrentIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent transition-colors focus-ring"
          aria-label="Theme wechseln"
        >
          <CurrentIcon className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-2',
              theme === value && 'bg-accent'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
