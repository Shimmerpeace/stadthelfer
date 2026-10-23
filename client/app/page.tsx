"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useFilterStore } from "@/lib/useFilterStore";
import { Filters } from "@/components/Filters";
import { ListingCard } from "@/components/ListingCard";
import { ListingsMapClient } from "@/components/ListingsMapClient";
import type { ListingsResponse } from "@/lib/types";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const { search, category, city, radius, center } = useFilterStore();

  const { data, isLoading, isError } = useQuery<ListingsResponse>({
    queryKey: ["listings", { search, category, city, radius, center, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        lat: String(center.lat),
        lng: String(center.lng),
        radius: String(radius),
      });

      if (search) params.set("q", search);
      if (category) params.set("category", category);
      if (city) params.set("city", city);

      const { data } = await api.get<ListingsResponse>(
        `/listings?${params.toString()}`,
      );

      return data;
    },
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-red-600 p-5 text-white shadow-sm sm:p-8 lg:p-10">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          Find services and events near you.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base lg:text-lg">
          Discover trusted local help, community activities, rentals, and events
          across Dortmund and North Rhine-Westphalia.
        </p>
      </section>

      {/* Filters */}
      <div className="mt-6">
        <Filters />
      </div>

      {/* Listings and map */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        {/* Listings */}
        <div className="space-y-5">
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {isError && (
            <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
              Failed to load listings. Please try again.
            </p>
          )}

          {!isLoading && !isError && data?.listings?.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-600">
              No listings found for your current filters.
            </p>
          )}

          {!isLoading && !isError && data?.listings && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5">
              {data.listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {data.page} of {data.totalPages}
              </span>

              <button
                disabled={page === data.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="order-first lg:order-none">
          <div className="sticky top-20">
            <ListingsMapClient
              listings={data?.listings ?? []}
              center={center}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
