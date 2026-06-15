import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOGGLE_DICE,
  ROLL_INTERVAL_MS,
  ROUND_SECONDS,
  SHUFFLE_MS,
} from '../constants';
import { generateBoard, generateShuffleFrame } from '../utils/boggle';
import { playTimeUpSound } from '../utils/timerSound';

export function useBoggleGame() {
  const [gameState, setGameState] = useState('idle');
  const [letters, setLetters] = useState(Array(16).fill(''));
  const [rotations, setRotations] = useState(Array(16).fill(0));
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [status, setStatus] = useState('Tap Start to shake the dice');

  const timerRef = useRef(null);
  const shuffleTimeoutRef = useRef(null);
  const rollIntervalRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
  }, []);

  const resetIdle = useCallback(() => {
    clearTimers();
    setGameState('idle');
    setLetters(Array(16).fill(''));
    setRotations(Array(16).fill(0));
    setSecondsLeft(ROUND_SECONDS);
    setStatus('Tap Start to shake the dice');
  }, [clearTimers]);

  const stopGame = useCallback(() => {
    if (gameState !== 'playing' && gameState !== 'shuffling' && gameState !== 'paused') return;

    clearTimers();
    setGameState('stopped');
    setStatus('');
  }, [clearTimers, gameState]);

  const endRound = useCallback(() => {
    clearTimers();
    setGameState('finished');
    setSecondsLeft(0);
    setStatus('');
    playTimeUpSound();
  }, [clearTimers]);

  const startCountdown = useCallback(() => {
    setGameState('playing');
    setStatus('Write down as many words as possible');

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [endRound]);

  const pauseGame = useCallback(() => {
    if (gameState !== 'playing') return;

    clearTimers();
    setGameState('paused');
    setStatus('Paused — tap Resume to continue');
  }, [clearTimers, gameState]);

  const resumeGame = useCallback(() => {
    if (gameState !== 'paused') return;

    setGameState('playing');
    setStatus('Write down as many words as possible');

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [endRound, gameState]);

  const startRound = useCallback(() => {
    if (gameState === 'shuffling' || gameState === 'playing' || gameState === 'paused') return;

    clearTimers();
    setGameState('shuffling');
    setStatus('Shaking dice…');
    setSecondsLeft(ROUND_SECONDS);
    setLetters(Array(16).fill('?'));
    setRotations(Array(16).fill(0));

    rollIntervalRef.current = setInterval(() => {
      const frame = generateShuffleFrame(BOGGLE_DICE);
      setLetters(frame.letters);
      setRotations(frame.rotations);
    }, ROLL_INTERVAL_MS);

    shuffleTimeoutRef.current = setTimeout(() => {
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
      }
      const board = generateBoard(BOGGLE_DICE);
      setLetters(board.letters);
      setRotations(board.rotations);
      startCountdown();
    }, SHUFFLE_MS);
  }, [clearTimers, gameState, startCountdown]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    gameState,
    letters,
    rotations,
    secondsLeft,
    status,
    startRound,
    pauseGame,
    resumeGame,
    stopGame,
    resetIdle,
    isShaking: gameState === 'shuffling',
    isPlaying: gameState === 'playing',
    isPaused: gameState === 'paused',
    canTrace: gameState === 'finished' || gameState === 'stopped',
    canStart: gameState === 'idle',
    canPause: gameState === 'playing' || gameState === 'paused',
    canStop: gameState === 'playing' || gameState === 'shuffling' || gameState === 'paused',
    showNewRound: gameState === 'finished' || gameState === 'stopped',
  };
}
