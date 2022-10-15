import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { movies } from './data/movies.js';
import dotenv from 'dotenv'
import connectDatabase from './config/MongoDb.js';
import ImportData from './DataImport.js';
import movieRoute from './routes/MovieRoutes.js';
import userRoute from './routes/UserRoutes.js';
import { errorHandler, notFound } from './Middleware/errors.js';
import commentsFeadback from './routes/commentsFeadbacksRoutes.js';
dotenv.config();
connectDatabase();
const app = express();
app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

// API
app.use("/api/import",ImportData);
app.use("/api/movies",movieRoute);
app.use("/api/user",userRoute);
app.use("/api/commentsFeadback",commentsFeadback)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get("/api/movies",(req,res) => {
    res.json(movies);

});
app.get("/api/movies/:id",(req,res) => {
    const movie = movies.find((p)=> p.id == req.params.id);
    res.json(movie);
});
app.get("/",(req,res) => {
    res.send("API is running.....");
});
app.listen(PORT,()=>{console.log(`server is running ${PORT}`);})