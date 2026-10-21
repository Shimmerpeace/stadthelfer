import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker/locale/de";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Listing } from "../models/Listing";
import { Review } from "../models/Review";
import { connectDB } from "../config/db";

const cities = [
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
  { name: "Essen", lat: 51.4556, lng: 7.0116 },
  { name: "Bochum", lat: 51.4818, lng: 7.2165 },
  { name: "Cologne", lat: 50.9375, lng: 6.9603 },
];

const categories = ["service", "event", "rental", "community"] as const;

const titles: Record<string, string[]> = {
  service: [
    "Mobile Bicycle Repair",
    "Home Cleaning Service",
    "Laptop Repair Specialist",
    "Moving Help in NRW",
    "Private German Tutor",
  ],
  event: [
    "Language Café for Learners",
    "Startup Networking Evening",
    "Open-Air Jazz Concert",
    "Community Football Match",
    "Tech Meetup Dortmund",
  ],
  rental: [
    "Furnished Room Near University",
    "Modern 2-Room Apartment",
    "Coworking Desk in City Center",
    "Parking Space for Rent",
    "Studio Apartment with Balcony",
  ],
  community: [
    "Neighborhood Repair Café",
    "Volunteer Garden Project",
    "Food Sharing Initiative",
    "Local Book Exchange",
    "Weekend Hiking Group",
  ],
};

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const users = [];

  for (let i = 0; i < 20; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: await bcrypt.hash("password123", 10),
      role: i < 3 ? "admin" : i < 10 ? "provider" : "user",
    });
  }

  const createdUsers = await User.insertMany(users);

  const listings = [];

  for (let i = 0; i < 150; i++) {
    const city = faker.helpers.arrayElement(cities);
    const category = faker.helpers.arrayElement(categories);
    const owner = faker.helpers.arrayElement(createdUsers);

    const lat = city.lat + faker.number.float({ min: -0.08, max: 0.08 });
    const lng = city.lng + faker.number.float({ min: -0.08, max: 0.08 });

    listings.push({
      title: faker.helpers.arrayElement(titles[category]),
      description: faker.lorem.paragraphs(2),
      category,
      price: faker.number.int({ min: 0, max: 120 }),
      city: city.name,
      address: `${faker.location.streetAddress()}, ${city.name}`,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      images: [
        `https://picsum.photos/seed/${faker.string.uuid()}/800/500`,
      ],
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 80 }),
      ownerId: owner._id,
      status: "approved",
    });
  }

  const createdListings = await Listing.insertMany(listings);

  const reviews = [];

  for (const listing of createdListings) {
    const reviewCount = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        listingId: listing._id,
        userId: faker.helpers.arrayElement(createdUsers)._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      });
    }
  }

  await Review.insertMany(reviews);

  console.log(`Created ${createdUsers.length} users`);
  console.log(`Created ${createdListings.length} listings`);
  console.log(`Created ${reviews.length} reviews`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});