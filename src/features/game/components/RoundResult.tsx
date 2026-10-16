import { ArrowLeft, Check, RotateCcw, ShieldQuestion, Sparkles } from 'lucide-react';
import { CrewIllustration } from './CrewIllustration';
import type { Player, Round } from '../model/types';

interface RoundResultProps {
  round: Round;
  players: Player[];
  winner: 'civilians' | 'imposters';
  onNewGame: () => void;
  onSettings: () => void;
}

export function RoundResult({ round, players, winner, onNewGame, onSettings }: RoundResultProps) {
  const crewWins = winner === 'civilians';
  const imposters = round.assignments
    .filter(({ role }) => role === 'imposter')
    .map(({ playerId }) => players.find(({ id }) => id === playerId))
    .filter((player): player is Player => player !== undefined);

  return (
    <main className="stage-layout result-stage">
      <div className="stage-counter">MISSION COMPLETE</div>
      <section
        className={`stage-card result-card ${crewWins ? 'result-card--crew' : 'result-card--imposters'}`}
        aria-labelledby="result-heading"
      >
        <div className="result-sparkles" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index}>✦</span>
          ))}
        </div>
        <CrewIllustration mood={crewWins ? 'victory' : 'escape'} />
        <span className="result-badge">
          {crewWins ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <ShieldQuestion size={16} aria-hidden="true" />
          )}
          {crewWins ? 'CREW WINS' : 'IMPOSTERS WIN'}
        </span>
        <h1 id="result-heading">
          {crewWins ? (
            <>
              You caught <span>them!</span>
            </>
          ) : (
            <>
              They got <span>away!</span>
            </>
          )}
        </h1>
        <div className="result-reveal-grid">
          <div className="result-reveal result-reveal--imposters">
            <span className="result-reveal__label">
              <ShieldQuestion size={15} aria-hidden="true" /> THE IMPOSTERS
            </span>
            <div className="result-player-list">
              {imposters.map((player, index) => (
                <span className="result-player" key={player.id}>
                  <span
                    className={`result-player__avatar result-player__avatar--${index % 4}`}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                  {player.name}
                </span>
              ))}
            </div>
          </div>
          <div className="result-reveal result-reveal--word">
            <span className="result-reveal__label">
              <Sparkles size={15} aria-hidden="true" /> SECRET WORD
            </span>
            <strong className="result-secret-word">{round.word.text}</strong>
          </div>
        </div>
        <button type="button" className="primary-button" onClick={onNewGame}>
          <RotateCcw size={19} aria-hidden="true" /> PLAY AGAIN
        </button>
        <button type="button" className="subtle-link" onClick={onSettings}>
          <ArrowLeft size={16} aria-hidden="true" /> Change players / settings
        </button>
      </section>
    </main>
  );
}
