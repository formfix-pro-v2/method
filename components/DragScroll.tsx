"use client";

import { useEffect } from "react";

/**
 * Enables click-and-drag scrolling on the page.
 * Hold left mouse button anywhere on the page and drag up/down to scroll.
 */
export default function DragScroll() {
  useEffect(() => {
    let isDown = false;
    let startY = 0;
    let scrollStart = 0;

    function onMouseDown(e: MouseEvent) {
      // Only activate on left click, not on interactive elements
      if (e.button !== 0) return;
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isInteractive =
        tag === "a" ||
        tag === "button" ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (e.target as HTMLElement).closest("a, button, input, textarea, select, [role='button']");

      if (isInteractive) return;

      isDown = true;
      startY = e.clientY;
      scrollStart = window.scrollY;
      document.body.style.cursor = "grab";
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDown) return;
      e.preventDefault();
      const diff = startY - e.clientY;
      window.scrollTo(0, scrollStart + diff);
      document.body.style.cursor = "grabbing";
    }

    function onMouseUp() {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = "";
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
    };
  }, []);

  return null;
}
