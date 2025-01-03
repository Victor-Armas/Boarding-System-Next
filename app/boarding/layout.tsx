import NavMenu from "@/components/NavMenu";
import ToastNotification from "@/components/ui/ToastNotification";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-500 py-1">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between px-4 md:px-10 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/boarding" className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                width={160} // Tamaño base para el logo
                height={160} // Mantener la proporción
                alt="Boarding System"
                className="w-40 h-auto md:w-60" // Ajuste de tamaño dinámico
                priority // Mejora el renderizado
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <NavMenu />
        </div>
      </header>

      {/* Main Section */}
      <section className="w-full mx-auto mt-5 p-4 lg:p-5 ">
        {children}
      </section>

      {/* Footer */}
      <footer className="py-5 w-full flex flex-col md:flex-row justify-around items-center text-gray-500">
        <p className="text-center">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
        <p className="text-center mt-2 md:mt-0">
          Dev: Victor Jesús Garzón Armas
        </p>
      </footer>

      {/* Toast Notifications */}
      <ToastNotification />
    </>
  );
}
