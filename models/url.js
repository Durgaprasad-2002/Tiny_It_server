const mongoose = require("mongoose");

const URLScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickDetails: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      referrer: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Url", URLScheme);
