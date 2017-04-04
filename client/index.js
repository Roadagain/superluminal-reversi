var SIDE = 8;

function getCells() {
  var cells = [];
  var board = document.getElementById("board");

  for (var i = 0; i < SIDE; ++i) {
    cells.push(board.rows[i].cells);
  }

  return cells;
}

function getColor(num) {
  if (num === -1) {
    return "white";
  }
  else if (num === 0) {
    return "green";
  }
  else if (num === 1) {
    return "black";
  }
  else {
    return "";
  }
}

function put(cell, socket) {
  var x = cell.cellIndex + 1;
  var y = cell.parentElement.rowIndex + 1;
  var point = {x: x, y: y};

  console.log(point);
  socket.emit("put", point);
}

document.addEventListener("DOMContentLoaded", function() {
  var socket = io();
  var color = null;

  var countdown = document.getElementById("countdown");
  var result = document.getElementById("result");

  var readyButton = document.getElementById("ready");
  readyButton.addEventListener("click", function() {
    socket.emit("ready");
    readyButton.style.display = "none";
    countdown.innerHTML = result.innerHTML = "";
  });

  socket.on("color", function(c) {
    color = c;
    document.getElementById("color").innerHTML = "You are " + c;

    if (color === "black" || color === "white") {
      var board = document.getElementById("board");
      board.addEventListener("click", function(ev) {
        put(ev.target, socket);
      });
    }
  });

  socket.on("start", function() {
    var sentence = "Get Ready for the Next Battle!";

    countdown.innerHTML = sentence + " 3...";
    window.setTimeout(function () {
      countdown.innerHTML = sentence + " 2...";
    }, 1000);
    window.setTimeout(function () {
      countdown.innerHTML = sentence + " 1...";
    }, 2000);
    window.setTimeout(function () {
      countdown.innerHTML = "Fight!";
    }, 3000);
    window.setTimeout(function () {
      countdown.innerHTML = "";
    }, 4000);
  });

  var cells = getCells();
  socket.on("update", function(matrix) {
    console.log(matrix.join("\n"));
    for (var i = 0; i < SIDE; ++i) {
      for (var j = 0; j < SIDE; ++j) {
        cells[i][j].style.color = getColor(matrix[i + 1][j + 1]);
      }
    }
  });

  socket.on("finish", function (res) {
    var winner = "Winner is " + res.winner;
    var score = "● " + res.bcnt + " : " + res.wcnt + " ○";
    result.innerHTML = winner + "<br>" + score;

    ready.style.display = "block";
  });
});
