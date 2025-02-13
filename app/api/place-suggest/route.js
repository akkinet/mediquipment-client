import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("query");

  if (!input) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&types=address&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json({ error: data.status }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data.predictions });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
