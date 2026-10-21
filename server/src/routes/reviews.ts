import { Router } from "express";
import { Review } from "../models/Review";
import { Listing } from "../models/Listing";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/listing/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({
      listingId: req.params.listingId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch {
    res.status(500).json({ message: "Could not load reviews" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const review = await Review.create({
      listingId,
      userId: req.userId,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { listingId: listing._id } },
      {
        $group: {
          _id: "$listingId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats[0]) {
      listing.rating = Math.round(stats[0].averageRating * 10) / 10;
      listing.reviewCount = stats[0].reviewCount;
      await listing.save();
    }

    res.status(201).json(review);
  } catch {
    res.status(500).json({ message: "Could not create review" });
  }
});

export default router;