import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/posts.js'
const app = express();
app.use('/posts',postRoutes);
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

const CONNECTION_URL = 'mongodb+srv://lam:12341234@cluster0.vfbx2bf.mongodb.net/Mydata?retryWrites=true&w=majority'
const PORT = process.env.PORT || 3000;
mongoose.connect(CONNECTION_URL,{useUnifiedTopology:true,useNewUrlParser:true});

app.listen(PORT,()=>{console.log(`server is running ${PORT}`);})