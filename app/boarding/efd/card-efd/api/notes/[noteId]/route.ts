import { prisma } from "@/src/lib/prisma";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ noteId: string }>}) {
  const resolvedParams = await params;
    const { noteId } = resolvedParams;

    if (!noteId) {
      return new Response(
        JSON.stringify({ error: "ID no proporcionado en la ruta." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    try {
      // Verificar que el noteId es un número
      const id = parseInt(noteId, 10);
  
      if (isNaN(id)) {
        return new Response('Invalid note ID', { status: 400 });
      }
  
      // Eliminar la nota de la base de datos
      const deletedNote = await prisma.noteEfd.delete({
        where: { id },
      });
  
      // Devolver una respuesta de éxito
      return new Response(JSON.stringify(deletedNote), { status: 200 });
    } catch (error) {
      console.error("Error deleting note:", error);
      return new Response('Error al eliminar la nota', { status: 500 });
    }
  }
