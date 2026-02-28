import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContentDomain = 'knowledge' | 'blog';

export interface DomainStatus {
  viewed: Record<string, true>;
  favorites: Record<string, true>;
  done: Record<string, true>;
}

export interface ContentStatusData {
  knowledge: DomainStatus;
  blog: DomainStatus;
}

interface ContentStatusState extends ContentStatusData {
  legacyMigrationDone: boolean;

  markViewed: (domain: ContentDomain, id: string) => void;
  toggleFavorite: (domain: ContentDomain, id: string) => void;
  toggleDone: (domain: ContentDomain, id: string) => void;
  isViewed: (domain: ContentDomain, id: string) => boolean;
  isFavorite: (domain: ContentDomain, id: string) => boolean;
  isDone: (domain: ContentDomain, id: string) => boolean;
  replaceAll: (data: ContentStatusData) => void;
  resetAll: () => void;
  runLegacyMigration: () => void;
}

const emptyDomainStatus = (): DomainStatus => ({
  viewed: {},
  favorites: {},
  done: {},
});

const emptyContentStatusData = (): ContentStatusData => ({
  knowledge: emptyDomainStatus(),
  blog: emptyDomainStatus(),
});

const normalizeDomainStatus = (value: unknown): DomainStatus => {
  if (!value || typeof value !== 'object') {
    return emptyDomainStatus();
  }

  const candidate = value as Partial<DomainStatus>;
  return {
    viewed: candidate.viewed ?? {},
    favorites: candidate.favorites ?? {},
    done: candidate.done ?? {},
  };
};

const normalizeContentStatusData = (value: unknown): ContentStatusData => {
  if (!value || typeof value !== 'object') {
    return emptyContentStatusData();
  }

  const candidate = value as Partial<ContentStatusData>;
  return {
    knowledge: normalizeDomainStatus(candidate.knowledge),
    blog: normalizeDomainStatus(candidate.blog),
  };
};

const mergeIntoRecord = (base: Record<string, true>, ids: string[]) => {
  if (ids.length === 0) {
    return base;
  }

  const next = { ...base };
  ids.forEach((id) => {
    next[id] = true;
  });
  return next;
};

export const useContentStatusStore = create<ContentStatusState>()(
  persist(
    (set, get) => ({
      ...emptyContentStatusData(),
      legacyMigrationDone: false,

      markViewed: (domain, id) =>
        set((state) => {
          if (state[domain].viewed[id]) {
            return state;
          }
          return {
            [domain]: {
              ...state[domain],
              viewed: { ...state[domain].viewed, [id]: true },
            },
          };
        }),

      toggleFavorite: (domain, id) =>
        set((state) => {
          const nextFavorites = { ...state[domain].favorites };
          if (nextFavorites[id]) {
            delete nextFavorites[id];
          } else {
            nextFavorites[id] = true;
          }
          return {
            [domain]: {
              ...state[domain],
              favorites: nextFavorites,
            },
          };
        }),

      toggleDone: (domain, id) =>
        set((state) => {
          const nextDone = { ...state[domain].done };
          if (nextDone[id]) {
            delete nextDone[id];
          } else {
            nextDone[id] = true;
          }
          return {
            [domain]: {
              ...state[domain],
              done: nextDone,
            },
          };
        }),

      isViewed: (domain, id) => !!get()[domain].viewed[id],
      isFavorite: (domain, id) => !!get()[domain].favorites[id],
      isDone: (domain, id) => !!get()[domain].done[id],

      replaceAll: (data) =>
        set((state) => ({
          ...normalizeContentStatusData(data),
          legacyMigrationDone: state.legacyMigrationDone,
        })),

      resetAll: () =>
        set((state) => ({
          ...emptyContentStatusData(),
          legacyMigrationDone: state.legacyMigrationDone,
        })),

      runLegacyMigration: () => {
        if (get().legacyMigrationDone) {
          return;
        }

        if (typeof window === 'undefined') {
          return;
        }

        const legacyKey = 'vibedeck-favorites-knowledge';
        const raw = window.localStorage.getItem(legacyKey);

        if (!raw) {
          set({ legacyMigrationDone: true });
          return;
        }

        try {
          const parsed = JSON.parse(raw);
          const legacyFavorites = Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === 'string')
            : [];

          if (legacyFavorites.length > 0) {
            set((state) => ({
              knowledge: {
                ...state.knowledge,
                favorites: mergeIntoRecord(state.knowledge.favorites, legacyFavorites),
              },
              legacyMigrationDone: true,
            }));
          } else {
            set({ legacyMigrationDone: true });
          }
        } catch (err) {
          console.error('Failed to migrate legacy knowledge favorites', err);
          set({ legacyMigrationDone: true });
        }
      },
    }),
    {
      name: 'vibedeck-content-status',
      version: 1,
      onRehydrateStorage: () => () => {
        useContentStatusStore.getState().runLegacyMigration();
      },
    }
  )
);

