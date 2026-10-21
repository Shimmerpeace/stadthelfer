export type Category = "service" | "event" | "rental" | "community";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "provider" | "admin";
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  city: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  images: string[];
  rating: number;
  reviewCount: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Review {
  _id: string;
  listingId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}
