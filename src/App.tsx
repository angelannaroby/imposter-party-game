import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, EyeOff, Gamepad2, Orbit, Play, RotateCcw, ShieldQuestion, Shuffle, Sparkles, Users, Vote, X } from 'lucide-react';
import { getImposterHint } from './features/game/model/hints';
import { CATEGORIES } from './features/game/data/categories';
import { WORDS } from './features/game/data/words';
import { GAME_COPY } from './features/game/content';
import { chooseWord, createRound, evaluateVote, getMaxImposters } from './features/game/model/engine';
import type { GameSettings, Phase, Player, Round } from './features/game/model/types';

const createInitialPlayers = (): Player[] => Array.from({ length: 4 }, (_, i) => ({ id: `player-${i + 1}`, name: `Player ${i + 1}` }));

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
  const nextId = players.reduce((max, p) => Math.max(max, Number(p.id.replace('player-', '')) || 0), 0) + 1;

  function startGame() {
    const names = players.map((p) => p.name.trim().toLocaleLowerCase());
    if (players.length < 3 || names.some((name) => !name)) { setError(t.min); return; }
    if (new Set(names).size !== names.length) { setError(t.duplicate); return; }
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
    else { setCurrentPlayer((i) => i + 1); setPhase('pass'); }
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
    if (window.confirm('Start a new round? The current round will end.')) startGame();
  }

  function toggleAccused(id: string) {
    setAccused((previous) => previous.includes(id)
      ? previous.filter((item) => item !== id)
      : previous.length < imposters ? [...previous, id] : previous);
  }

  function updateName(id: string, name: string) {
    setPlayers((previous) => previous.map((p) => p.id === id ? { ...p, name } : p));
    setError('');
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <div className="site-wrap">
        <header className="topbar">
          <div className="brand"><span className="brand-mark"><Orbit size={21} strokeWidth={2.5} /></span><span>IMPOSTER<span className="brand-accent">.</span></span></div>
          <span className="topbar-tag"><span className="live-dot" /> PARTY MODE ON</span>
        </header>

        {phase === 'setup' && <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="hero-planet hero-planet-left" aria-hidden="true" />
            <div className="hero-planet hero-planet-right" aria-hidden="true" />
            <div className="hero-copy">
              <div className="eyebrow"><span className="live-dot" /> THE ULTIMATE BLUFFING GAME</div>
              <h1 id="hero-title">TRUST NO <span>ONE.</span></h1>
              <p>Same crew. Same secret word. <strong>Some sneaky imposters.</strong> Can you spot the liar?</p>
            </div>
            <div className="crew-scene" aria-label="Colourful space creatures gathered around a glowing table" role="img">
              <div className="orbit-ring orbit-ring-one" /><div className="orbit-ring orbit-ring-two" />
              <span className="scene-spark scene-spark-one">✦</span><span className="scene-spark scene-spark-two">✧</span>
              <div className="crew-mate crew-orange"><div className="crew-backpack" /><div className="crew-body"><div className="crew-visor" /></div><div className="crew-leg crew-leg-left" /><div className="crew-leg crew-leg-right" /></div>
              <div className="crew-mate crew-purple"><div className="crew-backpack" /><div className="crew-body"><div className="crew-visor" /></div><div className="crew-leg crew-leg-left" /><div className="crew-leg crew-leg-right" /></div>
              <div className="crew-mate crew-green"><div className="crew-backpack" /><div className="crew-body"><div className="crew-visor" /></div><div className="crew-leg crew-leg-left" /><div className="crew-leg crew-leg-right" /></div>
              <div className="holo-table"><div className="holo-inner"><span>?</span></div></div>
            </div>
            <div className="hero-actions">
              <button type="button" className="primary-button hero-play" onClick={() => setupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><Play size={19} fill="currentColor" /> PLAY NOW <ArrowRight size={19} /></button>
              <span><Users size={15} /> 3–12 PLAYERS <span className="hero-action-dot">✦</span> ONE PHONE</span>
            </div>
            <div className="hero-bottom"><span><Sparkles size={15} /> 100% SECRET AGENT ENERGY</span><span><Shuffle size={15} /> {WORDS.length} WORDS TO BLUFF</span></div>
          </section>
          <div ref={setupRef} className="setup-anchor" />
          <div className="game-panel setup-panel">
            <div className="section-heading"><div><span className="section-kicker">MISSION CONTROL / 01</span><h2>Assemble your crew <span aria-hidden="true">🚀</span></h2></div><div className="heading-icon"><Gamepad2 size={23} /></div></div>
            <div className="setting-heading"><span>{t.players}</span><span className="count-pill">{players.length} / 12</span></div>
            <div className="players-grid">
              {players.map((player, i) => <label className="player-row" key={player.id}><span className="player-number">{String(i + 1).padStart(2, '0')}</span><input aria-label={`Player ${i + 1} name`} maxLength={24} value={player.name} onChange={(e) => updateName(player.id, e.target.value)} /><button aria-label={`Remove ${player.name}`} className="remove-player" type="button" disabled={players.length <= 3} onClick={() => setPlayers((prev) => prev.filter((p) => p.id !== player.id))}><X size={16} /></button></label>)}
              {players.length < 12 && <button type="button" className="add-player" onClick={() => setPlayers((prev) => [...prev, { id: `player-${nextId}`, name: `Player ${prev.length + 1}` }])}><span>＋</span>{t.add}</button>}
            </div>
            <div className="divider" />
            <div className="imposter-setting"><div><div className="setting-heading solo">{t.imposters}</div><p>{`Choose 1–${maxImposters} imposters. At least two players must know the word.`}</p></div><div className="stepper"><button aria-label="Decrease imposters" type="button" disabled={imposters <= 1} onClick={() => setSettings((previous) => ({ ...previous, imposters: Math.max(1, imposters - 1) }))}>−</button><strong>{imposters}</strong><button aria-label="Increase imposters" type="button" disabled={imposters >= maxImposters} onClick={() => setSettings((previous) => ({ ...previous, imposters: Math.min(maxImposters, imposters + 1) }))}>+</button></div></div>
            <div className="divider" />
            <div className="setting-heading solo">{t.category}</div>
            <div className="category-grid">{CATEGORIES.map((c) => <button key={c.id} type="button" className={`category-choice ${settings.category === c.id ? 'is-selected' : ''}`} onClick={() => setSettings((s) => ({ ...s, category: c.id }))} aria-pressed={settings.category === c.id}><span>{c.icon}</span>{c.label}{settings.category === c.id && <Check className="category-check" size={14} />}</button>)}</div>
            {error && <p role="alert" className="form-error">{error}</p>}
            <button type="button" className="primary-button" onClick={startGame}><Play size={18} fill="currentColor" />{t.start}<ArrowRight size={20} /></button>
            
          </div>
          <div className="howto"><div className="howto-icon"><ShieldQuestion size={21} /></div><div><strong>{t.how}</strong><p>{t.howText}</p></div><ChevronRight size={18} className="howto-arrow" /></div>
        </main>}

        {round && phase === 'pass' && activePlayer && <main className="stage-layout"><div className="stage-counter">{t.step} {currentPlayer + 1} {t.of} {players.length}</div><div className="progress-track"><div style={{ width: `${((currentPlayer + 1) / players.length) * 100}%` }} /></div><div className="stage-card pass-card"><div className="center-icon">🛸</div><div className="stage-label">PASS THE PHONE</div><h1>{t.passTo}<br /><span>{activePlayer.name}</span></h1><button className="primary-button" type="button" onClick={() => setPhase('peek')}>{'I have the phone'}<ArrowRight size={19} /></button></div><button className="subtle-link" onClick={() => { if (window.confirm('Leave this round?')) setPhase('setup'); }}><ArrowLeft size={15} />{t.close}</button></main>}

        {round && phase === 'peek' && activePlayer && <main className="stage-layout"><div className="stage-counter">{t.step} {currentPlayer + 1} {t.of} {players.length}</div><div className="progress-track"><div style={{ width: `${((currentPlayer + 1) / players.length) * 100}%` }} /></div><div className="stage-card peek-card"><div className="stage-label"><span className="live-dot" /> TOP SECRET · {activePlayer.name}</div><h1>{'Your eyes only.'}</h1><button type="button" className={`secret-card ${showRole ? 'revealed' : ''} ${assignment?.role === 'imposter' ? 'imposter-role' : ''}`} onPointerDown={() => setShowRole(true)} onPointerUp={() => setShowRole(false)} onPointerLeave={() => setShowRole(false)} onPointerCancel={() => setShowRole(false)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowRole(true); } }} onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') setShowRole(false); }} onBlur={() => setShowRole(false)} aria-label={t.reveal}>
                  {showRole ? <><span className="secret-label">{assignment?.role === 'imposter' ? t.imposter : t.civilian}</span><strong>{assignment?.role === 'imposter' ? '?' : round.word.text}</strong>{assignment?.role === 'imposter' && <span className="imposter-hint">HINT · {getImposterHint(round.word)}</span>}</> : <><EyeOff size={35} /><strong>••••••</strong><small>{t.reveal}</small></>}
                </button><button type="button" className="primary-button" disabled={showRole} onClick={advance}>{currentPlayer === players.length - 1 ? t.lastHandoff : t.handoff}<ArrowRight size={19} /></button></div></main>}

        {round && phase === 'discuss' && <main className="stage-layout"><div className="stage-counter">CREW DISCUSSION</div><div className="stage-card discussion-card"><div className="center-icon teal">👾</div><div className="stage-label">{t.round}</div><h1><span>{players.find((p) => p.id === round.starterId)?.name}</span><br />{t.starting}</h1><button className="primary-button" type="button" onClick={() => setPhase('vote')}>{t.vote}<Vote size={20} /></button><button className="secondary-button" type="button" onClick={startNewRound}><RotateCcw size={18} /> New game · skip voting</button></div></main>}

        {round && phase === 'vote' && <main className="stage-layout"><div className="stage-counter">THE FINAL VOTE</div><div className="stage-card vote-card"><div className="center-icon">🗳️</div><div className="stage-label">MAKE YOUR PICK</div><h1>{t.voteHeading}</h1><div className="vote-amount">Select {imposters} {imposters === 1 ? 'suspect' : 'suspects'}</div><div className="suspect-list">{players.map((p, i) => <button key={p.id} type="button" aria-pressed={accused.includes(p.id)} className={`suspect-row ${accused.includes(p.id) ? 'chosen' : ''}`} onClick={() => toggleAccused(p.id)}><span className="suspect-avatar">{String(i + 1).padStart(2, '0')}</span><span>{p.name}</span><span className="suspect-checkbox">{accused.includes(p.id) && <Check size={16} />}</span></button>)}</div><div className="vote-count">{accused.length} / {imposters} {t.selected}</div><button className="primary-button" type="button" disabled={accused.length !== imposters} onClick={() => setPhase('result')}>{t.confirm}<ArrowRight size={20} /></button><button className="secondary-button" type="button" onClick={startNewRound}><RotateCcw size={18} /> New game · skip voting</button><button className="subtle-link" type="button" onClick={() => setPhase('discuss')}><ArrowLeft size={15} />{t.close}</button></div></main>}

        {round && phase === 'result' && <main className="stage-layout"><div className="stage-counter" aria-live="polite">{t.result}</div><div className="stage-card result-card"><div className="celebration-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>✶</span><span>✦</span><span>✧</span></div><div className={`result-icon ${result === 'civilians' ? 'caught' : 'escaped'}`}>{result === 'civilians' ? <Check size={38} /> : <ShieldQuestion size={38} />}</div><div className="stage-label">GAME OVER</div><h1>{result === 'civilians' ? t.civiliansWin : t.impostersWin}</h1><div className="reveal-info"><span>{t.impostersWere}</span><strong>{round.assignments.filter((a) => a.role === 'imposter').map((a) => players.find((p) => p.id === a.playerId)?.name).join(' + ')}</strong></div><div className="reveal-info"><span>{t.wordWas}</span><strong>{round.word.text}</strong></div><button type="button" className="primary-button" onClick={startGame}>{t.next}<RotateCcw size={19} /></button><button type="button" className="subtle-link" onClick={() => { if (window.confirm('Leave this round?')) setPhase('setup'); }}><ArrowLeft size={15} />{t.backSetup}</button></div></main>}

        <footer><span>© {new Date().getFullYear()} WHO’S THE IMPOSTER?</span><span>{t.privacy}</span></footer>
      </div>
    </div>
  );
}

export default App;
