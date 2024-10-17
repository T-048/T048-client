import React, { useState, useEffect } from 'react';
import './App.css';

const SIZE = 4; // 4x4 보드 크기

const getInitialBoard = () => {
  const board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

export default App;
