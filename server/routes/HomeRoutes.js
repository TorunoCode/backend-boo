import express from 'express';
import asyncHandler from 'express-async-handler';
import Genre from '../models/genreModel.js';

const homeRoute = express.Router();
homeRoute.get(
    "/genres",
    asyncHandler(async (req,res) => {
        const genres = await Genre.find({});
        res.json(genres);
    })

);
export default homeRoute;