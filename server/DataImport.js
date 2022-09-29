import express from 'express';
import User from './models/userModel.js';
import users from './data/users.js';
import movies  from './data/movies.js';
import Movie from './models/movieModel.js';
import asyncHandler from 'express-async-handler';
const ImportData = express.Router();

 ImportData.post("/user",
 asyncHandler(async(req,res)=>{
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({importUser});
}));
ImportData.post("/movies",
asyncHandler(async(req,res)=>{
    await Movie.remove({});
    const importMovie= await Movie.insertMany(movies);
    res.send({importMovie});
}));
export default ImportData;