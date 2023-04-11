const router=require("express").Router()
const Users = require("./users-model");
const mw=require("../auth/auth-middleware")

router.get("/",mw.adminYetkisi(1) ,async (req, res, next) => {
  try {
    const users = await Users.getUsers();
    res.status(201).json(users);
  } catch (error) {
    next(error)
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await Users.getBy({user_id:req.params.id});
    if(user){
      res.status(201).json(user);
    }else{
      next({
        status:404,
        message:`${req.params.id} id nolu kullanıcı bulunmuyor`
      })
    }
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