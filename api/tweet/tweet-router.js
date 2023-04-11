const router = require("express").Router();
const mwuser = require("../auth/auth-middleware");
const Tweet = require("./tweet-model");
const mwtweet = require("./tweet-middleware");

router.get("/", async (req, res, next) => {
  try {
    const tweets = await Tweet.getAll();
    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const tweet = await Tweet.getById(req.params.id);
    if(tweet.tweet_id){
      res.status(200).json(tweet);
    }else{
      next({
        status:401,
        message:`${req.params.id} id li tweet henüz atılmamış`
      })
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  mwuser.isValidToken,
  mwtweet.postTweetCheck,
  mwtweet.postTweetIsUniqe,
  async (req, res, next) => {
    try {
      const newTweet = await Tweet.add({
        tweet: req.body.tweet,
        user_id: req.decodedJWT.user_id,
      });
      res.status(200).json(newTweet);
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:id/like",mwuser.isValidToken,mwtweet.addLikeRestriction, async (req, res, next) => {
  try {
    const tweet = await Tweet.getBy({ tweet_id: req.params.id });
    const likedTweet = await Tweet.addLike(tweet[0], req.params.id);
    res.status(200).json(likedTweet);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/retweet",mwuser.isValidToken,mwtweet.addRetweetRestriction, async (req, res, next) => {
    try {
      const tweet = await Tweet.getBy({ tweet_id: req.params.id });
      const likedTweet = await Tweet.addRetweet(tweet[0], req.params.id);
      res.status(200).json(likedTweet);
    } catch (error) {
      next(error);
    }
  });

 router.delete("/:id",mwuser.isValidToken,async(req,res,next)=>{
    try {
        const tweetUser=await Tweet.getBy({tweet_id:req.params.id})
        if(req.decodedJWT.role_id === 1){
          await Tweet.remove(req.params.id)
            res.status(200).json({message:`${req.params.id} nolu tweet silindi`})
        }else if(req.decodedJWT.username === tweetUser[0].username){
            await Tweet.remove(req.params.id)
            res.status(200).json({message:`${req.params.id} nolu tweet silindi`})
        }else{
            next({
                status:400,
                message:"Sana ait olmayan tweeti silemezsin!"
            })
        }
    } catch (error) {
        next(error)
    }
 }) 

module.exports = router;
