import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const bookmarkModel = (prisma as typeof prisma & { bookmark: any }).bookmark;

export async function GET() {
  const auth = await requireRole(["tourist"]);

  if (auth.response) {
    return auth.response;
  }

  try {
    const bookmarks = await bookmarkModel.findMany({
      where: { userId: auth.user.id },
      include: {
        destination: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            location: true,
            category: true,
            latitude: true,
            longitude: true,
            creator: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ message: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(["tourist"]);

  if (auth.response) {
    return auth.response;
  }

  try {
    const payload = (await request.json().catch(() => null)) as { destinationId?: string } | null;
    const destinationId = payload?.destinationId;

    if (!destinationId) {
      return NextResponse.json({ message: "Destination ID is required" }, { status: 400 });
    }

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId }
    });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    // Check if already bookmarked
    const existing = await bookmarkModel.findUnique({
      where: {
        userId_destinationId: {
          userId: auth.user.id,
          destinationId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ message: "Already bookmarked" }, { status: 409 });
    }

    // Create bookmark
    const bookmark = await bookmarkModel.create({
      data: {
        userId: auth.user.id,
        destinationId
      }
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ message: "Failed to create bookmark" }, { status: 500 });
  }
}
