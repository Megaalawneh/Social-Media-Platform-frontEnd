import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const latValue = searchParams.get("lat");
  const lonValue = searchParams.get("lon");
  const lat = Number(latValue);
  const lon = Number(lonValue);
  if (
    latValue === null ||
    lonValue === null ||
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90 ||
    !Number.isFinite(lon) ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      { error: "Valid city coordinates are required." },
      { status: 400 },
    );
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("appid", apiKey);

  const response = await fetch(url, { next: { revalidate: 59 } });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Weather provider request failed." },
      { status: 502 },
    );
  }

  return NextResponse.json(await response.json());
}
