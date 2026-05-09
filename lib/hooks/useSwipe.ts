"use client";

import { useRef, useCallback } from "react";

type SwipeDirection = "left" | "right" | "up" | "down";

export function useSwipe(
  onSwipe: (direction: SwipeDirection) => void,
  threshold = 50
) {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX.current;
      const diffY = endY - startY.current;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        onSwipe(diffX > 0 ? "right" : "left");
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
        onSwipe(diffY > 0 ? "down" : "up");
      }
    },
    [onSwipe, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
