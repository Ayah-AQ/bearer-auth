'use strict';

const { users } = require('../models');

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop();
    await users
      .bearerAuthChecker(token)
      .then((data) => {
        req.user = data;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next({ message: 'Missing token' });
  }
};
