import { create } from "zustand";
import type { Category } from "./types";

interface FilterState {
  search: string;
  category: Category | "";
  city: string;
  radius: number;
  center: { lat: number; lng: number };
  setSearch: (search: string) => void;
  setCategory: (category: Category | "") => void;
  setCity: (city: string) => void;
  setRadius: (radius: number) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  category: "",
  city: "",
  radius: 10000,
  center: { lat: 51.5136, lng: 7.4653 },
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setCity: (city) => set({ city }),
  setRadius: (radius) => set({ radius }),
  setCenter: (center) => set({ center }),
  reset: () =>
    set({
      search: "",
      category: "",
      city: "",
      radius: 10000,
      center: { lat: 51.5136, lng: 7.4653 },
    }),
}));