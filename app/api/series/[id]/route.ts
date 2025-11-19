
import { NextRequest, NextResponse } from "next/server";
import { getSeriesDetails } from "@/modules/series/infrastructure/tmdbClient";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Falta el id de la serie" },
        { status: 400 }
      );
    }

    const details = await getSeriesDetails(id);

    return NextResponse.json(details);
  } catch (error) {
    console.error("[GET /api/series/[id]] error:", error);
    return NextResponse.json(
      { message: "Error obteniendo detalles de la serie" },
      { status: 500 }
    );
  }
}
