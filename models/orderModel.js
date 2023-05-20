import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
     idShowSeat: {
          type: String, require: true
     },
     idShowing: {
          type: String, require: true
     },
     idBill: {
          type: String
     },
     idCustomer: {
          type: String, require: true
     },
     image: {
          type: String
     },
     status: {
          type: Number, require: true
     }
}, {
     timestamps: true,
     toJSON: { virtuals: true },
     toObject: { virtuals: true }
});
orderSchema.virtual('Ordershowing', {
     ref: 'Showing',
     localField: 'idShowing',
     foreignField: '_id',
     justOne: true
});
const Order = mongoose.model('Order', orderSchema);
export default Order;