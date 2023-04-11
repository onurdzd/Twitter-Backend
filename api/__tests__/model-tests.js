const User=require("../users/users-model")
const Tweet=require("../tweet/tweet-model")
const Comment=require("../comment/comment-model")
const request=require("supertest")
const db=require("../../data/dbconfig")

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

test("environment ayarı testing olarak ayarlandı",()=>{
    expect(process.env.NODE_ENV).toBe("testing")
})