"use client";
import { BoardingEdithType } from "@/src/types";
import { Assistant, ForkliftOperator, Ramp, Supplier, Validator } from "@prisma/client";
import { FaBox, FaCalendarAlt, FaTruck, FaUserAlt, FaClipboard, FaCommentDots, FaPlusCircle } from "react-icons/fa";
import useSWR from "swr";
import { EdithBoarding } from "@/src/schema";
import { useState } from "react";
import { toast } from "react-toastify";
import { cajaTypeOptions } from "@/src/utils/traductions";

type EditBoardingFormProp = {
    boarding: BoardingEdithType;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditBoardingForm({ boarding }: EditBoardingFormProp) {
    const { data, error } = useSWR("/boarding/edit/api", fetcher);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Para manejar el estado de carga del formulario

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Recoger los datos del formulario
        const formData = new FormData(e.target as HTMLFormElement);
        const arrivalDate = new Date(formData.get("arrivalDate") as string);
        const data = {
            id: boarding.id,
            boxNumber: formData.get("boxNumber") as string,
            arrivalDate: arrivalDate,
            boxType: formData.get("boxType") as string,
            forkliftOperatorId: parseInt(formData.get("forkliftOperatorId") as string),
            validatorId: parseInt(formData.get("validatorId") as string),
            assistantId: parseInt(formData.get("assistantId") as string),
            rampId: parseInt(formData.get("rampId") as string),
            supplierId: parseInt(formData.get("supplierId") as string),
            pallets: parseInt(formData.get("pallets") as string),
            comments: formData.get("comments") as string,
        };

        // Validación con Zod
        const result = EdithBoarding.safeParse(data);
        if (!result.success) {
            setFormError(result.error.errors.map(err => err.message).join(", "));
            return;
        }

        setIsSubmitting(true); // Activar el estado de carga

        // Si la validación es exitosa, hacer la solicitud PUT
        try {
            const response = await fetch("/boarding/edit/api", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error del servidor:", errorResponse);
                throw new Error(errorResponse.error || "Error al actualizar el embarque.");
            }

            toast.success("Embarque actualizado correctamente");
        } catch (error) {
            setFormError(
                "Hubo un error al actualizar el embarque: " +
                (error instanceof Error ? error.message : "Error desconocido.")
            );
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return <div>Ocurrió un error al cargar los datos.</div>;
    }

    if (!data) {
        return <div>Cargando...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 p-8 bg-white rounded-xl shadow-xl w-full max-w-screen-xl mx-auto mt-20">
            {/* Mostrar el error de formulario */}
            {formError && (
                <div className="text-red-500 mb-4">
                    <strong>Error:</strong> {formError}
                </div>
            )}

            {/* Sección Información Básica */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Número de caja */}
                <div className="space-y-2">
                    <label htmlFor="boxNumber" className="flex items-center text-lg font-bold text-gray-800">
                        <FaBox className="mr-3 text-blue-500" />
                        Número de Caja
                    </label>
                    <input
                        type="text"
                        id="boxNumber"
                        name="boxNumber"
                        defaultValue={boarding.boxNumber}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    />
                </div>

                {/* Fecha de llegada */}
                <div className="space-y-2">
                    <label htmlFor="arrivalDate" className="flex items-center text-lg font-bold text-gray-800">
                        <FaCalendarAlt className="mr-3 text-blue-500" />
                        Fecha de Llegada
                    </label>
                    <input
                        type="datetime-local"
                        id="arrivalDate"
                        name="arrivalDate"
                        defaultValue={boarding.arrivalDate.toISOString().slice(0, 16)}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    />
                </div>
            </div>

            {/* Sección Proveedor y Rampa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Proveedor */}
                <div className="space-y-2">
                    <label htmlFor="supplierId" className="flex items-center text-lg font-bold text-gray-800">
                        <FaTruck className="mr-3 text-blue-500" />
                        Proveedor
                    </label>
                    <select
                        id="supplierId"
                        name="supplierId"
                        defaultValue={boarding.supplierId}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>--Selecciona un proveedor--</option>
                        {data.suppliers.map((supplier: Supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rampa */}
                <div className="space-y-2">
                    <label htmlFor="rampId" className="flex items-center text-lg font-bold text-gray-800">
                        <FaClipboard className="mr-3 text-blue-500" />
                        Rampa
                    </label>
                    <select
                        id="rampId"
                        name="rampId"
                        defaultValue={boarding.rampId || ""}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>Selecciona una rampa</option>
                        {data.ramps.map((ramp: Ramp) => (
                            <option key={ramp.id} value={ramp.id}>
                                {ramp.nameRamp}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sección Montacarguista y Validador */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Montacarguista */}
                <div className="space-y-2">
                    <label htmlFor="forkliftOperatorId" className="flex items-center text-lg font-bold text-gray-800">
                        <FaUserAlt className="mr-3 text-blue-500" />
                        Operador de Montacargas
                    </label>
                    <select
                        id="forkliftOperatorId"
                        name="forkliftOperatorId"
                        defaultValue={boarding.forkliftOperatorId || ""}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>-- Selecciona Operador --</option>
                        {data.forkliftOperators.map((forkliftOperator: ForkliftOperator) => (
                            <option key={forkliftOperator.id} value={forkliftOperator.id}>
                                {forkliftOperator.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Validador */}
                <div className="space-y-2">
                    <label htmlFor="validatorId" className="flex items-center text-lg font-bold text-gray-800">
                        <FaClipboard className="mr-3 text-blue-500" />
                        Validador
                    </label>
                    <select
                        id="validatorId"
                        name="validatorId"
                        defaultValue={boarding.validatorId || ""}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>-- Selecciona Validador --</option>
                        {data.validators.map((validator: Validator) => (
                            <option key={validator.id} value={validator.id}>
                                {validator.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sección Asistente y Palets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Asistente */}
                <div className="space-y-2">
                    <label htmlFor="assistantId" className="flex items-center text-lg font-bold text-gray-800">
                        <FaUserAlt className="mr-3 text-blue-500" />
                        Asistente
                    </label>
                    <select
                        id="assistantId"
                        name="assistantId"
                        defaultValue={boarding.assistantId || ""}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    >
                        <option value="" disabled>-- Selecciona Capturista --</option>
                        {data.assistants.map((assistant: Assistant) => (
                            <option key={assistant.id} value={assistant.id}>
                                {assistant.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Palets */}
                <div className="space-y-2">
                    <label htmlFor="pallets" className="flex items-center text-lg font-bold text-gray-800">
                        <FaPlusCircle className="mr-3 text-blue-500" />
                        Número de Palets
                    </label>
                    <input
                        type="number"
                        id="pallets"
                        name="pallets"
                        defaultValue={boarding.pallets || ""}
                        className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="boxType" className="flex items-center text-lg font-bold text-gray-800">
                    <FaUserAlt className="mr-3 text-blue-500" />
                    Tipo de Caja
                </label>
                <select
                    id="boxType"
                    name="boxType"
                    defaultValue={boarding.boxType || ""}
                    className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                >
                    <option value="">-- Seleccione --</option>
                    {cajaTypeOptions.map((box) => (
                        <option key={box.value} value={box.value}>
                            {box.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sección Comentarios */}
            <div className="space-y-2">
                <label htmlFor="comments" className="flex items-center text-lg font-bold text-gray-800">
                    <FaCommentDots className="mr-3 text-blue-500" />
                    Comentarios
                </label>
                <textarea
                    id="comments"
                    name="comments"
                    defaultValue={boarding.comments}
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                />
            </div>

            {/* Botón Enviar */}
            <div className="text-center">
                <button
                    type="submit"
                    className="w-full py-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-blue-300 transition duration-300 transform hover:scale-105"
                    disabled={isSubmitting} // Deshabilitar el botón mientras se está enviando
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
