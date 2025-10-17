import listing from "../models/listening.js";
import Review from "../models/review.js"

export const createReview = async (req, res) => {
  const listingDetail = await listing.findById(req.params.id);
  let reviewData = {
    ...req.body,
    owner: res.locals.currUser._id
  };
  const newReview = await Review.create(reviewData);
  listingDetail.reviews.push(newReview);
  await listingDetail.save();
  req.flash("reviewCreated", "review created successfully");
  res.redirect(`/home/${req.params.id}`);
};

export const destroyReview = async (req, res) => {
  const { id, reviewID } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  req.flash("reviewDeleted", "review deleted sucessfully");
  res.redirect(`/home/${id}`);
};