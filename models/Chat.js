const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ['user', 'model'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);