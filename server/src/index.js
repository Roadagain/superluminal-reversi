let express = require("express");
let app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let Runner = require("./runner");
let reversi = require("./reversi");

const PORT = 8000;

app.use(express.static("../client"));

app.get("/", (req, res) => {
  res.sendfile("index.html");
});

let black = null;
let white = null;

function color(id) {
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
    c.ready = true;

    if (black !== null && black.isReady() && white !== null && white.isReady()) {
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

  socket.on("put", (point) => {
    let c = color(socket.id);
    if (c === null || black.isReady() !== true || white.isReady() !== true) {
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

http.listen(PORT, () => {
  console.log("listening on %d...", PORT);
});
