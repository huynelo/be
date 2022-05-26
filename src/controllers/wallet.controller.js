const Wallet = require('../models/Wallet');

exports.getWallet = async (req, res) => {
  try {
    if (!req.params.address) return res.status(400).send({ massage: 'Wallet Address is required.' });
    const wallet = await Wallet.findOne({ wallet_address: req.params.address });

    if (!wallet)
      return res.status(404).send({ message: "Wallet Not found." });
    
    return res.status(200).send({ wallet: wallet.wallet_address });
  } catch(err) {
    res.status(500).send({ message: err });
  }
};
