const express = require('express');
const router = express.Router();

const UploadControllers = require('../controllers/upload.controller');
const UploadMiddleware = require('../middleware/upload.middleware');

router.route('/file').post(UploadMiddleware, UploadControllers.upload);

module.exports = router;
