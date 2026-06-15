import { GRID_SIZE } from '../constants';

export function randomDieFace(die) {
  return die[Math.floor(Math.random() * die.length)];
}

export function randomDieRotation() {
  const rotations = [0, 90, 180, 270];
  return rotations[Math.floor(Math.random() * rotations.length)];
}

export function formatLetter(char) {
  return char === 'Q' ? 'Qu' : char;
}

const ORIENTATION_MARK_LETTERS = new Set(['M', 'W', 'N', 'Z']);

export function needsOrientationMark(letter) {
  if (!letter || letter === '?' || letter === '·') return false;
  const key = letter === 'Qu' ? 'Q' : letter.toUpperCase();
  return ORIENTATION_MARK_LETTERS.has(key);
}

export function generateShuffleFrame(dice) {
  return {
    letters: Array.from({ length: 16 }, () => {
      const die = dice[Math.floor(Math.random() * dice.length)];
      return formatLetter(randomDieFace(die));
    }),
    rotations: Array.from({ length: 16 }, () => randomDieRotation()),
  };
}

export function generateBoard(dice) {
  const shuffled = [...dice].sort(() => Math.random() - 0.5);
  const letters = shuffled.map((die) => formatLetter(randomDieFace(die)));
  const rotations = shuffled.map(() => randomDieRotation());
  return { letters, rotations };
}

export function areAdjacent(a, b) {
  const rowA = Math.floor(a / GRID_SIZE);
  const colA = a % GRID_SIZE;
  const rowB = Math.floor(b / GRID_SIZE);
  const colB = b % GRID_SIZE;
  return Math.abs(rowA - rowB) <= 1 && Math.abs(colA - colB) <= 1;
}

export function wordFromPath(indices, letters) {
  return indices
    .map((i) => letters[i])
    .join('')
    .toLowerCase();
}

export function isValidPath(indices) {
  if (indices.length === 0) return false;
  if (new Set(indices).size !== indices.length) return false;

  for (let i = 1; i < indices.length; i += 1) {
    if (!areAdjacent(indices[i - 1], indices[i])) {
      return false;
    }
  }

  return true;
}

export function letterCount(word) {
  return word.length;
}

export function boggleScore(word) {
  const len = letterCount(word);
  if (len < 3) return 0;
  if (len <= 4) return 1;
  if (len === 5) return 2;
  if (len === 6) return 3;
  if (len === 7) return 5;
  return 11;
}

export function validateWord(indices, letters, dictionary) {
  if (!dictionary) {
    return { valid: false, reason: 'Dictionary still loading…' };
  }

  if (indices.length < 3) {
    return { valid: false, reason: 'Words must be at least 3 letters' };
  }

  if (!isValidPath(indices)) {
    return { valid: false, reason: 'Invalid path — use adjacent letters only' };
  }

  const word = wordFromPath(indices, letters);

  if (!dictionary.validate(word)) {
    return { valid: false, reason: `"${word}" is not in the dictionary` };
  }

  const points = boggleScore(word);

  return {
    valid: true,
    word,
    points,
    reason: `"${word}" is valid — ${points} point${points === 1 ? '' : 's'}`,
  };
}
