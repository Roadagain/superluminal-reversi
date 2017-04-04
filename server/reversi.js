"use strict";

const SIDE = 8;
const WHITE = -1;
const EMPTY = 0;
const BLACK = 1;
const DXY = [-1, 0, 1];

let matrix = null;

function start() {
  matrix = [];
  for (let i = 0; i < SIDE + 2; ++i) {
    matrix.push([]);
    for (let j = 0; j < SIDE + 2; ++j) {
      matrix[i][j] = EMPTY;
    }
  }

  matrix[4][4] = WHITE;
  matrix[5][5] = WHITE;
  matrix[4][5] = BLACK;
  matrix[5][4] = BLACK;
  return matrix;
}

function inBoard(point) {
  let x = point.x;
  let y = point.y;
  return 0 < x && x <= SIDE && 0 < y && y <= SIDE;
}

function reversePoint(point, dy, dx, color) {
  let x = point.x;
  let y = point.y;
  let reversed = false;

  y += dy;
  x += dx;
  while (matrix[y][x] !== EMPTY) {
    if (matrix[y][x] === -color) {
      reversed = true;
    }
    else if (matrix[y][x] === color) {
      if (reversed) {
        return {y, x};
      }
      else {
        return null;
      }
    }
    y += dy;
    x += dx;
  }

  return null;
}

function reversePoints(point, color) {
  if (color !== BLACK && color !== WHITE) {
    return [];
  }
  else if (inBoard(point) === false) {
    return [];
  }
  else if (matrix[point.y][point.x] !== EMPTY) {
    return [];
  }

  let rPoints = [];
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      let dy = DXY[i];
      let dx = DXY[j];
      if (dy === 0 && dx === 0) {
        continue;
      }

      let rp = reversePoint(point, dy, dx, color);
      if (rp !== null) {
        rPoints.push({rp, dy, dx});
      }
    }
  }

  return rPoints;
}

function reverse(point, color, rps) {
  rps.forEach((v, i) => {
    let rp = v.rp;
    while (rp.x !== point.x || rp.y !== point.y) {
      matrix[rp.y][rp.x] = color;
      rp.y -= v.dy;
      rp.x -= v.dx;
    }
  });
}

function put(point, color) {
  let rps = reversePoints(point, color);
  if (rps.length === 0) {
    return null;
  }

  matrix[point.y][point.x] = color;
  reverse(point, color, rps);

  return matrix;
}

function isFinish() {
  for (let i = 1; i <= SIDE; ++i) {
    for (let j = 1; j <= SIDE; ++j) {
      let brps = reversePoints({y: i, x: j}, BLACK);
      let wrps = reversePoints({y: i, x: j}, WHITE);
      if (brps.length !== 0 || wrps.length !== 0) {
        return false;
      }
    }
  }

  return true;
}

function result() {
  let bcnt = 0;
  let wcnt = 0;

  for (let i = 1; i <= SIDE; ++i) {
    for (let j = 1; j <= SIDE; ++j) {
      if (matrix[i][j] === BLACK) {
        ++bcnt;
      }
      else if (matrix[i][j] === WHITE) {
        ++wcnt;
      }
    }
  }

  let winner = bcnt > wcnt ? "Black" : "White";
  return {winner, bcnt, wcnt};
}

module.exports = {
  start,
  put,
  isFinish,
  result,
  SIDE,
  WHITE,
  EMPTY,
  BLACK,
};
