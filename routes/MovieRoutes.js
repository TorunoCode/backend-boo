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

const movieRoute = express.Router();
movieRoute.get(
    "/",
    asyncHandler(async (req,res) => {
        const movies = await MovieModel.find({});
        res.json(movies);
    })

);
movieRoute.get(
    "/genres",
    asyncHandler(async (req,res) => {
        const data = await GenreModel.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemas",
    asyncHandler(async (req,res) => {
        const data = await CinemaModel.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemaHalls",
    asyncHandler(async (req,res) => {
        const data = await cinemaHallModel.find({});
        res.json(data);
    })

);
movieRoute.post(
    "/add",
    asyncHandler(async (req,res) => {
        console.log(req.body);
        const movie = new MovieModel(req.body);
        movie.save();
        if(movie){
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Add movie not successfull");
        }
    })

);
movieRoute.post(
    "/showing/add",
    asyncHandler(async (req,res) => {
        console.log(req.body);
        const check = await ShowingModel.find({startTime:req.body.startTime,idCinema:req.body.idCinema});
        let listTest= check.map( a => a.time = parseInt(a.time.slice(0,2)));
        var testValue = parseInt(req.body.time.slice(0,2));
        const comfirm = listTest.includes( testValue);
        if(!comfirm){
        const showing = new ShowingModel(req.body);
        const cinemaSeat = await cinemaSeatModel.find({name: req.body.idHall});
        showing.save();
        cinemaSeat.map(async(a) => {
            const showSeat = await showSeatModel({price:req.body.price,id: a._id,number: a.seatRow+a.seatColumn,idShowing:showing._id});
            showSeat.save();
        })
        if(showing){
            res.json(showing);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }}
        else
        {
        console.log("Not add Showing")
        res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.post(
    "/booking/add",
    asyncHandler(async (req,res) => {
        console.log(req.body);
        const check = await billModel.findOne({idCustomer:req.body.idCustomer,status:-1});        
        if(check){
            const bill = await billModel({totalMoney: req.body.price,idCustomer: req.body.idCustomer, status:-1 })
            bill.save();
            const bookingTicket = await orderModel({idBill:bill._id.toString(), idCinemaHallSeat: req.body.idCinemaHallSeat,idCustomer: req.body.idCustomer,idShowing: req.body.idShowing,image: req.body.image, status:-1})
            bookingTicket.save();            
            if(bookingTicket){
            res.json(bookingTicket);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }}
        else
        {
            check.totalMoney += req.body.price;
            const bill = await billModel.findByIdAndUpdate(check._id.toString(),{totalMoney: check.price});
            const bookingTicket = await orderModel({idBill:bill._id.toString(), idCinemaHallSeat: req.body.idCinemaHallSeat,idCustomer: req.body.idCustomer,idShowing: req.body.idShowing,image: req.body.image, status:-1})
            bookingTicket.save();            
            if(bookingTicket){
            res.json(bookingTicket);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }

        console.log("Not add booking")
        res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.get(
    "/showing/:id",
    asyncHandler(async (req,res) => {
        const showing = await ShowingModel.find({startTime:"2022-11-19T00:00:00.000Z",idCinema:"6358b045169e41aaeeb68d6b"});
        console.log(showing);
        var list = showing.map( a => a.time = parseInt(a.time.slice(0,2)));
        var test = 18;
        list.flatMap( a => a == test ? console.log("yes"):console.log("no"))
        if(showing){
            res.json(list);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.get('/showing/delete/:id', async(req,res)=>{
    try{
      console.log(req.params.id);
      const showing = await ShowingModel.findByIdAndDelete(req.params.id);
        const data = await showSeatModel.deleteMany({idShowing:req.params.id});
        console.log(data);
        if(!data || !showing)  return res.status(400).json({data:null, message: "No item found" }); 
        else
       return res.status(201).json({ showing });
    }
    catch(error)
    {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  });
movieRoute.post(
    "/cinemaHall/add",
    asyncHandler(async (req,res) => {
        console.log(req.body);
        const data = new cinemaHallModel(req.body);
        data.save();
        if(data){
            let row = "A";
            let column=1;
            let x = 9;           
            if(req.body.totalSeats == 45)  x = 13;
            while(column<=7){
                switch(column){
                    case 2: row = "B"; break;
                    case 3: row = "C"; break;
                    case 4: row = "D"; break;
                    case 5: row = "E"; break;
                    case 6: row = "F"; break;
                    case 7: row = "G"; break;
                }
                debugger;
                let i = 1;
                while(i<=x){
                    const cinemaSeat = new cinemaSeatModel({name:data._id.toString(),seatRow:row,seatColumn:i,type:"normal"});
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
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.distinct('idCinema',{idMovie:req.params.id});
    //    console.log(data);
        const cinema = await CinemaModel.find({});
       var listValue=[];
        data.forEach(element => {
            listValue.push(cinema.filter( x => x._id == element )[0])
        });
        console.log(listValue);
        // const nameCinema = cinema.map( a => a._id)
        if(data){
            return    res.json(listValue);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/findMovieStep2/:idMovie/:idCinema",      //Tim ngay chieu dua tren rap (*)
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.distinct('startTime',{idMovie:req.params.idMovie,idCinema: req.params.idCinema});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/findMovieStep3/:idMovie/:idCinema/:startTime",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.distinct('time',{idMovie:req.params.idMovie,idCinema: req.params.idCinema,startTime:req.params.startTime});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/findMovieStep4/:idMovie/:idCinema/:startTime/:time",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)   
    asyncHandler(async (req,res) => {
        const check = await ShowingModel.findOne({idMovie:req.params.idMovie,idCinema: req.params.idCinema,startTime:req.params.startTime,time:req.params.time});
        console.log(check);
        const data = await showSeatModel.find({idShowing:check._id},{id:1,number:1,_id:0}).sort({number:1});
        let listItem = [];
        let i=0,x=0;
        while(i<5){
            let list = [];  
            let j=0;          
            while(j<9)
            {
                list.push(data[x]);
                x++;
            j++;
            }
            console.log(list);
            listItem.push(list);
            i++;
        }
        // console.log(listItem);
        if(data){
            return    res.json(listItem);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/seatShow",
    asyncHandler(async (req,res) => {
        const data = await showSeatModel.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/seatShow/:id",
    asyncHandler(async (req,res) => {
        const data = await showSeatModel.find({idShowing:req.params.id},{id:1,number:1,_id:0}).sort({number:1});
        let listItem = [];
        let i=0,x=0;
        while(i<7){
            let list = [];  
            let j=0;          
            while(j<13)
            {
                list.push(data[x]);
                x++;
            j++;
            }
            console.log(list);
            listItem.push(list);
            i++;
        }
        // console.log(listItem);
        await cinemaSeatModel.find({seatRow:"f"}).updateMany({},{$set:{seatRow:"F"}});
        if(data){
            return    res.json(listItem);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/cinemaHall",
    asyncHandler(async (req,res) => {
        const data = await cinemaHallModel.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get('/cinemaHall/delete/:id', async(req,res)=>{
    try{
      console.log(req.params.id);
      const cinema = await cinemaHallModel.findByIdAndDelete(req.params.id);
        const data = await cinemaSeatModel.deleteMany({name:req.params.id});
        console.log(data);
        if(!data || !cinema)  return res.status(400).json({data:null, message: "No item found" }); 
        else
       return res.status(201).json({ cinema });
    }
    catch(error)
    {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  });
  movieRoute.get(
    "/cinemaSeat",
    asyncHandler(async (req,res) => {
        const data = await cinemaSeatModel.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/showing",
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/rating",
    asyncHandler(async (req,res) => {
        const data = await RatingModel.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get('/rating/avg', async(req,res)=>{
    try{
      console.log(req.params.id);
        var data = await RatingModel.aggregate([{$group: {_id:"$movieId", avg_val:{$avg:"$rate"}}}]);
        data.map(async(a) => {
            await MovieModel.findByIdAndUpdate(a._id,{$set:{rate:Math.round(a.avg_val*10)/10}});
            a.avg_val=Math.round(a.avg_val*10)/10;
         } );
        console.log(data);

        if(!data)  return res.status(400).json({data:null, message: "No item found" }); 
        else
       return res.status(201).json(data);
    }
    catch(error)
    {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  });
movieRoute.get('/rating/delete/:id', async(req,res)=>{
    try{
      console.log(req.params.id);
        const data = await RatingModel.findByIdAndDelete(req.params.id);
        console.log(data);
        if(!data)  return res.status(400).json({data:null, message: "No item found" }); 
        else
       return res.status(201).json({ data });
    }
    catch(error)
    {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  });
movieRoute.get(
    "/:id",
    asyncHandler(async (req,res) => {
        const movie = await MovieModel.findOne({name:req.params.id});
        if(movie){
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
export default movieRoute;
