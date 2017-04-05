const SIDE = 8;
const WHITE = -1;
const EMPTY = 0;
const BLACK = 1;
const DXY = [-1, 0, 1];

interface Point {
  y:number;
  x:number;
}

interface ReversePoint {
  rp:Point;
  dy:number;
  dx:number;
}

let matrix:number[][] = null;

export function start() {
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

function inBoard(point:Point) {
  let x = point.x;
  let y = point.y;
  return 0 < x && x <= SIDE && 0 < y && y <= SIDE;
}

function reversePoint(point:Point, dy:number, dx:number, color:number):Point {
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

function reversePoints(point:Point, color:number):ReversePoint[] {
  if (color !== BLACK && color !== WHITE) {
    return [];
  }
  else if (inBoard(point) === false) {
    return [];
  }
  else if (matrix[point.y][point.x] !== EMPTY) {
    return [];
  }

  let rPoints:{rp:Point, dy:number, dx:number}[] = [];
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

function reverse(point:Point, color:number, rps:ReversePoint[]) {
  rps.forEach((v:{rp:Point, dy:number, dx:number}, i:number) => {
    let rp = v.rp;
    while (rp.x !== point.x || rp.y !== point.y) {
      matrix[rp.y][rp.x] = color;
      rp.y -= v.dy;
      rp.x -= v.dx;
    }
  });
}

export function put(point:Point, color:number):number[][] {
  let rps = reversePoints(point, color);
  if (rps.length === 0) {
    return null;
  }

  matrix[point.y][point.x] = color;
  reverse(point, color, rps);

  return matrix;
}

export function isFinish() {
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

export function result():{winner:string, bcnt:number, wcnt:number} {
  let bcnt: number = 0;
  let wcnt: number = 0;

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
