import { describe, expect, it } from 'vitest';
import { chooseWord, createRound, evaluateVote, getMaxImposters } from '../engine';
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
  it('allows up to four imposters with enough players', () => {
    const tenPlayers = Array.from({ length: 10 }, (_, index) => ({
      id: `player-${index}`,
      name: `Player ${index}`,
    }));
    const round = createRound(tenPlayers, 4, chooseWord('food', []));
    expect(round.assignments.filter((assignment) => assignment.role === 'imposter')).toHaveLength(
      4,
    );
    expect(() => createRound(tenPlayers, 5, chooseWord('food', []))).toThrow();
  });
  it('limits imposters to leave at least two regular players', () => {
    expect(getMaxImposters(3)).toBe(1);
    expect(getMaxImposters(4)).toBe(2);
    expect(getMaxImposters(5)).toBe(3);
    expect(getMaxImposters(6)).toBe(4);
    expect(getMaxImposters(12)).toBe(4);
  });
  it('prevents an unfair two-imposter game with three players', () => {
    expect(() => createRound(players.slice(0, 3), 2, chooseWord('food', []))).toThrow();
  });
});
