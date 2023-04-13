const User = require("./users-model");
const db = require("../../data/dbconfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

const newUser = {
  username: "booo",
  password: "12345",
  mail: "foo@gmail",
  role_id: "2",
  account_type_id: "1",
};

describe("--------getAll-------", () => {
  let users;
  beforeEach(async () => {
    users = await User.getAll();
  });
  test("[1] tüm userlar gösteriliyor", () => {
    expect(users).toHaveLength(4);
  });
});

describe("--------getById-------", () => {
  let user;
  beforeEach(async () => {
    user = await User.getById(1);
  });
  test("[2] 1 nolu userin user id si gösteriliyor", () => {
    expect(user).toHaveProperty("user_id", 1);
  });
  test("[3] 1 nolu user a ait username gösteriliyor", () => {
    expect(user).toHaveProperty("username", user.username);
  });
});

describe("--------getBy-------", () => {
  let user;
  beforeEach(async () => {
    user = await User.getBy({ user_id: 1 });
  });
  test("[4] 1 nolu user filtrelenebiliyor", () => {
    expect(user[0]).toHaveProperty("username", user[0].username);
  });
});

describe("--------add-------", () => {
  let users;
  let user;
  beforeEach(async () => {
    await User.add(newUser);
    users = await User.getAll();
    user = await User.getById(5);
  });
  test("[5] yeni user eklenebiliyor", () => {
    expect(users).toHaveLength(users.length);
  });
  test("[6] yeni user düzgün ekleniyor", () => {
    expect(user).toHaveProperty("username", user.username);
  });
});

describe("--------remove-------", () => {
  let users;
  let user;
  let unDeleteduser;
  beforeEach(async () => {
    await User.remove(4);
    users = await User.getAll();
    user = await User.getById(4);
    unDeleteduser = await User.getById(8);
  });
  test("[7] Admin user silebiliyor", () => {
    expect(users).toHaveLength(3);
    expect(user).toEqual([]);
  });
  test("[8] olmayan user doğru dönüyor", () => {
    expect(unDeleteduser).toEqual([]);
  });
});

describe("--------followings-------", () => {
  let followings;
  let newFollowings;
  let newFollowings2;
  beforeEach(async () => {
    followings = await User.getFollowingsByUser(1);
    await User.addFollowing({ following_user_id: 4, user_id: 1 });
    newFollowings = await User.getFollowingsByUser(1);
    await User.removeFollowing({ following_user_id: 4, user_id: 1 });
    newFollowings2 = await User.getFollowingsByUser(1);
  });
  test("[9] User1 in following sayısı doğru geliyor", () => {
    expect(followings).toHaveLength(2);
  });
  test("[10] User1 yeni kullanıcı takip edebiliyor", () => {
    expect(newFollowings).toHaveLength(3);
  });
  test("[11] User1 kullanıcyı takipten çıkabiliyor", () => {
    expect(newFollowings2).toHaveLength(2);
  });
});

describe("--------followers-------", () => {
  let followers;
  let newFollowers;
  beforeEach(async () => {
    followers = await User.getFollowersByUser(2);
    await User.removeFollowers({ follower_user_id: 4, user_id: 2 });
    newFollowers = await User.getFollowersByUser(2);
  });
  test("[9] User1 in follower sayısı doğru geliyor", () => {
    expect(followers).toHaveLength(1);
  });
  test("[11] User2 takipçisini silebiliyor", () => {
    expect(newFollowers).toHaveLength(1);
  });
});
