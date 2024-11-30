import Link from 'next/link'
import React from 'react'

interface NavButtonPaginationProps {
    text: string; // Texto del botón
    link: string; // Ruta a la que debe navegar
    className?: string; // Clase adicional opcional
  }


export default function NavButtonPagination({text, link, className} : NavButtonPaginationProps) {
  return (
    <Link
        href={link}
        className={`bg-blue-600 py-4 px-10  rounded-lg ${className || ''}`.trim()}
    ><span className='text-white text-lg font-bold'>{text}</span></Link>
  )
}
