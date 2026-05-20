import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { articlemodel } from '../models/articleModel.js'

export const userApp = exp.Router()

// Read articles of all authors
userApp.get("/articles", async (req, res) => {
  const articlesList = await articlemodel
    .find({ isArticleActive: true })
    .populate("author", "firstName email _id")

  res.status(200).json({
    message: "Articles",
    payload: articlesList
  })
})

// Read single article by id
userApp.get("/article/:id", async (req, res) => {
  const article = await articlemodel
    .findById(req.params.id)
    .populate("author", "firstName email _id")
    .populate("comments.user", "firstName email")

  if (!article) {
    return res.status(404).json({ message: "Article not found" })
  }

  res.status(200).json({
    message: "Article",
    payload: article
  })
})

// add comment to an article
userApp.put("/articles", verifyToken("USER"), async (req, res) => {
  const { articleId, comment } = req.body

  const articleDoc = await articlemodel
    .findOne({ _id: articleId, isArticleActive: true })
    .populate("comments.user", "firstName email")

  if (!articleDoc) {
    return res.status(404).json({ message: "Article not found" })
  }

  const userId = req.user?.id

  articleDoc.comments.push({
    user: userId,
    comment: comment
  })

  await articleDoc.save()

  const updatedArticle = await articlemodel
    .findById(articleId)
    .populate("author", "firstName email _id")
    .populate("comments.user", "firstName email")

  return res.status(200).json({
    message: "Comment added succesfully",
    payload: updatedArticle
  })
})


userApp.put(
  "/like/:articleId",
  verifyToken("USER"),
  async (req, res) => {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;
      const articleDoc = await articlemodel.findById(articleId);
      if (!articleDoc) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // remove dislike if already disliked
      articleDoc.dislikes = articleDoc.dislikes.filter(
        (id) => id.toString() !== userId
      );

      // check already liked
      const alreadyLiked = articleDoc.likes.some(
        (id) => id.toString() === userId
      );

      // toggle like
      if (alreadyLiked) {
        articleDoc.likes = articleDoc.likes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        articleDoc.likes.push(userId);
      }
      await articleDoc.save();

      const updatedArticle = await articlemodel
        .findById(articleId)
        .populate("author", "firstName email _id")
        .populate("comments.user", "firstName email");

      return res.status(200).json({
        message: "Like updated",
        payload: updatedArticle,
      });
    } catch (err) {

      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
);

userApp.put(
  "/dislike/:articleId",
  verifyToken("USER"),
  async (req, res) => {

    try {

      const { articleId } = req.params;

      const userId = req.user?.id;

      const articleDoc = await articlemodel.findById(articleId);

      if (!articleDoc) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // remove like if already liked
      articleDoc.likes = articleDoc.likes.filter(
        (id) => id.toString() !== userId
      );

      // check already disliked
      const alreadyDisliked = articleDoc.dislikes.some(
        (id) => id.toString() === userId
      );

      // toggle dislike
      if (alreadyDisliked) {

        articleDoc.dislikes = articleDoc.dislikes.filter(
          (id) => id.toString() !== userId
        );

      } else {

        articleDoc.dislikes.push(userId);

      }

      await articleDoc.save();

      const updatedArticle = await articlemodel
        .findById(articleId)
        .populate("author", "firstName email _id")
        .populate("comments.user", "firstName email");

      return res.status(200).json({
        message: "Dislike updated",
        payload: updatedArticle,
      });

    } catch (err) {

      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });

    }
  }
);
