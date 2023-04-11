const db = require("../../data/dbconfig");
const Comment = require("../comment/comment-model");

const getAll = async () => {
  const tweets = await db("tweets as t");
  return tweets;
};

const getBy = (filter) => {
  return db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .select("t.tweet_id", "t.tweet", "u.user_id", "u.username")
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

const remove = (tweet_id) => {
  return db("tweets").where("tweet_id", tweet_id).delete();
};

const getLike = async (tweet_id) => {
  const likes = await db("likes as r")
  .leftJoin("tweets as t", "t.tweet_id", "r.tweet_id")
  .leftJoin("users as u", "u.user_id", "r.user_id")
  .select("r.like_id", "t.tweet_id", "t.tweet", "u.user_id", "u.username")
  .where("r.tweet_id", tweet_id);

  const likeSchema = {
    likeDetails: likes,
    likeCount: likes.length,
  };
  return likeSchema;
};

const postLike = async (likeids) => {
  return db("likes").insert(likeids);
};

const getRetweet = async (tweet_id) => {
  const retweet = await db("retweets as r")
    .leftJoin("tweets as t", "t.tweet_id", "r.tweet_id")
    .leftJoin("users as u", "u.user_id", "r.user_id")
    .select("r.retweet_id", "t.tweet_id", "t.tweet", "u.user_id", "u.username")
    .where("r.tweet_id", tweet_id);

  const retweetSchema = {
    retweetDetails: retweet,
    retweetCount: retweet.length,
  };
  return retweetSchema;
};

const postRetweet = async (retweetIds) => {
  return db("retweets").insert(retweetIds);
};

module.exports = {
  getAll,
  add,
  change,
  remove,
  getBy,
  getById,
  getLike,
  postLike,
  getRetweet,
  postRetweet,
};
