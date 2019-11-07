const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");
const { Router } = require("express");
const { successRes, failRes } = require("../utils");
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({
      email: email
    });
    console.log("existingAdmin", existingAdmin);
    if (existingAdmin) {
      return res.status(409).json(failRes(409, "admin account already exists"));
    }
    bcrypt.hash(password, 10, async (hashErr, hash) => {
      const newAdmin = new Admin({
        email,
        password: hash
      });
      const createdAdmin = await newAdmin.save();
      const token = jwt.sign(
        {
          usrId: createdAdmin._id,
          email: createdAdmin.email
        },
        JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );
      createdAdmin.password = "";
      res.status(200).json(
        successRes(200, {
          token,
          newAdmin
        })
      );
    });
  } catch (error) {
    res.status(500).json(failRes(500, {}, " internal server error" + error));
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email })
    .exec()
    .then(admin => {
      if (!admin) {
        return res.status(404).json({
          message: "account not found"
        });
      }
      bcrypt.compare(password, admin.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
        console.log(" result is ", result);
        if (result) {
          delete admin.password;
          const token = jwt.sign(
            {
              email: admin.email,
              usrId: admin._id
            },
            JWT_SECRET,
            {
              expiresIn: "7d"
            }
          );
          return res.status(200).json({
            message: "Authorized admin",
            token: token,
            admin: { admin, password: null }
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
