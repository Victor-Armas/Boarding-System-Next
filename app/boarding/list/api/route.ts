import { BoardingWhereInput } from "@/src/types";
import { PrismaClient} from '@prisma/client';

const BoardingStatus = {
    PENDING_DOWNLOAD: "PENDING_DOWNLOAD",
    DOWNLOADING: "DOWNLOADING",
    VALIDATING: "VALIDATING",
    CAPTURING: "CAPTURING",
    COMPLETED: "COMPLETED",
  } as const;
  
  export type BoardingStatus = (typeof BoardingStatus)[keyof typeof BoardingStatus];

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const prisma = new PrismaClient();
    const url = new URL(request.url);
    const boxNumber = url.searchParams.get("boxNumber");
    const arrivalDate = url.searchParams.get("arrivalDate");
    const supplierName = url.searchParams.get("supplier");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 10;

    const where: BoardingWhereInput = {};

    if (boxNumber) where.boxNumber = { contains: boxNumber, mode: "insensitive" }; // Filtrado parcial
    if (arrivalDate) where.arrivalDate = new Date(arrivalDate);
    if (supplierName) where.supplier = { name: { contains: supplierName, mode: "insensitive",} };

    // Validar y asignar el valor del estado si está presente
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
        console.log("Error fetching boarding records:", error);
        return new Response("Error fetching data", { status: 500 });
    }
}
