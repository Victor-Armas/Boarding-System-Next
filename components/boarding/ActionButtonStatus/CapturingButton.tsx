import { useState } from "react";
import ActionButtonUnloadingStatus from "../ActionButtonUnloadingStatus";
import { BoardingDetails } from "@/src/types";
import ActionModal from "../ActionModal";
import { Assistant } from "@prisma/client";
import useSWR from "swr";
import { toast } from "react-toastify";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";
import { useUserRole } from "@/src/utils/useUserRole";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  return response.json();
};

export default function CapturingButton({ boarding }: { boarding: BoardingDetails }) {
  const { role } = useUserRole();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant["id"] | null>(null);
  const [captureStartDate, setCaptureStartDate] = useState<string>("");
  const [captureEndDate, setCaptureEndDate] = useState<string>("");

  const { data, error, isLoading } = useSWR<Assistant[]>(
    "/boarding/unloading-status/api?type=assistant",
    fetcher
  );

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleCaptureData = async() => {
    if (role === "BUYER") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    if (!selectedAssistant || !captureStartDate || !captureEndDate) {
      toast.info("Por favor, complete los datos solicitados");
      return;
    }

    if(captureStartDate >= captureEndDate){
      toast.error("La hora y fecha de Inicio no puede ser mayor o igual a la hora y fecha final");
      return;
    }

    try {

      const formattedcaptureStartDate = convertTimeToMonterrey(new Date(captureStartDate));
      const formattedcaptureEndDate = convertTimeToMonterrey(new Date(captureEndDate));
      const completedDate = convertTimeToMonterrey(new Date());

      const response = await fetch("/boarding/unloading-status/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "completeBoarding",
          boardingId: boarding.id,
          assistantId: selectedAssistant,
          captureStartDate: formattedcaptureStartDate,
          captureEndDate: formattedcaptureEndDate,
          completedDate: completedDate
        }),
      });

      if (!response.ok) throw new Error("Error al finalizar la captura");
      toast.success("Captura finalizada exitosamente");
      setModalOpen(false);
      
    } catch (error) {
      console.log(error)
    }


  };

  if (isLoading) return <div className="text-center text-lg text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error al cargar datos</div>;

  return (
    <div className="relative">
      <ActionButtonUnloadingStatus
        color="green"
        label="Finalizar Datos"
        onClick={() => setModalOpen(true)}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Completar Captura"
        size= "max-w-xl"
      >
        <div className="space-y-6 px-6 py-4">
          <p className="text-lg text-gray-600 font-medium">
            -Termine la captura de la caja:{" "}
            <span className="font-semibold text-indigo-600">
              {boarding.boxNumber}
            </span>

          </p>
          {/* Listado de capturista */}

          {data && data.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Listado de Capturista:</label>
              <select
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedAssistant || ""}
                onChange={(e) => setSelectedAssistant(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona un capturista</option>
                {data?.map((assistant: Assistant) => (
                  <option key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>
          )}



           {/* hora fin descarga */}
           <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="captureStartDate">
              Inicio de la Captura:
            </label>
            <input
              id="captureStartDate"
              type="datetime-local"
              name="captureStartDate"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={captureStartDate}
              onChange={handleDateChange(setCaptureStartDate)}
            />
          </div>

          {/* hora Inicio validacion */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="captureEndDate">
              Fin de la Captura:
            </label>
            <input
              id="captureEndDate"
              type="datetime-local"
              name="captureEndDate"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={captureEndDate}
              onChange={handleDateChange(setCaptureEndDate)}
            />
          </div>


          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleCaptureData}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Confirmar
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </ActionModal>

    </div>


  );
}