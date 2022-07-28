const Campground = require('./models/campground');
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please sign in to use this feature');
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this post');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this review');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
};


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    if (req.body.review.rating === "on") {
        req.flash('error', 'All reviews require a star rating between 1-5');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next()
}

