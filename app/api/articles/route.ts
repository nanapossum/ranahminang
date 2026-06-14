import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { saveArticleImage } from "@/lib/uploads";

export const runtime = "nodejs";

const validCategories = [
  "History",
  "Culture",
  "Tradition",
  "Culinary",
  "Architecture",
  "Philosophy",
  "Folklore"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const where: any = {};
    if (category && validCategories.includes(category)) {
      where.category = category;
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Only superadmin and producer can create articles
  if (user.role !== "superadmin" && user.role !== "producer") {
    return NextResponse.json({ message: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
    }

    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const imageFile = formData.get("image") instanceof File 
      ? (formData.get("image") as File) 
      : null;

    // Validation
    if (title.length < 3) {
      return NextResponse.json({ message: "Title must be at least 3 characters" }, { status: 400 });
    }

    if (content.length < 10) {
      return NextResponse.json({ message: "Content must be at least 10 characters" }, { status: 400 });
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ message: "Invalid category selection" }, { status: 400 });
    }

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      try {
        const uploadedUrl = await saveArticleImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      } catch (uploadError) {
        return NextResponse.json(
          { message: uploadError instanceof Error ? uploadError.message : "Failed to upload image" },
          { status: 400 }
        );
      }
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
        image: imageUrl,
        createdBy: user.id
      }
    });

    return NextResponse.json({ message: "Article created successfully", article }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ message: "Failed to create article" }, { status: 500 });
  }
}
