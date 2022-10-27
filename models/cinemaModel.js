import mongoose from 'mongoose';
const cinemaSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    location:{
        type: String,
        require:true
    },

});
const Cinema =  mongoose.model('Cinema',cinemaSchema);
export default Cinema;