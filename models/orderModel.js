import mongoose from 'mongoose';
const orderSchema =  new mongoose.Schema({
    idShowSeat:{
         type: String, require: true
    },
    idShowing:{
         type: String, require: true
    },
    idBill:{
         type: String
    },
    idCustomer:{
        type: String, require: true
   },
    image:{
        type:String
    },
    status:{
         type: Number, require: true
    }

});
const Order =  mongoose.model('Order',orderSchema);
export default Order;