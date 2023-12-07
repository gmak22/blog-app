const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.key, (err, decoded) => {
      if (decoded) {
        req.body.username = decoded.username;
        req.body.userId = decoded.userId;
        next();
      } else {
        res.status(200).send({ message: "You are not authorized!" });
      }
    });
  } else {
    res.status(400).send({ message: "Please login first!" });
  }
};

module.exports = { auth };
