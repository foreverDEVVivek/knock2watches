const express = require('express');
const router = express.Router();
const Cart = require('../models/cartSchema.js');  // Your Cart model
const Watches = require('../models/watchSchema.js'); // Product model
const User = require('../models/userSchema.js');  // User model
const { isLoggedIn } = require('../middleware'); // Auth middleware

// 📌 Get current user's cart

// 1️⃣ API route (for AJAX header update)
router.get('/api', isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.json({ items: [], total: 0, cartCount: 0 });
        }
        const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        res.json({
            items: cart.items,
            total: cart.totalPrice,
            cartCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});
// Get cart details
// 2️⃣ Page route (renders cart page)
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        res.render('ejsFiles/cartPage.ejs', { 
            user: req.user, 
            items: cart ? cart.items : [], 
            total: cart ? cart.totalPrice : 0,
            cartCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading cart');
    }
});

// 📌 Add item to cart
// Add item to cart
// Add item to cart
router.post("/add/:id", isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id;
        const quantity = parseInt(req.body.quantity) || 1;

        const product = await Watches.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Find user with cart reference
        let user = await User.findById(req.user._id).populate("cart");
        let cart;

        if (!user.cart) {
            // Create new cart and link to user
            cart = new Cart({ user: user._id, items: [] });
            await cart.save();

            user.cart = cart._id;
            await user.save();
        } else {
            cart = await Cart.findById(user.cart);
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                priceAtAddTime: product.price // store price at time of adding
            });
        }

        // Update total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.priceAtAddTime * item.quantity);
        }, 0);

        await cart.save();

        res.redirect("back"); // Reload the page after adding
    } catch (err) {
        console.error(err);
        res.redirect("back");
    }
});


// 📌 Remove item from cart completely
router.post('/remove/:productId', isLoggedIn, async (req, res) => {
    const { productId } = req.params;

    try {
        let user = await User.findById(req.user._id).populate('cart');
        let cart = await Cart.findById(user.cart);

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // ✅ Filter using "product" instead of "watch"
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // ✅ Recalculate totalPrice
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const product = await Watches.findById(item.product);
            if (product) cart.totalPrice += product.price * item.quantity;
        }

        await cart.save();
        res.redirect("back"); // ✅ Redirect to previous page after removal
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

// 📌 Decrease item quantity (remove if reaches 0)
router.post('/decrease/:productId', isLoggedIn, async (req, res) => {
    const { productId } = req.params;

    try {
        let user = await User.findById(req.user._id).populate('cart');
        let cart = await Cart.findById(user.cart);

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const item = cart.items.find(i => i.product.toString() === productId);

        if (!item) return res.status(404).json({ error: 'Item not found in cart' });

        // Decrease quantity or remove if 1
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        }

        // Recalculate total
        cart.totalPrice = 0;
        for (const i of cart.items) {
            const product = await Watches.findById(i.product);
            if (product) cart.totalPrice += product.price * i.quantity;
        }

        await cart.save();
        res.redirect("back"); // ✅ Best practice: redirect after POST to prevent resubmission
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to decrease item quantity' });
    }
});



// 📌 Clear cart
router.delete('/clear', isLoggedIn, async (req, res) => {
    try {
        let user = await User.findById(req.user._id).populate('cart');
        let cart = await Cart.findById(user.cart);

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.items = [];
        cart.total = 0;

        await cart.save();
        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});


router.get('/checkout', isLoggedIn, async (req, res) => {
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


module.exports = router;
