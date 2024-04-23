// import and use dotenv
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// import and use express
const express = require("express");
const server = express();

// import and use morgan
const morgan = require("morgan");
server.use(morgan("dev"));

// import and use body-parser for raw and urlencoded
const bodyParser = require("body-parser");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

// import and use jwt
// Check requests for a token and attach the decoded id to the request
const jwt = require("jsonwebtoken");

server.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT);
  } catch {
    req.user = null;
  }

  next();
});

// log morgan on body
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

// listen for port connection
server.listen(PORT, () => {
  console.log(`GET A REFRESHING TASTE OF PORT ${PORT} HERE!`);
});
