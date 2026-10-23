import { ImageResponse } from "next/og";
import { Logo } from "@/components/brand/Logo";

// The image shown when a page is shared: the logo in lamplight. No text, so
// it needs no font files and reads the same in both languages.
export const alt = "Căminul Cultural 31";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 42%, #9A3A3A 0%, #6E1F2F 45%, #43101B 100%)",
      }}
    >
      <Logo color="#F4ECDD" width={420} height={390} />
    </div>,
    size,
  );
}
