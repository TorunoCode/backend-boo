import express from 'express';
import asyncHandler from 'express-async-handler';
import MovieModel from '../models/movieModel.js';
import GenreModel from '../models/genreModel.js';
import CinemaModel from '../models/cinemaModel.js';
import ShowingModel from '../models/showingModel.js';
import RatingModel from '../models/feedbacksModel.js';
import cinemaHallModel from '../models/cinemaHallModel.js';
import cinemaSeatModel from '../models/cinemaHallSeatModel.js';
import showSeatModel from '../models/showSeatModel.js';
import billModel from '../models/billsModel.js';
import orderModel from '../models/orderModel.js';
import revertModal from '../models/revertModel.js';
import listModel from '../models/listModel.js';
import UserModal from '../models/userModel.js';
import feedbackModel from '../models/feedbacksModel.js';
import recommend from '../routeFunction/recommend.js';
import mongoose from 'mongoose';
import moment from 'moment';
import pkg from 'paypal-rest-sdk';
import Revert from '../models/revertModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
const { order } = pkg;

const isAuth = (req, res, next) => {
    console.log(req.session.isAuth);
    if (req.session.isAuth) {
        next();
    } else {
        return res.status(404).json({ data: null, message: "Action doesn't exist" });
    }
}
const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        return res.status(404).json({ data: null, message: "Action doesn't exist" });
    }
}
const movieRoute = express.Router();
movieRoute.get(
    "/",
    asyncHandler(async (req, res) => {
        console.log(req.session.isAuth);
        const movies = await MovieModel.find({});
        var listItem = [];
        for (let a of movies) {
            const showing = await ShowingModel.findOne({ idMovie: a._id.toString() });
            if (showing == null) {
                listItem.push({
                    _id: a._id.toString(),
                    name: a.name,
                    describe: a.describe,
                    genre: a.genre,
                    language: a.language,
                    image: a.image,
                    linkReview: a.linkReview,
                    cast: a.cast,
                    director: a.director,
                    rate: a.rate,
                    price: a.price,
                    totalOrder: 0,
                    revenue: 0,
                    createdAt: a.createdAt
                })
            }
            else {
                const totalOrder = await orderModel.distinct('idBill', { idShowing: showing._id.toString() }).count();
                const list = await orderModel.distinct('idBill', { idShowing: showing._id.toString() });
                var totalSpending = 0;
                for (let b of list) {
                    const data = await billModel.findById(b);
                    totalSpending += data.totalMoney;
                }
                listItem.push({
                    _id: a._id.toString(),
                    name: a.name,
                    describe: a.describe,
                    genre: a.genre,
                    language: a.language,
                    image: a.image,
                    linkReview: a.linkReview,
                    cast: a.cast,
                    director: a.director,
                    rate: a.rate,
                    price: a.price,
                    totalOrder: totalOrder,
                    revenue: totalSpending
                });
            }
        }
        res.json(listItem);
    })

);

