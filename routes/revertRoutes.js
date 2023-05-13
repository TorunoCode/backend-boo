import express from 'express';
import asyncHandler from 'express-async-handler';
import showSeatModel from '../models/showSeatModel.js';
import billModel from '../models/billsModel.js';
import orderModel from '../models/orderModel.js';
import UserModal from '../models/userModel.js';
import revertModal from '../models/revertModel.js';
import mongoose from 'mongoose';
import pkg from 'paypal-rest-sdk';
const { order } = pkg;
const revertRoute = express.Router();

revertRoute.post(
    "/checkIn",
    asyncHandler(async (req, res) => {
        await showSeatModel.findByIdAndUpdate(req.body.idShowSeat,{ $set: { isReserved: false }}); //idshowSeat idUser
        await orderModel.findOneAndUpdate({idShowSeat:req.body.idShowSeat,status:1},{ $set: { status: 3 }}); //idshowSeat idUser
        const oldBill = await orderModel.findOne({idBill:req.body.idBill, idShowSeat: req.body.idShowSeat});
        const data = await revertModal({idUser:req.body.idUser,idOldBill: oldBill._id.toString(),startTime: new Date(), status:0});
        if (data) {
            res.json(data);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);
revertRoute.post(
    "/adminCheck",
    asyncHandler(async (req, res) => {
        const listCheck = await revertModal.distinct('idShowSeat',{status:0}).sort({ number: 1 });
        if (listCheck) {
            for (let a of listCheck) {
                console.log(a);
                const data = await orderModel.findOne({idShowSeat:a,status:1});
                if(data){
                    await revertModal.findOneAndUpdate({idShowSeat:a},{$set:{status:1}})
                }
            }
            res.json(data);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);