"use client"
import { useState } from "react";
import useSWR from "swr";
import { format } from 'date-fns-tz';
import { StatusMappingEFD, statusStylesEFD } from "@/src/utils/traductions";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";
import { FaRegEye } from "react-icons/fa";

interface EfdItem {
  id: number;
  crateEfdDate: string;
  material: string;
  invoiceNumber: string;
  asnNumber: string;
  responsible: string;
  description: string;
  status: string;
  ProblemTypeEfd: { name: string };
  supplier: { name: string };
  buyer: { name: string };
  boarding: { boxNumber: string };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EfdListPage() {
  const [filters, setFilters] = useState({
    crateEfdDate: "",
    supplier: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Tamaño de página fijo

  const { data, error, isLoading } = useSWR(
    `/boarding/efd/list-efd/api?crateEfdDate=${filters.crateEfdDate}&supplier=${filters.supplier}&status=${filters.status}&page=${currentPage}&pageSize=${pageSize}`,
    fetcher
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1)
  };
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) return <div>Error al cargar los datos</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <Heading>Listado de EFD</Heading>
              <NavButtonPagination link="/boarding" text="Menú Principal" />
            </div>
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-8 shadow-lg rounded-lg">
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.crateEfdDate}
          onChange={(e) => handleFilterChange("crateEfdDate", e.target.value)}
          placeholder="Filtrar por fecha"
        />
        <input
          type="text"
          className="border p-2 rounded"
          value={filters.supplier}
          onChange={(e) => handleFilterChange("supplier", e.target.value)}
          placeholder="Filtrar por proveedor"
        />
        <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROCESS">En Proceso</option>
          <option value="COMPLETED">Completado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="mt-10 overflow-x-auto bg-white shadow-lg rounded-lg">

        {isLoading ? (
          <p className="text-center text-gray-500 p-6">Cargando...</p>
        ):(
          <table className="w-full ">
            <thead className="bg-indigo-600 text-white text-center">
              <tr className="">
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Acciones</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Numero de Caja</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Proveedor</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Descripción</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Tipo de Problema</th>
                <th className="px-6 py-4 text-md font-medium whitespace-nowrap">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {data?.listEfd.map((item: EfdItem) => (
                <tr key={item.id} className="hover:bg-gray-100 text-center"> 
                  <td className="px-6 py-4 text-center">
                    <button className=" bg-blue-500 p-3 rounded-lg text-xl text-white hover:underline">
                      <FaRegEye className=""/>
                    </button>
                  </td>
                  <td className="px-6 py-4">{item.boarding.boxNumber}</td>
                  <td className="px-6 py-4">
                    {format(new Date(item.crateEfdDate), "dd-MMM-yy", {
                      timeZone: 'America/Monterrey',
                    })}
                  </td>
                  <td className="px-6 py-4">{item.supplier.name}</td>
                  <td className="px-6 py-4"> <span className={`${statusStylesEFD[item.status]} rounded-full text-white px-4 py-2 inline-block whitespace-nowrap `}>{StatusMappingEFD[item.status]}</span></td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.ProblemTypeEfd.name}</td>
                  <td className="px-6 py-4"><span className={`${item.responsible === "RYDER" ? ("bg-red-600 text-red-800") : ("bg-blue-600 text-blue-800")} bg-opacity-30 px-4 py-2 font-bold rounded-full`}>{item.responsible}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

         {/* Paginación */}
         {data && data.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="mx-4 text-lg">
              Página {currentPage} de {data.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage < data.totalPages ? currentPage + 1 : data.totalPages)}
              disabled={currentPage === data.totalPages}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
    </div>
  );
}
