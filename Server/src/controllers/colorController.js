const Color = require('../models/color');

// Create color
exports.createColor = async (req, res) => {
  try {
    const { title, hexCode } = req.body;
    const userId = req.userId; // from authMiddleware

    if (!title || !hexCode) {
      return res.status(400).json({ message: 'Title and hexCode are required' });
    }

    const newColor = await Color.create({
      title,
      hexCode,
      user: userId
    });

    return res.status(201).json({ message: 'Color created', data: newColor });
  } catch (error) {
    console.error('Create color error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all colors for the logged-in user
exports.getAllColors = async (req, res) => {
  try {
    const userId = req.userId;
    const colors = await Color.find({ user: userId }).select('title hexCode createdAt updatedAt');
    return res.status(200).json(colors);
  } catch (error) {
    console.error('Get colors error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Public route: get color by ID
exports.getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findById(id);
    if (!color) return res.status(404).json({ message: 'Color not found' });
    return res.json({ hexCode: color.hexCode });
  } catch (error) {
    console.error('Get color error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update color
exports.updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, hexCode } = req.body;
    const userId = req.userId;

    let color = await Color.findOne({ _id: id, user: userId });
    if (!color) {
      return res.status(404).json({ message: 'Color not found or not yours' });
    }

    if (title) color.title = title;
    if (hexCode) color.hexCode = hexCode;
    await color.save();

    return res.status(200).json({ message: 'Color updated', data: color });
  } catch (error) {
    console.error('Update color error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
