// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    image: { type: String, required: true }, // Add this line to store the image path
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);