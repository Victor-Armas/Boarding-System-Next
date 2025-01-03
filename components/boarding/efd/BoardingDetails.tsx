import { Boarding } from "@prisma/client";
import { FaIdBadge, FaBox, FaCalendarAlt, FaClock } from "react-icons/fa";

export type BoardingDetailsProp = {
    boardingDetails: Boarding | undefined;
    selectedBoardingId: string | null
}

export default function BoardingDetails({ boardingDetails, selectedBoardingId }: BoardingDetailsProp) {
    return (
        <div className="p-6 mb-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
                Embarque Seleccionado
            </h2>
            {boardingDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-600">
                    {/* ID */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-500 rounded-full shadow-md">
                            <FaIdBadge size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">ID</p>
                            <p className="text-base font-semibold text-gray-800">{boardingDetails.id}</p>
                        </div>
                    </div>

                    {/* Número de Caja */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-500 rounded-full shadow-md">
                            <FaBox size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Número de Caja</p>
                            <p className="text-base font-semibold text-gray-800">{boardingDetails.boxNumber}</p>
                        </div>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-500 rounded-full shadow-md">
                            <FaCalendarAlt size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Fecha</p>
                            <p className="text-base font-semibold text-gray-800">
                                {new Date(boardingDetails.arrivalDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Hora */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-500 rounded-full shadow-md">
                            <FaClock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Hora</p>
                            <p className="text-base font-semibold text-gray-800">
                                {new Date(boardingDetails.arrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            ) : selectedBoardingId ? (
                <div className="text-center text-blue-500 font-medium">
                    <p className="animate-pulse">Cargando detalles...</p>
                </div>
            ) : (
                <div className="text-center text-gray-400 font-medium">
                    <p>Selecciona un embarque para ver los detalles.</p>
                </div>
            )}
        </div>
    );
}
