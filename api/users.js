const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

const {
  registerUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deletePost,
} = require("../db");

// if the user logs in give them a signed token in state
const signToken = (username, id) => {
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "2w",
  });
  return token;
};

// Create/Login

// register a new account - PATH: /api/users/register
usersRouter.post("/register", async (req, res) => {
  // given username and password on body
  const { username, password } = req.body;

  // salt and hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

// login to an existing account using jwt - PATH: /api/users/login
usersRouter.post("/login", async (req, res) => {
  //they give me a username and password on the body
  const username = req.body.username;
  const plainPassword = req.body.password;

  //Does this user exist?
  try {
    const user = await getUserByUsername(username);

    //If there is no user send back a 401 Unauthorized
    if (!user) {
      res.sendStatus(401);
    } else {
      //Check the password against the hash
      const passwordIsAMatch = await bcrypt.compare(
        plainPassword,
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

// Read

// Get all users - PATH: /api/users/
usersRouter.get("/", async (req, res) => {
  try {
    //get all the users
    const users = await getAllUsers();

    res.send(users.username);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Get all a single user's posts - PATH: /api/users/:id/posts
usersRouter.get("/:id/posts", requireUser, async (req, res) => {
  try {
    const posts = await getPostsByUser(req.user.id);

    res.send(posts);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Update

// Update a user's information - PATH: /api/users/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await updateUser({
      username,
      hashedPassword,
    });

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Delete

// Delete a single user's single post - PATH: /api/users/:userid/posts/:id
usersRouter.delete("/:userid/posts/:id", requireUser, async (req, res) => {
  try {
    const userid = req.user.id;
    const postId = req.params.id;

    // if the user sending the request is NOT the logged in user
    // send an error message
    if (!userid) {
      res.sendStatus(401);
    }
    // else, delete the post
    else {
      const result = await deletePost(postId);
      res.send(result);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = usersRouter;
