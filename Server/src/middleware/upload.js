// server/src/middlewares/multer.js
const multer = require('multer');

// Use Multer's memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
