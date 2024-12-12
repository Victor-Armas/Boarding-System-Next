import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-slate-100 to-slate-600 text-white px-6">
      {/* Imagen en el lado izquierdo */}
      <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
        <Image
          src="/images/04-image.svg"  // Ruta de la imagen (ajustar según tu archivo)
          alt="Imagen 404"
          width={400}
          height={400}
          className="object-cover"
          priority
        />
      </div>

      {/* Texto y mensaje */}
      <div className="text-center md:text-left md:w-1/2">
        <h1 className="text-9xl font-extrabold drop-shadow-lg animate-pulse">404</h1>
        <p className="text-3xl font-semibold mt-4 drop-shadow-md">Oops, esta página no existe o no esta disponible</p>
        <p className="text-lg mt-2 opacity-90">
          Lo sentimos, no pudimos encontrar la página que buscabas.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:bg-blue-100 transition-all duration-300"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>

      {/* Pie de página */}
      <div className="absolute bottom-10 text-white opacity-80 text-sm">
        <p>© {new Date().getFullYear()} Boarding System. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
