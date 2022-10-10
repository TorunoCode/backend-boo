import mongoose from 'mongoose';
const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
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
    isActive:{
        type: Number,
        require:true
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