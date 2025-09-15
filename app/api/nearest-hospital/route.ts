import { NextRequest, NextResponse } from "next/server";
import { fetchOverpass } from "@/lib/apis/overpass";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius = parseInt(searchParams.get("radius") || "10000", 10);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // 24/7 hospitals or emergency departments
    const lines = [
      `node[amenity=hospital][opening_hours="24/7"](around:${radius},${lat},${lng});`,
      `way[amenity=hospital][opening_hours="24/7"](around:${radius},${lat},${lng});`,
      `node[emergency=yes](around:${radius},${lat},${lng});`,
      `way[emergency=yes](around:${radius},${lat},${lng});`,
    ];
    const query = `
      [out:json][timeout:25];
      (
        ${lines.join("\n        ")}
      );
      out center;
    `;
    const data = await fetchOverpass(query, { retries: 4 });

    const places = (data.elements || [])
      .map((el: any) => {
        const c = el.center || el;
        const d = Math.hypot(c.lat - lat, c.lon - lng);
        return {
          id: `${el.type}/${el.id}`,
          name: el.tags?.name || "Unnamed Hospital",
          latitude: c.lat,
          longitude: c.lon,
          address: [el.tags?.["addr:housenumber"], el.tags?.["addr:street"], el.tags?.["addr:city"]]
            .filter(Boolean)
            .join(", "),
          distance: d,
        };
      })
      .sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json({ nearest: places[0] || null, results: places });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}


