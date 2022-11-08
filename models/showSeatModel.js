import mongoose from 'mongoose';
const showSeatSchema =  new mongoose.Schema({
    price:{
        type: Number,
        require:true
    },
    id:{
        type: String,
        require:true
    },
    number:{
        type: String,
        require:true
    },
    isReserved:{
        type: Boolean
    },
    idShowing:{
        type: String,
        require:true
    }
   

});
const showSeat =  mongoose.model('showSeat',showSeatSchema);
export default showSeat;