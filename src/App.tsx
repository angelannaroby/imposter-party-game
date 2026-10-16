import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Gamepad2,
  Orbit,
  Play,
  RotateCcw,
  ShieldQuestion,
  Shuffle,
  Sparkles,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { DiscussionTimer } from './features/game/components/DiscussionTimer';
import { CrewIllustration } from './features/game/components/CrewIllustration';
import { SecretRoleCard } from './features/game/components/SecretRoleCard';
import { RoundResult } from './features/game/components/RoundResult';
import { CrewAvatar } from './features/game/components/CrewAvatar';
import { VoteScreen } from './features/game/components/VoteScreen';
import { CATEGORIES } from './features/game/data/categories';
import { WORDS } from './features/game/data/words';
import { GAME_COPY } from './features/game/content';
import {
  chooseWord,
  createRound,
  evaluateVote,
  getMaxImposters,
} from './features/game/model/engine';
import type { GameSettings, Phase, Player, Round } from './features/game/model/types';

const createInitialPlayers = (): Player[] =>
  Array.from({ length: 4 }, (_, i) => ({ id: `player-${i + 1}`, name: `Player ${i + 1}` }));

function App() {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers);
  const setupRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<GameSettings>({ category: 'all', imposters: 1 });
  const [phase, setPhase] = useState<Phase>('setup');
  const [round, setRound] = useState<Round | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [accused, setAccused] = useState<string[]>([]);
  const [error, setError] = useState('');
  const t = GAME_COPY;
  const maxImposters = getMaxImposters(players.length);
  const imposters = Math.min(settings.imposters, maxImposters);
  const activePlayer = players[currentPlayer];
  const assignment = round?.assignments.find((a) => a.playerId === activePlayer?.id);
  const result = round ? evaluateVote(round, accused) : null;
  const nextId =
    players.reduce((max, p) => Math.max(max, Number(p.id.replace('player-', '')) || 0), 0) + 1;

  function startGame() {
    const names = players.map((p) => p.name.trim().toLocaleLowerCase());
    if (players.length < 3 || names.some((name) => !name)) {
      setError(t.min);
      return;
    }
    if (new Set(names).size !== names.length) {
      setError(t.duplicate);
      return;
    }
    const word = chooseWord(settings.category, usedIds);
    setUsedIds((previous) => [...previous, word.id]);
    setRound(createRound(players, imposters, word));
    setCurrentPlayer(0);
    setAccused([]);
    setShowRole(false);
    setError('');
    setPhase('pass');
  }

  function advance() {
    if (showRole) return;
    setShowRole(false);
    if (currentPlayer + 1 >= players.length) setPhase('discuss');
    else {
      setCurrentPlayer((i) => i + 1);
      setPhase('pass');
    }
  }

  useEffect(() => {
    const concealRole = () => setShowRole(false);
    document.addEventListener('visibilitychange', concealRole);
    window.addEventListener('blur', concealRole);
    return () => {
      document.removeEventListener('visibilitychange', concealRole);
      window.removeEventListener('blur', concealRole);
    };
  }, []);

  function startNewRound() {
    startGame();
  }

  useEffect(() => {
    if (phase !== 'setup') {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }
  }, [phase]);

  function toggleAccused(id: string) {
    setAccused((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : previous.length < imposters
          ? [...previous, id]
          : previous,
    );
  }

  function updateName(id: string, name: string) {
    setPlayers((previous) => previous.map((p) => (p.id === id ? { ...p, name } : p)));
    setError('');
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <div className="site-wrap">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Orbit size={21} strokeWidth={2.5} />
            </span>
            <span>
              IMPOSTER<span className="brand-accent">.</span>
            </span>
          </div>
          <span className="topbar-tag">
            <span className="live-dot" /> PARTY MODE ON
          </span>
        </header>

        {phase === 'setup' && (
          <main>
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-stars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="hero-planet hero-planet-left" aria-hidden="true" />
              <div className="hero-planet hero-planet-right" aria-hidden="true" />
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="live-dot" /> THE ULTIMATE BLUFFING GAME
                </div>
                <h1 id="hero-title">
                  TRUST NO <span>ONE.</span>
                </h1>
                <p>
                  Same crew. Same secret word. <strong>Some sneaky imposters.</strong> Can you spot
                  the liar?
                </p>
              </div>
              <div
                className="crew-scene"
                aria-label="Colourful space creatures gathered around a glowing table"
                role="img"
              >
                <div className="orbit-ring orbit-ring-one" />
                <div className="orbit-ring orbit-ring-two" />
                <span className="scene-spark scene-spark-one">✦</span>
                <span className="scene-spark scene-spark-two">✧</span>
                <div className="crew-mate crew-orange">
                  <div className="crew-backpack" />
                  <div className="crew-body">
                    <div className="crew-visor" />
                  </div>
                  <div className="crew-leg crew-leg-left" />
                  <div className="crew-leg crew-leg-right" />
                </div>
                <div className="crew-mate crew-purple">
                  <div className="crew-backpack" />
                  <div className="crew-body">
                    <div className="crew-visor" />
                  </div>
                  <div className="crew-leg crew-leg-left" />
                  <div className="crew-leg crew-leg-right" />
                </div>
                <div className="crew-mate crew-green">
                  <div className="crew-backpack" />
                  <div className="crew-body">
                    <div className="crew-visor" />
                  </div>
                  <div className="crew-leg crew-leg-left" />
                  <div className="crew-leg crew-leg-right" />
                </div>
                <div className="holo-table">
                  <div className="holo-inner">
                    <span>?</span>
                  </div>
                </div>
              </div>
              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-button hero-play"
                  onClick={() =>
                    setupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  <Play size={19} fill="currentColor" /> PLAY NOW <ArrowRight size={19} />
                </button>
                <span>
                  <Users size={15} /> 3–12 PLAYERS <span className="hero-action-dot">✦</span> ONE
                  PHONE
                </span>
              </div>
              <div className="hero-bottom">
                <span>
                  <Sparkles size={15} /> 100% SECRET AGENT ENERGY
                </span>
                <span>
                  <Shuffle size={15} /> {WORDS.length} WORDS TO BLUFF
                </span>
              </div>
            </section>
            <div ref={setupRef} className="setup-anchor" />
            <div className="game-panel setup-panel">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">MISSION CONTROL / 01</span>
                  <h2>
                    Assemble your crew <span aria-hidden="true">🚀</span>
                  </h2>
                </div>
                <div className="heading-icon">
                  <Gamepad2 size={23} />
                </div>
              </div>
              <div className="setting-heading">
                <span>{t.players}</span>
                <span className="count-pill">{players.length} / 12</span>
              </div>
              <div className="players-grid">
                {players.map((player, i) => (
                  <label className="player-row" key={player.id}>
                    <CrewAvatar index={i} size="small" />
                    <input
                      aria-label={`Player ${i + 1} name`}
                      maxLength={24}
                      value={player.name}
                      onChange={(e) => updateName(player.id, e.target.value)}
                    />
                    <button
                      aria-label={`Remove ${player.name}`}
                      className="remove-player"
                      type="button"
                      disabled={players.length <= 3}
                      onClick={() => setPlayers((prev) => prev.filter((p) => p.id !== player.id))}
                    >
                      <X size={16} />
                    </button>
                  </label>
                ))}
                {players.length < 12 && (
                  <button
                    type="button"
                    className="add-player"
                    onClick={() =>
                      setPlayers((prev) => [
                        ...prev,
                        { id: `player-${nextId}`, name: `Player ${prev.length + 1}` },
                      ])
                    }
                  >
                    <span>＋</span>
                    {t.add}
                  </button>
                )}
              </div>
              <div className="divider" />
              <div className="imposter-setting">
                <div>
                  <div className="setting-heading solo">{t.imposters}</div>
                  <p>{`Choose 1–${maxImposters} imposters. At least two players must know the word.`}</p>
                </div>
                <div className="stepper">
                  <button
                    aria-label="Decrease imposters"
                    type="button"
                    disabled={imposters <= 1}
                    onClick={() =>
                      setSettings((previous) => ({
                        ...previous,
                        imposters: Math.max(1, imposters - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <strong>{imposters}</strong>
                  <button
                    aria-label="Increase imposters"
                    type="button"
                    disabled={imposters >= maxImposters}
                    onClick={() =>
                      setSettings((previous) => ({
                        ...previous,
                        imposters: Math.min(maxImposters, imposters + 1),
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="divider" />
              <div className="setting-heading solo">{t.category}</div>
              <div className="category-grid">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`category-choice ${settings.category === c.id ? 'is-selected' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, category: c.id }))}
                    aria-pressed={settings.category === c.id}
                  >
                    <span>{c.icon}</span>
                    {c.label}
                    {settings.category === c.id && <Check className="category-check" size={14} />}
                  </button>
                ))}
              </div>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button type="button" className="primary-button" onClick={startGame}>
                <Play size={18} fill="currentColor" />
                {t.start}
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="howto">
              <div className="howto-icon">
                <ShieldQuestion size={21} />
              </div>
              <div>
                <strong>{t.how}</strong>
                <p>{t.howText}</p>
              </div>
              <ChevronRight size={18} className="howto-arrow" />
            </div>
          </main>
        )}

        {round && phase === 'pass' && activePlayer && (
          <main className="stage-layout">
            <div className="stage-counter">
              {t.step} {currentPlayer + 1} {t.of} {players.length}
            </div>
            <div className="progress-track">
              <div style={{ width: `${((currentPlayer + 1) / players.length) * 100}%` }} />
            </div>
            <div className="stage-card pass-card">
              <CrewIllustration mood="handoff" />
              <div className="stage-label">PASS THE PHONE</div>
              <h1>
                {t.passTo}
                <br />
                <span>{activePlayer.name}</span>
              </h1>
              <button className="primary-button" type="button" onClick={() => setPhase('peek')}>
                {'I have the phone'}
                <ArrowRight size={19} />
              </button>
            </div>
            <button
              className="subtle-link"
              onClick={() => {
                setPhase('setup');
              }}
            >
              <ArrowLeft size={15} />
              {t.close}
            </button>
          </main>
        )}

        {round && phase === 'peek' && activePlayer && (
          <main className="stage-layout">
            <div className="stage-counter">
              {t.step} {currentPlayer + 1} {t.of} {players.length}
            </div>
            <div className="progress-track">
              <div style={{ width: `${((currentPlayer + 1) / players.length) * 100}%` }} />
            </div>
            <div className="stage-card peek-card">
              <CrewIllustration mood="secret" />
              <div className="stage-label">
                <span className="live-dot" /> TOP SECRET · {activePlayer.name}
              </div>
              <h1>{'Your eyes only.'}</h1>
              <SecretRoleCard
                assignment={assignment}
                word={round.word}
                revealed={showRole}
                onRevealChange={setShowRole}
              />
              <button
                type="button"
                className="primary-button"
                disabled={showRole}
                onClick={advance}
              >
                {'Pass the phone'}
                <ArrowRight size={19} />
              </button>
            </div>
          </main>
        )}

        {round && phase === 'discuss' && (
          <main className="stage-layout">
            <div className="stage-counter">CREW DISCUSSION</div>
            <div className="stage-card discussion-card">
              <CrewIllustration mood="discussion" />
              <div className="stage-label">{t.round}</div>
              <h1>
                <span>{players.find((p) => p.id === round.starterId)?.name}</span>
                <br />
                {t.starting}
              </h1>
              <DiscussionTimer key={round.word.id} />
              <button className="primary-button" type="button" onClick={() => setPhase('vote')}>
                {t.vote}
                <Vote size={20} />
              </button>
              <button className="secondary-button" type="button" onClick={startNewRound}>
                <RotateCcw size={18} /> New game
              </button>
            </div>
          </main>
        )}

        {round && phase === 'vote' && (
          <VoteScreen
            players={players}
            selectedIds={accused}
            imposterCount={imposters}
            onToggle={toggleAccused}
            onConfirm={() => setPhase('result')}
            onBack={() => setPhase('discuss')}
            onNewGame={startNewRound}
          />
        )}

        {round && phase === 'result' && result && (
          <RoundResult
            round={round}
            players={players}
            winner={result}
            onNewGame={startNewRound}
            onSettings={() => setPhase('setup')}
          />
        )}

        <footer>
          <span>© {new Date().getFullYear()} WHO’S THE IMPOSTER?</span>
          <span>{t.privacy}</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
