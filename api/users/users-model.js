const db = require("../../data/dbconfig");

const getUsers = () => {
  return db("users");
};

const getBy = (filter) => {
  return db("users").where(filter).first();
};

const add = async (user) => {
  const newUserId =await db("users").insert(user);
  const newUser = await getBy({ user_id: newUserId[0] });
  return newUser;
};

const change = async (updateInfos, id) => {
  await db("users").where("user_id", id).update(updateInfos);
  const updatedUser = await getBy({ user_id: id });
  return updatedUser;
};

const remove = (id) => {
  return db("users").where("user_id",id).delete();
};

module.exports = {
  getUsers,
  getBy,
  add,
  change,
  remove,
};
