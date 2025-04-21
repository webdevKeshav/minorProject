// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');

const router = express.Router();

// User Registration
router.post('/signup', async (req, res) => {
    const { name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();
    res.status(201).send('User  registered');
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

// Seller Registration
router.post('/seller-signup', async (req, res) => {
    const { businessName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ businessName, email, password: hashedPassword });
    await seller.save();
    res.status(201).send('Seller registered');
});

// Seller Login
router.post('/seller-login', async (req, res) => {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller || !(await bcrypt.compare(password, seller.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: seller._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;