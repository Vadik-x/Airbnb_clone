import User from '../models/user.js'

export const renderSignup = async(req, res) => {
    res.render("users/signup");
};

export const signupCheck = async(req, res) => {
    try {
        let { firstName, lastName, email, username, password } = req.body;
        const newUser = new User({firstName, lastName, email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "user registered successfully");
            res.redirect("/home");
        });
    } catch (err) {
        req.flash("error", "username already existed");
        return res.redirect("/signup");
    }
};

export const renderLogin = async(req, res) => {
    res.render("users/login");
};

export const loginCheck = async(req, res) => {
    req.flash("success", "Welcome back to airbnb");
    let redirectUrl = res.locals.redirectUrl || "/home";
    res.redirect(redirectUrl);
};

export const logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("error", "you are logged out");
        res.redirect("/home");
    })
};