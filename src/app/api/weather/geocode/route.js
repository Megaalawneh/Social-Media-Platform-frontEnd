import { NextResponse } from "next/server";

export async function GET(request) {
  const city = new URL(request.url).searchParams.get("city")?.trim();
  if (!city || city.length > 100) {
    return NextResponse.json(
      { error: "Enter a valid city name." },
      { status: 400 },
    );
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) {
    return NextResponse.json(
      { error: "City lookup service failed." },
      { status: 502 },
    );
  }

  const { results = [] } = await response.json();
  const [location] = results;
  if (!location) {
    return NextResponse.json(
      { error: "City not found. Check the spelling and try again." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    name: [location.name, location.admin1, location.country]
      .filter(Boolean)
      .join(", "),
    lat: location.latitude,
    lon: location.longitude,
  });
}
