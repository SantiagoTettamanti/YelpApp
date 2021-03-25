const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// const { reviewSchema } = require('../schemas.js');
// const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/Campground');
const Review = require('../models/review');
const catchAsync = require('../utilities/catchAsync');


// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// };



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a review for this campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;





