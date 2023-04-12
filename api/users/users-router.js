const router = require("express").Router();
const Users = require("./users-model");
const mw = require("../auth/auth-middleware");

router.get("/", mw.adminYetkisi(1), async (req, res, next) => {
  try {
    const users = await Users.getUsers();
    res.status(201).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await Users.getById(req.params.id);
    if (user.user_id) {
      res.status(201).json(user);
    } else {
      next({
        status: 404,
        message: `${req.params.id} id nolu kullanıcı bulunmuyor`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", mw.adminYetkisi(1), async (req, res, next) => {
  try {
    const deletedUser = await Users.getBy({ user_id: req.params.id });
    await Users.remove(req.params.id);
    res.status(201).json({ message: `${deletedUser[0].username} silindi` });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/followings",mw.isValidToken, async (req, res, next) => {
  try {
    const followings = await Users.getFollowingsByUser(req.params.id);
    const user = await Users.getById(req.params.id);
    if (user.length === 0) {
      next({
        status: 404,
        message: `${req.params.id} id nolu kullanıcı bulunmuyor`,
      });
    } else if (followings && followings.length === 0) {
      res.status(201).json({ message: "Henüz takip ettiğin hesap bulunmuyor" });
    } else {
      res.status(201).json(followings);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id/followers",mw.isValidToken, async (req, res, next) => {
  try {
    const followers = await Users.getFollowersByUser(req.params.id);
    const user = await Users.getById(req.params.id);
    if (user.length === 0) {
      next({
        status: 404,
        message: `${req.params.id} id nolu kullanıcı bulunmuyor`,
      });
    } else if (followers && followers.length === 0) {
      res.status(201).json({ message: "Henüz takipçisi bulunmuyor" });
    } else {
      res.status(201).json(followers);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/follow",(req,res,next)=>{
try {
  
} catch (error) {
  
}
})

module.exports = router;
