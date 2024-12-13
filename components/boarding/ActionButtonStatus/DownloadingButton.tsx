import { BoardingDetails } from "@/src/types";
import ActionButtonUnloadingStatus from "../ActionButtonUnloadingStatus";
import ActionModal from "../ActionModal";
import { useState } from "react";
import useSWR from "swr";
import {ForkliftOperator} from "@prisma/client";
import { toast } from "react-toastify";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";
import { useUserRole } from "@/src/utils/useUserRole";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  return response.json();
};


export default function DownloadingButton({ boarding }: { boarding: BoardingDetails }) {
  const { role } = useUserRole();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedForkliftOperator, setSelectedForkliftOperator] = useState<ForkliftOperator["id"] | null>(null);
  const [downloadEndDate, setDownloadEndDate] = useState<string>("");

  const { data, error, isLoading } = useSWR<ForkliftOperator[]>(
    "/boarding/unloading-status/api?type=downloadings",
    fetcher
  );

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleFinishDownload = async () => {
    if (role === "BUYER") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    if (boarding.forkliftOperatorId === null && !selectedForkliftOperator ) {
      toast.info("Por favor, seleccione un operador");
      return;
    }

    if (!downloadEndDate) {
      toast.info("Por favor, complete las fechas requeridas");
      return;
    }
    try {

      const formattedDownloadEndDate = convertTimeToMonterrey(new Date(downloadEndDate));


      const response = await fetch("/boarding/unloading-status/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignDownloading",
          boardingId: boarding.id,
          forkliftOperatorId: selectedForkliftOperator,
          downloadEndDate: formattedDownloadEndDate,
          rampId: boarding.rampId
        }),
      });

      

      if (!response.ok) throw new Error("Error al finalizar la descarga");
      toast.success("Descarga finalizada exitosamente");
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
        color="blue"
        label="Finalizar Descarga"
        onClick={() => setModalOpen(true)}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Asignar Validador"
        size= "max-w-xl"
      >
        <div className="space-y-6 px-6 py-4">
          <p className="text-lg text-gray-600 font-medium">
            -Asigné un validador y las horas a la caja:{" "}
            <span className="font-semibold text-indigo-600">
              {boarding.boxNumber}
            </span>
            <br />-Rampa actual: {" "}
            <span className="font-semibold text-indigo-600">{boarding.ramp?.nameRamp}</span>
          </p>

          {boarding.forkliftOperatorId === null && data && data.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Listado de montacarguista:</label>
              <select
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedForkliftOperator || ""}
                onChange={(e) => setSelectedForkliftOperator(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona un Montacarguista</option>
                {data?.map((ForkliftOperator: ForkliftOperator) => (
                  <option key={ForkliftOperator.id} value={ForkliftOperator.id}>
                    {ForkliftOperator.name}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* hora fin descarga */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="downloadEndDate">
              Fin de la descarga:
            </label>
            <input
              id="downloadEndDate"
              type="datetime-local"
              name="downloadEndDate"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={downloadEndDate}
              onChange={handleDateChange(setDownloadEndDate)}
            />
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleFinishDownload}
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
