import express from 'express';
import asyncHandler from 'express-async-handler';
import UserModal from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const userRoute = express.Router();
userRoute.get(
    "/",
    asyncHandler(async (req,res) => {
        const user = await UserModal.find({});
        res.json(user);
    })

);
userRoute.get(
    "/:id",
    asyncHandler(async (req,res) => {
        const user = await UserModal.findById(req.params.id);
        if(user){
            res.json(user);
        } else {
            res.status(404)
            throw new Error("Movie not Found");
        }
    })
);
userRoute.post(
    "/login",async (req,res) => {
        const { email, password } = req.body
        try {
            const oldUser = await UserModal.findOne({ email });
            if (!oldUser)
              return res.status(404).json({data:null, message: "User doesn't exist" });
        
            const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        
            if (!isPasswordCorrect)
              return res.status(400).json({ message: "Invalid credentials" });
        
            res.status(200).json({ data: oldUser });
          } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
          }
    }
);
userRoute.post(
    "/signUp",async (req,res) => {
        const { email, password,name,pin,isActive,isAdmin } = req.body
        try {
            const oldUser = await UserModal.findOne({ email });        
            if (oldUser) {
              return res.status(400).json({data:null, message: "User already exists" });            }
        
            const hashedPassword = await bcrypt.hash(password, 12);        
            const data = await UserModal.create({
              email,
              password: hashedPassword,
              name,pin,isActive,isAdmin
            });
             res.status(201).json({ data });
          } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
          }
    }
);
export default userRoute;