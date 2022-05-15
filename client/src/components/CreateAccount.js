import React, { useState } from "react";
import axios from "axios";

//Create Account page
function CreateAccount() {
  //Stores and update user data
  const [user, setUser] = useState(null);

  //Announcer to display whether account was successfully created
  const [announcer, setAnnouncer] = useState("");

  //Function to send user profile to the createAccount API
  async function signup(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/createAccount", user);
      if (res.data === "Success") {
        setAnnouncer("Successfully created Account");
      } else {
        setAnnouncer("ERROR COULD NOT CREATE ACCOUNT");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  return (
    <div className="createAccount">
      {announcer}
      <br />
      <label>Sign up</label>
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
        <button onClick={signup}>Sign up</button>
      </form>
    </div>
  );
}

export default CreateAccount;
