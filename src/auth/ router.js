'use strict'

const express = require('express')
const { users } = require('./models')
const router = express.Router()

const bcrypt = require('bcrypt')
const basicAuth = require('./middleware/basicAuth')
const bearerAuth = require('./middleware/bearerAuth')

router.post('/signup', userSignUp)
router.post('/signin', basicAuth, userSignIn)
router.get('/secretstuff', bearerAuth, newPage)


async function userSignUp(req, res) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5)
    const newUser = await users.create({ 
        username: username.toLowerCase(),
        password: hashedPassword
    })
    res.status(201).json(newUser)
}

function userSignIn(req, res) {
    res.status(200).json(req.user)
}

function newPage(req, res) {
    res.status(200).json({
        massege: "Welcom to secretstuff page"
    })
}


module.exports = router;