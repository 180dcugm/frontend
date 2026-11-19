import type { Media } from "@/payload-types";

type ImageRecord = Partial<Media> & { src?: string };
type ImageSize = keyof NonNullable<Media["sizes"]>;

export function getMediaImage(value: unknown, size?: ImageSize) {
  if (!value || typeof value === "number") return undefined;
  const image: ImageRecord = typeof value === "string" ? { url: value } : (value as ImageRecord);
  let original = image.url || image.src;
  if (!original && image.filename)
    original = `/api/media/file/${encodeURIComponent(image.filename)}`;
  if (!original) return undefined;

  const version = image.updatedAt;
  const versioned = (url: string) => {
    // Payload's URL is authoritative. Do not reconstruct a storage-provider URL
    // or attach localhost/NEXT_PUBLIC_PAYLOAD_URL to same-origin media paths.
    if (!version) return url;
    const parsed = new URL(url, "https://media.invalid");
    parsed.searchParams.set("v", version);
    return url.startsWith("/")
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : parsed.toString();
  };

  const selected = (size && image.sizes?.[size]?.url) || original;
  return {
    src: versioned(selected),
    originalSrc: selected !== original ? versioned(original) : undefined,
    alt: image.alt || "",
    width: (size && image.sizes?.[size]?.width) || image.width,
    height: (size && image.sizes?.[size]?.height) || image.height,
  };
}
