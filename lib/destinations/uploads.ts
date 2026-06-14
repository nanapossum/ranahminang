import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const maxUploadSize = 2 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

const uploadDir = path.join(process.cwd(), "public", "uploads", "destinations");

export async function saveDestinationImage(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    throw new Error("Only jpg, jpeg, png, and webp images are allowed");
  }

  if (file.size > maxUploadSize) {
    throw new Error("Image must be 2MB or smaller");
  }

  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/destinations/${filename}`;
}

export async function deleteDestinationImage(imagePath?: string | null) {
  if (!imagePath?.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(imagePath);
  let filePath;
  if (imagePath.startsWith("/uploads/destinations/")) {
    filePath = path.join(process.cwd(), "public", "uploads", "destinations", filename);
  } else {
    filePath = path.join(process.cwd(), "public", "uploads", filename);
  }

  const baseUploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!filePath.startsWith(baseUploadsDir)) {
    return;
  }

  await unlink(filePath).catch(() => undefined);
}

export function readDestinationPayload(formData: FormData) {
  const latitudeValue = String(formData.get("latitude") || "").trim();
  const longitudeValue = String(formData.get("longitude") || "").trim();

  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    latitude: latitudeValue ? Number(latitudeValue) : null,
    longitude: longitudeValue ? Number(longitudeValue) : null,
    image: formData.get("image") instanceof File ? (formData.get("image") as File) : null
  };
}

export function validateDestinationPayload(payload: {
  title: string;
  description: string;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
}) {
  if (payload.title.length < 3) {
    return "Title must be at least 3 characters";
  }

  if (payload.description.length < 10) {
    return "Description must be at least 10 characters";
  }

  if (payload.location.length < 3) {
    return "Location must be at least 3 characters";
  }

  if (payload.category.length < 2) {
    return "Category must be at least 2 characters";
  }

  if (payload.latitude !== null && (Number.isNaN(payload.latitude) || payload.latitude < -90 || payload.latitude > 90)) {
    return "Latitude must be between -90 and 90";
  }

  if (payload.longitude !== null && (Number.isNaN(payload.longitude) || payload.longitude < -180 || payload.longitude > 180)) {
    return "Longitude must be between -180 and 180";
  }

  return null;
}
