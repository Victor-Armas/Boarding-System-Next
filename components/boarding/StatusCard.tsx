"use client"
import React, { useState } from "react";
import { BoardingPendingRampId } from "@/src/types"; // Asegúrate de que este sea el tipo correcto para los datos.
import { cajaTypeMap, statusMapping, statusStyles } from "@/src/utils/traductions";

interface StatusCardProps {
  title: string;
  data: BoardingPendingRampId[];
  bgColor: string;
  renderButtons?: (boarding: BoardingPendingRampId) => React.ReactNode;
}

export default function StatusCard({title,data,bgColor,renderButtons,}: StatusCardProps) {
  
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <h2 className={`text-xl font-semibold text-white text-center py-4 ${bgColor}`}>
        {title}
      </h2>
      <div className="bg-gray-50 p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
        {data.map((boarding) => (
          <div
            key={boarding.id}
            className="bg-white shadow-sm rounded-md p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700 font-medium">
                <span className="font-semibold">Caja:</span> {boarding.boxNumber}
              </p>
              <p className={`text-sm px-2 py-1 rounded ${statusStyles[boarding.status]}`}>
                {statusMapping[boarding.status]}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Proveedor:</span> {boarding.supplier.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Fecha y Hora:</span>{" "}
              {new Date(boarding.arrivalDate).toLocaleString("es-ES", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Formato 24hrs
              })}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Tipo:</span> {cajaTypeMap[boarding.boxType]}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Comentario:</span> {boarding.comments}
            </p>
            {renderButtons && (
              <div className="mt-4 n">{renderButtons(boarding)}</div>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-center">No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
}
