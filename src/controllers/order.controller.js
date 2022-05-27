const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

const User = require('../models/User');
const Energy = require('../models/Energy');
const Order = require('../models/Order');

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
      return res.status(200).send({ message: messageHash, timestamp });
    } else {
      return res.status(400).send({ message: "Don't have enough Energy Icon" });
    }
  } catch(err) {
    res.status(500).send({ message: err });
  }
};

exports.updateMint = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ massage: 'Body is required.' });
    const { tokenId, tx, orderId, userId, blockNumber, nftType, nftLevel, nftRarity, mintedAt }  = req.body;

    const energy = await Energy.findOne({ user_id: userId });
    if (!energy) return res.status(404).send({ message: "User Not found." });

    await addOrder(userId, orderId, tx, nftType, nftLevel, nftRarity, tokenId, mintedAt, blockNumber);
    const updatedEnergyData = await updateEnergy(nftType, nftLevel, nftRarity, 1, energy, userId);
    const metadataPath = await createMetadata(nftLevel, nftRarity, tokenId);

    if (updatedEnergyData && metadataPath) {
      return res.status(200).send({ energy_data: updatedEnergyData, metadata_url: metadataPath });
    } else {
      res.status(400).send({ message: "Ask admin check again" });
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

const addOrder = async (userId, orderId, tx, nftType, nftLevel, nftRarity, tokenId, mintedAt, blockNumber) => {
  try {
    const newOrder = new Order({
      user_id: userId,
      order_id: orderId,
      tx,
      nft_type: nftType,
      nft_level: nftLevel,
      nft_rarity: nftRarity,
      token_id: tokenId,
      minted_at: mintedAt,
      block_number: blockNumber
    });
  
    await newOrder.save();
    return newOrder
  } catch (error) {
    throw error;
  }
}

const updateEnergy = async (nftType, nftLevel, nftRarity, quantity, data) => {
  try {
    if (nftType === 'ENERGY') {
      const energyIconAmount = LEVEL_CONDITION[`${nftLevel}`] * quantity;
      const stepsAmount = energyIconAmount * 20000;

      const updateData = {
        energy_icon: data.energy_icon - energyIconAmount,
        steps: data.steps - stepsAmount,
      }

      await Energy.findByIdAndUpdate(data._id, { $set: updateData });
      return updateData;
    }
  } catch(err) {
    throw err;
  }
}

const createMetadata = async (nftLevel, nftRarity, tokenId) => {
  try {
    let rarity = 'legend';

    const metadata = {
      description: "Energy NFT for upgrade LAND NFT & NELON NFT",
      external_url: "https://neloverse.game",
      image: `http://images.neloverse.game/energy/${rarity}/lv${nftLevel}.png`,
      name: `Energy Legend Lv${nftLevel}`,
      attributes: [
        {
          trait_type: 'Level',
          value: nftLevel,
          max_value: 5
        }
      ]
    }

    // const pathFile = await fs.writeFileSync(path.join(__dirname, `../../public/metadata/${tokenId}.json`), JSON.stringify(metadata));
    try {
      fs.writeFileSync(path.join(__dirname, `../../public/metadata/${tokenId}.json`), JSON.stringify(metadata));
      const pathURL = `http://13.213.117.124:2202/api/v1/metadata/${tokenId}.json`;
      console.log(pathURL)
      return pathURL;
    } catch (e) {
      console.error(e);
    }
  } catch(err) {
    throw err;
  }
}
