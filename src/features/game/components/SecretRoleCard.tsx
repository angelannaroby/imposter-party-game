import { EyeOff, Fingerprint, ShieldAlert, Sparkles } from 'lucide-react';
import type { PointerEvent } from 'react';
import { getImposterHint } from '../model/hints';
import type { Assignment, Word } from '../model/types';

interface SecretRoleCardProps {
  assignment: Assignment | undefined;
  word: Word;
  revealed: boolean;
  onRevealChange: (revealed: boolean) => void;
}

/** A transient reveal: role information must never remain visible after release. */
export function SecretRoleCard({
  assignment,
  word,
  revealed,
  onRevealChange,
}: SecretRoleCardProps) {
  const isImposter = assignment?.role === 'imposter';

  function reveal(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onRevealChange(true);
  }

  return (
    <button
      type="button"
      className={`secret-card role-vault ${revealed ? 'revealed' : ''} ${isImposter ? 'imposter-role' : ''}`}
      onPointerDown={reveal}
      onPointerUp={() => onRevealChange(false)}
      onPointerCancel={() => onRevealChange(false)}
      onLostPointerCapture={() => onRevealChange(false)}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          onRevealChange(true);
        }
      }}
      onKeyUp={(event) => {
        if (event.key === ' ' || event.key === 'Enter') onRevealChange(false);
      }}
      onBlur={() => onRevealChange(false)}
      aria-label="Hold to reveal"
      aria-pressed={revealed}
    >
      <span className="role-vault__halo" aria-hidden="true" />
      {revealed ? (
        <span className="role-vault__contents" aria-live="off">
          {isImposter ? (
            <ShieldAlert size={38} aria-hidden="true" />
          ) : (
            <Sparkles size={38} aria-hidden="true" />
          )}
          <span className="secret-label">
            {isImposter ? 'YOU ARE THE IMPOSTER' : 'YOUR SECRET WORD'}
          </span>
          <strong>{isImposter ? '???' : word.text}</strong>
          {isImposter && <span className="imposter-hint">HINT · {getImposterHint(word)}</span>}
        </span>
      ) : (
        <span className="role-vault__contents role-vault__locked">
          <Fingerprint size={55} strokeWidth={1.5} aria-hidden="true" />
          <strong>TOP SECRET</strong>
          <span className="role-vault__action">
            <EyeOff size={18} aria-hidden="true" /> Hold to reveal
          </span>
        </span>
      )}
    </button>
  );
}
