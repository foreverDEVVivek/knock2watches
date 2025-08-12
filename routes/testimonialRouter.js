const express = require('express');
const router = express.Router();

const {
    getTestimonial,
    postTestimonial,
    deleteTestimonial,
    editTestimonial,
    editTestimonialPage
} = require('../controller/testimonialController.js');

const { validateTestimonial, isLoggedIn } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');

// ✅ Get all testimonials & post a new one
router.route('/')
    .get(wrapAsync(getTestimonial))
    .post(isLoggedIn, validateTestimonial, wrapAsync(postTestimonial));

// ✅ Edit testimonial form
router.route('/:reviewId/edit')
    .get(isLoggedIn, wrapAsync(editTestimonialPage));

// ✅ Update or delete a testimonial
router.route('/:reviewId')
    .put(isLoggedIn, validateTestimonial, wrapAsync(editTestimonial))
    .delete(isLoggedIn, wrapAsync(deleteTestimonial));

module.exports = router;
