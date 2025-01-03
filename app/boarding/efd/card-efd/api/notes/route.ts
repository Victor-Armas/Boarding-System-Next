import { prisma } from "@/src/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const boardingEfdId = searchParams.get("boardingEfdId");

    if (!boardingEfdId) {
      return new Response(
        JSON.stringify({ error: "BoardingEfdId es requerido" }),
        { status: 400 }
      );
    }

    // Obtener las notas con el autor y el BoardingEfd
    const notes = await prisma.noteEfd.findMany({
      where: { boardingEfdId: parseInt(boardingEfdId, 10) },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,    // Incluye los datos del autor (usuario)
      },
    });

    return new Response(JSON.stringify(notes));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching notes" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, boardingEfdId, userId } = body; // Aquí incluimos el authorId

    if (!content || !boardingEfdId || !userId) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos" }),
        { status: 400 }
      );
    }

    // Crear la nueva nota asociada al EFD y al usuario (autor)
    const note = await prisma.noteEfd.create({
      data: {
        content,
        boardingEfdId: parseInt(boardingEfdId, 10),
        authorId: parseInt(userId, 10), // Relación con el usuario autor
      },
    });

    return new Response(JSON.stringify(note));
  } catch (error) {
    console.error("Error creating note:", error);
    return new Response(
      JSON.stringify({ error: "Error creating note" }),
      { status: 500 }
    );
  }
}
