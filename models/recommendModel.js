import mongoose from 'mongoose';
const recommendSchema = new mongoose.Schema({
    idCustomer: {
        type: String
    },
    genre: {
        type: String
    },
    email: {
        type: String

    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const Recommend = mongoose.model('Recom', recommendSchema);
export default Recommend;