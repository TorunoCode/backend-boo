import mongoose from 'mongoose';
const showSeatSchema =  new mongoose.Schema({
    price:{
        type: Number,
        require:true
    },
    idCinemaHallSeat:{
        type: String,
        require:true
    },
    idShowing:{
        type: String,
        require:true
    },
    status:{
        type: Number,
        require:true
    },

});
const showSeat =  mongoose.model('showSeat',showSeatSchema);
export default showSeat;