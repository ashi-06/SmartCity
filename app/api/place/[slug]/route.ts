import { NextRequest, NextResponse } from "next/server";
import { fetchOverpass } from "@/lib/apis/overpass";

function parseSlug(slug: string) {
  const [type, id] = slug.split("/");
  if (!type || !id) throw new Error("Invalid slug");
  return { type, id };
}

function formatAddress(tags: any): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);
  return tags["addr:full"] || parts.join(", ");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { type, id } = parseSlug(decodeURIComponent(slug));
    const query = `
      [out:json][timeout:25];
      ${type}(id:${id});
      out center tags;
    `;
    const data = await fetchOverpass(query, { retries: 4 });
    const el = (data.elements || [])[0];
    if (!el) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const center = el.center || el;
    const details = {
      id: `${el.type}/${el.id}`,
      name: el.tags?.name || "Unnamed",
      address: formatAddress(el.tags || {}),
      latitude: center.lat,
      longitude: center.lon,
      phone: el.tags?.phone || el.tags?.["contact:phone"],
      website: el.tags?.website,
      openingHours: el.tags?.opening_hours,
      // Synthetic price and rating as placeholders (OSM lacks these fields)
      estimatedPrice: 500 + ((Number(String(el.id).slice(-3)) % 30) * 50),
      rating: (Number(String(el.id).slice(-3)) % 5) + 1,
      tags: el.tags || {},
    } as any;

    return NextResponse.json(details);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}


