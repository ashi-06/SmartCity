const DEFAULT_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

export async function fetchOverpass(
  query: string,
  options?: { endpoints?: string[]; retries?: number }
): Promise<any> {
  const endpoints = options?.endpoints ?? DEFAULT_ENDPOINTS;
  const retries = Math.max(1, options?.retries ?? 3);

  let lastError: any = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    const endpoint = endpoints[attempt % endpoints.length];
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }).toString(),
        // don't cache
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        // Retry on 429/5xx
        if (res.status === 429 || res.status >= 500) {
          lastError = new Error(`Overpass error: ${res.status}`);
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
          continue;
        }
        const text = await res.text();
        throw new Error(`Overpass error: ${res.status} ${text}`);
      }
      return await res.json();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastError ?? new Error("Overpass request failed");
}


