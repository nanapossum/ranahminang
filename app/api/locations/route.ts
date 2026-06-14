import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    data: destinations
  });
}
