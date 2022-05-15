const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/game1";
const User = require("./user");
var bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.set("port", 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(url).then(console.log("Connected to database"));

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    res.json(user);
  } catch (e) {
    res.json({ message: e });
  }
});

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
