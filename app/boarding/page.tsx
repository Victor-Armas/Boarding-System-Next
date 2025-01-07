"use client";

import ButtonMenuBoarding from "@/components/ui/ButtonMenuBoarding";
import { useUserRole } from "@/src/utils/useUserRole";
import {
  ChartBarIcon,
  PlusIcon,
  ClipboardIcon,
  UserPlusIcon,
  UsersIcon,
  TruckIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import { GrUserAdmin } from "react-icons/gr";
import { Role } from "@prisma/client";

export default function Boarding() {
  const { role } = useUserRole();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 py-8 uppercase text-center">
        Menú Principal
      </h1>
      <p className="text-gray-600 text-center max-w-3xl mb-8">
        Bienvenido al sistema de navegación. Aquí puedes gestionar embarques,
        analizar datos y administrar usuarios según tu rol.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-white p-10 rounded-xl shadow-lg lg:max-w-6xl max-w-4xl w-full">
        <ButtonMenuBoarding
          icon={ChartBarIcon}
          text="Gráficas de Embarques"
          link="/boarding/dashboard"
          gradient="bg-gradient-to-tr from-blue-500 to-indigo-500"
        />

        {role !== "BUYER" && (
          <ButtonMenuBoarding
            icon={PlusIcon}
            text="Crear Embarque"
            link="/boarding/create"
            gradient="bg-gradient-to-tr from-green-500 to-emerald-500"
          />
        )}

        <ButtonMenuBoarding
          icon={TruckIcon}
          text="Estado de Descarga"
          link="/boarding/unloading-status"
          gradient="bg-gradient-to-tr from-teal-500 to-blue-500"
        />

        <ButtonMenuBoarding
          icon={ClipboardIcon}
          text="Lista de Embarques"
          link="/boarding/list"
          gradient="bg-gradient-to-tr from-purple-500 to-pink-500"
        />

        <ButtonMenuBoarding
          icon={ArchiveBoxXMarkIcon}
          text="EFD'S"
          link="/boarding/efd"
          gradient="bg-gradient-to-tr from-orange-500 to-red-500"
        />

        {!["BUYER", "ASSIST"].includes(role as Role) && (
            <ButtonMenuBoarding
            icon={GrUserAdmin}
            text="Panel Administrativo"
            link="/boarding/admin"
            gradient="bg-gradient-to-tr from-red-500 to-gray-500"
          />
        )}

        {role === "ADMIN" && (
          <>
            <ButtonMenuBoarding
              icon={UserPlusIcon}
              text="Crear Usuario"
              link="/boarding/create-user"
              gradient="bg-gradient-to-tr from-yellow-500 to-orange-500"
            />
            <ButtonMenuBoarding
              icon={UsersIcon}
              text="Lista de Usuarios"
              link="#"
              gradient="bg-gradient-to-tr from-gray-500 to-gray-700"
            />
          </>
        )}
      </div>
    </div>
  );
}
