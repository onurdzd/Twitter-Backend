const db = require("../../data/dbconfig");
const Tweet = require("../tweet/tweet-model");
const Comment = require("../comment/comment-model");

const getUsers = () => {
  return db("users as u").leftJoin(
    "account_types as a",
    "a.account_type_id",
    "u.account_type_id"
  );
};

const getBy = (filter) => {
  return db("users as u")
    .leftJoin("account_types as a", "a.account_type_id", "u.account_type_id")
    .where(filter);
};

const getById = async (user_id) => {
  const user = await db("users as u")
    .leftJoin("account_types as a", "a.account_type_id", "u.account_type_id")
    .where("u.user_id", user_id)
    .first();

  if (!user || user.length === 0) {
    return [];
  }

  const userSchema = {
    user_id: user.user_id,
    username: user.username,
    account_type: user.account_type_name,
    tweets: [],
    followings: [],
    followers: [],
    favorites: [],
    comments: [],
    retweets: [],
    likes: [],
  };

  const tweets = await Tweet.getBy({ "t.user_id": user_id });
  const comments = await Comment.getBy({ "c.user_id": user_id });
  const retweets = await Tweet.getRetweets(user_id);
  const likes = await Tweet.getLikes(user_id);
  const favorites = await Tweet.getFavorites(user_id);
  const followings = await getFollowingsByUser(user_id);
  const followers = await getFollowersByUser(user_id);

  userSchema.tweets.push(tweets);
  userSchema.comments.push(comments);
  userSchema.retweets.push(retweets);
  userSchema.likes.push(likes);
  userSchema.favorites.push(favorites);
  userSchema.followings.push(followings);
  userSchema.followers.push(followers);

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

const getFollowersByUser = async (user_id) => {
  const followers = await db("followers as fr").where("fr.user_id", user_id);
  return followers;
};

const getFollowingsByUser = async (user_id) => {
  const followings = await db("followings as fg").where("fg.user_id", user_id);
  return followings;
};

module.exports = {
  getUsers,
  getBy,
  add,
  change,
  remove,
  getById,
  getFollowersByUser,
  getFollowingsByUser,
};
