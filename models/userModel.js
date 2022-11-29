import mongoose from 'mongoose';
const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    fullName:{
        type: String
    },
     email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    biography:{
        type:String,
        require:true
    },
    phone:{
        type:String
    },
    gender:{
        type:String
    },
    avatar:{
        type:String
    },
    isActive:{
        type: Boolean
    },
    pin:{
        type: String
    },
    isAdmin:{
        type:Boolean,
        require:true
    }

},
{
    timestamps:true
});
const User =  mongoose.model('User',userSchema);
export default User;