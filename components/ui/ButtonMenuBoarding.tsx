"use client";

import Link from "next/link";
import { ElementType } from "react";

interface IconButtonProps {
  icon: ElementType;
  text: string;
  link: string;
  gradient?: string; // Color de fondo dinámico
}

export default function ButtonMenuBoarding({
  icon: Icon,
  text,
  link,
  gradient = "bg-blue-500",
}: IconButtonProps) {
  return (
    <Link
      href={link}
      className={`group flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300 ${gradient}`}
    >
      {/* Icon with hover effect */}
      <div className="relative">
        <Icon
          className="w-12 h-12 text-white transition-all duration-500 transform group-hover:text-yellow-300 group-hover:scale-125"
        />
        <div className="absolute inset-0 w-full h-full bg-yellow-300 opacity-0 group-hover:opacity-30 rounded-full blur-md transition-all duration-500"></div>
      </div>
      <span className="mt-4 text-lg font-semibold">{text}</span>
    </Link>
  );
}
