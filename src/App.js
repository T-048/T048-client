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

const move = (board, direction) => {
  let moved = false;

  const slideAndMerge = (row) => {
    const newRow = row.filter((val) => val !== 0);
    const resultRow = [];
    let i = 0;

    while (i < newRow.length) {
      if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
        resultRow.push(newRow[i] * 2); 
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
      const newRow = slideAndMerge(row);
      const finalRow = direction === 'right' ? newRow.reverse() : newRow;
      if (finalRow.toString() !== board[i].toString()) moved = true;
      board[i] = finalRow;
    }
  }

  if (direction === 'up' || direction === 'down') {
    for (let j = 0; j < SIZE; j++) {
      let col = board.map(row => row[j]);
      col = direction === 'down' ? col.reverse() : col;
      const newCol = slideAndMerge(col);
      const finalCol = direction === 'down' ? newCol.reverse() : newCol;
      for (let i = 0; i < SIZE; i++) {
        if (board[i][j] !== finalCol[i]) moved = true;
        board[i][j] = finalCol[i];
      }
    }
  }

  return moved;
};

const checkGameOver = (board) => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0 || (i < SIZE - 1 && board[i][j] === board[i + 1][j]) || (j < SIZE - 1 && board[i][j] === board[i][j + 1])) {
        return false; 
      }
    }
  }
  return true; 
};

const getHighScore = () => {
  const match = document.cookie.match(/highScore=(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const setHighScore = (score) => {
  document.cookie = `highScore=${score}; path=/; max-age=31536000`; 
};

const GameOver = ({ onRestart }) => {
  return (
    <div className="game-over-modal">
      <div className="game-over-content">
        <h2>Game Over!</h2>
        <p>다시 시작하시겠습니까?</p>
        <button onClick={onRestart}>재시작</button>
      </div>
    </div>
  );
};

function App() {
  const [board, setBoard] = useState(getInitialBoard);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [currentScore, setCurrentScore] = useState(0);

  const handleKeyPress = (e) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;

    if (e.key === 'ArrowLeft') moved = move(newBoard, 'left');
    if (e.key === 'ArrowRight') moved = move(newBoard, 'right');
    if (e.key === 'ArrowUp') moved = move(newBoard, 'up');
    if (e.key === 'ArrowDown') moved = move(newBoard, 'down');

    if (moved) {
      const newScore = newBoard.flat().reduce((a, b) => a + b, 0);
      setCurrentScore(newScore);
      addRandomTile(newBoard);
      setBoard(newBoard);

      if (newScore > highScore) {
        setHighScoreState(newScore);
        setHighScore(newScore);
      }

      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const restartGame = () => {
    setBoard(getInitialBoard());
    setCurrentScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board]);

  return (
    <div className="App title-container">
      <h1>T048</h1>
      <div className="high-score">나영쌤의 분노 수치: {highScore}</div>
      <div className="current-score">현재 점수: {currentScore}</div>
      <div className="board">
        {board.map((row, i) =>
          row.map((tile, j) => (
            <div key={`${i}-${j}`} className={`tile tile-${tile > 0 ? tile : ''}`}>
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