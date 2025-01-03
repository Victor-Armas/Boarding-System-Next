import React, { useState } from "react";
import useSWR from "swr";
import ActionButtonUnloadingStatus from "../ActionButtonUnloadingStatus";
import ActionModal from "../ActionModal";
import { toast } from "react-toastify";
import { AssignRamp, BoardingDetails } from "@/src/types";
import { ForkliftOperator } from "@prisma/client";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";
import { useUserRole } from "@/src/utils/useUserRole";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  return response.json();
};

export default function RampButton({ boarding }: { boarding: BoardingDetails }) {
  const { role } = useUserRole();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRamp, setSelectedRamp] = useState<number | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);

  const dateTime = convertTimeToMonterrey(new Date());

  // Usar SWR para obtener datos de rampas y operadores
  const { data, error, isLoading } = useSWR(
    "/boarding/unloading-status/api?type=ramps",
    fetcher
  );
  
  const handleAssignRampa = async () => {
    if (role === "BUYER") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    
    if (!selectedRamp || !selectedOperator) {
      toast.info("Por favor, seleccione una rampa y un operador");
      return;
    }

    try {
      const response = await fetch("/boarding/unloading-status/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignRamp",
          boardingId: boarding.id,
          rampId: selectedRamp,
          forkliftOperatorId: selectedOperator,
          downloadStartDate: dateTime,
        }),
      });

      if (response.ok) {
        toast.success("Rampa y operador asignados exitosamente");
        setModalOpen(false);
      } else {
        toast.error("Error al asignar la rampa y el operador");
      }
    } catch (error) {
      console.log(error)
    }
  };

  if (isLoading) return <div className="text-center text-lg text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error al cargar datos</div>;

  return (
    <div className="relative">
      <ActionButtonUnloadingStatus
        color="yellow"
        label="Asignar Rampa"
        onClick={() => setModalOpen(true)}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Asignar Rampa y Operador"
        size= "max-w-xl"
      >
        <div className="space-y-6 px-6 py-4">
          <p className="text-lg text-gray-600 font-medium">
            Por favor, asigna una rampa y un operador a la siguiente caja:{" "}
            <span className="font-semibold text-indigo-600">{boarding.boxNumber}</span>.
          </p>

          {/* Selección de la rampa */}
          {data?.ramps?.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Rampas disponibles:</label>
              <select
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedRamp || ""}
                onChange={(e) => setSelectedRamp(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona una rampa</option>
                {data.ramps.map((ramp: AssignRamp) => (
                  <option key={ramp.id} value={ramp.id}>
                    {ramp.nameRamp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selección del operador */}
          {data?.forkliftOperators?.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Operadores de montacarga:</label>
              <select
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedOperator || ""}
                onChange={(e) => setSelectedOperator(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona un operador</option>
                {data.forkliftOperators.map((operator: ForkliftOperator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleAssignRampa}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Confirmar
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
