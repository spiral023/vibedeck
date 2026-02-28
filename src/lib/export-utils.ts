import { z } from 'zod';

export const ExportSchemaVersion = 1;

// Schema for validation
const GlobalVariablesSchema = z.record(z.string().optional());
const StatusRecordSchema = z.record(z.literal(true));
const DomainStatusSchema = z.object({
  viewed: StatusRecordSchema,
  favorites: StatusRecordSchema,
  done: StatusRecordSchema,
});
const ContentStatusSchema = z.object({
  knowledge: DomainStatusSchema,
  blog: DomainStatusSchema,
});

const ExportDataSchema = z.object({
  schemaVersion: z.literal(ExportSchemaVersion),
  exportedAt: z.string(),
  settings: z.object({
    themeMode: z.enum(['dark', 'light', 'system']),
    preferredLanguage: z.enum(['de', 'en']),
    defaultComplexity: z.enum(['beginner', 'intermediate', 'expert']),
    showBeginnerExplanations: z.boolean(),
    globalVariables: GlobalVariablesSchema,
  }),
  promptStatus: z.object({
    favorites: z.record(z.literal(true)),
    done: z.record(z.literal(true)),
    agentRoleOverrides: z.record(z.string()),
  }),
  contentStatus: ContentStatusSchema.optional(),
  history: z.array(z.object({
    id: z.string(),
    timestamp: z.number(),
    entryType: z.string(),
    copyFormat: z.string().optional(),
    promptId: z.string().optional(),
    promptTitle: z.string().optional(),
    selectedVariant: z.string().optional(),
    resolvedVariables: z.record(z.string()).optional(),
    resolvedPromptMarkdown: z.string().optional(),
    rawOutput: z.string().optional(),
    workflowId: z.string().optional(),
    stepIndex: z.number().optional(),
  })),
});

export type ExportData = z.infer<typeof ExportDataSchema>;

export interface ExportPreview {
  isValid: boolean;
  error?: string;
  settingsCount: number;
  favoritesCount: number;
  doneCount: number;
  knowledgeViewedCount: number;
  knowledgeFavoritesCount: number;
  knowledgeDoneCount: number;
  blogViewedCount: number;
  blogFavoritesCount: number;
  blogDoneCount: number;
  historyCount: number;
  exportedAt?: string;
}

/**
 * Create export data from stores
 */
export function createExportData(
  settings: any,
  promptStatus: any,
  contentStatus: any,
  history: any[]
): ExportData {
  return {
    schemaVersion: ExportSchemaVersion,
    exportedAt: new Date().toISOString(),
    settings: {
      themeMode: settings.themeMode,
      preferredLanguage: settings.preferredLanguage,
      defaultComplexity: settings.defaultComplexity,
      showBeginnerExplanations: settings.showBeginnerExplanations,
      globalVariables: settings.globalVariables,
    },
    promptStatus: {
      favorites: promptStatus.favorites,
      done: promptStatus.done,
      agentRoleOverrides: promptStatus.agentRoleOverrides,
    },
    contentStatus: {
      knowledge: {
        viewed: contentStatus.knowledge?.viewed ?? {},
        favorites: contentStatus.knowledge?.favorites ?? {},
        done: contentStatus.knowledge?.done ?? {},
      },
      blog: {
        viewed: contentStatus.blog?.viewed ?? {},
        favorites: contentStatus.blog?.favorites ?? {},
        done: contentStatus.blog?.done ?? {},
      },
    },
    history,
  };
}

/**
 * Validate and preview import data
 */
export function validateImportData(data: unknown): ExportPreview {
  try {
    const parsed = ExportDataSchema.parse(data);
    
    return {
      isValid: true,
      settingsCount: Object.keys(parsed.settings.globalVariables).length,
      favoritesCount: Object.keys(parsed.promptStatus.favorites).length,
      doneCount: Object.keys(parsed.promptStatus.done).length,
      knowledgeViewedCount: Object.keys(parsed.contentStatus?.knowledge.viewed ?? {}).length,
      knowledgeFavoritesCount: Object.keys(parsed.contentStatus?.knowledge.favorites ?? {}).length,
      knowledgeDoneCount: Object.keys(parsed.contentStatus?.knowledge.done ?? {}).length,
      blogViewedCount: Object.keys(parsed.contentStatus?.blog.viewed ?? {}).length,
      blogFavoritesCount: Object.keys(parsed.contentStatus?.blog.favorites ?? {}).length,
      blogDoneCount: Object.keys(parsed.contentStatus?.blog.done ?? {}).length,
      historyCount: parsed.history.length,
      exportedAt: parsed.exportedAt,
    };
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof z.ZodError 
        ? err.errors.map(e => e.message).join(', ')
        : 'Ungültiges Dateiformat',
      settingsCount: 0,
      favoritesCount: 0,
      doneCount: 0,
      knowledgeViewedCount: 0,
      knowledgeFavoritesCount: 0,
      knowledgeDoneCount: 0,
      blogViewedCount: 0,
      blogFavoritesCount: 0,
      blogDoneCount: 0,
      historyCount: 0,
    };
  }
}

/**
 * Download data as JSON file
 */
export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read JSON file
 */
export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        reject(new Error('Datei konnte nicht gelesen werden'));
      }
    };
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
    reader.readAsText(file);
  });
}
