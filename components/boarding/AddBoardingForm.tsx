"use client";

import { createBoarding } from "@/actions/create-boarding-action";
import { AddBoarding } from "@/src/schema";
import { convertTimeToMonterrey } from "@/src/utils/convertTimeToMonterrey";
import { toast } from "react-toastify";
import { mutate } from "swr"; // Asegúrate de importar mutate

export default function AddBoardingForm({ children }: { children: React.ReactNode }) {
  
  const handleSubmit = async (formData: FormData) => {
    const dateTimeRaw = formData.get("arrivalDate") as string;
  
    // Asegurarse de que la fecha no sea nula ni inválida
    const dateTimeObj = dateTimeRaw ? new Date(dateTimeRaw) : undefined;
  
    // Verificar si la fecha es válida
    if (!dateTimeObj || isNaN(dateTimeObj.getTime())) {
      toast.error("La fecha de llegada es inválida.");
      return;
    }
  
    // Convertir la fecha a Monterrey (si es necesario)
    const dateTime = convertTimeToMonterrey(dateTimeObj);
  
    const rampIdRaw = formData.get("ramp");
    const rampId = rampIdRaw === "" ? null : parseInt(rampIdRaw as string, 10);
  
    const data = {
      boxNumber: formData.get("boxNumber"),
      arrivalDate: dateTime, // Aquí la fecha no será null
      boxType: formData.get("boxType"),
      supplierId: parseInt(formData.get("supplier") as string, 10),
      rampId,
      comments: formData.get("comments"),
      status: rampId ? "DOWNLOADING" : "PENDING_DOWNLOAD",
      downloadStartDate: rampId ? dateTime : null,
      timeUntilRamp: rampId ? 0 : null,
    };
  
    const result = AddBoarding.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }
  
    try {
      const response = await createBoarding(result.data);
      if (response?.errors) {
        response.errors.forEach((issue) => toast.error(issue.message));
        return;
      }
  
      if (rampId) {
        mutate("/boarding/create/api");
      }
  
      toast.success("Embarque Creado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md">
        <form action={handleSubmit}>
          {children}
          <input
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white w-full mt-10 p-3 uppercase font-bold cursor-pointer"
            value="Registrar Embarque"
          />
        </form>
      </div>
    </>
  );
}
