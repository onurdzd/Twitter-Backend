const router=require("express").Router()
const mwuser = require("../auth/auth-middleware");
const Comment = require("./comment-model");
const mwcomment= require("./comment-middleware");

router.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.getAll();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});


module.exports=router