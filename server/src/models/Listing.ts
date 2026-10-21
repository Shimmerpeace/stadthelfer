import mongoose, { Schema, model } from "mongoose";

export interface IListing {
  title: string;
  description: string;
  category: "service" | "event" | "rental" | "community";
  price?: number;
  city: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  images: string[];
  rating: number;
  reviewCount: number;
  ownerId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
}

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["service", "event", "rental", "community"],
      required: true,
    },
    price: { type: Number, default: 0 },
    city: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

listingSchema.index({ location: "2dsphere" });
listingSchema.index({ title: "text", description: "text" });

export const Listing = model<IListing>("Listing", listingSchema);