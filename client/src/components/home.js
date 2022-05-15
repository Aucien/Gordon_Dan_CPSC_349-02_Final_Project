import React, { useState } from "react";
import Login from "./Login";
import Game from "./Game";
import CreateAccount from "./CreateAccount";

function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [create, setIsCreate] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div>
      {isAuth ? (
        <Game user={user} setUser={setUser} />
      ) : (
        <div>
          {create ? (
            <CreateAccount />
          ) : (
            <div>
              <Login user={user} setUser={setUser} setIsAuth={setIsAuth} />
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
