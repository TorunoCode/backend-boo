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
const reviewsSchema =  new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },title:{
        type: String,
        require:true
    },
    detail:{
        type:String,
        require:true
    },
    movieId:{
        type:String,
        require:true
    },
    rate:{
        type: Number,
        require:true
    }
},{
    timestamps:true
});
const reviews =  mongoose.model('reviews',reviewsSchema);
export default reviews;