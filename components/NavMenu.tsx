"use client"
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/src/utils/useUserRole";


export default function NavMenu() {
  const router = useRouter();
  const { name } = useUserRole();

  const logout = () => {
    // Eliminar el token del localStorage o cookie
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    // Redirigir al login
    router.push("/auth/login");
  };

  return (
    <Popover className="relative">
      {/* Botón de hamburguesa */}
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-2 rounded-lg text-white">
        <Bars3Icon className="w-8 h-8" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {/* Panel del Popover */}
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-xs -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 bg-white p-4 rounded-xl shadow-lg ring-1 ring-gray-900/10 text-sm font-semibold">
            <p className="text-center text-gray-700"></p>
            <div className="space-y-2 mt-2">
              <p className="text-center">Hola: <span className="text-blue-600">{name}</span></p>
              <button
                onClick={() => router.push("/perfil")}
                className="block w-full text-left p-2 text-gray-600 hover:text-blue-500 transition duration-150"
              >
                Mi Perfil
              </button>
              <button
                onClick={logout}
                className="block w-full text-left p-2 text-gray-600 hover:text-blue-500 transition duration-150"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
