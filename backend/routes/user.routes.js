const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

//Register
userRouter.post("/register", async (req, res) => {
  const { username, avatar, email, password } = req.body;
  try {
    const exUser = await UserModel.findOne({ email });
    if (exUser) {
      res.status(200).send({ message: "Email already exist!" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(200).send({ message: "Not able to generate hash" });
        } else {
          const user = new UserModel({
            username,
            avatar,
            email,
            password: hash,
          });

          await user.save();
          res
            .status(200)
            .send({ message: "New user registered", newUser: user });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.Key
          );
          res.status(200).send({
            message: "Login Successful!",
            token: token,
            userId: user._id,
          });
        } else {
          res.status(200).send({
            message: "Wrong Credentials!",
          });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = { userRouter };
