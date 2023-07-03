'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const users = (sequelize, DataTypes) => {
  const model = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
    },
  });

  model.authenticateBasic = async function (username, password) {
    const user = await model.findOne({ where: { username } });
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const userToken = jwt.sign({ username: user.username, password: user.password }, SECRET);
      console.log(userToken);
      return {
        user,
        token: userToken,
      };
    } else {
      throw new Error('No User');
    }
  };

  model.bearerAuthChecker = async function (token) {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await model.findOne({ where: { username: parsedToken.username } });
    if (user.username) {
      return user;
    } else {
      throw new Error('Invalid Token');
    }
  };

  return model;
};

module.exports = users;
