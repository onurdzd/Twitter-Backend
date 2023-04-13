const router = require("express").Router();
const mwuser = require("../auth/auth-middleware");
const Comment = require("./comment-model");
const mwcomment = require("./comment-middleware");

router.get("/", mwuser.adminYetkisi(1), async (req, res, next) => {
  try {
    const comments = await Comment.getAll();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/:id",mwcomment.isCommentValid, async (req, res, next) => {
  try {
      res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/tweet/:id",
  mwcomment.postCommentCheck,
  async (req, res, next) => {
    try {
      const newComment = await Comment.add({
        comment: req.body.comment,
        user_id: req.decodedJWT.user_id,
        tweet_id: req.params.id,
      });
      res.status(200).json(newComment);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id",mwcomment.isCommentValid, async (req, res, next) => {
  try {
    const commentUser = await Comment.getBy({ comment_id: req.params.id });
    if (req.decodedJWT.role_id === 1) {
      await Comment.remove(req.params.id);
      res.status(200).json({ message: `${req.params.id} nolu yorum silindi` });
    } else if (req.decodedJWT.username === commentUser[0].username) {
      await Comment.remove(req.params.id);
      res.status(200).json({ message: `${req.params.id} nolu yorum silindi` });
    } else {
      next({
        status: 400,
        message: "Sana ait olmayan yorumu silemezsin!",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
