const Tweet=require("./tweet-model")
const db=require("../../data/dbconfig")

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

let newTweet={tweet:"Test tweet",user_id:"3"}
let newLike={user_id:1,tweet_id:2}
let newRetweet={user_id:1,tweet_id:2}
let newFavorite={user_id:1,tweet_id:3}

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

describe("--------getLikeByUser-------",()=>{
    let likes;
    beforeEach(async ()=> {
        likes=await Tweet.getLikeByUser(1)
    })
    test("[9] 1 nolu user e ait like lar döndürülüyor",()=>{
        expect(likes).toHaveLength(2)
    })
})

describe("--------getLikeByTweet-------",()=>{
    let likes;
    beforeEach(async ()=> {
        likes=await Tweet.getLikeByTweet(1)
    })
    test("[10] 1 nolu tweet e ait like lar döndürülüyor",()=>{
        expect(likes.likeCount).toEqual(2)
    })
})

describe("--------postLike-------",()=>{
    let likes;
    beforeEach(async ()=> {
        await Tweet.postLike(newLike)
        likes=await Tweet.getLikeByUser(1)
    })
    test("[11] user1 like attıktan sonra 1 nolu user e ait like lar döndürülüyor",()=>{
        expect(likes).toHaveLength(3)
    })
})

describe("--------deleteLike-------",()=>{
    let likes;
    beforeEach(async ()=> {
        await Tweet.deleteLike({user_id:1,tweet_id:2})
        likes=await Tweet.getLikeByUser(1)
    })
    test("[12] user1 like sildikten sonra 1 nolu user e ait like lar döndürülüyor",()=>{
        expect(likes).toHaveLength(1)
    })
})

describe("--------getRetweetByTweets-------",()=>{
    let retweets;
    beforeEach(async ()=> {
        retweets=await Tweet.getRetweetByUser(1)
    })
    test("[13] 1 nolu user e ait retweet ler döndürülüyor",()=>{
        expect(retweets).toHaveLength(2)
    })
})
describe("--------postRetweets-------",()=>{
    let retweets;
    beforeEach(async ()=> {
        await Tweet.postRetweet(newRetweet)
        retweets=await Tweet.getRetweetByUser(1)
    })
    test("[141] user1 retweet attıktan sonra 1 nolu user e ait retweet ler döndürülüyor",()=>{
        expect(retweets).toHaveLength(3)
    })
})

describe("--------deleteRetweets-------",()=>{
    let retweets;
    beforeEach(async ()=> {
        await Tweet.deleteRetweet({user_id:1,tweet_id:2})
        retweets=await Tweet.getRetweetByUser(1)
    })
    test("[15] user1 retweet sildikten sonra 1 nolu user e ait retweet lar döndürülüyor",()=>{
        expect(retweets).toHaveLength(1)
    })
})

describe("--------getFavoriteByUser-------",()=>{
    let favorites;
    beforeEach(async ()=> {
        favorites=await Tweet.getFavoriteByUser(1)
    })
    test("[13] 1 nolu user e ait favoriler döndürülüyor",()=>{
        expect(favorites).toHaveLength(1)
    })
})
describe("--------postFavorites-------",()=>{
    let favorites;
    beforeEach(async ()=> {
        await Tweet.postFavorite(newFavorite)
        favorites=await Tweet.getFavoriteByUser(1)
    })
    test("[141] user1 favoriye aldıktan sonra user1 e ait favoriler döndürülüyor",()=>{
        expect(favorites).toHaveLength(2)
    })
})

describe("--------deleteFavorites-------",()=>{
    let favorites;
    beforeEach(async ()=> {
        await Tweet.deleteFavorite({user_id:1,tweet_id:2})
        favorites=await Tweet.getFavoriteByUser(1)
    })
    test("[15] user1 favori sildikten sonra user1 e ait favoriler döndürülüyor",()=>{
        expect(favorites).toHaveLength(0)
    })
})