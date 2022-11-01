import express from 'express';
import asyncHandler from 'express-async-handler';
import Movie from '../models/movieModel.js';
import Genre from '../models/genreModel.js';
import Cinema from '../models/cinemaModel.js';
import CinemaHall from '../models/cinemaHallModel.js';
import Showing from '../models/showingModel.js';

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
        const data = await Genre.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemas",
    asyncHandler(async (req,res) => {
        const data = await Cinema.find({});
        res.json(data);
    })

);
movieRoute.get(
    "/cinemaHalls",
    asyncHandler(async (req,res) => {
        const data = await CinemaHall.find({});
        res.json(data);
    })

);
movieRoute.post(
    "/add",
    asyncHandler(async (req,res) => {
        console.log(req.body);
        const movie = new Movie(req.body);
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
        const showing = new Showing(req.body);
        showing.save();
        if(showing){
            res.json(showing);
        } else {
            res.status(404)
            throw new Error("Add showing not successfull");
        }
    })

);
movieRoute.get(
    "/showing",
    asyncHandler(async (req,res) => {
        const data = await Showing.find({});
        if(data){
            return    res.json(data);
        } else {          
           return res.status(400).json({message: "No item found"});
        }
    })

);
movieRoute.get(
    "/:id",
    asyncHandler(async (req,res) => {
        const movie = await Movie.findOne({name:req.params.id});
        if(movie){
            res.json(movie);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
export default movieRoute;
