"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {EyeIcon,PencilSquareIcon,TrashIcon,} from "@heroicons/react/20/solid";
import { Boarding } from "@prisma/client";
import Modal from "../ui/Modal";
import { toast } from "react-toastify";

type BoardingTableClientProps = {
  boardings: Boarding[];
};

export default function BoardingTableClient({boardings}: BoardingTableClientProps) {
  const [updatedBoardings, setUpdatedBoardings] = useState(boardings); // Mantener el estado de los embarques
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBoarding, setSelectedBoarding] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");


  useEffect(() => {
    // Cuando selectedBoarding cambie, sincronizamos el newStatus con el estado del embarque
    if (selectedBoarding) {
      setNewStatus(selectedBoarding.status);
    }
  }, [selectedBoarding]);

  const handleOpenModal = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/boarding/${id}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedBoarding(data);
        setModalOpen(true);
      } else {
        toast.error("Error al obtener el embarque:", data.error);
      }
    } catch (error) {
      toast.error("Error de red");
    }
    setLoading(false);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setNewStatus(selectedStatus);

    // Aquí realizamos la actualización en la base de datos
    try {
      const response = await fetch(`/api/boarding/${selectedBoarding.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Estado Actualizado Correctamente", data);
        setSelectedBoarding(data); // Actualizar el estado en el modal

        // Actualizar el listado de embarques en el estado local
        const updatedList = updatedBoardings.map((boarding) =>
          boarding.id === data.id
            ? { ...boarding, status: data.status }
            : boarding
        );
        setUpdatedBoardings(updatedList); // Actualizar el estado con el nuevo valor
      } else {
        toast.error("Error al actualizar el estado:");
      }
    } catch (error) {
      toast.error("Error de red al actualizar el estado:");
    }
  };

  const statusMapping: Record<string, string> = {
    PENDING_DOWNLOAD: "Pendiente de descarga",
    DOWNLOADING: "En descarga",
    VALIDATING: "En validación",
    CAPTURING: "En captura",
    COMPLETED: "Completado",
  };

  const statusStyles: Record<string, string> = {
    PENDING_DOWNLOAD: "bg-yellow-500 text-white",
    DOWNLOADING: "bg-blue-500 text-white",
    VALIDATING: "bg-purple-500 text-white",
    CAPTURING: "bg-green-500 text-white",
    COMPLETED: "bg-green-700 text-white",
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-20">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    # Caja
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Proveedor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Estado
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {boardings.map((boarding) => (
                  <tr key={boarding.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {boarding.numberBox}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {boarding.supplier}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(boarding.dateTime))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`px-4 py-2 rounded-full ${
                          statusStyles[boarding.status]
                        }`}
                      >
                        {statusMapping[boarding.status]}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 w-[26%]">
                      <div className="grid grid-cols-3 gap-3 text-white">
                        <button
                          onClick={() => handleOpenModal(boarding.id)}
                          className="bg-blue-500 p-2 flex justify-center rounded-md"
                        >
                          <EyeIcon className="w-5 h-5 text-white" />
                        </button>
                        <Link
                          href={`/api/boarding/edit/${boarding.id}`}
                          className="bg-yellow-500 p-2 flex justify-center rounded-md"
                        >
                          <PencilSquareIcon className="w-[23%]" />
                        </Link>
                        <Link
                          href={`#$`}
                          className="bg-red-500 p-2 flex justify-center rounded-md"
                        >
                          <TrashIcon className="w-[23%]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
              {loading ? (
                <div className="text-xl font-semibold text-gray-600">
                  Cargando...
                </div>
              ) : (
                selectedBoarding && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      <span className="text-blue-600">Embarque ID: </span>
                      {selectedBoarding.id}
                    </h2>

                    {/* Grid para detalles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-center">
                      {[
                        {
                          label: "NumberBox",
                          value: selectedBoarding.numberBox,
                        },
                        {
                          label: "Fecha y Hora",
                          value: new Date(
                            selectedBoarding.dateTime
                          ).toLocaleString(),
                        },
                        { label: "ID Caja", value: selectedBoarding.boxId },
                        { label: "Operador", value: selectedBoarding.operator },
                        {
                          label: "Validador",
                          value: selectedBoarding.validator,
                        },
                        {
                          label: "Capturista",
                          value: selectedBoarding.capturist,
                        },
                        {
                          label: "Proveedor",
                          value: selectedBoarding.supplier,
                        },
                        { label: "Pallets", value: selectedBoarding.pallets },
                        {
                          label: "Comentarios",
                          value: selectedBoarding.comments,
                        },
                        {
                          label: "Perforaciones",
                          value: (
                            <span
                              className={
                                selectedBoarding.perforations
                                  ? "text-green-500 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {selectedBoarding.perforations ? "Sí" : "No"}
                            </span>
                          ),
                        },
                        {
                          label: "Documentación",
                          value: (
                            <span
                              className={
                                selectedBoarding.documentation
                                  ? "text-green-500 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {selectedBoarding.documentation ? "Sí" : "No"}
                            </span>
                          ),
                        },
                        {
                          label: "Seguridad",
                          value: (
                            <span
                              className={
                                selectedBoarding.security
                                  ? "text-green-500 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {selectedBoarding.security ? "Sí" : "No"}
                            </span>
                          ),
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg shadow-sm space-y-4"
                        >
                          {/* Label en la parte superior */}
                          <div className="space-y-1">
                            <span className="font-medium text-gray-600">
                              {item.label}
                            </span>
                          </div>

                          {/* Valor en la parte inferior */}
                          <div className="space-y-1">
                            <span className="text-gray-800 break-words">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dropdown de estado */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-lg font-semibold text-gray-600 mt-4 text-center"
                      >
                        Estado del Embarque
                      </label>
                      <select
                        id="status"
                        value={newStatus}
                        onChange={handleStatusChange}
                        className={`mt-2 p-3 border border-slate-300 rounded-md w-full text-center ${statusStyles[newStatus]}`}
                      >
                        {Object.keys(statusMapping).map((status) => (
                          <option key={status} value={status}>
                            {statusMapping[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )
              )}
            </Modal>
          </div>
        </div>
        {boardings.length === 0 && (
          <p className="flex justify-center mt-10">No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
}
