import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { saveArticleImage, deleteUploadedFile } from "@/lib/uploads";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            name: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ message: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    // Check permissions: Admin can edit anything, Producer can only edit own
    if (user.role !== "superadmin" && (user.role !== "producer" || article.createdBy !== user.id)) {
      return NextResponse.json({ message: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

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

    let imageUrl = article.image;

    if (imageFile && imageFile.size > 0) {
      try {
        const uploadedUrl = await saveArticleImage(imageFile);
        if (uploadedUrl) {
          if (article.image) {
            await deleteUploadedFile(article.image);
          }
          imageUrl = uploadedUrl;
        }
      } catch (uploadError) {
        return NextResponse.json(
          { message: uploadError instanceof Error ? uploadError.message : "Failed to upload image" },
          { status: 400 }
        );
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
        image: imageUrl
      }
    });

    return NextResponse.json({ message: "Article updated successfully", article: updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ message: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    // Check permissions: Admin can delete anything, Producer can only delete own
    if (user.role !== "superadmin" && (user.role !== "producer" || article.createdBy !== user.id)) {
      return NextResponse.json({ message: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    // Delete from database
    await prisma.article.delete({
      where: { id: params.id }
    });

    // Delete image from disk
    if (article.image) {
      await deleteUploadedFile(article.image);
    }

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ message: "Failed to delete article" }, { status: 500 });
  }
}
