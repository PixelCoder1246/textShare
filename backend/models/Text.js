
const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  _id: { type: String },
  text: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

module.exports = mongoose.model('Text', textSchema);
