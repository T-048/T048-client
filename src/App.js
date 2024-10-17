import React, { useState, useEffect } from 'react';
import './App.css';

const SIZE = 4; // 4x4 보드 크기

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
        resultRow.push(newRow[i] * 2); // 블록 합치기
        moved = true; // 이동을 true로 설정
        i += 2; // 다음 블록 건너뛰기
      } else {
        resultRow.push(newRow[i]); // 블록 유지
        i++;
      }
    }

    // 사이즈를 유지하기 위해 0으로 채우기
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
        return false; // 빈 공간이나 유효한 이동이 있으면 게임 오버가 아님
      }
    }
  }
  return true; // 게임 오버
};

// 최고 점수 쿠키에서 불러오기
const getHighScore = () => {
  const match = document.cookie.match(/highScore=(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// 최고 점수 쿠키에 저장하기
const setHighScore = (score) => {
  document.cookie = `highScore=${score}; path=/; max-age=31536000`; // 1년 동안 유효
};

function App() {
  const [board, setBoard] = useState(getInitialBoard);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [currentScore, setCurrentScore] = useState(0); // 현재 점수 상태 추가

  const handleKeyPress = (e) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;

    if (e.key === 'ArrowLeft') moved = move(newBoard, 'left');
    if (e.key === 'ArrowRight') moved = move(newBoard, 'right');
    if (e.key === 'ArrowUp') moved = move(newBoard, 'up');
    if (e.key === 'ArrowDown') moved = move(newBoard, 'down');

    if (moved) {
      // 현재 점수를 계산
      const newScore = newBoard.flat().reduce((a, b) => a + b, 0);
      setCurrentScore(newScore); // 상태에 현재 점수 저장
      addRandomTile(newBoard);
      setBoard(newBoard);

      if (newScore > highScore) {
        setHighScoreState(newScore);
        setHighScore(newScore); // 쿠키에 저장
      }

      if (checkGameOver(newBoard)) {
        setGameOver(true);
        alert("Game Over!");
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board]);

  return (
    <div className="App title-container">
      <h1>T048</h1>
      <div className="high-score">High Score: {highScore}</div>
      <div className="current-score">Current Score: {currentScore}</div> {/* 현재 점수 표시 */}
      <div className="board">
        {board.map((row, i) =>
          row.map((tile, j) => (
            <div key={`${i}-${j}`} className={`tile tile-${tile}`}>
              {tile !== 0 ? tile : ''}
            </div>
          ))
        )}
      </div>
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
}

export default App;