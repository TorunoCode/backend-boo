import express from 'express';
import User from './models/userModel.js';
import users from './data/user.js';

const ImportData = express.Router();

ImportData.post("/user",async(req,res)=>{
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({importUser});
});
export default ImportData;