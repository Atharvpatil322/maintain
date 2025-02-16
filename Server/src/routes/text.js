// server/src/routes/text.routes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  createText,
  getAllTexts,
  getTextById,
  updateText
} = require('../controllers/textController');

// Public route: get text content by ID (no token required)
router.get('/:id', getTextById);

// Protect the rest with auth
router.use(authMiddleware);

// POST /api/texts/create
router.post('/create', createText);

// GET /api/texts (list user’s own texts)
router.get('/', getAllTexts);

// PUT /api/texts/:id
router.put('/:id', updateText);

module.exports = router;
