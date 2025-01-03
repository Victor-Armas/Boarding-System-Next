"use client";

import { useState } from "react";
import useSWR from "swr";
import ImageUpload from "./ImageUpload";
import { toast } from "react-toastify";
import { Boarding, ProblemTypeEfd, Supplier, User } from "@prisma/client";
import BoardingDetails from "./BoardingDetails";
import { createBoardingEfd } from "@/actions/create-efd-action";
import { AddEfdBoarding } from "@/src/schema";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";

export default function BoardingEfdForm() {
    const url = "/boarding/efd/create-efd/api";
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedBoardingId, setSelectedBoardingId] = useState<string | null>(null);


    const { data, error, isLoading } = useSWR<{
        suppliers: Supplier[];
        buyers: User[];
        boardings: Boarding[];
        problemTypeEfd: ProblemTypeEfd[];
    }>(url, fetcher);

    const { data: boardingDetails } = useSWR(
        selectedBoardingId ? `/boarding/efd/create-efd/${selectedBoardingId}` : null,
        fetcher
    );

    const handleBoardingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBoardingId(e.target.value);
    };


    const handleSubmit = async (formData: FormData) => {
        const dateTimeRaw = formData.get("crateEfdDate") as string;
        const dateTimeObj = new Date(dateTimeRaw);
        const dateTime = dateTimeRaw ? convertTimeToMonterrey(dateTimeObj) : null;
        const info = {
            crateEfdDate: dateTime,
            boardingId: parseInt(formData.get('boardingId') as string, 10),
            invoiceNumber: formData.get('invoiceNumber'),
            supplierId: parseInt(formData.get('supplierId') as string, 10),
            ProblemTypeEfdId: parseInt(formData.get('ProblemTypeEfdId') as string, 10),
            buyerId: parseInt(formData.get('buyerId') as string, 10),
            material: formData.get('material'),
            quantityInvoiced: parseInt(formData.get('quantityInvoiced') as string, 10),
            quantityPhysical: parseInt(formData.get('quantityPhysical') as string, 10),
            quantityAsn: parseInt(formData.get('quantityAsn') as string, 10),
            asnNumber: formData.get('asnNumber'),
            responsible: formData.get('responsible'),
            description: formData.get('description'),
            image: formData.get('image')
        }
        const result = AddEfdBoarding.safeParse(info)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        const response = await createBoardingEfd(result.data)
        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success('EFD Creado correctamente')
        setImageUrl("")
        setSelectedBoardingId("")
    };

    const { suppliers, buyers, boardings, problemTypeEfd } = data || {};

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p>Error al cargar los datos</p>;

    return (
        <div className="mt-10 p-8 bg-white rounded-lg shadow-lg">
            <form action={handleSubmit}>
                <div className="md:flex md:w-[1/2] justify-around">
                    <div className="md:w-[70%] md:mr-10">
                        {/* PRIMERA SECCIÓN */}
                        <div className="md:flex gap-6">
                            <div className="md:w-1/3">
                                <label htmlFor="boardingId" className="text-lg font-semibold text-gray-700">Número de Caja</label>
                                <select
                                    id="boardingId"
                                    name="boardingId"
                                    onChange={handleBoardingChange}
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value=""> -- Selecciona un Embarque --</option>
                                    {boardings?.map((boarding) => (
                                        <option key={boarding.id} value={boarding.id}>
                                            {boarding.boxNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="crateEfdDate" className="text-lg font-semibold text-gray-700">Fecha de Carga del EFD</label>
                                <input
                                    id="crateEfdDate"
                                    type="datetime-local"
                                    name="crateEfdDate"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="invoiceNumber" className="text-lg font-semibold text-gray-700">Número de Factura</label>
                                <input
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    type="text"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* SEGUNDA SECCIÓN */}
                        <div className="md:flex gap-6 mt-5">
                            <div className="md:w-1/3">
                                <label htmlFor="supplierId" className="text-lg font-semibold text-gray-700">Proveedor</label>
                                <select
                                    id="supplierId"
                                    name="supplierId"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value=""> -- Selecciona un Proveedor --</option>
                                    {suppliers?.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="buyerId" className="text-lg font-semibold text-gray-700">Comprador</label>
                                <select
                                    id="buyerId"
                                    name="buyerId"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value=""> -- Selecciona un Comprador --</option>
                                    {buyers?.map((buyer) => (
                                        <option key={buyer.id} value={buyer.id}>
                                            {buyer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="material" className="text-lg font-semibold text-gray-700">Número de Material</label>
                                <input
                                    id="material"
                                    name="material"
                                    type="text"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* TERCERA SECCIÓN */}
                        <div className="md:flex gap-6 mt-5">
                            <div className="md:w-1/3">
                                <label htmlFor="quantityInvoiced" className="text-lg font-semibold text-gray-700">Cantidad Facturada</label>
                                <input
                                    id="quantityInvoiced"
                                    name="quantityInvoiced"
                                    type="number"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="quantityPhysical" className="text-lg font-semibold text-gray-700">Cantidad Física</label>
                                <input
                                    id="quantityPhysical"
                                    name="quantityPhysical"
                                    type="number"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="md:w-1/3">
                                <label htmlFor="quantityAsn" className="text-lg font-semibold text-gray-700">Cantidad ASN</label>
                                <input
                                    id="quantityAsn"
                                    name="quantityAsn"
                                    type="number"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* CUARTA SECCIÓN */}
                        <div className="md:flex gap-6 mt-5">
                            <div className="md:w-1/3">
                                <label htmlFor="asnNumber" className="text-lg font-semibold text-gray-700">Número ASN</label>
                                <input
                                    id="asnNumber"
                                    name="asnNumber"
                                    type="text"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div className="md:w-1/3">

                                <label htmlFor="" className="text-lg font-semibold text-gray-700 mt-4">Responsable</label>
                                <select
                                    id="responsible"
                                    name="responsible"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value=""> -- Selecciona un Responsable --</option>
                                    <option value="RYDER">Ryder</option>
                                    <option value="CARRIER">Carrier</option>
                                </select>

                            </div>
                            <div className="md:w-1/3">

                                <label htmlFor="ProblemTypeEfdId" className="text-lg font-semibold text-gray-700 mt-4">Tipo de Problema</label>
                                <select
                                    id="ProblemTypeEfdId"
                                    name="ProblemTypeEfdId"
                                    className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value=""> -- Selecciona un Problema --</option>
                                    {problemTypeEfd?.map((problem) => (
                                        <option key={problem.id} value={problem.id}>
                                            {problem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="md:w-full mt-5">
                            <label htmlFor="description" className="text-lg font-semibold text-gray-700">Descripción del Problema</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Botón de Submit */}
                        <div className="flex justify-center mt-6">
                            <input
                                type="submit"
                                className="w-[80%] uppercase py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
                                value="Cargar EFD"
                            />
                        </div>
                    </div>



                    {/* SECCIÓN DERECHA */}
                    <div className="md:w-[30%] mt-10 md:mt-0">
                            <BoardingDetails boardingDetails={boardingDetails} selectedBoardingId={selectedBoardingId} />
                        <div className="flex justify-center items-center mt-4">
                            <ImageUpload image={imageUrl} />
                        </div>
                    </div>


                </div>
            </form>
        </div>
    );
}
