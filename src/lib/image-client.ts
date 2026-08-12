/** Browser-side image optimisation: resize + convert to WebP before upload. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type PreparedImage = {
  filename: string;
  contentType: string;
  base64: string;
  previewUrl: string;
  bytes: number;
};

function safeName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  const cleaned = base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return cleaned || "image";
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(blob);
  });
}

export async function prepareImage(
  file: File,
  opts: { maxWidth?: number; quality?: number; nameHint?: string } = {},
): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error("INVALID_IMAGE_TYPE");
  if (file.size > 40 * 1024 * 1024) throw new Error("IMAGE_TOO_LARGE");

  const maxWidth = opts.maxWidth ?? 1920;
  const quality = opts.quality ?? 0.85;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("CANVAS_UNAVAILABLE");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", quality),
  );
  if (!blob) throw new Error("CONVERT_FAILED");
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error("IMAGE_TOO_LARGE");

  const stamp = Date.now().toString(36);
  const hint = opts.nameHint ? safeName(opts.nameHint) : safeName(file.name);
  return {
    filename: `${hint}-${stamp}.webp`,
    contentType: "image/webp",
    base64: await toBase64(blob),
    previewUrl: URL.createObjectURL(blob),
    bytes: blob.size,
  };
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const UPLOAD_ERRORS: Record<string, string> = {
  INVALID_IMAGE_TYPE: "Please choose a JPG, PNG, WebP or AVIF image.",
  IMAGE_TOO_LARGE: "That photo is too large. Please use an image under 8 MB.",
  CONVERT_FAILED: "We could not process that photo. Please try another file.",
  CANVAS_UNAVAILABLE: "Your browser could not process this photo.",
  READ_FAILED: "We could not read that file. Please try again.",
};