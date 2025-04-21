// backend/routes/products.js
const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the filename
    }
});

const upload = multer({ storage: storage });

// Add Product Route
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, price, sellerId } = req.body;
    const imagePath = req.file.path; // Get the path of the uploaded image

    try {
        // Convert sellerId to ObjectId
        const validSellerId = mongoose.Types.ObjectId(sellerId); // Convert to ObjectId here

        const product = new Product({
            name,
            description,
            price,
            sellerId: validSellerId, // Use the converted ObjectId
            image: imagePath // Save the image path to the product
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message }); // Send validation error message
    }
});

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find().populate('sellerId', 'businessName');
    res.json(products);
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('sellerId', 'businessName');
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
});

// Update a product
router.put('/:id', async (req, res) => {
    const { name, description, price } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price },
        { new: true }
    );
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.send('Product deleted');
});

module.exports = router;