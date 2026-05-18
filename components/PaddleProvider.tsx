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
      // @ts-expect-error Paddle is injected on window
      if (window.Paddle && typeof window.Paddle.Initialize === "function") {
        // @ts-expect-error
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          environment: process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox",
        });
      }
    };
    document.body.appendChild(script);
    loadedRef.current = true;
  }, []);

  return null;
}
