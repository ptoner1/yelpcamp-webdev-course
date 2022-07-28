const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
};

module.exports.submitRegisterForm = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
};


module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome back`);
    // return res.redirect('/campgrounds');

    // was hoping to redirect users to their originally requested page (not /campgrounds) before they were forced to login
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};


// Passport adds the logout() method to the req object below
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        req.flash('success', 'Bye!');
        res.redirect('/campgrounds')
    });
};