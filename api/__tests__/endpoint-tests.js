const User=require("../users/users-model")
const Tweet=require("../tweet/tweet-model")
const Comment=require("../comment/comment-model")
const request=require("supertest")
const server = require("../server")
const db=require("../../data/dbconfig")

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

const newUser={username:"booo",password:12345,mail:"foo@gmail"}


describe("------------ [POST] api/auth -------------",()=>{
    test("[1] kayıt oluyor mu?",async ()=>{
        const res=await request(server).post("/api/auth/register").send(newUser)
        expect(res.body).toMatch(/başarılı/)
    })
    test("[2] login oluyor mu?",async ()=>{
        const res=await request(server).get("/api/users")
        const users=await User.getUsers()
        expect(res.body).toHaveLength(users.length)
    })
})

test("[3] tüm kullanıcıları dönüyor",async ()=>{
    const res=await request(server).get("/api/users")
    const users=await User.getUsers()
    expect(res.body).toHaveLength(users.length)
})