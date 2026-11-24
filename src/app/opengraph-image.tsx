import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#000000",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          color: "#fafaf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#cfcec7" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#b7f36b" }} />
          {site.location} · {site.availability.open ? site.availability.label : "Software Engineer"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#cfcec7" }}>
            {site.headline.lead}&nbsp;<span style={{ color: "#b7f36b", fontStyle: "italic" }}>{site.headline.accent}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#a9a8a1" }}>
          <span>Go</span>
          <span>TypeScript</span>
          <span>PostgreSQL</span>
          <span>Next.js</span>
          <span>AI / ML</span>
          <span>Security</span>
        </div>
      </div>
    ),
    size,
  );
}
