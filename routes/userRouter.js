const express = require('express');
const passport = require('passport');
const {
    getSignUpPage,
    postSignUpRequest,
    getLoginPage,
    postLoginRequest,
    logoutUser,
    getProfilePage,
    changePassword,
    forgotPasswordPage,
    sendPasswordResetLink,
    resetPasswordPage,
    resetPassword
} = require('../controller/userController.js');

const router = express.Router();

// --- SIGN UP ---3
router.get('/signup', getSignUpPage);
router.post('/signup', postSignUpRequest);

// --- LOGIN ---
router.get('/login', getLoginPage);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log("Login attempt:");
        console.log("Email/Username:", req.body.username);
        console.log("Password entered:", req.body.password); // ⚠ Never log passwords in production!

        if (err) {
            console.error("Passport error:", err);
            return next(err);
        }
        if (!user) {
            console.warn("Authentication failed:", info);
            req.flash("error", info?.message || "Invalid credentials");
            return res.redirect('/users/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            console.log("User authenticated successfully:", user.email);
            return res.redirect('/watchs');
        });
    })(req, res, next);
});

// --- LOGOUT ---
router.get('/logout', logoutUser);

// --- PROFILE ---
router.get('/profile', getProfilePage);

// --- CHANGE PASSWORD ---
router.post('/change-password', changePassword);

// --- FORGOT PASSWORD ---
router.get('/forgot-password', forgotPasswordPage);
router.post('/forgot-password', sendPasswordResetLink);

// --- RESET PASSWORD ---
router.get('/reset-password/:token', resetPasswordPage);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
