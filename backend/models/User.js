const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  display_name: { type: String },
  age: { type: Number },
  weight_kg: { type: Number },
  conditions: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
