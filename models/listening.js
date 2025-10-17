import mongoose, { Schema } from 'mongoose';
import Review from "./review.js";
import User from './user.js';

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            default: "no_filename"
        }
    },
    type: {
        type: String,
        default: "type not specified",
        set: v => v === "" ? undefined : v
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "No description",
        set: v => v === "" ? undefined : v
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    rating: {
        type: Number,
        require: true,
    },
    guestFavorite: {
        type: Boolean,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);

export default listing;
