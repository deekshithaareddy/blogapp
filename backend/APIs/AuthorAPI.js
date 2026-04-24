import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { articlemodel } from '../models/articleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const authorApp=exp.Router()

// write article (protected route)
authorApp.post("/article",verifyToken("AUTHOR"),async(req,res)=>{
    // get articleObj from client
    const articleObj=req.body
    let user=req.useer
    // check author
    let author=await userModel.findById(articleObj.author)
    if(!author){
    return res.status(404).json({message:"Author not found"})
    }
    if(author.email!=user.email){
        return res.status(403).json({message:"You are not authorized"})
    }

    // if(author.role!="AUTHOR"){
    //     return res.status(403).json({message:"Only author can publish"})
    // }

    // create article Document
    const articleDoc=new articlemodel(articleObj)
    await articleDoc.save()
    return res.status(201).json({message:"article published"})
})  
// read own articles
authorApp.get("/articles",verifyToken("AUTHOR"),async(req,res)=>{
//   get email from decoded token
    const authorIdOfToken=req.user?.id
    const articlesList=await articlemodel.find({author:authorIdOfToken})
    if(!articlesList){
        return res.status(404).json({message:"No articles found"})
    }
    return res.status(200).json({message:"Articles:",payload:articlesList})
})

// edit articles
authorApp.put("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    // get author id from req
    const authorIdOfToken=req.user?.id
    // get article id from the req
    const {articleId,title,category,content}=req.body
    const updatedArticle=await articlemodel.findOneAndUpdate(
        {_id:articleId,author:authorIdOfToken},
        {$set:{title,category,content}},
        {new:true}
    )
if(!updatedArticle){
    return res.status(403).json({message:"You are not authorized to edit article"})
}
await updatedArticle.save()
return res.status(200).json({message:"Article modified succesfully",payload:updatedArticle})
    })

//Delete article(soft delete)
authorApp.patch("/articles", verifyToken("AUTHOR"), async (req, res) => {
  //get author id from decoded token
  const authorIdOfToken = req.user?.id;
  //get modified article from client
  const{articleId,isArticleActive } = req.body;
  //get article by id
  const articleOfDB = await articlemodel.findOne({ _id: articleId, author: authorIdOfToken });
  //check status
  if (isArticleActive === articleOfDB.isArticleActive) {
    return res.status(200).json({ message: "Article already in the same state" });
  }

  articleOfDB.isArticleActive = isArticleActive;
  await articleOfDB.save();
  //SEND RES
  res.status(200).json({ message: "Article modified", payload: articleOfDB });
});




