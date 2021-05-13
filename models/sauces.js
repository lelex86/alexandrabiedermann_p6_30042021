const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  id: { type: String, require: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: String, required: true, min: 0, max: 10 },
  likes: { type: Number, min: 0, default: 0 },
  dislikes: { type: Number, min: 0, default: 0 },
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

module.exports = mongoose.model("Sauce", sauceSchema);
