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

const newUser={username:"booo",password:"12345",mail:"foo@gmail"}
const loginInfo={username:"booo",password:"12345"}
const adminUser={username:"onur",password:"12345"}
const adminLogin={username:"onur",password:"12345"}
const newTweet={tweet:"foo"}

describe("------------ [POST] api/auth -------------",()=>{
    test("[1] kayıt oluyor mu?",async ()=>{
        const res=await request(server).post("/api/auth/register").send(newUser)
        expect(res.body.message).toMatch(/Başarıyla kayıt oldun/)
    })
    test("[2] login oluyor mu?",async ()=>{
        await request(server).post("/api/auth/register").send(newUser)
        const res=await request(server).post("/api/auth/login").send(loginInfo)
        expect(res.body.message).toMatch(/başarıyla giriş yaptın/)
        expect(res.body.token).toBeDefined()
    })
})

describe("------------ [GET] api/users -------------",()=>{
    test("[3] tüm kullanıcıları sadece admin görebiliyor",async ()=>{
        await request(server).post("/api/auth/register").send(newUser)
        const logres=await request(server).post("/api/auth/login").send(loginInfo)
        const res=await request(server).get("/api/users").set({"authorization":logres.body.token})
        expect(res.body.message).toMatch(/Sadece adminler görebilir/)
    })
    test("[4] admin tüm kullanıcıları görebiliyor",async ()=>{
        await request(server).post("/api/auth/register").send(adminUser)
        const logres=await request(server).post("/api/auth/login").send(adminLogin)
        const res=await request(server).get("/api/users").set({"authorization":logres.body.token})
        const users=await User.getUsers()
        expect(res.body).toHaveLength(users.length)
    })
})

describe("------------ [GET] api/users -------------",()=>{
    test("[5] admin kullanıcı silebiliyor",async ()=>{
        await request(server).post("/api/auth/register").send(adminUser)
        const logres=await request(server).post("/api/auth/login").send(adminLogin)
        const res=await request(server).delete("/api/users/2").set({"authorization":logres.body.token})
        const user2=await User.getById(2)
        expect(res.body.message).toMatch(/2 silindi/)
        expect(user2.username).toBeUndefined()
    })
})

describe("------------ [GET] api/tweet -------------",()=>{
    test("[6] admin tüm tweetleri görebiliyor",async ()=>{
        await request(server).post("/api/auth/register").send(adminUser)
        const logres=await request(server).post("/api/auth/login").send(adminLogin)
        const res=await request(server).get("/api/tweet").set({"authorization":logres.body.token})
        const tweets=await Tweet.getAll()
        expect(res.body).toHaveLength(tweets.length)
    })
    test("[7] Kullanıcı tweet atabiliyor",async ()=>{
        await request(server).post("/api/auth/register").send(newUser)
        const logres=await request(server).post("/api/auth/login").send(loginInfo)
        const res=await request(server).post("/api/tweet").set({"authorization":logres.body.token}).send(newTweet)
        expect(res.body[0].tweet).toEqual(newTweet.tweet)
    })
    test("[8] Kullanıcı kendine ait olmayan tweeti silemiyor ",async ()=>{
        await request(server).post("/api/auth/register").send(newUser)
        const logres=await request(server).post("/api/auth/login").send(loginInfo)
        const res=await request(server).delete("/api/tweet/2").set({"authorization":logres.body.token})
        expect(res.body.message).toMatch(/silemezsin!/)
    })
    test("[9] Kullanıcı kendine ait olan tweeti silebiliyor ",async ()=>{
        await request(server).post("/api/auth/register").send(newUser)
        const logres=await request(server).post("/api/auth/login").send(loginInfo)
        await request(server).post("/api/tweet").set({"authorization":logres.body.token}).send(newTweet)
        const res=await request(server).delete("/api/tweet/5").set({"authorization":logres.body.token})
        const tweet=await Tweet.getById(5)
        expect(tweet).toHaveLength(0)
        expect(res.body.message).toMatch(/silindi/)
    })
})

