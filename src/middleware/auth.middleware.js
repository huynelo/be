const jwt = require('jsonwebtoken');
const config = require('../configs/auth.config.js');

verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'Token is required!' });
  }
  
  jwt.verify(token.split('Bearer ')[1], config.secret, (err, decoded) => {
    if (err)
      return res.status(401).send({ message: "Unauthorized!" });

    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
