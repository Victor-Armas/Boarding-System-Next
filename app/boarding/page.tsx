"use client";

import ButtonMenuBoarding from "@/components/ui/ButtonMenuBoarding";
import { useUserRole } from "@/src/utils/useUserRole";
import {ChartBarIcon,PlusIcon,ClipboardIcon,UserPlusIcon,UsersIcon, TruckIcon} from "@heroicons/react/24/outline";

export default function Boarding() {
  const { role } = useUserRole();

  
  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold py-5 text-center uppercase">
        Menú de navegación
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-10 rounded-lg shadow-md lg:max-w-7xl max-w-5xl w-full">
        <ButtonMenuBoarding
          icon={ChartBarIcon}
          text="Graficas de Embarques"
          link="#"
        />

        {role !== "BUYER" && (
          <ButtonMenuBoarding
            icon={PlusIcon}
            text="Crear Embarque"
            link="/boarding/create"
          />
        )}

        <ButtonMenuBoarding
          icon={TruckIcon}
          text="Estado de Descarga"
          link="/boarding/unloading-status"
        />

        <ButtonMenuBoarding
          icon={ClipboardIcon}
          text="Lista de Embarques"
          link="/boarding/list"
        />
        
        {role === "ADMIN" && (
          <>
            <ButtonMenuBoarding
              icon={UserPlusIcon}
              text="Crear Usuario"
              link="/boarding/create-user"
            />
            <ButtonMenuBoarding
              icon={UsersIcon}
              text="Lista de Usuarios"
              link="#"
            />
          </>
        )}
      </div>
    </div>
  );
}
