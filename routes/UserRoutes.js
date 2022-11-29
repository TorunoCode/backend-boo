import express from 'express';
import asyncHandler from 'express-async-handler';
import UserModal from '../models/userModel.js';
import billModel from '../models/billsModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const isAuth = (req,res, next)=>{
  console.log(req.session.isAuth);
  if(req.session.isAuth){
      next();
  }else{
    return res.status(404).json({data:null, message: "Action doesn't exist" });
  }
}
const isAdmin = (req,res, next)=>{
  if(req.session.isAdmin){
      next();
  }else{
    return res.status(404).json({data:null, message: "Action doesn't exist" });
  }
}
const userRoute = express.Router();
userRoute.get(
    "/",
    asyncHandler(async (req,res) => {
      console.log(req.session.isAuth);
      var listItem = [];
        const user = await UserModal.find({});
        for (let a of user) {
          const totalOrder = await billModel.find({idCustomer:a._id.toString()}).count();
          const totalSpending = await billModel.aggregate([{$match:{idCustomer:a._id.toString()}},{$group: {_id: null, sum: {$sum:"$totalMoney"}}}]);
          listItem.push({
            id: a._id.toString(),
            fullName: a.fullName,
            email: a.email,
            biography: a.biography,
            totalOrder: totalOrder,
            totalSpending:totalSpending==[]? 0:totalSpending,
            isActive: a.isActive,
            isAdmin: a.isAdmin
          })
        }
        res.json(listItem);
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
  "/update",async (req,res) => {
      try {
        const data = await UserModal.findOneAndUpdate({_id:req.body._id},req.body,{new:true});
        console.log(data);
        if(data)         
           res.status(201).json({ data });
           else
           return res.status(404).json({data:null, message: "User doesn't exist" });
        } catch (error) {
          res.status(500).json({ message: "Something went wrong" });
          console.log(error);
        }
  }
);
userRoute.post(
    "/login",async (req,res) => {
        const { email, password } = req.body
        try {
            const oldUser = await UserModal.findOne({ email });
            if (!oldUser)
              return res.status(404).json({data:null, message: "User doesn't exist" });
              if (!oldUser.status)
              return res.status(404).json({data:null, message: "User is still block" });
            const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        
            if (!isPasswordCorrect)        
             { return res.status(400).json({ message: "Wrong password!" });}
            //  const accessToken = jwt.sign(oldUser,process.env.ACCESS_TOKEN_SECRET)
              if(oldUser.isAdmin){ req.session.isAdmin = true;}
             req.session.isAuth = true;
            // res.status(200).json({ data: oldUser ,accessToken:accessToken});
            res.status(200).json({ data: oldUser });
          } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
          }
    }
);
function authenticateToken(req,res,next) {
  const authHeader = req.header['authorization']
  const token = authHeader && authHeader.split(' ')[1]
   if(token ==null) return res.sendStatus(401)
   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
    if(err) return res.sendStatus(404);
    req.user = user;
    next();
   })
}
userRoute.get("/logout",(req,res)=>{
  req.session.destroy((err)=>{
      if(err) throw err;
      res.redirect('/Users');
  });
});
userRoute.post(
    "/signUp",async (req,res) => {
      console.log(req.session.isAuth);

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
userRoute.get('/delete/:id', async(req,res)=>{
  try{
    console.log(req.params.id);
      const user = await UserModal.findByIdAndDelete(req.params.id);
      console.log(user);
      if(!user)  return res.status(400).json({data:null, message: "No item found" }); 
      else
     return res.status(201).json({ user });
  }
  catch(error)
  {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});
export default userRoute;
