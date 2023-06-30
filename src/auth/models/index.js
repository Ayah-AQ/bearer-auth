'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const users = require('./ users.model');

const DB_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DB_URL;

const CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DB_URL, CONFIG);

module.exports = {
  db: sequelize,
  users: users(sequelize, DataTypes),
};