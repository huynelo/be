const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Web3 = require('web3');

const { encrypt, decrypt } = require('../utils/helpers');
const config = require('../configs/auth.config');
const User = require('../models/User');
const Token = require('../models/Token');
const Hash = require('../models/Hash');
const Wallet = require('../models/Wallet');
const Energy = require('../models/Energy');

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));

exports.request = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    let newUser;
    const user = await User.findOne({ wallet_address: req.body.wallet_address });

    const hashData = await encrypt(req.body.wallet_address);

    if (!hashData)
      return res.status(400).send({ massage: 'Request message error.' });

    if (!user) {
      newUser = new User({
        email: req.body.email,
        user_name: req.body.username,
        wallet_address: req.body.wallet_address,
        password: null,
        wallet_balance: req.body.wallet_balance,
        account_balance: 0,
      });

      const newUserData = await newUser.save();

      await saveWallet(req.body.wallet_address, newUserData._id);
      await saveHash(hashData, newUserData._id);
      await saveEnergy(newUserData._id);
    } else {
      const updateData = {
        wallet_balance: req.body.wallet_balance,
      }

      await User.findByIdAndUpdate(user._id, { $set: updateData })
      await saveHash(hashData, user._id);
    }
    
    return res.status(200).send({ message: hashData.content });
  } catch(err) {
    res.status(500).send({ message: err });
  }
};

exports.veirfy = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    const hashData = await Hash.findOne({ hash_value: req.body.message });

    if (!hashData)
      return res.status(400).send({ message: 'Message is not valid.' });
    
    const decrpyted = await decrypt(hashData);

    if (!decrpyted)
      return res.status(400).send({ message: 'Message is not valid.' });

    const account = web3.eth.accounts.recover(req.body.message, req.body.signature);

    if (!account)
      return res.status(400).send({ message: 'Signature is not valid.' });

    if (account.toString().toLowerCase() !== decrpyted)
      return res.status(400).send({ message: 'Signature is not valid.' });
  
    const user = await User.findOne({ wallet_address: account.toString().toLowerCase() });

    if (!user)
      return res.status(404).send({ message: 'User Not found.' });

    const accessToken = await generateToken({ id: user._id });
    await saveToken(accessToken, user._id);
    
    return res.status(200).send({
      verified: true,
      userID: user._id,
      accessToken,
    });
  } catch(err) {
    console.log(err)
    res.status(500).send({ message: err });
  }
};

exports.signup = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    let user;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    if (req.body.email) {
      user = new User({
        email: req.body.email,
        wallet_address: req.body.wallet_address,
        password: hashedPassword,
        wallet_balance: req.body.wallet_balance,
        account_balance: 0,
      });
    } else if (req.body.user_name) {
      user = new User({
        user_name: req.body.user_name,
        wallet_address: req.body.wallet_address,
        password: hashedPassword,
        wallet_balance: req.body.wallet_balance,
        account_balance: 0,
      });
    }

    const userData = await user.save();
    await saveWallet(req.body.wallet_address, userData._id);

    res.send({ message: 'User was registered successfully!', userID: userData._id });
  } catch(err) {
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    let user;

    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else if (req.body.user_name) {
      user = await User.findOne({ user_name: req.body.user_name });
    }

    if (!user)
      return res.status(404).send({ message: "User Not found." });

    await comparePassword(req.body.password, user.password);

    const accessToken = await generateToken({ id: user._id });
    await saveToken(accessToken, user._id);

    return res.status(200).send({
      id: user._id,
      username: user.user_name,
      email: user.email,
      accessToken: accessToken
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

const comparePassword = (password, yourPassword) => {
  if(!bcrypt.compareSync(password, yourPassword))
    throw new Error("Invalid password")
}

const generateToken = (data) => {
  // jwt.sign(data, config.secret, { algorithm: 'RS256' })
  return jwt.sign(data, config.secret, { expiresIn: '1h' });
};

const saveToken = (accessToken, userID) => {
  try {
    const token = new Token({
      token: accessToken,
      device: 'WEB',
      user_id: userID,
      expired_at: moment().add(1, 'hours').format('x')
    });
    token.save();
    return token
  } catch (error) {
    throw error;
  }
}

const saveHash = (hashData, userID) => {
  try {
    const hash = new Hash({
      hash_name: hashData.id,
      hash_value: hashData.content,
      user_id: userID,
      expired_at: moment().add(1, 'hours').format('x'),
    });
    hash.save();
    return hash
  } catch (error) {
    throw error;
  }
}

const saveWallet = (wallet_address, userID) => {
  try {
    const wallet = new Wallet({
      wallet_address: wallet_address,
      user_id: userID
    });
    wallet.save();
    return wallet
  } catch (error) {
    throw error;
  }
}

const saveEnergy = (userID) => {
  try {
    const energy = new Energy({
      user_id: userID
    });
    energy.save();
    return energy
  } catch (error) {
    throw error;
  }
}
