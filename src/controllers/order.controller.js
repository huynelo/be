const ethers = require('ethers');

const User = require('../models/User');
const Energy = require('../models/Energy');

const LEVEL_CONDITION = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
}

exports.requestMint = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    const { wallet, level, quantity, userId }  = req.body;
    const timestamp = Date.now();
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User Not found." });

    if (checkLevelAndEnergy(userId, level, quantity)) {
      const messageHash = ethers.utils.solidityKeccak256(["address", "uint8", "uint256", "uint256"], [wallet, level, quantity, timestamp]);
      return res.status(200).send({ message: messageHash });
    } else {
      return res.status(400).send({ message: "Don't have enough Energy Icon" });
    }
  } catch(err) {
    res.status(500).send({ message: err });
  }
};

const checkLevelAndEnergy = async (userId, level, quantity) => {
  let condition = false;
  const energy = await Energy.findOne({ user_id: userId });
  if (level === 1) {
    if (energy.energy_icon >= (quantity * LEVEL_CONDITION[`${level}`])) {
      condition = true;
    }
  }

  return condition;
}
