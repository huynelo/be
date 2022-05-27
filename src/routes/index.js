
const path = require('path')   
const express = require('express');

const authRoutes = require('./auth.route');
const walletRoutes = require('./wallet.route');
const userRoutes = require('./user.route');
const orderRoutes = require('./order.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/health-check', (req, res) => res.send('OK'));
router.use(express.static('public'));

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);
router.use('/user', userRoutes);
router.use('/order', orderRoutes);

module.exports = router;
