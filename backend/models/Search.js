const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  feature: { type: String, required: true },
  result: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Search', searchSchema);
