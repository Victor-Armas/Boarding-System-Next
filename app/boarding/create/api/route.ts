import { prisma } from "@/src/lib/prisma";
export const dynamic = "force-dynamic"; // Fuerza el renderizado dinámico

export async function GET() {
  try {
    // Realiza múltiples consultas en paralelo
    const [ramp, suppliers] =
      await Promise.all([
        prisma.ramp.findMany({
          where: {
            isOccupied: false
          },
          orderBy: {
            id: "asc", // Ordena por ID en orden ascendente
          },
        }),
        prisma.supplier.findMany({
          orderBy: {
            id: "asc",
          },
        }),
        
      ]);

    // Devuelve todos los resultados en un solo objeto JSON
    return Response.json({
      ramp,
      suppliers
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Error fetching data" }, { status: 500 });
  }
}
