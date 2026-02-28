import { describe, it, expect } from 'vitest';
import { validateImportData, createExportData } from './export-utils';

describe('export-utils', () => {
  const validExport = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    settings: {
      themeMode: 'dark',
      preferredLanguage: 'de',
      defaultComplexity: 'beginner',
      showBeginnerExplanations: true,
      globalVariables: { global_stack: 'React' },
    },
    promptStatus: {
      favorites: { '1': true },
      done: {},
      agentRoleOverrides: {},
    },
    contentStatus: {
      knowledge: {
        viewed: { 'k-1': true },
        favorites: { 'k-2': true },
        done: {},
      },
      blog: {
        viewed: {},
        favorites: { 'b-1': true },
        done: { 'b-2': true },
      },
    },
    history: [],
  };

  it('validates valid export data', () => {
    const result = validateImportData(validExport);
    expect(result.isValid).toBe(true);
    expect(result.settingsCount).toBe(1);
    expect(result.favoritesCount).toBe(1);
    expect(result.knowledgeViewedCount).toBe(1);
    expect(result.blogDoneCount).toBe(1);
  });

  it('accepts legacy export without contentStatus', () => {
    const { contentStatus, ...legacyExport } = validExport;
    const result = validateImportData(legacyExport);
    expect(result.isValid).toBe(true);
    expect(result.knowledgeViewedCount).toBe(0);
    expect(result.blogFavoritesCount).toBe(0);
  });

  it('rejects invalid schema version', () => {
    const result = validateImportData({ ...validExport, schemaVersion: 99 });
    expect(result.isValid).toBe(false);
  });

  it('rejects missing fields', () => {
    // @ts-ignore
    const { settings, ...rest } = validExport;
    const result = validateImportData(rest);
    expect(result.isValid).toBe(false);
  });

  it('creates export data correctly', () => {
    const settings = {
      themeMode: 'dark' as const,
      preferredLanguage: 'de' as const,
      defaultComplexity: 'beginner' as const,
      showBeginnerExplanations: true,
      globalVariables: { global_stack: 'React' },
    };
    const status = { favorites: {}, done: {}, agentRoleOverrides: {} };
    const contentStatus = {
      knowledge: { viewed: { a: true }, favorites: {}, done: {} },
      blog: { viewed: {}, favorites: { b: true }, done: {} },
    };
    const history: any[] = [];

    const data = createExportData(settings, status, contentStatus, history);
    expect(data.schemaVersion).toBe(1);
    expect(data.settings).toEqual(settings);
    expect(data.contentStatus).toEqual(contentStatus);
  });
});
