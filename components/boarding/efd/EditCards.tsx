import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActionModal from "../ActionModal";
import { BoardingEfd } from "@prisma/client";
import { toast } from "react-toastify";
import { EditEfdBoarding, FormValues } from "@/src/schema";
import useSWR, { mutate } from "swr"; // Importar SWR y mutate

type EditCardsProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedBoardingEfd: BoardingEfd; // Información actual del BoardingEfd
};

export default function EditCards({ isOpen, onClose, selectedBoardingEfd }: EditCardsProps) {
    // Usamos SWR para obtener el dato de la BoardingEfd actual (puedes cambiar la URL según el endpoint)
    const { error } = useSWR(`/boarding/efd/card-efd/${selectedBoardingEfd.id}`);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(EditEfdBoarding),
        defaultValues: {
            id: selectedBoardingEfd.id,
            invoiceNumber: selectedBoardingEfd.invoiceNumber,
            supplierId: selectedBoardingEfd.supplierId,
            buyerId: selectedBoardingEfd.buyerId,
            material: selectedBoardingEfd.material,
            quantityInvoiced: selectedBoardingEfd.quantityInvoiced,
            quantityPhysical: selectedBoardingEfd.quantityPhysical,
            quantityAsn: selectedBoardingEfd.quantityAsn,
            asnNumber: selectedBoardingEfd.asnNumber,
            responsible: selectedBoardingEfd.responsible,
            description: selectedBoardingEfd.description ?? "",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const response = await fetch("/boarding/efd/card-efd/api", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "editCard", ...data, id: selectedBoardingEfd.id }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el BoardingEFD");
            }

            toast.success("EFD actualizado correctamente");

            // Actualizar los datos en SWR sin recargar la página
            mutate(`/boarding/efd/card-efd/api`);

            onClose(); // Cerrar el modal después de guardar
        } catch (error) {
            console.error("Error al actualizar:", error);
            toast.error("Error al actualizar el EFD");
        }
    };

    if (error) {
        return <div>Error al cargar los datos.</div>;
    }

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title={`EDITAR EFD #${selectedBoardingEfd.id}`}
            size="max-w-3xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Número de Factura */}
                    <div>
                        <label htmlFor="invoiceNumber" className="block text-sm font-medium">Número de Factura</label>
                        <input
                            id="invoiceNumber"
                            type="text"
                            {...register("invoiceNumber")}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.invoiceNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.invoiceNumber && (
                            <p className="mt-1 text-sm text-red-500">{errors.invoiceNumber.message}</p>
                        )}
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label htmlFor="supplierId" className="block text-sm font-medium">Proveedor (ID)</label>
                        <input
                            id="supplierId"
                            type="number"
                            {...register("supplierId", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.supplierId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.supplierId && (
                            <p className="mt-1 text-sm text-red-500">{errors.supplierId.message}</p>
                        )}
                    </div>

                    {/* Comprador */}
                    <div>
                        <label htmlFor="buyerId" className="block text-sm font-medium">Comprador (ID)</label>
                        <input
                            id="buyerId"
                            type="number"
                            {...register("buyerId", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.buyerId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.buyerId && (
                            <p className="mt-1 text-sm text-red-500">{errors.buyerId.message}</p>
                        )}
                    </div>

                    {/* Material */}
                    <div>
                        <label className="block text-sm font-medium">Material</label>
                        <input
                            type="text"
                            {...register("material")}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.material ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.material && (
                            <p className="mt-1 text-sm text-red-500">{errors.material.message}</p>
                        )}
                    </div>

                    {/* Cantidad Facturada */}
                    <div>
                        <label className="block text-sm font-medium">Cantidad Facturada</label>
                        <input
                            type="number"
                            {...register("quantityInvoiced", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.quantityInvoiced ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.quantityInvoiced && (
                            <p className="mt-1 text-sm text-red-500">{errors.quantityInvoiced.message}</p>
                        )}
                    </div>

                    {/* Cantidad Física */}
                    <div>
                        <label className="block text-sm font-medium">Cantidad Física</label>
                        <input
                            type="number"
                            {...register("quantityPhysical", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.quantityPhysical ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.quantityPhysical && (
                            <p className="mt-1 text-sm text-red-500">{errors.quantityPhysical.message}</p>
                        )}
                    </div>

                    {/* Cantidad ASN */}
                    <div>
                        <label className="block text-sm font-medium">Cantidad ASN</label>
                        <input
                            type="number"
                            {...register("quantityAsn", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.quantityAsn ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.quantityAsn && (
                            <p className="mt-1 text-sm text-red-500">{errors.quantityAsn.message}</p>
                        )}
                    </div>

                    {/* Número ASN */}
                    <div>
                        <label className="block text-sm font-medium">Número ASN</label>
                        <input
                            type="text"
                            {...register("asnNumber")}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.asnNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.asnNumber && (
                            <p className="mt-1 text-sm text-red-500">{errors.asnNumber.message}</p>
                        )}
                    </div>

                    {/* Responsable */}
                    <div>
                        <label className="block text-sm font-medium">Responsable</label>
                        <input
                            type="text"
                            {...register("responsible")}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.responsible ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.responsible && (
                            <p className="mt-1 text-sm text-red-500">{errors.responsible.message}</p>
                        )}
                    </div>

                    {/* Descripción (Ocupa toda la fila) */}
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-sm font-medium">Descripción</label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                </div>

                {/* Botón de acción */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </ActionModal>
    );
}
