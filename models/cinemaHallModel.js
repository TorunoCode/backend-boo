import mongoose from 'mongoose';
const cinemaHallSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    totalSeats:{
        type: Number,
        require:true
    },
    idCinema:{
        type: String,
        require:true
    },

});
const CinemaHall =  mongoose.model('CinemaHall',cinemaHallSchema);
export default CinemaHall;