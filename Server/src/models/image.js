// server/src/models/image.model.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  assetName: {
    type: String,
    required: true
  },
  projectName: {
    type: String
  },
  cloudinaryUrl: {  // The Cloudinary URL
    type: String,
    required: true
  },
  publicId: {  // The Cloudinary public ID
    type: String,
    required: true
  },
  platformUrl: { // The redirect URL on our platform
    type: String,
    required: true
  },
  user: { // who uploaded this image
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
