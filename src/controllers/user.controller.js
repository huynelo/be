const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Energy = require('../models/Energy');

exports.getUser = async (req, res) => {
  try {
    if (!req.userId) return res.status(400).send({ message: 'User ID is required.' });
    const user = await User.findOne({ id: req.userId });
    const energy = await Energy.findOne({ user_id: user._id });

    if (!user)
      return res.status(404).send({ message: "User Not found." });

    return res.status(200).send({
      id: user._id,
      username: user.user_name,
      email: user.email,
      wallet_address: user.wallet_address,
      wallet_balance: user.wallet_balance,
      account_balance: user.account_balance,
      steps: energy.steps,
      energyIcon: energy.energy_icon,
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

exports.getUserById = async (req, res) => {
  try {
    if (!req.params.userId) return res.status(400).send({ message: 'User ID is not empty' });
    const user = await User.findOne({ id: req.params.userId });

    if (!user)
      return res.status(404).send({ message: "User Not found." });

    return res.status(200).send({
      id: user._id,
      username: user.user_name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

exports.updateUser = async (req, res) => {
  try {
    if (!req.params.userId) return res.status(400).send({ message: 'User ID is required.' });
    if (!req.body.password) return res.status(400).send({ message: 'Body is required.' });
    const user = await User.findOne({ id: req.params.userId });

    if (!user)
      return res.status(404).send({ message: "User Not found." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const updateData = {
      password: hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: updateData });

    return res.status(200).send({
      message: 'Update user successfully!',
      userID: updatedUser._id
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}
