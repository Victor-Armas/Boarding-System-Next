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
import ProblemButton from "@/components/boarding/ActionButtonStatus/ProblemButton";

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

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading>Estado de Descarga</Heading>
                </div>
                <NavButtonPagination link="/boarding" text="Menú Principal" />
            </div>

            <div className="p-8 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Pendiente Descarga */}
                <StatusCard
                    title="Pendiente de Descarga"
                    data={ramps}
                    txtColor="text-yellow-800"
                    bgColor="bg-yellow-400"
                    renderButtons={(boarding) =>
                        role !== "BUYER" && (
                            <>
                                <div className="flex justify-between w-full">
                                    <RampButton boarding={boarding} />
                                    <ProblemButton boarding={boarding} state="PENDING_DOWNLOAD" />
                                </div>
                            </>
                        )
                    }
                />

                {/* En Descarga */}
                <StatusCard
                    title="En Descarga"
                    data={downloadings}
                    txtColor="text-blue-800"
                    bgColor="bg-blue-400"
                    renderButtons={(boarding) =>
                        role !== "BUYER" && (
                            <>
                                <div className="flex justify-between w-full">
                                    <DownloadingButton boarding={boarding} />
                                    <ProblemButton boarding={boarding} state="DOWNLOADING" />
                                </div>
                            </>
                        )
                    }
                />

                {/* En Validación */}
                <StatusCard
                    title="En Validación"
                    data={validatings}
                    txtColor="text-purple-800"
                    bgColor="bg-purple-400"
                    renderButtons={(boarding) =>
                        role !== "BUYER" && (
                            <>
                                <div className="flex justify-between w-full">
                                    <ValidatingButton boarding={boarding} />
                                    <ProblemButton boarding={boarding} state="VALIDATING" />
                                </div>
                            </>
                        )}
                />

                {/* En Captura */}
                <StatusCard
                    title="En Captura"
                    data={capturings}
                    txtColor="text-green-800"
                    bgColor="bg-green-400"
                    renderButtons={(boarding) => role !== "BUYER" && (
                        <>
                            <div className="flex justify-between w-full">
                                <CapturingButton boarding={boarding} />
                                <ProblemButton boarding={boarding} state="CAPTURING" />
                            </div>
                        </>
                    )
                    }
                />
            </div>

            {/* Completado */}
            <CompletedStatus data={completeds} />



        </>
    );
}
