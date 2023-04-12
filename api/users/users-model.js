const db = require("../../data/dbconfig");
const Tweet = require("../tweet/tweet-model");
const Comment = require("../comment/comment-model");

const getUsers = () => {
  return db("users as u")
  .leftJoin("account_types as a","a.account_type_id","u.account_type_id")
};

const getBy = (filter) => {
  return db("users as u").leftJoin("account_types as a","a.account_type_id","u.account_type_id").where(filter);
};

const getById = async (user_id) => {
  const user = await db("users as u")
    .leftJoin("tweets as t", "t.user_id", "u.user_id")
    .leftJoin("comments as c", "c.tweet_id", "t.tweet_id")
    .leftJoin("account_types as a","a.account_type_id","u.account_type_id")
    .where("t.user_id", user_id)
    .first();

  if (!user || user.length === 0) {
    return [];
  }

  const userSchema = {
    user_id: user.user_id,
    username: user.username,
    account_type:user.account_type_name,
    tweets: [],
    followings:[],
    followers:[],
    comments: [],
    retweets:[],
    likes:[]
  };

  const tweets = await Tweet.getBy({ "t.user_id": user_id });
  const comments = await Comment.getBy({ "c.user_id": user_id });
  const retweets = await Tweet.getBy({ "t.user_id": user_id });
  const likes = await Tweet.getBy({ "t.user_id": user_id });
  userSchema.tweets.push(tweets);
  userSchema.comments.push(comments);
  userSchema.retweets.push(retweets);
  userSchema.likes.push(likes);

  return userSchema;
};

const add = async (user) => {
  const newUserId = await db("users").insert(user);
  const newUser = await getBy({ user_id: newUserId[0] });
  return newUser[0];
};

const change = async (updateInfos, id) => {
  await db("users").where("user_id", id).update(updateInfos);
  const updatedUser = await getBy({ user_id: id });
  return updatedUser;
};

const remove = (user_id) => {
  return db("users").where("user_id", user_id).delete();
};

module.exports = {
  getUsers,
  getBy,
  add,
  change,
  remove,
  getById,
};
