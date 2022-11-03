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
            const showSeat = await showSeatModel({price:req.body.price,idCinemaHallSeat: a._id,idShowing:showing._id,status:0});
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
            let row = "a";
            let column=1;
            let x = 6;           
            if(req.body.totalSeats == 45)  x = 9;
            while(column<=6){
                switch(column){
                    case 2: row = "b"; break;
                    case 3: row = "c"; break;
                    case 4: row = "d"; break;
                    case 5: row = "e"; break;
                    case 6: row = "f"; break;
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
        const data = await ShowingModel.find({idMovie:req.params.idMovie,idCinema: req.params.idCinema,startTime:req.params.startTime,time: req.params.time});
        const cinemaSeat = await cinemaSeatModel.findById(data.idHall);
        if(cinemaSeat ){
            return    res.json(data);
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
