import { describe, it, expect } from 'vitest';
import { encodeState, decodeState, type BuilderForm } from './prompt-builder-utils';

describe('prompt-builder-utils', () => {
  const validForm: BuilderForm = {
    project_name: 'Test App',
    language: 'de',
    experience_level: 'beginner',
    stack: 'Next.js',
    user_flow: 'User logs in and sees dashboard',
    include_explanations: true,
  };

  it('encodes and decodes state correctly', () => {
    const encoded = encodeState(validForm);
    const decoded = decodeState(encoded);
    expect(decoded).toEqual(validForm);
  });

  it('handles invalid base64 gracefully', () => {
    expect(decodeState('invalid-base64')).toBeNull();
  });

  it('validates schema on decode', () => {
    // missing project_name
    const invalidData = { language: 'de' };
    const encoded = btoa(JSON.stringify(invalidData)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(decodeState(encoded)).toBeNull();
  });
});
