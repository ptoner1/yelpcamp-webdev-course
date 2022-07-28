const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const campgroundId = req.params.id;
    const campground = await Campground.findById(campgroundId);
    const review = await new Review(req.body.review);
    review.author = req.user.id;
    const time = Date.now();
    review.date = new Date(time).toLocaleDateString();
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campgroundId}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
};