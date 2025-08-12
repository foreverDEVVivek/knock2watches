

const express = require('express');
const router = express.Router();
const Cart = require('../models/cartSchema.js');  // Your Cart model
const Watches = require('../models/watchSchema.js'); // Product model
const User = require('../models/userSchema.js');  // User model
const { isLoggedIn } = require('../middleware'); // Auth middleware

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart'); // Redirect if cart is empty
        }

        res.render('ejsFiles/checkout.ejs', {
            user: req.user,
            items: cart.items,
            total: cart.totalPrice
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading checkout page');
    }
});

// 📌 Checkout Page - POST (Place Order)
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { address, city, state, zip, phone } = req.body;

        // Validate required fields
        if (!address || !city || !state || !zip || !phone) {
            return res.status(400).send('Please fill all required fields.');
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // (Optional) Save order in database
        // Example Order Model usage
        /*
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalPrice: cart.totalPrice,
            shippingAddress: { address, city, state, zip, phone },
            status: 'Pending'
        });
        await order.save();
        */

        // Clear the cart after checkout
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Redirect to confirmation page
        res.redirect('/order-success');
    } catch (err) {
        console.error(err);
        res.status(500).send('Checkout failed');
    }
});

module.exports = router;
