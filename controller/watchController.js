const wrapAsync=require('../utils/wrapAsync.js');
const Watches=require('../models/watchSchema.js');
const WatchReview=require('../models/reviewWatches.js');
const mongoose = require('mongoose');

const getWatches=wrapAsync(async(req,res)=>{
    const allWatchDetails=await Watches.find({});
    res.render('ejsFiles/watchs.ejs',{allWatchDetails});   
})

const showWatch = wrapAsync(async (req, res) => {
  // 1) ensure reviews are populated and each review's author is populated with ONLY the fields we need
  const watchDetail = await Watches.findById(req.params.id).populate({
    path: 'reviews',                          // reviews array on Watch
    populate: { path: 'author', select: 'username name email' } // nested populate author
  });

  if (!watchDetail) {
    req.flash('error', 'Watch not found');
    return res.redirect('/watchs');
  }

  // 2) map to a light-weight reviews array to pass to the view
  const reviews = (watchDetail.reviews || []).map(r => ({
    _id: r._id,
    comment: r.comment,
    rating: r.rating,
    createdAt: r.createdAt,
    authorName: r.author ? (r.author.username || r.author.name || r.author.email) : 'User'
  }));

  // 3) render the page — pass reviews separately (you can still pass watchDetail if you want)
  res.render('ejsFiles/showWatches.ejs', {
    watchDetail,
    reviews,
    success: '',
    error: ''
  });
});



const reviewForWatch = wrapAsync(async (req, res) => {
  const { comment, rating } = req.body;
  
  const watch = await Watches.findById(req.params.id);
  if (!watch) {
    req.flash('error', 'Watch not found');
    return res.redirect('/watchs');
  }

  // Create new review
  const newReview = new WatchReview({
    product: watch._id,
    author: req.user._id,
    comment,
    rating
  });

  await newReview.save();

  // Push review to watch's reviews array (if schema supports it)
  watch.reviews.push(newReview._id);
  await watch.save();

  req.flash('success', 'Your feedback is valuable for us!');
  res.redirect(`/watchs/${req.params.id}`);
});

const deleteReviewOfWatch = wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Find review
  const review = await WatchReview.findById(reviewId);
  if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect(`/watchs/${id}`);
  }

  // Authorization check
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to delete this review.');
    return res.redirect(`/watchs/${id}`);
  }

  // Remove from Watch's reviews array
  await Watches.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete review
  await WatchReview.findByIdAndDelete(reviewId);

  req.flash('success', 'Your review has been deleted!');
  res.redirect(`/watchs/${id}`);
});


const renderEditReviewPage = wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  const editReview = await WatchReview.findById(reviewId).populate('author', 'username name email');
  const watchDetail = await Watches.findById(id);

  if (!editReview || !watchDetail) {
    req.flash('error', 'Review or watch not found');
    return res.redirect('/watchs');
  }

  // Authorization check
  if (!editReview.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to edit this review.');
    return res.redirect(`/watchs/${id}`);
  }

  res.render('ejsFiles/editReviewOfWatch.ejs', { editReview, watchDetail });
});

const editReviewOfWatch = wrapAsync(async (req, res) => {
  const { reviewId, id } = req.params;
  const { comment, rating } = req.body;

  const review = await WatchReview.findById(reviewId);
  if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect(`/watchs/${id}`);
  }

  // Authorization check
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to edit this review.');
    return res.redirect(`/watchs/${id}`);
  }

  // Update review
  await WatchReview.findByIdAndUpdate(reviewId, {
    comment,
    rating
  });

  req.flash('success', 'Your review has been updated!');
  res.redirect(`/watchs/${id}`);
});


module.exports={getWatches,showWatch,reviewForWatch,deleteReviewOfWatch,editReviewOfWatch,renderEditReviewPage};