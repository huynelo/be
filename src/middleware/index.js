const authJwt = require('./auth.middleware.js');
const verifySignUp = require('./verifySignUp.middleware.js');

module.exports = {
  authJwt,
  verifySignUp
};
