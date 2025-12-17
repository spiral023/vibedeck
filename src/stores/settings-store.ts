import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalVariables {
  global_stack: string;
  global_project_name?: string;
  global_language?: string;
  [key: string]: string | undefined;
}

interface SettingsState {
  themeMode: 'dark' | 'light' | 'system';
  preferredLanguage: 'de' | 'en';
  defaultComplexity: 'beginner' | 'intermediate' | 'expert';
  showBeginnerExplanations: boolean;
  globalVariables: GlobalVariables;
  
  setThemeMode: (mode: 'dark' | 'light' | 'system') => void;
  setPreferredLanguage: (lang: 'de' | 'en') => void;
  setDefaultComplexity: (complexity: 'beginner' | 'intermediate' | 'expert') => void;
  setShowBeginnerExplanations: (show: boolean) => void;
  setGlobalVariable: (key: string, value: string) => void;
  setGlobalVariables: (vars: GlobalVariables) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  themeMode: 'dark' as const,
  preferredLanguage: 'de' as const,
  defaultComplexity: 'intermediate' as const,
  showBeginnerExplanations: true,
  globalVariables: {
    global_stack: 'React, TypeScript, Tailwind CSS',
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setThemeMode: (mode) => set({ themeMode: mode }),
      setPreferredLanguage: (lang) => set({ preferredLanguage: lang }),
      setDefaultComplexity: (complexity) => set({ defaultComplexity: complexity }),
      setShowBeginnerExplanations: (show) => set({ showBeginnerExplanations: show }),
      setGlobalVariable: (key, value) => set((state) => ({
        globalVariables: { ...state.globalVariables, [key]: value },
      })),
      setGlobalVariables: (vars) => set({ globalVariables: vars }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'vibedeck-settings',
      version: 1,
    }
  )
);
