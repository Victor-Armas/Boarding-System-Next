"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi"; // Iconos de react-icons
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";
import { toast } from "react-toastify";
import { calculateDaysElapsed } from "@/src/utils/calculateDaysElapsed";
import { CardsEfdType, RawEfdType } from "@/src/types";
import Image from "next/image";
import DetailsCards from "@/components/boarding/efd/DetailsCards";
import { useUserRole } from "@/src/utils/useUserRole";
import NullData from "@/components/ui/NullData";
import EditCards from "@/components/boarding/efd/EditCards";

const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    // Calcula días transcurridos para cada elemento, asegurándonos de convertir crateEfdDate a string
    return data.map((efd: RawEfdType) => ({
        ...efd,
        daysElapsed: efd.daysElapsed ?? calculateDaysElapsed(efd.crateEfdDate instanceof Date ? efd.crateEfdDate.toISOString() : efd.crateEfdDate),
    }));
};



export default function CardEfdPage() {
    const { userId, role } = useUserRole();
    const { data, error, isLoading, mutate } = useSWR<CardsEfdType[]>("/boarding/efd/card-efd/api", fetcher);
    const [statuses, setStatuses] = useState<{ [key: number]: string }>({});
    const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
    const [editModalOpen, setEditModalOpen] = useState(false); // Estado para controlar el modal
    const [selectedBoardingEfd, setSelectedBoardingEfd] = useState<CardsEfdType | null>(null); // Estado para el registro seleccionado


    // Usamos useMemo para evitar recalcular los días transcurridos en cada render
    const enrichedData = useMemo(() => {
        // Aseguramos que data no sea undefined antes de hacer el map
        return (data || []).map((efd) => ({
            ...efd,
            currentStatus: statuses[efd.id] || efd.status,
        }));
    }, [data, statuses]);

    

    if (isLoading) return <p className="text-center text-gray-500">Cargando...</p>;
    if (error) return <p className="text-center text-red-500">Error al cargar los datos</p>;

    const handleView = (efd: CardsEfdType) => {
        setSelectedBoardingEfd(efd);
        setModalOpen(true); // Abrimos el modal
    };

    const handleEdit = (efd: CardsEfdType) => {
        if (role === "BUYER") {
            toast.error("No tienes permiso para realizar esta acción.");
            return;
        }
        setSelectedBoardingEfd(efd);
        setEditModalOpen(true)
    }

    const handleStatusChange = async (id: number, currentStatus: string) => {
        if (role === "BUYER") {
            toast.error("No tienes permiso para realizar esta acción.");
            return;
        }
        const nextStatus = currentStatus === "PENDING" ? "IN_PROCESS" : "COMPLETED";
        const shouldUpdateDaysElapsed = nextStatus === "COMPLETED";

        // Asegurarse de que 'data' esté definido antes de usar find
        if (!data) {
            toast.error("Los datos no están disponibles.");
            return;
        }

        const record = data.find((item) => item.id === id);

        if (!record) {
            console.error("Registro no encontrado");
            toast.error("No se pudo encontrar el registro.");
            return;
        }

        try {
            const response = await fetch("/boarding/efd/card-efd/api", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status: nextStatus,
                    action: "updateStatus",
                    ...(shouldUpdateDaysElapsed && { daysElapsed: record.daysElapsed }),
                }),
            });

            if (!response.ok) {
                throw new Error("Error actualizando el estado");
            }

            const updatedRecord = await response.json();
            setStatuses((prev) => ({ ...prev, [id]: updatedRecord.status }));
            mutate(); // Refresca los datos
            toast.success("Se actualizó el estado correctamente");
        } catch (error) {
            console.error("Error actualizando estado:", error);
            toast.error("Ocurrió un error al cambiar el estado.");
        }
    };

    const handleDelete = async (id: number) => {
        if (role === "BUYER" || role === "ASSIST") {
            toast.error("No tienes permiso para realizar esta acción.");
            return;
        }
    
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`/boarding/efd/card-efd/api`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
    
            if (!response.ok) {
                throw new Error("No se pudo eliminar el registro.");
            }
    
            toast.success("Registro eliminado exitosamente.");
            mutate(); // Refresca los datos en el cliente
        } catch (error) {
            console.error("Error eliminando el registro:", error);
            toast.error("Ocurrió un error al eliminar el registro.");
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <Heading>Gestión de EFD</Heading>
                    <p className="text-lg font-light text-gray-500">
                        Monitorea y administra los registros de EFD con facilidad.
                    </p>
                </div>
                <NavButtonPagination link="/boarding" text="Menú Principal" />
            </div>
            {!enrichedData.length ? (
                <NullData/>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrichedData.map((efd) => (
                        <div
                            key={efd.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                        >
                            {/* Encabezado */}
                            <div className="flex items-center justify-between p-4 bg-gray-100">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${efd.currentStatus === "PENDING"
                                            ? "bg-yellow-500"
                                            : efd.currentStatus === "IN_PROCESS"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                            }`}
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        EFD #{efd.id}
                                    </h3>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${efd.currentStatus === "PENDING"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : efd.currentStatus === "IN_PROCESS"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {efd.currentStatus === "PENDING"
                                        ? "Pendiente"
                                        : efd.currentStatus === "IN_PROCESS"
                                            ? "En Proceso"
                                            : "Completado"}
                                </span>
                            </div>

                            {/* Contenido con Imagen */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="flex-grow space-y-4">
                                    <p className="text-sm text-gray-600">
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(efd.crateEfdDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Días Transcurridos:</strong> {efd.daysElapsed} días
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Embarque:</strong>{" "}
                                        {typeof efd.boarding === "object" && efd.boarding !== null
                                            ? efd.boarding.boxNumber
                                            : efd.boarding}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Responsable:</strong> {efd.responsible}
                                    </p>
                                </div>
                                <Image
                                    src={efd.image || "/placeholder.svg"}
                                    alt="EFD"
                                    width={96} // Tamaño fijo
                                    height={96} // Tamaño fijo
                                    className="rounded-lg object-cover w-24 h-24"
                                />
                            </div>

                            {/* Acciones */}
                            <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="flex items-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
                                        onClick={() => handleView(efd)} // Mostrar información en el modal
                                    >
                                        <FiEye /> Ver
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-yellow-500 font-medium hover:text-yellow-600 transition-colors"
                                        onClick={() => handleEdit(efd)}
                                    >
                                        <FiEdit /> Editar
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
                                        onClick={() => handleDelete(efd.id)}
                                    >
                                        <FiTrash /> Eliminar
                                    </button>
                                </div>
                                <button
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg ${efd.currentStatus === "PENDING"
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                        } transition`}
                                    onClick={() => handleStatusChange(efd.id, efd.currentStatus)}
                                >
                                    {efd.currentStatus === "PENDING"
                                        ? "En Proceso"
                                        : "Completado"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {userId && selectedBoardingEfd && (
                <>
                    <DetailsCards
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        selectedBoardingEfd={selectedBoardingEfd}
                        userId={userId} // Solo pasarlo si no es null
                    />
                    
                    <EditCards
                        isOpen={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        selectedBoardingEfd={selectedBoardingEfd}
                    />

                </> 
            )}
        </>
    );

}
