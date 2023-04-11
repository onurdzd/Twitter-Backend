const db = require("../../data/dbconfig");
const Comment = require("../comment/comment-model");

const getAll = async () => {
  const tweets = await db("tweets as t");
  return tweets;
};

const getBy = (filter) => {
  return db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .select(
      "t.tweet_id",
      "t.tweet",
      "t.retweet",
      "t.like",
      "u.user_id",
      "u.username"
    )
    .where(filter);
};

const getById = async (tweet_id) => {
  const tweet = await db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .where("t.tweet_id", tweet_id);
  if (!tweet || tweet.length === 0) {
    return [];
  }

  let tweetSchema = {
    tweet_id: tweet[0].tweet_id,
    tweet: tweet[0].tweet,
    username: tweet[0].username,
    like: tweet[0].like,
    retweet: tweet[0].retweet,
    comment: [],
  };
  const comments = await Comment.getBy({ "t.tweet_id": tweet_id });

  tweetSchema.comment.push(comments);

  return tweetSchema;
};

const add = async (tweet) => {
  const newTweetId = await db("tweets").insert(tweet);
  const newTweet = await getBy({ tweet_id: newTweetId[0] });
  return newTweet;
};

const change = async (updateTweet, tweet_id) => {
  await db("tweets").where("tweet_id", id).update(updateTweet);
  const updatedTweet = await getBy({ tweet_id: tweet_id });
  return updatedTweet;
};

const addLike = async (tweetObj, id) => {
  await db("tweets")
    .where("tweet_id", id)
    .update({ tweet: tweetObj.tweet, like: tweetObj.like + 1 });
  const updatedTweet = await getBy({ tweet_id: id });
  return updatedTweet;
};

const addRetweet = async (tweetObj, id) => {
  await db("tweets")
    .where("tweet_id", id)
    .update({ tweet: tweetObj.tweet, retweet: tweetObj.retweet + 1 });
  const updatedTweet = await getBy({ tweet_id: id });
  return updatedTweet;
};

const remove = (id) => {
  return db("tweets").where("tweet_id", id).delete();
};

const getLike = async (tweet_id) => {
  const likes = await db("likes as l")
    .leftJoin("users as u", "u.user_id", "l.user_id")
    .leftJoin("tweets as t", "t.user_id", "u.user_id")
    .where("t.tweet_id", tweet_id)
    .select("l.like_id", "t.tweet_id", "t.tweet", "u.user_id", "u.username");

  const likeSchema = {
    likeDetails: likes,
    likeCount: likes.length,
  };
  return likeSchema;
};

const postLike = async (likeids) => {
 return db("likes").insert(likeids)
};

module.exports = {
  getAll,
  add,
  change,
  remove,
  getBy,
  addLike,
  addRetweet,
  getById,
  getLike,
  postLike
};
