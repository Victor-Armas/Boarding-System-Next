"use server"
import { prisma } from "@/src/lib/prisma";
import { BoardingSchema } from "@/src/schema";
import { Boarding } from "@prisma/client";

// Función para actualizar un embarque en la base de datos
export async function updateBoarding(boardingId: number, data: Boarding) {
  // Validamos los datos antes de proceder
  const result = BoardingSchema.safeParse(data);
  if (!result.success) {
    return {
      errors: result.error.issues,
    };
  }

  try {
    // Actualizamos el embarque en la base de datos usando el boardingId
    const updatedBoarding = await prisma.boarding.update({
      where: { id: boardingId },
      data: result.data,
    });

    // Retornamos el embarque actualizado
    return { updatedBoarding };
  } catch (error) {
    return {
      errors: [{ message: "Error al actualizar el embarque" }],
    };
  }
}
