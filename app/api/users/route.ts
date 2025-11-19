// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users -> lista de usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users] error:", error);
    return NextResponse.json(
      { message: "Error obteniendo usuarios" },
      { status: 500 }
    );
  }
}

// POST /api/users -> crear usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { message: "El email es obligatorio" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[POST /api/users] error:", error);
    return NextResponse.json(
      { message: "Error creando usuario" },
      { status: 500 }
    );
  }
}
