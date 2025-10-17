import mongoose, { Schema, Types } from 'mongoose';
import User from './user.js';

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
        default: "no comment",
        set: v => v === "" ? undefined : v
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

let review = mongoose.model("review", reviewSchema);

export default review;