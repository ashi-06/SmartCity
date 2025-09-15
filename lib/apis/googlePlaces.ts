export type PlaceCategory = "hospitals" | "restaurants" | "hotels" | "repairs" | "fitness";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  location?: Coordinates;
}

/**
 * Fetch nearby places via Google Places API (Places API Nearby Search)
 * Expects NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env.
 */
export async function fetchNearbyPlaces(params: {
  coordinates: Coordinates;
  category: PlaceCategory;
  radiusMeters?: number;
}): Promise<PlaceResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

  const typeMap: Record<PlaceCategory, string> = {
    hospitals: "hospital",
    restaurants: "restaurant",
    hotels: "lodging",
    repairs: "car_repair",
    fitness: "gym",
  };

  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("location", `${params.coordinates.latitude},${params.coordinates.longitude}`);
  url.searchParams.set("radius", String(params.radiusMeters ?? 5000));
  url.searchParams.set("type", typeMap[params.category]);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data = await res.json();

  return (data.results ?? []).map((r: any) => ({
    id: r.place_id,
    name: r.name,
    address: r.vicinity ?? r.formatted_address ?? "",
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    location: r.geometry?.location
      ? { latitude: r.geometry.location.lat, longitude: r.geometry.location.lng }
      : undefined,
  }));
}

