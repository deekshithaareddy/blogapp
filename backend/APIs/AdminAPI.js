import exp from 'express'
import {userModel} from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { articlemodel } from '../models/articleModel.js';

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

// Read all articles
adminApp.get("/articles",verifyToken("ADMIN"),async(req,res)=>{
  try {
    const articles = await articlemodel.find();
    res.status(200).json({ message: "Articles", payload: articles });
}catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
}
}
);


// toggle article status
adminApp.put("/articles/:id", verifyToken("ADMIN"), async(req,res)=>{
  try{
    const { isArticleActive } = req.body;

    const article = await articlemodel.findByIdAndUpdate(
      req.params.id,
      { isArticleActive },
      { new:true }
    );

    res.status(200).json({
      message:"Article status updated",
      payload:article
    });

  }catch(err){
    res.status(500).json({
      message:"Failed to update article"
    });
  }
});

// delete articles
adminApp.delete("/articles/:id", verifyToken("ADMIN"), async(req,res)=>{
  try{
    await articlemodel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message:"Article deleted"
    });

  }catch(err){
    res.status(500).json({
      message:"Failed to delete article"
    });
  }
});
