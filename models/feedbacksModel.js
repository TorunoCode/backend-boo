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
const opts = {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Math.floor( new Date((typeof Date.now() === "string" ? new Date(Date.now()) : Date.now()).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }))) },
  };
const feedbacksSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    }, title: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    movieId: {
        type: String,
        require: true
    },
    rate: {
        type: Number,
        require: true
    }
},{
    timestamps: true
},opts);
const feedback = mongoose.model('feedback', feedbacksSchema);
export default feedback;