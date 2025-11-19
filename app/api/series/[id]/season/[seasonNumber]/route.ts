// app/api/series/[id]/season/[seasonNumber]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSeasonEpisodes } from "@/modules/series/infrastructure/tmdbClient";

interface Params {
  params: Promise<{
    id: string;
    seasonNumber: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id, seasonNumber } = await params;

    const season = parseInt(seasonNumber, 10);

    if (!id || Number.isNaN(season)) {
      return NextResponse.json(
        { message: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    const episodes = await getSeasonEpisodes(id, season);

    return NextResponse.json(episodes);
  } catch (error) {
    console.error("[GET /api/series/[id]/season/[seasonNumber]] error:", error);
    return NextResponse.json(
      { message: "Error obteniendo episodios" },
      { status: 500 }
    );
  }
}
