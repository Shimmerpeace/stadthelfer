import mongoose, { Schema, model } from "mongoose";

export interface IReview {
  listingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);