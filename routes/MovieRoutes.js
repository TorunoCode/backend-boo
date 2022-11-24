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
import listModel from '../models/listModel.js';
import UserModal from '../models/userModel.js';
import feedbackModel from '../models/feedbacksModel.js';
import mongoose from 'mongoose';
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
        res.json(movies);
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
movieRoute.post(
    "/add",
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const movie = new MovieModel(req.body);
        if (movie.name != null) {
            movie.save();
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Add movie not successfull");
        }
    })

);
movieRoute.post(
    "/showing/add",
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const check = await ShowingModel.find({ startTime: req.body.startTime, idCinema: req.body.idCinema });
        let listTest = check.map(a => a.time = parseInt(a.time.slice(0, 2)));
        var testValue = parseInt(req.body.time.slice(0, 2));
        const comfirm = listTest.includes(testValue);
        if (!comfirm) {
            const showing = new ShowingModel(req.body);
            const cinemaSeat = await cinemaSeatModel.find({ name: req.body.idHall });
            showing.save();
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
        if (!check) {
            const bill = await billModel({ totalMoney: 0, idCustomer: req.params.id, status: -1 }); //tao ma bill moi
            await bill.save();
            for (let a of body) {
                console.log("bill: " + bill._id);
                console.log(a)
                const bookingTicket = await orderModel({ idBill: bill._id.toString(), idShowSeat: a, idCustomer: req.session.idCustomer, idShowing: req.body.idShowing, status: -1 })
                bookingTicket.save();  //gan nhan ticket voi ma bill ma kh mua
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
        }
        else {
            console.log("here")
            for (let a of body) {
                console.log("now")
                console.log(a)
                const bookingTicket = await orderModel({ idBill: check._id.toString(), idShowSeat: a, idCustomer: req.params.id, idShowing: req.body.idShowing, status: -1 })
                await bookingTicket.save();
                console.log("wher")
                //const data = await showSeatModel.findById(mongoose.Types.ObjectId(a.idShowSeat));
                const data = await showSeatModel.findById(a);
                console.log(data)
                const total = await billModel.findById(check._id.toString());
                console.log("total: " + total.totalMoney)
                console.log("price: " + data.price)
                await billModel.findByIdAndUpdate(check._id.toString(), { $set: { totalMoney: total.totalMoney + data.price } });
                await showSeatModel.findById(a).updateOne({}, { $set: { isReserved: true } });
                console.log("sum: " + (total.totalMoney + data.price))
            }
            return res.status(400).json({message: "add successfully" });
        }
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
        const data = await ShowingModel.distinct('startTime', { idMovie: req.params.idMovie, idCinema: req.params.idCinema });
        if (data) {
            return res.json(data);
        } else {
            return res.status(400).json({ message: "No item found" });
        }
    })

);
movieRoute.get(
    "/findMovieStep3/:idMovie/:idCinema/:startTime",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)
    asyncHandler(async (req, res) => {
        const data = await ShowingModel.distinct('time', { idMovie: req.params.idMovie, idCinema: req.params.idCinema, startTime: req.params.startTime });
        if (data) {
            return res.json(data);
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
    "/historyBooking/:id",
    asyncHandler(async (req, res) => {
        const bill = await billModel.find({ idCustomer: req.params.id });  
        var  listItem =[];     
              for (let a of bill) 
              {
                console.log(a);

                const ticket = await orderModel.distinct('idshowing',{ idBill: a._id.toString() });
                console.log(ticket);
                for( let b of ticket)
                {
                    console.log("b"+b);

                const showing = await ShowingModel.findById(b);   
                console.log(showing);
                const cinema = await CinemaModel.findById(showing.idCinema);
                console.log(cinema);

                const movie = await MovieModel.findById(showing.idMovie);
                console.log(movie);

                let list = [];
                const ticketOfMovie = await orderModel.find({ idBill: a._id.toString(),idshowing:b });
                console.log(ticketOfMovie);
                for (let c of ticketOfMovie) {
                    const seat = await showSeatModel.findById(c.idShowSeat);     
                    console.log(seat);
                    list.push(seat.number);
                }
                var item = {
                    idBill: a._id.toString(),
                    movie:movie.name,
                    cinema: cinema.name,
                    date: convert(showing.startTime),
                    session: showing.time,
                    listItem: list,
                    createDate:convert(a.createdAt),
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
function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
movieRoute.get(
    "/detailBooking/:id",
    asyncHandler(async (req, res) => {
        const bill = await billModel.findOne({ idBill: req.params.id });
        const ticket = await orderModel.distinct('idshowing',{ idBill: bill._id.toString() });
        var  listItem =[];     
                for( let b of ticket)
                {
                    console.log(b);

                const showing = await ShowingModel.findById(b);   
                console.log(showing);
                const cinema = await CinemaModel.findById(showing.idCinema);
                console.log(cinema);

                const movie = await MovieModel.findById(showing.idMovie);
                console.log(movie);

                let list = [];
                const ticketOfMovie = await orderModel.find({ idBill: bill._id.toString(),idshowing:b });
                let total =0;
                for (let c of ticketOfMovie) {
                    const seat = await showSeatModel.findById(c.idShowSeat);     
                    total += seat.price;
                    console.log(seat);
                    list.push(seat.number);
                }
                var item = {
                    movie:movie.name,
                    cinema: cinema.name,
                    date: convert(showing.startTime),
                    session: showing.time,
                    listItem: list,
                    createDate:convert(bill.createdAt),
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
        const data = await RatingModel.find({});
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
