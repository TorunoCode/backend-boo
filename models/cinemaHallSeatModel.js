import mongoose from 'mongoose';
const cinemaHallSeatSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    seatRow:{
        type: String,
        require:true
    },
    seatColumn:{
        type: Number,
        require:true
    },
    type:{
        type:String,
        require:true
    }

});
const CinemaHallSeat =  mongoose.model('CinemaHallSeat',cinemaHallSeatSchema);
export default CinemaHallSeat;