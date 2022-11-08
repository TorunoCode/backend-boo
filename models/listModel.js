import mongoose from 'mongoose';
const listSchema =  new mongoose.Schema({
    id:{
        type: String,
        require:true
    },
    number:{
        type: String,
        require:true
    },

});
const List =  mongoose.model('List',listSchema);
export default List;