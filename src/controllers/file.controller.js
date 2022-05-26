const crypto = require('crypto');
const helpers = require('../utils/helpers');
require('dotenv/config');

exports.file = async (req, res) => {
  if (!req.body) return res.status(400).send({ message: 'Body can not be empty.' });

  const secretKey = await crypto.createHash('md5').update(`${req.body.secret}${req.body.createdDate}`).digest('hex');
  const hashEncrypted = {
    id: req.body.id,
    content: req.body.content
  }
  const hashDecrypted = await helpers.decrypt(hashEncrypted, secretKey);

  return res.status(200).send({ value: hashDecrypted });
}
