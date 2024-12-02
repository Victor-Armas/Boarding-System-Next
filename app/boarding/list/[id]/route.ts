// app/api/boarding/[id]/route.ts
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Acceder correctamente a los parámetros
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Asegúrate de que params sea resuelto antes de usarlo
  const { id } = await params;  // Aquí, debes usar await al acceder a params

  try {
    const boarding = await prisma.boarding.findUnique({
      where: { id: Number(id) },
    });

    if (!boarding) {
      return NextResponse.json({ error: "Embarque no encontrado" }, { status: 404 });
    }

    return NextResponse.json(boarding);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el embarque" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Asegúrate de que params sea resuelto antes de usarlo
  const { id } = await params;  // Aquí, debes usar await al acceder a params
  const { status } = await request.json();

  try {
    const updatedBoarding = await prisma.boarding.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedBoarding);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    // Convertir el ID a número (si es necesario)
    const boardingId = parseInt(id, 10);

    // Eliminar el registro en la base de datos
    const deletedBoarding = await prisma.boarding.delete({
      where: { id: boardingId },
    });

    // Responder con el registro eliminado
    return NextResponse.json({ message: "Registro eliminado", deletedBoarding }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando el registro:", error);


    // Responder con un error genérico
    return NextResponse.json({ message: "Error eliminando el registro" }, { status: 500 });
  }
}