import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { movies } from './data/movies.js';
import connectDatabase from './config/MongoDb.js';
import ImportData from './DataImport.js';
import movieRoute from './routes/MovieRoutes.js';
import userRoute from './routes/UserRoutes.js';
import { errorHandler, notFound } from './Middleware/errors.js';
import feedbackRoute from './routes/feedbacksRoutes.js';
import paypal from 'paypal-rest-sdk';
import paypalRoute from './routes/paypalRoutes.js';
import billRoute from './routes/billRoutes.js';
import session from 'express-session';
import MongoDBSession from 'connect-mongodb-session';
import summingRoute from './routes/sumingRoutes.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import oAuthGoogleRoutes from './routes/oAuthGoogleRoutes.js';
import oAuthFacebookRoutes from './routes/oAuthFacebookRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import userMoneyRoutes from './routes/userMoneyRoutes.js';
import checkBillRoutes from './routes/checkBillRoutes.js';
import recommendRoutes from './routes/recommendRoutes.js';
import revertTicketRoutes from './routes/revertRoutes.js';
const app = express();
app.enable('trust proxy');
const MongoStore = MongoDBSession(session);
const store = new MongoStore({
  uri: process.env.CONNECTION_URL,
  collection: "mySessions"
});
app.use(
  session({
    secret: "key that will sign cookie",
    cookie: {
      maxAge: 1000 * 60 * 12 * 24, // 1 week
      sameSite: 'none',
      secure: true,
      httpOnly: false
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
)
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});
console.log('done set up paypal');
connectDatabase();
app.use(express.json());



process.env.TZ = "Asia/Ho_Chi_Minh";
var allowedDomains = ['https://web-fixgo.vercel.app', 'https://admin-fixgo.vercel.app', 'http://localhost:3000',
  'https://backend-boo.vercel.app', 'http://localhost:5000']
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);

    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// API
app.use("/api/import", ImportData);
app.use("/api/movies", movieRoute);
app.use("/api/user", userRoute);
app.use("/api/commentsFeedback", feedbackRoute)
app.use("/api/paypal", paypalRoute);
app.use("/api/bill", billRoute);
app.use("/api/summing", summingRoute);
app.use("/api/oAuthGoogleRoutes", oAuthGoogleRoutes);
app.use("/api/oAuthFacebookRoutes", oAuthFacebookRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/userMoney", userMoneyRoutes);
app.use("/api/checkBill", checkBillRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/revertTicket", revertTicketRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get("/api/movies", (req, res) => {
  res.json(movies);

});
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((p) => p.id == req.params.id);
  res.json(movie);
});
app.get("/", (req, res) => {
  res.send("API is running.....");
});
app.listen(PORT, () => { console.log(`server is running ${PORT}`); })


