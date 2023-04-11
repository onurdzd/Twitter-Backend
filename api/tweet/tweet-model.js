const db = require("../../data/dbconfig");

const getAll = async () => {
  const tweets = await db("tweets as t")
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
    .where(filter)
    .first();
};

const add = async (tweet) => {
  const newTweetId = await db("tweets").insert(tweet);
  const newTweet = await getBy({ tweet_id: newTweetId[0] });
  return newTweet;
};

const change = async (updateTweet, id) => {
  await db("tweets").where("tweet_id", id).update(updateTweet);
  const updatedTweet = await getBy({ tweet_id: id });
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

module.exports = {
  getAll,
  add,
  change,
  remove,
  getBy,
  addLike,
  addRetweet,
};
