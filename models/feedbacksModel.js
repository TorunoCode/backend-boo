import mongoose from 'mongoose';
// const reviewSchema = mongoose.Schema({
//     name:{
//         type:String,
//         require:true
//     },
//     // reviews:[reviewSchema]
//     rate:{
//         type:Number,
//         require:true
//     },
//     comment:{
//         type:String,
//         require:true
//     },
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         require:true,
//         ref:"User"
//     }
// });
const feedbacksSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    }, title: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});
const feedback = mongoose.model('feedback', feedbacksSchema);
export default feedback;