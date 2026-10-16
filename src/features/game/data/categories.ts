import type { Category } from '../model/types';

export const CATEGORIES: ReadonlyArray<{
  id: Category | 'all';
  icon: string;
  label: string;
}> = [
  { id: 'all', icon: '✦', label: 'Surprise me' },
  { id: 'food', icon: '🍓', label: 'Food & drink' },
  { id: 'places', icon: '🌍', label: 'Places' },
  { id: 'objects', icon: '🎒', label: 'Everyday things' },
  { id: 'nature', icon: '🌿', label: 'Nature' },
  { id: 'entertainment', icon: '🎭', label: 'Entertainment' },
  { id: 'activities', icon: '🎲', label: 'Activities' },
];
