import React, { useState, useEffect } from "react";
import Square from "./square";
import axios from "axios";

function Board({ socket, roomCode, user, setUser }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [result, setResult] = useState("");
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  async function updatePlayerScore() {
    try {
      console.log(user);
      const res = await axios.post("http://localhost:5000/update", user);
      console.log(res.data);
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  useEffect(() => {
    socket.on("updateGame", (id) => {
      console.log("use effect", id);
      opponent(id.square);
      setTurn("X");
    });
    checkTie();
    checkWin();
  }, [board]);

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

  const checker = (square) => {
    console.log(turn);
    if (turn) {
      chooseSquare(square);
    }
    setTurn(false);
  };

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

  const checkTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult("It's a tie");
    }
  };

  return (
    <div>
      <h1>{result}</h1>
      <h2>Refresh browser to logout and leave game</h2>
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
