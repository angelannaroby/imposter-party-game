export type Category =
  | 'food'
  | 'places'
  | 'objects'
  | 'nature'
  | 'entertainment'
  | 'activities'
  | 'animals'
  | 'sports'
  | 'jobs'
  | 'home'
  | 'technology'
  | 'transport'
  | 'fashion'
  | 'fantasy'
  | 'mallumovies';
export type Word = { id: string; category: Category; text: string; hint: string };
export type Player = { id: string; name: string };
export type Role = 'civilian' | 'imposter';
export type Assignment = { playerId: string; role: Role };
export type Round = {
  word: Word;
  assignments: Assignment[];
  starterId: string;
};
export type GameSettings = { imposters: number; category: Category | 'all' };
export type Phase = 'setup' | 'pass' | 'peek' | 'discuss' | 'vote' | 'result';
