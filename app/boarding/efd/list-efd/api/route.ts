import { BoardingEFDWhereInput } from "@/src/types";
import { EfdStatus, PrismaClient } from "@prisma/client";


export async function GET(req: Request) {
    // Obtener los parámetros de consulta
    const prisma = new PrismaClient();
    const url = new URL(req.url);
    const crateEfdDate = url.searchParams.get("crateEfdDate");
    const supplier = url.searchParams.get("supplier");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const where: BoardingEFDWhereInput = {
        status: undefined,
        crateEfdDate: undefined,
        supplier: undefined,
    };


    if (crateEfdDate) {
        const startDate = new Date(crateEfdDate);
        const endDate = new Date(crateEfdDate);
        endDate.setDate(endDate.getDate() + 1); // Suma un día para incluir todo el rango de la fecha

        where.crateEfdDate = {
            gte: startDate,
            lt: endDate, // Menor que el día siguiente
        };
    }

    if (supplier) {
        where.supplier = { name: { contains: supplier, mode: "insensitive" } }; // Búsqueda parcial
    }
    if (status && Object.values(EfdStatus).includes(status as EfdStatus)) {
        where.status = status as EfdStatus;
    }
    try {

        // Obtener datos con filtros y paginación
        const listEfd = await prisma.boardingEfd.findMany({
            where: where,
            orderBy: { crateEfdDate: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                crateEfdDate: true,
                material: true,
                invoiceNumber: true,
                asnNumber: true,
                responsible: true,
                description: true,
                status: true,
                ProblemTypeEfd: {
                    select: {
                        name: true,
                    },
                },
                supplier: {
                    select: {
                        name: true,
                    },
                },
                buyer: {
                    select: {
                        name: true,
                    },
                },
                boarding: {
                    select: {
                        boxNumber: true,
                    },
                },
            },
        });

        // Obtener el total de elementos para calcular las páginas
        const totalItems = await prisma.boardingEfd.count({ where: where });
        const totalPages = Math.ceil(totalItems / pageSize);

        // Responder con los datos paginados
        return new Response(
            JSON.stringify({ listEfd, page, pageSize, totalItems, totalPages }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error al obtener los datos" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
