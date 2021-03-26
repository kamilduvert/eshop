const jwt = require('jsonwebtoken');

module.exports = tokenGenerator = {

  activationToken: (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5min'})
  },
  
  accessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'})
  },
  
  refreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
  }
  
}

