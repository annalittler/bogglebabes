import { useLayoutEffect, useState } from 'react';

function getCellCenter(gridEl, index) {
  const cell = gridEl?.querySelector(`[data-cell-index="${index}"]`);
  if (!cell || !gridEl) return null;

  const gridRect = gridEl.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  return {
    x: cellRect.left + cellRect.width / 2 - gridRect.left,
    y: cellRect.top + cellRect.height / 2 - gridRect.top,
  };
}

export default function BoggleGrid({
  gridRef,
  letters,
  path,
  isShaking,
  canTrace,
  onPointerDown,
}) {
  const [linePoints, setLinePoints] = useState('');

  useLayoutEffect(() => {
    if (!gridRef.current || path.length < 2) {
      setLinePoints('');
      return;
    }

    const points = path
      .map((index) => getCellCenter(gridRef.current, index))
      .filter(Boolean)
      .map((p) => `${p.x},${p.y}`)
      .join(' ');

    setLinePoints(points);
  }, [gridRef, letters, path]);

  return (
    <div className={`board-frame ${isShaking ? 'shaking' : ''}`}>
      <div className="grid" ref={gridRef}>
        {letters.map((letter, index) => {
          const inPath = path.includes(index);
          const isQu = letter === 'Qu';

          return (
            <div
              key={index}
              className={`die-cell ${!canTrace ? 'die-cell-locked' : ''}`}
              data-cell-index={index}
              role={canTrace ? 'button' : 'presentation'}
              aria-disabled={!canTrace}
              onPointerDown={(e) => {
                if (!canTrace) return;
                e.preventDefault();
                onPointerDown(index);
              }}
            >
              <div className={`die ${isShaking ? 'rolling' : ''} ${inPath ? 'selected' : ''}`}>
                <span className={`die-letter ${isQu ? 'qu' : ''}`}>
                  {letter || '·'}
                </span>
              </div>
            </div>
          );
        })}

        {linePoints && (
          <svg className="trace-lines" aria-hidden="true">
            <polyline points={linePoints} />
          </svg>
        )}
      </div>
    </div>
  );
}
