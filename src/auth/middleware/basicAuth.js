'use strict';

const base64 = require('base-64');
const { users } = require('../models');

module.exports = async (req, res, next) => {
  console.log(users);

  if (req.headers.authorization) {
    const basicAuthData = req.headers.authorization;
    const splitBasicWord = basicAuthData.split(' ');
    const theAutodecodedOnly = splitBasicWord.pop();
    const decodedData = base64.decode(theAutodecodedOnly);

    const [username, password] = decodedData.split(':');
    await users
      .authenticateBasic(username, password)
      .then((data) => {
        console.log(data);
        req.user = data;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({ message: 'Please enter valid username or password' });
  }
};
