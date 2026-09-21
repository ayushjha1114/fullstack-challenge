import type { Car } from "./api";

export type SortKey = "year_desc" | "year_asc" | "model_asc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "year_desc", label: "Newest first" },
  { key: "year_asc", label: "Oldest first" },
  { key: "model_asc", label: "Model A–Z" },
];

export function sortCars(cars: Car[], sortKey: SortKey): Car[] {
  const sorted = [...cars];
  switch (sortKey) {
    case "year_asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "model_asc":
      return sorted.sort((a, b) => a.model.localeCompare(b.model));
    default:
      return sorted.sort((a, b) => b.year - a.year);
  }
}