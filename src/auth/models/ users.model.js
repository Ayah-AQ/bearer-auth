'ues strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET

const users = (sequelize, DataTypes) =>  { const model = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.VIRTUAL,
    }
})

model.authenticateBasic = async function(username,password ){
    const user = await model.findOne({ where: { username } });
    const isValid = await bcrypt.compare(password, user.password)

    if(isValid) {
     const userToken = jwt.sign({username: user.username, password: user.password }, secretKey) 
       console.log(userToken)
       return {
        user,
        token: userToken}
    } else {
      throw new Error('Invalid User');
    }
}

model.bearerAuthChecker = async function(token){
    const parsedToken = jwt.verify(token, secretKey)   // parse the token into a data that we can read (paylode part, the user data)
    // console.log(parsedToken) 
    const user = await model.findOne({ where: {username: parsedToken.username } });
    if(user.username){
      return user
    } else {
        throw new Error('Invalid Token');
    }

}


return model

}



module.exports = users