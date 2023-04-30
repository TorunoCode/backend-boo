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
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    describe: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    runningTime: {
        type: Number,
        require: true
    },
    language: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    linkReview: {
        type: String,
        require: true
    },
    rate: {
        type: Number,
        require: true,
        default: 0
    },
    cast: {
        type: String,
        require: true
    },
    director: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    releaseTime: {
        type: Date
    },
    isActive: {
        type: Number,
        require: 1
    }

}, {
    timestamps: true
});
const Movie = mongoose.model('Movie', movieSchema);
export default Movie;