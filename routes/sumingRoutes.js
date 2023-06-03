import express from 'express';
import billsModel from "../models/billsModel.js"
import emailProvider from '../config/nodeMailer.js';
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js";
import showSeatModel from '../models/showSeatModel.js';
import CinemaHallSeatModel from '../models/cinemaHallSeatModel.js';
import ShowingModel from '../models/showingModel.js';
import MovieModel from '../models/movieModel.js';
import CinemaHallModel from '../models/cinemaHallModel.js';
import cinemaModel from '../models/cinemaModel.js';
import timeHandle from '../commonFunction/timeHandle.js';
import summing from '../routeFunction/summing.js';
import moneyHandle from '../commonFunction/moneyHandle.js';
import revertModel from '../models/revertModel.js';
const app = express.Router();
app.get("/top10user", async function (req, res) {
    let result = []
    const sum_money = await billsModel.aggregate([{
        $group: {
            _id: "$idCustomer", totalSpending: { $sum: "$totalMoney" },
            totalOrders: { $sum: 1 }
        }
    }
        , { $sort: { totalSpending: -1 } }, { $limit: 10 }])
    let user, nameUser, revertMoneyTotal, totalSpending;
    for (let i = 0; i < sum_money.length; i++) {
        user = await userModel.findById(sum_money[i]._id)
        console.log(user)
        totalSpending = sum_money[i].totalSpending
        if (user == null) {
            nameUser = "Deleted user"
            revertMoneyTotal = 0
        }
        else {
            console.log(await revertModel.find({ idUser: user._id }))
            revertMoneyTotal = await revertModel.aggregate([{
                $match: {
                    idUser: user._id.toString(),
                    status: 1
                }
            }, {
                $group: {
                    _id: null, totalRevert: { $sum: "$totalMoney" }
                }
            }])
            console.log(revertMoneyTotal[0])
            if (revertMoneyTotal[0] == typeof (undefined))
                totalSpending = moneyHandle.subtractionMoney(sum_money[i].totalSpending, revertMoneyTotal[0].totalRevert)
            if (typeof user.fullName == 'undefined') { nameUser = user.name }
            else {
                nameUser = user.fullName
            }
        }
        result.push({
            "stt": i + 1,
            "username": nameUser, "totalOrders": sum_money[i].totalOrders,
            "totalSpending": totalSpending
        })
    }
    res.status(200).send(result);
})
app.get("/top10recent", async function (req, res) {
    let result = []
    const sum_money = await billsModel.find({}).sort({ "createdAt": -1 }).limit(10)
    let user, nameUser;
    for (let i = 0; i < sum_money.length; i++) {
        user = await userModel.findById(sum_money[i].idCustomer)
        if (user == null) {
            nameUser = "Deleted user"
        }
        else if (typeof user.fullName == 'undefined') nameUser = user.name
        else nameUser = user.fullName
        result.push({
            "stt": i + 1,
            "idorder": sum_money[i]._id, "username": nameUser,
            "totalSPrice": sum_money[i].totalMoney, "date": timeHandle.formatDate_YearMonthDay(sum_money[i].createdAt),
            "status": "paid"
        })
    }
    res.status(200).send(result);
})
app.get("/summary/:date", async function (req, res) {
    let day_finding = new Date(req.params.date);
    let result = {};
    let Revenue = await summing.countRevenue(timeHandle.getTodayAt0(day_finding), timeHandle.getTomorrorAt0(day_finding))
    let sumUser = await userModel.aggregate([{ $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    let sumOrders = await summing.sumOrders(timeHandle.getTodayAt0(day_finding), timeHandle.getTomorrorAt0(day_finding))
    let sumMovie = await MovieModel.aggregate([{ $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])

    result["day"] = summing.convertValue(Revenue, sumMovie, sumOrders, sumUser);

    Revenue = await summing.countRevenue(timeHandle.getFirstDayOfMonth(day_finding), timeHandle.getFirstDayOfNextMonth(day_finding))

    sumOrders = await summing.sumOrders(timeHandle.getFirstDayOfMonth(day_finding), timeHandle.getFirstDayOfNextMonth(day_finding))

    result["mounth"] = summing.convertValue(Revenue, sumMovie, sumOrders, sumUser);;

    Revenue = await billsModel.aggregate([{ $group: { _id: null, Revenue: { $sum: "$totalMoney" } } }])
    sumOrders = await billsModel.aggregate([{ $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])

    result["total"] = summing.convertValue(Revenue, sumMovie, sumOrders, sumUser);;

    Revenue = await summing.countRevenue(timeHandle.getFirstDayOfLastMonth(day_finding), timeHandle.getFirstDayOfMonth(day_finding))
    sumOrders = await summing.sumOrders(timeHandle.getFirstDayOfLastMonth(day_finding), timeHandle.getFirstDayOfMonth(day_finding))

    result["onemounthago"] = summing.convertValue(Revenue, sumMovie, sumOrders, sumUser);;

    Revenue = await summing.countRevenue(timeHandle.getFirstDayOfWeek(day_finding), timeHandle.getFirstDayOfNextWeek(day_finding))
    sumOrders = await summing.sumOrders(timeHandle.getFirstDayOfWeek(day_finding), timeHandle.getFirstDayOfNextWeek(day_finding))

    result["currentweek"] = summing.convertValue(Revenue, sumMovie, sumOrders, sumUser);;

    res.status(200).send(result);
})
app.get("/summaryMoneyInThisYearAndLastYear", async function (req, res) {
    let year = (new Date()).getFullYear();
    let result = {};
    let currentYear = [];
    let lastYear = [];
    let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    for (let month of months) {
        let firstDayOfMonth = new Date(year, month - 1, 1)
        let firstDayOfNextMonth = timeHandle.getFirstDayOfNextMonth(firstDayOfMonth)
        let sum_money = await billsModel.aggregate([{
            $match: {
                createdAt: {
                    $gte: firstDayOfMonth,
                    $lt: firstDayOfNextMonth
                }
            }
        }, { $group: { _id: null, sum_money: { $sum: "$totalMoney" } } }])
        try {
            currentYear.push(sum_money[0]['sum_money']);
        }
        catch (error) {
            currentYear.push(0);
        }
        // xét trong tháng này năm trước
        firstDayOfMonth.setFullYear(firstDayOfMonth.getFullYear() - 1);
        firstDayOfNextMonth.setFullYear(firstDayOfNextMonth.getFullYear() - 1);
        sum_money = await billsModel.aggregate([{
            $match: {
                createdAt: {
                    $gte: firstDayOfMonth,
                    $lt: firstDayOfNextMonth
                }
            }
        }, { $group: { _id: null, sum_money: { $sum: "$totalMoney" } } }])
        try {
            lastYear.push(sum_money[0]['sum_money']);
        }
        catch (error) {
            lastYear.push(0);
        }
    };
    result["series"] = [{ "name": "Current Year", "data": currentYear },
    {
        "name": "Last Year",
        "data": lastYear,
    }]
    result["options"] = {
        "color": ["#6ab04c", "#2980b9"],
        "chart": {
            "background": "transparent",
        }, "dataLabels": {
            "enabled": false,
        },
        "stroke": {
            "curve": "smooth",
        },
        "xaxis": {
            "categories": [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
        "legend": {
            "position": "top",
        },
        "grid": {
            "show": false,
        }
    };
    res.status(200).send(result);
})
export default app;
