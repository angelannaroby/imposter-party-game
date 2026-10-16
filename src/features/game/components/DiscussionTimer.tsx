import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';

type TimerDuration = 0 | 60 | 90 | 120;
const DURATIONS: readonly TimerDuration[] = [0, 60, 90, 120];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function DiscussionTimer() {
  const [duration, setDuration] = useState<TimerDuration>(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remainingSeconds === 0) return;
    const intervalId = window.setInterval(() => {
      setRemainingSeconds((remaining) => {
        if (remaining <= 1) {
          setRunning(false);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [running, remainingSeconds]);

  function selectDuration(nextDuration: TimerDuration) {
    setDuration(nextDuration);
    setRemainingSeconds(nextDuration);
    setRunning(false);
  }

  return (
    <div className="discussion-timer">
      <div className="timer-title">
        <Timer size={17} /> DISCUSSION TIMER <span>OPTIONAL</span>
      </div>
      <div className="timer-options" role="group" aria-label="Discussion timer duration">
        {DURATIONS.map((seconds) => (
          <button
            key={seconds}
            type="button"
            aria-pressed={duration === seconds}
            className={duration === seconds ? 'selected' : ''}
            onClick={() => selectDuration(seconds)}
          >
            {seconds === 0 ? 'Off' : `${seconds / 60}${seconds % 60 ? ':30' : ':00'}`}
          </button>
        ))}
      </div>
      {duration !== 0 && (
        <div className="timer-controls">
          <output className={remainingSeconds === 0 ? 'timer-finished' : ''} aria-live="off">
            {remainingSeconds === 0 ? 'TIME!' : formatTime(remainingSeconds)}
          </output>
          <button
            type="button"
            aria-label={running ? 'Pause timer' : 'Start timer'}
            onClick={() => {
              if (remainingSeconds === 0) setRemainingSeconds(duration);
              setRunning(!running);
            }}
          >
            {running ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            type="button"
            aria-label="Reset timer"
            onClick={() => {
              setRunning(false);
              setRemainingSeconds(duration);
            }}
          >
            <RotateCcw size={19} />
          </button>
        </div>
      )}
    </div>
  );
}
