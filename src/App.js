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


export default App;
