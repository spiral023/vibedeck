import { describe, it, expect } from 'vitest';
import { extractPlaceholders, isPlaceholderResolved, resolvePlaceholders, getUnresolvedPlaceholders, segmentText } from './placeholder-utils';

describe('placeholder-utils', () => {
  const text = 'Hello {{name}}, welcome to {{city}}!';
  const values = { name: 'Alice', city: 'Berlin' };
  const partialValues = { name: 'Alice' };

  it('extracts placeholders correctly', () => {
    expect(extractPlaceholders(text)).toEqual(['name', 'city']);
  });

  it('checks if placeholder is resolved', () => {
    expect(isPlaceholderResolved('name', values)).toBe(true);
    expect(isPlaceholderResolved('city', partialValues)).toBe(false);
  });

  it('resolves placeholders correctly', () => {
    expect(resolvePlaceholders(text, values)).toBe('Hello Alice, welcome to Berlin!');
    expect(resolvePlaceholders(text, partialValues)).toBe('Hello Alice, welcome to {{city}}!');
  });

  it('gets unresolved placeholders', () => {
    expect(getUnresolvedPlaceholders(text, values)).toEqual([]);
    expect(getUnresolvedPlaceholders(text, partialValues)).toEqual(['city']);
  });

  it('segments text correctly', () => {
    const segments = segmentText(text, values);
    expect(segments).toHaveLength(5);
    expect(segments[0]).toEqual({ type: 'text', content: 'Hello ' });
    expect(segments[1]).toEqual({ type: 'placeholder_resolved', content: 'Alice', placeholder: 'name' });
    expect(segments[2]).toEqual({ type: 'text', content: ', welcome to ' });
    expect(segments[3]).toEqual({ type: 'placeholder_resolved', content: 'Berlin', placeholder: 'city' });
    expect(segments[4]).toEqual({ type: 'text', content: '!' });
  });
});
