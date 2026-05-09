import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      name: "The Grand Palace",
      location: "Bangalore",
      pricePerNight: 4500,
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    {
      id: "2",
      name: "Urban Stay",
      location: "Bangalore",
      pricePerNight: 3200,
      rating: 4.2,
      imageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    },
  ]);
}
