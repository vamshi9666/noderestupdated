//ROUTE IS THE SCHEMA CREATED IN THE MONGODB

const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId, //uncomment to add constraints on writing values
        route: {type:mongoose.Schema.Types.ObjectId, ref: 'Route' },
        studentId: {type: String },  ////{type: Number, required: true} 
        studentName:{type: String},
        location: {type:String,required:true,default:"last stop"}
        
    }
);
module.exports = mongoose.model('Request',requestSchema);