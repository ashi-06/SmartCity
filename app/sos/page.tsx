"use client";
import { useEffect, useState } from "react";

export default function SosPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearest, setNearest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null)
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (!coords) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/nearest-hospital?lat=${coords.lat}&lng=${coords.lng}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load nearest hospital");
        setNearest(json.nearest);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [coords]);

  const locationText = coords ? `${coords.lat},${coords.lng}` : "";
  const mapsDir = nearest ? `https://www.google.com/maps/dir/?api=1&destination=${nearest.latitude},${nearest.longitude}` : "";
  const message = encodeURIComponent(
    `EMERGENCY! I need help. My location: ${locationText}${nearest ? `\nNearest 24/7 hospital: ${nearest.name} (${nearest.address || ""})` : ""}`
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">SOS</h1>

      <div className="flex gap-3">
        <a
          className="rounded-md border px-3 py-2 text-sm bg-red-600 text-white hover:opacity-90"
          href={`sms:?&body=${message}`}
        >
          Send SMS
        </a>
        <a
          className="rounded-md border px-3 py-2 text-sm bg-green-600 text-white hover:opacity-90"
          href={`https://wa.me/?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp
        </a>
      </div>

      {loading && <div className="opacity-70 text-sm">Locating nearest 24/7 hospital…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {nearest && (
        <section className="rounded-lg border border-black/10 dark:border-white/10 p-4">
          <div className="font-medium">Nearest 24/7 Hospital</div>
          <div className="mt-1">{nearest.name}</div>
          <div className="opacity-70 text-sm">{nearest.address}</div>
          <a className="mt-3 inline-block rounded-md border px-3 py-1 text-sm" href={mapsDir} target="_blank" rel="noopener noreferrer">
            Get directions
          </a>
        </section>
      )}
    </main>
  );
}


