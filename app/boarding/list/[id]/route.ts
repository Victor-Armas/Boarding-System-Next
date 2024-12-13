import { prisma } from "@/src/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

   // Asegurarse de que el ID es un número válido
   const parsedId = parseInt(id, 10);
   if (isNaN(parsedId)) {
     return new Response('ID inválido', { status: 400 });
   }
  
    try {
      // Verificar si el ID está presente
      if (!id) {
        return Response.json(
          { error: "Se requiere un ID válido para eliminar el registro." },
          { status: 400 }
        );
      }
  
      // Intentar eliminar el registro
      const deletedBoarding = await prisma.boarding.delete({
        where: { id: parsedId }, // Convierte el ID a un número si es necesario
      });
  
      // Responder con el registro eliminado
      return Response.json(deletedBoarding, { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Prisma podría lanzar un error si no encuentra el registro
        if (error.message.includes("Record to delete does not exist")) {
          return Response.json(
            { error: "No se encontró el registro con el ID proporcionado." },
            { status: 404 }
          );
        }
  
        return Response.json({ error: error.message }, { status: 500 });
      }
  
      // Error desconocido
      return Response.json(
        { error: "Ocurrió un error al intentar eliminar el registro." },
        { status: 500 }
      );
    }
  }