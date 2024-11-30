
"use client"

import Link from "next/link";
import { ElementType } from "react";

interface IconButtonProps {
  icon: ElementType; // Componente del icono de Heroicons (como `HomeIcon`)
  text: string; // Texto del botón
  link: string; // Ruta a la que debe navegar
  className?: string; // Clase CSS opcional para personalización adicional
}

export default function ButtonMenuBoarding({ icon: Icon, text, link, className }: IconButtonProps) {
  return (

    <Link
      href={link}
      className={`bg-blue-500 hover:bg-blue-700 flex flex-col items-center rounded-lg p-5 text-white uppercaseransform hover:scale-105 transition-all duration-500 ${className}`}
    >
      <Icon className="w-[13%]" />
      <span className="text-2xl font-bold mt-5">{text}</span>
    </Link>
  )
}
