const mongoId = process.env.MONGO_URI;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoId, {
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
