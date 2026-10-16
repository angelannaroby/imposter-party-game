import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../../data/categories';
import { WORDS } from '../../data/words';
import { getImposterHint } from '../hints';

describe('word bank and imposter clues', () => {
  it('has a substantial word bank in every selectable category', () => {
    const categoryIds = CATEGORIES.filter((category) => category.id !== 'all').map(
      (category) => category.id,
    );
    expect(new Set(WORDS.map((word) => word.category))).toEqual(new Set(categoryIds));
    for (const id of categoryIds) {
      expect(WORDS.filter((word) => word.category === id).length).toBeGreaterThanOrEqual(20);
    }
  });

  it('has unique word IDs and nonempty, word-specific hints', () => {
    expect(new Set(WORDS.map((word) => word.id)).size).toBe(WORDS.length);
    for (const word of WORDS) {
      expect(word.text.trim()).not.toBe('');
      expect(getImposterHint(word).trim()).not.toBe('');
      expect(getImposterHint(word).toLowerCase()).not.toContain(word.text.toLowerCase());
    }
  });

  it('does not reuse the same hint for every word in a category', () => {
    for (const category of CATEGORIES.filter((item) => item.id !== 'all')) {
      const hints = WORDS.filter((word) => word.category === category.id).map(getImposterHint);
      expect(new Set(hints).size).toBeGreaterThan(10);
    }
  });
});
