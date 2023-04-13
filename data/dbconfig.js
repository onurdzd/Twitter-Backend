const knex = require('knex');
const knexConfig = require('../knexfile.js');
const {NODE_ENV}=require("../config/config.js")
const environment = NODE_ENV || 'development';

module.exports = knex(knexConfig[environment]);
