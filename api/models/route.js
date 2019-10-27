//ROUTE IS THE SCHEMA CREATED IN THE MONGODB

const mongoose = require("mongoose");

const routeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //uncomment to add constraints on writing values
  destination: { type: String, required: true },
  route_index: { type: String, required: true },
  no_seats: { type: Number, required: true, default: 100 }
});
module.exports = mongoose.model("route", routeSchema);
