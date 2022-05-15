import React, { useState, useEffect } from "react";
import Board from "./board";
import io from "socket.io-client";

//Connects to the gameServer in the gameServer folder
const socket = io.connect("http://localhost:3001");

//Game home page
//Gets user data and setUser function from home
function Game({ user, setUser }) {
  //roomCode Variable and setter function
  const [roomCode, setRoomCode] = useState("");

  //Checks to see if user has entered th room
  const [entered, setEntered] = useState(false);

  //Checks to see if opponent has entered the room
  const [startGame, setStartGame] = useState(false);

  const Hello = `Hello ${user.username}`;
  const playStats = `Games won: ${user.gamesWon}    Games lost: ${user.gamesLost}`;

  //Checks to see if there is any changes to the player created room
  //in the game server
  useEffect(() => {
    //When player creates the room
    //Check to see if room has 2 people and starts the game
    //from the gameServer
    socket.on("roomSize", (size) => {
      start();
    });

    //When player is joining a room
    //start the game
    socket.on("listen", (data) => {
      setStartGame(true);
    });
  });

  //Function to join room from the gameServer
  const joinRoom = () => {
    if (roomCode !== "") {
      socket.emit("join_room", roomCode);
    }
    setEntered(true);
  };

  //Function to start the game
  //And tell the opponent's borwser to start the game
  function start() {
    setStartGame(true);
    socket.emit("startGame", { startGame, roomCode });
  }

  return (
    <div>
      {/* If Function to check if both players hasjoined the room */}
      {entered ? (
        //Enter the gameboard component
        <div>
          {startGame ? (
            <Board
              socket={socket}
              roomCode={roomCode}
              user={user}
              setUser={setUser}
            />
          ) : (
            // Else statement when one of the players entered room
            <h1>Waiting For player</h1>
          )}
        </div>
      ) : (
        //Displays the games home screen
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
