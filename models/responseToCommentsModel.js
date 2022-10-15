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
const likeDislikeToCommentSchema =  new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    commentId:{
        type:String,
        require:true
    },
    movieId:{
        type:String,
        require:true
    },
    likeDislike:{
        type:Boolean,
        require:true
    }
},{
    timestamps:true
});
const likeDislikeToComment =  mongoose.model('responseToComment',likeDislikeToCommentSchema);
export default likeDislikeToComment;