const express = require('express');
const router = express.Router();

const AuthControllers = require('../controllers/auth.controller');

router.route('/request').post(AuthControllers.request);
router.route('/verify').post(AuthControllers.veirfy);
router.route('/register').post(AuthControllers.signup);
router.route('/login').post(AuthControllers.signin);

module.exports = router;
