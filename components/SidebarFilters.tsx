"use client";
import { useEffect, useState } from "react";

export interface Filters {
  distance: number; // meters
  rating: number;   // min rating
  price: string;    // low|medium|high
  openNow: boolean;
}

export default function SidebarFilters({ onChange }: { onChange: (f: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({ distance: 3000, rating: 0, price: "", openNow: false });

  useEffect(() => { onChange(filters); }, [filters, onChange]);

  return (
    <aside className="space-y-4 text-sm">
      <div>
        <div className="font-medium mb-1">Distance</div>
        <select
          value={filters.distance}
          onChange={(e) => setFilters((f) => ({ ...f, distance: Number(e.target.value) }))}
          className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
        >
          <option value={1000}>1 km</option>
          <option value={3000}>3 km</option>
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
        </select>
      </div>

      <div>
        <div className="font-medium mb-1">Minimum rating</div>
        <select
          value={filters.rating}
          onChange={(e) => setFilters((f) => ({ ...f, rating: Number(e.target.value) }))}
          className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
        >
          <option value={0}>Any</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
        </select>
      </div>

      <div>
        <div className="font-medium mb-1">Price</div>
        <select
          value={filters.price}
          onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
          className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
        >
          <option value="">Any</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => setFilters((f) => ({ ...f, openNow: e.target.checked }))}
        />
        Open now
      </label>
    </aside>
  );
}


