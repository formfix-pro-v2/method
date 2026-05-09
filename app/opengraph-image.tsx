import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Veronica Method - The Complete Menopause Program";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5eaed 0%, #e7bcc8 50%, #d5a6b1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "40px",
            padding: "60px 80px",
            boxShadow: "0 20px 60px rgba(115,72,87,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#4a3f44",
              marginBottom: "16px",
              fontFamily: "serif",
            }}
          >
            Veronica Method
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#7b6870",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            The Complete Menopause Program — Exercises, Nutrition & Supplements for Women 40+
          </div>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "20px",
            }}
          >
            <div style={{ background: "#d8a7b5", color: "white", padding: "12px 24px", borderRadius: "20px", fontSize: "18px" }}>
              Personalized Plans
            </div>
            <div style={{ background: "#d8a7b5", color: "white", padding: "12px 24px", borderRadius: "20px", fontSize: "18px" }}>
              Under €7/day Meals
            </div>
            <div style={{ background: "#d8a7b5", color: "white", padding: "12px 24px", borderRadius: "20px", fontSize: "18px" }}>
              Evidence-Based
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
