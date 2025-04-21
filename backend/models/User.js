// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure this is unique
    username: { type: String, required: true, unique: true }, // Ensure this is unique
    password: { type: String, required: true },
});

module.exports = mongoose.model('User ', UserSchema);