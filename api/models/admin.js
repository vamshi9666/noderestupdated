const { Schema, model } = require("mongoose");

module.exports = model(
  "admin",
  Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
  })
);
