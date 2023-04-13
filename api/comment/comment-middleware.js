const Comment=require("./comment-model")

const isCommentValid=async(req,res,next)=>{
    const comment=await Comment.getById(req.params.id)
    if(!comment){
        next({
            status:401,
            message:`${req.params.id} nolu yorum bulunmuyor`
        })
    }else{
        next()
    }
}

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
    postCommentCheck ,isCommentValid
}