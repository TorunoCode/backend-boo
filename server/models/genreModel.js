import mongoose from 'mongoose';

const genreSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    describe:{
        type:String,
    },

},{
    timestamps:true
});
const Genre =  mongoose.model('Genres',genreSchema);
export default Genre;