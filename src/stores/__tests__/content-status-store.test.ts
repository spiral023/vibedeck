import { beforeEach, describe, expect, it } from 'vitest';
import { useContentStatusStore, type ContentStatusData } from '../content-status-store';

const emptyData = (): ContentStatusData => ({
  knowledge: { viewed: {}, favorites: {}, done: {} },
  blog: { viewed: {}, favorites: {}, done: {} },
});

describe('content-status-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useContentStatusStore.setState({
      ...emptyData(),
      legacyMigrationDone: false,
    });
  });

  it('marks viewed idempotently', () => {
    const { markViewed } = useContentStatusStore.getState();

    markViewed('knowledge', 'article-a');
    markViewed('knowledge', 'article-a');

    const state = useContentStatusStore.getState();
    expect(state.knowledge.viewed['article-a']).toBe(true);
    expect(Object.keys(state.knowledge.viewed)).toHaveLength(1);
  });

  it('toggles favorite and done', () => {
    const { toggleFavorite, toggleDone } = useContentStatusStore.getState();

    toggleFavorite('blog', 'post-1');
    toggleDone('blog', 'post-1');

    let state = useContentStatusStore.getState();
    expect(state.blog.favorites['post-1']).toBe(true);
    expect(state.blog.done['post-1']).toBe(true);

    toggleFavorite('blog', 'post-1');
    toggleDone('blog', 'post-1');

    state = useContentStatusStore.getState();
    expect(state.blog.favorites['post-1']).toBeUndefined();
    expect(state.blog.done['post-1']).toBeUndefined();
  });

  it('keeps domain data isolated', () => {
    const { toggleFavorite } = useContentStatusStore.getState();

    toggleFavorite('knowledge', 'shared-id');

    const state = useContentStatusStore.getState();
    expect(state.knowledge.favorites['shared-id']).toBe(true);
    expect(state.blog.favorites['shared-id']).toBeUndefined();
  });

  it('persists state to localStorage', () => {
    const { toggleFavorite } = useContentStatusStore.getState();

    toggleFavorite('knowledge', 'persisted-id');

    const raw = localStorage.getItem('vibedeck-content-status');
    expect(raw).toBeTruthy();

    if (raw) {
      const parsed = JSON.parse(raw);
      expect(parsed.state.knowledge.favorites['persisted-id']).toBe(true);
      expect(parsed.version).toBe(1);
    }
  });

  it('migrates legacy knowledge favorites once', () => {
    localStorage.setItem('vibedeck-favorites-knowledge', JSON.stringify(['legacy-a', 'legacy-b']));

    const { runLegacyMigration } = useContentStatusStore.getState();
    runLegacyMigration();

    let state = useContentStatusStore.getState();
    expect(state.knowledge.favorites['legacy-a']).toBe(true);
    expect(state.knowledge.favorites['legacy-b']).toBe(true);
    expect(state.legacyMigrationDone).toBe(true);

    // Running migration twice must not duplicate or change existing records unexpectedly.
    runLegacyMigration();
    state = useContentStatusStore.getState();
    expect(Object.keys(state.knowledge.favorites).sort()).toEqual(['legacy-a', 'legacy-b']);
  });
});

