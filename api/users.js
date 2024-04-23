const express = require("express");
const usersRouter = express.Router();
const {
  registerUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} = require("../db");
const { requireUser } = require("./utils");

// if the user logs in give them a signed token in state

const signToken = (username, id) => {
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });
  return token;
};

// Create

// create a new user

usersRouter.post("/register", async (req, res) => {
  // given username and password on body
  const { username, plainPassword } = req.body;

  // salt and hash password
  const saltRounds = 32;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  try {
    //Create the user with the username and hashed password
    const user = registerUser(username, hashedPassword);

    //Sign a token with user info
    const token = signToken(user.username, user.id);

    //Send back the token
    res.send({ message: "Thanks for registering!", token });
  } catch (err) {
    console.log("Error with user creation!", err);
    res.sendStatus(500);
  }
});

// Read

// PATH: /api/users/
usersRouter.get("/", async (req, res) => {
  try {
    //get all the comics
    const comics = await getAllComics();

    res.send(comics);
  } catch (err) {
    res.sendStatus(500);
  }
});

usersRouter.get("/myPosts", requireUser, async (req, res) => {
  try {
    const comics = await getAllUsersComics(req.user.id);

    res.send(comics);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Update

// Delete

usersRouter.delete("/:id", requireUser, async (req, res) => {
  try {
    const comicId = req.params.id;
    console.log(comicId);
    const result = await deleteComic(comicId);
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = usersRouter;

const express = require("express");
const bcrypt = require("bcrypt");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { client, createUser } = require("../db");

const signToken = (username, id) => {
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });
  return token;
};

usersRouter.get("/", (req, res) => {
  res.send("This is the root for /api/users");
});

//Log in a user
usersRouter.post("/login", async (req, res) => {
  //they give me a username and password on the body
  const username = req.body.username;
  const plainTextPassword = req.body.password;

  //Does this user exist?
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username = $1
    `,
      [username]
    );

    //If there is no user send back a 401 Unauthorized
    if (!user) {
      res.sendStatus(401);
    } else {
      //Check the password against the hash
      const passwordIsAMatch = await bcrypt.compare(
        plainTextPassword,
        user.password
      );
      if (passwordIsAMatch) {
        //This is a valid log in

        const token = signToken(user.username, user.id);

        res.send({ message: "Succesfully Logged in", token });
      } else {
        res.sendStatus(401);
      }
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Create a user with a hashed password

module.exports = usersRouter;
