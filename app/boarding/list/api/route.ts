import { BoardingWhereInput } from "@/src/types";
import { BoardingStatus, PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const prisma = new PrismaClient();
  const url = new URL(request.url);

  // Parámetros de búsqueda
  const boxNumber = url.searchParams.get("boxNumber");
  const arrivalDate = url.searchParams.get("arrivalDate");
  const supplierName = url.searchParams.get("supplier");
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // Construcción inicial del objeto `where` con valores predeterminados
  const where: BoardingWhereInput = {
    status: undefined,
    boxNumber: undefined,
    arrivalDate: undefined,
    supplier: undefined,
  };

  // Agregar condiciones dinámicamente
  if (boxNumber) {
    where.boxNumber = { contains: boxNumber, mode: "insensitive" };
  }

  if (arrivalDate) {
    const startDate = new Date(arrivalDate);
    const endDate = new Date(arrivalDate);
    endDate.setDate(endDate.getDate() + 1); // Suma un día para incluir todo el rango de la fecha
  
    where.arrivalDate = {
      gte: startDate,
      lt: endDate, // Menor que el día siguiente
    };
  }

  if (supplierName) {
    where.supplier = { name: { contains: supplierName, mode: "insensitive" } };
  }

  if (status && Object.values(BoardingStatus).includes(status as BoardingStatus)) {
    where.status = status as BoardingStatus;
  }

  try {
    const totalRecords = await prisma.boarding.count({ where });
    const data = await prisma.boarding.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { arrivalDate: "desc" },
      include: {
        supplier: true,
      },
    });

    return Response.json({
      data,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching boarding records:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}


