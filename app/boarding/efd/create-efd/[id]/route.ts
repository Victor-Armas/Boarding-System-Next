import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID no proporcionado en la ruta." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const boarding = await prisma.boarding.findUnique({
      where: { id: Number(id) },
    });

    if (!boarding) {
      return new Response(
        JSON.stringify({ error: "Registro no encontrado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        id: boarding.id,
        boxNumber: boarding.boxNumber,
        arrivalDate: boarding.arrivalDate,
        description: boarding.comments,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
