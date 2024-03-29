import express from 'express';
import UserModal from '../models/userModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
import fileHandle from '../commonFunction/fileHandle.js';
import paypal from 'paypal-rest-sdk';
import billsModel from "../models/billsModel.js"
import orderModel from "../models/orderModel.js";
import showSeatModel from '../models/showSeatModel.js';
import paypalHandle from '../commonFunction/paypalHandle.js';
import timeHandle from '../commonFunction/timeHandle.js';
import showingModel from '../models/showingModel.js';
import movieModel from '../models/movieModel.js';
import cinemaHallModel from '../models/cinemaHallModel.js';
import cinemaModel from '../models/cinemaModel.js';
import revertModel from '../models/revertModel.js';
const app = express.Router();
app.get('/billToday/:id', async function (req, res) {
    let billId = req.params.id;
    let billsOfUser = await orderModel.find({ idBill: billId, status: "1" });
    if (billsOfUser[0] == null) {
        return res.status(400).send([])
    }
    let bill = await billsModel.findById(req.params.id)
    let day_finding = new Date()
    let result = []
    for (let i = 0; i < billsOfUser.length; i++) {
        let checkRevert = await revertModel.find({ idOldOrder: billsOfUser[i]._id, status: 1 })
        if (checkRevert[0]) {
            continue
        }
        let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
        let showing = await showingModel.findById(showSeat.idShowing);
        let movie = await movieModel.findById(showing.idMovie);
        let cinemaHall = await cinemaHallModel.findById(showing.idHall);
        let cinema = await cinemaModel.findById(cinemaHall.idCinema);
        let compareDate = timeHandle.checkDateIsTodayOrNotYetOrPassedTime
            (day_finding, timeHandle.getTodayAt0(showing.startTime), timeHandle.getTomorrorAt0(showing.startTime));
        result.push({
            "paymentMethod": bill.paymentMethod,
            "check": compareDate,
            "movie": movie.name,
            "seat": showSeat.number,
            "at": timeHandle.formatDate_YearMonthDay(showing.startTime) + " " + showing.time,
            // "cinemaHall": cinemaHall.name,
            "cinema": cinemaHall.name + ", " + cinema.name
        });
    }
    return res.status(200).send(result)
});
export default app;