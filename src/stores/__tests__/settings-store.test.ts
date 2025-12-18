import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settings-store'

describe('settings-store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { resetSettings } = useSettingsStore.getState()
    resetSettings()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have default theme mode', () => {
      const { themeMode } = useSettingsStore.getState()
      expect(themeMode).toBe('dark')
    })

    it('should have default language', () => {
      const { preferredLanguage } = useSettingsStore.getState()
      expect(preferredLanguage).toBe('de')
    })

    it('should have default complexity', () => {
      const { defaultComplexity } = useSettingsStore.getState()
      expect(defaultComplexity).toBe('intermediate')
    })

    it('should show beginner explanations by default', () => {
      const { showBeginnerExplanations } = useSettingsStore.getState()
      expect(showBeginnerExplanations).toBe(true)
    })

    it('should have default global variables', () => {
      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.global_stack).toBe('React, TypeScript, Tailwind CSS')
    })
  })

  describe('setThemeMode', () => {
    it('should update theme mode to light', () => {
      const { setThemeMode } = useSettingsStore.getState()
      setThemeMode('light')

      const { themeMode } = useSettingsStore.getState()
      expect(themeMode).toBe('light')
    })

    it('should update theme mode to system', () => {
      const { setThemeMode } = useSettingsStore.getState()
      setThemeMode('system')

      const { themeMode } = useSettingsStore.getState()
      expect(themeMode).toBe('system')
    })
  })

  describe('setPreferredLanguage', () => {
    it('should update language to English', () => {
      const { setPreferredLanguage } = useSettingsStore.getState()
      setPreferredLanguage('en')

      const { preferredLanguage } = useSettingsStore.getState()
      expect(preferredLanguage).toBe('en')
    })

    it('should update language to German', () => {
      const { setPreferredLanguage } = useSettingsStore.getState()
      setPreferredLanguage('de')

      const { preferredLanguage } = useSettingsStore.getState()
      expect(preferredLanguage).toBe('de')
    })
  })

  describe('setDefaultComplexity', () => {
    it('should update complexity to beginner', () => {
      const { setDefaultComplexity } = useSettingsStore.getState()
      setDefaultComplexity('beginner')

      const { defaultComplexity } = useSettingsStore.getState()
      expect(defaultComplexity).toBe('beginner')
    })

    it('should update complexity to expert', () => {
      const { setDefaultComplexity } = useSettingsStore.getState()
      setDefaultComplexity('expert')

      const { defaultComplexity } = useSettingsStore.getState()
      expect(defaultComplexity).toBe('expert')
    })
  })

  describe('setShowBeginnerExplanations', () => {
    it('should toggle beginner explanations off', () => {
      const { setShowBeginnerExplanations } = useSettingsStore.getState()
      setShowBeginnerExplanations(false)

      const { showBeginnerExplanations } = useSettingsStore.getState()
      expect(showBeginnerExplanations).toBe(false)
    })

    it('should toggle beginner explanations on', () => {
      const { setShowBeginnerExplanations } = useSettingsStore.getState()
      setShowBeginnerExplanations(false)
      setShowBeginnerExplanations(true)

      const { showBeginnerExplanations } = useSettingsStore.getState()
      expect(showBeginnerExplanations).toBe(true)
    })
  })

  describe('setGlobalVariable', () => {
    it('should set a single global variable', () => {
      const { setGlobalVariable } = useSettingsStore.getState()
      setGlobalVariable('global_project_name', 'MyApp')

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.global_project_name).toBe('MyApp')
    })

    it('should update existing global variable', () => {
      const { setGlobalVariable } = useSettingsStore.getState()
      setGlobalVariable('global_stack', 'Vue, JavaScript')

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.global_stack).toBe('Vue, JavaScript')
    })

    it('should add custom variable', () => {
      const { setGlobalVariable } = useSettingsStore.getState()
      setGlobalVariable('custom_var', 'custom value')

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.custom_var).toBe('custom value')
    })

    it('should not affect other variables', () => {
      const { setGlobalVariable, globalVariables: initial } = useSettingsStore.getState()
      const initialStack = initial.global_stack

      setGlobalVariable('global_project_name', 'MyApp')

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.global_stack).toBe(initialStack)
      expect(globalVariables.global_project_name).toBe('MyApp')
    })
  })

  describe('setGlobalVariables', () => {
    it('should replace all global variables', () => {
      const { setGlobalVariables } = useSettingsStore.getState()
      const newVars = {
        global_stack: 'Angular, TypeScript',
        global_project_name: 'NewProject',
        global_language: 'English',
      }

      setGlobalVariables(newVars)

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables).toEqual(newVars)
    })

    it('should handle empty object', () => {
      const { setGlobalVariables } = useSettingsStore.getState()
      setGlobalVariables({ global_stack: '' })

      const { globalVariables } = useSettingsStore.getState()
      expect(globalVariables.global_stack).toBe('')
    })
  })

  describe('resetSettings', () => {
    it('should reset all settings to defaults', () => {
      const {
        setThemeMode,
        setPreferredLanguage,
        setDefaultComplexity,
        setGlobalVariable,
        resetSettings
      } = useSettingsStore.getState()

      // Change all settings
      setThemeMode('light')
      setPreferredLanguage('en')
      setDefaultComplexity('expert')
      setGlobalVariable('global_project_name', 'Test')

      // Reset
      resetSettings()

      const state = useSettingsStore.getState()
      expect(state.themeMode).toBe('dark')
      expect(state.preferredLanguage).toBe('de')
      expect(state.defaultComplexity).toBe('intermediate')
      expect(state.globalVariables.global_stack).toBe('React, TypeScript, Tailwind CSS')
      expect(state.globalVariables.global_project_name).toBeUndefined()
    })
  })

  describe('persistence', () => {
    it('should persist to localStorage', () => {
      const { setThemeMode } = useSettingsStore.getState()
      setThemeMode('light')

      // Check if localStorage was called
      const stored = localStorage.getItem('vibedeck-settings')
      expect(stored).toBeTruthy()

      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.themeMode).toBe('light')
      }
    })

    it('should have version 1', () => {
      const { setThemeMode } = useSettingsStore.getState()
      setThemeMode('light')

      const stored = localStorage.getItem('vibedeck-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.version).toBe(1)
      }
    })
  })
})
