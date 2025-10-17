import listing from "./models/listening.js";
import { listingSchema, updateListingSchema } from './schema.js';
import ExpressError from './utils/expressError.js';

export const isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login");
    }
    next()
};

export const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const isOwner = async(req, res, next) => {
    let { id } = req.params;
    const data = await listing.findById(id);
    if(res.locals.currUser && !(data.owner[0]._id.toString() === res.locals.currUser._id.toString())) {
        req.flash("reviewDeleted", "you do not have permission to edit and delete");
        return res.redirect(`/home/${id}`);
    }
    next();
};

export const validateListing = (req, res, next) => {
  if (req.file) {
    req.body.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

export const validateListingUpdate = (req, res, next) => {
  const {error} = updateListingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};