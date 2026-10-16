import type { Category, Word } from './types';

/** A category-level clue; intentionally never derives or exposes the secret word. */
const CATEGORY_HINTS: Record<Category, string> = {
  food: 'Something you can eat or drink',
  places: 'Somewhere you could go',
  objects: 'A physical thing',
  nature: 'Something from the natural world',
  entertainment: 'Something people watch, read or enjoy',
  activities: 'Something people do',
};

export function getImposterHint(word: Word): string {
  return CATEGORY_HINTS[word.category];
}
