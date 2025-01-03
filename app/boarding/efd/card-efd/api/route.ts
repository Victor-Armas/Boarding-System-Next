// Archivo backend: boarding/efd/card-efd/api/route.ts

import { prisma } from "@/src/lib/prisma";
import { UpdateStatusEfdSchema, EditEfdBoarding } from "@/src/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await prisma.boardingEfd.findMany({
      include: {
        boarding: true,
        buyer: true,
        ProblemTypeEfd: true,
      },
      orderBy: {
        id: 'asc'
      },
      where: {
        status: {
          not: 'COMPLETED'
        }
      }
    });

    return Response.json(records);
  } catch (error) {
    console.error("Error fetching BoardingEfd records:", error);
    return Response.json({ error: "Error fetching records" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "updateStatus") {
      // Validación y lógica para la acción "updateStatus"
      const parsedData = UpdateStatusEfdSchema.safeParse(body);
      if (!parsedData.success) {
        return Response.json({ errors: parsedData.error.issues }, { status: 400 });
      }
      const { id, status, daysElapsed } = parsedData.data;
      const updatedRecord = await prisma.boardingEfd.update({
        where: { id },
        data: { status, daysElapsed },
      });
      return Response.json(updatedRecord);
    }

    if (body.action === "editCard") {
      // Validación y lógica para la acción "editCard"
      const parsedData = EditEfdBoarding.safeParse(body);
      if (!parsedData.success) {
        return Response.json({ errors: parsedData.error.issues }, { status: 400 });
      }
      const { id, ...updateData } = parsedData.data;
      const updatedRecord = await prisma.boardingEfd.update({
        where: { id },
        data: updateData,
      });
      return Response.json(updatedRecord);
    }

    return Response.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error en PATCH:", error);
    return Response.json({ error: "Error en la solicitud" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
      const { id } = await request.json();

      if (!id) {
          return Response.json({ error: "ID es requerido" }, { status: 400 });
      }

      // Eliminar el registro en la base de datos
      await prisma.boardingEfd.delete({
          where: { id: Number(id) },
      });

      return Response.json({ message: "Registro eliminado con éxito" });
  } catch (error) {
      console.error("Error eliminando registro:", error);
      return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}