import mongoose from 'mongoose';
const showingSchema =  new mongoose.Schema({
    idCinema:{
        type: String,
        require:true
    },
    idHall:{
        type: String,
        require:true
    },
    idMovie:{
        type: String,
        require:true
    },
    price:{
        type: Number,
        require:true
    },
   startTime:{
        type: Date,
        require:true
    },
    time:{
        type: String,
    },
    status:{
        type: Boolean,
        default: true
    },

}, {
    timestamps: true
});
const Showing =  mongoose.model('Showing',showingSchema);
export default Showing;
