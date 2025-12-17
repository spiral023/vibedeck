import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PromptStatusState {
  favorites: Record<string, true>;
  done: Record<string, true>;
  agentRoleOverrides: Record<string, string>;
  
  toggleFavorite: (promptId: string) => void;
  toggleDone: (promptId: string) => void;
  setAgentRoleOverride: (promptId: string, role: string) => void;
  clearAgentRoleOverride: (promptId: string) => void;
  isFavorite: (promptId: string) => boolean;
  isDone: (promptId: string) => boolean;
  getAgentRole: (promptId: string, defaultRole?: string) => string | undefined;
  resetAll: () => void;
}

export const usePromptStatusStore = create<PromptStatusState>()(
  persist(
    (set, get) => ({
      favorites: {},
      done: {},
      agentRoleOverrides: {},
      
      toggleFavorite: (promptId) => set((state) => {
        const newFavorites = { ...state.favorites };
        if (newFavorites[promptId]) {
          delete newFavorites[promptId];
        } else {
          newFavorites[promptId] = true;
        }
        return { favorites: newFavorites };
      }),
      
      toggleDone: (promptId) => set((state) => {
        const newDone = { ...state.done };
        if (newDone[promptId]) {
          delete newDone[promptId];
        } else {
          newDone[promptId] = true;
        }
        return { done: newDone };
      }),
      
      setAgentRoleOverride: (promptId, role) => set((state) => ({
        agentRoleOverrides: { ...state.agentRoleOverrides, [promptId]: role },
      })),
      
      clearAgentRoleOverride: (promptId) => set((state) => {
        const newOverrides = { ...state.agentRoleOverrides };
        delete newOverrides[promptId];
        return { agentRoleOverrides: newOverrides };
      }),
      
      isFavorite: (promptId) => !!get().favorites[promptId],
      isDone: (promptId) => !!get().done[promptId],
      getAgentRole: (promptId, defaultRole) => 
        get().agentRoleOverrides[promptId] || defaultRole,
      
      resetAll: () => set({ favorites: {}, done: {}, agentRoleOverrides: {} }),
    }),
    {
      name: 'vibedeck-prompt-status',
      version: 1,
    }
  )
);
