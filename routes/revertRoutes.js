
import express from 'express';
import asyncHandler from 'express-async-handler';
import revertModal from '../models/revertModel.js';
import showSeatModel from '../models/showSeatModel.js';
import orderModel from '../models/orderModel.js';
import ShowingModel from '../models/showingModel.js';
import moneyHandle from '../commonFunction/moneyHandle.js';
import UserModal from '../models/userModel.js';
import mongoose from 'mongoose';
import moment from 'moment';
const app = express.Router();
function convert(str, a) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    if (a == null)
        return [day, mnth, date.getFullYear()].join("-");
    else
        return [date.getFullYear(), mnth, day].join("-");
};
app.post(
    "/list",
    asyncHandler(async (req, res) => {
        const data = await revertModal.find({});
        console.log(data);
        if(data){
            res.json(data);
        }
        else {
            res.status(404)
            throw new Error("Revert not Found");
        }
    })
);
app.post(
    "/checkIn",
    asyncHandler(async (req, res) => {
        const a = moment(new Date(), 'YYYY-MM-DD');
        const b = moment(req.body.createdAt, 'YYYY-MM-DD');
        const day = b.diff(a, 'days') + 2;
        const order = await orderModel.findOne({idBill:req.body.idBill,idShowSeat:req.body.idShowSeat},{idShowing:1});
        if(day>=3){
            const showing = await ShowingModel.findById(order.idShowing);
            const user = await UserModal.findById(req.body.idUser,{email:1,money:1});
            let userMoney;
            if (user.money == "0")
                userMoney = parseFloat(0);
            else userMoney = parseFloat(user.money);
            userMoney = moneyHandle.addMoney(userMoney, (parseFloat(showing.price)*90)/100);
            userMoney = userMoney.toString();
            await UserModal.findOneAndUpdate({ email: user.email },  {$set:{ money: userMoney} });
            const data = await revertModal({idUser:req.body.idUser,idOldOrder: order._id.toString(),idShowSeat:req.body.idShowSeat, status:1}); //status:1 hoàn luôn 90% giá trị vé
            data.save();
            res.send({ message: "refund before 3 day" });
        }
        else if(3>day>0){        
        await showSeatModel.findByIdAndUpdate(req.body.idShowSeat,{ $set: { isReserved: false }}); //idshowSeat idUser
        // await orderModel.findOneAndUpdate({idShowSeat:req.body.idShowSeat,status:1},{ $set: { status: 3 }}); //idshowSeat idUser
            const data = await revertModal({idUser:req.body.idUser,idOldOrder: order._id.toString(),idShowSeat:req.body.idShowSeat, status:0});
            data.save();
            res.send({ message: "refund after 3 day" });

        }
        else
        {
        res.send({ message: "refund fail" });
        }
    })
);
app.get(
    "/adminCheck",
    asyncHandler(async (req, res) => {
        const listCheck = await revertModal.find({status:0});
        if (listCheck) {
            for (let a of listCheck) {
                const data = await orderModel.findOne({idShowSeat:a.idShowSeat,status:1});
                console.log(a._id.toString());
                if(data){
                    const showing = await ShowingModel.findById(data.idShowing);
            const user = await UserModal.findById(data.idCustomer,{email:1,money:1});
            let userMoney;
            if (user.money == "0")
                userMoney = parseFloat(0);
            else userMoney = parseFloat(user.money);
            userMoney = moneyHandle.addMoney(userMoney, (parseFloat(showing.price)*90)/100);
            userMoney = userMoney.toString();
            await UserModal.findOneAndUpdate({ email: user.email },  {$set:{ money: userMoney} });
                    await revertModal.findByIdAndUpdate(a._id.toString(),{$set:{status:1,idNewOrder:data._id.toString(),status:2}});
                    console.log("refund successful");

                }
                else{
                    console.log("data not Found");
                }
            }
            res.json("done");
        } else {
            res.status(404)
            throw new Error("Revert not Found");
        }
    })
);
export default app;