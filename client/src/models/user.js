const mongoose = require('mongoose');
const UserSchema =  new mongoose.Schema({
    fullName:{
        type: String,
        require:true
    },
     email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true,
        require:true
    },
     dob:{
        type:Date,
        require:true
    },
     sex:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    isActive:{
        type: Number,
        require:true
    },
    pin:{
        type: String,
        require:true
    },
    dateCreate:{
        type:Date,
        require:true
    },
    dateUpdate:{
        type:Date,
        require:true
    },
    isAdmin:{
        type:Number,
        require:true
    }

});
const User =  mongoose.model('customers',UserSchema);
module.exports = User;