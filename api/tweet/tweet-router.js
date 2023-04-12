const router = require("express").Router();
const mwauth = require("../auth/auth-middleware");
const Tweet = require("./tweet-model");
const mwtweet = require("./tweet-middleware");

router.get("/",mwauth.adminYetkisi(1), async (req, res, next) => {
  try {
    const tweets = await Tweet.getAll();
    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
});

router.get("/:id",mwtweet.accountTypeCheck, async (req, res, next) => {
  try {
    const tweet = await Tweet.getById(req.params.id);
    if (tweet.tweet_id) {
      res.status(200).json(tweet);
    } else {
      next({
        status: 401,
        message: `${req.params.id} id li tweet henüz atılmamış`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  
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

router.delete("/:id",  async (req, res, next) => {
  try {
    const tweetUser = await Tweet.getBy({ tweet_id: req.params.id });
    if (req.decodedJWT.role_id === 1) {
      await Tweet.remove(req.params.id);
      res.status(200).json({ message: `${req.params.id} nolu tweet silindi` });
    } else if (req.decodedJWT.username === tweetUser[0].username) {
      await Tweet.remove(req.params.id);
      res.status(200).json({ message: `${req.params.id} nolu tweet silindi` });
    } else {
      next({
        status: 400,
        message: "Sana ait olmayan tweeti silemezsin!",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id/like",  async (req, res, next) => {
  try {
    const likedTweet = await Tweet.getLike(req.params.id);
    res.status(200).json(likedTweet);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/like",mwtweet.isTweetValid,
  mwtweet.likeRestirictions,
  async (req, res, next) => {
    try {
      const tweet = await Tweet.getById(req.params.id);
      if (tweet.tweet_id) {
        await Tweet.postLike({
          tweet_id: req.params.id,
          user_id: req.decodedJWT.user_id,
        });
        res.status(200).json(`${req.params.id} nolu tweeti beğendin!`);
      } else {
        next({
          status: 401,
          message: `${req.params.id} nolu tweet yoktur`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id/like",mwtweet.likeRemoveRestriction,async(req,res,next)=>{
  try {
    const tweet = await Tweet.getById(req.params.id);
    if (tweet.tweet_id) {
      await Tweet.deleteLike({
        tweet_id: req.params.id,
        user_id: req.decodedJWT.user_id,
      });
      res.status(200).json(`${req.params.id} nolu tweet beğenisini kaldırdın!`);
    } else {
      next({
        status: 401,
        message: `${req.params.id} nolu tweet yoktur`,
      });
    }
  } catch (error) {
    next(error);
  }
})

router.get("/:id/retweet",  async (req, res, next) => {
  try {
    const retweetedTweet = await Tweet.getRetweet(req.params.id);
    res.status(200).json(retweetedTweet);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/retweet",
  
  mwtweet.retweetRestriction,
  async (req, res, next) => {
    try {
      const tweet = await Tweet.getById(req.params.id);
      if (tweet.tweet_id) {
        await Tweet.postRetweet({
          tweet_id: req.params.id,
          user_id: req.decodedJWT.user_id,
        });
        res.status(200).json(`${req.params.id} nolu tweeti retweet ettin!`);
      } else {
        next({
          status: 401,
          message: `${req.params.id} nolu tweet yoktur`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id/retweet",mwtweet.retweetRemoveRestriction,async(req,res,next)=>{
  try {
    const tweet = await Tweet.getById(req.params.id);
    if (tweet.tweet_id) {
      await Tweet.deleteRetweet({
        tweet_id: req.params.id,
        user_id: req.decodedJWT.user_id,
      });
      res.status(200).json(`${req.params.id} nolu tweet retweet listenden kaldırıldı!`);
    } else {
      next({
        status: 401,
        message: `${req.params.id} nolu tweet yoktur`,
      });
    }
  } catch (error) {
    next(error);
  }
})

router.get("/:id/favorite",  async (req, res, next) => {
  try {
    const favoritedTweet = await Tweet.getFavorite(req.params.id);
    res.status(200).json(favoritedTweet);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/favorite",mwtweet.favoriteAddRestriction,
  async (req, res, next) => {
    try {
      const tweet = await Tweet.getById(req.params.id);
      if (tweet.tweet_id) {
        await Tweet.postFavorite({
          tweet_id: req.params.id,
          user_id: req.decodedJWT.user_id,
        });
        res.status(200).json(`${req.params.id} nolu tweeti favorilerine ekledin!`);
      } else {
        next({
          status: 401,
          message: `${req.params.id} nolu tweet yoktur`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id/favorite",mwtweet.favoriteRemoveRestriction,async(req,res,next)=>{
  try {
    const tweet = await Tweet.getById(req.params.id);
    if (tweet.tweet_id) {
      await Tweet.deleteFavorite({
        tweet_id: req.params.id,
        user_id: req.decodedJWT.user_id,
      });
      res.status(200).json(`${req.params.id} nolu tweeti favorilerinden sildin!`);
    } else {
      next({
        status: 401,
        message: `${req.params.id} nolu tweet yoktur`,
      });
    }
  } catch (error) {
    next(error);
  }
})




module.exports = router;
