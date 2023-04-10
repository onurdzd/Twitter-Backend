const express=require("express")
require('dotenv').config()

const server=express()

const mw=require("./auth/auth-middleware")
const usersRouter=require("./users//users-router")
const authRouter=require("./auth/auth-router")
const tweetRouter=require("./tweet/tweet-router")
const commentRouter=require("./comment/comment-router")

server.use(express.json())

server.use("/api/users",mw.isValidToken,usersRouter)
server.use("/api/auth",authRouter)
server.use("/api/tweet",tweetRouter)
server.use("/api/comment",commentRouter)

server.use((err, req, res, next) => { 
    res.status(err.status || 500).json({
      message: err.message,
    });
  });

module.exports=server