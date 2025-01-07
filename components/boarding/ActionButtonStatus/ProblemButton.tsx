import React, { useState } from "react";
import useSWR from "swr";
import ActionModal from "../ActionModal";
import ActionButtonUnloadingStatus from "../ActionButtonUnloadingStatus";
import { toast } from "react-toastify";
import { BoardingDetails, ProblemBoardingList } from "@/src/types";
import { statusMapping, statusStylesProblem } from "@/src/utils/traductions";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  return response.json();
};

export default function ProblemButton({ boarding, state }: { boarding: BoardingDetails; state: string }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  // Cargar los problemas relacionados con el estado usando SWR
  const { data: problems, error, isLoading } = useSWR(`/boarding/unloading-status/api?type=problems&state=${state}`, fetcher);

  // Cargar los problemas activos del embarque
  const { data: boardingIssues, error: boardingIssuesError, mutate: mutateBoardingIssues } = useSWR(
    `/boarding/unloading-status/api?type=boardingIssues&boardingId=${boarding.id}`,
    fetcher
  );

  const problemTypeId = selectedProblem ? parseInt(selectedProblem, 10) : null;


  // ****** REPORTAR PROBLEMA *******
  const handleReportProblem = async () => {
    if (!selectedProblem || !description.trim()) {
      toast.info("Por favor, selecciona un problema y agrega una descripción.");
      return;
    }

    try {
      const response = await fetch("/boarding/unloading-status/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reportProblem",
          boardingId: boarding.id,
          problemTypeId: problemTypeId,
          description,
        }),
      });

      if (response.ok) {
        setSelectedProblem(null);
        setDescription("");
        toast.success("Problema reportado exitosamente.");
        mutateBoardingIssues(); 
      } else {
        toast.error("Error al reportar el problema.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar los datos.");
    }
  };

  // ****** RESOLVER PROBLEMA *******
  const handleMarkAsResolved = async (issueId: number) => {
    try {
      const response = await fetch("/boarding/unloading-status/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolveProblem",
          issueId,
        }),
      });

      if (response.ok) {
        toast.success("Problema resuelto.");
        mutateBoardingIssues(); // Refrescar el listado
      } else {
        toast.error("Error al marcar el problema como resuelto.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado del problema.");
    }
  };

  if (isLoading || !boardingIssues) return <div className="text-center text-lg text-gray-400">Cargando...</div>;
  if (error || boardingIssuesError)
    return <div className="text-center text-lg text-red-500">Error al cargar los datos.</div>;

  return (
    <div className="relative">
      {/* Botón para abrir el modal */}
      <ActionButtonUnloadingStatus
        color="red"
        label="Reportar"
        onClick={() => setModalOpen(true)}
      />


      {/* Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Reporte de Problemas"
        size="max-w-5xl" // Ajustamos el tamaño del modal para que soporte dos columnas
      >
        {/* Contenedor principal en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-4">
          {/* Columna izquierda: Formulario */}
          <div>
            <p className="text-lg text-gray-600 font-medium">
              Reportar un problema para la caja:{" "}
              <span className="font-semibold text-indigo-600">{boarding.boxNumber}</span>.
            </p>

            {problems?.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Seleccionar problema:
                </label>
                <select
                  className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={selectedProblem || ""}
                  onChange={(e) => setSelectedProblem(e.target.value)}
                >
                  <option value="" disabled>Selecciona un problema</option>
                  {problems.map((problem: { id: string; name: string }) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Descripción:</label>
              <textarea
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleReportProblem}
                className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Reportar
              </button>
            </div>
          </div>

           {/* Columna derecha: Listado de problemas del embarque */}
           <div className="overflow-y-auto max-h-96 space-y-4">
            {boardingIssues.length > 0 ? (
              boardingIssues.map((issue: ProblemBoardingList) => (
                <div
                  key={issue.id}
                  className={`p-4 border rounded-lg shadow-sm flex justify-between items-center ${
                    issue.resolved ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <div>
                    <p className="text-gray-800 font-medium">{issue.problemType.name}</p>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className={`text-sm ${statusStylesProblem[issue.state]}`}>{statusMapping[issue.state]}</p>
                    <p className="text-xs text-gray-500">Reportado: {new Date(issue.createdAt).toLocaleString()}</p>
                  </div>
                  {!issue.resolved && (
                    <button
                      onClick={() => handleMarkAsResolved(issue.id)}
                      className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                    >
                      ✔ Resolver
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No hay problemas activos para este embarque.</p>
            )}
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
