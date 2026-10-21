"use client";

import dynamic from "next/dynamic";

const ListingsMap = dynamic(
  () =>
    import("./ListingsMap").then((module) => ({
      default: module.ListingsMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full animate-pulse rounded-xl bg-slate-200" />
    ),
  },
);

export function ListingsMapClient({
  listings,
  center,
}: {
  listings: any[];
  center: { lat: number; lng: number };
}) {
  return (
    <div className="h-[350px] w-full sm:h-[450px] lg:h-[600px]">
      <ListingsMap listings={listings} center={center} />
    </div>
  );
}
