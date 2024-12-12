import { BoardingDetails } from "@/src/types";
import ActionButtonUnloadingStatus from "../ActionButtonUnloadingStatus";
import { useState } from "react";
import ActionModal from "../ActionModal";
import { Assistant, Boarding, Validator } from "@prisma/client";
import useSWR from "swr";
import { toast } from "react-toastify";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";
import { useUserRole } from "@/src/utils/useUserRole";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener datos");
  return response.json();
};


export default function ValidatingButton({ boarding }: { boarding: BoardingDetails }) {
  const { role } = useUserRole();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator["id"] | null>(null);
  const [validationStartDate, setValidationStartDate] = useState<string>("");
  const [validationEndDate, setvalidationEndDate] = useState<string>("");
  const [pallets, setPallets] = useState<number>(0);

  const { data, error, isLoading } = useSWR<Validator[]>(
    "/boarding/unloading-status/api?type=validation",
    fetcher
  );



  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
  };

  const handlePalletsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPallets(isNaN(value) ? 0 : value);
  };


  const handleApprove = async () => {
    if (role === "BUYER") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    if (!selectedValidator || !validationEndDate || !validationStartDate || !pallets) {
      toast.info("Por favor, complete la información requerida");
      return;
    }

    if(validationStartDate >= validationEndDate){
      toast.error("La hora y fecha de Inicio no puede ser mayor o igual a la hora y fecha final");
      return;
    }

    try {

      const formattedvalidationEndDate = convertTimeToMonterrey(new Date(validationEndDate));
      const formattedvalidationStartDate = convertTimeToMonterrey(new Date(validationStartDate));

      const response = await fetch("/boarding/unloading-status/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validator",
          boardingId: boarding.id,
          validatorId: selectedValidator,
          validationStartDate: formattedvalidationStartDate,
          validationEndDate: formattedvalidationEndDate,
          pallets: pallets
        }),
      });

      if (!response.ok) throw new Error("Error al finalizar la validación");
      toast.success("Validación finalizada exitosamente");
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
        color="purple"
        label="Finalizar Validación"
        onClick={() => setModalOpen(true)}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Finalizar Validación"
        size= "max-w-xl"
      >
        <div className="space-y-6 px-6 py-4">
          <p className="text-lg text-gray-600 font-medium">
            -Termine la validación de la caja:{" "}
            <span className="font-semibold text-indigo-600">
              {boarding.boxNumber}
            </span>

          </p>

          {data && data.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-800">Listado de Validadores:</label>
              <select
                className="mt-2 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedValidator || ""}
                onChange={(e) => setSelectedValidator(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona un validador</option>
                {data?.map((validator: Validator) => (
                  <option key={validator.id} value={validator.id}>
                    {validator.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cantidad de Pallets */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="pallets">
              Cantidad de Pallets:
            </label>
            <input
              id="pallets"
              type="number"
              name="pallets"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={pallets}
              onChange={handlePalletsChange}
              min={1}
            />
          </div>

           {/* hora inicio descarga */}

           <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="validationStartDate">
              Inicio de la Validación:
            </label>
            <input
              id="validationStartDate"
              type="datetime-local"
              name="validationStartDate"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={validationStartDate}
              onChange={handleDateChange(setValidationStartDate)}
            />
          </div>


          {/* hora fin descarga */}

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-800" htmlFor="validationEndDate">
              Fin de la Validación:
            </label>
            <input
              id="validationEndDate"
              type="datetime-local"
              name="validationEndDate"
              className="block w-full mt-2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={validationEndDate}
              onChange={handleDateChange(setvalidationEndDate)}
            />
          </div>


          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleApprove}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </ActionModal>

    </div>
  );
}
