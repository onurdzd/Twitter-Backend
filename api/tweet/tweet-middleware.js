const Tweet=require("./tweet-model")

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

const likeRestiriction=async(req,res,next)=>{
    try {
    const tweet=await Tweet.getBy({tweet_id:req.params.id})
    if(tweet[0].username===req.decodedJWT.username){
        next({
            status:400,
            message:"Kendi tweetine like atamazsın"
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
    const tweet=await Tweet.getBy({tweet_id:req.params.id})
    if(tweet[0].username===req.decodedJWT.username){
        next({
            status:400,
            message:"Kendi tweetini retweet edemezsin"
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
    postTweetIsUniqe,likeRestiriction,retweetRestriction
}