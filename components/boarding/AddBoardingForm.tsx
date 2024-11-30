"use client";

import { createBoarding } from "@/actions/create-boarding-action";
import { BoardingSchema } from "@/src/schema";
import { toast } from "react-toastify";

export default function AddBoardingForm({children}: {children: React.ReactNode}) {
  const handleSubmit = async (formData: FormData) => {
    
    const dateTimeRaw = formData.get("dateTime") as string;
    // Convierte `dateTime` a un formato ISO-8601 válido
    const dateTime = dateTimeRaw ? new Date(dateTimeRaw).toISOString() : null;

    const data = {
      numberBox: formData.get("numberBox"),
      dateTime: dateTime,
      boxId: formData.get("boxId"),
      operator: formData.get("operator"),
      validator: formData.get("validator"),
      capturist: formData.get("capturist"),
      supplier: formData.get("supplier"),
      pallets: formData.get("pallets"),
      comments: formData.get("comments"),
      perforations: formData.get("perforations") === "on",
      documentation: formData.get("documentation") === "on",
      security: formData.get("security") === "on",
    };

    const result = BoardingSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message)
      });
      return
    }
    const response = await createBoarding(result.data)
    if(response?.errors){
      response.errors.forEach((issue) => {
        toast.error(issue.message)
      });
      return
    }

    toast.success('Embarque Creado Correctamente')
  }

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
