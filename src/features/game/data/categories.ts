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
  { id: 'animals', icon: '🐾', label: 'Animals' },
  { id: 'sports', icon: '🏀', label: 'Sports' },
  { id: 'jobs', icon: '🧑‍🚀', label: 'Jobs' },
  { id: 'home', icon: '🏠', label: 'At home' },
  { id: 'technology', icon: '📱', label: 'Technology' },
  { id: 'transport', icon: '🚀', label: 'Transport' },
  { id: 'fashion', icon: '👟', label: 'Fashion' },
  { id: 'fantasy', icon: '🧙', label: 'Fantasy' },
  { id: 'mallumovies', icon: '🎬', label: 'മല്ലു മൂവീസ്' },
];
