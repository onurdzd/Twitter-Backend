const Comment=require("./comment-model")

const postCommentCheck=(req,res,next)=>{
    try {
        if(!req.body.comment){
            next({
                status:400,
                message:"Boş yorum atılamaz"
            })
        }else if(req.body.comment && req.body.comment.length >120){
            next({
                status:400,
                message:"120 karakterden fazla yorum atılamaz"
            })
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports={
    postCommentCheck 
}