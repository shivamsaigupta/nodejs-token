const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API"
  });
});

// protected POST
app.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created",
        authData: authData
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  // dummy user
  const user = {
    id: 1,
    username: "sam",
    email: "sam@gmail.com"
  };
  jwt.sign({ user: user }, "secretKey", { expiresIn: "30s" }, (err, token) => {
    if (err) {
      let error = new Error("Error assigning token");
      error.code = 500;
      res.json({
        error: error
      });
    }
    res.json({
      token: token
    });
  });
});

// verify token
function verifyToken(req, res, next) {
  // get header
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Format of token
    // Authorization: Bearer <access_token>

    // split at the space
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log("Server listening on port 3000"));
