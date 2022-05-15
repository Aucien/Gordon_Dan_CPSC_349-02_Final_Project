import React, { useState } from "react";
import Login from "./Login";
import Game from "./Game";
import CreateAccount from "./CreateAccount";

//Entire project uses React hooks to store, edit,
//and pass data.
function Home() {
  //React js states and variables to hold information

  //Checks to see if user is logged in or not
  const [isAuth, setIsAuth] = useState(false);

  //Checks to see player wants to go to create account page
  const [create, setIsCreate] = useState(false);

  //Gets user data and is used for persistence
  const [user, setUser] = useState(null);

  return (
    <div>
      {/* If statement to display the game's homepage */}
      {isAuth ? (
        <Game user={user} setUser={setUser} />
      ) : (
        <div>
          {/* If statement to display the create account page */}
          {create ? (
            <CreateAccount />
          ) : (
            <div>
              {/* Displays Login page by default*/}
              <Login user={user} setUser={setUser} setIsAuth={setIsAuth} />

              {/* Button to change display to create account page */}
              <button
                onClick={() => {
                  setIsCreate(true);
                }}
              >
                CreateAccount
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