movieRoute.get(
    "/detailGenre",
    asyncHandler(async (req, res) => {
        console.log(req.session.isAuth);
        const genres = await GenreModel.find({});
        var listItem = [];
        for (let x of genres) {
            console.log(x.name);
            const movies = await MovieModel.find({ genre: x.name });
            var totalSpending = 0;
            for (let a of movies) {
                const showing = await ShowingModel.findOne({ idMovie: a._id.toString() });
                if (showing !== null) {
                    const list = await orderModel.distinct('idBill', { idShowing: showing._id.toString() });
                    for (let b of list) {
                        const data = await billModel.findById(b);
                        totalSpending += data.totalMoney;
                    }
                }
            }
            listItem.push({
                name: x.name,
                revenue: totalSpending
            });
        }
        res.json(listItem);
    })

);
movieRoute.get(
    "/genres",
    asyncHandler(async (req, res) => {
        const data = await GenreModel.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemas",
    asyncHandler(async (req, res) => {
        const data = await CinemaModel.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemaHalls",
    asyncHandler(async (req, res) => {
        const data = await cinemaHallModel.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemaHalls/:id",
    asyncHandler(async (req, res) => {
        const data = await cinemaHallModel.find({ idCinema: req.params.id });
        res.json(data);
    })

);
movieRoute.post(
    "/add",
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const movie = new MovieModel(req.body);
        if (movie.name != null) {
            if (movie.describe != null) {
                if (movie.language != null) {
                    if (movie.price != null) {
                        if (movie.isActive != null) {
                            movie.save();
                            res.json(movie);
                        }
                    }
                }
            }
        }
        else {
            res.status(404)
            throw new Error("Add movie not successfull");
        }
    })

);
movieRoute.post(
    "/update", async (req, res) => {
        try {
            const data = await MovieModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
            console.log(data);
            if (data)
                res.status(201).json({ data });
            else
                return res.status(404).json({ data: null, message: "Movie doesn't exist" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
        }
    }
);
movieRoute.post(
    "/showing/add",
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const check = await ShowingModel.find({ startTime: req.body.startTime, idCinema: req.body.idCinema, idHall: req.body.idHall });
        let listTest = check.map(a => a.time = parseInt(a.time.slice(0, 2)));
        var testValue = parseInt(req.body.time.slice(0, 2));
        const comfirm = listTest.includes(testValue);
        if (!comfirm) {
            const showing = new ShowingModel(req.body);
            const cinemaSeat = await cinemaSeatModel.find({ name: req.body.idHall });
            await showing.save();
            cinemaSeat.map(async (a) => {
                const showSeat = await showSeatModel({ price: req.body.price, idCinemaHallSeat: a._id, number: a.seatRow + a.seatColumn, idShowing: showing._id });
                showSeat.save();
            })
            if (showing) {
                res.json(showing);
            } else {
                res.status(404)
                throw new Error("Add showing not successfull");
            }
        }
        else {
            console.log("Not add Showing")
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.post(
    "/booking/add/:id",
    asyncHandler(async (req, res) => {
        req.session.idCustomer = req.params.id; //"636b67fa4f1670cf789a8a80";
        const body = req.body.data;
        console.log(req.body);
        const check = await billModel.findOne({ idCustomer: req.params.id, status: -1 });   //kiem tra da co bill chua   
        const checkShowing = await ShowingModel.findById(req.body.idShowing);
        if (checkShowing == null) res.status(500).json({ message: "Something went wrong" });
        console.log("check" + check)
        if (check) {
            const listCheck = await orderModel.distinct('idShowSeat', { idBill: check._id.toString() });
            for (let a of listCheck) {
                await showSeatModel.findByIdAndUpdate(a, { $set: { isReserved: false } });
            }
            await orderModel.deleteMany({ idBill: check._id.toString() });
            await billModel.findByIdAndRemove(check._id.toString());
        }
        const bill = await billModel({ totalMoney: 0, idCustomer: req.params.id, status: -1 }); //tao ma bill moi
        await bill.save();
        for (let a of body) {
            console.log("bill: " + bill._id);
            console.log(a)
            const bookingTicket = await orderModel({ idBill: bill._id.toString(), idShowSeat: a, idCustomer: req.session.idCustomer, idShowing: req.body.idShowing, status: -1 })
            await bookingTicket.save();  //gan nhan ticket voi ma bill ma kh mua
            const data = await showSeatModel.findById(a); // lay price moi ve
            const total = await billModel.findById(bill._id.toString()); //lay total bill de cap nhat
            console.log("total: " + total.totalMoney)
            console.log(data);
            console.log("price: " + data.price)
            await showSeatModel.findById(a).updateOne({}, { $set: { isReserved: true } }); //cap nhat trang thai ve da co nguoi chon mua
            await billModel.findByIdAndUpdate(bill._id.toString(), { $set: { totalMoney: total.totalMoney + data.price } });    //cap nhat totalbill       
            console.log("sum: " + (total.totalMoney + data.price))
        }
        return res.status(400).json({ message: "add successfully" });

        // else {
        //     console.log("here")
        //     for (let a of body) {
        //         console.log("now")
        //         console.log(a)
        //         const bookingTicket = await orderModel({ idBill: check._id.toString(), idShowSeat: a, idCustomer: req.params.id, idShowing: req.body.idShowing, status: -1 })
        //         await bookingTicket.save();
        //         console.log("wher")
        //         //const data = await showSeatModel.findById(mongoose.Types.ObjectId(a.idShowSeat));
        //         const data = await showSeatModel.findById(a);
        //         console.log(data)
        //         const total = await billModel.findById(check._id.toString());
        //         console.log("total: " + total.totalMoney)
        //         console.log("price: " + data.price)
        //         await billModel.findByIdAndUpdate(check._id.toString(), { $set: { totalMoney: total.totalMoney + data.price } });
        //         await showSeatModel.findById(a).updateOne({}, { $set: { isReserved: true } });
        //         console.log("sum: " + (total.totalMoney + data.price))
        //     }
        //     return res.status(400).json({ message: "add successfully" });
        // }
    })

);
movieRoute.get(
    "/showing/:id",
    asyncHandler(async (req, res) => {
        const showing = await ShowingModel.find({ startTime: "2022-11-19T00:00:00.000Z", idCinema: "6358b045169e41aaeeb68d6b" });
        console.log(showing);
        var list = showing.map(a => a.time = parseInt(a.time.slice(0, 2)));
        var test = 18;
        list.flatMap(a => a == test ? console.log("yes") : console.log("no"))
        if (showing) {
            res.json(list);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })
);
movieRoute.get('/showing/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const showing = await ShowingModel.findByIdAndDelete(req.params.id);
        const data = await showSeatModel.deleteMany({ idShowing: req.params.id });
        console.log(data);
        if (!data || !showing) return res.status(400).json({ data: null, message: "No item found" });
        else
            return res.status(201).json({ showing });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
});
movieRoute.post(
    "/cinemaHall/add",
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const data = new cinemaHallModel(req.body);
        data.save();
        if (data) {
            let row = "A";
            let column = 1;
            let x = 9;
            let y = 5;
            if (req.body.totalSeats == 45) x = 13;
            if (req.body.totalSeats == 91) x = 13; y = 7;
            while (column <= y) {
                switch (column) {
                    case 2: row = "B"; break;
                    case 3: row = "C"; break;
                    case 4: row = "D"; break;
                    case 5: row = "E"; break;
                    case 6: row = "F"; break;
                    case 7: row = "G"; break;
                }
                debugger;
                let i = 1;
                while (i <= x) {
                    const cinemaSeat = new cinemaSeatModel({ name: data._id.toString(), seatRow: row, seatColumn: i, type: "normal" });
                    console.log(cinemaSeat);
                    cinemaSeat.save();
                    i++;
                }
                column++;
            }
            res.json(data);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.get(
    "/findMovieDayStep1",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.distinct('startTime');
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(data.map(a => convert(a)));
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieCinemaStep1",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        const data = await CinemaModel.find({});
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieDayStep2/:id",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        var date = new Date();
        var textDate = convert(date, 1) + "T00:00:00.000Z";
        var text = req.params.id;

        if (req.params.id != 1)
            textDate = text[6] + text[7] + text[8] + text[9] + "-" + text[3] + text[4] + "-" + text[0] + text[1] + "T00:00:00.000Z";

        const data = await ShowingModel.distinct('idCinema', { startTime: textDate });
        var list = [];
        for (let a of data) {
            const data = await CinemaModel.findById(a);
            list.push(data);
        }
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieCinemaStep2/:id",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.distinct('idMovie', { idCinema: req.params.id });
        var list = [];
        for (let a of data) {
            const data = await MovieModel.findById(a);
            list.push({
                idMovie: a,
                nameMovie: data.name,

            });
        }
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieDayStep3/:id/:date",      //Tim rap dua tren id rap
    asyncHandler(async (req, res) => {
        var text = req.params.date;
        const data = await ShowingModel.distinct('idMovie', { idCinema: req.params.id, startTime: text[6] + text[7] + text[8] + text[9] + "-" + text[3] + text[4] + "-" + text[0] + text[1] + "T00:00:00.000Z" });
        var list = [];
        for (let a of data) {
            const movie = await MovieModel.findById(a);
            list.push({
                idMovie: movie._id.toString(),
                nameMovie: movie.name
            })
        }
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })
);
movieRoute.get(
    "/findMovieCinemaStep3/:id/:idMovie",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.distinct('idMovie', { idCinema: req.params.id, idMovie: req.params.idMovie });
        var list = []
        for (let a of data) {
            var listItem = [];
            const data = await ShowingModel.distinct('startTime', { idMovie: a, idCinema: req.params.id })
            for (let b of data) {
                listItem.push(convert(b));
            }
            list.push({
                idMovie: a,
                movieDate: listItem
            })
        }
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieCinemaStep4/:id/:idMovie/:date",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        var text = req.params.date;
        const data = await ShowingModel.find({ idCinema: req.params.id, startTime: text[6] + text[7] + text[8] + text[9] + "-" + text[3] + text[4] + "-" + text[0] + text[1] + "T00:00:00.000Z", idMovie: req.params.idMovie });
        var list = [];
        for (let a of data) {
            const data1 = await showSeatModel.find({ idShowing: a._id.toString() }).count();
            const data2 = await showSeatModel.find({ idShowing: a._id.toString(), isReserved: true }).count();
            list.push({
                idSession: a._id.toString(),
                nameSession: a.time,
                seat: data1 - data2 + "/" + data1
            })
        }
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
        //     const data = await ShowingModel.distinct('idMovie',{idCinema:req.params.id,idMovie:req.params.idMovie});
        //    var list = []
        //    for(let a of data){
        //     var listItem=[];
        //     var text = req.params.idDate;
        //     const data = await ShowingModel.distinct('startTime',{idMovie:a,idCinema:req.params.id,startTime:text[6]+text[7]+text[8]+text[9]+"-"+text[3]+text[4]+"-"+text[0]+text[1]+"T00:00:00.000Z"})
        //     for(let b of data)
        //     {
        //     const data = await ShowingModel.find({idMovie:a,idCinema:req.params.id,startTime:b});
        //     var listSeat=[];
        //     for(let c of data)
        //     {
        //         const data = await showSeatModel.find({idShowing:c._id.toString()}).count();
        //     const data2 = await showSeatModel.find({idShowing:c._id.toString(),isReserved:true}).count();
        //         listSeat.push({time: c.time,seat:data-data2+"/"+data});
        //     }    
        //     console.log(listSeat);
        //         listItem.push({date:convert(b),listSeat});
        //     }
        //     list.push({
        //         idSession:a,
        //         nameSession:listItem[0].date,
        //         seat:listItem[0].listSeat

        //     })
        //    }
        //     if (data) {
        //         return res.json(list);
        //     } else {
        //         return res.status(400).json({ message: "No item found" });
        //     }
    })

);
movieRoute.get(
    "/findMovieDayStep4/:id/:date/:idMovie",      //Tim rap dua tren id rap
    asyncHandler(async (req, res) => {
        var text = req.params.date;
        const data = await ShowingModel.find({ idCinema: req.params.id, startTime: text[6] + text[7] + text[8] + text[9] + "-" + text[3] + text[4] + "-" + text[0] + text[1] + "T00:00:00.000Z", idMovie: req.params.idMovie });
        var list = [];
        for (let a of data) {
            const data1 = await showSeatModel.find({ idShowing: a._id.toString() }).count();
            const data2 = await showSeatModel.find({ idShowing: a._id.toString(), isReserved: true }).count();
            list.push({
                idSession: a._id.toString(),
                nameSession: a.time,
                seat: data1 - data2 + "/" + data1
            })
        }
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })
);
// movieRoute.get(
//     "/findMovieDayStep5/:id",      //Tim rap dua tren id rap
//     asyncHandler(async (req, res) => {
//         const data = await showSeatModel.find({idShowing:req.params.id}).count();
//         const data2 = await showSeatModel.find({idShowing:req.params.id,isReserved:true}).count();
//         // const nameCinema = cinema.map( a => a._id)
//         if (data) {
//             return res.json({seat:data-data2+"/"+data});
//         } else {
//             return res.status(400).json({ message: "No item found" });
//         }
//     })
// );
movieRoute.get(
    "/findMovieStep1/:id",      //Tim rap dua tren movie (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.distinct('idCinema', { idMovie: req.params.id });
        //    console.log(data);
        const cinema = await CinemaModel.find({});
        var listValue = [];
        data.forEach(element => {
            listValue.push(cinema.filter(x => x._id == element)[0])
        });
        console.log(listValue);
        // const nameCinema = cinema.map( a => a._id)
        if (data) {
            return res.json(listValue);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieStep2/:idMovie/:idCinema",      //Tim ngay chieu dua tren rap (*)
    asyncHandler(async (req, res) => {
        if (req.params.idMovie != null) {
            if (req.params.idCinema != null) {
                // const data = await ShowingModel.distinct('startTime', { idMovie: req.params.idMovie, idCinema: req.params.idCinema });
                const text = convert(new Date()).toString();
                const date = text[6] + text[7] + text[8] + text[9] + "-" + text[3] + text[4] + "-" + text[0] + text[1] + "T00:00:00.000Z";
                const data = await ShowingModel.aggregate([{
                    $match: {
                        startTime: {
                            $gte: new Date(date)
                        }, idMovie: req.params.idMovie, idCinema: req.params.idCinema
                    }
                }]);
                var list = [];
                data.forEach(element => {
                    if (list.includes(element.startTime.toString()) !== true)
                        list.push(element.startTime.toString());
                });
                if (data) {
                    return res.json(list.map(a => formatDate(a) + "T00:00:00.000Z"));
                }
            }
        }
        {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

movieRoute.get(
    "/findMovieStep3/:idMovie/:idCinema/:startTime",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.find({ idMovie: req.params.idMovie, idCinema: req.params.idCinema, startTime: req.params.startTime }, { time: 1, idHall: 1 });
        var list = [];
        for (let a of data) {
            const hall = await cinemaHallModel.findById(a.idHall);
            list.push({ "time": a.time, "name": hall.name });
        };
        if (data) {
            return res.json(list);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieStep4/:idMovie/:idCinema/:startTime/:time",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)   
    asyncHandler(async (req, res) => {
        const check = await ShowingModel.findOne({ idMovie: req.params.idMovie, idCinema: req.params.idCinema, startTime: req.params.startTime, time: req.params.time });
        console.log(check);
        const id = check._id.toString();
        const hall = await cinemaHallModel.findById(check.idHall);
        console.log(hall);
        const data = await showSeatModel.find({ idShowing: check._id }, { id: '$_id', _id: 0, number: 1, isReserved: 1 }).sort({ number: 1 });

        let listItem = [];
        let i = 0, x = 0;
        let a = 5;
        let b = 9;
        if (hall.totalSeats == 91) {
            a = 7; b = 13;
        }
        while (i < a) {
            let list = [];
            let j = 0;
            while (j < b) {
                list.push(data[x]);
                x++;
                j++;
            }
            console.log(list);
            list = list.sort(stringHandle.GetSortOrderDecrese("number"))
            listItem.push(list);
            i++;
        }
        // console.log(listItem);
        if (data) {
            return res.json({ data: listItem, idShowing: id });
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/historyBooking",
    asyncHandler(async (req, res) => {
        const bill = await billModel.find({});
        if (bill) {
            return res.json(bill);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);

movieRoute.get(
    "/listOrder",
    asyncHandler(async (req, res) => {
        const bill = await orderModel.find({});
        if (bill) {
            return res.json(bill);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);

movieRoute.get(
    "/historyBooking/:id",
    asyncHandler(async (req, res) => {
        const bill = await billModel.find({ idCustomer: req.params.id });
        var listItem = [];
        for (let a of bill) {
            console.log(a);

            const ticket = await orderModel.distinct('idShowing', { idBill: a._id.toString() });
            console.log(ticket);
            for (let b of ticket) {
                console.log("b" + b);

                const showing = await ShowingModel.findById(b);
                console.log(showing);
                const cinema = await CinemaModel.findById(showing.idCinema);
                console.log(cinema);
                const movie = await MovieModel.findById(showing.idMovie);
                console.log(movie);

                let list = [];
                const ticketOfMovie = await orderModel.find({ idBill: a._id.toString(), idShowing: b });
                let idOrder="";
                for (let c of ticketOfMovie) {
                    const seat = await showSeatModel.findById(c.idShowSeat);
                    console.log(seat);
                    list.push({ "number": seat.number, "id": seat._id.toString() });
                    idOrder = c._id.toString();
                }                
                var status = await revertModal.findOne({ idOldOrder: idOrder, idUser: req.params.id });
                if (status) { status = 1; }
                else {
                    status = 0;
                }
                var item = {
                    idBill: a._id.toString(),
                    movie: movie.name,
                    cinema: cinema.name,
                    date: convert(showing.startTime, 1),
                    session: showing.time,
                    listItem: list,
                    status: status,
                    createDate: convert(a.createdAt),
                }
                listItem.push(item);
                console.log(listItem);

            }
        }
        console.log(listItem);
        if (bill) {
            return res.json(listItem);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/listBillManage",
    asyncHandler(async (req, res) => {
        var listItem = [];
        const bill = await billModel.find({}, { _id: 1, createdAt: 1, idCustomer: 1 }).limit(50).sort({ createdAt: -1 });
        console.log(bill);
        for (let x of bill) {
            const ticket = await orderModel.distinct('idShowing', { idBill: x._id.toString() });
            for (let b of ticket) {
                const showing = await ShowingModel.findById(b, { startTime: 1, time: 1, idMovie: 1, idCinema: 1 }).sort({ timestamp: -1 });
                const cinema = await CinemaModel.findById(showing.idCinema);
                const movie = await MovieModel.findOne({ _id: showing.idMovie });
                let list = [];
                const ticketOfMovie = await orderModel.find({ idBill: x._id.toString(), idShowing: b }, { idShowSeat: 1 }).sort({ timestamp: -1 });
                let total = 0;
                for (let c of ticketOfMovie) {
                    const seat = await showSeatModel.findById(c.idShowSeat).sort({ timestamp: -1 });
                    total += seat.price;
                    list.push(seat.number);
                }
                const user = await UserModal.findById(x.idCustomer, { name: 1 });
                var item = {
                    idBill: x._id.toString(),
                    movie: movie.name,
                    fullName: user.name,
                    cinema: cinema.name,
                    date: convert(showing.startTime),
                    session: showing.time,
                    list: list,
                    createDate: convert(x.createdAt),
                    totalMoney: total
                }
                listItem.push(item);
            }
        }
        if (bill) {
            return res.json(listItem);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })
);
function convert(str, a) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    if (a == null)
        return [day, mnth, date.getFullYear()].join("-");
    else
        return [date.getFullYear(), mnth, day].join("-");
}
movieRoute.get(
    "/detailBooking/:id",
    asyncHandler(async (req, res) => {
        const bill = await billModel.findOne({ idBill: req.params.id });
        const ticket = await orderModel.distinct('idShowing', { idBill: bill._id.toString() });
        var listItem = [];
        for (let b of ticket) {
            console.log(b);

            const showing = await ShowingModel.findById(b);
            console.log(showing);
            const cinema = await CinemaModel.findById(showing.idCinema);
            console.log(cinema);

            const movie = await MovieModel.findById(showing.idMovie);
            console.log(movie);

            let list = [];
            const ticketOfMovie = await orderModel.find({ idBill: bill._id.toString(), idShowing: b });
            let total = 0;
            for (let c of ticketOfMovie) {
                const seat = await showSeatModel.findById(c.idShowSeat);
                total += seat.price;
                console.log(seat);
                list.push(seat.number);
            }
            const user = await UserModal.findById(bill.idCustomer);
            var item = {
                idBill: bill._id.toString(),
                fullName: user.fullName,
                movie: movie.name,
                cinema: cinema.name,
                date: convert(showing.startTime),
                session: showing.time,
                listItem: list,
                createDate: convert(bill.createdAt),
                totalMoney: total
            }
            listItem.push(item);
            console.log(listItem);

        }
        if (ticket) {
            return res.json(listItem);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/setRating",
    asyncHandler(async (req, res) => {
        const movie = await MovieModel.find({});
        const rating = await feedbackModel.distinct('movieId', {});

        for (let item of movie) {
            const data = await feedbackModel.findOne({ movieId: item._id.toString() });
            if (data == null) { await MovieModel.findById(item._id.toString()).updateOne({ $set: { rate: 0 } }); }
        }
        if (rating) {
            return res.json(rating);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/seatShow",
    asyncHandler(async (req, res) => {
        const data = await showSeatModel.find({});
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/seatShow/:id",
    asyncHandler(async (req, res) => {
        const data = await showSeatModel.find({ idShowing: req.params.id }, { id: 1, number: 1, _id: 0 }).sort({ number: 1 });
        let listItem = [];
        let i = 0, x = 0;
        while (i < 7) {
            let list = [];
            let j = 0;
            while (j < 13) {
                list.push(data[x]);
                x++;
                j++;
            }
            console.log(list);
            listItem.push(list);
            i++;
        }
        // console.log(listItem);
        await cinemaSeatModel.find({ seatRow: "f" }).updateMany({}, { $set: { seatRow: "F" } });
        if (data) {
            return res.json(listItem);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/cinemaHall",
    asyncHandler(async (req, res) => {
        const data = await cinemaHallModel.find({});
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/nameSeat/:id",
    asyncHandler(async (req, res) => {
        const data = await showSeatModel.findById(req.params.id);
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get('/cinemaHall/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const cinema = await cinemaHallModel.findByIdAndDelete(req.params.id);
        const data = await cinemaSeatModel.deleteMany({ name: req.params.id });
        console.log(data);
        if (!data || !cinema) return res.status(400).json({ data: null, message: "No item found" });
        else
            return res.status(201).json({ cinema });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
});
movieRoute.get(
    "/cinemaSeat",
    asyncHandler(async (req, res) => {
        const data = await cinemaSeatModel.find({});
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/showing",
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.find({});
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/rating",
    asyncHandler(async (req, res) => {
        const data = await RatingModel.find({ status: true });
        await UserModal.updateMany({ $set: { isActive: true } });
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/rating/delete/:id",
    asyncHandler(async (req, res) => {
        const data = await RatingModel.findByIdAndDelete(req.params.id);
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get('/rating/avg', async (req, res) => {
    try {
        console.log(req.params.id);
        var data = await RatingModel.aggregate([{ $group: { _id: "$movieId", avg_val: { $avg: "$rate" } } }]);
        data.map(async (a) => {
            await MovieModel.findByIdAndUpdate(a._id, { $set: { rate: Math.round(a.avg_val * 10) / 10 } });
            a.avg_val = Math.round(a.avg_val * 10) / 10;
        });
        console.log(data);

        if (!data) return res.status(400).json({ data: null, message: "No item found" });
        else
            return res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
});
movieRoute.get('/rating/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const data = await RatingModel.findByIdAndDelete(req.params.id);
        console.log(data);
        if (!data) return res.status(400).json({ data: null, message: "No item found" });
        else
            return res.status(201).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
});
movieRoute.get(
    "/checkIn/:id",
    asyncHandler(async (req, res) => {
        const order = await orderModel.distinct('idShowSeat', { idBill: req.params.id });
        if (order) {
            for (let a of order) {
                console.log(a);
            }
            res.json(order);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);
movieRoute.get(
    "/checkShowSeat/:id",
    asyncHandler(async (req, res) => {
        const id = await showSeatModel.find({ _id: req.params.id });
        if (id) {
            res.json(id);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);
movieRoute.get(
    "/updateShowSeat/:id",
    asyncHandler(async (req, res) => {
        const id = await showSeatModel.findByIdAndUpdate(req.params.id, { $set: { isReserved: false } });
        if (id) {
            res.json(id);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);
movieRoute.get(
    "/removeBill/:id",
    asyncHandler(async (req, res) => {
        const id = await orderModel.deleteMany({ idBill: req.params.id });
        const check = await billModel.findByIdAndRemove(req.params.id);
        if (check) {
            res.json(check);
        } else {
            res.status(404)
            throw new Error("Order not Found");
        }
    })
);

movieRoute.get(
    "/updateBill",
    asyncHandler(async (req, res) => {
        try {
            const list = await billModel.find({ status: -1 });
            console.log(list);
            if (list[0]) {
                for (let item of list) {
                    console.log(item._id.toString());
                    const listCheck = await orderModel.find({ idBill: item._id.toString() }, { idShowSeat: 1, createDate: 1 });
                    const seconds = "";
                    const a = moment(new Date());
                    for (let x of listCheck) {
                        const b = moment(x.createDate);
                        seconds = a.diff(b, 'seconds');
                        if (seconds > 300)
                            await showSeatModel.findByIdAndUpdate(x.idShowSeat, { $set: { isReserved: false } });
                    }
                    if (seconds > 300) {
                        await orderModel.deleteMany({ idBill: item._id.toString() });
                        await billModel.findByIdAndRemove(item._id.toString());
                    }
                }
                res.send({ message: "Done" });
            } else {
                res.send({ message: "unavaible" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
        }
    })
);

movieRoute.get(
    "/filterId/:id",
    asyncHandler(async (req, res) => {
        const movie = await MovieModel.findById(req.params.id, {});
        if (movie) {
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
movieRoute.get(
    "/showing/list/",
    asyncHandler(async (req, res) => {
        const data = await showSeatModel.deleteMany({ name: "646f8873753b587ea2d0e93d" });
        console.log(data);
        if (data) {
            res.json(data);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
movieRoute.get(
    "/findIdSeat/:idUser/:idBill/:name",
    asyncHandler(async (req, res) => {
        const data = await orderModel.find({ idCustomer: req.params.idUser, idBill: req.params.idBill });
        const check = await showSeatModel.findOne({ name: data.idShowing, seatRow: req.params.name[0], seatColumn: req.params.name[1] });
        if (check) {
            res.json(check._id.toString());
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
movieRoute.get(
    "/idrom",
    asyncHandler(async (req, res) => {
        res.json(["6:00", "7:30", "9:00", "10:00", "12:00", "13:30", "15:00", "16:00", "18:00", "19:30", "21:00", "22:00", "24:00"]);

    })
);
movieRoute.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const movie = await MovieModel.findOne({ name: req.params.id });
        if (movie) {
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
export default movieRoute;
