import React, { useState, useEffect } from 'react';
import './App.css';

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

export default App;
