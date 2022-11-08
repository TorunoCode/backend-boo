import mongoose from 'mongoose';
const orderSchema =  new mongoose.Schema({
    idShowSeat:{
         type: String, require: true
    },
    idshowing:{
         type: String, require: true
    },
    idBill:{
         type: String
    },
    idCustomer:{
        type: String, require: true
   },
    image:{
        type:Date
    },
    status:{
         type: String, require: true
    }

});
const Order =  mongoose.model('Order',orderSchema);
export default Order;