const db = require("../../data/dbconfig");
const Comment = require("../comment/comment-model");

const getAll = async () => {
  const tweets = await db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .leftJoin("account_types as a", "a.account_type_id", "u.account_type_id")
    .select(
      "t.tweet_id",
      "t.tweet",
      "t.created_at",
      "u.user_id",
      "u.username",
      "a.account_type_name"
    );
  return tweets;
};

const getBy = (filter) => {
  return db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .leftJoin("account_types as a", "a.account_type_id", "u.account_type_id")
    .leftJoin("roles as r", "u.role_id", "r.role_id")
    .select(
      "t.tweet_id",
      "t.tweet",
      "t.created_at",
      "u.user_id",
      "u.username",
      "a.account_type_name"
    )
    .where(filter);
};

const getById = async (tweet_id) => {
  const tweet = await db("tweets as t")
    .leftJoin("users as u", "t.user_id", "u.user_id")
    .leftJoin("account_types as a", "a.account_type_id", "u.account_type_id")
    .leftJoin("roles as r", "u.role_id", "r.role_id")
    .where("t.tweet_id", tweet_id);
  if (!tweet || tweet.length === 0) {
    return [];
  }

  let tweetSchema = {
    tweet_id: tweet[0].tweet_id,
    tweet: tweet[0].tweet,
    created_at: tweet[0].created_at,
    user_id: tweet[0].user_id,
    username: tweet[0].username,
    account_type_name: tweet[0].account_type_name,
    comments: [],
    favorites: [],
    retweets: [],
    likes: [],
  };
  const comments = await Comment.getBy({ "t.tweet_id": tweet_id });
  const retweets = await getRetweet(tweet[0].tweet_id);
  const likes = await getLike(tweet[0].tweet_id);
  const favorites = await getFavorite(tweet[0].tweet_id);

  tweetSchema.comments.push(comments);
  tweetSchema.retweets.push(retweets);
  tweetSchema.likes.push(likes);
  tweetSchema.favorites.push(favorites);

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

const getLikes = async (user_id) => {
  const likes = await db("likes as l")
    .leftJoin("tweets as t", "t.tweet_id", "l.tweet_id")
    .leftJoin("users as u", "u.user_id", "l.user_id")
    .select(
      "l.like_id",
      "l.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
    .where("u.user_id", user_id);
  return likes;
};

const getLike = async (tweet_id) => {
  const likes = await db("likes as l")
    .leftJoin("tweets as t", "t.tweet_id", "l.tweet_id")
    .leftJoin("users as u", "u.user_id", "l.user_id")
    .select(
      "l.like_id",
      "l.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
    .where("l.tweet_id", tweet_id);

  const likeSchema = {
    likeDetails: likes,
    likeCount: likes.length,
  };
  return likeSchema;
};

const postLike = (likeids) => {
  return db("likes").insert(likeids);
};

const deleteLike = (likeids) => {
  return db("likes").delete(likeids);
};

const getRetweetsByUserId = async (user_id) => {
  const retweets = await db("retweets as r")
    .leftJoin("tweets as t", "t.tweet_id", "r.tweet_id")
    .leftJoin("users as u", "u.user_id", "r.user_id")
    .select(
      "r.retweet_id",
      "r.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
    .where("u.user_id", user_id);
  return retweets;
};

const getRetweet = async (tweet_id) => {
  const retweet = await db("retweets as r")
    .leftJoin("tweets as t", "t.tweet_id", "r.tweet_id")
    .leftJoin("users as u", "u.user_id", "r.user_id")
    .select(
      "r.retweet_id",
      "r.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
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

const deleteRetweet = (retweetids) => {
  return db("retweets").delete(retweetids);
};

const getFavorites = async (user_id) => {
  const favorites = await db("favorites as f")
    .leftJoin("tweets as t", "t.tweet_id", "f.tweet_id")
    .leftJoin("users as u", "u.user_id", "f.user_id")
    .select(
      "f.favorite_id",
      "f.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
    .where("u.user_id", user_id);
  return favorites;
};
const getFavorite = async (tweet_id) => {
  const favorite = await db("favorites as f")
    .leftJoin("tweets as t", "t.tweet_id", "f.tweet_id")
    .leftJoin("users as u", "u.user_id", "f.user_id")
    .select(
      "f.favorite_id",
      "f.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username"
    )
    .where("f.tweet_id", tweet_id);

  const favoriteSchema = {
    favoriteDetails: favorite,
    favoriteCount: favorite.length,
  };
  return favoriteSchema;
};

const postFavorite = (favoriteIds) => {
  return db("favorites").insert(favoriteIds);
};

const deleteFavorite = (favoriteIds) => {
  return db("favorites").delete(favoriteIds);
};

module.exports = {
  getAll,
  add,
  change,
  remove,
  getBy,
  getById,
  getLikes,
  getLike,
  postLike,
  deleteLike,
  getRetweetsByUserId,
  getRetweet,
  postRetweet,
  deleteRetweet,
  getFavorites,
  getFavorite,
  postFavorite,
  deleteFavorite,
};
