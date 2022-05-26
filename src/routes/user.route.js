const express = require('express');
const router = express.Router();

const UserControllers = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.route('/').get(verifyToken, UserControllers.getUser);
router.route('/:userId').get(verifyToken, UserControllers.getUserById);
router.route('/:userId').patch(verifyToken, UserControllers.updateUser);

module.exports = router;
