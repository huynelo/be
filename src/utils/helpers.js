const crypto = require('crypto');
require('dotenv/config');

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);
// crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);
const SECRECT_KEY = 'RrTO5Sse4kZ8JkZw55EkhbC64r6ct75A';

const encrypt = async (text) => {
  const cipher = await crypto.createCipheriv(algorithm, SECRECT_KEY, iv);
  const encrypted = await Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    id: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = async (hash) => {
  const decipher = await crypto.createDecipheriv(algorithm, SECRECT_KEY, Buffer.from(hash.hash_name, 'hex'));
  const decrpyted = await Buffer.concat([decipher.update(Buffer.from(hash.hash_value, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

const generateId = () => {
  return Math.random().toString(36).slice(2);
}

const round2Decimals = (num) => {
  const number = num === '' ? 0 : num;
  return parseFloat(number).toFixed(2);
}

const numberWithCommas = (x) => {
  if (!x) return;

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const checkValidEmail = (email) => {
  // eslint-disable-next-line
  const condition = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return condition.test(String(email).toLowerCase());
}

module.exports = {
  encrypt,
  decrypt,
  generateId,
  round2Decimals,
  checkValidEmail,
  numberWithCommas,
};