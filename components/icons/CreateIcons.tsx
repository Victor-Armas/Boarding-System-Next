"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function CreateIcons() {

  return (
    <div style={{ width: '200px', height: '200px' }}>  {/* Asegúrate de darle un tamaño */}
        <DotLottieReact
        src="/animations/create.lottie"  // Ruta correcta
        loop
        autoplay
        />
  </div>
  )
}

