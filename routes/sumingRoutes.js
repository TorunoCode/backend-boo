import express from 'express';
import transactionsModel from "../models/transactionsModel.js"
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
const app = express.Router();
/*app.get("/test", function (req, res) {
    res.send("Summing Routes");
});
app.get("/movieInDay/:day/:month/:year/:page", async (req, res) => {
    let day = req.params.day;
    let month = req.params.month;
    let year = req.params.year;
    let page = req.params.page;
    let day_finding = new Date(year, month, day)
    let last_day_of_month = new Date(year, month);
    let first_day_of_next_month = new Date(last_day_of_month);
    first_day_of_next_month.setDate(last_day_of_month.getDate() + 1);
    let last_day_of_last_month = new Date(last_day_of_month);
    last_day_of_last_month.setMonth(last_day_of_month.getMonth() - 1);
    let first_day_of_month_find = new Date(last_day_of_last_month);
    first_day_of_month_find.setDate(last_day_of_last_month.getDate() + 1);
    console.log(last_day_of_month);
    console.log(last_day_of_last_month);
    console.log(first_day_of_month_find);
    console.log(first_day_of_next_month);
    let next_day_finding = new Date(day_finding);
    next_day_finding.setDate(day_finding.getDate() + 1);
    let next_day = next_day_finding.getDate();
    let next_month = next_day_finding.getMonth();
    let next_year = next_day_finding.getFullYear();
    let day_to_find = year + "-" + month + "-" + day;
    let next_day_to_find = next_year + "-" + next_month + "-" + next_day;
    let count = await billsModel.count({
        createdAt: {
            $gte: day_to_find,
            $lt: next_day_to_find
        }
    })
    let numPage = Math.ceil(count / 10);
    const allBillsOfDay = { number_of_bill_of_day: count, _number_of_page: numPage };
    let result = [];
    result.push(allBillsOfDay)
    let bill = await billsModel.find({
        createdAt: {
            $gte: day_to_find,
            $lt: next_day_to_find
        }
    }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    let one_result;
    let userName;
    let movieNames = [];
    let movieGenres = [];
    let movieName;
    let sheatNumber;
    let showing;
    let sumAllOfUser = {};
    console.log(bill)
    for (let i = 0; i < bill.length; i++) {
        let user = await userModel.findById(bill[i].idCustomer);
        userName = user.fullName;
        sheatNumber = await orderModel.count({ idCustomer: bill[i].idCustomer, idBill: bill[i].id });
        let idShowings = await orderModel.find({ idCustomer: bill[i].idCustomer, idBill: bill[i].id });
        for (let j = 0; j < idShowings.length; j++) {
            showing = await ShowingModel.findById(idShowings[j].idShowing);
            movieName = await MovieModel.findById(showing.idMovie);
            movieNames.push(movieName.name);
            movieGenres.push(movieName.genre);
            console.log("inside j: " + j + " idShowing length " + idShowings.length);
        }
        console.log("inside i: " + i + " bill length " + bill.length);
        //console.log(userName);
        //console.log(movieNames);
        //console.log(movieGenres);
        //console.log(sheatNumber);
        //console.log(bill[i].totalMoney);
        Object.assign(sumAllOfUser, { "User Name": userName, "Movies name": movieNames, "MovieGenres": movieGenres, "Sum seats": sheatNumber, "Sum money": bill[i].totalMoney });
        result.push(sumAllOfUser);
    }
    res.status(200).send(result);
})
app.get("/movieInMonth/:month/:year/:page", async (req, res) => {
    let month = req.params.month;
    let year = req.params.year;
    let page = req.params.page;
    let last_day_of_month = new Date(year, month);
    let first_day_of_next_month = new Date(last_day_of_month);
    first_day_of_next_month.setDate(last_day_of_month.getDate());
    let last_day_of_last_month = new Date(last_day_of_month);
    last_day_of_last_month.setMonth(last_day_of_month.getMonth() - 1);
    let first_day_of_month_find = new Date(last_day_of_last_month);
    first_day_of_month_find.setDate(last_day_of_last_month.getDate());
    console.log(first_day_of_month_find);
    console.log(first_day_of_next_month);
    let day_to_find = first_day_of_month_find.getFullYear() + "-" + (first_day_of_month_find.getMonth() + 1) + "-" + first_day_of_month_find.getDate();
    let next_day_to_find = first_day_of_next_month.getFullYear() + "-" + (first_day_of_next_month.getMonth() + 1) + "-" + first_day_of_next_month.getDate();
    console.log(day_to_find);
    console.log(next_day_to_find)
    let count = await billsModel.count({
        createdAt: {
            $gte: day_to_find,
            $lt: next_day_to_find
        }
    })
    let numPage = Math.ceil(count / 10);
    const allBillsOfDay = { number_of_bill_of_day: count, _number_of_page: numPage };
    let result = [];
    result.push(allBillsOfDay)
    let bill = await billsModel.find({
        createdAt: {
            $gte: day_to_find,
            $lt: next_day_to_find
        }
    }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    let one_result;
    let userName;
    let movieNames = [];
    let movieGenres = [];
    let movieName;
    let sheatNumber;
    let showing;
    let sumAllOfUser = {};
    console.log(bill)
    for (let i = 0; i < bill.length; i++) {
        let user = await userModel.findById(bill[i].idCustomer);
        userName = user.fullName;
        console.log(userName)
        sheatNumber = await orderModel.count({ idCustomer: bill[i].idCustomer, idBill: bill[i].id });
        //let idShowings = await orderModel.find({ idCustomer: bill[i].idCustomer, idBill: bill[i].id });
        let idShowings = await orderModel.aggregate([{ $match: { idCustomer: bill[i].idCustomer, idBill: bill[i].id } }
            , { $group: { _id: "$idShowing" } }])
        let testthings = idShowings.map(a => a._id)
        showing = await ShowingModel.find({ _id: { $in: testthings } });
        let testthings2 = showing.map(a => a.idMovie)
        movieName = await MovieModel.find({ _id: { $in: testthings2 } });
        movieNames = movieName.map(a => a.name);
        movieGenres = movieName.map(a => a.genre);
        for (let j = 0; j < idShowings.length; j++) {
            showing = await ShowingModel.findById(idShowings[j]._id);
            movieName = await MovieModel.findById(showing.idMovie);
            movieNames.push(movieName.name);
            movieGenres.push(movieName.genre);
            console.log("inside j: " + j + " idShowing length " + idShowings.length);
        }
        console.log("inside i: " + i + " bill length " + bill.length);
        //console.log(userName);
        //console.log(movieNames);
        //console.log(movieGenres);
        //console.log(sheatNumber);
        //console.log(bill[i].totalMoney);
        sumAllOfUser["User Name"] = userName;
        sumAllOfUser["Movies name"] = movieNames;
        sumAllOfUser["MovieGenres"] = movieGenres;
        sumAllOfUser["Sum seats"] = sheatNumber;
        sumAllOfUser["Sum money"] = bill[i].totalMoney;
        sumAllOfUser["Date bill"] = bill[i].createdAt;

        result.push(sumAllOfUser);
        sumAllOfUser = {};
        movieNames = [];
        movieGenres = [];
    }
    res.status(200).send(result);
})
app.get("/moneyInMonth/:month/:year", async (req, res) => {
    let month = req.params.month;
    let year = req.params.year;
    let last_day_of_month = new Date(year, month);
    let first_day_of_next_month = new Date(last_day_of_month);
    first_day_of_next_month.setDate(last_day_of_month.getDate());
    let last_day_of_last_month = new Date(last_day_of_month);
    last_day_of_last_month.setMonth(last_day_of_month.getMonth() - 1);
    let first_day_of_month_find = new Date(last_day_of_last_month);
    first_day_of_month_find.setDate(last_day_of_last_month.getDate());
    let day_to_find = first_day_of_month_find.getFullYear() + "-" + (first_day_of_month_find.getMonth() + 1) + "-" + first_day_of_month_find.getDate();
    let next_day_to_find = first_day_of_next_month.getFullYear() + "-" + (first_day_of_next_month.getMonth() + 1) + "-" + first_day_of_next_month.getDate();
    console.log(day_to_find);
    console.log(next_day_to_find)
    const sum_money = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_to_find),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: null, sum_money: { $sum: "$totalMoney" } } }])
    console.log(sum_money)
    let sum_result = sum_money[0]['sum_money'];
    let result = [];
    result.push({ "Sum money of month": sum_result });
    res.status(200).send(result);
})
app.get("/moneyInYear/:year", async (req, res) => {
    let year = req.params.year;
    let result = [];
    for (let month = 1; month <= 12; month++) {
        let last_day_of_month = new Date(year, month);
        let first_day_of_next_month = new Date(last_day_of_month);
        first_day_of_next_month.setDate(last_day_of_month.getDate());
        let last_day_of_last_month = new Date(last_day_of_month);
        last_day_of_last_month.setMonth(last_day_of_month.getMonth() - 1);
        let first_day_of_month_find = new Date(last_day_of_last_month);
        first_day_of_month_find.setDate(last_day_of_last_month.getDate());
        let day_to_find = first_day_of_month_find.getFullYear() + "-" + (first_day_of_month_find.getMonth() + 1) + "-" + first_day_of_month_find.getDate();
        let next_day_to_find = first_day_of_next_month.getFullYear() + "-" + (first_day_of_next_month.getMonth() + 1) + "-" + first_day_of_next_month.getDate();
        console.log(first_day_of_month_find);
        console.log(first_day_of_next_month);
        console.log(day_to_find);
        console.log(next_day_to_find)
        const sum_money = await billsModel.aggregate([{
            $match: {
                createdAt: {
                    $gte: new Date(day_to_find),
                    $lt: new Date(next_day_to_find)
                }
            }
        }, { $group: { _id: null, sum_money: { $sum: "$totalMoney" } } }])
        console.log(sum_money)
        try {
            let sum_result = sum_money[0]['sum_money'];
            let resultName = 'Sum money of month ' + month;
            var key = [resultName];
            var obj = {};
            obj[key[0]] = sum_result;
            result.push(obj);
        }
        catch (error) {
            let sum_result = 0;
            let resultName = 'Sum money of month ' + month;
            var key = [resultName];
            var obj = {};
            obj[key[0]] = sum_result;
            result.push(obj);
        }
    }
    res.status(200).send(result);
})*/
app.get("/top10user", async (req, res) => {
    let result = []
    const sum_money = await billsModel.aggregate([{
        $group: {
            _id: "$idCustomer", totalSpending: { $sum: "$totalMoney" },
            totalOrders: { $sum: 1 }
        }
    }
        , { $sort: { totalSpending: -1 } }, { $limit: 10 }])
    let userName;
    for (let i = 0; i < sum_money.length; i++) {
        userName = await userModel.findById(sum_money[i]._id)
        if (userName == null) {
            result.push({ "idorder": sum_money[i]._id, "username": "Deleted user", "totalSPrice": sum_money[i].totalMoney, "date": sum_money[i].createdAt, "status": "paid" })
            continue;
        }
        if (typeof userName.fullName == 'undefined') userName.fullName = userName.name
        result.push({
            "username": userName.fullName, "totalOrders": sum_money[i].totalOrders,
            "totalSpending": sum_money[i].totalSpending,
            "stt": i + 1
        })
        console.log(userName.fullName + "/" + userName.name);
    }
    res.status(200).send(result);
})
app.get("/top10recent", async (req, res) => {
    let result = []
    const sum_money = await billsModel.find({}).sort({ "createdAt": -1 }).limit(10)
    let userName;
    for (let i = 0; i < sum_money.length; i++) {
        userName = await userModel.findById(sum_money[i].idCustomer)
        if (userName == null) {
            result.push({ "idorder": sum_money[i]._id, "username": "Deleted user", "totalSPrice": sum_money[i].totalMoney, "date": sum_money[i].createdAt, "status": "paid" })
            continue;
        }
        if (typeof userName.fullName == 'undefined') userName.fullName = userName.name

        result.push({
            "idorder": sum_money[i]._id, "username": userName.fullName,
            "totalSPrice": sum_money[i].totalMoney, "date": sum_money[i].createdAt, "status": "paid",
            "date": timeHandle.formatDate_YearMonthDay(sum_money[i].createdAt),
            "stt": i + 1
        })
    }
    res.status(200).send(result);
})
app.get("/summary/:date", async (req, res) => {
    let date = req.params.date;
    let day_finding = new Date(date);
    let result = {};
    let Revenue = await summing.countRevenue(timeHandle.getTodayAt0(day_finding), timeHandle.getTomorrorAt0(day_finding))
    console.log(Revenue)
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
app.get("/summaryMoneyInThisYearAndLastYear", async (req, res) => {
    //let year = req.params.year;
    let year = (new Date()).getFullYear();
    let result = {};
    let currentYear = [];
    let lastYear = [];
    let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    for (let month of months) {
        console.log(month)
        let firstDayOfMonth = new Date(year, month, 1)
        let firstDayOfNextMonth = timeHandle.getFirstDayOfNextMonth(firstDayOfMonth)
        let sum_money = await billsModel.aggregate([{
            $match: {
                createdAt: {
                    $gte: firstDayOfMonth,
                    $lt: firstDayOfNextMonth
                }
            }
        }, { $group: { _id: null, sum_money: { $sum: "$totalMoney" } } }])
        console.log(sum_money)
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
