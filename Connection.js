const mongoose = require("mongoose");

const DBConnection = mongoose.connect(
  "mongodb+srv://prasaddurga:1234@urlshortner.7wm4vzk.mongodb.net/?retryWrites=true&w=majority&appName=URLShortner"
);

module.exports = DBConnection;
