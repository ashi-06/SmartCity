import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenWeather API key" }, { status: 500 });
    }

    const currentUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    currentUrl.searchParams.set("lat", String(lat));
    currentUrl.searchParams.set("lon", String(lng));
    currentUrl.searchParams.set("appid", apiKey);
    currentUrl.searchParams.set("units", "metric");

    const currentRes = await fetch(currentUrl.toString());
    if (!currentRes.ok) {
      return NextResponse.json({ error: `OpenWeather error: ${currentRes.status}` }, { status: 500 });
    }
    const current = await currentRes.json();

    const oneCallUrl = new URL("https://api.openweathermap.org/data/3.0/onecall");
    oneCallUrl.searchParams.set("lat", String(lat));
    oneCallUrl.searchParams.set("lon", String(lng));
    oneCallUrl.searchParams.set("appid", apiKey);
    oneCallUrl.searchParams.set("units", "metric");
    oneCallUrl.searchParams.set("exclude", "minutely,hourly,daily");

    const oneCallRes = await fetch(oneCallUrl.toString());
    const oneCall = oneCallRes.ok ? await oneCallRes.json() : {};

    return NextResponse.json({
      temperatureC: current.main?.temp ?? 0,
      description: current.weather?.[0]?.description ?? "",
      icon: current.weather?.[0]?.icon,
      city: current.name,
      alerts: oneCall.alerts || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}


