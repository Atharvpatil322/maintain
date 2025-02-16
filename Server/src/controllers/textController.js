
const Text = require('../models/text');

// Create new text
exports.createText = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId; // set by authMiddleware

    // Validate
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newText = new Text({
      title,
      content,
      user: userId
    });

    await newText.save();

    return res.status(201).json({
      message: 'Text created successfully',
      data: newText
    });
  } catch (error) {
    console.error('Error creating text:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all texts for the logged-in user
exports.getAllTexts = async (req, res) => {
  try {
    const userId = req.userId;
    const texts = await Text.find({ user: userId })
      .select('title content createdAt updatedAt'); // select fields you want

    return res.status(200).json(texts);
  } catch (error) {
    console.error('Error fetching texts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Public route to get text by ID (no auth required)
exports.getTextById = async (req, res) => {
  try {
    const { id } = req.params;
    const text = await Text.findById(id);
    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }
    // Return the text content (or entire doc) as JSON
    return res.json({ content: text.content });
  } catch (error) {
    console.error('Error fetching text:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing text (must be owner)
exports.updateText = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    // Find text that belongs to the user
    let existingText = await Text.findOne({ _id: id, user: userId });
    if (!existingText) {
      return res.status(404).json({ message: 'Text not found or not yours' });
    }

    if (title) existingText.title = title;
    if (content) existingText.content = content;

    await existingText.save();

    return res.status(200).json({
      message: 'Text updated successfully',
      data: existingText
    });
  } catch (error) {
    console.error('Error updating text:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
