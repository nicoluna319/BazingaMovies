import { NextRequest, NextResponse } from "next/server";
import { searchSeries } from "@/modules/series/infrastructure/tmdbClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { message: "Falta el parámetro de búsqueda 'q'" },
        { status: 400 }
      );
    }

    const results = await searchSeries(query.trim());

    return NextResponse.json(results);
  } catch (error) {
    console.error("[GET /api/series/search] error:", error);
    return NextResponse.json(
      { message: "Error buscando series" },
      { status: 500 }
    );
  }
}
