import mongoose from 'mongoose';

const billsSchema =  new mongoose.Schema({
    totalMoney:{
        type:String,
        require:true
    },
    fullName:{
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
    },
    idCustomer:{
        type:String,
        require:false
    }
},{
    timestamps:true
});
const bills =  mongoose.model('bills',billsSchema);
export default bills;