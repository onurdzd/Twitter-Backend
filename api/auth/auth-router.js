const router = require("express").Router();
const mw = require("./auth-middleware");
const Users = require("../users/users-model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

router.post("/register",mw.registerPostDataIsValid,mw.registerUsernameMailIsValid,async (req,res,next)=>{
    try {
        const hashedPassword=bcrypt.hashSync(req.body.password,10)
        const newUser=await Users.add({username:req.body.username, password:hashedPassword,mail:req.body.mail,role_id:req.body.role_id ? req.body.role_id : 2})
        res.status(201).json({message:`${newUser.username} Başarıyla kayıt oldun!`})
    } catch (error) {
        next(error)
    }
})

router.post("/login",mw.loginPostDataIsValid,mw.loginUsernameMailIsValid,async (req,res,next)=>{
    try {
        const user=await Users.getBy({"username":req.body.username})
        const isValidPassword=bcrypt.compareSync(req.body.password,user.password)

        if(user && isValidPassword){
            let token=jwt.sign({
                username:user.username,
                user_id:user.user_id,
                role_id:user.role_id
            },
            process.env.SECRET,
            { expiresIn: "3d" })
            res.status(200).json({message:`${user.username} başarıyla giriş yaptın!`,token:token})
        }else{
            res.status(400).json({message:"Username veya şifre yanlış"})
        }

    } catch (error) {
        next(error)
    }
})

router.put("/resetPassword/:id",mw.isValidToken,async(req,res,next)=>{
    try {
        const hashedPassword=bcrypt.hashSync(req.body.password,10) 
        const updatedUser=await Users.change({password:hashedPassword},req.params.id)
        res.status(200).json({message:`${updatedUser.username} şifren başarıyla değiştirildi`})
    } catch (error) {
        next(error)
    }
})

module.exports = router;
