import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  stripMarkdown,
  formatForCopy,
  copyToClipboard,
  copyFormatLabels,
} from '../copy-utils'

describe('copy-utils', () => {
  describe('stripMarkdown', () => {
    it('should remove code blocks and keep content', () => {
      const md = '```typescript\nconst x = 1;\n```'
      const result = stripMarkdown(md)
      expect(result).toBe('const x = 1;')
    })

    it('should remove inline code backticks', () => {
      const md = 'Use `const` for variables'
      const result = stripMarkdown(md)
      expect(result).toBe('Use const for variables')
    })

    it('should remove images but keep alt text', () => {
      const md = 'Check this ![alt text](image.png)'
      const result = stripMarkdown(md)
      expect(result).toBe('Check this alt text')
    })

    it('should remove links but keep text', () => {
      const md = 'Visit [Google](https://google.com)'
      const result = stripMarkdown(md)
      expect(result).toBe('Visit Google')
    })

    it('should remove headers', () => {
      const md = '# Header 1\n## Header 2\nText'
      const result = stripMarkdown(md)
      expect(result).toBe('Header 1\nHeader 2\nText')
    })

    it('should remove bold formatting', () => {
      const md = 'This is **bold** and __also bold__'
      const result = stripMarkdown(md)
      expect(result).toBe('This is bold and also bold')
    })

    it('should remove italic formatting', () => {
      const md = 'This is *italic* and _also italic_'
      const result = stripMarkdown(md)
      expect(result).toBe('This is italic and also italic')
    })

    it('should remove blockquotes', () => {
      const md = '> This is a quote\n> Another line'
      const result = stripMarkdown(md)
      expect(result).toBe('This is a quote\nAnother line')
    })

    it('should remove horizontal rules', () => {
      const md = 'Text\n---\nMore text'
      const result = stripMarkdown(md)
      expect(result).toBe('Text\nMore text')
    })

    it('should remove unordered list markers', () => {
      const md = '- Item 1\n* Item 2\n+ Item 3'
      const result = stripMarkdown(md)
      expect(result).toBe('Item 1\nItem 2\nItem 3')
    })

    it('should remove ordered list markers', () => {
      const md = '1. First\n2. Second\n3. Third'
      const result = stripMarkdown(md)
      expect(result).toBe('First\nSecond\nThird')
    })

    it('should clean up extra whitespace', () => {
      const md = 'Text\n\n\n\nMore text'
      const result = stripMarkdown(md)
      expect(result).toBe('Text\n\nMore text')
    })

    it('should handle complex markdown', () => {
      const md = `# Title
## Subtitle
This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`typescript
const x = 1;
\`\`\`

Visit [Link](url)`

      const result = stripMarkdown(md)
      expect(result).toContain('Title')
      expect(result).toContain('bold and italic')
      expect(result).toContain('const x = 1;')
      expect(result).toContain('Link')
      expect(result).not.toContain('**')
      expect(result).not.toContain('```')
    })
  })

  describe('formatForCopy', () => {
    const content = 'Test content with **markdown**'
    const payload = {
      promptId: 'test-prompt',
      promptTitle: 'Test Prompt',
      selectedVariant: 'intermediate' as const,
      resolvedVariables: { name: 'John' },
      prePrompt: 'You are a helper',
    }

    it('should return content as-is for chat_markdown format', () => {
      const result = formatForCopy('chat_markdown', content, payload)
      expect(result).toBe(content)
    })

    it('should return JSON for json format', () => {
      const result = formatForCopy('json', content, payload)
      const parsed = JSON.parse(result)

      expect(parsed).toHaveProperty('promptId', 'test-prompt')
      expect(parsed).toHaveProperty('promptTitle', 'Test Prompt')
      expect(parsed).toHaveProperty('selectedVariant', 'intermediate')
      expect(parsed).toHaveProperty('resolvedVariables')
      expect(parsed).toHaveProperty('resolvedPromptMarkdown', content)
      expect(parsed).toHaveProperty('prePrompt', 'You are a helper')
      expect(parsed).toHaveProperty('createdAt')
    })

    it('should strip markdown for raw_text format', () => {
      const result = formatForCopy('raw_text', content, payload)
      expect(result).toBe('Test content with markdown')
      expect(result).not.toContain('**')
    })

    it('should handle missing payload', () => {
      const result = formatForCopy('json', content)
      const parsed = JSON.parse(result)

      expect(parsed).toHaveProperty('resolvedPromptMarkdown', content)
      expect(parsed).toHaveProperty('createdAt')
    })

    it('should format JSON with proper indentation', () => {
      const result = formatForCopy('json', content, payload)
      expect(result).toContain('\n')
      expect(result).toContain('  ') // 2 spaces indentation
    })
  })

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Reset clipboard mock
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      })
    })

    it('should copy text to clipboard successfully', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      const result = await copyToClipboard('test text')

      expect(writeTextMock).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Failed'))
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await copyToClipboard('test text')

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('copyFormatLabels', () => {
    it('should have German labels for all formats', () => {
      expect(copyFormatLabels.chat_markdown).toBe('Für Chat (Markdown)')
      expect(copyFormatLabels.json).toBe('Als JSON (API)')
      expect(copyFormatLabels.raw_text).toBe('Nur Text')
    })

    it('should have labels for all format types', () => {
      const formats: Array<keyof typeof copyFormatLabels> = [
        'chat_markdown',
        'json',
        'raw_text',
      ]

      formats.forEach(format => {
        expect(copyFormatLabels[format]).toBeTruthy()
        expect(typeof copyFormatLabels[format]).toBe('string')
      })
    })
  })
})
