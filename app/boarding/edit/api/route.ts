// boarding/edit/api/route.ts
import { prisma } from "@/src/lib/prisma";
import { BoardingEdithType } from "@/src/types";

export async function GET() {
    try {
        // Ejecutar todas las consultas en paralelo usando Promise.all
        const [suppliers, forkliftOperators, validators, assistants, ramps] = await Promise.all([
            prisma.supplier.findMany(),
            prisma.forkliftOperator.findMany(),
            prisma.validator.findMany(),
            prisma.assistant.findMany(),
            prisma.ramp.findMany({ orderBy: { id: "asc" } }),
        ]);

        // Devolver todos los datos en un solo objeto
        return Response.json({
            suppliers,
            forkliftOperators,
            validators,
            assistants,
            ramps,
        });
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Ocurrio un error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const {
            id,
            boxNumber,
            arrivalDate,
            supplierId,
            forkliftOperatorId,
            validatorId,
            assistantId,
            pallets,
            comments,
            rampId,
            boxType,
        }: BoardingEdithType = body;

        // Validar que el ID y los datos necesarios estén presentes
        if (!id) {
            return Response.json(
                { error: "ID del embarque es necesario." },
                { status: 400 }
            );
        }

        // Actualizar el embarque en la base de datos
        const updatedBoarding = await prisma.boarding.update({
            where: { id },
            data: {
                boxNumber,
                arrivalDate,
                supplierId,
                forkliftOperatorId,
                validatorId,
                assistantId,
                pallets,
                comments,
                rampId,
                boxType,
            },
        });

        // Responder con el embarque actualizado
        return Response.json(updatedBoarding, { status: 200 });
    } catch (error: unknown) {
        // Manejo de errores
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json(
            { error: "Ocurrió un error desconocido al actualizar el embarque." },
            { status: 500 }
        );
    }
}
