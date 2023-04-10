/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users" , t =>{
        t.increments("user_id")
        t.string("username",20).unique().notNullable()
        t.string("password",120).notNullable()
        t.string("mail",30).unique().notNullable()
    }).createTable("tweets",t=>{
        t.increments("tweet_id")
        t.string("tweet",120).unique().notNullable()
        t.integer("retweet").defaultTo(0)
        t.integer("like").defaultTo(0)
        t.integer("user_id").unsigned().notNullable().references("user_id").inTable("users").onUpdate("CASCADE").onDelete("CASCADE") 
    }).createTable("comments",t=>{
        t.increments("comments_id")
        t.string("comment",65).unique().notNullable()
        t.integer("tweet_id").unsigned().notNullable().references("tweet_id").inTable("tweets").onUpdate("CASCADE").onDelete("CASCADE")    
    })
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("comments").dropTableIfExists("tweets").dropTableIfExists("users")
};

