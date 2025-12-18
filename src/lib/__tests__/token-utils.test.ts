import { describe, it, expect } from 'vitest'
import {
  MODEL_PRICING,
  calculateCost,
  formatCost,
  formatNumber,
  countTokens,
} from '../token-utils'

describe('token-utils', () => {
  describe('MODEL_PRICING', () => {
    it('should have pricing for GPT models', () => {
      expect(MODEL_PRICING['gpt-4o']).toBeDefined()
      expect(MODEL_PRICING['gpt-4o'].input).toBe(2.5)
      expect(MODEL_PRICING['gpt-4o'].output).toBe(10)
      expect(MODEL_PRICING['gpt-4o'].name).toBe('GPT-4o')
    })

    it('should have pricing for Claude models', () => {
      expect(MODEL_PRICING['claude-3.5-sonnet']).toBeDefined()
      expect(MODEL_PRICING['claude-3.5-sonnet'].input).toBe(3)
      expect(MODEL_PRICING['claude-3.5-sonnet'].output).toBe(15)
    })

    it('should have pricing for all listed models', () => {
      const expectedModels = [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'claude-3.5-sonnet',
        'claude-3-opus',
        'gemini-pro',
      ]

      expectedModels.forEach(model => {
        expect(MODEL_PRICING[model]).toBeDefined()
        expect(MODEL_PRICING[model].input).toBeGreaterThan(0)
        expect(MODEL_PRICING[model].output).toBeGreaterThan(0)
        expect(MODEL_PRICING[model].name).toBeTruthy()
      })
    })
  })

  describe('calculateCost', () => {
    it('should calculate cost correctly for GPT-4o', () => {
      const inputTokens = 1_000_000 // 1M tokens
      const outputTokens = 1_000_000 // 1M tokens
      const cost = calculateCost(inputTokens, outputTokens, 'gpt-4o')

      // (1M / 1M) * 2.5 + (1M / 1M) * 10 = 12.5
      expect(cost).toBe(12.5)
    })

    it('should calculate cost for small token counts', () => {
      const inputTokens = 1000 // 1k tokens
      const outputTokens = 500 // 0.5k tokens
      const cost = calculateCost(inputTokens, outputTokens, 'gpt-4o-mini')

      // (1000 / 1M) * 0.15 + (500 / 1M) * 0.6
      const expected = (1000 / 1_000_000) * 0.15 + (500 / 1_000_000) * 0.6
      expect(cost).toBeCloseTo(expected, 10)
    })

    it('should return 0 for unknown model', () => {
      const cost = calculateCost(1000, 1000, 'unknown-model')
      expect(cost).toBe(0)
    })

    it('should handle zero tokens', () => {
      const cost = calculateCost(0, 0, 'gpt-4o')
      expect(cost).toBe(0)
    })

    it('should calculate different costs for different models', () => {
      const inputTokens = 100_000
      const outputTokens = 100_000

      const gpt4oCost = calculateCost(inputTokens, outputTokens, 'gpt-4o')
      const miniCost = calculateCost(inputTokens, outputTokens, 'gpt-4o-mini')

      expect(gpt4oCost).toBeGreaterThan(miniCost)
    })
  })

  describe('formatCost', () => {
    it('should format cost with German locale', () => {
      const cost = 0.0012345
      const formatted = formatCost(cost)

      // Should use comma as decimal separator (German)
      expect(formatted).toContain(',')
      // Should contain dollar sign
      expect(formatted).toContain('$')
    })

    it('should format cost with minimum 4 decimal places', () => {
      const cost = 0.01
      const formatted = formatCost(cost)

      // Should have at least 4 decimal places
      const decimals = formatted.split(',')[1]?.replace(/[^0-9]/g, '')
      expect(decimals?.length).toBeGreaterThanOrEqual(4)
    })

    it('should handle very small costs', () => {
      const cost = 0.000001
      const formatted = formatCost(cost)

      expect(formatted).toBeTruthy()
      expect(formatted).toContain('$')
    })

    it('should handle larger costs', () => {
      const cost = 123.456789
      const formatted = formatCost(cost)

      expect(formatted).toBeTruthy()
      expect(formatted).toContain('123')
    })
  })

  describe('formatNumber', () => {
    it('should format with German locale', () => {
      const num = 1234567
      const formatted = formatNumber(num)

      // German uses dot as thousands separator
      expect(formatted).toContain('.')
      expect(formatted).toBe('1.234.567')
    })

    it('should format small numbers', () => {
      const num = 123
      const formatted = formatNumber(num)
      expect(formatted).toBe('123')
    })

    it('should format decimal numbers', () => {
      const num = 1234.56
      const formatted = formatNumber(num)

      // Should use comma as decimal separator
      expect(formatted).toContain(',')
    })

    it('should handle zero', () => {
      const formatted = formatNumber(0)
      expect(formatted).toBe('0')
    })
  })

  describe('countTokens', () => {
    it('should count tokens for simple text', async () => {
      const text = 'Hello world'
      const count = await countTokens(text)

      expect(count).toBeGreaterThan(0)
      expect(typeof count).toBe('number')
    })

    it('should return different counts for different texts', async () => {
      const shortText = 'Hi'
      const longText = 'This is a much longer text with more words'

      const shortCount = await countTokens(shortText)
      const longCount = await countTokens(longText)

      expect(longCount).toBeGreaterThan(shortCount)
    })

    it('should handle empty string', async () => {
      const count = await countTokens('')
      expect(count).toBe(0)
    })

    it('should handle multiline text', async () => {
      const text = `Line 1
Line 2
Line 3`
      const count = await countTokens(text)

      expect(count).toBeGreaterThan(0)
    })

    it('should handle special characters', async () => {
      const text = 'Special chars: 🎨 {{placeholder}} **markdown**'
      const count = await countTokens(text)

      expect(count).toBeGreaterThan(0)
    })

    it('should handle code blocks', async () => {
      const text = '```typescript\nconst x = 1;\n```'
      const count = await countTokens(text)

      expect(count).toBeGreaterThan(0)
    })
  })
})
