import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import {
  readDestinationPayload,
  saveDestinationImage,
  validateDestinationPayload
} from "@/lib/destinations/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  return NextResponse.json({ destinations });
}

export async function POST(request: Request) {
  const auth = await requireRole(["producer"]);

  if (auth.response) {
    return auth.response;
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ message: "Invalid destination data" }, { status: 400 });
  }

  const payload = readDestinationPayload(formData);
  const validationError = validateDestinationPayload(payload);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const image = await saveDestinationImage(payload.image);

    const destination = await prisma.destination.create({
      data: {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        category: payload.category,
        latitude: payload.latitude,
        longitude: payload.longitude,
        image,
        createdBy: auth.user.id
      }
    });

    return NextResponse.json(
      { message: "Destination created successfully", destination },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create destination" },
      { status: 500 }
    );
  }
}
