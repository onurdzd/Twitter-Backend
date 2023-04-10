/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('tweets').truncate()
  await knex('comments').truncate()

  await knex('users').insert([
    {username: 'onur' ,password:"$2b$10$nm/zCjiFeGNgcwa95Wu6RegjkqfJ67lJ/H6Op0eWFzmelkOa043bi",mail:"onur@onur.com"},
    {username: 'onur2' ,password:"$2b$10$nm/zCjiFeGNgcwa95Wu6RegjkqfJ67lJ/H6Op0eWFzmelkOa043bi",mail:"onur2@onur.com"},
  ]);
  await knex('tweets').insert([
    {tweet: 'tweet1',user_id:1},
    {tweet: 'tweet2',user_id:1},
    {tweet: 'tweet3',user_id:2},
    {tweet: 'tweet4',user_id:1},
  ]);
  await knex('comments').insert([
    {comment: 'yorum1',tweet_id:1},
    {comment: 'yorum2',tweet_id:2},
    {comment: 'yorum3',tweet_id:1},
    {comment: 'yorum4',tweet_id:4},
    {comment: 'yorum5',tweet_id:1},
    {comment: 'yorum6',tweet_id:2},
    {comment: 'yorum7',tweet_id:3},
  ]);
};
