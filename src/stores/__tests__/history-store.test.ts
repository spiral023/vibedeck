import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHistoryStore, type HistoryEntry } from '../history-store'

describe('history-store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearAll } = useHistoryStore.getState()
    clearAll()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should start with empty entries', () => {
      const { entries } = useHistoryStore.getState()
      expect(entries).toEqual([])
    })
  })

  describe('addEntry', () => {
    it('should add a prompt entry', () => {
      const { addEntry, entries } = useHistoryStore.getState()

      const entryData = {
        entryType: 'prompt' as const,
        promptId: 'test-prompt',
        promptTitle: 'Test Prompt',
        selectedVariant: 'intermediate' as const,
        resolvedVariables: { name: 'John' },
        resolvedPromptMarkdown: 'Hello John',
        copyFormat: 'chat_markdown' as const,
      }

      const id = addEntry(entryData)

      const state = useHistoryStore.getState()
      expect(state.entries).toHaveLength(1)
      expect(state.entries[0].id).toBe(id)
      expect(state.entries[0].entryType).toBe('prompt')
      expect(state.entries[0].promptTitle).toBe('Test Prompt')
    })

    it('should generate unique IDs', () => {
      const { addEntry } = useHistoryStore.getState()

      const id1 = addEntry({ entryType: 'prompt', promptTitle: 'First' })
      const id2 = addEntry({ entryType: 'prompt', promptTitle: 'Second' })

      expect(id1).not.toBe(id2)
    })

    it('should add timestamp automatically', () => {
      const { addEntry } = useHistoryStore.getState()
      const beforeTime = Date.now()

      addEntry({ entryType: 'prompt', promptTitle: 'Test' })

      const afterTime = Date.now()
      const { entries } = useHistoryStore.getState()

      expect(entries[0].timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(entries[0].timestamp).toBeLessThanOrEqual(afterTime)
    })

    it('should add new entries to the beginning', () => {
      const { addEntry } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'First' })
      addEntry({ entryType: 'prompt', promptTitle: 'Second' })
      addEntry({ entryType: 'prompt', promptTitle: 'Third' })

      const { entries } = useHistoryStore.getState()

      expect(entries[0].promptTitle).toBe('Third')
      expect(entries[1].promptTitle).toBe('Second')
      expect(entries[2].promptTitle).toBe('First')
    })

    it('should limit entries to 100', () => {
      const { addEntry } = useHistoryStore.getState()

      // Add 150 entries
      for (let i = 0; i < 150; i++) {
        addEntry({ entryType: 'prompt', promptTitle: `Entry ${i}` })
      }

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(100)

      // Most recent should be kept
      expect(entries[0].promptTitle).toBe('Entry 149')
      // Oldest should be dropped
      expect(entries[99].promptTitle).toBe('Entry 50')
    })

    it('should support different entry types', () => {
      const { addEntry } = useHistoryStore.getState()

      const types: Array<'prompt' | 'prompt_builder' | 'prompt_factory' | 'rules'> = [
        'prompt',
        'prompt_builder',
        'prompt_factory',
        'rules',
      ]

      types.forEach(type => {
        addEntry({ entryType: type, rawOutput: `Test ${type}` })
      })

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(4)

      types.forEach((type, index) => {
        expect(entries[3 - index].entryType).toBe(type)
      })
    })

    it('should handle copy formats', () => {
      const { addEntry } = useHistoryStore.getState()

      addEntry({
        entryType: 'prompt',
        copyFormat: 'json',
        rawOutput: '{"test": true}',
      })

      const { entries } = useHistoryStore.getState()
      expect(entries[0].copyFormat).toBe('json')
    })

    it('should handle workflow entries', () => {
      const { addEntry } = useHistoryStore.getState()

      addEntry({
        entryType: 'prompt',
        workflowId: 'workflow-123',
        stepIndex: 2,
        promptTitle: 'Workflow Step',
      })

      const { entries } = useHistoryStore.getState()
      expect(entries[0].workflowId).toBe('workflow-123')
      expect(entries[0].stepIndex).toBe(2)
    })
  })

  describe('deleteEntry', () => {
    it('should delete entry by id', () => {
      const { addEntry, deleteEntry } = useHistoryStore.getState()

      const id1 = addEntry({ entryType: 'prompt', promptTitle: 'First' })
      const id2 = addEntry({ entryType: 'prompt', promptTitle: 'Second' })

      deleteEntry(id1)

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(1)
      expect(entries[0].id).toBe(id2)
    })

    it('should not fail when deleting non-existent id', () => {
      const { addEntry, deleteEntry } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'Test' })

      expect(() => {
        deleteEntry('non-existent-id')
      }).not.toThrow()

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(1)
    })
  })

  describe('clearAll', () => {
    it('should remove all entries', () => {
      const { addEntry, clearAll } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'First' })
      addEntry({ entryType: 'prompt', promptTitle: 'Second' })
      addEntry({ entryType: 'prompt', promptTitle: 'Third' })

      clearAll()

      const { entries } = useHistoryStore.getState()
      expect(entries).toEqual([])
    })

    it('should work with empty entries', () => {
      const { clearAll } = useHistoryStore.getState()

      expect(() => {
        clearAll()
      }).not.toThrow()

      const { entries } = useHistoryStore.getState()
      expect(entries).toEqual([])
    })
  })

  describe('getLatestEntry', () => {
    it('should return latest entry', () => {
      const { addEntry, getLatestEntry } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'First' })
      addEntry({ entryType: 'prompt', promptTitle: 'Second' })

      const latest = getLatestEntry()

      expect(latest).toBeDefined()
      expect(latest?.promptTitle).toBe('Second')
    })

    it('should return undefined when no entries', () => {
      const { getLatestEntry } = useHistoryStore.getState()

      const latest = getLatestEntry()
      expect(latest).toBeUndefined()
    })
  })

  describe('getEntriesByType', () => {
    it('should filter entries by type', () => {
      const { addEntry, getEntriesByType } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'Prompt 1' })
      addEntry({ entryType: 'prompt_builder', rawOutput: 'Builder' })
      addEntry({ entryType: 'prompt', promptTitle: 'Prompt 2' })
      addEntry({ entryType: 'rules', rawOutput: 'Rules' })

      const prompts = getEntriesByType('prompt')
      const builders = getEntriesByType('prompt_builder')
      const rules = getEntriesByType('rules')

      expect(prompts).toHaveLength(2)
      expect(builders).toHaveLength(1)
      expect(rules).toHaveLength(1)

      expect(prompts.every(e => e.entryType === 'prompt')).toBe(true)
    })

    it('should return empty array for type with no entries', () => {
      const { addEntry, getEntriesByType } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'Test' })

      const factories = getEntriesByType('prompt_factory')
      expect(factories).toEqual([])
    })

    it('should maintain chronological order', () => {
      const { addEntry, getEntriesByType } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'First' })
      addEntry({ entryType: 'prompt_builder', rawOutput: 'Builder' })
      addEntry({ entryType: 'prompt', promptTitle: 'Second' })

      const prompts = getEntriesByType('prompt')

      expect(prompts[0].promptTitle).toBe('Second')
      expect(prompts[1].promptTitle).toBe('First')
    })
  })

  describe('persistence', () => {
    it('should persist entries to localStorage', () => {
      const { addEntry } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'Persisted' })

      const stored = localStorage.getItem('vibedeck-history')
      expect(stored).toBeTruthy()

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.entries).toHaveLength(1)
        expect(parsed.state.entries[0].promptTitle).toBe('Persisted')
      }
    })

    it('should have version 1', () => {
      const { addEntry } = useHistoryStore.getState()

      addEntry({ entryType: 'prompt', promptTitle: 'Test' })

      const stored = localStorage.getItem('vibedeck-history')
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.version).toBe(1)
      }
    })
  })
})
