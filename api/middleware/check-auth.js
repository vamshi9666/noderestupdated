const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");
const User = require("../models/user");
module.exports = async (req, res, next) => {
  try {
    console.log(" headres are ", req.headers);
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      res.status(400).json({
        message: "token missing in headers "
      });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, usrId } = decoded;
    const user = await User.findById(usrId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      error
    });
  }
};
