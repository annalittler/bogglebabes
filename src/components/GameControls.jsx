import Timer from './Timer';

export default function GameControls({
  secondsLeft,
  timerLabel,
  dictReady,
  isShaking,
  canStart,
  canPause,
  isPaused,
  canStop,
  showNewRound,
  onStart,
  onPauseResume,
  onStop,
  onNewRound,
}) {
  const leftButton = () => {
    if (showNewRound) {
      return (
        <button className="btn-action btn-start" type="button" onClick={onNewRound}>
          New
        </button>
      );
    }

    if (canStart) {
      return (
        <button
          className="btn-action btn-start"
          type="button"
          onClick={onStart}
          disabled={!dictReady}
        >
          Start
        </button>
      );
    }

    if (canPause) {
      return (
        <button
          className="btn-action btn-start"
          type="button"
          onClick={onPauseResume}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      );
    }

    return (
      <button className="btn-action btn-start" type="button" disabled>
        {isShaking ? '…' : 'Start'}
      </button>
    );
  };

  return (
    <div className="game-controls">
      {leftButton()}

      <Timer secondsLeft={secondsLeft} label={timerLabel} />

      {canStop ? (
        <button className="btn-action btn-stop" type="button" onClick={onStop}>
          Stop
        </button>
      ) : (
        <div className="btn-action btn-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
