import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { CrewAvatar } from './CrewAvatar';
import { CrewIllustration } from './CrewIllustration';
import type { Player } from '../model/types';

interface VoteScreenProps {
  players: Player[];
  selectedIds: string[];
  imposterCount: number;
  onToggle: (id: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  onNewGame: () => void;
}

export function VoteScreen({
  players,
  selectedIds,
  imposterCount,
  onToggle,
  onConfirm,
  onBack,
  onNewGame,
}: VoteScreenProps) {
  const complete = selectedIds.length === imposterCount;
  return (
    <main className="stage-layout" aria-labelledby="vote-title">
      <div className="stage-counter">THE FINAL VOTE</div>
      <section className="stage-card vote-card vote-mission">
        <CrewIllustration mood="voting" />
        <div className="stage-label">CHOOSE YOUR SUSPECTS</div>
        <h1 id="vote-title">
          Who's <span>bluffing?</span>
        </h1>
        <div className="vote-progress" role="status" aria-live="polite">
          <span>
            {selectedIds.length} / {imposterCount} selected
          </span>
          <span className="vote-progress__pips" aria-hidden="true">
            {Array.from({ length: imposterCount }, (_, index) => (
              <span key={index} className={index < selectedIds.length ? 'is-filled' : ''} />
            ))}
          </span>
        </div>
        <div className="suspect-grid" aria-label="Select suspected imposters">
          {players.map((player, index) => {
            const selected = selectedIds.includes(player.id);
            const selectionFull = !selected && complete;
            return (
              <button
                key={player.id}
                type="button"
                className={`suspect-tile ${selected ? 'is-selected' : ''}`}
                aria-pressed={selected}
                aria-label={`${player.name}, ${selected ? 'selected' : 'not selected'}`}
                disabled={selectionFull}
                onClick={() => onToggle(player.id)}
              >
                <span className="suspect-tile__check" aria-hidden="true">
                  {selected && <Check size={16} strokeWidth={3} />}
                </span>
                <CrewAvatar index={index} size="large" />
                <span className="suspect-tile__name">{player.name}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="primary-button" disabled={!complete} onClick={onConfirm}>
          Confirm vote <ArrowRight size={19} aria-hidden="true" />
        </button>
        <button type="button" className="secondary-button" onClick={onNewGame}>
          <RotateCcw size={18} aria-hidden="true" /> New game
        </button>
        <button type="button" className="subtle-link" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to discussion
        </button>
      </section>
    </main>
  );
}
