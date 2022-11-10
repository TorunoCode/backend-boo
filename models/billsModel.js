import mongoose from 'mongoose';

const billsSchema =  new mongoose.Schema({
    totalMoney:{
        type:Number,
        require:true
    },
    idCustomer:{
        type:String,
        require:true
    },
    pin:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:false
    }
},{
    timestamps:true
});
const bills =  mongoose.model('bills',billsSchema);
export default bills;