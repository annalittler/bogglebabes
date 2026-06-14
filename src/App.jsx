import { useEffect, useState } from 'react';
import BoggleGrid from './components/BoggleGrid';
import GameControls from './components/GameControls';
import WordResult from './components/WordResult';
import { useBoggleGame } from './hooks/useBoggleGame';
import { useWordTrace } from './hooks/useWordTrace';
import { loadDictionary } from './utils/dictionary';
import './App.css';

function timerLabel(gameState) {
  switch (gameState) {
    case 'shuffling':
      return 'Shake';
    case 'playing':
      return 'Go';
    case 'paused':
      return 'Pause';
    case 'finished':
      return 'Done';
    case 'stopped':
      return 'Stop';
    default:
      return 'Ready';
  }
}

export default function App() {
  const [dictionary, setDictionary] = useState(null);
  const [dictReady, setDictReady] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const {
    gameState,
    letters,
    secondsLeft,
    status,
    startRound,
    pauseGame,
    resumeGame,
    stopGame,
    resetIdle,
    isShaking,
    isPaused,
    canTrace,
    canStart,
    canPause,
    canStop,
    showNewRound,
  } = useBoggleGame();

  const {
    gridRef,
    path,
    result,
    resetTrace,
    handlePointerDown,
    currentWord,
  } = useWordTrace(letters, dictionary, canTrace);

  useEffect(() => {
    const dict = loadDictionary();
    setDictionary(dict);
    setDictReady(true);
  }, []);

  const handleNewRound = () => {
    resetTrace();
    resetIdle();
  };

  const handleStart = () => {
    resetTrace();
    startRound();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  return (
    <div className="app">
      <div className="app-container">
      <section className="app-top">
        <header className="app-header">
          <h1>Boggle</h1>
          <p className="subtitle">How many words can you find?</p>
        </header>

        {!dictReady && (
          <p className="loading">Loading dictionary…</p>
        )}

        <GameControls
          secondsLeft={secondsLeft}
          timerLabel={timerLabel(gameState)}
          dictReady={dictReady}
          isShaking={isShaking}
          canStart={canStart}
          canPause={canPause}
          isPaused={isPaused}
          canStop={canStop}
          showNewRound={showNewRound}
          onStart={handleStart}
          onPauseResume={handlePauseResume}
          onStop={stopGame}
          onNewRound={handleNewRound}
        />
      </section>

      <section className="board-stage">
        <BoggleGrid
          gridRef={gridRef}
          letters={letters}
          path={path}
          isShaking={isShaking}
          canTrace={canTrace}
          onPointerDown={handlePointerDown}
        />
      </section>

      <section className="app-bottom">
        <WordResult result={result} currentWord={currentWord} canTrace={canTrace} />
        <p className={`status ${showNewRound ? 'done' : ''}`}>{status || '\u00A0'}</p>
        <footer className="app-footer">
          <button
            className="btn-rules"
            type="button"
            aria-label="Show rules"
            aria-expanded={showRules}
            onClick={() => setShowRules((open) => !open)}
          >
            !
          </button>
        </footer>
      </section>
      </div>

      {showRules && (
        <aside className="rules-overlay" role="dialog" aria-label="How to play">
          <div className="rules">
            <div className="rules-header">
              <h2>How to play</h2>
              <button
                className="btn-rules-close"
                type="button"
                aria-label="Close rules"
                onClick={() => setShowRules(false)}
              >
                ×
              </button>
            </div>
            <ul>
              <li>Find words of 3+ letters using adjacent letters (including diagonals)</li>
              <li>Each die can only be used once per word</li>
              <li><strong>Qu</strong> counts as two letters but uses one square</li>
              <li>Write your words on paper during play — you have 3 minutes</li>
              <li>After the round ends, drag across letters to check words and scores</li>
            </ul>
          </div>
        </aside>
      )}
    </div>

  );
}
