export interface WeatherData {
  temperatureC: number;
  description: string;
  icon?: string;
}

/**
 * Fetch current weather for coordinates via OpenWeather (One Call or Weather API v2.5)
 * Expects NEXT_PUBLIC_OPENWEATHER_API_KEY in env.
 */
export async function fetchCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_OPENWEATHER_API_KEY");

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
  const data = await res.json();

  return {
    temperatureC: data.main?.temp ?? 0,
    description: data.weather?.[0]?.description ?? "",
    icon: data.weather?.[0]?.icon,
  };
}

