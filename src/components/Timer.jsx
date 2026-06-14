import { ROUND_SECONDS } from '../constants';

export default function Timer({ secondsLeft, label }) {
  const progress = secondsLeft / ROUND_SECONDS;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;

  let valueClass = '';
  if (secondsLeft <= 10 && secondsLeft > 0) valueClass = 'urgent';
  else if (secondsLeft <= 30) valueClass = 'warning';

  return (
    <div className="timer-wrap" aria-hidden="true">
      <div
        className="timer-ring"
        style={{ '--progress': progress }}
      />
      <div className="timer-display">
        <span className={`timer-value ${valueClass}`}>{display}</span>
        <span className="timer-label">{label}</span>
      </div>
    </div>
  );
}
