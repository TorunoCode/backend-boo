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
    totalMoney:{
        type: Number,
    },
    status:{
        type: Number
    },

}, {
    timestamps: true
});
const Revert =  mongoose.model('Revert',revertSchema);
export default Revert;
