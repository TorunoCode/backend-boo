import mongoose from 'mongoose';
const recommendSchema = new mongoose.Schema({
    idCustomer: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true

    },
    count: {
        type: Number,
        require: false,
        default: 0
    }
}, {
    timestamps: true
});
const Recommend = mongoose.model('Recom', recommendSchema);
export default Recommend;