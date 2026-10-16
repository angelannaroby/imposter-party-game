import type { CSSProperties } from 'react';

type CrewColor = 'orange' | 'purple' | 'green';
type CrewMood = 'handoff' | 'secret' | 'discussion' | 'voting' | 'victory' | 'escape';

interface CrewIllustrationProps {
  mood: CrewMood;
}

const COLORS: Record<CrewColor, string> = {
  orange: '#ff9c58',
  purple: '#ae91ff',
  green: '#66e0bb',
};

export function CrewIllustration({ mood }: CrewIllustrationProps) {
  return (
    <div className={`mission-art mission-art--${mood}`} aria-hidden="true">
      <span className="mission-art__orbit" />
      <span className="mission-art__star mission-art__star--one">✦</span>
      <span className="mission-art__star mission-art__star--two">✧</span>
      <span className="mission-art__planet" />
      {(Object.keys(COLORS) as CrewColor[]).map((color) => (
        <div
          className={`mission-alien mission-alien--${color}`}
          key={color}
          style={{ '--alien-color': COLORS[color] } as CSSProperties}
        >
          <span className="mission-alien__antenna" />
          <span className="mission-alien__body">
            <span className="mission-alien__eye mission-alien__eye--left" />
            <span className="mission-alien__eye mission-alien__eye--right" />
            <span className="mission-alien__cheek" />
          </span>
          <span className="mission-alien__feet" />
        </div>
      ))}
      <span className="mission-art__floor" />
    </div>
  );
}
