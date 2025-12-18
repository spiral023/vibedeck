import { describe, it, expect } from 'vitest'
import {
  PLACEHOLDER_PATTERN,
  extractPlaceholders,
  isPlaceholderResolved,
  resolvePlaceholders,
  getUnresolvedPlaceholders,
  segmentText,
} from '../placeholder-utils'

describe('placeholder-utils', () => {
  describe('extractPlaceholders', () => {
    it('should extract single placeholder', () => {
      const text = 'Hello {{name}}'
      const result = extractPlaceholders(text)
      expect(result).toEqual(['name'])
    })

    it('should extract multiple placeholders', () => {
      const text = 'Hello {{name}}, you are {{age}} years old'
      const result = extractPlaceholders(text)
      expect(result).toEqual(['name', 'age'])
    })

    it('should handle duplicate placeholders', () => {
      const text = '{{name}} and {{name}} again'
      const result = extractPlaceholders(text)
      expect(result).toEqual(['name'])
    })

    it('should trim placeholder names', () => {
      const text = 'Hello {{ name }}'
      const result = extractPlaceholders(text)
      expect(result).toEqual(['name'])
    })

    it('should handle text without placeholders', () => {
      const text = 'Hello world'
      const result = extractPlaceholders(text)
      expect(result).toEqual([])
    })

    it('should handle global variables', () => {
      const text = 'Stack: {{global_stack}}, Project: {{global_project_name}}'
      const result = extractPlaceholders(text)
      expect(result).toEqual(['global_stack', 'global_project_name'])
    })
  })

  describe('isPlaceholderResolved', () => {
    it('should return true for resolved placeholder', () => {
      const values = { name: 'John' }
      expect(isPlaceholderResolved('name', values)).toBe(true)
    })

    it('should return false for undefined placeholder', () => {
      const values = { name: 'John' }
      expect(isPlaceholderResolved('age', values)).toBe(false)
    })

    it('should return false for empty string value', () => {
      const values = { name: '' }
      expect(isPlaceholderResolved('name', values)).toBe(false)
    })

    it('should return false for whitespace-only value', () => {
      const values = { name: '   ' }
      expect(isPlaceholderResolved('name', values)).toBe(false)
    })

    it('should return true for zero value', () => {
      const values = { count: '0' }
      expect(isPlaceholderResolved('count', values)).toBe(true)
    })
  })

  describe('resolvePlaceholders', () => {
    it('should resolve single placeholder', () => {
      const text = 'Hello {{name}}'
      const values = { name: 'John' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Hello John')
    })

    it('should resolve multiple placeholders', () => {
      const text = 'Hello {{name}}, you are {{age}} years old'
      const values = { name: 'John', age: '25' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Hello John, you are 25 years old')
    })

    it('should keep unresolved placeholders', () => {
      const text = 'Hello {{name}}, you live in {{city}}'
      const values = { name: 'John' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Hello John, you live in {{city}}')
    })

    it('should handle duplicate placeholders', () => {
      const text = '{{name}} and {{name}} again'
      const values = { name: 'John' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('John and John again')
    })

    it('should handle text without placeholders', () => {
      const text = 'Hello world'
      const values = {}
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Hello world')
    })

    it('should not resolve empty string values', () => {
      const text = 'Hello {{name}}'
      const values = { name: '' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Hello {{name}}')
    })

    it('should resolve global variables', () => {
      const text = 'Stack: {{global_stack}}'
      const values = { global_stack: 'React, TypeScript' }
      const result = resolvePlaceholders(text, values)
      expect(result).toBe('Stack: React, TypeScript')
    })
  })

  describe('getUnresolvedPlaceholders', () => {
    it('should return empty array when all resolved', () => {
      const text = 'Hello {{name}}'
      const values = { name: 'John' }
      const result = getUnresolvedPlaceholders(text, values)
      expect(result).toEqual([])
    })

    it('should return unresolved placeholders', () => {
      const text = 'Hello {{name}}, you live in {{city}}'
      const values = { name: 'John' }
      const result = getUnresolvedPlaceholders(text, values)
      expect(result).toEqual(['city'])
    })

    it('should return all placeholders when none resolved', () => {
      const text = 'Hello {{name}}, you are {{age}}'
      const values = {}
      const result = getUnresolvedPlaceholders(text, values)
      expect(result).toEqual(['name', 'age'])
    })

    it('should handle duplicate placeholders', () => {
      const text = '{{name}} and {{name}} in {{city}}'
      const values = {}
      const result = getUnresolvedPlaceholders(text, values)
      expect(result).toEqual(['name', 'city'])
    })
  })

  describe('segmentText', () => {
    it('should segment text with resolved placeholder', () => {
      const text = 'Hello {{name}}'
      const values = { name: 'John' }
      const result = segmentText(text, values)

      expect(result).toEqual([
        { type: 'text', content: 'Hello ' },
        { type: 'placeholder_resolved', content: 'John', placeholder: 'name' },
      ])
    })

    it('should segment text with unresolved placeholder', () => {
      const text = 'Hello {{name}}'
      const values = {}
      const result = segmentText(text, values)

      expect(result).toEqual([
        { type: 'text', content: 'Hello ' },
        { type: 'placeholder_unresolved', content: '{{name}}', placeholder: 'name' },
      ])
    })

    it('should segment text with mixed placeholders', () => {
      const text = '{{greeting}} {{name}}, you live in {{city}}'
      const values = { greeting: 'Hello', name: 'John' }
      const result = segmentText(text, values)

      expect(result).toEqual([
        { type: 'placeholder_resolved', content: 'Hello', placeholder: 'greeting' },
        { type: 'text', content: ' ' },
        { type: 'placeholder_resolved', content: 'John', placeholder: 'name' },
        { type: 'text', content: ', you live in ' },
        { type: 'placeholder_unresolved', content: '{{city}}', placeholder: 'city' },
      ])
    })

    it('should handle text without placeholders', () => {
      const text = 'Hello world'
      const values = {}
      const result = segmentText(text, values)

      expect(result).toEqual([
        { type: 'text', content: 'Hello world' },
      ])
    })

    it('should handle text with only placeholders', () => {
      const text = '{{name}}{{age}}'
      const values = { name: 'John', age: '25' }
      const result = segmentText(text, values)

      expect(result).toEqual([
        { type: 'placeholder_resolved', content: 'John', placeholder: 'name' },
        { type: 'placeholder_resolved', content: '25', placeholder: 'age' },
      ])
    })
  })

  describe('PLACEHOLDER_PATTERN', () => {
    it('should match basic placeholder', () => {
      const text = '{{name}}'
      const match = text.match(PLACEHOLDER_PATTERN)
      expect(match).toBeTruthy()
      expect(match![0]).toBe('{{name}}')
    })

    it('should match placeholder with underscores', () => {
      const text = '{{global_stack}}'
      const match = text.match(PLACEHOLDER_PATTERN)
      expect(match).toBeTruthy()
      expect(match![0]).toBe('{{global_stack}}')
    })

    it('should not match single braces', () => {
      const text = '{name}'
      const match = text.match(PLACEHOLDER_PATTERN)
      expect(match).toBeNull()
    })
  })
})
