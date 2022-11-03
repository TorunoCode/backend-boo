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
import commentsFeedback from './routes/commentsFeedbacksRoutes.js';
import paypal from'paypal-rest-sdk';
import paypalRoute from'./routes/paypalRoutes.js';
import billRoute from'./routes/billRoutes.js';
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYQgAnSGvQmxgRu3DPGAqhi8bQar2z6B9B9QHDPAdVoUbxOQHi81qbffwJLnlkUuKuHz2eOP_mHyMZBK',
    'client_secret': 'EO_1MPZ3huDwSDTa_eX5yYCdEYyTTFdO38LBiqLFGfE2H5TaoY7m4Q0Xpt9H0N7uy7iXzy0AqjkiZB11'
  });
console.log('done set up paypal');
dotenv.config();
connectDatabase();
const app = express();
process.env.TZ = "Asia/Ho_Chi_Minh";
app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

// API
app.use("/api/import",ImportData);
app.use("/api/movies",movieRoute);
app.use("/api/user",userRoute);
app.use("/api/commentsFeedback",commentsFeedback)
app.use("/api/paypal",paypalRoute);
app.use("/api/bill",billRoute);
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