import Link from "next/link";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing._id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="h-40 w-full overflow-hidden bg-slate-200">
        {listing.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {listing.category}
          </span>
          <span className="text-sm font-semibold">
            {listing.price === 0 ? "Free" : `€${listing.price}`}
          </span>
        </div>

        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{listing.city}</span>
          <span>
            ⭐ {listing.rating.toFixed(1)} ({listing.reviewCount})
          </span>
        </div>
      </div>
    </Link>
  );
}