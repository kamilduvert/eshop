const jwt = require('jsonwebtoken');

module.exports = tokenManager = {

  generateActivationToken: (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5min'});
  },
  
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});
  },
  
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
  },

  verifyActivationToken: (token) => {
    return jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
  }


}

