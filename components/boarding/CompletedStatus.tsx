import React from "react";
import { BoardingPendingRampId } from "@/src/types"; // Asegúrate de que este sea el tipo correcto para los datos de `completed`.
import { cajaTypeMap, statusMapping, statusStyles } from "@/src/utils/traductions";

interface CompletedStatusProps {
  data: BoardingPendingRampId[];
}

export default function CompletedStatus({ data }: CompletedStatusProps) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-white text-center py-4 bg-green-700">
        Completado
      </h2>
      <div className="bg-gray-50 p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
        <div className="flex gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-sm rounded-md p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-medium">
                  <span className="font-semibold">Caja:</span> {item.boxNumber}
                </p>
                <p
                  className={`text-sm px-2 py-1 rounded ${statusStyles[item.status]}`}
                >
                  {statusMapping[item.status]}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Proveedor:</span> {item.supplier.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Fecha y Hora:</span>{" "}
                {new Date(item.arrivalDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tipo:</span> {cajaTypeMap[item.boxType]}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Comentario:</span> {item.comments}
              </p>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-gray-500 text-center w-full">
              No hay datos disponibles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
