import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export type EntryType = 
  | 'prompt' 
  | 'prompt_builder' 
  | 'prompt_factory' 
  | 'rules' 
  | 'context_meta_prompt' 
  | 'help_doc';

export type CopyFormat = 'chat_markdown' | 'json' | 'raw_text';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  entryType: EntryType;
  copyFormat?: CopyFormat;
  promptId?: string;
  promptTitle?: string;
  selectedVariant?: 'beginner' | 'intermediate' | 'expert';
  resolvedVariables?: Record<string, string>;
  resolvedPromptMarkdown?: string;
  rawOutput?: string;
  workflowId?: string;
  stepIndex?: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => string;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  getLatestEntry: () => HistoryEntry | undefined;
  getEntriesByType: (type: EntryType) => HistoryEntry[];
}

const MAX_HISTORY_ENTRIES = 100;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entry) => {
        const id = nanoid();
        const newEntry: HistoryEntry = {
          ...entry,
          id,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          entries: [newEntry, ...state.entries].slice(0, MAX_HISTORY_ENTRIES),
        }));
        
        return id;
      },
      
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
      })),
      
      clearAll: () => set({ entries: [] }),
      
      getLatestEntry: () => get().entries[0],
      
      getEntriesByType: (type) => get().entries.filter((e) => e.entryType === type),
    }),
    {
      name: 'vibedeck-history',
      version: 1,
    }
  )
);
