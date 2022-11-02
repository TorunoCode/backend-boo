import express from 'express';
import asyncHandler from 'express-async-handler';
import MovieModel from '../models/movieModel.js';
import GenreModel from '../models/genreModel.js';
import CinemaModel from '../models/cinemaModel.js';
import ShowingModel from '../models/showingModel.js';
import RatingModel from '../models/feedbacksModel.js';
import cinemaHallModel from '../models/cinemaHallModel.js';
import cinemaSeatModel from '../models/cinemaHallSeatModel.js';

const movieRoute = express.Router();
movieRoute.get(
    "/",
    asyncHandler(async (req,res) => {
        const movies = await Movie.find({});
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
        const data = await CinemaHallModel.find({});
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
        const showing = new ShowingModel(req.body);
        showing.save();
        if(showing){
            res.json(showing);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
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
movieRoute.post(
    "/findMovieStep1",      //Tim rap dua tren movie (*)
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.find({idMovie:req.body.idMovie});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.post(
    "/findMovieStep2",      //Tim ngay chieu dua tren rap (*)
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.distinct('startTime',{idMovie:req.body.idMovie,idCinema: req.body.idCinema});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.post(
    "/findMovieStep3",      //Tim suat chieu phim dua tren ngay chieu(*) va rap (*)
    asyncHandler(async (req,res) => {
        const data = await ShowingModel.distinct('time',{idMovie:req.body.idMovie,idCinema: req.body.idCinema,startTime:req.body.startTime});
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
