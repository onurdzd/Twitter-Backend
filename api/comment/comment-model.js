const db = require("../../data/dbconfig");

const getAll = () => {
  return db("comments");
};

const getById = async (comment_id) => {
  const comment = db("comments as c")
    .leftJoin("tweets as t", "t.tweet_id", "c.tweet_id")
    .leftJoin("users as u", "u.user_id", "c.user_id")
    .where("comment_id", comment_id)
    .select(
      "c.comment_id",
      "c.comment",
      "c.created_at",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username",
      "u.role_id"
    )
    .first();

  return comment;
};

const getBy = (filter) => {
  return db("comments as c")
    .leftJoin("tweets as t", "t.tweet_id", "c.tweet_id")
    .leftJoin("users as u", "u.user_id", "c.user_id")
    .select(
      "c.comment_id",
      "c.created_at",
      "c.comment",
      "t.tweet_id",
      "t.tweet",
      "u.user_id",
      "u.username",
      "u.role_id"
    )
    .where(filter)
};

const add = async (comment) => {
  const newCommentId = await db("comments").insert(comment);
  const newComment = await getBy({ comment_id: newCommentId[0] });
  return newComment;
};

const change = async (updateComment, comment_id) => {
  await db("comments").where("comment_id", comment_id).update(updateComment);
  const updatedComment = await getBy({ comment_id: comment_id });
  return updatedComment;
};

const remove = (id) => {
  return db("comments").where("comment_id", id).delete();
};

module.exports = {
  getAll,
  add,
  change,
  remove,
  getBy,
  getById,
};
