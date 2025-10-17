import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/expressError.js";
import { reviewSchema } from "../schema.js";
import { isLoggedin } from "../middleware.js";
import { createReview, destroyReview } from "../controllers/reviews.js"

const router = express.Router({ mergeParams: true });

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
}

router.post("/", isLoggedin, validateReview, wrapAsync(createReview));

router.delete("/:reviewID", isLoggedin, wrapAsync(destroyReview));

export default router;
