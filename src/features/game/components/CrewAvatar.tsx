import type { CSSProperties } from 'react';

const AVATAR_COLORS = [
  '#ff9f6e',
  '#ad91ff',
  '#6be1bb',
  '#ffcd72',
  '#79c9ff',
  '#ff89bc',
  '#9bd66e',
  '#e2a3ff',
  '#ffb384',
  '#6ce5dc',
  '#a9b2ff',
  '#f6d97a',
] as const;

interface CrewAvatarProps {
  index: number;
  size?: 'small' | 'medium' | 'large';
}

/** Stable by seat number; artwork is decorative and never reveals a player's role. */
export function CrewAvatar({ index, size = 'medium' }: CrewAvatarProps) {
  const style = { '--avatar-color': AVATAR_COLORS[index % AVATAR_COLORS.length] } as CSSProperties;
  return (
    <span className={`crew-avatar crew-avatar--${size}`} style={style} aria-hidden="true">
      <span className="crew-avatar__antenna" />
      <span className="crew-avatar__body">
        <span className="crew-avatar__visor">
          <span className="crew-avatar__eye" />
          <span className="crew-avatar__eye" />
        </span>
      </span>
      <span className="crew-avatar__feet" />
    </span>
  );
}
