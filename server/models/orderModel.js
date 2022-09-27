import mongoose from 'mongoose';
const orderSchema =  new mongoose.Schema({
    fullName:{
        type: String, require: true
    },
    name:{
         type: String, require: true
    },
    seat:{
        type:Number, require: true
    },
    hell:{
         type: String, require: true
    },
    static:{
        type:Number, require: true
    },
    image:{
         type: String, require: true
    },
    price:{
        type:Number, require: true
    },
    idshowing:{
         type: String, require: true
    },
    idBill:{
         type: String, require: true
    },
    dateStart:{
        type:Date, require: true
    },
    time:{
         type: String, require: true
    }

});
const Order =  mongoose.model('Order',orderSchema);
export default Order;