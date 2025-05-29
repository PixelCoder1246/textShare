
const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  text: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

module.exports = mongoose.model('Text', textSchema);
