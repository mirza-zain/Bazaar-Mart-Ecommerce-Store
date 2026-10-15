'use server';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};

export async function isCloudinaryConfigured(): Promise<boolean> {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET)
  );
}

/**
 * Uploads a base64 string, image buffer, or remote URL to Cloudinary.
 * If Cloudinary is not configured in .env, gracefully returns the input as fallback.
 */
export async function uploadToCloudinary(
  fileOrBase64: string,
  folder: string = "bazzario"
): Promise<UploadResult> {
  const configured = await isCloudinaryConfigured();
  if (!configured) {
    console.warn("[Cloudinary] Credentials not configured in .env; using input as fallback.");
    return {
      success: true,
      url: fileOrBase64,
    };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileOrBase64, {
      folder,
      resource_type: "auto",
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error: any) {
    console.error("[Cloudinary] Upload failed:", error);
    return {
      success: false,
      error: error?.message || "Cloudinary upload failed",
    };
  }
}

/**
 * Server Action for client-side file uploads directly to Cloudinary.
 */
export async function uploadFileAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "bazzario";

    if (!file || typeof file === "string") {
      const base64Str = formData.get("base64") as string | null;
      if (base64Str) {
        return await uploadToCloudinary(base64Str, folder);
      }
      return { success: false, error: "No image file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return await uploadToCloudinary(dataUri, folder);
  } catch (error: any) {
    console.error("[Cloudinary] Server Action upload error:", error);
    return {
      success: false,
      error: error?.message || "Failed to process image upload",
    };
  }
}

