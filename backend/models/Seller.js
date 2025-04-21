// backend/models/Seller.js
const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    businessName: String,
    email: { type: String, unique: true },
    password: String,
});

module.exports = mongoose.model('Seller', SellerSchema);