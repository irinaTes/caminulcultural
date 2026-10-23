import { ImageResponse } from "next/og";

// Home-screen icon: the cat's eyes from app/icon.svg, as a PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#1F206A",
      }}
    >
      <svg viewBox="0 0 64 64" width="180" height="180">
        <ellipse cx="20" cy="33" rx="12" ry="9" fill="#F4ECDD" />
        <ellipse cx="44" cy="33" rx="12" ry="9" fill="#F4ECDD" />
        <path d="M20 25 Q24 33 20 41 Q16 33 20 25 Z" fill="#1F206A" />
        <path d="M44 25 Q48 33 44 41 Q40 33 44 25 Z" fill="#1F206A" />
      </svg>
    </div>,
    size,
  );
}
