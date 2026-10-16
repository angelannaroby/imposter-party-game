import { describe, expect, it } from 'vitest';
import { WORDS } from '../../data/words';
import { getImposterHint } from '../hints';

const expectedCategories = new Set(['food', 'places', 'objects', 'nature', 'entertainment', 'activities']);

describe('imposter hints', () => {
  it('provides a hint for every available category', () => {
    expect(new Set(WORDS.map((word) => word.category))).toEqual(expectedCategories);
    for (const word of WORDS) {
      expect(getImposterHint(word).length).toBeGreaterThan(10);
    }
  });

  it('does not contain the secret word in the hint', () => {
    for (const word of WORDS) {
      expect(getImposterHint(word).toLowerCase()).not.toContain(word.text.toLowerCase());
    }
  });
});
