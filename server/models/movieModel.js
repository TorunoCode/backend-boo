import mongoose from 'mongoose';
const reviewSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    // reviews:[reviewSchema]
    rate:{
        type:Number,
        require:true
    },
    comment:{
        type:String,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    }
});
const movieSchema =  new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    describe:{
        type:String,
        require:true
    },
    genre:{
        type:String,
        require:true
    },
    runningTime:{
        type:Number,
        require:true
    },
    language:{
        type:String,
        require:true
    },
    image:{
        type: String,
        require:true
    },
    linkReview:{
        type:String,
        require:true
    },
    rate:{
        type: String,
        require:true
    },
    cast:{
        type: String,
        require:true
    },
    director:{
        type: String,
        require:true
    },
    price:{
        type: Number,
        require:true
    },
    isActive:{
        type: Number,
        require:true
    },
    releaseTime:{
        type:Date,
        require:true
    },
    dateCreate:{
        type:Date
    },
    dateUpdate:{
        type:Date
    }

});
const Movie =  mongoose.model('Movie',movieSchema);
export default Movie;