"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash, FaCheckCircle, FaDownload, FaClock, FaBoxes, FaRoad, FaTruck, FaCalendarAlt, FaBox, FaRegListAlt } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Para la redirección
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";
import { cajaTypeMap, statusMapping, statusStyles } from "@/src/utils/traductions";
import { BoardingList } from "@/src/types";
import ActionModal from "@/components/boarding/ActionModal";
import { useUserRole } from "@/src/utils/useUserRole";
import { FaComputer } from "react-icons/fa6";
import { formatDuration } from "@/src/utils/timeFormatter";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener los datos.");
  return res.json();
};

export default function ListBoardingPage() {
  const { role } = useUserRole();

  const [filters, setFilters] = useState({
    boxNumber: "",
    arrivalDate: "",
    supplier: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBoarding, setSelectedBoarding] = useState<BoardingList | null>(null); // Estado para el registro seleccionado
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const router = useRouter(); // Para redirigir al editar

  const { data, error, isLoading, mutate } = useSWR(
    `/boarding/list/api?boxNumber=${filters.boxNumber}&arrivalDate=${filters.arrivalDate}&supplier=${filters.supplier}&status=${filters.status}&page=${currentPage}`,
    fetcher
  );

  if (error) toast.error("Error al cargar los datos.");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value.toLowerCase() });
  };

  const handleView = (boarding: BoardingList) => {
    setSelectedBoarding(boarding);
    setModalOpen(true); // Abrimos el modal
  };

  const handleEdit = (id: string) => {
    if (role === "BUYER" || role === "ASSIST") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    router.push(`/boarding/edit/${id}`); // Redirigimos a la ruta de edición
  };

  const handleDelete = async (id: string) => {
    if (role === "BUYER" || role === "ASSIST") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    try {
      const res = await fetch(`/boarding/list/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar el registro.");
      toast.success("Registro eliminado correctamente.");
      mutate(); // Actualizamos los datos usando SWR
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <Heading>Listado de Embarques</Heading>
        <NavButtonPagination link="/boarding" text="Menú Principal" />
      </div>

      {/* Contenido principal */}
      <div className="mx-auto px-4 sm:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <input
              type="text"
              name="boxNumber"
              placeholder="Número de caja"
              value={filters.boxNumber}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="date"
              name="arrivalDate"
              value={filters.arrivalDate}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              name="supplier"
              placeholder="Proveedor"
              value={filters.supplier}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Seleccione el Estatus --</option>
              <option value="PENDING_DOWNLOAD">Pendiente</option>
              <option value="DOWNLOADING">Descargando</option>
              <option value="VALIDATING">Validando</option>
              <option value="CAPTURING">Capturando</option>
              <option value="COMPLETED">Completado</option>
            </select>
            <button
              onClick={() => setCurrentPage(1)}
              className="col-span-1 sm:col-span-2 lg:col-span-1 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="mt-10 overflow-x-auto bg-white shadow-lg rounded-lg">
          {isLoading ? (
            <p className="text-center text-gray-500 p-6">Cargando...</p>
          ) : (
            <table className="w-full text-left table-auto">
              <thead className="bg-indigo-600 text-white text-center">
                <tr>
                  {[
                    "Acciones",
                    "Número de Caja",
                    "Fecha de Llegada",
                    "Proveedor",
                    "Tipo de Transporte",
                    "Total de Tarimas",
                    "Estatus",
                    "Tiempo en Rampa",
                    "Tiempo en Descarga",
                    "Tiempo en Validación",
                    "Tiempo en Captura",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-sm font-medium whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
                {data?.data.map((boarding: BoardingList) => (
                  <tr key={boarding.id} className="hover:bg-gray-100">

                    {/* Botones de acción */}
                    <td className="px-6 py-4 flex justify-center space-x-4">
                      {/* Botón Ver */}
                      <button
                        onClick={() => handleView(boarding)} // Mostrar información en el modal
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>

                      {/* Botón Editar */}
                      <button
                        onClick={() => handleEdit(boarding.id.toString())} // Redirigir a la página de edición
                        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleDelete(boarding.id.toString())} // Eliminar el registro
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">{boarding.boxNumber}</td>
                    <td className="px-6 py-4">
                      {new Date(boarding.arrivalDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{boarding.supplier.name}</td>
                    <td className="px-6 py-4">{cajaTypeMap[boarding.boxType]}</td>
                    <td className="px-6 py-4">
                      {boarding.pallets === null ? (
                        <span className="bg-yellow-400 p-2 rounded-lg text-white">Pendiente</span>
                      ) : (
                        boarding.pallets
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`${statusStyles[boarding.status]} px-4 py-2 rounded-lg inline-block whitespace-nowrap`}
                      >
                        {statusMapping[boarding.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {boarding.timeUntilRamp === null ? (
                        <span className="bg-yellow-400 p-2 rounded-lg text-white">Pendiente</span>
                      ) : (
                        formatDuration(boarding.timeUntilRamp)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {boarding.downloadDuration === null ? (
                        <span className="bg-yellow-400 p-2 rounded-lg text-white">Pendiente</span>
                      ) : (
                        formatDuration(boarding.downloadDuration)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {boarding.validationDuration === null ? (
                        <span className="bg-yellow-400 p-2 rounded-lg text-white">Pendiente</span>
                      ) : (
                        formatDuration(boarding.validationDuration)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {boarding.captureDuration === null ? (
                        <span className="bg-yellow-400 p-2 rounded-lg text-white">Pendiente</span>
                      ) : (
                        formatDuration(boarding.captureDuration)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        <ActionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Detalles del Embarque"
          size="max-w-3xl"
        >
          <div className="p-6">
            {selectedBoarding && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Número de Caja */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaBox className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Número de Caja</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.boxNumber}</p>
                </div>

                {/* Fecha de Llegada */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaCalendarAlt className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Fecha de Llegada</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">
                    {new Date(selectedBoarding.arrivalDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Proveedor */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaTruck className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Proveedor</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.supplier.name}</p>
                </div>

                {/* Tipo de Transporte */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaRoad className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Tipo de Transporte</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{cajaTypeMap[selectedBoarding.boxType]}</p>
                </div>

                {/* Total de Tarimas */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaBoxes className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Total de Tarimas</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.pallets || "Pendiente"}</p>
                </div>

                {/* Tiempo en Rampa */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaClock className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Tiempo en Rampa</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2"> {selectedBoarding.timeUntilRamp === null ? "Pendiente" : formatDuration(selectedBoarding.timeUntilRamp)}</p>
                </div>

                {/* Tiempo en Descarga */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaDownload className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Tiempo en Descarga</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.downloadDuration === null ? "Pendiente" : formatDuration(selectedBoarding.downloadDuration)}</p>
                </div>

                {/* Tiempo en Validación */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaRegListAlt className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Tiempo en Validación</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.validationDuration === null ? "Pendiente" : formatDuration(selectedBoarding.validationDuration)}</p>
                </div>

                {/* Tiempo en Captura */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                  <FaComputer className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Tiempo en Captura</span>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedBoarding.captureDuration === null ? "Pendiente" : formatDuration(selectedBoarding.captureDuration)}</p>
                </div>

                {/* Estatus */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center col-span-full">
                  <FaCheckCircle className="text-indigo-500 w-8 h-8 mb-4" />
                  <span className="text-sm font-semibold text-gray-500">Estatus</span>
                  <span
                    className={`${statusStyles[selectedBoarding.status]} px-4 py-2 rounded-full text-white mt-2`}
                  >
                    {statusMapping[selectedBoarding.status]}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ActionModal>




      </div>
    </>
  );
}
