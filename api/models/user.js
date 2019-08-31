
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId, //uncomment to add constraints on writing values
        email: {
            type: String, 
            require: true,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        
        },
        password: {type: String, require: true}
        
    }
);
module.exports = mongoose.model('User',userSchema);