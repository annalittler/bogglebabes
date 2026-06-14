import { useCallback, useEffect, useRef, useState } from 'react';
import { validateWord } from '../utils/boggle';

export function useWordTrace(letters, dictionary, enabled) {
  const [path, setPath] = useState([]);
  const [isTracing, setIsTracing] = useState(false);
  const [result, setResult] = useState(null);
  const gridRef = useRef(null);
  const pathRef = useRef([]);

  const resetTrace = useCallback(() => {
    setPath([]);
    pathRef.current = [];
    setIsTracing(false);
    setResult(null);
  }, []);

  const tryAddCell = useCallback((index) => {
    const current = pathRef.current;

    if (current.length >= 2 && current[current.length - 2] === index) {
      const next = current.slice(0, -1);
      pathRef.current = next;
      setPath(next);
      return;
    }

    if (current.includes(index)) return;

    if (current.length === 0 || current[current.length - 1] !== index) {
      const last = current[current.length - 1];
      if (current.length > 0) {
        const rowA = Math.floor(last / 4);
        const colA = last % 4;
        const rowB = Math.floor(index / 4);
        const colB = index % 4;
        const adjacent = Math.abs(rowA - rowB) <= 1 && Math.abs(colA - colB) <= 1;
        if (!adjacent) return;
      }

      const next = [...current, index];
      pathRef.current = next;
      setPath(next);
    }
  }, []);

  const finishTrace = useCallback(() => {
    setIsTracing(false);
    const validation = validateWord(pathRef.current, letters, dictionary);
    setResult(validation);
  }, [dictionary, letters]);

  const getCellFromPoint = useCallback((clientX, clientY) => {
    const el = document.elementFromPoint(clientX, clientY);
    const cell = el?.closest('[data-cell-index]');
    if (!cell || !gridRef.current?.contains(cell)) return null;
    return Number(cell.dataset.cellIndex);
  }, []);

  const handlePointerDown = useCallback((index) => {
    if (!enabled) return;

    if (result && !isTracing) {
      resetTrace();
      return;
    }

    if (path.length > 0 && !isTracing) {
      resetTrace();
      return;
    }

    setResult(null);
    pathRef.current = [index];
    setPath([index]);
    setIsTracing(true);
  }, [enabled, isTracing, path.length, resetTrace, result]);

  useEffect(() => {
    if (!isTracing || !enabled) return undefined;

    const handleMove = (e) => {
      const index = getCellFromPoint(e.clientX, e.clientY);
      if (index !== null) tryAddCell(index);
    };

    const handleUp = () => finishTrace();

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [enabled, finishTrace, getCellFromPoint, isTracing, tryAddCell]);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleOutsidePointer = (e) => {
      if (isTracing) return;
      if (!path.length && !result) return;
      if (gridRef.current?.contains(e.target)) return;
      resetTrace();
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => document.removeEventListener('pointerdown', handleOutsidePointer);
  }, [enabled, isTracing, path.length, resetTrace, result]);

  useEffect(() => {
    if (!enabled) resetTrace();
  }, [enabled, resetTrace]);

  return {
    gridRef,
    path,
    isTracing,
    result,
    resetTrace,
    handlePointerDown,
    currentWord: path.map((i) => letters[i]).join(''),
  };
}
