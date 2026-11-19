"use client";

import ReliableImage from "./ReliableImage";

export default function ImageAction({
  src,
  alt,
  action = null,
  className = "",
  heightPtg = "auto",
  prioritize = false,
  originalSrc = undefined,
  sizes = "(max-width: 768px) 50vw, 320px",
}) {
  return (
    <ReliableImage
      priority={prioritize}
      src={src}
      originalSrc={originalSrc}
      alt={alt}
      onClick={action ? () => action() : () => console.log("")}
      className={className + (action !== "" ? " hover:cursor-pointer" : "")}
      width={320}
      height={320}
      sizes={sizes}
      style={{ width: "100%", height: heightPtg }}
      draggable="false"
    />
  );
}
