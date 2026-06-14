import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import {
  deleteDestinationImage,
  readDestinationPayload,
  saveDestinationImage,
  validateDestinationPayload
} from "@/lib/destinations/uploads";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  if (!destination) {
    return NextResponse.json({ message: "Destination not found" }, { status: 404 });
  }

  return NextResponse.json({ destination });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireRole(["producer", "superadmin"]);

  if (auth.response) {
    return auth.response;
  }

  const existingDestination = await prisma.destination.findFirst({
    where: {
      id: params.id,
      ...(auth.user.role === "producer" ? { createdBy: auth.user.id } : {})
    }
  });

  if (!existingDestination) {
    return NextResponse.json({ message: "Destination not found" }, { status: 404 });
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
    const replacementImage = await saveDestinationImage(payload.image);

    const destination = await prisma.destination.update({
      where: { id: existingDestination.id },
      data: {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        category: payload.category,
        latitude: payload.latitude,
        longitude: payload.longitude,
        image: replacementImage ?? existingDestination.image
      }
    });

    if (replacementImage) {
      await deleteDestinationImage(existingDestination.image);
    }

    return NextResponse.json({ message: "Destination updated successfully", destination });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update destination" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireRole(["producer", "superadmin"]);

  if (auth.response) {
    return auth.response;
  }

  const existingDestination = await prisma.destination.findFirst({
    where: {
      id: params.id,
      ...(auth.user.role === "producer" ? { createdBy: auth.user.id } : {})
    }
  });

  if (!existingDestination) {
    return NextResponse.json({ message: "Destination not found" }, { status: 404 });
  }

  await prisma.destination.delete({
    where: { id: existingDestination.id }
  });

  await deleteDestinationImage(existingDestination.image);

  return NextResponse.json({ message: "Destination deleted successfully" });
}
