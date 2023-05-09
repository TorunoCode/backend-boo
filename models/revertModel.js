import mongoose from 'mongoose';
const revertSchema =  new mongoose.Schema({
    idUser:{
        type: String,
        require:true
    },
    idNewUser:{
        type: String,
    },
    idOldOrder:{
        type: String,
        require:true
    },
    idNewOrder:{
        type: String,
    },
   startTime:{
        type: Date,
        require:true
    },
    money:{
        type: Number,
    },
    status:{
        type: Number
    },

});
const Revert =  mongoose.model('Revert',revertSchema);
export default Revert;
