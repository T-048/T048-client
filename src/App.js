import React, { useState, useEffect } from 'react';
import './App.css';
import GameOverModal from './GameOverModal'; 

const SIZE = 4;

const getInitialBoard = () => {
  const board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board) => {
  const emptyTiles = [];
  board.forEach((row, i) =>
    row.forEach((tile, j) => {
      if (tile === 0) emptyTiles.push({ x: i, y: j });
    })
  );

  if (emptyTiles.length === 0) return;

  const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[x][y] = Math.random() < 0.9 ? 2 : 4;
};

const move = (board, direction, setMergedTiles) => {
  let moved = false;
  const mergedPositions = [];

  const slideAndMerge = (row, rowIndex) => {
    const newRow = row.filter((val) => val !== 0);
    const resultRow = [];
    let i = 0;

    while (i < newRow.length) {
      if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
        resultRow.push(newRow[i] * 2);
        mergedPositions.push({ x: rowIndex, y: resultRow.length - 1 });
        moved = true;
        i += 2; 
      } else {
        resultRow.push(newRow[i]);
        i++;
      }
    }

    return [...resultRow, ...Array(SIZE - resultRow.length).fill(0)];
  };

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < SIZE; i++) {
      const row = direction === 'right' ? [...board[i]].reverse() : [...board[i]];
      const newRow = slideAndMerge(row, i);
      const finalRow = direction === 'right' ? newRow.reverse() : newRow;
      if (finalRow.toString() !== board[i].toString()) moved = true;
      board[i] = finalRow;
    }
  }

  if (direction === 'up' || direction === 'down') {
    for (let j = 0; j < SIZE; j++) {
      let col = board.map(row => row[j]);
      col = direction === 'down' ? col.reverse() : col;
      const newCol = slideAndMerge(col, j);
      const finalCol = direction === 'down' ? newCol.reverse() : newCol;
      for (let i = 0; i < SIZE; i++) {
        if (board[i][j] !== finalCol[i]) moved = true;
        board[i][j] = finalCol[i];
      }
    }
  }

  setMergedTiles(mergedPositions);
  return moved;
};

const getHighScore = () => {
  const storedHighScore = localStorage.getItem('highScore');
  return storedHighScore ? JSON.parse(storedHighScore) : 0;
};

const setHighScore = (score) => {
  localStorage.setItem('highScore', JSON.stringify(score));
};

const checkGameOver = (board) => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0) return false;
      if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return false;
      if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return false;
    }
  }
  return true;
};

function App() {
  const [board, setBoard] = useState(getInitialBoard);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [currentScore, setCurrentScore] = useState(0);
  const [mergedTiles, setMergedTiles] = useState([]); // 합쳐진 타일 상태
  const [shake, setShake] = useState(false); // 화면 흔들림 상태 추가

  const handleKeyPress = (e) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;

    if (e.key === 'ArrowLeft') moved = move(newBoard, 'left', setMergedTiles);
    if (e.key === 'ArrowRight') moved = move(newBoard, 'right', setMergedTiles);
    if (e.key === 'ArrowUp') moved = move(newBoard, 'up', setMergedTiles);
    if (e.key === 'ArrowDown') moved = move(newBoard, 'down', setMergedTiles);

    if (moved) {
      const newScore = newBoard.flat().reduce((a, b) => a + b, 0);
      setCurrentScore(newScore);
      addRandomTile(newBoard);
      setBoard(newBoard);

      // 점수 업데이트
      if (newScore > highScore) {
        setHighScoreState(newScore);
        setHighScore(newScore);
      }

      // 게임 오버 체크
      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }

      // 흔들림 효과 추가
      setShake(true);
      setTimeout(() => setShake(false), 700); // 흔들림이 끝나면 초기화
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [board]);

  useEffect(() => {
    if (mergedTiles.length > 0) {
      const timer = setTimeout(() => {
        setMergedTiles([]); // 타일 합쳐짐 초기화
      }, 500); // 애니메이션 지속 시간 후 초기화
      return () => clearTimeout(timer);
    }
  }, [mergedTiles]);

  const restartGame = () => {
    setBoard(getInitialBoard());
    setCurrentScore(0);
    setGameOver(false);
    setMergedTiles([]);
  };

  return (
    <div className={`App title-container ${shake ? 'shake' : ''}`}>
      <h1>T048</h1>
      <div className="high-score">나영쌤의 분노 수치: {highScore}</div>
      <div className="current-score">현재 점수: {currentScore}</div>
      <div className="board">
        {board.map((row, i) =>
          row.map((tile, j) => (
            <div
              key={`${i}-${j}`}
              className={`tile tile-${tile > 0 ? tile : ''} ${mergedTiles.some(t => t.x === i && t.y === j) ? 'merged' : ''}`}
            >
              {tile !== 0 ? tile : ''}
            </div>
          ))
        )}
      </div>

      <GameOverModal open={gameOver} onRestart={restartGame} />
    </div>
  );
}

export default App;