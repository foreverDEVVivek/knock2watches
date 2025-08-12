const Review = require('../models/reviewSchema.js');
const Watch = require('../models/watchSchema.js'); // if reviews are linked to watches

// ✅ Get all testimonials
const getTestimonial = async (req, res) => {
    const allReviews = await Review.find({})
        .populate('author', 'username') // show username
        .sort({ createdAt: -1 }); // latest first
    res.render('ejsFiles/testimonial.ejs', { allReviews });
};

// ✅ Post a testimonial (only logged-in users)
const postTestimonial = async (req, res) => {
    const { comment, rating } = req.body;

    if (!comment || !rating) {
        req.flash('error', "Please provide both comment and rating.");
        return res.redirect('/testimonial');
    }

    const newReview = new Review({
        comment,
        rating,
        author: req.user._id, // from session
    });

    await newReview.save();

    req.flash('success', "Thank you for your valuable feedback!");
    res.redirect("/testimonial");
};

// ✅ Edit testimonial
const editTestimonial = async (req, res) => {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect('/testimonial');
    }

    review.comment = comment;
    review.rating = rating;
    await review.save();

    req.flash("success", "Your comment has been updated!");
    res.redirect('/testimonial');
};

// ✅ Delete testimonial
const deleteTestimonial = async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect('/testimonial');
    }

    await review.deleteOne();
    req.flash("success", "Your review has been successfully deleted!");
    res.redirect('/testimonial');
};

// ✅ Render edit page
const editTestimonialPage = async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect('/testimonial');
    }

    res.render('ejsFiles/reviewForm.ejs', { editReview: review });
};

module.exports = {
    getTestimonial,
    postTestimonial,
    editTestimonial,
    deleteTestimonial,
    editTestimonialPage
};
