// server/src/routes/color.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createColor,
  getAllColors,
  getColorById,
  updateColor
} = require('../controllers/colorController');

// Public route
router.get('/:id', getColorById);

// Protected routes
router.use(authMiddleware);

router.post('/create', createColor);
router.get('/', getAllColors);
router.put('/:id', updateColor);

module.exports = router;
