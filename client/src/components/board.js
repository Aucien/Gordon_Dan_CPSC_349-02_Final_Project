import React, { useState, useEffect } from "react";
import Square from "./square";
import axios from "axios";

//Tic-tac-Toe game board and logic
//Receives socket function, roomCode, User Data,
//and function to update setUsers
function Board({ socket, roomCode, user, setUser }) {
  //Board array to store square positions and player input
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);

  //Displays result of game match
  const [result, setResult] = useState("");

  //Player are X's
  const [player, setPlayer] = useState("X");

  //Checks to see which player's turn
  const [turn, setTurn] = useState("X");

  //Get's user data and sends it to the update api in mongoServer
  async function updatePlayerScore() {
    try {
      console.log(user);
      const res = await axios.post("http://localhost:5000/update", user);
      console.log(res.data);
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  //Function to check if there is any updates to the UI
  useEffect(() => {
    //Checks when opponent makes a move
    socket.on("updateGame", (id) => {
      console.log("use effect", id);
      opponent(id.square);
      setTurn("X");
    });
    checkTie();
    checkWin();
  }, [board]);

  //Winning condition list
  const winCond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //Function to update gameboard to show opponents move
  const opponent = (square) => {
    console.log(square);
    setBoard(
      board.map((val, idx) => {
        if (idx === square && val === "") {
          return "O";
        }
        return val;
      })
    );
  };

  //Function to update gameboard to show Player's move
  //Set turn to opponents turn
  const chooseSquare = (square) => {
    if (turn === player && board[square] === "") {
      setTurn("O");
      socket.emit("play", { square, roomCode });
      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }
          return val;
        })
      );
    }
  };

  //Function to check if either player has hit the winning condition
  const checkWin = () => {
    winCond.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      //Once a player hits a winning condition,
      //Updates player data if they won or lost
      if (foundWinningPattern) {
        if (board[currPattern[0]] === "X") {
          setResult("You Won");
          var temp = user.gamesWon + 1;
          setUser({ ...user, gamesWon: temp });
          updatePlayerScore();
          console.log(user);
        } else {
          setResult("You Lost");
          var temp = user.gamesLost + 1;
          setUser({ ...user, gamesLost: temp });
          updatePlayerScore();
          console.log(user);
        }
      }
    });
  };

  //Checks if entire gameboard was filled
  const checkTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });
    //If entire board was filled and none of the player won
    //then display result as a tie
    if (filled) {
      setResult("It's a tie");
    }
  };

  return (
    <div>
      {/* Displays the results of the game */}
      <h1>{result}</h1>
      <h2>Refresh browser to logout and leave game</h2>

      {/* Displays the entire gameboard
          and when a square has been update the square */}
      <div className="board">
        <div className="row">
          <Square
            val={board[0]}
            chooseSquare={() => {
              chooseSquare(0);
            }}
          />
          <Square
            val={board[1]}
            chooseSquare={() => {
              chooseSquare(1);
            }}
          />
          <Square
            val={board[2]}
            chooseSquare={() => {
              chooseSquare(2);
            }}
          />
        </div>
        <div className="row">
          <Square
            val={board[3]}
            chooseSquare={() => {
              chooseSquare(3);
            }}
          />
          <Square
            val={board[4]}
            chooseSquare={() => {
              chooseSquare(4);
            }}
          />
          <Square
            val={board[5]}
            chooseSquare={() => {
              chooseSquare(5);
            }}
          />
        </div>
        <div className="row">
          <Square
            val={board[6]}
            chooseSquare={() => {
              chooseSquare(6);
            }}
          />
          <Square
            val={board[7]}
            chooseSquare={() => {
              chooseSquare(7);
            }}
          />
          <Square
            val={board[8]}
            chooseSquare={() => {
              chooseSquare(8);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Board;
