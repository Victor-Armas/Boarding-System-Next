"use client";
import ButtonMenuBoarding from '@/components/ui/ButtonMenuBoarding';
import { useUserRole } from '@/src/utils/useUserRole';
import { FolderPlusIcon } from '@heroicons/react/20/solid';
import { TbCards } from "react-icons/tb";
import { TbClipboardList } from "react-icons/tb";
import React from 'react'

export default function EfdPage() {
  const { role } = useUserRole();
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 py-8 uppercase text-center">Menú EFD&apos;S</h1>
      <p className="text-gray-600 text-center max-w-3xl mb-8">Segmento de EFD&apos;S. Aqui podras realizar la carga, consulta y demas acciones de los efd&apos;s que tienen los embarques</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-white p-10 rounded-xl shadow-lg lg:max-w-6xl max-w-4xl w-full">

        {role !== "BUYER" && (
          <ButtonMenuBoarding
            icon={FolderPlusIcon}
            text="Crear EFD"
            link="/boarding/efd/create-efd"
            gradient="bg-gradient-to-tr from-green-500 to-emerald-500"
          />
        )}
        <ButtonMenuBoarding
          icon={TbCards}
          text="Gestion de EFD Activos"
          link="/boarding/efd/card-efd"
          gradient="bg-gradient-to-tr from-purple-500 to-rose-500"
        />

        <ButtonMenuBoarding
          icon={TbClipboardList}
          text="Listado de EFD'S"
          link="/boarding/efd/list-efd"
          gradient="bg-gradient-to-tr from-cyan-500 to-purple-500"
        />

      </div>
    </div>
  )
}
