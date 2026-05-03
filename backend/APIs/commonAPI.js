import exp from 'express'
import { userModel } from '../models/UserModel.js'
import {compare, hash} from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {config} from "dotenv"
import { verifyToken } from '../middlewares/verifyToken.js'
const {sign}=jwt
export const commonApp=exp.Router()
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryupload.js'
import cloudinary from "../config/cloudinary.js";
config()
// Route for register
commonApp.post("/users",upload.single("profileImageUrl"),async(req,res,next)=>{
    // let cloudinaryResult;
    try{
    // get user from req
    const newUser=req.body
    console.log(newUser)
    console.log(req.file)


    // check role
    const allowedUsers=["USER","AUTHOR"]
    if(!allowedUsers.includes(newUser.role)){
        return res.status(400).json({message:"Invalid role"})
    }
    // upload image to cloudinary from memory storage
    if (req.file) {
  const result = await uploadToCloudinary(req.file.buffer);
  newUser.profileImageUrl = result.secure_url;
}

    // hash password and replace hashed password with original
    newUser.password=await hash(newUser.password,12)
    // create new user document
    const newUserDoc=new userModel(newUser)
    // save document
    await newUserDoc.save()
    // send res
    res.status(201).json({message:"User created"})
}catch(err){
    console.log("err is ",err)
    // delete img from cloudinaryResult
   if (typeof cloudinaryResult !== "undefined" && cloudinaryResult?.public_id) {
  await cloudinary.uploader.destroy(cloudinaryResult.public_id)
}
    next(err)
}
})
// Route for login
commonApp.post("/login",async(req,res)=>{
    // console.log("REQ BODY:", req.body);
    // console.log("EMAIL:", email);
    // console.log("PASSWORD:", password);
    // get user cred obj
    const {email,password,id}=req.body
    // find user by email
    const user=await userModel.findOne({email:email})
    // if user not found
    if(!user){
        return res.status(401).json({message:"Invalid email"})
    }
    // compare password
    const isMatched=await compare(password,user.password)
    // if password not matched
    if(!isMatched){
        return res.status(401).json({message:"Invalid password"})
    }
    // token
    const signedToken=sign({id:user._id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"})
       res.cookie("Token", signedToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true
    })

    
    let userObj=user.toObject()
    delete userObj.password
    return res.status(200).json({message:"login successful",payload:userObj})
})


// Route for logout
commonApp.get("/logout",(req,res)=>{
    // delete token
    res.clearCookie("Token",{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"logout success"})
})

commonApp.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
    res.status(200).json({
        message:"authenticated",
        payload:req.user
    })
})


// change password
commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    // get body from req
    let {currentPassword,newPassword}=req.body
    const userId=req.user.id
    // check current password from client and password of user are not same
    const userDoc=await userModel.findById(userId)
    const passcompare=await compare(currentPassword,userDoc.password)
    if(!passcompare){
        return res.status(400).json({message:"Invalid password"})
    }
    // check current password and new password are same
    if(currentPassword===newPassword){
        return res.status(400).json({message:"current password and new password should not be same"})
    }
    // hash password
    newPassword=await hash(newPassword,12)

    // replace current password of user with hashed new password
    userDoc.password=newPassword
    // save
    userDoc.save()
    // send res
    return res.status(200).json({message:"password updated"})
})




