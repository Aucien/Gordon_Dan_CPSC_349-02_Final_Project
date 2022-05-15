const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/game";
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors);
app.set("port", 3001);

const server = http.createServer(app);

var numClients = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);

  socket.on("join_room", (roomCode) => {
    socket.join(roomCode);
    if (numClients[roomCode] == undefined) {
      numClients[roomCode] = 1;
    } else {
      numClients[roomCode]++;
    }
    console.log(roomCode);
    socket.to(roomCode).emit("roomSize", numClients[roomCode]);
  });

  socket.on("play", (data) => {
    console.log(`${data.roomCode}: Position updated ${data}`);
    socket.to(data.roomCode).emit("updateGame", data);
  });

  socket.on("startGame", (data) => {
    console.log("data");
    console.log(`${data.roomCode}: startGame ${data}`);
    socket.to(data.roomCode).emit("listen", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(app.get("port"), () =>
  console.log(`Server started on port ${app.get("port")}`)
);
