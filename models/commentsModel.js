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
const commentSchema =  new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    movieId:{
        type:String,
        require:true
    },
    detail:{
        type:String,
        require:true
    },
    replyToCommentId:{
        type:String,
        require:false
    }
},{
    timestamps:true
});
const comment =  mongoose.model('comment',commentSchema);
export default comment;