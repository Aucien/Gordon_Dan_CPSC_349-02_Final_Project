import React, { useState } from "react";
import axios from "axios";

//Login page
//Gets user data, setUser function, and setIsAuth function
// from home page
function Login({ user, setUser, setIsAuth }) {
  //Displays whether or not user successfully created account
  //or not
  const [error, setError] = useState("");

  //Function to check whether account exists in database
  //And set authentication to true
  async function login(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", user);
      console.log(res.data);
      if (res.data !== null) {
        setUser(res.data);
        setIsAuth(true);
      } else {
        setError("ERROR: COULD NOT FIND ACCOUNT");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  return (
    <div className="login">
      {error}
      <br />
      <label>Login</label>
      <form>
        <label>Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          onChange={(event) => {
            setUser({ ...user, username: event.target.value });
          }}
          required
        />
        <label>Password</label>
        <input
          type="text"
          name="password"
          id="password"
          placeholder="password"
          onChange={(event) => {
            setUser({ ...user, password: event.target.value });
          }}
          required
        />
        <button onClick={login}>Login</button>
      </form>
    </div>
  );
}

export default Login;
