import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { articlemodel } from '../models/articleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
export const authorApp=exp.Router()

// write article (protected route)
authorApp.post(
  "/article",
  verifyToken("AUTHOR"),
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      // get article object
      const articleObj = req.body;
      // save uploaded thumbnail url
      articleObj.thumbnail = req.file?.path || "";
      let user = req.user;
      // check author
      let author = await userModel.findById(articleObj.author);
      if (!author) {
        return res.status(404).json({
          message: "Author not found"
        });
      }
      if (author.email != user.email) {
        return res.status(403).json({
          message: "You are not authorized"
        });
      }
      // create article document
      const articleDoc = new articlemodel(articleObj);
      await articleDoc.save();
      return res.status(201).json({
        message: "Article published",
        payload: articleDoc
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });
    }
  }
);
  
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
authorApp.put(
  "/articles",
  verifyToken("AUTHOR"),
  async (req, res) => {
    try {

      const authorIdOfToken = req.user?.id;

      const {
        articleId,
        title,
        category,
        content
      } = req.body;

      const updatedArticle = await articlemodel.findOneAndUpdate(
        {
          _id: articleId,
          author: authorIdOfToken
        },
        {
          $set: {
            title,
            category,
            content
          }
        },
        {
          new: true
        }
      );

      if (!updatedArticle) {
        return res.status(403).json({
          message: "You are not authorized to edit article"
        });
      }

      return res.status(200).json({
        message: "Article modified successfully",
        payload: updatedArticle
      });

    } catch (err) {

      console.log(err);

      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    }
  }
);
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




