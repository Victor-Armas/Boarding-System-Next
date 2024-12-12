"use client"
import useSWR from "swr";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";
import React from "react";
import { BoardingGrouped } from "@/src/types";
import StatusCard from "@/components/boarding/StatusCard";
import CompletedStatus from "@/components/boarding/CompletedStatus";
import RampButton from "@/components/boarding/ActionButtonStatus/RampButton";
import DownloadingButton from "@/components/boarding/ActionButtonStatus/DownloadingButton";
import ValidatingButton from "@/components/boarding/ActionButtonStatus/ValidatingButton";
import CapturingButton from "@/components/boarding/ActionButtonStatus/CapturingButton";
import { useUserRole } from "@/src/utils/useUserRole";
import { toast } from "react-toastify";

export default function UnloadingStatusPage() {
    const { role } = useUserRole();
    const url = '/boarding/unloading-status/api'
    const fetcher = () => fetch(url).then(res => res.json()).then(data => data)
    const { data, error, isLoading } = useSWR<BoardingGrouped>(url, fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: false,
    })

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar datos</p>;

    // Verifica si `data` está definido
    if (!data) {
        return <p>No hay datos disponibles</p>;
    }

    const { ramp: ramps, downloading: downloadings, validating: validatings, capturing: capturings, completed: completeds } = data

    // Función para verificar permisos antes de ejecutar una acción
    const handleRestrictedAction = (action: () => void) => {
        if (role === "BUYER" || role === "ASSIST") {
            toast.error("No tienes permiso para realizar esta acción.");
            return;
        }
        action(); // Ejecuta la acción si el rol tiene permisos
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading>Estado de Descarga</Heading>
                </div>
                <NavButtonPagination link="/boarding" text="Menú Principal" />
            </div>

            <div className="p-8 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Pendiente Descarga */}
                <StatusCard
                    title="Pendiente de Descarga"
                    data={ramps}
                    bgColor="bg-yellow-400"
                    renderButtons={(boarding) => role !== "BUYER" ? <RampButton boarding={boarding} /> : null}
                />

                {/* En Descarga */}
                <StatusCard
                    title="En Descarga"
                    data={downloadings}
                    bgColor="bg-blue-400"
                    renderButtons={(boarding) => role !== "BUYER" ? <DownloadingButton boarding={boarding} /> : null}
                />

                {/* En Validación */}
                <StatusCard
                    title="En Validación"
                    data={validatings}
                    bgColor="bg-purple-400"
                    renderButtons={(boarding) => role !== "BUYER" ? <ValidatingButton boarding={boarding} />: null}
                />

                {/* En Captura */}
                <StatusCard
                    title="En Captura"
                    data={capturings}
                    bgColor="bg-green-400"
                    renderButtons={(boarding) => role !== "BUYER" ? <CapturingButton boarding={boarding} /> : null}
                />
            </div>

            {/* Completado */}
            <CompletedStatus data={completeds} />


        </>
    );
}

