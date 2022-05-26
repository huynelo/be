const express = require('express');
const router = express.Router();

const FileControllers = require('../controllers/file.controller');

router.route('/detail').post(FileControllers.file);

module.exports = router;
