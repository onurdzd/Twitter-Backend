const Comment=require("./comment-model")
const db=require("../../data/dbconfig")

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

let newComment={comment:"Test comment",user_id:"3",tweet_id:"2"}

describe("--------getAll-------",()=>{
    let comments;
    beforeEach(async ()=> {
        comments=await Comment.getAll()
    })
    test("[1] tüm yorumlar gösteriliyor",()=>{
        expect(comments).toHaveLength(7)
    })
})

describe("--------getById-------",()=>{
    let comment;
    beforeEach(async ()=> {
        comment=await Comment.getById(1)
    })
    test("[2] 1 nolu yorumun yorum id si gösteriliyor",()=>{
        expect(comment).toHaveProperty("comment_id",1)
    })
    test("[3] 1 nolu yorum gösteriliyor",()=>{
        expect(comment).toHaveProperty("comment",comment.comment)
    })
})

describe("--------getBy-------",()=>{
    let comment;
    beforeEach(async ()=> {
        comment=await Comment.getBy({"comment_id":1})
    })
    test("[4] 1 nolu yorum filtrelenebiliyor",()=>{
        expect(comment[0]).toHaveProperty("comment",comment[0].comment)
    })
})

describe("--------add-------",()=>{
    let comments;
    let comment;
    beforeEach(async ()=> {
        comments=await Comment.getAll()
        await Comment.add(newComment)
        comment=await Comment.getById(8)
    })
    test("[5] yeni yorum eklenebiliyor",()=>{
        expect(comments).toHaveLength(comments.length)
    })
    test("[6] yeni yorum düzgün ekleniyor",()=>{
        expect(comment).toHaveProperty("comment",comment.comment)
    })
})

describe("--------remove-------",()=>{
    let comments;
    let comment;
    let unDeletedComment;
    beforeEach(async ()=> {
        await Comment.add(newComment)
        await Comment.remove(8)
        comments=await Comment.getAll()
        comment=await Comment.getById(8)
        unDeletedComment=await Comment.getById(8)
    })
    test("[7] Kendi yorumunu silebiliyor",()=>{
        expect(comments).toHaveLength(7)
        expect(comment).toBeUndefined()
    })
    test("[8] olmayan yorum doğru dönüyor",()=>{
        expect(unDeletedComment).toBeUndefined()
    })
})