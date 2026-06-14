import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";

export const runtime = "nodejs";
const bookmarkModel = (prisma as typeof prisma & { bookmark: any }).bookmark;

export async function DELETE(
  request: Request,
  { params }: { params: { destinationId: string } }
) {
  const auth = await requireRole(["tourist"]);

  if (auth.response) {
    return auth.response;
  }

  try {
    const bookmark = await bookmarkModel.findUnique({
      where: {
        userId_destinationId: {
          userId: auth.user.id,
          destinationId: params.destinationId
        }
      }
    });

    if (!bookmark) {
      return NextResponse.json({ message: "Bookmark not found" }, { status: 404 });
    }

    await bookmarkModel.delete({
      where: { id: bookmark.id }
    });

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ message: "Failed to delete bookmark" }, { status: 500 });
  }
}
