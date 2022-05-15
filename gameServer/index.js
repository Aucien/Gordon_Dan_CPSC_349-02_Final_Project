// Express and Socket.io server
// to handle passing player moves and joining rooms

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors);
app.set("port", 3001);

//Socket.io requires http.create Server to run
const server = http.createServer(app);

//List to hold how many players are in a particular
//Room
var numClients = {};

//Creates the socket.io server
//Allows the client to communicate to the server
//This cor configuration is required or it ignores all
//api calls
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Checks to see if user has connected to the server
io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);

  //Checks to see when user joins a room
  //Sends back how users are in a room
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

  //Gets players moves from the gameBoard
  //Sends players move to the opponent
  socket.on("play", (data) => {
    console.log(`${data.roomCode}: Position updated ${data}`);
    socket.to(data.roomCode).emit("updateGame", data);
  });

  //Tells the second player who joins the room to
  //display the game board
  socket.on("startGame", (data) => {
    console.log("data");
    console.log(`${data.roomCode}: startGame ${data}`);
    socket.to(data.roomCode).emit("listen", data);
  });

  //Checks to see when user has disconnected
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(app.get("port"), () =>
  console.log(`Server started on port ${app.get("port")}`)
);
