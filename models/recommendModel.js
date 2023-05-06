import mongoose from 'mongoose';
const recommendSchema = new mongoose.Schema({
    idCustomer: {
        type: String
    },
    genre: {
        type: String
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
recommendSchema.virtual('user', {
    ref: 'User',
    localField: 'idCustomer',
    foreignField: '_id',
    justOne: true
});
const Recommend = mongoose.model('Recom', recommendSchema);
export default Recommend;