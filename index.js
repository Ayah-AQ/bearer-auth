'use strict'

require('dotenv').config()

const { start } = require('./src/server')
const { db } = require('./src/auth/models/index')
const PORT = process.env.PORT;

db.sync().then(() => {
    start(PORT);
}).catch(err => console.log(err))
