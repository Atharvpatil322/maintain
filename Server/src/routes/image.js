// // server/src/routes/image.routes.js
// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload');
// const { uploadImage, redirectToImage, getAllImages, updateImage } = require('../controllers/imageController');

// // POST /api/images/upload
// router.post('/upload', upload.single('image'), uploadImage);

// // GET /api/images/:id
// router.get('/:id', redirectToImage);


// // Get all the images 
// router.get('/', getAllImages);

// router.put('/:id', upload.single('image'), updateImage);
// module.exports = router;
// server/src/routes/image.routes.js
const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const {
  uploadImage,
  redirectToImage,
  getAllImages,
  updateImage
} = require('../controllers/imageController');


router.get('/:id', redirectToImage);
// All routes here require an auth token
router.use(authMiddleware);

// POST /api/images/upload
router.post('/upload', upload.single('image'), uploadImage);

// GET /api/images/:id -- anyone with a valid token can redirect
router.get('/:id', redirectToImage);

// Get all images for this user
router.get('/', getAllImages);

// Update an image
router.put('/:id', upload.single('image'), updateImage);

module.exports = router;
