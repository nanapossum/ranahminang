import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { saveProfileImage, deleteUploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const user = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
    }

    const name = String(formData.get("name") || "").trim();
    const imageFile = formData.get("profileImage") instanceof File 
      ? (formData.get("profileImage") as File) 
      : null;

    if (name.length < 3) {
      return NextResponse.json({ message: "Username must be at least 3 characters" }, { status: 400 });
    }

    let profileImageUrl = user.profileImage;

    if (imageFile && imageFile.size > 0) {
      try {
        const uploadedUrl = await saveProfileImage(imageFile);
        if (uploadedUrl) {
          // Delete old profile image if exists
          if (user.profileImage) {
            await deleteUploadedFile(user.profileImage);
          }
          profileImageUrl = uploadedUrl;
        }
      } catch (uploadError) {
        return NextResponse.json(
          { message: uploadError instanceof Error ? uploadError.message : "Failed to upload image" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        profileImage: profileImageUrl
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        approved: true // since they are logged in, they are already approved
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
