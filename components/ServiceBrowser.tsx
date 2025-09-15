"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ServiceCard from "./ui/ServiceCard";
import SidebarFilters, { Filters } from "./SidebarFilters";

type Category = "hospitals" | "restaurants" | "hotels" | "repairs" | "fitness";

interface PlaceItem {
  id: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  openNow?: boolean;
  location?: { latitude: number; longitude: number };
}

type SortKey = "relevance" | "rating" | "price" | "distance";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function ServiceBrowser({ category }: { category: Category }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [items, setItems] = useState<PlaceItem[]>([]);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ distance: 3000, rating: 0, price: "", openNow: false });
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location access denied. Please enable it to see nearby results."),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    async function load() {
      if (!coords) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          lat: String(coords.lat),
          lng: String(coords.lng),
          category,
          sort,
          radius: String(filters.distance),
          q: query,
          openNow: String(filters.openNow),
        });
        const res = await fetch(`/api/places?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch places");
        setItems(data.items || []);
      } catch (e: any) {
        setError(e.message || "Failed to fetch places");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [coords, category, sort, filters.distance, query, filters.openNow]);

  const mapsUrl = useMemo(() => {
    if (!coords) return null;
    const q = encodeURIComponent(`${coords.lat},${coords.lng}`);
    return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=14/${coords.lat}/${coords.lng}`;
  }, [coords]);

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // query state already bound
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name (e.g., Apollo)"
              className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2"
            />
          </form>
        </div>
        <div className="text-sm text-black/70 dark:text-white/70">
          {coords ? (
            <span>
              Showing near {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          ) : (
            <span>Waiting for location...</span>
          )}
        </div>
        <div className="sm:ml-auto">
          <label className="mr-2 text-sm">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="price">Price (low to high)</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 text-red-800 p-3 text-sm">
          {error}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <SidebarFilters onChange={setFilters} />
        </div>
        <div className="md:col-span-1 space-y-3">
          {loading && <div className="text-sm opacity-70">Loading...</div>}
          {!loading && items.length === 0 && (
            <div className="text-sm opacity-70">No results found.</div>
          )}
          {items
            .filter((p) => (filters.rating ? (p.rating || 0) >= filters.rating : true))
            .filter((p) => {
              if (!filters.price) return true;
              const price = (p as any).estimatedPrice as number | undefined;
              if (!price) return false;
              if (filters.price === "low") return price < 1000;
              if (filters.price === "medium") return price >= 1000 && price < 2500;
              return price >= 2500;
            })
            .map((p) => (
              <ServiceCard
                key={p.id}
                category={category}
                id={p.id}
                slug={(p as any).slug || p.id}
                name={p.name}
                address={p.address}
                rating={p.rating}
                estimatedPrice={(p as any).estimatedPrice}
                location={p.location}
              />
            ))}
        </div>
        <div className="md:col-span-1 min-h-[300px] md:min-h-full rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
          {coords ? (
            <MapView
              center={{ lat: coords.lat, lng: coords.lng }}
              points={items
                .filter((p) => p.location)
                .map((p) => ({
                  id: p.id,
                  name: p.name,
                  latitude: p.location!.latitude,
                  longitude: p.location!.longitude,
                  address: p.address,
                }))}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-sm opacity-70">Map loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}


