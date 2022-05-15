import React, { useState, useEffect } from "react";
import Board from "./board";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function Game({ user, setUser }) {
  const [roomCode, setRoomCode] = useState("");
  const [entered, setEntered] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const Hello = `Hello ${user.username}`;
  const playStats = `Games won: ${user.gamesWon}    Games lost: ${user.gamesLost}`;
  useEffect(() => {
    socket.on("roomSize", (size) => {
      start();
    });
    socket.on("listen", (data) => {
      setStartGame(true);
    });
  });

  const joinRoom = () => {
    if (roomCode !== "") {
      socket.emit("join_room", roomCode);
    }
    setEntered(true);
  };

  function start() {
    setStartGame(true);
    socket.emit("startGame", { startGame, roomCode });
  }

  return (
    <div>
      {entered ? (
        <div>
          {startGame ? (
            <Board
              socket={socket}
              roomCode={roomCode}
              user={user}
              setUser={setUser}
            />
          ) : (
            <h1>Waiting For player</h1>
          )}
        </div>
      ) : (
        <div>
          <h1>{Hello}</h1>
          <h3>Here are your stats</h3>
          <h3>{playStats}</h3>
          <h2>Create/Join a room </h2>
          <input
            placeholder="roomcode"
            onChange={(event) => setRoomCode(event.target.value)}
          />
          <button onClick={joinRoom}>join Room</button>
        </div>
      )}
    </div>
  );
}

export default Game;
