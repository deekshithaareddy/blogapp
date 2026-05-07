import exp from 'express'
import {UserModel} from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminApp=exp.Router()

//READ ALL USERS & AUTHORS (email)
adminApp.get("/users",verifyToken("ADMIN"),async(req,res)=>{
  //get all users and authors
    const users=await userModel.find({role:{$ne:"ADMIN"}});
    //check if users does not exist
    if(users.length===0){
        return res.status(404).json({message:"No users found"});
    }
    //send res
    res.status(200).json({message:"List",payload:users});
  
})

// BLOCK OR ACTIVATE USER OR AUTHOR
adminApp.put("/block",verifyToken("ADMIN"),async(req,res)=>{
    //get email and useractive
    const {email,isUserActive}=req.body
    //find user
    const user=await userModel.findOne({email:email,role:{$ne:"ADMIN"}});
    //if user doesn't exist
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    //if user found,update the status
    user.isUserActive=isUserActive;
    //save
    await user.save();
    //send res
    res.status(200).json({message:"Status Updated!",payload:user});
});
