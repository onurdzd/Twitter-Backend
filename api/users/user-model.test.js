const User=require("./user-model")
const db=require("../../data/dbconfig")

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

let newTweet={tweet:"Test tweet",user_id:"3"}

describe("--------getAll-------",()=>{
    let tweets;
    beforeEach(async ()=> {
        tweets=await Tweet.getAll()
    })
    test("[1] tüm projereler gösteriliyor",()=>{
        expect(tweets).toHaveLength(4)
    })
})

describe("--------getById-------",()=>{
    let tweet;
    beforeEach(async ()=> {
        tweet=await Tweet.getById(1)
    })
    test("[2] 1 nolu tweetin tweet id si gösteriliyor",()=>{
        expect(tweet).toHaveProperty("tweet_id",1)
    })
    test("[3] 1 nolu tweet gösteriliyor",()=>{
        expect(tweet).toHaveProperty("tweet",tweet.tweet)
    })
})

describe("--------getBy-------",()=>{
    let tweet;
    beforeEach(async ()=> {
        tweet=await Tweet.getBy({"tweet_id":1})
    })
    test("[4] 1 nolu tweet filtrelenebiliyor",()=>{
        expect(tweet[0]).toHaveProperty("tweet",tweet[0].tweet)
    })
})

describe("--------add-------",()=>{
    let tweets;
    let tweet;
    beforeEach(async ()=> {
        tweets=await Tweet.getAll()
        await Tweet.add(newTweet)
        tweet=await Tweet.getById(5)
    })
    test("[5] yeni tweet eklenebiliyor",()=>{
        expect(tweets).toHaveLength(tweets.length)
    })
    test("[6] yeni tweet düzgün ekleniyor",()=>{
        expect(tweet).toHaveProperty("tweet",tweet.tweet)
    })
})

describe("--------remove-------",()=>{
    let tweets;
    let tweet;
    let unDeletedTweet;
    beforeEach(async ()=> {
        await Tweet.add(newTweet)
        await Tweet.remove(5)
        tweets=await Tweet.getAll()
        tweet=await Tweet.getById(5)
        unDeletedTweet=await Tweet.getById(8)
    })
    test("[7] Kendi tweetini silebiliyor",()=>{
        expect(tweets).toHaveLength(4)
        expect(tweet).toEqual([])
    })
    test("[8] olmayan tweet doğru dönüyor",()=>{
        expect(unDeletedTweet).toEqual([])
    })
})