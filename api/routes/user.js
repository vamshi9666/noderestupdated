const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");

const User = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({
        message: "mail already exists"
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      try {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
          ...req.body
        });
        const newUser = await user.save();
        const token = jwt.sign(
          {
            usrId: newUser._id,
            email: newUser.email
          },
          JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );
        delete newUser.password;
        res.status(201).json({
          message: "User created ",
          token,
          user: newUser
        });
      } catch (e) {
        res.status(500).json(e);
      }
    });
  } catch (e) {
    res.status(500).json(e);
  }
});
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
        if (result) {
          delete user.password;
          const token = jwt.sign(
            {
              email: user.email,
              usrId: user._id
            },
            JWT_SECRET,
            {
              expiresIn: "7d"
            }
          );
          return res.status(200).json({
            message: "Authorized user",
            token: token,
            user: { user, password: null }
          });
        }
        return res.status(401).json({
          message: "Authentication failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
