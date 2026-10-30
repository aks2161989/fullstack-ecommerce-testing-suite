const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// In-memory fallback if MongoDB is offline
const inMemoryUsers = [];
const SECRET_KEY = process.env.SECRET_KEY || "my_secret_key_12345";
const isDbConnected = () => mongoose.connection.readyState === 1;

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  if (isDbConnected()) {
    try {
      const isUserExist = await User.findOne({ email: req.body.email });
      if (isUserExist) {
        return res.status(400).send("user exist");
      }

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      });
      await user.save();
      return res.status(200).send({ user: user._id });
    } catch (dbErr) {}
  }

  // In-memory fallback
  const exists = inMemoryUsers.find((u) => u.email === req.body.email);
  if (exists) {
    return res.status(400).send("user exist");
  }
  const fakeUser = {
    _id: "user_" + Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  };
  inMemoryUsers.push(fakeUser);
  return res.status(200).send({ user: fakeUser._id });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = null;
  if (isDbConnected()) {
    try {
      user = await User.findOne({ email: req.body.email });
    } catch (dbErr) {}
  }

  if (!user) {
    user = inMemoryUsers.find((u) => u.email === req.body.email);
  }

  if (!user) {
    return res.status(400).send({ msg: "user does not exist" });
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("email or password wrong");
  }

  const token = jwt.sign({ _id: user._id }, SECRET_KEY);
  return res.header("auth-token", token).send({
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

// Testing helpers for test isolation and state resetting
router._resetInMemoryUsers = () => {
  inMemoryUsers.length = 0;
};
router._getInMemoryUsers = () => inMemoryUsers;

module.exports = router;
