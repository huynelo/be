
   
const express = require('express');
const authRoutes = require('./auth.route');
const walletRoutes = require('./wallet.route');
const userRoutes = require('./user.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);
router.use('/user', userRoutes);

module.exports = router;
