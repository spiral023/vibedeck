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
    history: [],
  };

  it('validates valid export data', () => {
    const result = validateImportData(validExport);
    expect(result.isValid).toBe(true);
    expect(result.settingsCount).toBe(1);
    expect(result.favoritesCount).toBe(1);
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
    const history: any[] = [];

    const data = createExportData(settings, status, history);
    expect(data.schemaVersion).toBe(1);
    expect(data.settings).toEqual(settings);
  });
});
