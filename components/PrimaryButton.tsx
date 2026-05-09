"use client";
import React from "react";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
}

export default function PrimaryButton({ text, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white text-black font-bold py-3 px-10 text-base transition-all hover:bg-blue-600 hover:text-white active:scale-95 shadow-lg shadow-white/5 min-w-[180px]"
    >
      {text}
    </button>
  );
}
