import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { articlemodel } from '../models/articleModel.js'
export const userApp=exp.Router()

// Read articles of all authors
userApp.get("/articles",verifyToken("USER"),async(req,res)=>{
    // read articles
    const articlesList=await articlemodel.find({isArticleActive:true})
    res.status(200).json({message:"Articles",payload:articlesList})
})

// add comment to an article
userApp.put("/articles",verifyToken("USER"),async(req,res)=>{
    // get body from req
    const {articleId,comment}=req.body
    // check article
    const articleDoc=await articlemodel.findOne({_id:articleId,isArticleActive:true}).populate("comments.user")
    console.log(articleDoc)
    // if article not found
    if(!articleDoc){
        return res.status(404).json({message:"Article not found"})
    }
    // if article found
    // get user ID
    const userId=req.user?.id
    // add comments to articleDoc
    articleDoc.comments.push({user:userId,comment:comment})
    // save
    await articleDoc.save()
    // send RES
    return res.status(200).json({message:"Comment added succesfully",payload:articleDoc})
})