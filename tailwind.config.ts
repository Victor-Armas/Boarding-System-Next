import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/modal.js',
  ],
  theme: {
    extend: {    
      animation: {
        scroll: 'scroll 30s linear infinite', // Ajusta la duración según el número de registros
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(15%)' },  // Comienza desde el lado derecho
          '100%': { transform: 'translateX(-100%)' }, // Desplaza hacia el lado izquierdo
        },
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    nextui(), 
    require('tailwind-scrollbar') // Agregamos el plugin aquí
  ],
} satisfies Config;
