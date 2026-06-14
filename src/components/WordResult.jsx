export default function WordResult({ result, currentWord, canTrace }) {
  const showHint = canTrace && !currentWord && !result;

  return (
    <div className="word-result" aria-live="polite">
      <p className={`word-line word-current ${currentWord ? 'visible' : ''}`}>
        {currentWord || '\u00A0'}
      </p>

      <p className={`word-line word-feedback ${result ? `visible ${result.valid ? 'valid' : 'invalid'}` : ''}`}>
        {result ? result.reason : '\u00A0'}
      </p>

      <p className={`word-line word-hint ${showHint ? 'visible' : ''}`}>
        Drag across letters to check a word
      </p>
    </div>
  );
}
