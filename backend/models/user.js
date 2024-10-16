const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const ratingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: {
    type: Number,
    default: 0  
  }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "Student"
  },
  isSubscribedToNewsletter: {
    type: Boolean,
    default: false,
  },
  favorites: [menuItemSchema],
  ratings: [ratingSchema]
});

module.exports = mongoose.model('User', userSchema);
