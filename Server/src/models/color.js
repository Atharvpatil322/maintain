
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hexCode: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Color', colorSchema);
