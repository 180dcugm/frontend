"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ReliableImageProps = ImageProps & {
  /** Full-size original, used if a generated thumbnail is unavailable. */
  originalSrc?: string;
  fallbackSrc?: string;
};

const placeholder = "/img/global/image-placeholder.svg";

function RetryingImage({
  src,
  alt,
  originalSrc,
  fallbackSrc = placeholder,
  unoptimized,
  onError,
  ...props
}: ReliableImageProps) {
  const [attempt, setAttempt] = useState(0);
  const sources = [src, ...(originalSrc && originalSrc !== src ? [originalSrc] : []), fallbackSrc];
  // Try the optimized image, then the same source directly, then the original
  // upload (if different), and finally a bundled placeholder. Never loop.
  const sourceIndex = Math.max(0, attempt - 1);
  const currentSrc = sources[Math.min(sourceIndex, sources.length - 1)];

  return (
    <Image
      key={attempt}
      {...props}
      alt={alt}
      src={currentSrc}
      unoptimized={unoptimized || attempt > 0}
      onError={(event) => {
        onError?.(event);
        setAttempt(Math.min(attempt + 1, sources.length));
      }}
    />
  );
}

export default function ReliableImage(props: ReliableImageProps) {
  if (!props.src) return <RetryingImage {...props} src={placeholder} unoptimized />;
  const source =
    typeof props.src === "string"
      ? props.src
      : "src" in props.src
        ? props.src.src
        : props.src.default.src;
  // A carousel/new CMS value must start with optimization again, rather than
  // inheriting the preceding image's error state.
  return (
    <RetryingImage
      key={`${source}|${props.originalSrc || ""}|${props.fallbackSrc || ""}`}
      {...props}
    />
  );
}
