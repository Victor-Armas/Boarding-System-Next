"use server";

import { prisma } from "@/src/lib/prisma";
import { AddBoarding } from "@/src/schema";

export async function createBoarding(data: any) {
  const result = AddBoarding.safeParse(data);

  if (!result.success) {
    return { errors: result.error.issues };
  }

  const boardingData = {
    boxNumber: result.data.boxNumber,
    arrivalDate: new Date(result.data.arrivalDate),
    boxType: result.data.boxType,
    supplierId: result.data.supplierId,
    rampId: result.data.rampId,
    comments: result.data.comments,
    status: result.data.status,
    downloadStartDate: result.data.downloadStartDate ? new Date(result.data.downloadStartDate) : null,
    timeUntilRamp: result.data.timeUntilRamp,
  };

  try {
    await prisma.$transaction(async (prisma) => {
      // Crear el boarding
      await prisma.boarding.create({
        data: boardingData,
      });

      // Actualizar la rampa seleccionada
      if (boardingData.rampId) {
        await prisma.ramp.update({
          where: { id: boardingData.rampId },
          data: { isOccupied: true },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error creando boarding o actualizando rampa:", error);
    return { error: "Error al crear el boarding o actualizar la rampa." };
  }
}
