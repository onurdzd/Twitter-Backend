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
    const tweet = await Tweet.getBy({ tweet_id: req.params.id });
    res.status(200).json(tweet);
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
    const likedTweet = await Tweet.addLike(tweet, req.params.id);
    res.status(200).json(likedTweet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
