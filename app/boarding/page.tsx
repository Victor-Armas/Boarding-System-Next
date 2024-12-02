"use client"

import ButtonMenuBoarding from "@/components/ui/ButtonMenuBoarding";
import { ChartBarIcon,PlusIcon, ClipboardIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function Boarding() {

  return (
    <>
      <h1 className="text-4xl font-bold last-of-type:border-b-2 py-5 text-center uppercase">Menú de navegación</h1>
      <div className="grid grid-cols-3 gap-10 mt-10 bg-white p-10">
      <ButtonMenuBoarding 
        icon={ChartBarIcon} 
        text="Graficas de Embarques" 
        link="#"
      />
      <ButtonMenuBoarding 
        icon={PlusIcon} 
        text="Crear Embarque" 
        link="/boarding/create" 
      />
      <ButtonMenuBoarding 
        icon={ClipboardIcon} 
        text="Lista de Embarques" 
        link="/boarding/list" 
      />

      <ButtonMenuBoarding 
        icon={UserPlusIcon} 
        text="Crear Usuario" 
        link="#"
      />

      <ButtonMenuBoarding 
        icon={UsersIcon} 
        text="Lista de Usuarios" 
        link="#" 
      />
    </div>
    </>
  );
}