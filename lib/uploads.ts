import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const maxUploadSize = 2 * 1024 * 1024; // 2MB
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

const profileUploadDir = path.join(process.cwd(), "public", "uploads", "profile");
const articleUploadDir = path.join(process.cwd(), "public", "uploads", "articles");

async function saveImage(file: File | null, destinationDir: string, urlPrefix: string) {
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

  await mkdir(destinationDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const filePath = path.join(destinationDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `${urlPrefix}/${filename}`;
}

export async function saveProfileImage(file: File | null) {
  return saveImage(file, profileUploadDir, "/uploads/profile");
}

export async function saveArticleImage(file: File | null) {
  return saveImage(file, articleUploadDir, "/uploads/articles");
}

export async function deleteUploadedFile(publicPath?: string | null) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }

  // Calculate local path on disk
  const localRelativePath = publicPath.replace(/^\//, ""); // remove leading slash
  const filePath = path.join(process.cwd(), "public", localRelativePath);

  // Validate we stay inside public/uploads to prevent directory traversal
  const baseUploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!filePath.startsWith(baseUploadsDir)) {
    return;
  }

  await unlink(filePath).catch(() => undefined);
}
