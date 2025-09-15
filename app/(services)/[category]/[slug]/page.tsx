"use client";
import React, { useEffect, useState } from "react";
import MapView from "@/components/MapView";

interface Details {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
  openingHours?: string;
  estimatedPrice?: number;
  rating?: number;
}

export default function PlaceDetails({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  // ✅ unwrap params promise
  const { slug } = React.use(params);

  const [data, setData] = useState<Details | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/place/${slug}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load details");
        setData(json);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, [slug]);

  if (error)
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 text-red-600">{error}</div>
    );
  if (!data)
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 opacity-70">Loading…</div>
    );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-semibold">{data.name}</h1>
        {typeof data.rating === "number" && (
          <div className="mt-1 text-sm bg-green-600 text-white inline-block px-2 py-0.5 rounded-md">
            {data.rating.toFixed(1)}
          </div>
        )}
        <p className="mt-2 text-black/70 dark:text-white/70">{data.address}</p>

        <div className="mt-4 space-y-2 text-sm">
          {typeof data.estimatedPrice === "number" && (
            <div>
              <span className="opacity-70">Estimated price:</span> ₹
              {data.estimatedPrice}
            </div>
          )}
          {data.phone && (
            <div>
              <span className="opacity-70">Phone:</span> {data.phone}
            </div>
          )}
          {data.website && (
            <div>
              <a
                className="text-blue-600"
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            </div>
          )}
          <div>
            <a
              className="inline-block rounded-md border px-3 py-1 mt-2 hover:bg-black/[.03] dark:hover:bg-white/[.06]"
              href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
          </div>
        </div>
      </section>

      <section className="min-h-[320px] rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
        <MapView
          center={{ lat: data.latitude, lng: data.longitude }}
          points={[
            {
              id: data.id,
              name: data.name,
              latitude: data.latitude,
              longitude: data.longitude,
              address: data.address,
            },
          ]}
        />
      </section>
    </main>
  );
}
