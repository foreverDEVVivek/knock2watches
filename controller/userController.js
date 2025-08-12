const User = require('../models/userSchema.js');
const crypto = require('crypto');
const transporter = require('../config/nodemailer.config.js');

// --- SIGN UP ---
const getSignUpPage = (req, res) => {
    res.render('ejsFiles/signIn.ejs'); // Or rename file to signup.ejs
};
const postSignUpRequest = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            req.flash("error", "All fields are required.");
            return res.redirect("/users/signup");
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email already in use.");
            return res.redirect("/users/signup");
        }

        // Create a new instance, don't save yet
        const newUser = new User({ username, email });
        
        // This saves the user with a hashed password
        const registeredUser = await User.register(newUser, password)
    .catch(err => {
        console.error("Register error:", err);
        throw err; // so we see the flash
    });

        // Log the user in after registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "User Registered Successfully!");
            return res.redirect('/watchs');
        });
    } catch (err) {
        console.error(err);
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
};


// --- LOGIN ---
const getLoginPage = (req, res) => {
    res.render('ejsFiles/login.ejs');
};

const postLoginRequest = (req, res) => {
    console.log("User logged in:", req.user);
    req.flash("success", "Welcome back!");
    res.redirect('/users/profile');
};

// --- LOGOUT ---
const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully');
        res.redirect('/users/login');
    });
};

// --- PROFILE ---
const getProfilePage = (req, res) => {
    res.render('ejsFiles/userDetail.ejs', { user: req.user });
};

// --- CHANGE PASSWORD ---
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        await req.user.changePassword(oldPassword, newPassword);
        req.flash('success', 'Password changed successfully!');
        res.redirect('/users/profile');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/users/profile');
    }
};

// --- FORGOT PASSWORD ---
const forgotPasswordPage = (req, res) => {
    res.render('ejsFiles/forgot-password.ejs');
};

const sendPasswordResetLink = async (req, res) => {
    const { email, username } = req.body;
    if(email === '' || username === '') {
        req.flash('error', 'Please provide both email and username.');
        return res.redirect('/users/forgot-password');
    }


    const user = await User.findOne({email, username });

    if (!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/users/forgot-password');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/users/reset-password/${token}`;
    await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `Click here to reset your password: ${resetURL}`
    });

    req.flash('success', 'Password reset link sent to your email.');
    res.redirect('/users/login');
};

// --- RESET PASSWORD ---
const resetPasswordPage = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Invalid or expired token.');
        return res.redirect('/users/forgot-password');
    }

    res.render('ejsFiles/resetPasswordPage.ejs', { token });
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Invalid or expired token.');
        return res.redirect('/users/forgot-password');
    }

    await user.setPassword(password);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    req.flash('success', 'Password reset successfully. Please log in.');
    res.redirect('/users/login');
};

module.exports = {
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
};
