/// <reference path="../typings/index.d.ts" />

import * as express from "express";
let app = express();
let http = require("http");
let server = http.Server(app);
import * as socketio from "socket.io";
let io = socketio(server);
import Runner from "./runner";
import * as reversi from "./reversi";

const PORT = 8000;

app.use(express.static("../client"));

app.get("/", (req:any, res:any) => {
  res.sendfile("index.html");
});

let black:Runner = null;
let white:Runner = null;

function color(id:string) {
  if (black !== null && black.id === id) {
    return black;
  }
  else if (white !== null && white.id === id) {
    return white;
  }
  return null;
}

io.on("connection", socket => {
  console.log(socket.id + " connected");

  if (black === null) {
    black = new Runner(socket.id, reversi.BLACK);
    socket.emit("color", "black");
  }
  else if (white === null) {
    white = new Runner(socket.id, reversi.WHITE);
    socket.emit("color", "white");
  }
  else {
    socket.emit("color", "empty");
  }

  socket.on("ready", () => {
    let c = color(socket.id);
    if (c === null) {
      return;
    }

    if (c === black) {
      console.log("black is ready");
    }
    else {
      console.log("white is ready");
    }
    c = new Runner(c.id, c.num, true);

    if (black !== null && black.ready && white !== null && white.ready) {
      io.sockets.emit("start");
      let matrix = reversi.start();
      io.sockets.emit("update", matrix);
    }
  });

  socket.on("disconnect", () => {
    let c = color(socket.id);
    if (c === black) {
      black = null;
      console.log("black " + socket.id + " disconnected");
    }
    else if (c === white) {
      white = null;
      console.log("white " + socket.id + " disconnected");
    }
    else {
      console.log(socket.id + " disconnected");
    }
  });

  socket.on("put", (point:reversi.Point) => {
    let c = color(socket.id);
    if (c === null || black.ready !== true || white.ready !== true) {
      return;
    }

    let matrix = reversi.put(point, c.num);
    if (matrix !== null) {
      console.log(point);
      console.log(matrix.join("\n") + "\n");
      io.sockets.emit("update", matrix);
      if (reversi.isFinish()) {
        let result = reversi.result();
        io.sockets.emit("finish", result);
        console.log(result);
      }
    }
    else {
      let colorString = (c === black ? "black" : "white");
      console.log(JSON.stringify(point) + " " + colorString + " rejected");
    }
  });
});

server.listen(PORT, () => {
  console.log("listening on %d...", PORT);
});
