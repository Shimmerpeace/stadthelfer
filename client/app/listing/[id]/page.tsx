"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Listing, Review } from "@/lib/types";

export default function ListingPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const listingQuery = useQuery<Listing>({
    queryKey: ["listing", params.id],
    queryFn: async () => {
      const { data } = await api.get<Listing>(`/listings/${params.id}`);
      return data;
    },
  });

  const reviewsQuery = useQuery<Review[]>({
    queryKey: ["reviews", params.id],
    queryFn: async () => {
      const { data } = await api.get<Review[]>(
        `/reviews/listing/${params.id}`
      );
      return data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      await api.post("/reviews", {
        listingId: params.id,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", params.id] });
      queryClient.invalidateQueries({ queryKey: ["listing", params.id] });
    },
  });

  if (listingQuery.isLoading) return <p>Loading...</p>;
  if (listingQuery.isError || !listingQuery.data) {
    return <p className="text-red-600">Listing not found.</p>;
  }

  const listing = listingQuery.data;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {listing.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-72 w-full object-cover"
            />
          )}

          <div className="space-y-3 p-6">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {listing.category}
            </span>

            <h1 className="text-2xl font-bold">{listing.title}</h1>

            <p className="text-slate-600">{listing.description}</p>

            <div className="grid gap-2 text-sm text-slate-600">
              <p>📍 {listing.address}</p>
              <p>🏙️ {listing.city}</p>
              <p>
                💶 {listing.price === 0 ? "Free" : `From €${listing.price}`}
              </p>
              <p>
                ⭐ {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Reviews</h2>

          <div className="space-y-4">
            {reviewsQuery.data?.map((review) => (
              <div
                key={review._id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.userId.name}</p>
                  <p className="text-sm">⭐ {review.rating}/5</p>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Leave a review</h2>

          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience..."
            className="mt-3 h-28 w-full rounded-lg border p-3 text-sm"
          />

          <button
            onClick={() => reviewMutation.mutate()}
            disabled={reviewMutation.isPending}
            className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {reviewMutation.isPending ? "Submitting..." : "Submit review"}
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">
            Listed by {listing.ownerId.name}
          </p>
          <p className="text-sm text-slate-600">{listing.ownerId.email}</p>
        </div>
      </aside>
    </div>
  );
}