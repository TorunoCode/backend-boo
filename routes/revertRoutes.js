
import express from 'express';
import asyncHandler from 'express-async-handler';
import revertModal from '../models/revertModel.js';
import showSeatModel from '../models/showSeatModel.js';
import orderModel from '../models/orderModel.js';
import mongoose from 'mongoose';
const app = express.Router();

app.post(
    "/checkIn",
    asyncHandler(async (req, res) => {
        await showSeatModel.findByIdAndUpdate(req.body.idShowSeat,{ $set: { isReserved: false }}); //idshowSeat idUser
        // await orderModel.findOneAndUpdate({idShowSeat:req.body.idShowSeat,status:1},{ $set: { status: 3 }}); //idshowSeat idUser
        const oldBill = await orderModel.findOne({idBill:req.body.idBill, idShowSeat: req.body.idShowSeat});
        const data = await revertModal({idUser:req.body.idUser,idOldOrder: oldBill._id.toString(),idShowSeat:req.body.idShowSeat, status:0});
        data.save();
        if (data) {
            res.json(data);
        } else {
            res.status(404)
            throw new Error("Order not Found");
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
                    await revertModal.findByIdAndUpdate(a._id.toString(),{$set:{status:1,idNewOrder:data._id.toString()}});
                }
                else{
                    console.log("data not Found");
                }
            }
            res.json("successful");
        } else {
            res.status(404)
            throw new Error("Revert not Found");
        }
    })
);
export default app;