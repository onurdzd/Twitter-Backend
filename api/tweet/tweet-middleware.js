const Tweet=require("./tweet-model")

const accountTypeCheck=async(req,res,next)=>{
    try {
        const user=await Tweet.getById(req.params.id)
        if(user.account_type_name==="public"){
            next()
        }else{
            if(req.decodedJWT.username===user.username || req.decodedJWT.role_name==="admin"){
                next()
            }else{
                next({
                    status:400,
                    message:"Account private sadece admin veya hesap sahibi görebilir"
                })
            }
        }
    } catch (error) {
        
    }
}

const isTweetValid=async (req,res,next)=>{
    try {
        const tweet=await Tweet.getById(req.params.id)
        if(!tweet.tweet_id){
            next({
                status: 401,
                message: `${req.params.id} nolu tweet yoktur`,
              });
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
}

const postTweetCheck=(req,res,next)=>{
    try {
        if(!req.body.tweet){
            next({
                status:400,
                message:"Boş tweet atılamaz"
            })
        }else if(req.body.tweet && req.body.tweet.length >120){
            next({
                status:400,
                message:"120 karakterden fazla tweet atılamaz"
            })
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
}

const postTweetIsUniqe=async(req,res,next)=>{
try {
    const tweet=await Tweet.getBy({tweet:req.body.tweet})
    const username=await Tweet.getBy({username:req.decodedJWT.username})
    if(username[0] && tweet[0]){
        next({status:400,message:"Aynı tweet i daha önce atmışsın"})
    }else{
        next()
    }
} catch (error) {
    next(error)
}
}

const likeRestirictions=async(req,res,next)=>{
    try {
    const tweet=await Tweet.getById(req.params.id)
    if(tweet.username===req.decodedJWT.username){
        next({
            status:400,
            message:"Kendi tweetine like atamazsın"
        })
    }else if(tweet.likes[0].likeDetails.some(item=> item.user_id == req.decodedJWT.user_id)){
        next({
            status:400,
            message:"Tweet zaten beğeni listende bulunuyor"
        })
    }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

const likeRemoveRestriction=async(req,res,next)=>{
    try {
    const like=await Tweet.getLike(req.params.id)
    if(like.likeDetails.every(item=>item.user_id !== req.decodedJWT.user_id)){
        next({
            status:400,
            message:"Beğendiğin bir tweet değil"
        }) 
    }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

const retweetRestriction=async(req,res,next)=>{
    try {
        const tweet=await Tweet.getById(req.params.id)
        if(tweet.retweets[0].retweetDetails.some(item=> item.user_id == req.decodedJWT.user_id)){
            next({
                status:400,
                message:"Tweet i zaten retweet etmişsin"
            })
        }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

const retweetRemoveRestriction=async(req,res,next)=>{
    try {
        const retweet=await Tweet.getRetweet(req.params.id)
        if(retweet.retweetDetails.every(item=>item.user_id !== req.decodedJWT.user_id)){
        next({
            status:400,
            message:"Retweet ettiğin bir tweet değil"
        }) 
    }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

const favoriteAddRestriction=async(req,res,next)=>{
    try {
    const tweet=await Tweet.getById(req.params.id)
    if(tweet.favorites[0].favoriteDetails.some(item=> item.user_id == req.decodedJWT.user_id)){
        next({
            status:400,
            message:"Tweet zaten favori listende bulunuyor"
        })
    }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

const favoriteRemoveRestriction=async(req,res,next)=>{
    try {
        const tweet=await Tweet.getById(req.params.id)
        if(tweet.favorites[0].favoriteDetails.every(item=> item.user_id !== req.decodedJWT.user_id)){
        next({
            status:400,
            message:"Favori listen boş"
        }) 
    }else{
        next()
    }
    } catch (error) {
        next(error)
    }
}

module.exports={
    postTweetCheck,
    postTweetIsUniqe,isTweetValid,likeRestirictions,likeRemoveRestriction,retweetRestriction,retweetRemoveRestriction,accountTypeCheck,favoriteAddRestriction,favoriteRemoveRestriction
}