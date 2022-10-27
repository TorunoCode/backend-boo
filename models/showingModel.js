import mongoose from 'mongoose';
const showingSchema =  new mongoose.Schema({
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
    image:{
        type: String,
    },
    status:{
        type: Boolean
    },

});
const Showing =  mongoose.model('Showing',showingSchema);
export default Showing;
