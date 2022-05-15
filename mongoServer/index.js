// Express server to communicate to the mongoDB game1 Database
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/game1";
const User = require("./user");
var bodyParser = require("body-parser");

const app = express();

// Allows any clients or server to access the apis
// This cors configuration is required or it ignores all api calls
// This is bad practice if you are using an actual server.
app.use(
  cors({
    origin: "*",
  })
);
app.set("port", 5000);

//Parses the boddy of each api requesets
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Uses mongoose to connect to the database
mongoose.connect(url).then(console.log("Connected to database"));

//Login Api
//Checks to see if user exists in database
//Returns the user data
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    res.json(user);
  } catch (e) {
    res.json({ message: e });
  }
});

//Create account api
//Gets user inputted data to create userModel
//Usermodel is then saved to the database
app.post("/createAccount", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.json("Success");
  } catch (e) {
    console.log(e);
    res.json({ message: e });
  }
});

//Update api
//Checks to see if user exists in database
//If it exists, update the user in the database
app.post("/update", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      req.body
    );
    console.log(user);
    res.json("Success");
  } catch (e) {
    console.log(e);
    res.json({ message: e });
  }
});

app.listen(5000, () => {
  console.log(`Server started on port 5000`);
});
