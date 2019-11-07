//ROUTE IS THE SCHEMA CREATED IN THE MONGODB

const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //uncomment to add constraints on writing values
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "route",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }, ////{type: Number, required: true}
  studentName: { type: String },
  location: { type: String, required: false, default: "last stop" }
});
module.exports = mongoose.model("request", requestSchema);
