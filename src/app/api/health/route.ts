import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// ======================================
// GET /api/health — Kiểm tra kết nối DB
// ======================================

export async function GET() {
  try {
    // Real database connection check via Prisma/Neon
    await prisma.$queryRawUnsafe("SELECT 1");

    return NextResponse.json(
      { status: "ok", timestamp: Date.now() },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Health] DB connection failed:", error);

    return NextResponse.json(
      { status: "error", timestamp: Date.now() },
      { status: 503 }
    );
  }
}
