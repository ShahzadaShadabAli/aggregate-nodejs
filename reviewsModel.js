import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    stars: String,
    product: String,
    category: String
})

const Review = mongoose.model('Review', reviewSchema)
export default Review