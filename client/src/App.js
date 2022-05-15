import "./App.css";
import React, { useEffect, useState } from "react";
import Home from "./components/home";

//Brings up the home component
function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

/* <input
  placeholder="roomcode"
  onChange={(event) => setRoomCode(event.target.value)}
/>
<button onClick={joinRoom}>join Room</button>
<Board socket={socket} roomCode={roomCode} /> */
