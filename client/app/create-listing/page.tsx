"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Listing } from "@/lib/types";

export default function CreateListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "service",
    price: 0,
    city: "Dortmund",
    address: "",
    lat: 51.5136,
    lng: 7.4653,
    images: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Listing>("/listings", {
        ...form,
        images: form.images
          ? form.images.split(",").map((url) => url.trim())
          : [],
      });

      return data;
    },
    onSuccess: (listing) => {
      router.push(`/listing/${listing._id}`);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
      className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">Create a listing</h1>

      <input
        value={form.title}
        onChange={(event) =>
          setForm({ ...form, title: event.target.value })
        }
        placeholder="Title"
        className="w-full rounded-lg border px-3 py-2 text-sm"
        required
      />

      <textarea
        value={form.description}
        onChange={(event) =>
          setForm({ ...form, description: event.target.value })
        }
        placeholder="Describe your service, event, rental, or community activity"
        className="h-32 w-full rounded-lg border p-3 text-sm"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={form.category}
          onChange={(event) =>
            setForm({ ...form, category: event.target.value })
          }
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="service">Service</option>
          <option value="event">Event</option>
          <option value="rental">Rental</option>
          <option value="community">Community</option>
        </select>

        <input
          type="number"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: Number(event.target.value) })
          }
          placeholder="Price in EUR"
          className="rounded-lg border px-3 py-2 text-sm"
        />

        <input
          value={form.city}
          onChange={(event) =>
            setForm({ ...form, city: event.target.value })
          }
          placeholder="City"
          className="rounded-lg border px-3 py-2 text-sm"
          required
        />

        <input
          value={form.address}
          onChange={(event) =>
            setForm({ ...form, address: event.target.value })
          }
          placeholder="Address"
          className="rounded-lg border px-3 py-2 text-sm"
          required
        />

        <input
          type="number"
          step="any"
          value={form.lat}
          onChange={(event) =>
            setForm({ ...form, lat: Number(event.target.value) })
          }
          placeholder="Latitude"
          className="rounded-lg border px-3 py-2 text-sm"
          required
        />

        <input
          type="number"
          step="any"
          value={form.lng}
          onChange={(event) =>
            setForm({ ...form, lng: Number(event.target.value) })
          }
          placeholder="Longitude"
          className="rounded-lg border px-3 py-2 text-sm"
          required
        />
      </div>

      <input
        value={form.images}
        onChange={(event) =>
          setForm({ ...form, images: event.target.value })
        }
        placeholder="Image URLs, separated by commas"
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      {mutation.isError && (
        <p className="text-sm text-red-600">Could not create listing.</p>
      )}

      <button
        disabled={mutation.isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Publish listing"}
      </button>
    </form>
  );
}