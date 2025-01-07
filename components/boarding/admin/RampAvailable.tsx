"use client";
import { useState } from "react";
import useSWR from "swr";
import { Ramp } from "@prisma/client";
import { toast } from "react-toastify";

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function RampAvailable() {
    const url = "/boarding/admin/api?type=rampas";
    const { data: rampas, error, mutate } = useSWR<Ramp[]>(url, fetcher);
    const itemsPerPage = 10; // Número de rampas por grupo
    const [activeTab, setActiveTab] = useState(0);

    const handleChangeRampAvailable = async (
        rampaId: Ramp["id"],
        available: Ramp["available"],
        name: Ramp["nameRamp"]
    ) => {
        try {
            const updatedAvailability = !available;

            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "updateAvailableRamp",
                    rampaId,
                    rampaAvailable: updatedAvailability,
                }),
            });

            if (response.ok) {
                toast.success(`${name} cambiada correctamente`);
                mutate();
            } else {
                toast.error("Error al cambiar la disponibilidad de la rampa");
            }
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al realizar la acción");
        }
    };

    if (error) return <div>Error al cargar las rampas.</div>;
    if (!rampas) return <div>Cargando...</div>;

    if (!Array.isArray(rampas)) {
        console.error("Los datos recibidos no son un array:", rampas);
        return <div>Error: los datos recibidos no son válidos.</div>;
    }

    // Agrupar rampas en lotes según el número de elementos por grupo
    const groupedRampas: Ramp[][] = rampas.reduce((groups: Ramp[][], rampa, index) => {
        const groupIndex = Math.floor(index / itemsPerPage);
        if (!groups[groupIndex]) groups[groupIndex] = [];
        groups[groupIndex].push(rampa);
        return groups;
    }, []);

    return (
        <div className="mx-auto px-4 py-2">

            {/* Rampas Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupedRampas[activeTab]?.map((rampa) => (
                    <input
                        key={rampa.id}
                        type="submit"
                        value={rampa.nameRamp}
                        className={`p-2 text-sm shadow-lg text-center uppercase rounded-lg font-bold ${rampa.available
                            ? "bg-green-400 hover:bg-green-500 text-green-800"
                            : "bg-red-400 hover:bg-red-500 text-red-800"
                            } transition-all cursor-pointer`}
                        onClick={() =>
                            handleChangeRampAvailable(rampa.id, rampa.available, rampa.nameRamp)
                        }
                    />
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-5">
                {groupedRampas.map((_, index) => (
                    <button
                        key={index}
                        className={`px-2 py-1 rounded-lg font-medium transition-all duration-300 ${activeTab === index
                                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setActiveTab(index)}
                    >
                        Grupo {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
