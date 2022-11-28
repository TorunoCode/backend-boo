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
const app = express.Router();
app.get("/test", function (req, res) {
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
        Object.assign(sumAllOfUser, { "User Name": userName, "Movies name": movieNames, "MovieGenres": movieGenres, "Sum seats": sheatNumber, "Sum money": bill[i].totalMoney, "Date bill": bill[i].createdAt });
        result.push(sumAllOfUser);
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
})
app.get("/top10user", async (req, res) => {
    let result = []
    const sum_money = await billsModel.aggregate([{
        $group: {
            _id: "$idCustomer", totalSpending: { $sum: "$totalMoney" },
            totalOrders: { $sum: "$_id" }
        }
    }
        , { $sort: { totalSpending: -1 } }, { $limit: 10 }])
    let userName;
    for (let i = 0; i < sum_money.length; i++) {
        userName = await userModel.findById(sum_money[i]._id)
        try {
            result.push({ "username": userName.fullName, "totalOrders": sum_money[i].totalOrders, "totalSpending": sum_money[i].totalSpending })
        }
        catch (error) {
            result.push({ "username": userName.name, "totalOrders": sum_money[i].totalOrders, "totalSpending": sum_money[i].totalSpending })
        }
        console.log(userName.fullName);
    }

    res.status(200).send(result);
})
app.get("/top10recent", async (req, res) => {
    let result = []
    const sum_money = await billsModel.find({}).sort({ "createdAt": -1 }).limit(10)
    let userName;
    for (let i = 0; i < sum_money.length; i++) {
        userName = await userModel.findById(sum_money[i].idCustomer)
        try {
            result.push({ "idorder": sum_money[i]._id, "username": userName.fullName, "totalSPrice": sum_money[i].totalMoney, "date": sum_money[i].createdAt, "status": "paid" })
        }
        catch (error) {
            result.push({ "idorder": sum_money[i]._id, "username": userName.name, "totalSPrice": sum_money[i].totalMoney, "date": sum_money[i].createdAt, "status": "paid" })
        }
    }

    res.status(200).send(result);
})
app.get("/summary/:date", async (req, res) => {
    let date = req.params.date;
    let day_finding = new Date(date);
    let day_finding1 = new Date(day_finding.getFullYear(), (day_finding.getMonth() + 1))
    let first_day_of_next_month = new Date(day_finding1);
    first_day_of_next_month.setDate(day_finding1.getDate());
    let last_day_of_last_month = new Date(day_finding1);
    last_day_of_last_month.setMonth(day_finding1.getMonth() - 1);
    let first_day_of_month_find = new Date(last_day_of_last_month);
    first_day_of_month_find.setDate(last_day_of_last_month.getDate());
    let day_to_find = first_day_of_month_find.getFullYear() + "-" + (first_day_of_month_find.getMonth() + 1) + "-" + first_day_of_month_find.getDate();

    let next_day_finding = new Date(day_finding);
    next_day_finding.setDate(day_finding.getDate() + 1);
    console.log(next_day_finding)

    let result = {};
    let smallResult = [];

    let next_day = next_day_finding.getDate();
    let next_month = next_day_finding.getMonth() + 1;
    let next_year = next_day_finding.getFullYear();
    let next_day_to_find = next_year + "-" + next_month + "-" + next_day;
    let sum_money = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_finding),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: null, Revenue: { $sum: "$totalMoney" } } }]);
    let sum_money2 = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_finding),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: "$idCustomer" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    let sum_money3 = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_finding),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    try {
        sum_money[0]["Movies"] = 8
        sum_money[0]["sumOrders"] = sum_money3[0].count
        sum_money[0]["sumUser"] = sum_money2[0].count
        console.log(sum_money)
        smallResult.push({ "icon": "bx bx-dollar-circle", "count": sum_money[0].Revenue + "$", "title": "Revenue" });
        smallResult.push({ "icon": "bx bx-receipt", "count": sum_money[0].sumOrders+"", "title": "orders" });
        smallResult.push({ "icon": "bx bx-user", "count": sum_money[0].sumUser+"", "title": "users" });
        smallResult.push({ "icon": "bx bx-film", "count": "8", "title": "Movies" });
        result["day"] = smallResult;
    } catch (error) {
        result["day"] = [];
    }

    next_day_to_find = first_day_of_next_month.getFullYear() + "-" + (first_day_of_next_month.getMonth() + 1) + "-" + first_day_of_next_month.getDate();

    console.log(day_to_find);
    console.log(next_day_to_find)
    sum_money = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_to_find),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: null, Revenue: { $sum: "$totalMoney" } } }])
    console.log("here");
    sum_money2 = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_to_find),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: "$idCustomer" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    sum_money3 = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: new Date(day_to_find),
                $lt: new Date(next_day_to_find)
            }
        }
    }, { $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    console.log("now")
    console.log(sum_money2)
    console.log(sum_money3)
    try {
        sum_money[0]["Movies"] = 8
        sum_money[0]["sumOrders"] = sum_money3[0].count
        sum_money[0]["sumUser"] = sum_money2[0].count

        console.log(sum_money)
        smallResult.push({ "icon": "bx bx-dollar-circle", "count": sum_money[0].Revenue + "$", "title": "Revenue" });
        smallResult.push({ "icon": "bx bx-receipt", "count": sum_money[0].sumOrders+"", "title": "orders" });
        smallResult.push({ "icon": "bx bx-user", "count": sum_money[0].sumUser+"", "title": "users" });
        smallResult.push({ "icon": "bx bx-film", "count": "8", "title": "Movies" });

        result["mounth"] = smallResult;
    } catch (error) {
        result["mounth"] = [];
    }


    sum_money = await billsModel.aggregate([{ $group: { _id: null, Revenue: { $sum: "$totalMoney" } } }])
    sum_money2 = await billsModel.aggregate([{ $group: { _id: "$idCustomer" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    sum_money3 = await billsModel.aggregate([{ $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    try {
        sum_money[0]["Movies"] = 8
        sum_money[0]["sumOrders"] = sum_money3[0].count
        sum_money[0]["sumUser"] = sum_money2[0].count
        console.log(sum_money)
        smallResult.push({ "icon": "bx bx-dollar-circle", "count": sum_money[0].Revenue + "$", "title": "Revenue" });
        smallResult.push({ "icon": "bx bx-receipt", "count": sum_money[0].sumOrders+"", "title": "orders" });
        smallResult.push({ "icon": "bx bx-user", "count": sum_money[0].sumUser+"", "title": "users" });
        smallResult.push({ "icon": "bx bx-film", "count": "8", "title": "Movies" });
        result["total"] = smallResult
    } catch (error) {
        result["total"] = []
    }

    res.status(200).send(result);
})

export default app;