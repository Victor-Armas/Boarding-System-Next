"use client";
import React from "react";
import CardStatus from "@/components/boarding/dashboard/CardStatus";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { BiBookReader } from "react-icons/bi";
import useSWR from "swr";  // Importar SWR
import { FaComputer } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import DownloadsChart from "@/components/boarding/dashboard/DownloadsChart";
import TopProvidersChart from "@/components/boarding/dashboard/TopProvidersChart";
import DurationChart from "@/components/boarding/dashboard/DurationChart";
import RampUsageHeatmap from "@/components/boarding/dashboard/RampUsageHeatmap";
import ProblemBanner from "@/components/boarding/dashboard/ProblemBanner";
import AreaProblemType from "@/components/boarding/dashboard/AreaProblemType";
import BoardingEfdStatus from "@/components/boarding/dashboard/BoardingEfdStatus";
// Función fetcher para usar con SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {

   // Usamos SWR para obtener los datos de la API
   const { data, error } = useSWR("/boarding/dashboard/api?type=boardingsByStatus", fetcher);

   if (error) {
     return <div>Error al cargar los datos</div>;
   }
 
   if (!data) {
     return <div>Cargando...</div>;
   }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 m-4">
      {/* Columna principal */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Cards de estado */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardStatus
            colorFondoBorde="border-l-yellow-400"
            titulo="En Espera"
            cantidad={data.PENDING_DOWNLOAD || 0}
            icon={GiSandsOfTime}
            colorIcon="text-yellow-500"
          />
          <CardStatus
            colorFondoBorde="border-l-blue-400"
            titulo="Descarga"
            cantidad={data.DOWNLOADING || 0}
            icon={LiaTruckLoadingSolid}
            colorIcon="text-blue-500"
          />
          <CardStatus
            colorFondoBorde="border-l-purple-400"
            titulo="Validación"
            cantidad={data.VALIDATING || 0}
            icon={BiBookReader}
            colorIcon="text-purple-500"
          />
          <CardStatus
            colorFondoBorde="border-l-green-400"
            titulo="Captura"
            cantidad={data.CAPTURING || 0}
            icon={FaComputer}
            colorIcon="text-green-500"
          />
        </div>

        {/* Mosaico de gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gráficos en la izquierda */}
          <div className="grid grid-cols-1 gap-4">
            <DownloadsChart />
            <DurationChart />
          </div>

          {/* Gráfico en la derecha */}
          <div className="grid grid-cols-1 gap-4">
            <TopProvidersChart />
            <RampUsageHeatmap />
          </div>
        </div>
      </div>

      {/* Columna lateral */}
      <div className="flex flex-col">
        <ProblemBanner />
        <BoardingEfdStatus />
        <AreaProblemType />
      </div>
    </div>
  );
}
