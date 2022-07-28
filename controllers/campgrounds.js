const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });


const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geodata.body.features[0].geometry;
    newCampground.author = req.user.id;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newCampground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${newCampground._id}`)
};

module.exports.renderShowPage = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Sorry! We cant find that campground');
        return res.redirect('/campgrounds');
    }
    const user = req.user;

    res.render('campgrounds/show', { campground, user })
};


module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
};

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        };
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    };
    await campground.save();
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${req.params.id}`)
};

module.exports.deleteCampground = async (req, res) => {
    const { title } = await Campground.findById(req.params.id)
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Successfully deleted "${title}" campground`)
    res.redirect('/campgrounds')
};