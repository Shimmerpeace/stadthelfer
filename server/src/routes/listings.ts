import { Router } from "express";
import { Listing } from "../models/Listing";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const {
      q,
      category,
      city,
      minPrice,
      maxPrice,
      lat,
      lng,
      radius = "10000",
      page = "1",
      limit = "12",
    } = req.query;

    const filter: Record<string, unknown> = { status: "approved" };

    if (q) {
      filter.$text = { $search: String(q) };
    }

    if (category) filter.category = category;
    if (city) filter.city = city;

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        (filter.price as Record<string, number>).$gte = Number(minPrice);
      }

      if (maxPrice) {
        (filter.price as Record<string, number>).$lte = Number(maxPrice);
      }
    }

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      };
    }

    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.min(50, Number(limit));

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Listing.countDocuments(filter),
    ]);

    res.json({
      listings,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch {
    res.status(500).json({ message: "Could not load listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch {
    res.status(500).json({ message: "Could not load listing" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      city,
      address,
      lat,
      lng,
      images,
    } = req.body;

    if (!title || !description || !category || !city || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const listing = await Listing.create({
      title,
      description,
      category,
      price: price ?? 0,
      city,
      address,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
      images: images ?? [],
      ownerId: req.userId,
      status: "approved",
    });

    res.status(201).json(listing);
  } catch {
    res.status(500).json({ message: "Could not create listing" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.ownerId.toString() === req.userId;
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Could not update listing" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.ownerId.toString() === req.userId;
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete listing" });
  }
});

export default router;