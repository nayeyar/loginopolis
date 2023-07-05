const express = require("express");
const app = express();
const { User } = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(
      "<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /register
app.post("/register", async (req, res, next) => {
  // TODO - takes req.body of {username, password} and creates a new user with the hashed password
  try {
    // let salt = bcrypt.genSaltSync(4);
    const salt = bcrypt.genSaltSync(); // 10 by default
    const { username, password } = req.body;
    const user = await User.create({
      username: username,
      password: bcrypt.hashSync(password, salt),
    });
    res.send(`successfully created user ${username}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /login
app.post("/login", async (req, res, next) => {
  // TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
  try {
    const { username, password } = req.body;
    const user = await User.findAll({ where: { username } });
    // const userData = await user.json();
    console.log(user[0].password);
    if (!user) {
      throw new Error("User not found");
    } else {
      const match = bcrypt.compareSync(password, user[0].password);
      if (match) {
        res.send(`successfully logged in user ${username}`);
      } else {
        res.status(401).send("incorrect username or password");
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
