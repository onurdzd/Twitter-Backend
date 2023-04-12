const User=require("./users-model")

const followRestriction=async(req,res,next)=>{
    try {
        const user=await User.getById(req.decodedJWT.user_id)
        if(req.decodedJWT.user_id==req.params.id){
            next({
                status:400,
                message:"Kendini takip edemezsin!"
            })
        }else if(user.followings[0].some(item=>item.following_user_id == req.params.id)){
            next({
                status:400,
                message:"Kullancıyı zaten takip ediyorsun,2. kez takip edemezsin!"
            })
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
}

const unfollowRestriction=async(req,res,next)=>{
    try {
        const user=await User.getById(req.decodedJWT.user_id)
      if(!user.followings[0].some(item=>item.following_user_id == req.params.id)){
            next({
                status:400,
                message:"Kullancıyı zaten takip etmiyorsun!"
            })
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
  followRestriction,
  unfollowRestriction
};