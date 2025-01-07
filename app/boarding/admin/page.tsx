"use client"
import { FaBox, FaTruck, FaUser, FaCogs } from 'react-icons/fa';
import RampAvailable from '@/components/boarding/admin/RampAvailable'
import { useState } from 'react';
import ValidatorList from '@/components/boarding/admin/ValidatorList';
import ForkliftOperatorList from '@/components/boarding/admin/ForkliftOperatorList';
import AssistantList from '@/components/boarding/admin/AssistantList';

export default function AdminCustomePage() {
    const [activeTab, setActiveTab] = useState(0);
    const [isRampAvailableVisible, setIsRampAvailableVisible] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <ValidatorList/>;
            case 1:
                return <ForkliftOperatorList/> ;
            case 2:
                return <AssistantList/>;
            default:
                return null;
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sección izquierda: Tabs */}
            <div className="bg-white w-full md:w-[20%] p-4 md:p-6 shadow-lg sticky top-0">
                <h2 className="text-blue-700 text-2xl font-semibold mb-4">Panel Administrativo</h2>
                <p className="text-lg text-gray-500 mb-6">Selecciona un rol para gestionar</p>

                {/* Tabs */}
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    <button
                        className={`py-3 px-4 rounded-lg flex items-center transition duration-300 ${activeTab === 0
                            ? "bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setActiveTab(0)}
                    >
                        <FaBox className="w-6 h-6" />
                        <span className="ml-2 font-medium">Almacenista</span>
                    </button>
                    <button
                        className={`py-3 px-4 rounded-lg flex items-center transition duration-300 ${activeTab === 1
                            ? "bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setActiveTab(1)}
                    >
                        <FaTruck className="w-6 h-6" />
                        <span className="ml-2 font-medium">Montacarguista</span>
                    </button>
                    <button
                        className={`py-3 px-4 rounded-lg flex items-center transition duration-300 ${activeTab === 2
                            ? "bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setActiveTab(2)}
                    >
                        <FaUser className="w-6 h-6" />
                        <span className="ml-2 font-medium">Capturista</span>
                    </button>
                </div>
            </div>

            {/* Sección derecha: Contenido */}
            <div className="flex-1 w-full px-4 md:px-6">
                {/* Componente RampAvailable */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-blue-700 text-2xl font-semibold">Gestión de Rampas</h2>
                            <p className="text-lg text-gray-500">Selecciona un rol para gestionar</p>
                        </div>
                        <button
                            onClick={() => setIsRampAvailableVisible(!isRampAvailableVisible)}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition duration-300"
                        >
                            {isRampAvailableVisible ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    {isRampAvailableVisible && (
                        <div
                            className="overflow-hidden transition-max-height duration-500 ease-in-out"
                            style={{
                                maxHeight: isRampAvailableVisible ? "1000px" : "0px",
                            }}
                        >
                            <RampAvailable />
                        </div>
                    )}
                </div>

                {/* Contenido del tab seleccionado */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {activeTab === 0 && "Almacenista"}
                        {activeTab === 1 && "Montacarguista"}
                        {activeTab === 2 && "Capturista"}
                    </h2>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );

}


