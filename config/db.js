const mongoose = require('mongoose');
const config = require('config');

// Gives us the mongoURI value from default.json, part of the config package.
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
