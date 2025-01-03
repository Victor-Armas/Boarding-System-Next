

import { prisma } from "@/src/lib/prisma";
export async function GET() {
  try {
    // Realiza las consultas en paralelo para obtener rampas, proveedores y compradores
    const [suppliers, buyers, boardings, problemTypeEfd] = await Promise.all([
      prisma.supplier.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.user.findMany({
        where: {
          role: 'BUYER', // Asegúrate de que los compradores sean del rol correcto
          isActive: true, // Solo compradores activos
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.boarding.findMany({
          orderBy: {
            arrivalDate: 'desc'
          }
      }),
      prisma.problemTypeEfd.findMany({
        orderBy: {
          id: 'asc'
        }
      })
    ]);

    // Devuelve los datos obtenidos en un solo objeto
    return Response.json({
      suppliers,
      buyers,
      boardings,
      problemTypeEfd
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Error fetching data' }, { status: 500 });
  }
}