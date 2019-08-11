const express = require('express'); //using express framework
const app = express();              //creating express object as app
const morgan = require('morgan');   //monitors the req/res transfer details
const bodyParser = require('body-parser');  //parses the content according to specifics
const mongoose = require('mongoose'); //mongodb-driver for nodejs


const acceptedRoutes = require('./api/routes/acceptedroutes'); //routing to products.js
const requestedRoutes = require('./api/routes/requestedroutes');     //routing to requests.js

//DATABASE CONNECTION
mongoose.connect('mongodb+srv://vamshik:' + "vk12po34" +'@nodejstest-3bfyd.mongodb.net/test?retryWrites=true&w=majority');


app.use(morgan('dev'));     //using morgan before handling requests (In dev)
app.use(bodyParser.urlencoded({extended: false})); //parse simple URL encoded data
app.use(bodyParser.json());     //extracts json data for readability

//CORS access to api(diasbling security)
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*"); //access to everyone(*)
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') //single-page requests 
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//Routes handling requests
app.use('/acceptedroutes',acceptedRoutes);
app.use('/requestedroutes',requestedRoutes);


//Route against intended url (invalid url)
app.use((req,res,next) => {
    const error = new Error('Not Found'); //dislay error message
    error.status = 404;          //set error code
    next(error);        //forward the request
});



//catch errors thrown outside the application (DBs,scripts,etc)
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
       error : {
           message : error.message
       } 
    });
});

module.exports = app;