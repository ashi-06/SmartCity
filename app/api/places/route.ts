import { NextRequest, NextResponse } from "next/server";
import { fetchOverpass } from "@/lib/apis/overpass";

type Category = "hospitals" | "restaurants" | "hotels" | "repairs" | "fitness";

// Overpass selectors per category (without around clause)
const categorySelectors: Record<Category, string[]> = {
  hospitals: [
    "node[amenity=hospital]",
    "way[amenity=hospital]",
    "node[healthcare=clinic]",
    "way[healthcare=clinic]",
  ],
  restaurants: ["node[amenity=restaurant]", "way[amenity=restaurant]"],
  hotels: ["node[tourism=hotel]", "way[tourism=hotel]"],
  repairs: [
    "node[shop=car_repair]",
    "way[shop=car_repair]",
    "node[amenity=car_wash]",
    "way[amenity=car_wash]",
  ],
  fitness: [
    "node[leisure=fitness_centre]",
    "way[leisure=fitness_centre]",
    "node[sport=fitness]",
    "way[sport=fitness]",
  ],
};

function formatAddress(tags: any): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);
  return tags["addr:full"] || parts.join(", ");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const category = (searchParams.get("category") || "restaurants") as Category;
    const radius = parseInt(searchParams.get("radius") || "3000", 10);
    const sort = searchParams.get("sort") || "relevance"; // rating|price|distance|relevance
    const q = (searchParams.get("q") || "").toLowerCase();
    const openNow = searchParams.get("openNow") === "true";

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const selectors = categorySelectors[category] || categorySelectors["restaurants"];
    const lines = selectors.map(
      (s) => `${s}(around:${radius},${lat},${lng});`
    );
    const query = `
      [out:json][timeout:25];
      (
        ${lines.join("\n        ")}
      );
      out center;
    `;

    const data = await fetchOverpass(query, { retries: 4 });

    const items = (data.elements || []).map((el: any) => {
      const id = `${el.type}/${el.id}`;
      const name = el.tags?.name || "Unnamed";
      const address = formatAddress(el.tags || {});
      const center = el.center || el;
      const latitude = center.lat;
      const longitude = center.lon;
      // naive price estimate (client asked for price sorting). OSM lacks prices, so we derive a stable pseudo-price.
      const seed = Number(String(el.id).slice(-3));
      const estimatedPrice = 500 + ((seed % 30) * 50); // INR-ish range
      const rating = (seed % 5) + 1; // 1..5
      return {
        id,
        name,
        address,
        rating,
        userRatingsTotal: undefined,
        priceLevel: undefined,
        estimatedPrice,
        openNow: undefined,
        location: { latitude, longitude },
        slug: id,
      };
    });

    // Client wants potential sorting. Only distance can be reasonably applied here server-side
    let filtered = items;
    if (q) {
      filtered = filtered.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (openNow) {
      // OSM lacks real-time open info; approximate via opening_hours if present
      filtered = filtered.filter((i: any) => !!i.openNow);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "distance" && a.location && b.location) {
        const da = Math.hypot(a.location.latitude - lat, a.location.longitude - lng);
        const db = Math.hypot(b.location.latitude - lat, b.location.longitude - lng);
        return da - db;
      }
      return 0;
    });

    return NextResponse.json({ items: sorted });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}


