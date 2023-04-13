const router = require("express").Router();
const mw = require("./auth-middleware");
const Users = require("../users/users-model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

router.post("/register",mw.registerUsernameMailIsValid,mw.registerPostDataIsValid,async (req,res,next)=>{
    try {
        const hashedPassword=bcrypt.hashSync(req.body.password.trim(),10)
        const newUser=await Users.add({username:req.body.username.trim(), password:hashedPassword,mail:req.body.mail,role_id:req.body.role_id ? req.body.role_id : 2,account_type_id:req.body.account_type==="private" ? 2 : 1})
        res.status(201).json({message:`${newUser.username} Başarıyla kayıt oldun!`})
    } catch (error) {
        next(error)
    }
})

router.post("/login",mw.loginUsernameMailIsValid,mw.loginPostDataIsValid,async (req,res,next)=>{
    try {
        const user=await Users.getBy({"username":req.body.username.trim()})
        const isValidPassword=bcrypt.compareSync(req.body.password.trim(),user[0].password)

        if(user && isValidPassword){
            let token=jwt.sign({
                username:user[0].username,
                user_id:user[0].user_id,
                account_type_name:user[0].account_type_name,
                role_id:user[0].role_id,
                role_name:user[0].role_name,
                tweets:user[0].tweets,
                comments:user[0].comments,
                retweets:user[0].retweets,
                likes:user[0].likes,
                followers:user[0].followers,
                following:user[0].following
            },
            process.env.SECRET,
            { expiresIn: "3d" })
            res.status(200).json({message:`${user[0].username} başarıyla giriş yaptın!`,token:token})
        }else{
            res.status(400).json({message:"Username veya şifre yanlış"})
        }

    } catch (error) {
        next(error)
    }
})

router.put("/resetPassword/:id",mw.isValidToken,mw.idIsValid,mw.resetPasswordPayloadCheck, async(req,res,next)=>{
    try {
        const hashedPassword=bcrypt.hashSync(req.body.password,10) 
        const updatedUser=await Users.change({password:hashedPassword},req.params.id)
        res.status(200).json({message:`${updatedUser[0].username} şifren başarıyla değiştirildi`})
    } catch (error) {
        next(error)
    }
})

module.exports = router;
