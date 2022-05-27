const express = require('express');
const router = express.Router();

const OrderControllers = require('../controllers/order.controller');

router.route('/mint').post(OrderControllers.requestMint);
router.route('/update-mint').post(OrderControllers.updateMint);

module.exports = router;
