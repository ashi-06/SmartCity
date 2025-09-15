"use client";
import { useEffect, useState } from "react";

interface Weather {
  temperatureC: number;
  description: string;
  icon?: string;
  city?: string;
  alerts?: Array<{ event?: string; description?: string }>;
}

export default function WeatherPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [q, setQ] = useState("");
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null)
    );
  }, []);

  async function fetchByCoords(lat: number, lng: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load weather");
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchByCity(city: string) {
    if (!city) return;
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", city);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      const res = await fetch(url.toString(), { headers: { "User-Agent": "SmartCityConnect" } });
      const arr = await res.json();
      if (arr?.length) {
        const lat = parseFloat(arr[0].lat);
        const lon = parseFloat(arr[0].lon);
        fetchByCoords(lat, lon);
      }
    } catch {}
  }

  useEffect(() => {
    if (coords) fetchByCoords(coords.lat, coords.lng);
  }, [coords]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">Weather</h1>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          fetchByCity(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search city..."
          className="flex-1 rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2"
        />
        <button className="rounded-md border px-3 py-2 text-sm">Search</button>
      </form>

      {loading && <div className="opacity-70 text-sm">Loading weather…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {data && (
        <section className="rounded-lg border border-black/10 dark:border-white/10 p-4">
          <div className="text-lg font-medium">
            {data.city || "Current location"} — {data.temperatureC.toFixed(1)}°C
          </div>
          <div className="opacity-70 capitalize">{data.description}</div>
          {data.alerts && data.alerts.length > 0 && (
            <div className="mt-4">
              <div className="font-medium">Alerts</div>
              <ul className="list-disc pl-5 space-y-2">
                {data.alerts.map((a, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-medium">{a.event || "Weather alert"}</div>
                    {a.description && <div className="opacity-70 whitespace-pre-wrap">{a.description}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}


