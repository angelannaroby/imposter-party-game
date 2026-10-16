import { WORDS } from '../data/words';
import type { Category, Player, Round, Word } from './types';

export function randomIndex(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new Error('Invalid random range');
  // Unbiased integer generation using rejection sampling.
  const range = 0x1_0000_0000;
  const limit = range - (range % max);
  const bytes = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(bytes);
    value = bytes[0] ?? 0;
  } while (value >= limit);
  return value % max;
}

export function chooseWord(category: Category | 'all', usedIds: string[]): Word {
  const eligible = category === 'all' ? WORDS : WORDS.filter((word) => word.category === category);
  const fresh = eligible.filter((word) => !usedIds.includes(word.id));
  const pool = fresh.length ? fresh : eligible;
  const word = pool[randomIndex(pool.length)];
  if (!word) throw new Error('No words in category');
  return word;
}

export function getMaxImposters(playerCount: number): number {
  return Math.min(4, Math.max(1, playerCount - 2));
}

export function createRound(players: Player[], imposters: number, word: Word): Round {
  if (players.length < 3 || players.length > 12) throw new Error('Need 3–12 players');
  if (!Number.isInteger(imposters) || imposters < 1 || imposters > getMaxImposters(players.length)) {
    throw new Error('Invalid imposter count');
  }
  const ids = players.map((p) => p.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate player IDs');
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const imposterIds = new Set(shuffled.slice(0, imposters));
  return {
    word,
    assignments: players.map((p) => ({ playerId: p.id, role: imposterIds.has(p.id) ? 'imposter' : 'civilian' })),
    starterId: ids[randomIndex(ids.length)]!,
  };
}

export function evaluateVote(round: Round, accusedIds: string[]): 'civilians' | 'imposters' {
  const imposters = round.assignments.filter((a) => a.role === 'imposter').map((a) => a.playerId);
  return accusedIds.length === imposters.length &&
    new Set(accusedIds).size === accusedIds.length &&
    imposters.every((id) => accusedIds.includes(id))
    ? 'civilians' : 'imposters';
}
