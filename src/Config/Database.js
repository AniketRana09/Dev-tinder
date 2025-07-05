const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aniketrana7681:IJF43KSMRundpXbU@cluster0.zwivuhs.mongodb.net/Devtinder"
  );
};

module.exports = connectDB;
