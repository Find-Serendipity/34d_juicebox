const express = require("express");
const jwt = require("jsonwebtoken");
const apiRouter = express.Router();

const { getUserById } = require("../db/index");

apiRouter.use(async (req, res, next) => {
  // establish and check for Authorization from Bearer

  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  //if no authorization provided, do next
  if (!auth) {
    next();
  }
  // else if auth header contains Bearer
  // create a token for the user
  else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    //if token provided, verify the token with jwt
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // if the user id is verified by jwt
    if (id) {
      // on validation from a login request, getUserById with the verified jwt id
      // set the logged-in user to be the user
      // then do next
      const user = await getUserById(id);
      req.user = { id: user.id, username: user.username };
      next();
    }
    // else do next
    else {
      next();
    }
  } // else do next
  else {
    next();
  }
});

apiRouter.get("/", (req, res) => {
  res.send("API Root /api");
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const comicsRouter = require("./comics");
apiRouter.use("/posts", postsRouter);

module.exports = apiRouter;
