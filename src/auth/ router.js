'use strict';

const express = require('express');
const { users } = require('./models');
const router = express.Router();

const bcrypt = require('bcrypt');
const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');

router.post('/signup', signUp);
router.post('/signin', basicAuth, signIn);
router.get('/secret', bearerAuth, secret);

async function signUp(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = await users.create({
    username: username.toLowerCase(),
    password: hashedPassword,
  });
  res.status(201).json(newUser);
}

function signIn(req, res) {
  res.status(200).json(req.user);
}

function secret(req, res) {
  res.status(200).json({
    message: "Welcome to secret",
  });
}

module.exports = router;
