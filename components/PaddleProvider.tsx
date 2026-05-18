"use client";

import { useEffect, useRef } from "react";

/**
 * Loads Paddle.js once and initializes with client token.
 * Place near root of client tree (e.g., in layout).
 */
export default function PaddleProvider() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const Paddle = (window as any).Paddle;
      if (Paddle && typeof Paddle.Initialize === "function") {
        const env = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
        if (env === "sandbox") {
          Paddle.Environment.set("sandbox");
        }
        Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        });
      }
    };
    document.body.appendChild(script);
    loadedRef.current = true;
  }, []);

  return null;
}
