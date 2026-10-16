import type { Word } from './types';

/** A curated association to the specific secret word, shown only to imposters. */
export function getImposterHint(word: Word): string {
  return word.hint;
}
