const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const helpers = require('../utils/helpers');
require('dotenv/config');

exports.upload = async (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'File can not be empty.' });
  const filePath = await path.join(__dirname, `../../public/files/${req.file.filename}`);
  const crrTime = Date.now();

  if (!req.body.secret) {
    fs.unlink(filePath, (err) => {
      if (err) return res.status(400).send({ message: err });
    });

    return res.status(400).send({ message: 'Secret is required.' });
  }

  const REGEX = /\(([^)]+)\)/;
  const secretKey = await crypto.createHash('md5').update(`${req.body.secret}${crrTime}`).digest('hex');
  const ipfs = await create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

  const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file });
    const fileHash = await fileAdded.cid.toString().split(REGEX)[0];

    return fileHash;
  };

  const hash = await addFile(req.file.filename, filePath);
  const hashEncrypted = await helpers.encrypt(hash, secretKey);

  if (hash) {
    fs.unlink(filePath, (err) => {
      if (err) return res.status(400).send({ message: err });
    });
  }

  return res.status(200).send({ data: { ...hashEncrypted, filename: req.file.filename, createdDate: crrTime } });
}
