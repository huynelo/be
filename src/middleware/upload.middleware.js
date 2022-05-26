const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/files')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + Date.now() + path.extname(file.originalname))
  },
});

const uploadFile = multer({ storage: storage }).single('file');
module.exports = uploadFile;
