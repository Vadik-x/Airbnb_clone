import Joi from "joi";

export const listingSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }).required(),
  type: Joi.string().allow(""),
  location: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
});

export const updateListingSchema = Joi.object({
  title: Joi.string(),
  image: Joi.object({
    url: Joi.string().uri(),
    filename: Joi.string()
  }),
  type: Joi.string().allow(""),
  location: Joi.string(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0),
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().required()
});
