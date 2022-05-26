const express = require('express');
const router = express.Router();

const WalletControllers = require('../controllers/wallet.controller');

router.route('/:address').get(WalletControllers.getWallet);

module.exports = router;
