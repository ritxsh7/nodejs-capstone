const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, required: true },
  password: String,
  email: { type: String, unique: true, required: true },
  mobile: { type: Number, unique: true, required: true },
  admin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
