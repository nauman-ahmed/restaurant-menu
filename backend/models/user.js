const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
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
  favorites: [menuItemSchema]
});

module.exports = mongoose.model('User', userSchema);
