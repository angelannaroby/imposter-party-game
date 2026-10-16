import { describe, expect, it } from 'vitest';
import { chooseWord, createRound, evaluateVote } from '../engine';
import type { Player } from '../types';

const players: Player[] = Array.from({ length: 7 }, (_, i) => ({
  id: `p${i}`,
  name: `Player ${i + 1}`,
}));

describe('game engine', () => {
  it('assigns exactly one imposter to a small game', () => {
    const round = createRound(players.slice(0, 4), 1, chooseWord('food', []));
    expect(round.assignments.filter((a) => a.role === 'imposter')).toHaveLength(1);
  });
  it('supports two unique imposters in games with six or more players', () => {
    const round = createRound(players, 2, chooseWord('places', []));
    expect(round.assignments.filter((a) => a.role === 'imposter')).toHaveLength(2);
  });
  it('avoids previously used words while alternatives remain', () => {
    const first = chooseWord('nature', []);
    expect(chooseWord('nature', [first.id]).id).not.toBe(first.id);
  });
  it('only gives civilians victory for the exact imposter selection', () => {
    const round = createRound(players, 2, chooseWord('objects', []));
    const guilty = round.assignments.filter((a) => a.role === 'imposter').map((a) => a.playerId);
    expect(evaluateVote(round, guilty)).toBe('civilians');
    expect(evaluateVote(round, [guilty[0]!])).toBe('imposters');
    expect(evaluateVote(round, [guilty[0]!, guilty[0]!])).toBe('imposters');
  });
  it('prevents an unfair two-imposter game with three players', () => {
    expect(() => createRound(players.slice(0, 3), 2, chooseWord('food', []))).toThrow();
  });
});
