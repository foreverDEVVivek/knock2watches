const nodemailer = require('nodemailer');
require('dotenv').config(); // load EMAIL_USER and EMAIL_PASS

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change to another service
    port: 465, // SMTP port for Gmail
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter connection (optional but useful for debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error('Email server connection failed:', error);
    } else {
        console.log('Email server is ready to send messages ✅');
    }
});

module.exports = transporter;
