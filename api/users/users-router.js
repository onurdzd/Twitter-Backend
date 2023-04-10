const router=require("express").Router()
const Users = require("./users-model");

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.getUsers();
    res.status(201).json(users);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", async (req, res, next) => {
    try {
      const deletedUser=await Users.getBy({user_id:req.params.id})  
      await Users.remove(req.params.id);
      res.status(201).json({message:`${deletedUser.username} silindi`});
    } catch (error) {
      next(error)
    }
  });

module.exports=router