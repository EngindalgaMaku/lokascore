import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      result,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
